# Showcase visual acceptance - Canopy 3.7.2 -> 4.0.0 (CNPY-2140, evidence for KAN-31)

Viewport 1280x800, full-page captures with Playwright Chromium (`tools/capture.py`), pixel diff with `pixelmatch` 5.3 (threshold 0.1, anti-aliasing ignored; `tools/diff.js`, installed in a scratch dir, not a library dependency). Route list enumerated from the showcase router (39 routes). Percentages are changed pixels / candidate page pixels.

Directories: `baseline-3.7.2/` (captured before any change), `baseline-3.7.2-rerun/` (the same 3.7.2 build re-captured in the final environment, to separate environment drift from MDC changes), `candidate-4.0.0/`, `diff/` (candidate vs rerun), `diff-vs-original-baseline/`.

**Sign-off:** this summary is evidence only. Acceptance of the MDC differences is the human decision tracked in KAN-31; nothing here is self-approved.

## 1. Environment drift: original baseline vs same-environment rerun (both 3.7.2)

| Route | Changed px | % | Size (orig -> rerun) | Explanation |
|---|---:|---:|---|---|
| `/components/disclosure` | 4 | 0.000 | 1280x1645 -> 1280x1645 | sub-pixel anti-aliasing of the expand chevron (4 px). |
| `/components/page-shell` | 15692 | 0.703 | 1280x1744 -> 1280x1745 | page 1 px taller: the inline `code` span in the description paragraph renders 1 px taller in the rerun (monospace font hinting differs between the two capture runs of the same 3.7.2 build), shifting the rest of the page 1 px. |
| `/foundations/tokens` | 38182 | 1.726 | 1280x1722 -> 1280x1728 | page 6 px taller: each monospace token-name row renders 1 px taller in the rerun (same font-hinting drift as page-shell, six rows), plus the resulting shifts; same 3.7.2 build. |

36 of 39 routes were pixel-identical between the two 3.7.2 captures.

## 2. Candidate 4.0.0 vs 3.7.2 rerun (the acceptance table)

