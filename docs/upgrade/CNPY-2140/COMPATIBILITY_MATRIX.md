<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->
# CNPY-2140 compatibility matrix: Angular 14 -> 15

Repository: `northgate-canopy-ui` (`@northgate/canopy-ui`). Hop 3.7.2 on Angular 14.3.0 / Material
14.2.7 -> 4.0.0 on Angular 15.2.10 / Material 15.2.9 (this hop, branch
`feature/CNPY-2140-angular-14-to-15`), wave position: shared library, first repository of the estate
Angular 14 -> 15 wave (consumers follow under their own tickets). Source for the framework ranges:
https://angular.dev/reference/versions (rows "14.2.x || 14.3.x" and "15.1.x || 15.2.x"). Everything
else is taken from each package's own `peerDependencies` at the pinned version in `package-lock.json`.
One column per hop; a hop only reads its own column and the one to its left. The next hop (15 -> 16)
adds a column and must first close KAN-27 / KAN-28 (Material 16 deletes the legacy modules).

## Framework and toolchain

| item | 3.7.2 on Angular 14 (baseline, `00-baseline-14/`) | official 14.2/14.3 range | 4.0.0 on Angular 15 (this hop) | official 15.1/15.2 range | in range |
|---|---|---|---|---|---|
| `@angular/*` (animations, common, compiler, compiler-cli, core, forms, platform-browser, platform-browser-dynamic, router) | 14.3.0 | 14.x, one exact version | **15.2.10** | 15.x, one exact version (15.2.10 is the last 15.2.x runtime) | yes |
| `@angular/cli`, `@angular-devkit/build-angular`, `@angular-devkit/core`, `@angular-devkit/schematics`, `@schematics/angular` | 14.2.13 | 14.x | **15.2.11** | 15.x (last 15.x CLI) | yes |
| `@angular/material`, `@angular/cdk`, `@angular/material-moment-adapter` | 14.2.7 | 14.x | **15.2.9** | 15.x (last 15.x Material); MDC components are the default, `@angular/material/legacy-*` still present | yes |
| `ng-packagr` | 14.3.0 | 14.x | **15.2.2** | peer `@angular/compiler-cli ^15.0.0 \|\| ^15.2.0-next.0`, `typescript >=4.8.2 <5.0`, `tslib ^2.3.0` | yes |
| TypeScript | 4.7.4 | `>=4.6.2 <4.8.0` | **4.9.5** | `>=4.8.2 <5.0.0` (last 4.9.x) | yes |
| RxJS | 7.5.7 | `^6.5.3 \|\| ^7.4.0` | 7.5.7 (unchanged) | `^6.5.3 \|\| ^7.4.0`; `ng update` did not require 7.8; published peer stays `^7.5.0` | yes |
| zone.js | 0.11.8 | `~0.11.4 \|\| ~0.12.0` | **0.12.0** | `~0.11.4 \|\| ~0.12.0 \|\| ~0.13.0` (`@angular/core@15.2.10` peer); dev/test and showcase only, the library does not ship it | yes |
| tslib | 2.4.1 (workspace), `^2.3.0` (published dep) | `^2.3.0` | 2.4.1 (unchanged) | `^2.3.0` | yes |
| Node | 16.20.2 (`.nvmrc`, `engines`) | `^14.15.0 \|\| ^16.10.0` | 16.20.2 (unchanged) | `^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0`; stays on the estate's Node 16 agents | yes |
| npm | 8.19.4 (`engines`) | any | 8.19.4 (unchanged; lockfile v2) | `@angular/cli@15` engines `^6.11.0 \|\| ^7.5.6 \|\| >=8.0.0` | yes |
| `@angular/flex-layout` | 14.0.0-beta.41 (dep + peer) | beta line per Angular major | **removed** (library, showcase, peers); replaced by CSS flex/grid in `cn-page-header` / `cn-page-shell` | the installed beta.41 peers `@angular/cdk ^14` and blocked `ng update @angular/material@15`; the package is deprecated upstream (no MDC-era support), so it was removed rather than bumped (ADR-0005) | n/a |
| `ngx-mask` | 14.3.3 | 14.x | **15.2.3** | peer `@angular/{common,core,forms} >=14.0.0`; `NgxMaskModule` removed upstream, library uses `NgxMaskDirective` + `provideNgxMask()` | yes |
| `moment` | 2.29.4 (peer `^2.29.0`) | any | 2.29.4 (unchanged) | `@angular/material-moment-adapter@15.2.9` peer `^2.18.1` (and `@angular/material 15.2.9` exact) | yes |

