"""Render showcase-visual/SUMMARY.md from the pixelmatch JSON summaries.

    python3 tools/summary.py            (run from showcase-visual/)

Inputs: diff-summary.json (candidate-4.0.0 vs baseline-3.7.2-rerun), baseline-drift-summary.json
(baseline-3.7.2-rerun vs baseline-3.7.2) and diff-vs-original-baseline-summary.json. The verdict and
explanation per route are maintained in EXPLANATIONS below; every non-zero route must have one or the
script exits non-zero.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# Explanation keys. A route may combine several; the first key decides the verdict column.
CAUSES = {
    'badge': 'showcase header package badge reads `CANOPY-UI 4.0.0` instead of `3.7.2` (185 px on every route).',
    'form-field': (
        'MDC outlined `mat-form-field` geometry: the outline box is 56 px tall and starts 4 px higher than the '
        '58 px legacy box, horizontal text inset is 16 px instead of 12 px, the floating label / required '
        'marker (`Payee*` instead of `Payee *`) and the hint row sit 4-9 px higher, so everything below the '
        'field shifts up. Material 15.2 exposes no public token for the legacy 60/12 geometry; Canopy has NOT '
        'pinned it back (unresolved design question, see REPORT.md "Items for human decision").'
    ),
    'paginator': (
        '`mat-paginator` is 56 px tall on MDC (its documented height); on 3.x the legacy form-field wrapper '
        'inflated it to 74 px. Content below the table moves up 17 px. Not pinned back (same design question).'
    ),
    'checkbox-glyph': (
        'MDC checkbox: 18 px box drawn 1 px lower/wider than the legacy 16 px box and the tick is the MDC SVG '
        'path (thinner stroke). Material exposes no API for the glyph; Canopy keeps the MDC box and colours it '
        'with the Canopy tokens.'
    ),
    'button-subpixel': (
        'MDC button/icon-button label wrapper places text and icon <=1 px differently (sub-pixel baseline '
        'and icon gap); size, colour and glyph are unchanged.'
    ),
    'spinner-frame': 'indeterminate `mat-progress-spinner` captured on a different animation frame (non-deterministic).',
    'toggle-disabled': (
        'the first candidate capture showed the disabled `cn-toggle` hint text fully opaque (legacy faded label, '
        'hint and control together to 38%); fixed with a Canopy-owned `.cn-toggle--disabled` rule and re-captured '
        'here. Remaining pixels are the MDC switch handle anti-aliasing (<=1 px).'
    ),
    'tokens-copy': (
        'intentional showcase copy change: the typography specimen names the Material 15 levels '
        '(`Headline 4/5/6`, `Subtitle 1`) and the note reads `mat.typography-hierarchy()` (see MIGRATION-4.0.md).'
    ),
    'menu-trigger': 'MDC `mat-menu` trigger: the chevron glyph sits 1 px to the left inside the 40 px trigger.',
    'page-shell-header': (
        'header icon-buttons (notifications, theme) are MDC 40 px icon buttons: glyph 1 px right; the '
        'notification badge dot outline differs by <=2 px.'
    ),
}

# route -> (verdict, [cause keys])
# verdicts: EXPECTED (intentional change), MDC (framework geometry difference awaiting KAN-31 human acceptance),
# NONDETERMINISTIC (animation frame), FIXED (corrected after this capture; see final cycle).
EXPLANATIONS = {
    '/': ('EXPECTED', ['badge']),
    '/dashboard': ('MDC', ['badge', 'form-field', 'checkbox-glyph']),
    '/foundations/tokens': ('EXPECTED', ['badge', 'tokens-copy']),
    '/foundations/themes': ('EXPECTED', ['badge']),
    '/foundations/icons': ('EXPECTED', ['badge']),
    '/components/a11y-announcer': ('NONDETERMINISTIC', ['badge', 'spinner-frame']),
    '/components/account-card': ('MDC', ['badge', 'button-subpixel']),
    '/components/amount-slider': ('EXPECTED', ['badge']),
    '/components/autocomplete': ('MDC', ['badge', 'form-field']),
    '/components/badge': ('EXPECTED', ['badge']),
    '/components/bottom-sheet': ('MDC', ['badge', 'button-subpixel']),
    '/components/button': ('MDC', ['badge', 'button-subpixel']),
    '/components/card': ('MDC', ['badge', 'button-subpixel']),
    '/components/checkbox': ('MDC', ['badge', 'checkbox-glyph']),
    '/components/currency-input': ('MDC', ['badge', 'form-field']),
    '/components/data-table': ('MDC', ['badge', 'checkbox-glyph', 'paginator', 'button-subpixel']),
    '/components/date-range': ('MDC', ['badge', 'form-field']),
    '/components/dialog-shell': ('EXPECTED', ['badge']),
    '/components/disclosure': ('EXPECTED', ['badge']),
    '/components/divider': ('EXPECTED', ['badge']),
    '/components/error-summary': ('MDC', ['badge', 'form-field']),
    '/components/expansion': ('EXPECTED', ['badge']),
    '/components/filter-chips': ('EXPECTED', ['badge']),
    '/components/icon-button': ('MDC', ['badge', 'button-subpixel']),
    '/components/list': ('EXPECTED', ['badge']),
    '/components/masked-input': ('MDC', ['badge', 'form-field']),
    '/components/menu': ('MDC', ['badge', 'menu-trigger']),
    '/components/page-header': ('MDC', ['badge', 'button-subpixel']),
    '/components/page-shell': ('MDC', ['badge', 'page-shell-header']),
    '/components/progress': ('NONDETERMINISTIC', ['badge', 'spinner-frame']),
    '/components/radio-group': ('EXPECTED', ['badge']),
    '/components/select': ('MDC', ['badge', 'form-field']),
    '/components/skeleton': ('NONDETERMINISTIC', ['badge', 'spinner-frame']),
    '/components/stepper-shell': ('MDC', ['badge', 'form-field']),
    '/components/tabs': ('EXPECTED', ['badge']),
    '/components/toast': ('EXPECTED', ['badge']),
    '/components/toggle': ('FIXED', ['badge', 'toggle-disabled', 'button-subpixel']),
    '/components/tooltip': ('EXPECTED', ['badge']),
    '/components/virtual-list': ('EXPECTED', ['badge']),
}

DRIFT_EXPLANATIONS = {
    '/components/disclosure': 'sub-pixel anti-aliasing of the expand chevron (4 px).',
    '/components/page-shell': 'page 1 px taller: the inline `code` span in the description paragraph renders 1 px taller in the rerun (monospace font hinting differs between the two capture runs of the same 3.7.2 build), shifting the rest of the page 1 px.',
    '/foundations/tokens': 'page 6 px taller: each monospace token-name row renders 1 px taller in the rerun (same font-hinting drift as page-shell, six rows), plus the resulting shifts; same 3.7.2 build.',
}


def load(name):
    with open(os.path.join(ROOT, name)) as f:
        return json.load(f)


def main():
    diff = load('diff-summary.json')
    drift = load('baseline-drift-summary.json')
    orig = {r['route']: r for r in load('diff-vs-original-baseline-summary.json')}
    missing = [r['route'] for r in diff if r['changed'] and r['route'] not in EXPLANATIONS]
    if missing:
        sys.exit('no explanation for: ' + ', '.join(missing))

    out = []
    out.append('# Showcase visual acceptance - Canopy 3.7.2 -> 4.0.0 (CNPY-2140, evidence for KAN-31)\n')
    out.append('Viewport 1280x800, full-page captures with Playwright Chromium (`tools/capture.py`), '
               'pixel diff with `pixelmatch` 5.3 (threshold 0.1, anti-aliasing ignored; `tools/diff.js`, installed '
               'in a scratch dir, not a library dependency). Route list enumerated from the showcase router '
               f'({len(diff)} routes). Percentages are changed pixels / candidate page pixels.\n')
    out.append('Directories: `baseline-3.7.2/` (captured before any change), `baseline-3.7.2-rerun/` (the same '
               '3.7.2 build re-captured in the final environment, to separate environment drift from MDC '
               'changes), `candidate-4.0.0/`, `diff/` (candidate vs rerun), `diff-vs-original-baseline/`.\n')
    out.append('**Sign-off:** this summary is evidence only. Acceptance of the MDC differences is the human '
               'decision tracked in KAN-31; nothing here is self-approved.\n')

    out.append('## 1. Environment drift: original baseline vs same-environment rerun (both 3.7.2)\n')
    out.append('| Route | Changed px | % | Size (orig -> rerun) | Explanation |')
    out.append('|---|---:|---:|---|---|')
    for r in drift:
        if r['changed']:
            out.append(f"| `{r['route']}` | {r['changed']} | {r['pct']:.3f} | {r['baseline']} -> {r['candidate']} | "
                       f"{DRIFT_EXPLANATIONS[r['route']]} |")
    ident = sum(1 for r in drift if not r['changed'])
    out.append(f'\n{ident} of {len(drift)} routes were pixel-identical between the two 3.7.2 captures.\n')

    out.append('## 2. Candidate 4.0.0 vs 3.7.2 rerun (the acceptance table)\n')
    out.append('| Route | Changed px | % | Size (3.7.2 -> 4.0.0) | Verdict | Explanation |')
    out.append('|---|---:|---:|---|---|---|')
    counts = {}
    for r in sorted(diff, key=lambda r: -r['changed']):
        verdict, keys = EXPLANATIONS[r['route']]
        counts[verdict] = counts.get(verdict, 0) + 1
        expl = ' '.join(f'({i + 1}) {CAUSES[k]}' for i, k in enumerate(keys))
        out.append(f"| `{r['route']}` | {r['changed']} | {r['pct']:.3f} | {r['baseline']} -> {r['candidate']} | "
                   f"{verdict} | {expl} |")
    out.append('')
    out.append('Verdict counts: ' + ', '.join(f'{k} {v}' for k, v in sorted(counts.items())) + '.')
    badge_only = sum(1 for r in diff if r['changed'] <= 193)
    out.append('- EXPECTED - intentional change (version badge, renamed typography specimen). '
               f'{badge_only} routes differ ONLY by the header badge (189 px incl. anti-aliasing).')
    out.append('- MDC - geometry/glyph differences inherent to Material 15 MDC that Canopy has deliberately NOT '
               'papered over because they need a design decision (form-field 56/16 vs legacy 58/12, paginator '
               '56 vs 74 px, MDC checkbox glyph, <=1 px label placement). These are the items for KAN-31 and the '
               'new Jira item proposed in REPORT.md.')
    out.append('- NONDETERMINISTIC - animation frame of an indeterminate spinner.')
    out.append('- FIXED - a regression found by the first candidate capture and corrected before the PR; this table is '
               'the re-capture after the fix.\n')
    out.append('No route failed to render: `capture.py` waits for network idle and asserts that the router outlet has '
               'rendered a component (`NO-CONTENT` otherwise) and logs console errors - all 39 routes are `ok` with no '
               'console errors in `candidate-4.0.0.capture.log`.\n')

    out.append('## 3. Candidate 4.0.0 vs ORIGINAL baseline (for completeness)\n')
    out.append('| Route | Changed px | % |')
    out.append('|---|---:|---:|')
    for r in sorted(orig.values(), key=lambda r: -r['changed']):
        out.append(f"| `{r['route']}` | {r['changed']} | {r['pct']:.3f} |")
    out.append('\nDifferences against the original baseline equal the table in section 2 plus the section 1 drift '
               '(`/foundations/tokens`, `/components/page-shell`, `/components/disclosure`).\n')

    out.append('## 4. Not covered by the pixel diff (needs a human, KAN-31)\n')
    out.append('- Overlay states are not captured: opened `mat-select` / autocomplete panels, `mat-menu`, dialogs, '
               'bottom sheets, tooltips, toasts and the date-range calendar. On MDC these use the new panel '
               'geometry (select option height 48 px, menu item 48 px, tooltip 24 px pill) and Canopy tokens '
               'only where Material 15.2 exposes them.')
    out.append('- Hover / focus / pressed state layers (MDC ripple colours are token-driven and set from Canopy '
               'tokens, but were not captured).')
    out.append('- Dark and high-contrast themes were captured only where the showcase page shows them inline '
               '(`/foundations/themes`).')
    out.append('- `cn-amount-slider` and `cn-filter-chips` remain on the legacy modules (KAN-27 / KAN-28) and are '
               'pixel-identical apart from the header badge; they will change when those decisions land.')

    with open(os.path.join(ROOT, 'SUMMARY.md'), 'w') as f:
        f.write('\n'.join(out) + '\n')
    print('wrote SUMMARY.md')


if __name__ == '__main__':
    main()
