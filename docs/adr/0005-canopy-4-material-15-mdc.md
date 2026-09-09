<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->
# ADR-0005: Canopy 4.0.0 is the Angular 14 -> 15 / Material 15 MDC hop

Status: Proposed, 2026-09-09 (accepted when PR CNPY-2140 merges to `develop`). Supersedes the
deferral in ADR-0004; ADR-0001 (wrap Material) and ADR-0002 (secondary entry points) still apply.
Owners: Canopy design system, CSWT architecture.
Related: CNPY-2140 (this hop; estate epic KAN-23), CNPY-1900 (2024 spike), KAN-27 / KAN-28
(component design decisions), KAN-31 (showcase visual sign-off), KAN-32 (dev-only audit
findings), MOL-4471 / IRIS-0900 / MBZ-2140 / KEY-2210 (consumer pins).

## Context

ADR-0004 (May 2024) made the Material MDC migration a Canopy major and deferred it to funding.
Angular 14 has been out of support since November 2023 and Canopy's `14.x` peer range is what
holds retail-web, iris-widget and business-web on 14. The estate now runs the Angular upgrade
playbook, whose first rule is one major per hop: Canopy goes 14 -> 15, then Lantern, Iris and the
applications follow. ADR-0004's "skip straight to 16" option is therefore not taken; 16 is the
next hop and starts only when every consumer is on 15.

The seven CNPY-1900 findings are re-examined below against Material 15.2.9, which ships the MDC
components as the default and the pre-MDC ones as `MatLegacy*` modules for this one release.

## Decision

Canopy 4.0.0 = Angular 15.2.10 (CLI 15.2.11), Material / CDK 15.2.9, TypeScript 4.9.5,
zone.js 0.12.0, RxJS 7.5.7 (unchanged), Node 16.20.2 (unchanged), published from
`feature/CNPY-2140-angular-14-to-15` -> `develop`. Peer range `@angular/* ^15.0.0`.

1. **MDC everywhere except two components.** Every wrapped component renders the Material 15 MDC
   implementation. Internal `.mat-*` class overrides are replaced by, in order of preference:
   the Material 15 theming and density mixins (`mat.all-component-themes`,
   `mat.all-component-densities`, `mat.badge-typography`); the CSS custom properties MDC
   components expose (`--mdc-*`, `--mat-*`); Canopy-owned DOM (`.cn-*` classes on elements
   Canopy renders); and, as a last resort, structural selectors (`> div`) into Material DOM that
   has no class we are allowed to use. The final library stylesheets contain `.mat-*` selectors
   in three files only, each justified in `docs/upgrade/CNPY-2140/14-to-15/REPORT.md` s7:
   `stepper-shell` (the Material 15 stepper is not an MDC component and keeps `.mat-step-*`),
   `amount-slider` and `filter-chips` (legacy, below).
2. **`cn-amount-slider` and `cn-filter-chips` stay on `MatLegacySliderModule` /
   `MatLegacyChipsModule`.** The MDC slider drops `thumbLabel`, `displayWith` and `tickInterval`
   (CNPY-1900 finding 5) and the MDC chips change selection semantics (finding 4). Both need a
   design decision that engineering must not take: KAN-27 (slider redesign) and KAN-28 (chips
   rewrite). Both components are `@deprecated` in the public API with the ticket reference, keep
   their existing entry points (`@northgate/canopy-ui/forms`, `/data-display`; ADR-0002 allows a
   split later but moving them now would be a second breaking change for the same consumers),
   and render identically to 3.7.2 in the showcase. **Material 16 removes the legacy modules, so
   KAN-27 and KAN-28 must be decided and implemented before the 15 -> 16 hop starts.**
3. **Typography uses the Material 15 level names** (`$headline-1..6`, `$subtitle-1/2`,
   `$body-1/2`, `$caption`, `$button`, `$overline`). `$input` is removed (MDC fields take body
   typography). `$body-2` is set equal to the 3.x `$body-1` because Material 15 renders
   `.mat-typography` running copy from `body-2` (14 used `body-1`); without this every page
   changed size. The `ng update` migration `canopy-4-theme-mixin` rewrites consumer typography
   overrides (finding 2).
4. **Density becomes an API** rather than an override. `canopy.theme($density: 0 | -1 | -2)`,
   `.cn-density-default / -compact / -dense` classes, and `canopy.density($scale)` for a
   container. `CnThemeService.setDensity()` applies `CnConfig.density` globally (3.x applied it
   to the data table only). The MDC form field at scale 0 is 56px, within 2px of the 3.x
   `.mat-form-field-infix` override; the exact 3.x pixel sizes are not reproduced.
5. **`@angular/flex-layout` is removed** from `cn-page-header`, `cn-page-shell`, the peer
   dependencies and the showcase (finding 6). Plain CSS flex reproduces the layout; the
   page-shell outer geometry (topbar 60px, nav 240px, main) is pixel-identical in the showcase
   capture. Consumers that use `fxLayout*` in their own templates keep their own flex-layout
   dependency (it is EOL at 15) or replace it; Canopy no longer brings it in.
6. **The showcase is the acceptance surface** (ADR-0004 Consequences). Every 3.7.2 showcase page
   is captured at 1280x800 before and after the hop and pixel-diffed; every non-zero difference is
   explained in `showcase-visual/SUMMARY.md`. The sign-off is a human decision (KAN-31).
7. **3.x support.** 3.7.x remains in security support until the last consumer has moved to 4.x
   or 90 days after 4.0.0, whichever is later (GIS-STD-022 s3). 3.x history is untouched.

## Consequences

- Angular 14 consumers cannot install 4.0.0 (`ERESOLVE` on the peer range). That is the intended
  forcing function: retail-web (MOL-4471), iris-widget (IRIS-0900) and business-web (MBZ-2140,
  also RxJS 6 -> 7) upgrade in their own hops. keystone-web (already Angular 15.2.10, KEY-2210)
  installs, migrates, lints, builds and tests against 4.0.0 in a scratch checkout.
- Consumer styles that reached into pre-MDC Material class names stop matching. The Ledgerline
  patches (LDG-3104) are the known case; `docs/MIGRATION-4.0.md` lists the replacements.
- Some MDC visual defaults differ from the 3.x overrides and Material 15 exposes no token for
  them: form-field outline, floating-label and hint colours; the MDC button label sits 1px lower.
  These are recorded, not decided, in REPORT.md and are raised as new Jira items for the design
  team rather than tuned by engineering.
- Three new **dev-only** `npm audit` ids (`browserslist` GHSA-73wf-gq98-2v4g /
  GHSA-c83g-rgw3-j3cx, `sigstore` GHSA-52v5-jr5w-gjxr) arrive with Angular CLI 15 and cannot be
  fixed inside the Angular 15 range. Overrides vs GIS exception is KAN-32; nothing is chosen here.
- The 15 -> 16 hop is a new ADR and cannot start until KAN-27 and KAN-28 land (legacy modules are
  removed in Material 16). ADR-0004's spike branch `spike/CNPY-1900-angular-15` can be archived.
