import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { migrateStylesheet } from './index';

const MIGRATIONS = path.join(__dirname, '..', '..', 'migrations.json');

const THREE_X_OVERRIDE = `@use '@angular/material' as mat;
@use '@northgate/canopy-ui/themes' as canopy;
@use '@northgate/canopy-ui/tokens/typography' as t;

$mol-typography: mat.define-typography-config(
  $font-family: t.$cn-font-family,
  $display-4: mat.define-typography-level(56px, 64px, 400, $letter-spacing: -0.02em),
  $display-1: mat.define-typography-level(28px, 36px, 400),
  $headline: mat.define-typography-level(24px, 32px, 600),
  $title: mat.define-typography-level(20px, 28px, 600),
  $subheading-2: mat.define-typography-level(16px, 24px, 500),
  $subheading-1: mat.define-typography-level(14px, 22px, 500),
  $body-1: mat.define-typography-level(16px, 24px, 400),
  $button: mat.define-typography-level(14px, 20px, 600),
  $input: mat.define-typography-level(16px, 1.25, 400)
);

@include canopy.theme($typography: $mol-typography, $include-dark: false);
`;

describe('canopy-4-theme-mixin migration', () => {
  describe('migrateStylesheet', () => {
    it('renames every 2014 level to its Material 15 name', () => {
      const { content, changed } = migrateStylesheet(THREE_X_OVERRIDE);

      expect(changed).toBeTrue();
      expect(content).toContain('$headline-1: mat.define-typography-level(56px, 64px, 400, $letter-spacing: -0.02em)');
      expect(content).toContain('$headline-4: mat.define-typography-level(28px, 36px, 400)');
      expect(content).toContain('$headline-5: mat.define-typography-level(24px, 32px, 600)');
      expect(content).toContain('$headline-6: mat.define-typography-level(20px, 28px, 600)');
      expect(content).toContain('$subtitle-1: mat.define-typography-level(16px, 24px, 500)');
      expect(content).toContain('$subtitle-2: mat.define-typography-level(14px, 22px, 500)');
      expect(content).not.toMatch(/\$(display-\d|headline|title|subheading-\d)\s*:/);
    });

    it('keeps levels that exist in both systems and the theme include untouched', () => {
      const { content } = migrateStylesheet(THREE_X_OVERRIDE);

      expect(content).toContain('$font-family: t.$cn-font-family,');
      expect(content).toContain('$body-1: mat.define-typography-level(16px, 24px, 400)');
      expect(content).toContain('$button: mat.define-typography-level(14px, 20px, 600)');
      expect(content).toContain('@include canopy.theme($typography: $mol-typography, $include-dark: false);');
    });

    it('drops $input and reports it', () => {
      const { content, removedLevels } = migrateStylesheet(THREE_X_OVERRIDE);

      expect(removedLevels).toEqual(['input']);
      expect(content).not.toContain('$input');
      expect(content).toContain('$button: mat.define-typography-level(14px, 20px, 600)\n);');
    });

    it('collapses $body-2 onto $subtitle-1 and keeps $subheading-2 when both are given', () => {
      const source = `$t: mat.define-typography-config(
  $subheading-2: mat.define-typography-level(16px, 24px, 500),
  $body-2: mat.define-typography-level(16px, 24px, 500)
);`;

      const { content, droppedDuplicates } = migrateStylesheet(source);

      expect(droppedDuplicates).toEqual(['body-2']);
      expect(content).toBe(`$t: mat.define-typography-config(
  $subheading-2: mat.define-typography-level(16px, 24px, 500)
);`.replace('$subheading-2', '$subtitle-1'));
    });

    it('maps a lone 3.x $body-2 onto $subtitle-1', () => {
      const source = `$t: mat.define-typography-config($title: mat.define-typography-level(20px, 28px, 600), $body-2: mat.define-typography-level(16px, 24px, 500));`;

      expect(migrateStylesheet(source).content)
        .toBe(`$t: mat.define-typography-config($headline-6: mat.define-typography-level(20px, 28px, 600), $subtitle-1: mat.define-typography-level(16px, 24px, 500));`);
    });

    it('leaves a config that already uses Material 15 names alone', () => {
      const source = `$ks-typography: mat.define-typography-config(
  $font-family: 'Source Sans 3',
  $button: mat.define-typography-level(15px, 36px, 600),
  $body-1: mat.define-typography-level(16px, 24px, 400),
  $body-2: mat.define-typography-level(14px, 20px, 400)
);`;

      const result = migrateStylesheet(source);

      expect(result.changed).toBeFalse();
      expect(result.content).toBe(source);
    });

    it('leaves define-legacy-typography-config calls alone', () => {
      const source = `$legacy: mat.define-legacy-typography-config(
  $button: mat.define-typography-level(15px, 36px, 600),
  $input: mat.define-typography-level(16px, 1.125, 400)
);`;

      const result = migrateStylesheet(source);

      expect(result.changed).toBeFalse();
      expect(result.removedLevels).toEqual([]);
    });
  });

  describe('schematic', () => {
    let runner: SchematicTestRunner;
    let tree: UnitTestTree;

    beforeEach(() => {
      runner = new SchematicTestRunner('canopy-migrations', MIGRATIONS);
      tree = new UnitTestTree(new HostTree());
      tree.create('src/styles.scss', THREE_X_OVERRIDE);
      tree.create('src/app/thing/thing.component.scss', '.thing { $x: mat.define-typography-config($title: 1); }');
      tree.create('src/unrelated.scss', '.x { color: red; }');
      tree.create('node_modules/@northgate/canopy-ui/styles/lib/themes/_typography.scss', '$display-4: 1;');
      tree.create('src/notes.md', 'mat.define-typography-config($title: 1)');
    });

    it('rewrites every SCSS file that configures typography', async () => {
      const result = await runner.runSchematicAsync('canopy-4-theme-mixin', {}, tree).toPromise();

      expect(result.readContent('src/styles.scss')).toContain('$headline-1:');
      expect(result.readContent('src/styles.scss')).not.toContain('$input');
      expect(result.readContent('src/app/thing/thing.component.scss')).toBe('.thing { $x: mat.define-typography-config($headline-6: 1); }');
    });

    it('does not touch unrelated files, node_modules or non-SCSS files', async () => {
      const result = await runner.runSchematicAsync('canopy-4-theme-mixin', {}, tree).toPromise();

      expect(result.readContent('src/unrelated.scss')).toBe('.x { color: red; }');
      expect(result.readContent('node_modules/@northgate/canopy-ui/styles/lib/themes/_typography.scss')).toBe('$display-4: 1;');
      expect(result.readContent('src/notes.md')).toBe('mat.define-typography-config($title: 1)');
    });

    it('is idempotent', async () => {
      const once = await runner.runSchematicAsync('canopy-4-theme-mixin', {}, tree).toPromise();
      const first = once.readContent('src/styles.scss');
      const twice = await runner.runSchematicAsync('canopy-4-theme-mixin', {}, once).toPromise();

      expect(twice.readContent('src/styles.scss')).toBe(first);
    });
  });
});
