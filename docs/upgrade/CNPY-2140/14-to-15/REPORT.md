<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->
# CNPY-2140 hop report: northgate-canopy-ui Angular 14 -> 15 (Canopy 3.7.2 -> 4.0.0)

| | |
|---|---|
| Repository | `rhys-j-williams/northgate-canopy-ui` |
| Branch | `feature/CNPY-2140-angular-14-to-15` -> `develop` |
| Hop | Angular 14.3.0 -> **15.2.10** (CLI 14.2.13 -> 15.2.11), Material/CDK 14.2.7 -> **15.2.9** (MDC), one major, no chaining |
| Package | `@northgate/canopy-ui` 3.7.2 -> **4.0.0** (semver major: peer range `@angular/* ^15.0.0`, MDC DOM, typography level names, `@angular/flex-layout` peer dropped) |
| Wave position | Stage 1 of the estate Angular 14 -> 15 wave: the shared component library moves first so the consumers (retail-web MOL-4471, iris-widget IRIS-0900, business-web MBZ-2140, keystone-web KEY-2210) can move in their own tickets |
| Jira | CNPY-2140 (estate mirror: epic KAN-23). Blocked human decisions: KAN-27 (amount-slider redesign), KAN-28 (filter-chips rewrite), KAN-31 (showcase visual sign-off), KAN-32 (npm audit: overrides vs GIS exception), KAN-33 (typography rename table for `$body-2` / `$subheading-1`). AI register AIT-014 |
| ADR | [`docs/adr/0005-canopy-4-material-15-mdc.md`](../../../adr/0005-canopy-4-material-15-mdc.md) (supersedes the deferral in ADR-0004) |
| Consumer guide | [`docs/MIGRATION-4.0.md`](../../../MIGRATION-4.0.md) |
| Compatibility matrix | [`../COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md) |
| CAB draft | [`CAB_RECORD.md`](CAB_RECORD.md) |
| Consumers | [`CONSUMERS.md`](CONSUMERS.md) |
| Deprecations | [`deprecations.log`](deprecations.log) |
| Showcase visual evidence (KAN-31) | [`showcase-visual/SUMMARY.md`](showcase-visual/SUMMARY.md) |
| Result | **PASS_WITH_BLOCKERS** - every gate that this hop can close is green; the red items are the pre-existing Xray `ws@8.13.0` carry-over, the KAN-32 audit decision, the KAN-27 / KAN-28 legacy interim, the KAN-31 human sign-off and the KAN-33 typography-table confirmation (section 4) |

Baseline evidence (captured before any change) is in [`00-baseline-14/`](00-baseline-14/); every
candidate log named below sits in this directory and was produced by the same command on the final
tree (`npm ci` from the committed `package-lock.json`, [`npm-ci.log`](npm-ci.log)).

## 1. Toolchain

| item | 3.7.2 baseline (Angular 14) | 4.0.0 (Angular 15) | note |
|---|---|---|---|
| `@angular/*` runtime (animations, common, compiler, core, forms, platform-browser, platform-browser-dynamic, router) | 14.3.0 | **15.2.10** | last 15.x runtime release |
| `@angular/compiler-cli` | 14.3.0 | **15.2.10** | |
| `@angular/cli`, `@angular-devkit/*`, `@schematics/angular` | 14.2.13 | **15.2.11** | last 15.x CLI |
| `@angular/material`, `@angular/cdk`, `@angular/material-moment-adapter` | 14.2.7 | **15.2.9** | last 15.x Material; MDC components default, legacy modules still present |
| `@angular/flex-layout` | 14.0.0-beta.41 | **removed** | EOL at 15 and its CDK peer is `^14`; the `ng update @angular/material@15` run refused to proceed until it was gone ([`01-ng-update/ng-update-material.log`](01-ng-update/ng-update-material.log)) |
| `ng-packagr` | 14.3.0 | **15.2.2** | APF 15 |
| TypeScript | 4.7.4 | **4.9.5** | Angular 15 range `>=4.8.2 <5.0.0` |
| zone.js | 0.11.8 | **0.12.0** | Angular 15 peer `~0.11.4 \|\| ~0.12.0`; dev/showcase only, not shipped |
| RxJS | 7.5.7 | 7.5.7 (unchanged) | `ng update` did not require 7.8 |
| `ngx-mask` | 14.3.3 | **15.2.3** | 15 line removes `NgxMaskModule`; Canopy now uses `NgxMaskDirective` + `provideNgxMask()` internally |
| `@angular-eslint/*` | 14.4.0 | **15.2.1** | |
| `@typescript-eslint/*`, `eslint` | unchanged | unchanged | inside the angular-eslint 15 peer range |
| Node / npm | 16.20.2 / 8.19.4 | 16.20.2 / 8.19.4 (unchanged) | `.nvmrc` and `engines` untouched; Angular 15 range `^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0` |
| Pinning | exact, `save-exact=true` | exact, `save-exact=true` | `.npmrc` unchanged; every version the schematics wrote with `^`/`~` was re-pinned |

`ng version` before/after: [`00-baseline-14/ng-version.log`](00-baseline-14/ng-version.log) /
[`ng-version.log`](ng-version.log). `npm ls --depth=0`: [`00-baseline-14/npm-ls.log`](00-baseline-14/npm-ls.log) /
[`npm-ls.log`](npm-ls.log). The candidate `npm ls` reports one `extraneous` entry,
`node_modules/__ngcc_entry_points__.json`: a file left behind by Angular 14's `ngcc` in the local
`node_modules` (Angular 15 no longer runs `ngcc`); it is not in `package.json` or `package-lock.json`
and does not exist after a clean `npm ci` on a fresh agent.

## 2. Commits

All commits carry `AI-Assisted: AIT-014` and were made with the pre-commit hooks on (branch name,
commit format, `check-forbidden-strings`):

| commit | summary |
|---|---|
| `5b32cfc` | Capture Angular 14 baseline gates and showcase screenshots (`00-baseline-14/`, `showcase-visual/baseline-3.7.2/`) |
| `11f977d` | Run `ng update` to Angular 15.2 and Material 15.2 with automated migrations (framework + tooling pins, `package-lock.json`) |
| `ff7c469` | Migrate Canopy to Angular 15 / Material 15 MDC, add Canopy 4 schematic and density API (component styles/templates, typography rename, flex-layout removal, `canopy-4-theme-mixin`, 4.0.0 version and peers, CHANGELOG) |
| `92b932f` | Add ADR 0005, showcase visual candidate captures and MDC geometry fixes |
| `6f95276` | Fade disabled `cn-toggle` label like 3.x, add showcase visual SUMMARY and re-captured evidence |
| `12ee933` | Add hop report, consumer verification and compatibility matrix (REPORT / CONSUMERS / COMPATIBILITY_MATRIX, Xray violation listings) |
| `d6fbf2b` | Add CAB record, migration guide and deprecation log (CAB_RECORD, MIGRATION-4.0, deprecations.log, KAN-33 references) |
| `c0d6c06` | Rerun final gates on the 4.0.0 candidate tree (gate logs only, results unchanged) |
| `eb1d347` | Record Verdaccio publish and `npm view` evidence for 4.0.0 |
| `6cc386c` | Re-run consumer scratch verification against the final 4.0.0 tarball |
| (this commit) | REPORT.md commit table and publish note refresh |

No commit after `6f95276` touches `projects/`, `package.json`, `package-lock.json` or `angular.json`; the
final gate, publish and consumer runs therefore exercise the same code as `6f95276`.

## 3. Migrations applied

`ng update @angular/core@15 @angular/cli@15 @angular-eslint/schematics@15` ([`01-ng-update/ng-update-core-cli.log`](01-ng-update/ng-update-core-cli.log)):

- `@angular-eslint/schematics` "Updates @angular-eslint to v15" -> `.eslintrc.json` files (2 modified); versions re-pinned exact.
- `@angular/cli` "Remove Browserslist configuration files that match the CLI default" -> `projects/canopy-showcase/.browserslistrc` deleted.
- `@angular/cli` "Remove no longer needed require calls in Karma builder main file" -> both `test.ts` files; the old `require.context` discovery is gone, Angular 15 discovers specs from the `include` pattern in `angular.json`.
- `@angular/cli` "Update TypeScript compiler `target` and set `useDefineForClassFields`" -> `tsconfig.json` (`target` ES2022, `useDefineForClassFields: false`).
- `@angular/cli` "Remove exported `@angular/platform-server` `renderModule`", "Remove options from angular.json no longer supported" -> no change.
- `@angular/core` "`relativeLinkResolution` removed", "`RouterLinkWithHref` -> `RouterLink`" -> no change (no usages).

`ng update @angular/material@15` ([`01-ng-update/ng-update-material.log`](01-ng-update/ng-update-material.log)):

- First two runs refused: `@angular/flex-layout@14.0.0-beta.41` peers `@angular/cdk ^14`. Resolved by removing flex-layout (section 7), not by `--force`.
- `@angular/cdk` "Updates the Angular CDK to v15", `@angular/material` "Updates the Angular Material to v15": the Material 15 migration rewrote every `Mat*Module` import to `MatLegacy*Module` and every `mat-*` Sass mixin to `legacy-*` so that the tree compiles unchanged. That is the opposite of what 4.0.0 needs, so the automated result was reverted for every component except `cn-amount-slider` and `cn-filter-chips` (section 6) and the MDC modules / mixins were restored by hand in `ff7c469`.

## 4. Gate results

| gate | baseline (3.7.2 / Angular 14) | candidate (4.0.0 / Angular 15) | result |
|---|---|---|---|
| `npm ci` (lockfile) | `00-baseline-14/npm-ci.log` | [`npm-ci.log`](npm-ci.log) exit 0 | PASS |
| Library build `npm run build` (ng-packagr, partial Ivy, schematics copied into `dist/canopy-ui/schematics`) | `00-baseline-14/build.log` exit 0 | [`build.log`](build.log) exit 0, 0 warnings | PASS |
| Schematics build `npm run build:schematics` | n/a (no migrations in 3.x) | [`build-schematics.log`](build-schematics.log) exit 0 | PASS |
| Schematics tests `npm run test:schematics` (`canopy-4-theme-mixin` specs) | n/a | [`test-schematics.log`](test-schematics.log) "schematic specs: passed", exit 0 | PASS |
| Showcase build `npm run build:showcase` (production) | `00-baseline-14/build-showcase.log` initial 1.94 MB | [`build-showcase.log`](build-showcase.log) exit 0, initial 2.16 MB (+0.22 MB: MDC components ship their own token CSS; two legacy modules are still bundled for KAN-27/28) | PASS |
| Unit tests + coverage (`ng test canopy-ui --code-coverage`, ChromeHeadless) | 47/47, lines 47.41% | [`test.log`](test.log) **47/47 SUCCESS**, lines **47.56%** (528/1110), statements 48.79%, branches 32.04%, functions 37.85%; [`lcov.info`](lcov.info) | PASS (gate 45% lines, `Jenkinsfile` / karma `check.global.lines`; not lowered) |
| Lint `npm run lint` (angular-eslint 15, both projects; no rule disabled) | pass | [`lint.log`](lint.log) "All files pass linting", exit 0 | PASS |
| Typecheck (`tsc --noEmit` on the workspace tsconfigs) | pass | [`typecheck.log`](typecheck.log) exit 0 | PASS |
| API report `npm run api:check` (`scripts/api-report.js`) | up to date | [`api-check.log`](api-check.log) "API reports up to date", exit 0; `docs/api/*.api.md` unchanged (no export added or removed; section 8) | PASS |
| CHANGELOG `npm run changelog:check` | n/a | [`changelog-check.log`](changelog-check.log) "CHANGELOG has 4.0.0", exit 0 | PASS |
| Forbidden strings (GIS-1180, `check-forbidden-strings.sh`) | pass | [`forbidden-strings.log`](forbidden-strings.log) "PASS working tree" | PASS |
| `npm audit` (full tree) | 50 advisories | [`npm-audit.log`](npm-audit.log) / [`npm-audit.json`](npm-audit.json): 51 advisories; **3 NEW ids**, all dev-only (section 5) | **RED - decision KAN-32** (not closed here) |
| `npm audit --production` | see `00-baseline-14/npm-audit-production.log` | [`npm-audit-production.log`](npm-audit-production.log) / [`npm-audit-production.json`](npm-audit-production.json): **no new id** against baseline | PASS |
| Checkmarx stand-in `cx` | passed | [`scanner-cx.log`](scanner-cx.log) Critical 0 High 0 Medium 0 Low 0, Suppressed 12 (unchanged list), quality gate PASSED | PASS |
| Sonar stand-in `sonar-scanner` | passed | [`scanner-sonar.log`](scanner-sonar.log) QUALITY GATE PASSED, 0 bugs / 0 vulnerabilities / 0 code smells, 3.8% duplication, 47.6% lines imported | PASS |
| Xray stand-in `xray` | Policy gate FAILED: High 3 | [`scanner-xray.log`](scanner-xray.log) Policy gate **FAILED**: Critical 0, **High 1** (`ws@8.13.0`, XRAY-124400, carried from baseline), Medium 7, Low 4 | **RED - carried** (section 5); 2 of the 3 baseline Highs are resolved by this hop |
| Publish to Verdaccio `npm run publish:lib` | n/a | [`publish.log`](publish.log): `@northgate/canopy-ui@4.0.0` 494.6 kB packed / 2.6 MB unpacked / 303 files, shasum `891cdaa7…6b323`; [`npm-view.log`](npm-view.log) `npm view @northgate/canopy-ui@4.0.0 --registry http://localhost:4873` resolves | PASS (local registry only, nothing to Artifactory) |
| Consumer scratch verification | n/a | [`CONSUMERS.md`](CONSUMERS.md): keystone-web (Angular 15) **PASS**; retail-web, iris-widget, business-web **FAIL as expected** (Angular 14 consumers) | PASS (expected pattern, see section 9) |
| Showcase visual diff (39 routes, 1280x800) | `showcase-visual/baseline-3.7.2/` | [`showcase-visual/SUMMARY.md`](showcase-visual/SUMMARY.md): 39/39 routes render, 0 console errors, every non-zero diff explained (EXPECTED 17, MDC 18, FIXED 1, NONDETERMINISTIC 3) | evidence complete; **acceptance is KAN-31 (human)** |

Note on the published tarball: the final publish ran from `d6fbf2b` (docs-only commits on top of the
last code commit `6f95276`), so `dist/canopy-ui/package.json` stamps `gitHead: d6fbf2b` (verified with
`npm pack @northgate/canopy-ui@4.0.0 --registry http://localhost:4873`). The earlier local publish of the
same version was unpublished from Verdaccio first (`publish.log`, `--force`), which is a local-registry
convenience only; Artifactory publishes are tag-driven and never replaced (`docs/runbooks/publish-a-release.md`).

## 5. Scanner and audit findings carried (governance)

### 5.1 `npm audit` full tree - **decision KAN-32, not taken here**

Baseline 50 vulnerable packages, candidate 51. Diff of advisory ids (`npm-audit.json`
`vulnerabilities[*].via[*].source` vs `00-baseline-14/npm-audit.json`): 5 ids gone
(`webpack-dev-middleware` 1096729, `minimatch` 1113461 / 1113540 / 1113548, `decode-uri-component`
1147955 - all from the Angular 14 CLI tree), 3 ids new:

| new id | package | path | npm severity | shipped? |
|---|---|---|---|---|
| GHSA-52v5-jr5w-gjxr (1122163) | `sigstore` | `@angular/cli@15.2.11` -> `pacote` -> `sigstore` | high | no (CLI only) |
| GHSA-73wf-gq98-2v4g (1153171) | `browserslist` | `@angular-devkit/build-angular@15.2.11` -> `browserslist` | high | no (build only) |
| GHSA-c83g-rgw3-j3cx (1153172) | `browserslist` | same | high | no (build only) |

None of the three is reachable from the published package (`dist/canopy-ui` depends on `tslib` only,
`npm-audit-production` is id-identical to baseline). The two ways to clear them are (a) npm
`overrides` for `browserslist` / `sigstore` in `package.json` (allowed by `DEPENDENCY_POLICY.md` only
with a recorded exception) or (b) a GIS exception carrying them on the Angular 15 tooling until the
15 -> 16 hop. **The coordinator raised this as KAN-32 (Highest, parent KAN-23). No option was selected
in this hop; `package.json` has no `overrides`, and the ids are listed in `CAB_RECORD.md` s6 as
open.** The full `npm audit` text is in `npm-audit.log`; the id diff above was produced from the two
JSON files.

### 5.2 Xray stand-in

| finding id | severity | package | status |
|---|---|---|---|
| XRAY-124400 CVE-2024-37890 | High | `ws@8.13.0` (dev: karma / socket.io / webpack-dev-server tree; fix 8.17.1) | **carried from baseline**, unchanged. Not in the published package. Same class of fix as KAN-32 (override or exception); recorded in `CAB_RECORD.md` s6 for GIS acceptance |
| XRAY-127400 NORTHGATE-EOL-ANGULAR (`@angular/core@14.3.0`) | High | | **resolved by this hop** |
| XRAY-124800 CVE-2024-4068 (`webpack-dev-middleware@5.3.3`) | High | | **resolved by this hop** (build-angular 15.2.11 pulls 5.3.4+) |
| XRAY-134900 NORTHGATE-EOL-TYPESCRIPT (`typescript@4.7.4`) | Low | | **resolved by this hop** |
| XRAY-127401 NORTHGATE-EOL-ANGULAR (`@angular/core@15.2.10`) | Medium | | **new id, lifecycle** - replaces the High for Angular 14. Angular 15 LTS ended 2024-05-18; this is the intermediate wave position by design (one major at a time; 15 -> 16 is the next hop) |
| XRAY-132800, XRAY-133200, XRAY-125300, XRAY-127200, XRAY-127310, XRAY-124910 | Medium | `@babel/runtime`, `esbuild`, `karma`, `node@16.20.2` (x2), `webpack` | carried, dev-only; `node@16` is inside the Angular 15 range and stays until the estate Node move |
| XRAY-133800, XRAY-134600, XRAY-127700, XRAY-127500 | Low | `http-proxy`, `karma` EOL, `moment` maintenance mode, transitive `rxjs@6.6.7` (CLI tooling) | carried, informational |

Policy gate stays red on the one carried High. Nothing in the security policy (`.npmrc`, `checkmarx.yml`,
`SECURITY.md`, `Jenkinsfile`) was changed to make a gate pass.

### 5.3 Checkmarx / Sonar

Both stand-ins pass with the same suppression list as baseline (12 suppressed, `checkmarx.yml`
unchanged). `sonar-project.properties` gained exclusions for the generated schematic JavaScript
(`projects/canopy-ui/schematics/**/*.js`, `*.d.ts`) so that compiled output is not scanned twice as
duplicated source; no rule was disabled.

The `Jenkinsfile` `dependencyAudit.allowlist` entry `GHSA-c2qf-rxjj-qqgw` (semver via ngx-mask 14,
GIS-RA-2023-118) no longer matches anything: the id is absent from both the baseline and candidate
audit JSON. `Jenkinsfile` is a GIS AppSec-owned file, so the stale entry is left in place and flagged
here for AppSec to remove at their next edit.

## 6. BLOCKED - awaiting human decision (do not decide in engineering)

| item | Jira | interim in 4.0.0 | hard deadline |
|---|---|---|---|
| `cn-amount-slider`: MDC `mat-slider` removes `thumbLabel`, `displayWith`, `tickInterval` | **KAN-27** | `CnAmountSliderModule` imports `MatLegacySliderModule`; component and module `@deprecated` with the ticket in the JSDoc; showcase page renders identically to 3.7.2 (189 px diff = version badge only) | Material 16 deletes `@angular/material/legacy-*`. Decision must be implemented before the 15 -> 16 hop |
| `cn-filter-chips`: MDC `mat-chip-listbox` / `mat-chip-grid` selection semantics | **KAN-28** | `CnFilterChipsModule` imports `MatLegacyChipsModule`; `@deprecated` with the ticket; showcase page identical (189 px) | same |
| Showcase visual acceptance | **KAN-31** | evidence in `showcase-visual/SUMMARY.md`; this hop does not self-approve | before 4.0.0 is published to Artifactory |
| npm audit new dev-only ids: `overrides` vs GIS exception | **KAN-32** | no override added; ids listed in `CAB_RECORD.md` s6 | before the CAB submission |
| Typography rename table for 3.x `$body-2` / `$subheading-1` (Canopy metric-preserving table vs Material's `private-typography-to-2018-config`) | **KAN-33** | implemented table unchanged (`_typography.scss`, `canopy-4-theme-mixin` `TYPOGRAPHY_LEVEL_RENAMES`); section 8 item 2 | before 4.0.0 is published to Artifactory (a later change means a second consumer migration) |

Secondary entry points: ADR-0002 allows splitting the two legacy components into their own entry
points, but both already live in shared entry points (`@northgate/canopy-ui/forms`,
`@northgate/canopy-ui/data-display`) and moving them would be a second import-path break for the same
consumers in the same major; they stay where they are, isolated at module level.

## 7. Remaining `.mat-*` selectors in library styles (target was zero)

`grep -rn "\.mat-" projects/canopy-ui/src --include=*.scss` on the final tree: every match outside
the three files below is inside a `//` comment (23 lines that record which 3.x override each MDC
token / `.cn-*` rule replaced, e.g. "was `.mat-form-field-infix`"); no template or TypeScript file
matches. Active selectors:

