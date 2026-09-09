<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->

# Migrating to Canopy 4.0.0 (`@northgate/canopy-ui` 3.7.x -> 4.0.0)

Canopy 4 is the Angular 14 -> 15 / Material 15 MDC release (CNPY-2140, estate epic KAN-23,
ADR-0005). It is one framework major only: Angular 15.2.x and Material 15.2.x. Angular 16 is a
separate later release. The full change list is the `4.0.0` section of `CHANGELOG.md`; the
version-by-version matrix is `docs/upgrade/CNPY-2140/COMPATIBILITY_MATRIX.md`; the evidence bundle is
`docs/upgrade/CNPY-2140/14-to-15/`.

Questions: `#canopy-consumers`. The pin bump is each application's own change under its own ticket
(retail-web MOL-4471, iris-widget IRIS-0900, business-web MBZ-2140, keystone-web KEY-2210); Canopy
does not open consumer PRs.

## 0. Before you start: are you on Angular 15?

4.0.0 peers `@angular/{animations,cdk,common,core,forms,material,material-moment-adapter,router}
^15.0.0`, `ngx-mask ^15.0.0`, `rxjs ^7.5.0`, `moment ^2.29.0`. Angular 14 applications get
`ERESOLVE` from `npm install` and must finish their own 14 -> 15 hop first; do **not** install with
`--legacy-peer-deps` or `--force` (npm 6 installs with warnings only and then fails to compile:
`TS2707 Generic type 'ɵɵComponentDeclaration'`, because Angular 14 cannot read Angular 15 type
declarations). Angular 16 applications are outside the range too (Canopy 5 is the 16 release).

Canopy 3.7.x stays in security support until the last consumer has moved to 4.x or 90 days after the
4.0.0 release, whichever is later (GIS-STD-022 s3). It receives security fixes only.

## 1. Update the pin and run the migration

```bash
npm install @northgate/canopy-ui@4.0.0 --save-exact      # exact pins, DEPENDENCY_POLICY.md
npx ng update @northgate/canopy-ui --migrate-only --from=3.7.2 --to=4.0.0
```

`ng update` runs the `canopy-4-theme-mixin` migration shipped in the package
(`schematics/migrations.json`). It rewrites Material 2014 typography level names to the Material 15
names in every `.scss` file of the workspace that configures Canopy typography (section 3). It is
idempotent, ignores `node_modules`, `dist` and non-SCSS files, and prints what it changed. If your
application has no typography overrides it reports "no Canopy typography overrides found, nothing
to do" - that is the normal result (keystone-web, business-web).

Commit `package.json`, `package-lock.json` and any rewritten stylesheets together.

## 2. `@angular/flex-layout` is no longer a Canopy peer

`cn-page-header` and `cn-page-shell` now lay out with plain CSS flex/grid and render identically.
Canopy no longer pulls `@angular/flex-layout` into your tree. If your own templates use `fxLayout*`
/ `fxFlex*`, you must either keep installing `@angular/flex-layout` yourself (it is end of life at
Angular 15; its 15.x betas were the final releases) or replace those directives with CSS. Canopy's
recommendation is to replace them; the tokens `--cn-space-*` cover the gaps flex-layout was used for.

## 3. Typography level names

`canopy.$cn-typography`, `canopy.$cn-typography-dense` and the `$typography` argument of
`canopy.theme()` are Material 15 `mat.define-typography-config` maps and take the 2018 level names.
The 3.x (2014) names no longer exist and Sass fails with "No argument named `$display-4`" until
renamed.

| 3.x name | 4.0 name | notes |
|---|---|---|
| `$display-4` | `$headline-1` | |
| `$display-3` | `$headline-2` | |
| `$display-2` | `$headline-3` | |
| `$display-1` | `$headline-4` | |
| `$headline` | `$headline-5` | |
| `$title` | `$headline-6` | |
| `$subheading-2` | `$subtitle-1` | |
| `$body-2` | `$subtitle-1` | Canopy's 3.x `$body-2` and `$subheading-2` had the same metrics (16px/24px medium); both land on `$subtitle-1`. If both are overridden in one config, the migration keeps the first in argument order and warns about the dropped one. |
| `$subheading-1` | `$subtitle-2` | |
| `$body-1` | `$body-1` (and `$body-2` in Canopy's own scale) | Material 15 renders `.mat-typography` running copy from `body-2` (14 used `body-1`), so `$cn-typography` sets both levels to the 3.x `$body-1` metrics. The migration does not duplicate your override: if you override `$body-1`, add the same `$body-2` yourself to keep page text consistent. |
| `$caption` | `$caption` | unchanged |
| `$button` | `$button` | unchanged |
| `$input` | *(removed)* | MDC form fields take the body typography; the migration drops the argument and reports it |
| - | `$overline` | new; defaults to 12px/18px semibold, letter-spacing 0.08em |

This table is Canopy's, chosen so that every rendered metric of the 3.7.2 scale is unchanged. It is
not identical to Material's own `private-typography-to-2018-config` mapping (which sends `body-2` to
`subtitle-2`, `subheading-1` to `body-1` and `body-1` to `body-2`). Design's confirmation of the
Canopy table is tracked as **KAN-33**; if it changes before Artifactory publish a second migration
will be provided. Do not hand-apply Material's table to a Canopy config.

