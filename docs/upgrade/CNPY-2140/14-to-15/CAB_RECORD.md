<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->
<!-- Draft from northgate-platform-tooling/governance/CAB_TEMPLATE.md (template 4.2, RM-STD-003). Not yet submitted. -->
# Change Advisory Board submission — CSWT

## 1. Record

| field | value |
|---|---|
| CHG number | CHG_______ (assigned by ITSM on save; not an emergency change) |
| Change type | Normal |
| Release train | 2026.10.2 (code freeze Fri 2026-10-02, CAB Tue 2026-10-06, deploy Thu 2026-10-08). 2026.09.2 froze on 2026-09-04 (CAB 2026-09-08) and cannot take this change; 2026.09.4 is skipped for the Q3 quarter-end freeze (`RELEASE_CALENDAR.md`). Same train as the Lantern 4.0.0 (13 -> 14) publish; separate CHG. |
| Requested implementation window | Thu 2026-10-08 20:00 to 23:00 ET (package publish only) |
| Requesting team | Canopy design system (`@northgate/canopy-design-system`, CSWT) |
| Change owner (accountable) | TBC (Canopy design-system lead, M2 or above) |
| Implementer | TBC (Canopy release engineer, `cswt/canopy-ui/tags` Jenkins job) |
| Business sponsor | TBC (CSWT digital platform product owner) |
| Application(s) and CMDB app-id(s) | `@northgate/canopy-ui` (shared component library; CMDB app-id TBC from the Canopy service record). No deployable application changes in this CHG; the showcase (`canopy-showcase`, port 4204) is an internal dev app and is not deployed. |
| Environment(s) | Artifactory `npm-northgate` (package publish only; no prod-east / prod-west deployment) |
| Jira release version | CNPY-2140 / 4.0.0 (demo mirror: KAN-23 epic; blocked decisions KAN-27, KAN-28, KAN-31, KAN-32, KAN-33) |
| Evidence bundle | `docs/upgrade/CNPY-2140/14-to-15/` on branch `feature/CNPY-2140-angular-14-to-15` (Artifactory `generic-cswt-release-evidence` URL to be added by `Jenkinsfile.release`) |

## 2. Summary of change

