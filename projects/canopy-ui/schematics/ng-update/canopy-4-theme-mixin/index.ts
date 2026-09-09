import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * `ng update @northgate/canopy-ui` migration for 4.0.0 (CNPY-2140).
 *
 * Canopy 4 themes Angular Material 15, whose `mat.define-typography-config` takes the Material
 * Design 2018 level names. Consumers that override the Canopy type scale (a `$typography` map
 * handed to `canopy.theme(...)`, or a `define-typography-config` built from Canopy tokens) still
 * name the levels after the 2014 system Canopy 3.x used. This migration rewrites those names in
 * every SCSS file of the workspace, using the same mapping Canopy applied to its own scale, so the
 * rendered metrics do not move (see projects/canopy-ui/src/lib/themes/_typography.scss and
 * docs/MIGRATION-4.0.md).
 */

/** 2014 -> 2018 level names. */
export const TYPOGRAPHY_LEVEL_RENAMES: ReadonlyArray<[string, string]> = [
  ['display-4', 'headline-1'],
  ['display-3', 'headline-2'],
  ['display-2', 'headline-3'],
  ['display-1', 'headline-4'],
  ['headline', 'headline-5'],
  ['title', 'headline-6'],
  ['subheading-2', 'subtitle-1'],
  ['subheading-1', 'subtitle-2'],
  ['body-2', 'subtitle-1']
];

/** Levels that have no counterpart in the 2018 system. */
export const REMOVED_TYPOGRAPHY_LEVELS: ReadonlyArray<string> = ['input'];

/**
 * Names that only exist in the 2014 system. `$body-2`, `$body-1`, `$caption` and `$button` exist in
 * both, so a config is only treated as a 3.x one when it uses at least one of these.
 */
const UNAMBIGUOUS_2014_LEVELS: ReadonlyArray<string> = [
  ...TYPOGRAPHY_LEVEL_RENAMES.map(([from]) => from).filter(name => name !== 'body-2'),
  ...REMOVED_TYPOGRAPHY_LEVELS
];

// The leading character class keeps `define-legacy-typography-config(` (a consumer's own
// legacy-component config, which still takes the 2014 names) out of the match.
const CONFIG_CALL = /(?:^|[^-\w])define-typography-config\s*\(/;

export interface MigrationResult {
  content: string;
  changed: boolean;
  removedLevels: string[];
  droppedDuplicates: string[];
}

/** Returns the argument list of every `define-typography-config(` call in `source`. */
function findConfigCalls(source: string): Array<{ start: number; end: number }> {
  const calls: Array<{ start: number; end: number }> = [];
  const pattern = new RegExp(CONFIG_CALL.source, 'g');
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    const open = match.index + match[0].length - 1;
    let depth = 0;
    for (let i = open; i < source.length; i++) {
      if (source[i] === '(') {
        depth++;
      } else if (source[i] === ')') {
        depth--;
        if (depth === 0) {
          calls.push({ start: open + 1, end: i });
          break;
        }
      }
    }
  }
  return calls;
}

/** Splits an argument list on top-level commas, keeping the separators so it can be re-joined. */
function splitArguments(args: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of args) {
    if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth--;
    }
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

function argumentName(argument: string): string | null {
  const match = /^\s*\$([\w-]+)\s*:/.exec(argument);
  return match ? match[1] : null;
}

function renameArgument(argument: string, to: string): string {
  return argument.replace(/^(\s*)\$[\w-]+(\s*:)/, `$1$${to}$2`);
}

/** Rewrites one `define-typography-config(...)` argument list. */
export function migrateTypographyArguments(args: string): { args: string; removed: string[]; dropped: string[] } {
  const parts = splitArguments(args);
  const names = parts.map(argumentName);
  const removed: string[] = [];
  const dropped: string[] = [];
  const keep: string[] = [];
  const seen = new Set<string>();

  if (!names.some(name => name !== null && UNAMBIGUOUS_2014_LEVELS.includes(name))) {
    return { args, removed, dropped };
  }

  parts.forEach((part, index) => {
    const name = names[index];
    if (name === null) {
      keep.push(part);
      return;
    }
    if (REMOVED_TYPOGRAPHY_LEVELS.includes(name)) {
      removed.push(name);
      return;
    }
    const rename = TYPOGRAPHY_LEVEL_RENAMES.find(([from]) => from === name);
    const target = rename ? rename[1] : name;
    if (seen.has(target)) {
      // Two 3.x levels collapse onto one 4.0 level (`subheading-2` and `body-2` -> `subtitle-1`);
      // the first one wins, matching the precedence Canopy's own scale gives them.
      dropped.push(name);
      return;
    }
    seen.add(target);
    keep.push(rename ? renameArgument(part, target) : part);
  });

  // Re-attach trailing whitespace of a dropped final argument to the new last argument.
  let result = keep.join(',');
  const trailing = /\s*$/.exec(args);
  if (trailing && !/\s$/.test(result)) {
    result += trailing[0];
  }
  return { args: result, removed, dropped };
}

export function migrateStylesheet(source: string): MigrationResult {
  let content = source;
  const removedLevels: string[] = [];
  const droppedDuplicates: string[] = [];

  // Walk backwards so earlier offsets stay valid while the string is rewritten.
  for (const call of findConfigCalls(content).reverse()) {
    const { args, removed, dropped } = migrateTypographyArguments(content.slice(call.start, call.end));
    removedLevels.push(...removed);
    droppedDuplicates.push(...dropped);
    content = content.slice(0, call.start) + args + content.slice(call.end);
  }

  return { content, changed: content !== source, removedLevels, droppedDuplicates };
}

function isStylesheet(path: string): boolean {
  return /\.scss$/.test(path) && !/(^|\/)(node_modules|dist)\//.test(path);
}

/** Every stylesheet that can reach Canopy's Sass API: it names the package, or the `canopy` alias. */
function referencesCanopy(content: string): boolean {
  return /@northgate\/canopy-ui|\bcanopy\.(theme|\$cn-typography)|@use\s+['"](themes|styles)['"]/.test(content);
}

export function canopy4ThemeMixin(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    let touched = 0;
    tree.visit(path => {
      if (!isStylesheet(path)) {
        return;
      }
      const buffer = tree.read(path);
      if (!buffer) {
        return;
      }
      const source = buffer.toString('utf-8');
      if (!referencesCanopy(source) && !CONFIG_CALL.test(source)) {
        return;
      }
      const result = migrateStylesheet(source);
      if (!result.changed) {
        return;
      }
      tree.overwrite(path, result.content);
      touched++;
      context.logger.info(`canopy-4-theme-mixin: rewrote typography levels in ${path}`);
      for (const level of result.removedLevels) {
        context.logger.warn(
          `${path}: dropped $${level}; Material 15 has no such level (MDC form fields read $body-1). ` +
          'See docs/MIGRATION-4.0.md#typography.'
        );
      }
      for (const level of result.droppedDuplicates) {
        context.logger.warn(
          `${path}: dropped $${level}; it maps onto a level that is already defined in the same config. ` +
          'Check the rendered result against docs/MIGRATION-4.0.md#typography.'
        );
      }
    });
    if (touched === 0) {
      context.logger.info('canopy-4-theme-mixin: no Canopy typography overrides found, nothing to do.');
    }
    return tree;
  };
}