| file | selectors | justification |
|---|---|---|
| `forms/amount-slider/amount-slider.component.scss` | `.mat-slider`, `.mat-slider-thumb`, `.mat-slider-thumb-label`, `.mat-slider-track-fill` | legacy slider kept for **KAN-27**; the overrides are the 3.7.2 ones and go with the component |
| `data-display/filter-chips/filter-chips.component.scss` | `.mat-chip-list-wrapper`, `.mat-chip.mat-standard-chip`, `.mat-chip-selected`, `.mat-chip-avatar.mat-icon` | legacy chips kept for **KAN-28**; same |
| `navigation/stepper-shell/stepper-shell.component.scss` | `.mat-horizontal-stepper-header-container`, `.mat-step-header`, `.mat-step-icon`, `.mat-step-icon-selected/-state-done/-state-edit`, `.mat-step-label.mat-step-label-active`, `.mat-horizontal-content-container` | Material 15's stepper is **not** an MDC component: it kept its pre-MDC DOM and class names, has no `mat-legacy-stepper` twin and exposes no CSS custom properties or density mixin for the header geometry. Canopy's 3.x stepper look (icon size, brand-coloured active label, content padding) has no other hook. Not a design decision; revisit when Material re-implements the stepper |

Every other 3.x override listed in ADR-0004 (`.mat-button-wrapper`, `.mat-form-field-underline`,
`.mat-select-panel`, `.mat-slide-toggle-bar`, `.mat-header-cell`, `.mat-tab-label`, `.mat-ink-bar`,
`.mat-dialog-container`, `.mat-simple-snackbar`, `.mat-tooltip`, `.mat-progress-bar-fill`,
`.mat-slider-thumb` (non-legacy), chips, radio/checkbox ripples) is gone, replaced by (in order of
preference) `mat.all-component-themes` / `mat.all-component-densities` / `mat.*-typography` mixins,
the `--mdc-*` / `--mat-*` custom properties MDC components read, Canopy-owned `.cn-*` DOM, or
structural selectors into DOM Canopy renders itself. The showcase also has zero `.mat-*` selectors
(`projects/canopy-showcase/src` grep is empty); consumer-facing selectors are the `.cn-*` classes only.

