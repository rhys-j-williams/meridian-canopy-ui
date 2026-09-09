#!/usr/bin/env python3
"""Enumerate every showcase route from the router and capture a full-page 1280x800 screenshot of each.

    python3 capture.py <base-url> <out-dir> [chromium-executable]

Routes come from projects/canopy-showcase/src/app/app-routing.module.ts (static paths) plus the
`components/<slug>` entries generated from component-pages.ts. The wildcard redirect is skipped.
Writes <out-dir>/<route>.png (route '/' -> 'home.png', '/' in paths -> '__') and routes.txt.
CSS animations/transitions are frozen and the page is settled before capture so the two runs
compare like for like.
"""
import os
import re
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..', '..'))
SHOWCASE_APP = os.path.join(REPO, 'projects', 'canopy-showcase', 'src', 'app')

FREEZE_CSS = """
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  caret-color: transparent !important;
}
"""


def enumerate_routes():
    routing = open(os.path.join(SHOWCASE_APP, 'app-routing.module.ts'), encoding='utf-8').read()
    pages = open(os.path.join(SHOWCASE_APP, 'pages', 'components', 'component-pages.ts'), encoding='utf-8').read()
    routes = []
    for m in re.finditer(r"\{\s*path:\s*'([^']*)'\s*,\s*component:", routing):
        routes.append(m.group(1))
    slugs = re.findall(r"\{\s*slug:\s*'([^']+)'", pages)
    routes.extend(f'components/{s}' for s in slugs)
    return routes


def file_name(route):
    return ('home' if route == '' else route.replace('/', '__')) + '.png'


def main():
    base = sys.argv[1].rstrip('/')
    out = sys.argv[2]
    exe = sys.argv[3] if len(sys.argv) > 3 else None
    os.makedirs(out, exist_ok=True)
    routes = enumerate_routes()
    with open(os.path.join(out, 'routes.txt'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join('/' + r for r in routes) + '\n')
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        ctx = browser.new_context(viewport={'width': 1280, 'height': 800}, device_scale_factor=1,
                                  reduced_motion='reduce', locale='en-US', timezone_id='UTC')
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        for route in routes:
            errors.clear()
            url = f'{base}/{route}'
            page.goto(url, wait_until='networkidle')
            page.add_style_tag(content=FREEZE_CSS)
            page.evaluate("document.fonts && document.fonts.ready")
            page.wait_for_timeout(700)
            rendered = page.evaluate("!!document.querySelector('router-outlet + *')")
            target = os.path.join(out, file_name(route))
            page.screenshot(path=target, full_page=True)
            status = 'ok' if rendered else 'NO-CONTENT'
            print(f'{status:10} /{route} -> {os.path.basename(target)}' + (f'  console-errors={len(errors)}' if errors else ''))
            if not rendered:
                failures.append(route)
            if errors:
                with open(os.path.join(out, 'console-errors.log'), 'a', encoding='utf-8') as fh:
                    for e in errors:
                        fh.write(f'/{route}: {e}\n')
        browser.close()
    if failures:
        print(f'FAILED to render: {failures}')
        sys.exit(1)


if __name__ == '__main__':
    main()