| Route | Changed px | % | Size (3.7.2 -> 4.0.0) | Verdict | Explanation |
|---|---:|---:|---|---|---|
| `/components/currency-input` | 71882 | 3.414 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). |
| `/components/masked-input` | 56620 | 2.689 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). |
| `/dashboard` | 54196 | 2.574 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). (3) MDC checkbox: 18 px box drawn 1 px lower/wider than the legacy 16 px box and the tick is the MDC SVG path (thinner stroke). Material exposes no API for the glyph; Canopy keeps the MDC box and colours it with the Canopy tokens. |
| `/components/error-summary` | 38844 | 1.845 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). |
| `/components/select` | 29386 | 1.396 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). |
| `/components/date-range` | 22964 | 1.091 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). |
| `/components/data-table` | 21119 | 1.003 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC checkbox: 18 px box drawn 1 px lower/wider than the legacy 16 px box and the tick is the MDC SVG path (thinner stroke). Material exposes no API for the glyph; Canopy keeps the MDC box and colours it with the Canopy tokens. (3) `mat-paginator` is 56 px tall on MDC (its documented height); on 3.x the legacy form-field wrapper inflated it to 74 px. Content below the table moves up 17 px. Not pinned back (same design question). (4) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/autocomplete` | 5895 | 0.280 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). |
| `/foundations/tokens` | 4268 | 0.193 | 1280x1728 -> 1280x1728 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) intentional showcase copy change: the typography specimen names the Material 15 levels (`Headline 4/5/6`, `Subtitle 1`) and the note reads `mat.typography-hierarchy()` (see MIGRATION-4.0.md). |
| `/components/stepper-shell` | 2508 | 0.119 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the 58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT pinned it back (unresolved design question, see REPORT.md "Items for human decision"). |
| `/components/account-card` | 2025 | 0.096 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/button` | 1737 | 0.082 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/page-header` | 914 | 0.043 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/checkbox` | 764 | 0.036 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC checkbox: 18 px box drawn 1 px lower/wider than the legacy 16 px box and the tick is the MDC SVG path (thinner stroke). Material exposes no API for the glyph; Canopy keeps the MDC box and colours it with the Canopy tokens. |
| `/components/bottom-sheet` | 570 | 0.027 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/icon-button` | 443 | 0.021 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/toggle` | 427 | 0.020 | 1280x1645 -> 1280x1645 | FIXED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) the first candidate capture showed the disabled `cn-toggle` hint text fully opaque (legacy faded label, hint and control together to 38%); fixed with a Canopy-owned `.cn-toggle--disabled` rule and re-captured here. Remaining pixels are the MDC switch handle anti-aliasing (<=1 px). (3) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/page-shell` | 374 | 0.017 | 1280x1745 -> 1280x1745 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) header icon-buttons (notifications, theme) are MDC 40 px icon buttons: glyph 1 px right; the notification badge dot outline differs by <=2 px. |
| `/components/progress` | 350 | 0.017 | 1280x1645 -> 1280x1645 | NONDETERMINISTIC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) indeterminate `mat-progress-spinner` captured on a different animation frame (non-deterministic). |
| `/` | 288 | 0.010 | 1280x2355 -> 1280x2355 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/skeleton` | 256 | 0.012 | 1280x1645 -> 1280x1645 | NONDETERMINISTIC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) indeterminate `mat-progress-spinner` captured on a different animation frame (non-deterministic). |
| `/components/a11y-announcer` | 243 | 0.012 | 1280x1645 -> 1280x1645 | NONDETERMINISTIC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) indeterminate `mat-progress-spinner` captured on a different animation frame (non-deterministic). |
| `/components/card` | 221 | 0.010 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline and icon gap); size, colour and glyph are unchanged. |
| `/components/menu` | 214 | 0.010 | 1280x1645 -> 1280x1645 | MDC | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). (2) MDC `mat-menu` trigger: the chevron glyph sits 1 px to the left inside the 40 px trigger. |
| `/components/amount-slider` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/badge` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/dialog-shell` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/disclosure` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/divider` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/expansion` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/filter-chips` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/list` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/radio-group` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/tabs` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/toast` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/tooltip` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/components/virtual-list` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/foundations/icons` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |
| `/foundations/themes` | 189 | 0.009 | 1280x1645 -> 1280x1645 | EXPECTED | (1) showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route). |

Verdict counts: EXPECTED 17, FIXED 1, MDC 18, NONDETERMINISTIC 3.
- EXPECTED - intentional change (version badge, renamed typography specimen). 15 routes differ ONLY by the header badge (189 px incl. anti-aliasing).
- MDC - geometry/glyph differences inherent to Material 15 MDC that Canopy has deliberately NOT papered over because they need a design decision (form-field 56/16 vs legacy 58/12, paginator 56 vs 74 px, MDC checkbox glyph, <=1 px label placement). These are the items for KAN-31 and the new Jira item proposed in REPORT.md.
- NONDETERMINISTIC - animation frame of an indeterminate spinner.
- FIXED - a regression found by the first candidate capture and corrected before the PR; this table is the re-capture after the fix.

No route failed to render: `capture.py` waits for network idle and asserts that the router outlet has rendered a component (`NO-CONTENT` otherwise) and logs console errors - all 39 routes are `ok` with no console errors in `candidate-4.0.0.capture.log`.

## 3. Candidate 4.0.0 vs ORIGINAL baseline (for completeness)

| Route | Changed px | % |
|---|---:|---:|
| `/components/currency-input` | 71882 | 3.414 |
| `/components/masked-input` | 56620 | 2.689 |
| `/dashboard` | 54194 | 2.574 |
| `/foundations/tokens` | 39490 | 1.785 |
| `/components/error-summary` | 38844 | 1.845 |
| `/components/select` | 29386 | 1.396 |
| `/components/date-range` | 22964 | 1.091 |
| `/components/data-table` | 21119 | 1.003 |
| `/components/page-shell` | 15696 | 0.703 |
| `/components/autocomplete` | 5895 | 0.280 |
| `/components/stepper-shell` | 2508 | 0.119 |
| `/components/account-card` | 2020 | 0.096 |
| `/components/button` | 1737 | 0.082 |
| `/components/page-header` | 915 | 0.043 |
| `/components/checkbox` | 764 | 0.036 |
| `/components/bottom-sheet` | 570 | 0.027 |
| `/components/icon-button` | 443 | 0.021 |
| `/components/toggle` | 427 | 0.020 |
| `/components/progress` | 350 | 0.017 |
| `/` | 288 | 0.010 |
| `/components/skeleton` | 256 | 0.012 |
| `/components/a11y-announcer` | 243 | 0.012 |
| `/components/card` | 221 | 0.010 |
| `/components/menu` | 214 | 0.010 |
| `/components/disclosure` | 193 | 0.009 |
| `/components/amount-slider` | 189 | 0.009 |
| `/components/badge` | 189 | 0.009 |
| `/components/dialog-shell` | 189 | 0.009 |
| `/components/divider` | 189 | 0.009 |
| `/components/expansion` | 189 | 0.009 |
| `/components/filter-chips` | 189 | 0.009 |
| `/components/list` | 189 | 0.009 |
| `/components/radio-group` | 189 | 0.009 |
| `/components/tabs` | 189 | 0.009 |
| `/components/toast` | 189 | 0.009 |
| `/components/tooltip` | 189 | 0.009 |
| `/components/virtual-list` | 189 | 0.009 |
| `/foundations/icons` | 189 | 0.009 |
| `/foundations/themes` | 189 | 0.009 |

Differences against the original baseline equal the table in section 2 plus the section 1 drift (`/foundations/tokens`, `/components/page-shell`, `/components/disclosure`).

## 4. Not covered by the pixel diff (needs a human, KAN-31)

- Overlay states are not captured: opened `mat-select` / autocomplete panels, `mat-menu`, dialogs, bottom sheets, tooltips, toasts and the date-range calendar. On MDC these use the new panel geometry (select option height 48 px, menu item 48 px, tooltip 24 px pill) and Canopy tokens only where Material 15.2 exposes them.
- Hover / focus / pressed state layers (MDC ripple colours are token-driven and set from Canopy tokens, but were not captured).
- Dark and high-contrast themes were captured only where the showcase page shows them inline (`/foundations/themes`).
- `cn-amount-slider` and `cn-filter-chips` remain on the legacy modules (KAN-27 / KAN-28) and are pixel-identical apart from the header badge; they will change when those decisions land.