## 8. Breaking changes and public API

`docs/api/*.api.md` is unchanged: no TypeScript export was added, removed or renamed. The 4.0.0
breaking changes are in the peer range, the Sass API and the rendered DOM (full list and migration
steps in `docs/MIGRATION-4.0.md`, summary in `CHANGELOG.md` 4.0.0):

1. Peers `@angular/{animations,cdk,common,core,forms,material,material-moment-adapter,router} ^15.0.0`, `ngx-mask ^15.0.0`, `rxjs ^7.5.0`; `@angular/flex-layout` peer removed.
2. Typography level names in `canopy.theme($typography: (...))` and the `canopy.$cn-typography` / `$cn-typography-dense` maps are the Material 15 names (`$display-4..1` -> `$headline-1..4`, `$headline` -> `$headline-5`, `$title` -> `$headline-6`, `$subheading-2/1` -> `$subtitle-1/2`, `$input` removed, `$caption` / `$button` / `$overline` added). `ng update @northgate/canopy-ui` runs `canopy-4-theme-mixin`, which rewrites the keys in consumer SCSS (idempotent, ignores `node_modules`/`dist`/non-SCSS).
   The `$body-*` / `$subheading-*` part of the rename is **Canopy's own table, not Material's**: Canopy maps 3.x `$subheading-2` *and* `$body-2` (both 16px/24px medium in 3.7.2) to `$subtitle-1`, `$subheading-1` to `$subtitle-2`, and copies 3.x `$body-1` to both `$body-1` and `$body-2` (Material 15 renders `.mat-typography` running copy from `body-2`). Material's `private-typography-to-2018-config` instead maps `body-2 -> subtitle-2`, `subheading-1 -> body-1`, `body-1 -> body-2`. Canopy's table is the one that keeps every rendered metric of the 3.7.2 scale identical through the hop (that is what the showcase diff measures), and the schematic applies the same table to consumer overrides, so a consumer that overrode `$body-2` keeps its metrics. **Decision KAN-33 (Highest, parent KAN-23), not taken here:** the implemented table is the metric-preserving one and is left unchanged pending design's confirmation; see section 6 and section 10.