## Library output format

| item | 3.7.2 on Angular 14 | 4.0.0 on Angular 15 |
|---|---|---|
| `angularCompilerOptions` | `compilationMode: "partial"` (Ivy partial) | unchanged |
| Distribution bundles | `esm2020/`, `fesm2015/`, `fesm2020/` (`.mjs`), per-entry-point `*.d.ts` (ng-packagr 14 / APF 14) | same layout (ng-packagr 15 / APF 15); `schematics/` folder added (compiled `ng-update` migration, `migrations.json`) |
| TypeScript target (`tsconfig.json`) | es2020 | ES2022 with `useDefineForClassFields: false` (written by the `@angular/cli@15` migration; the emitted fesm2020 bundles are unchanged in shape) |
| `package.json` `ng-update.migrations` | none | `./schematics/migrations.json` (`canopy-4-theme-mixin`, version 4.0.0) |
| Test discovery (`projects/canopy-ui/src/test.ts`) | `require.context` loads `lib/**/*.ts` and every spec | `require.context` block removed from `test.ts`; `@angular-devkit/build-angular:karma` 15 `include: ["**/*.spec.ts", "lib/**/*.ts"]` in `angular.json` keeps the coverage denominator (CNPY-1402) |
| Consumer install | Ivy linker in the consumer build | unchanged; declarations are `ɵɵComponentDeclaration` with the Angular 15 arity, so an Angular 14 consumer fails to compile them (`TS2707`, see `14-to-15/CONSUMERS.md` business-web) |

## Published package (`projects/canopy-ui/package.json`)

| field | 3.7.2 | 4.0.0 |
|---|---|---|
| `version` | 3.7.2 | **4.0.0** (semver major: Angular / Material peer range, MDC DOM, typography level names, flex-layout peer dropped) |
| `peerDependencies.@angular/{animations,cdk,common,core,forms,material,material-moment-adapter,router}` | `^14.0.0` | **`^15.0.0`** |
| `peerDependencies.@angular/flex-layout` | `^14.0.0-beta.41` | **removed** |
| `peerDependencies.ngx-mask` | `^14.0.0` | **`^15.0.0`** |
| `peerDependencies.rxjs` | `^7.5.0` | `^7.5.0` (unchanged) |
| `peerDependencies.moment` | `^2.29.0` | `^2.29.0` (unchanged) |
| `dependencies.tslib` | `^2.3.0` | `^2.3.0` |
| `sideEffects` | false | false |
| Material modules imported | `Mat*Module` (Material 14, pre-MDC) | MDC `Mat*Module` for every wrapped component except `MatLegacySliderModule` (`cn-amount-slider`, KAN-27) and `MatLegacyChipsModule` (`cn-filter-chips`, KAN-28) |
| Theme mixin | `canopy.theme($include-dark, $include-high-contrast)` with Material 2014 typography level names | `canopy.theme($include-dark, $include-high-contrast, $typography, $density)` with Material 2018 level names; `canopy.density($scale)`, `canopy.density-classes` added |

## Third-party dev dependencies