Before (3.x):

```scss
@use '@northgate/canopy-ui/styles' as canopy;
@use '@angular/material' as mat;

@include canopy.theme(
  $typography: mat.define-typography-config(
    $font-family: 'Inter, sans-serif',
    $display-4: mat.define-typography-level(64px, 72px, 300),
    $title: mat.define-typography-level(22px, 30px, 600),
    $body-1: mat.define-typography-level(15px, 22px, 400),
    $input: mat.define-typography-level(15px, 1.25, 400)
  )
);
```

After (what the migration writes):

```scss
@include canopy.theme(
  $typography: mat.define-typography-config(
    $font-family: 'Inter, sans-serif',
    $headline-1: mat.define-typography-level(64px, 72px, 300),
    $headline-6: mat.define-typography-level(22px, 30px, 600),
    $body-1: mat.define-typography-level(15px, 22px, 400)
  )
);
```

(plus, by hand, `$body-2: mat.define-typography-level(15px, 22px, 400)` if running copy should follow the
`$body-1` override - see the table). The migration logs `dropped $input; Material 15 has no such level`.

Applications that use `mat.define-legacy-typography-config(...)` for their **own** legacy Material
components are left alone by the migration (that function still takes the 2014 names in Material 15);
they cannot pass that map to `canopy.theme()`.

## 4. Density is an API

3.x sized controls by overriding Material's internal classes (`--cn-control-height`,
`--cn-row-height` applied through `.mat-*` selectors). 4.0 uses Material's density system:

```scss
@include canopy.theme($density: canopy.$cn-density-compact);   // whole application at scale -1
```

```html
<section class="cn-density-compact"> ... </section>            <!-- one container -->
```

```scss
.reports-grid { @include canopy.density(canopy.$cn-density-dense); }   // custom container, scale -2
```

Scales: `$cn-density-default` = 0, `$cn-density-compact` = -1, `$cn-density-dense` = -2. The theme
mixin emits the three `.cn-density-*` classes. At runtime `CnConfig.density: 'compact'` /
`CnThemeService.setDensity('compact')` now put `cn-density-compact` on `<html>` and apply to every
component; in 3.x the same setting only affected `cn-data-table`. Check pages that set
`density: 'compact'` and expected the rest of the page to stay at the default size. The runtime type
`CnDensity` is still `'default' | 'compact'`; the `-2` scale is reachable from Sass and the class only
(open API question, see `REPORT.md` section 10).

## 5. MDC DOM: styles and tests that reached into Material internals

Every wrapped component except `cn-amount-slider` and `cn-filter-chips` now renders the Material 15
MDC implementation. The Material DOM under a Canopy component changed to `.mat-mdc-*` / `.mdc-*`.
Selectors that stop matching, with the Canopy-owned replacement:

| 3.x selector in consumer CSS / specs | what to use in 4.0 |
|---|---|
| `.mat-button-wrapper` (button label) | `.cn-button__label` / `.cn-button__icon`; `.mat-mdc-button .mdc-button__label` if you must reach Material |
| `.mat-form-field-underline`, `.mat-form-field-ripple` | none - MDC fields have no underline; Canopy's default appearance stays `outline`. Colour the outline with `--cn-color-border` / `--cn-color-primary` tokens |
| `.mat-form-field-label`, `.mat-hint` | `.mat-mdc-form-field .mdc-floating-label`, `.mat-mdc-form-field-hint` (colours are MDC defaults for now, design item in `REPORT.md` s10) |
| `.mat-select-panel` | `.cn-select-panel` (`panelClass` set by `cn-select`); options are `.cn-select__option` |
| `.mat-slide-toggle-bar`, `.mat-slide-toggle-thumb` | `cn-toggle--on` / `cn-toggle--disabled` host classes; the track is `.mdc-switch__track` |
| `.mat-header-cell`, `.mat-cell`, `.mat-row` | `.cn-data-table__table th` / `td`, `.cn-cell`, `.cn-cell--*` modifiers, `.cn-row--selected`; heights come from `--cn-row-height` |
| `.mat-tab-label`, `.mat-ink-bar` | `.cn-tabs__label`; the indicator is `.mdc-tab-indicator__content--underline` and follows `--cn-color-primary` |
| `.mat-dialog-container` | `.cn-dialog-panel`, `.cn-dialog-panel--<size>` (panel classes set by `CnDialogService`) |
| `.mat-simple-snackbar` | `.cn-toast`, `.cn-toast--<tone>` panel classes; `.cn-toast__message` / `__action` inside the Canopy toast component |
| `.mat-tooltip` | `.cn-tooltip` (`tooltipClass`) |
| `.mat-progress-bar-fill` | `.cn-progress` host (`data-cn-tone` attribute); colour through `--cn-color-primary` |
| `.mat-checkbox-ripple`, `.mat-radio-ripple` | none - 4.x sets `disableRipple`, there is no ripple element |
| `.mat-bottom-sheet-container` | `.cn-bottom-sheet-panel` |
| `.mat-slider-thumb`, `.mat-chip` inside `cn-amount-slider` / `cn-filter-chips` | unchanged in 4.0 (legacy modules, section 7) |