3. MDC DOM: consumer styles that reach into Material internals (`.mat-button-wrapper`, `.mat-form-field-*`, `.mat-tab-label`, `.mat-chip` outside `cn-filter-chips`, ...) stop matching. Canopy's own `.cn-*` hooks are unchanged.
4. Density is an API: `canopy.theme($density: 0 | -1 | -2)`, `.cn-density-default / -compact / -dense` classes (`canopy.density-classes`), `canopy.density($scale)` for a container. `CnConfig.density` / `CnThemeService.setDensity()` now apply globally (3.x applied compact to `cn-data-table` only). **Mismatch recorded, not decided:** the Sass API exposes three scales but the runtime type `CnDensity` stays `'default' | 'compact'` (unchanged from 3.x so no consumer type break); `-dense` (Material scale -2) is reachable from Sass / the class only. Whether `'dense'` joins the runtime type is a design/API question (section 10).
5. `cn-amount-slider` and `cn-filter-chips` are `@deprecated` (KAN-27, KAN-28); no behaviour change in 4.0.0.
6. Removed: `@angular/flex-layout` usage in `cn-page-header` / `cn-page-shell` (plain CSS flex; page-shell outer geometry pixel-identical at 1280x800).

3.x support: 3.7.x remains in security support until the last consumer has moved to 4.x or 90 days
after 4.0.0, whichever is later (GIS-STD-022 s3); stated in `CHANGELOG.md`. 3.x history and tags are
untouched.