| package | 3.7.2 on Angular 14 | 4.0.0 on Angular 15 | peer / compatibility note for 15 |
|---|---|---|---|
| `@angular-eslint/builder`, `eslint-plugin`, `eslint-plugin-template`, `schematics`, `template-parser` | 14.4.0 | **15.2.1** | angular-eslint 15.x line (last 15.x); `schematics` peer `@angular/cli >= 15.0.0 < 16.0.0`; upgraded in the same `ng update` run because 14.4.0 blocks `@angular/cli@15` |
| `@typescript-eslint/eslint-plugin`, `parser` | 5.43.0 | 5.43.0 | `@angular-eslint/eslint-plugin@15.2.1` depends on `@typescript-eslint/utils 5.48.2` and peers `eslint ^7.20.0 \|\| ^8.0.0`; the 5.43.0 plugin/parser pins were left as they lint clean (`lint.log`) |
| `eslint` | 8.28.0 | 8.28.0 | in range (`^7.20.0 \|\| ^8.0.0`) |
| `@types/jasmine` | 4.3.1 | 4.3.1 | matches `jasmine-core` 4.3 |
| `@types/node` | 16.18.11 | 16.18.11 | Node 16 typings, TS 4.9 fine |
| `jasmine-core` | 4.3.0 | 4.3.0 | `karma-jasmine@5` peer `jasmine-core ^4.0` |
| `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter` | 6.4.1 / 3.1.1 / 2.2.0 / 5.1.0 / 2.0.0 | unchanged | `@angular-devkit/build-angular@15` peer `karma ^6.3.0`; `karma-jasmine@5` peer `karma ^6.0.0`. `src/test.ts` no longer uses `require.context` (Angular 15 karma builder), discovery moved to the `include` option |
| `puppeteer` | 19.11.1 | 19.11.1 | showcase e2e only; `puppeteer_skip_download=true` in `.npmrc` |
| `@angular/flex-layout` | 14.0.0-beta.41 | **removed** | see above |
| Showcase visual tooling (`pixelmatch` 5.3.0, `pngjs`, Playwright Chromium) | - | not a dependency | installed in a scratch directory only (`14-to-15/showcase-visual/tools/`); nothing added to `package.json` |

## Consumers and the peer range

| consumer | Angular / Node / RxJS | Canopy pin today | 4.0.0 (peer `^15.0.0`) | consumer ticket |
|---|---|---|---|---|
| `northgate-retail-web` | 14.3.0 / 16.20.2 / 7.5.7 | 3.7.2 | **out of range**: `npm install` `ERESOLVE` on every `@angular/*@^15.0.0` peer; expected, retail-web upgrades to 15 in Stage 3 and then pins 4.0.0 | MOL-4471 |
| `northgate-iris-widget` | 14.3.0 / 16.20.2 / 7.5.7 | 3.7.2 | **out of range**: same `ERESOLVE`; pins 4.0.0 after its own 14 -> 15 hop | IRIS-0900 |
| `northgate-business-web` | 14.2.12 / 14.21.3 / 6.6.7 | 3.5.0 | **out of range**: npm 6 installs with peer warnings, but `ng build` / `ng test` fail on the Angular 15 declarations (`TS2707`); RxJS 6 also outside `^7.5.0`. Needs Node 16 + Angular 15 + RxJS 7 first | MBZ-2140 |
| `northgate-keystone-web` | 15.2.10 / 16.20.2 / 7.8.0 | 3.6.1 | **in range**: verified **PASS** in a scratch checkout (install, `ng update` migration, lint, build, 77/77 specs), see `14-to-15/CONSUMERS.md` | KEY-2210 |
| `northgate-ledgerline-web` | 16 (standalone, Jest) | 3.7.2 + `patch-package` (LDG-3104) | **not verified in this hop**: Angular 16 is above the `^15.0.0` peer range and Ledgerline's patches target 3.7.2 class names that 4.0.0 no longer has. Recorded as a new Jira item in `14-to-15/REPORT.md` | LDG-3104 |

## Known audit exposure that cannot be fixed inside the 14 or 15 matrix

See `14-to-15/REPORT.md` section 5 and `14-to-15/CAB_RECORD.md` section 6. The published package
depends on `tslib` only and `npm audit --production` is id-identical to the 3.7.2 baseline. The dev
tree carries `ws@8.13.0` (XRAY-124400, from the karma / webpack-dev-server tree) and gains three
dev-only advisory ids from the Angular 15 CLI tree (`sigstore` GHSA-52v5-jr5w-gjxr, `browserslist`
GHSA-73wf-gq98-2v4g / GHSA-c83g-rgw3-j3cx); clearing them needs npm `overrides` or a GIS exception,
which is the open decision **KAN-32** and is not taken in this hop. Angular 15.2.10 itself is past
vendor LTS (XRAY-127401, Medium); that is the intermediate wave position by design (one major at a
time), the 15 -> 16 hop follows once KAN-27 / KAN-28 are decided.
