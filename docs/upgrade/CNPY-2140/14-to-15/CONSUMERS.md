<!-- Generated with AI assistance (AIT-014) on 2026-09-09; reviewed by <handle>. -->

# CNPY-2140 Angular 14 -> 15: consumer verification for `@northgate/canopy-ui` 4.0.0

Candidate: `@northgate/canopy-ui@4.0.0`, peers `@angular/{animations,cdk,common,core,forms,material,material-moment-adapter,router} ^15.0.0`,
`ngx-mask ^15.0.0`, `rxjs ^7.5.0`, `moment ^2.29.0`, partial-Ivy output, `ng-update` migration
`canopy-4-theme-mixin`. Published to the local Verdaccio only via `npm run publish:lib`
(`scripts/publish.sh`, [`publish.log`](publish.log); registry state in [`npm-view.log`](npm-view.log):
`versions: ['4.0.0']`, `peerDependencies` as above, 303 files / 494.6 kB packed). Nothing was published
to Artifactory.

Playbook rule: a partial-Ivy library is only supported on consumers at or above its Angular major.
Three of the four consumers are still on Angular 14, so for them the expected result **is** a peer
failure; that failure is recorded, not worked around (no `--legacy-peer-deps`, no `--force`). Only
keystone-web (Angular 15.2.10) is inside 4.0.0's peer range and is verified formally (pin, install,
`ng update` migration, lint, build, test). The verification ran in scratch checkouts under
`~/scratch/consumers/` only, cloned from each repository's `main` at the commit shown; the pin bump
is each consumer's own change under its own ticket, not this PR.

## Result table

| Consumer | Angular / Node / RxJS | Canopy pin today | Result | Notes |
|---|---|---|---|---|
| `northgate-keystone-web` (`dc44b4e`) | 15.2.10 / 16.20.2 / 7.8.0 | 3.6.1 | **PASS** | `npm install @northgate/canopy-ui@4.0.0` with strict peer resolution; `ng update @northgate/canopy-ui --migrate-only --from=3.6.1 --to=4.0.0` runs `canopy-4-theme-mixin` (no changes: Keystone does not include `canopy.theme()`, see method); `npm run lint` clean; `npm run build` (production) 743.70 kB initial; `npm test -- --watch=false` 77/77 specs, 42.21% lines. Log: [`consumers/keystone-web.log`](consumers/keystone-web.log). |
| `northgate-retail-web` (`cdde0d2`) | 14.3.0 / 16.20.2 / 7.5.7 | 3.7.2 | **FAIL (expected)** | `npm install` `ERESOLVE`: `peer @angular/animations@"^15.0.0" from @northgate/canopy-ui@4.0.0` against the installed 14.3.0 (same for every `@angular/*` peer). No further step attempted. This is the documented reason retail-web upgrades to Angular 15 in Stage 3 and then pins 4.0.0 under **MOL-4471**. Log: [`consumers/retail-web.log`](consumers/retail-web.log). |
| `northgate-iris-widget` (`c970add`) | 14.3.0 / 16.20.2 / 7.5.7 | 3.7.2 | **FAIL (expected)** | identical `ERESOLVE` on the `^15.0.0` peers. Iris uses `cn-toast`, icons and tokens only, so its migration under **IRIS-0900** is small once it is on Angular 15. Log: [`consumers/iris-widget.log`](consumers/iris-widget.log). |
| `northgate-business-web` (`e61bb54`) | 14.2.12 / 14.21.3 / 6.6.7 | 3.5.0 | **FAIL (expected)** | npm 6 does not enforce peers: install succeeds with `npm WARN ... requires a peer of @angular/*@^15.0.0 ... rxjs@^7.5.0 but none is installed`; the migration runs (no typography overrides, `canopy.theme()` is called with defaults); lint passes; **`ng build` and `ng test` fail** with 22 x `TS2707: Generic type 'ɵɵComponentDeclaration' requires between 7 and 8 type arguments` because Angular 14's compiler cannot read the Angular 15 declarations in `node_modules/@northgate/canopy-ui/**/*.d.ts`. Business-web needs Node 16 + Angular 15 + RxJS 7 before it can take 4.0.0 (**MBZ-2140**). Log: [`consumers/business-web.log`](consumers/business-web.log). |
| `northgate-ledgerline-web` | 16 / Jest | 3.7.2 + `patch-package` (LDG-3104) | NOT_VERIFIED | Not in the hop's consumer list. Angular 16 is above the `^15.0.0` peer range and its patches target 3.7.2 Material 14 class names that no longer exist in 4.0.0; raised as a new Jira item in `REPORT.md` section 10. |