## 9. Consumers

Full method and logs in [`CONSUMERS.md`](CONSUMERS.md) and [`consumers/`](consumers/). Scratch
checkouts only; no consumer repository was modified and no consumer PR was opened.

| consumer | Angular / Node | Canopy pin today | result with 4.0.0 | ticket for the pin bump |
|---|---|---|---|---|
| `northgate-keystone-web` | 15.2.10 / 16.20.2 | 3.6.1 | **PASS** - install (strict peers), `ng update @northgate/canopy-ui --migrate-only --from=3.6.1 --to=4.0.0` (schematic ran; Keystone uses Canopy tokens only, not `canopy.theme()`, so "no changes"), lint, production build (743.70 kB initial), `npm test -- --watch=false` 77/77 specs | KEY-2210 |
| `northgate-retail-web` | 14.3.0 / 16.20.2 | 3.7.2 | **FAIL (expected)** - `ERESOLVE`: peer `@angular/animations ^15.0.0` vs 14.3.0 | MOL-4471 (Stage 3) |
| `northgate-iris-widget` | 14.3.0 / 16.20.2 | 3.7.2 | **FAIL (expected)** - same `ERESOLVE` | IRIS-0900 |
| `northgate-business-web` | 14.2.12 / 14.21.3 (npm 6, RxJS 6) | 3.5.0 | **FAIL (expected)** - npm 6 installs despite the peer mismatch (warnings only) and the schematic + lint pass, but `ng build` / `ng test` fail with `TS2707` because Angular 14's compiler cannot consume Angular 15 `.d.ts` generics; RxJS 6 vs peer `^7.5.0` is a second blocker | MBZ-2140 |
| `northgate-ledgerline-web` | 16 (standalone) | 3.7.2 + `patch-package` (LDG-3104) | **not in the verification list for this hop** - noted because 4.0.0's peer range `^15.0.0` does not include Angular 16 either; Ledgerline's path is Canopy 5 (15 -> 16) | LDG-3104 / new item (section 10) |

