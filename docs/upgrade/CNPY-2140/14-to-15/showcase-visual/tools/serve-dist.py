#!/usr/bin/env python3
"""Static server for dist/canopy-showcase with SPA fallback to index.html.

    python3 serve-dist.py <dist-dir> <port>
"""
import http.server
import os
import sys

DIST = os.path.abspath(sys.argv[1])
PORT = int(sys.argv[2])


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST, **kwargs)

    def translate_path(self, path):
        full = super().translate_path(path)
        if os.path.isfile(full):
            return full
        return os.path.join(DIST, 'index.html')

    def log_message(self, *args):
        pass


http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