No unexpected FAIL. The three Angular 14 failures are the peer-range behaviour the estate wave is
designed around (Canopy first, consumers follow). None of `/home/ubuntu/repos/northgate-{retail-web,iris-widget,business-web,keystone-web}`
was modified (`git status` clean at `cdde0d2` / `c970add` / `e61bb54` / `dc44b4e`) and no consumer PR
was opened; every consumer's `main` still reads its 3.x pin.

## keystone-web: method

Scratch checkout `~/scratch/consumers/northgate-keystone-web` (clone of `main` at `dc44b4e`), Node
16.20.2 / npm 8.19.4 via nvm, registry `http://localhost:4873`. Steps, all in
[`consumers/keystone-web.log`](consumers/keystone-web.log), driven by `verify-consumer.sh` (scratch
tooling, not committed):

0. `npm install @northgate/domain-fixtures@1.6.0 --package-lock-only` to refresh the lockfile `integrity`
   for the fixtures tarball the local Verdaccio rebuilt (`EINTEGRITY` otherwise). Local-registry
   artefact only; Artifactory serves the original tarball. Not a Canopy change.
1. `npm install @northgate/canopy-ui@4.0.0 --save-exact --legacy-peer-deps=false` - strict peer
   resolution succeeds (Angular 15.2.10, Material 15.2.9, RxJS 7.8.0 all inside the peer ranges).
   `package.json` pin `3.6.1 -> 4.0.0`, `package-lock.json` updated (the only two files changed).
2. `npx ng update @northgate/canopy-ui --migrate-only --from=3.6.1 --to=4.0.0 --allow-dirty` - the CLI
   installs a temporary `@angular/cli@15.2.11`, finds the `canopy-4-theme-mixin` migration from the
   package's `ng-update.migrations` and runs it. Result: "no Canopy typography overrides found,
   nothing to do". That is correct for Keystone: `src/styles/styles.scss` deliberately uses only
   `@northgate/canopy-ui/tokens/css-vars` (`canopy-vars.emit-light`) and not `canopy.theme()`
   (KEY-2144, because Keystone already themes Material 15 itself). The rewrite path of the schematic is
   covered by its own tests ([`test-schematics.log`](test-schematics.log), 12 specs) and by the
   business-web run, which also had no overrides to rewrite. A consumer with `$display-*` / `$title` /
   `$input` overrides in its `canopy.theme($typography: ...)` call is what the migration changes.
3. `npm run lint` - exit 0, no new warnings.
4. `npm run build` (production configuration) - exit 0; initial total 743.70 kB (158.90 kB
   transferred); no budget warning. The bundle now carries the MDC `cn-toast` and the Canopy icon
   registry from 4.0.0.
5. `npm test -- --watch=false` (the Jenkinsfile `testCommand`; `package.json`'s bare `npm test` has
   `singleRun: false` in `karma.conf.js` and keeps watching) - 77/77 specs pass, 43.37% statements /
   42.21% lines. One console `ERROR: Error retrieving icon cn:check` is emitted by a device-trust spec
   whose TestBed does not register the Canopy icon set; it is not asserted and comes from the spec's
   own module wiring, not from the 4.0.0 icon registry (the icon namespace is registered by the app
   module).

## What the keystone-web pin PR must do (KEY-2210, not this PR)

- Pin `"@northgate/canopy-ui": "4.0.0"` with `save-exact`, commit the lockfile, run `ng update
  @northgate/canopy-ui` (no-op today, kept for the future) and re-baseline the login page pixel test
  (KEY-2402): `cn-toast` is now MDC-based (`mat-mdc-snack-bar-container`) and Keystone's half-finished
  legacy-to-MDC Material migration (KEY-2210) should land at the same time so the two toast styles do
  not coexist.
- Keystone does not use `cn-amount-slider` or `cn-filter-chips`; KAN-27 / KAN-28 do not affect it.

## What the Angular 14 consumers must do before they can take 4.0.0

| consumer | ticket | prerequisite | then |
|---|---|---|---|
| retail-web | MOL-4471 | Angular 14 -> 15 hop (Stage 3) | pin 4.0.0, `ng update @northgate/canopy-ui` (typography overrides in `src/styles/_canopy-theme.scss` will be rewritten), replace `fxLayout` usage in retail templates if any (flex-layout is no longer a Canopy peer), read `docs/MIGRATION-4.0.md` |
| iris-widget | IRIS-0900 | Angular 14 -> 15 hop | pin 4.0.0; `cn-toast` DOM changes to MDC, re-check the host-page CSS that positions the toast |
| business-web | MBZ-2140 | Node 14 -> 16, TSLint -> ESLint, Angular 14 -> 15, RxJS 6 -> 7 | pin 4.0.0 (from 3.5.0 - read the 3.6 and 3.7 changelog entries as well), `ng update @northgate/canopy-ui` |