Framework (Angular major) upgrade of a shared library. `@northgate/canopy-ui`, the bank's Angular
Material based design system, moves from Angular 14.3.0 / Material 14.2.7 to Angular 15.2.10 /
Material 15.2.9 and is published as 4.0.0 (semver major: peer range becomes `@angular/* ^15.0.0`,
the Material components under every Canopy wrapper change to the MDC implementations, typography
level names change, the `@angular/flex-layout` peer is dropped). This is the first hop of the estate
Angular 14 -> 15 wave (KAN-23): Canopy must publish an Angular 15 line before retail-web
(MOL-4471), iris-widget (IRIS-0900) and business-web (MBZ-2140) can leave Angular 14, and it lets
keystone-web (already on Angular 15.2.10, KEY-2210) drop its Canopy 3.6.1 pin. One major only: Angular
16 is a separate later change (ADR-0005 supersedes the ADR-0004 deferral and rejects "skip straight
to 16"). No consumer changes its pin in this CHG. Canopy 3.7.x remains in security support until the
last consumer has moved to 4.x or 90 days from the 4.0.0 release, whichever is later (GIS-STD-022 s3,
`CHANGELOG.md`). Output stays Ivy partial compilation; Node (16.20.2), RxJS (7.5.7) and the public
TypeScript API surface (`docs/api/*.api.md`, no export added or removed) do not move.

Two components (`cn-amount-slider`, `cn-filter-chips`) stay on the Material 15 **legacy** modules
because their MDC redesign is a human design decision (KAN-27, KAN-28) that has not been taken; they
are `@deprecated` and must be resolved before the 15 -> 16 hop, where the legacy modules are deleted.

## 3. Scope

### In scope

| component | from | to | change |
|---|---|---|---|
| `northgate-canopy-ui` / `@northgate/canopy-ui` | 3.7.2 (tag `v3.7.2`, Angular 14.3.0, Material 14.2.7, partial Ivy) | 4.0.0 (tag `v4.0.0`, Angular 15.2.10, Material 15.2.9 MDC, partial Ivy) | framework hop 14 -> 15; peer range `^15.0.0` for `@angular/*`, `@angular/material`, `cdk`, `material-moment-adapter`, `ngx-mask`; CLI / devkit 15.2.11, ng-packagr 15.2.2, TypeScript 4.9.5, zone.js 0.12.0, angular-eslint 15.2.1; every wrapped component on MDC except the two KAN-27 / KAN-28 legacy components; Material 15 typography level names + `canopy-4-theme-mixin` `ng update` migration; density API (`canopy.theme($density)`, `.cn-density-*`, `canopy.density()`); `@angular/flex-layout` removed; ADR-0005; `docs/MIGRATION-4.0.md` |
| `canopy-showcase` (internal, not deployed) | Angular 14 | Angular 15 | same framework hop; flex-layout removed; acceptance surface for KAN-31 (`showcase-visual/`) |

### Out of scope / explicitly not changing

- Consumer pins: retail-web 3.7.2 (MOL-4471), iris-widget 3.7.2 (IRIS-0900), keystone-web 3.6.1 (KEY-2210), business-web 3.5.0 (MBZ-2140), ledgerline-web 3.7.2 + LDG-3104 patches (Angular 16; needs its own ticket, `REPORT.md` s10). Each is that team's own PR and CHG.
- Angular 16 / Material 16 (Canopy 5): next hop; blocked until KAN-27 and KAN-28 are implemented.
- The `cn-amount-slider` and `cn-filter-chips` MDC redesigns (KAN-27, KAN-28): not decided, interim legacy modules only.
- The typography rename table for 3.x `$body-2` / `$subheading-1` (KAN-33): implemented as Canopy's metric-preserving table; design confirmation pending, not changed here.
- npm audit remediation for the three new dev-only ids (KAN-32) and GIS acceptance for the carried `ws@8.13.0` High: not decided; no `overrides` added.
- Security-policy files: `.npmrc`, `checkmarx.yml`, `SECURITY.md`, `Jenkinsfile` (including its coverage gate 45% and the now-stale `GHSA-c2qf-rxjj-qqgw` allowlist entry, flagged in `REPORT.md` s5.3): unchanged.
- Node 16.20.2, npm 8.19.4, RxJS 7.5.7, moment 2.29.4, `compilationMode: partial`: unchanged.
- Artifactory configuration, WAF, IdP, databases: not applicable, no such components in this library.

## 4. Risk assessment

| | |
|---|---|
| Risk rating | Low (RM-STD-003 appendix A). Library publish only; no customer-facing deployment in this CHG; no consumer pin changes. Note for the board: the *consumer* CHGs that later pin 4.0.0 are customer-facing (retail-web, business-web) and will carry the visual-change risk (section 6, KAN-31) at at least Medium. |
| Customer impact during implementation | None expected. Publishing a new package version has no runtime effect until a consumer pins it. |
| Customer impact if it goes wrong | None for this CHG. A consumer that pins 4.0.0 on Angular 14 fails at `npm install` (`ERESOLVE`) or compile (`TS2707`) before any deployment - verified for retail-web, iris-widget and business-web scratch checkouts (`CONSUMERS.md`); keystone-web (Angular 15) installs, builds and passes 77/77 specs against 4.0.0. The specific failure mode worried about is *visual*: MDC form fields, checkboxes and paginators render with different geometry (`showcase-visual/SUMMARY.md`, 18 "MDC" routes). Mitigation: every difference is measured and explained, nothing is unexplained, and human acceptance is a separate gate (KAN-31) before any consumer takes 4.0.0. |
| Regulatory or data classification considerations | `DATA_CLASSIFICATION.md`: Synthetic, Non Restricted. No PII flows; showcase screenshots contain only `@northgate/domain-fixtures` data. `cn-disclosure` GIS-3317 validation unchanged and covered by its spec. |
| Dependencies on other changes | None hard. Lantern 4.0.0 publishes in the same train under its own CHG (independent packages). KAN-31 (visual acceptance), KAN-33 (typography table) and KAN-32 (audit option) should be closed before the Artifactory publish so that 4.0.0 does not need a 4.0.1 follow-up; they do not block the CHG mechanically. |
| Blast radius | Consumers of `@northgate/canopy-ui`: retail-web, iris-widget, ledgerline-web (all live on 3.7.2), keystone-web (3.6.1), business-web (3.5.0). None changes in this CHG. |

## 5. Dependency and platform changes

| dependency | from | to | reason | DEPENDENCY_POLICY.md exception ref (if any) |
|---|---|---|---|---|
| `@angular/{animations,common,compiler,core,forms,platform-browser,platform-browser-dynamic,router,compiler-cli}` | 14.3.0 | 15.2.10 | framework hop N -> N+1 | none |
| `@angular/cli`, `@angular-devkit/build-angular`, `@angular-devkit/core`, `@angular-devkit/schematics`, `@schematics/angular` | 14.2.13 | 15.2.11 | CLI for Angular 15 | none |
| `@angular/material`, `@angular/cdk`, `@angular/material-moment-adapter` | 14.2.7 | 15.2.9 | Material 15 MDC (ADR-0005) | none |
| `ng-packagr` | 14.2.2 | 15.2.2 | library builder for Angular 15 / APF 15 | none |
| `typescript` | 4.7.4 | 4.9.5 | Angular 15 range `>=4.8.2 <5.0.0` | none |
| `zone.js` | 0.11.8 | 0.12.0 | Angular 15 peer `~0.12.0` | none |
| `@angular-eslint/*` (5 packages) | 14.4.0 | 15.2.1 | lint builder for CLI 15 (13.x refused CLI 15) | none |
| `ngx-mask` | 14.3.3 | 15.2.3 | Angular 15 line; `NgxMaskModule` -> `NgxMaskDirective` + `provideNgxMask()` | none |
| `@angular/flex-layout` | 14.0.0-beta.41 | **removed** (dependency and peer) | EOL at Angular 15; CDK peer `^14` blocked `ng update @angular/material@15` | none (removal) |
| RxJS, Node, npm, moment, `tslib` | 7.5.7, 16.20.2, 8.19.4, 2.29.4, 2.x | no change | inside the Angular 15 matrix | none |

Peer range published in `dist/canopy-ui/package.json`: `@angular/* ^15.0.0`, `@angular/material` /
`cdk` / `material-moment-adapter` `^15.0.0`, `ngx-mask ^15.0.0`, `rxjs ^7.5.0`, `moment ^2.29.0`;
runtime dependency `tslib` only (`npm-view.log`). Exact pins throughout (`save-exact=true`,
`npm-ls.log`); `package-lock.json` committed.

- Xray report for the new versions: `scanner-xray.log` / `scanner-xray-violations.txt` (baseline `00-baseline-14/scanner-xray*.txt|log`).
- Lifecycle status of everything in the "to" column: Angular 15.2.10 end of life (vendor LTS ended 2024-05-18; intermediate wave position, 15 -> 16 follows as Canopy 5; XRAY-127401 Medium replaces the Angular 14 High XRAY-127400); TypeScript 4.9 unsupported by vendor (bounded by the Angular 15 range); Node 16.20.2 end of life (2023-09-11, XRAY-127200 / XRAY-127310, carried; inside the Angular 15 range, estate Node move is a separate change); Material 15 legacy modules (2 components) deleted in Material 16.
- Confirm no version moves outside the estate version map without an ADR: ADR-0005 (`docs/adr/0005-canopy-4-material-15-mdc.md`) records the hop, the MDC decision, the two legacy exceptions and the rejection of skipping to 16; `docs/upgrade/CNPY-2140/COMPATIBILITY_MATRIX.md` has the 3.7.2 and 4.0.0 columns.

## 6. Testing and evidence

| evidence | location | result |
|---|---|---|
| Unit tests and coverage (gate 45% lines, `Jenkinsfile`; not lowered) | `test.log`, `lcov.info` | 47/47 specs pass (baseline 47/47); 47.56% lines (baseline 47.41%), 48.79% statements, 32.04% branches, 37.85% functions |
| Schematic build and tests (`canopy-4-theme-mixin`) | `build-schematics.log`, `test-schematics.log` | exit 0; schematic specs passed (idempotence, `$input` removal, rename table, path filtering) |
| Lint (angular-eslint 15, both projects, no rule disabled) | `lint.log` | "All files pass linting", exit 0 |
| Typecheck | `typecheck.log` | exit 0 |
| Sonar quality gate | `scanner-sonar.log` | PASSED; 0 bugs, 0 vulnerabilities, 0 code smells, 3.8% duplication, 47.6% lines imported |
| Checkmarx scan (no High or Critical open) | `scanner-cx.log` | PASSED, Critical 0 High 0 Medium 0 Low 0, Suppressed 12 (same list as baseline, `checkmarx.yml` unchanged) |
| Xray dependency scan (no High or Critical open) | `scanner-xray.log`, `scanner-xray-violations.txt` | Policy gate FAILED: Critical 0 (baseline 0), High 1 (baseline 3). No new High; one new Medium lifecycle id (XRAY-127401, Angular 15 EOL, replaces the Angular 14 High). See table below |
| npm audit full tree | `npm-audit.log`, `npm-audit.json` (baseline `00-baseline-14/`) | 51 vulnerable packages (baseline 50); 5 ids gone, **3 new dev-only ids** (table below) - remediation option is **KAN-32, not decided** |
| npm audit `--production` | `npm-audit-production.log`, `npm-audit-production.json` | 3 high, id-identical to baseline (`@angular/common` / `compiler` / `core` advisories fixed only in Angular >= 17/19; covered by the wave plan). Published package depends on `tslib` only |
| Production build, zero warnings (library, schematics, showcase) | `build.log`, `build-schematics.log`, `build-showcase.log` | exit 0, 0 warnings; showcase initial bundle 2.16 MB (baseline 1.94 MB; MDC token CSS + two legacy modules) |
| API report and changelog gate | `api-check.log`, `changelog-check.log` | "API reports up to date" (no export added/removed; `@deprecated` tags added); changelog entry 4.0.0 present, exit 0 |
| Toolchain evidence | `ng-version.log`, `npm-ls.log`, `npm-ci.log` | Angular 15.2.10 / CLI 15.2.11 / Material 15.2.9 / TS 4.9.5 / Node 16.20.2; exact pins |
| GIS-1180 forbidden strings | `forbidden-strings.log` | clean (pre-commit hook on every commit) |
| Showcase visual acceptance (evidence for KAN-31) | `showcase-visual/SUMMARY.md`, `baseline-3.7.2/`, `baseline-3.7.2-rerun/`, `candidate-4.0.0/`, `diff/` | 39/39 routes render, 0 console errors; EXPECTED 17 (version badge only), FIXED 1, MDC 18 (explained geometry differences), NONDETERMINISTIC 3 (font hinting); **0 unexplained**. Human sign-off outstanding: **KAN-31** |
| Consumer verification (scratch checkouts only; no consumer repository modified) | `CONSUMERS.md`, `consumers/*.log` | keystone-web (Angular 15.2.10) **PASS**: install, `canopy-4-theme-mixin` run (no overrides to rewrite), lint, production build 743.70 kB, 77/77 specs. retail-web and iris-widget (Angular 14.3.0): **EXPECTED FAIL** `ERESOLVE` on the `^15` peer range. business-web (Angular 14.2.12 / RxJS 6 / npm 6): **EXPECTED FAIL** - npm 6 installs with peer warnings, schematic and lint pass, build/test fail `TS2707` (Angular 14 compiling Angular 15 declarations) |
| Publish rehearsal | `publish.log`, `npm-view.log` | 4.0.0 published to the local Verdaccio (Artifactory stand-in) via `scripts/publish.sh v4.0.0` (the tag name passed as the script argument; no `v4.0.0` tag exists until step 3 of section 7); `npm view` shows 4.0.0, peers `^15.0.0`, deps `tslib` only, 303 files / 494.6 kB packed |
| uat regression suite | not applicable | library publish only; no deployable |
| Manual UAT sign off | KAN-31 | showcase visual acceptance by a human (design system + design), before any consumer pins 4.0.0 |
| Performance test | not applicable | Low risk; keystone-web initial bundle 743.70 kB with 4.0.0 (`consumers/keystone-web.log`) |
| Accessibility check | not run in this hop | MDC components carry Material 15's own ARIA patterns and the Canopy `a11y` entry (focus trap, announcer, skip link) is unchanged; `cn-checkbox` / `cn-radio-group` ripple removal is visual only. No axe run exists in this repository; consumer CHGs run their own a11y suites. Any a11y behaviour change found there is a new Jira item, not an engineering decision |
| Security review | not applicable | GIS-STD-014/021/030 material unchanged; no `.npmrc`, `checkmarx.yml`, `SECURITY.md`, `Jenkinsfile` change; `cn-disclosure` GIS-3317 spec unchanged and passing. `sonar-project.properties` gained exclusions for generated schematic JavaScript only |

Open scanner findings carried into prod, with the GIS risk acceptance reference for each:

| finding id | severity | GIS acceptance | expiry |
|---|---|---|---|
| XRAY-124400 CVE-2024-37890 (`ws@8.13.0`, dev only: karma / socket.io / webpack-dev-server; fix 8.17.1 needs npm `overrides`) | High | **none yet** - carried from the 3.7.2 baseline unchanged; same decision shape as KAN-32 (override vs exception). Fold into KAN-32 or raise a GIS-RA request (`REPORT.md` s10 item 4) | TBC by GIS |
| npm audit GHSA-52v5-jr5w-gjxr / 1122163 (`sigstore` via `@angular/cli@15.2.11` -> `pacote`; dev only) | High (npm) | **KAN-32 - option not selected** (npm `overrides` under a DEPENDENCY_POLICY.md exception, or GIS exception until 15 -> 16) | TBC by KAN-32 |
| npm audit GHSA-73wf-gq98-2v4g / 1153171 and GHSA-c83g-rgw3-j3cx / 1153172 (`browserslist` via `@angular-devkit/build-angular@15.2.11`; dev only) | High (npm) | **KAN-32 - option not selected** | TBC by KAN-32 |
| XRAY-127401 NORTHGATE-EOL-ANGULAR (`@angular/core@15.2.10`) | Medium | intermediate wave position by design (one major at a time); Canopy 5 (15 -> 16) follows once KAN-27 / KAN-28 land | on the Canopy 15 -> 16 release |
| XRAY-127200 / XRAY-127310 NORTHGATE-EOL-NODE16 (`node@16.20.2`), XRAY-132800 `@babel/runtime`, XRAY-133200 `esbuild`, XRAY-125300 `karma`, XRAY-124910 `webpack` | Medium | carried from baseline, dev only; Node inside the Angular 15 range | estate Node move / next hop |
| XRAY-133800 `http-proxy`, XRAY-134600 `karma` EOL, XRAY-127700 `moment` maintenance mode, XRAY-127500 transitive `rxjs@6.6.7` (CLI tooling) | Low | carried, informational | - |
| npm audit `@angular/common\|compiler\|core@15.2.10` advisories (production tree, 3 high) | High | identical id set to the 14.3.0 baseline; fixed versions are Angular >= 17/19; covered by the KAN-23 wave plan | on each subsequent hop |

Resolved since the 3.7.2 baseline: XRAY-127400 (Angular 14 EOL, High), XRAY-124800 (CVE-2024-4068
`webpack-dev-middleware@5.3.3`, High), XRAY-134900 (TypeScript 4.7 EOL, Low); npm audit ids 1096729
(`webpack-dev-middleware`), 1113461 / 1113540 / 1113548 (`minimatch`), 1147955 (`decode-uri-component`).
The `Jenkinsfile` allowlist entry `GHSA-c2qf-rxjj-qqgw` (ngx-mask 14 semver) no longer matches any
finding. None of the dev-only findings ship in the published package (`dist/canopy-ui` depends only
on `tslib`).

Design decisions the board should know are **open** (raised in Jira, not taken by engineering):

| decision | Jira | interim in 4.0.0 |
|---|---|---|
| `cn-amount-slider` MDC redesign (`thumbLabel` / `displayWith` / `tickInterval` gone in MDC) | **KAN-27** | `MatLegacySliderModule`, `@deprecated`; deleted in Material 16 |
| `cn-filter-chips` MDC rewrite (listbox / grid selection semantics) | **KAN-28** | `MatLegacyChipsModule`, `@deprecated`; deleted in Material 16 |
| Showcase visual acceptance of the MDC geometry / colour differences | **KAN-31** | evidence only; form-field 56 px / 16 px inset, 18 px checkbox glyph, 56 px paginator, MDC hint colours left at MDC defaults |
| npm audit new dev-only ids: `overrides` vs GIS exception | **KAN-32** | no `overrides`; ids listed above |
| Typography rename table for 3.x `$body-2` / `$subheading-1` (Canopy metric-preserving vs Material's table) | **KAN-33** | implemented Canopy table unchanged; schematic applies the same table to consumer overrides |
| `CnDensity` runtime type (`'default' \| 'compact'`) vs Sass `-2` scale; Ledgerline (Angular 16) path; carried `ws` High | `REPORT.md` s10 (`new_jira_items_needed`) | not decided |

## 7. Implementation plan

1. Canopy release engineer: merge PR `feature/CNPY-2140-angular-14-to-15` -> `develop` after the CODEOWNERS approvals (`@northgate/canopy-design-system`; `@northgate/cswt-architecture` for `docs/adr/`; `@northgate/gis-appsec` is **not** required by path because no security-policy file changed, but section 6 carries open findings, so GIS review of this record is requested). 5 min.
2. Release manager: `develop` -> `release/2026.10` at code freeze 2026-10-02 17:00 ET.
3. Per `docs/runbooks/publish-a-release.md`: PR `Merge develop into main for canopy-ui v4.0.0` (two approvals), tag `v4.0.0` on `main`, push the tag. 10 min.
4. Jenkins `cswt/canopy-ui/tags` (Node 16.20.2 agent `nodejs16-rhel8`): `npm ci`, lint, test (45% gate), `npm run build`, `build:showcase`, `api:check`, `changelog:check`, Sonar, Checkmarx, dependency audit, then `scripts/publish.sh` publishes 4.0.0 to Artifactory `npm-northgate` with `gitHead` stamped. 20 min. Verify: `npm view @northgate/canopy-ui@4.0.0 peerDependencies` shows `^15.0.0`, `gitHead` is the tagged commit.
5. Update the Jira release version; post the CHANGELOG 4.0.0 entry in `#canopy-consumers`, tagging the retail, iris, keystone, business and treasury leads (deprecations present). 5 min.
6. No application deployment. Consumer pin PRs are raised by each consumer team on later trains (keystone-web KEY-2210 first).

Estimated duration: 40 minutes. Bridge: not required (no customer-facing change); Canopy on `#canopy-consumers`.
Communications: CHANGELOG entry + `docs/MIGRATION-4.0.md` link in `#canopy-consumers`; service desk not involved.

## 8. Rollback plan

| | |
|---|---|
| Rollback trigger | A Jenkins gate fails on the tag build; or keystone-web's pin PR (KEY-2210) cannot build against the Artifactory 4.0.0 (contradicting `CONSUMERS.md`); or KAN-31 rejects the visual evidence after publish. |
| Rollback steps | 1. Revert the CNPY-2140 commits (`REPORT.md` s2 table) on `develop` via a revert PR; no history is rewritten. 2. If 4.0.0 was published: `npm deprecate @northgate/canopy-ui@4.0.0 "withdrawn, use 3.7.2"` on Artifactory (never unpublish). 3. Consumers are unaffected: 3.7.2 / 3.6.1 / 3.5.0 stay published and pinned. |
| Rollback duration | 15 minutes (revert PR + deprecate). |
| Point of no return | None for this CHG. Publishing 4.0.0 changes no consumer; the version can be deprecated. |
| Rollback tested in uat on | not applicable (library publish; revert is a git operation, deprecate is reversible with `npm deprecate ... ""`). Local Verdaccio publish/deprecate rehearsed in this bundle. |

## 9. AI-assisted changes

| | |
|---|---|
| AI-assisted content present | Yes |
| Tool(s) and approved-tool register entry | Devin (Cognition), register entry AIT-014 (TECH-POL-031) |
| Commits or PRs carrying the `AI-Assisted:` trailer | All commits on `feature/CNPY-2140-angular-14-to-15` (`AI-Assisted: AIT-014`, `AI-Assisted-Scope:` trailers); PR link in `REPORT.md` |
| Human reviewer(s) of the AI-assisted content (not the prompter) | TBC (`@northgate/canopy-design-system` reviewer + `@northgate/cswt-architecture` for ADR-0005 + design for KAN-31 / KAN-33 + `@northgate/gis-appsec` for section 6) |
| Review evidence | PR review with `northgate-platform-tooling/docs/templates/PR_REVIEW_AI.md` checklist completed (to be linked) |
| Scanner results for AI-assisted files specifically | same as section 6, no delta (whole repository scanned; Checkmarx and Sonar clean; the `canopy-4-theme-mixin` schematic and the showcase-visual tooling under `docs/upgrade/.../tools/` are the largest AI-assisted additions and are covered by `test-schematics.log` and by their outputs in `SUMMARY.md`) |

## 10. Post implementation

- Hypercare owner and duration: Canopy design-system on-call (business hours), 48 hours after publish, then through keystone-web's KEY-2210 pin PR.
- Success criteria: `@northgate/canopy-ui@4.0.0` resolvable from Artifactory with peer range `^15.0.0` and `gitHead` on the tag; `cswt/canopy-ui/tags` green; keystone-web KEY-2210 builds and passes against the Artifactory package as in `CONSUMERS.md`; no 3.x consumer build breaks (none expected, no pin changes in this CHG).
- Monitoring dashboards to watch: not applicable (no runtime change); Artifactory publish log; `#canopy-consumers`.
- PIR required: No (Low risk) unless rollback is triggered.
- Follow-ups already in Jira: KAN-27, KAN-28 (before Canopy 5), KAN-31, KAN-32, KAN-33 (before Artifactory publish preferred); items in `REPORT.md` s10 for the coordinator to raise.

## 11. Approvals

| role | name | date |
|---|---|---|
| Change owner | TBC | |
| Technical approver (not on the requesting team) | TBC (`@northgate/cswt-architecture`) | |
| GIS approver (section 6 carries accepted findings) | TBC (`@northgate/gis-appsec`) | |
| Design approver (KAN-31 visual acceptance, KAN-33 typography table) | TBC (Design) | |
| Business approver | not required (Low) | |
| CAB chair | | |