Unit tests that query Material classes (`By.css('.mat-button-wrapper')` and the like) need the same
change; the 3.x Ledgerline `patch-package` patches (LDG-3104) target class names that no longer exist
and must be removed, not re-applied.

Material 15 renders MDC components with their own CSS custom properties. If you had `!important`
overrides fighting Canopy's 3.x `.mat-*` rules, remove them first and re-check; most were there to
beat Canopy's own overrides, which are gone.

## 6. Form fields, checkboxes, radios, paginator: what looks different

These are the visible MDC differences left as MDC defaults (design decision pending, `REPORT.md`
section 10 and KAN-31), so do not paper over them locally:

- Outlined `mat-form-field` at density 0 is 56px tall with a 16px label inset (3.x: 58px / 12px).
  `--cn-control-height` follows the density scale rather than a fixed override.
- Checkbox glyph 18px (3.x 16px); radio and checkbox have no ripple.
- Paginator row 56px (3.x 74px); table header row follows `--cn-row-height` at the chosen density.
- Hint / floating-label colours are the MDC defaults (slightly darker than the 3.x muted grey).
- Disabled `cn-toggle` label fades like 3.x (Canopy rule); other disabled MDC controls use MDC's
  38% opacity.

The showcase (`npm start`, port 4204) renders every component on 4.0.0 and is the acceptance surface.

## 7. BLOCKED - awaiting human decision (do not work around in the application)

Two components still render the Material 15 **legacy** (pre-MDC) implementation and are
`@deprecated` in the public API. They work exactly as in 3.7.2 today, but the legacy modules are
**deleted in Material 16**, so the decisions must land before any further Angular hop:

| component | Jira | why blocked | what consumers should do now |
|---|---|---|---|
| `cn-amount-slider` (`CnAmountSliderComponent`, `CnAmountSliderModule` -> `MatLegacySliderModule`) | **KAN-27** | MDC `mat-slider` drops `thumbLabel`, `displayWith`, `tickInterval`; the amount-slider design depends on all three | keep using it; do not build a local replacement; expect a redesign in a 4.x minor with a deprecation period |
| `cn-filter-chips` (`CnFilterChipsComponent`, `CnFilterChipsModule` -> `MatLegacyChipsModule`) | **KAN-28** | MDC `mat-chip-listbox` / `mat-chip-grid` selection semantics differ from the 3.x `mat-chip-list` selection model | keep using it; the selection API (`selectionChange`, `multiple`) is unchanged in 4.0 |

Both are listed in `docs/upgrade/CNPY-2140/14-to-15/deprecations.log` and `REPORT.md` section 6.
Tree-shaking: importing either module still bundles the legacy Material CSS (~20 kB); applications
that do not use them pay nothing.

Other open decisions that affect consumers and are **not** taken in 4.0.0: KAN-31 (showcase visual
acceptance of the MDC differences in section 6), KAN-32 (dev-only npm audit ids in the Angular 15
CLI - no effect on applications), KAN-33 (typography table, section 3).

## 8. Checklist

1. Application on Angular 15.2.x, Material 15.2.x, TypeScript 4.9.x, Node 16.20.2, RxJS >= 7.5.
2. `npm install @northgate/canopy-ui@4.0.0 --save-exact`; `npx ng update @northgate/canopy-ui --migrate-only --from=3.7.2 --to=4.0.0`.
3. Remove or self-install `@angular/flex-layout`.
4. Review the migration's output for dropped `$input` / duplicate `$body-2` messages.
5. Search your styles and specs for `.mat-` and replace per section 5.
6. Re-check pages that set `density: 'compact'` (now global).
7. Re-baseline visual/pixel tests; the MDC differences in section 6 are expected.
8. `npm run lint && npm test && npm run build`; open the application and walk the forms.
9. Remove any `patch-package` patches against `@northgate/canopy-ui`.