## 10. Items for the coordinator (`new_jira_items_needed`) - recorded, not decided

1. **MDC form-field geometry and colour** (design): outlined `mat-form-field` at density 0 is 56 px tall with a 16 px label inset in MDC vs 58 px / 12 px in 3.7.2; MDC checkbox glyph is 18 px vs 16 px; paginator row 56 px vs 74 px. Canopy deliberately did not paper over these with pixel overrides (that is what ADR-0004 was trying to stop). Design must accept the MDC values or specify Canopy-owned overrides. This is the bulk of the "MDC" rows in `showcase-visual/SUMMARY.md` and is the substance of KAN-31; if KAN-31 is strictly a sign-off ticket, a separate design ticket is needed.
2. **`CnDensity` runtime type vs Sass scales** (API): add `'dense'` (-2) to `CnDensity` / `CnConfig.density`, or keep -2 Sass/class only. Not decided.
3. **Ledgerline-web (Angular 16) migration path**: cannot take 4.0.0 (peer `^15`); needs a ticket in LDG to pick up Canopy 5 and drop the LDG-3104 patches, or an agreed interim.
4. **GIS acceptance for the carried Xray High** (`ws@8.13.0`, XRAY-124400): same decision shape as KAN-32; either fold into KAN-32 or raise a GIS-RA request.
5. **Typography rename table for `$body-2` / `$subheading-1`** - raised by the coordinator as **KAN-33** (Highest, parent KAN-23) after this report flagged it: Canopy's 2014 -> 2018 mapping (section 8 item 2) preserves rendered metrics but differs from Material's own `private-typography-to-2018-config` table. Design confirms the Canopy table (and that a consumer override of `$body-2` is meant to land on `$subtitle-1`) before 4.0.0 is published to Artifactory; changing it later means a second migration. Not decided here; the implemented table is unchanged.

## 11. Rollback

Revert the CNPY-2140 commits (section 2) on `develop` via a revert PR (no `develop` history is rewritten), and
if 4.0.0 has been published to Artifactory, `npm deprecate @northgate/canopy-ui@4.0.0 "..."`. No
consumer changes pins in this change, so there is no runtime rollback path to exercise. Verdaccio is
local and disposable.

## 12. Next

- Humans: KAN-31 (accept or reject the MDC differences), KAN-32 (audit option), KAN-33 (typography table), KAN-27 / KAN-28 (component design), items in section 10.
- Consumers: keystone-web KEY-2210 first (already on Angular 15, verified PASS), then retail-web MOL-4471 / iris-widget IRIS-0900 / business-web MBZ-2140 as part of their own 14 -> 15 hops (Stage 3).
- Canopy 5 (15 -> 16) cannot start until KAN-27 and KAN-28 are implemented (legacy modules are deleted in Material 16).
