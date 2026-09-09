#!/usr/bin/env node
/**
 * Per-route pixel diff of the showcase baseline vs candidate screenshots (CNPY-2140 / KAN-31).
 *
 *   node diff.js <baseline-dir> <candidate-dir> <diff-dir> <summary.json>
 *
 * Uses pixelmatch + pngjs resolved from a scratch install (NODE_PATH), never from the library's
 * dependency set. Images of different heights are compared on the common area and the extra rows
 * are counted as changed pixels, so a page that grew or shrank is never reported as identical.
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const [baseDir, candDir, diffDir, summaryPath] = process.argv.slice(2);
fs.mkdirSync(diffDir, { recursive: true });

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const rows = [];
const files = fs.readdirSync(baseDir).filter((f) => f.endsWith('.png')).sort();
for (const file of files) {
  const route = '/' + (file === 'home.png' ? '' : file.replace(/\.png$/, '').replace(/__/g, '/'));
  const candPath = path.join(candDir, file);
  if (!fs.existsSync(candPath)) {
    rows.push({ route, file, status: 'MISSING', changed: null, total: null, pct: null });
    continue;
  }
  const a = read(path.join(baseDir, file));
  const b = read(candPath);
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const crop = (img) => {
    if (img.width === width && img.height === height) return img.data;
    const out = Buffer.alloc(width * height * 4);
    for (let y = 0; y < height; y++) {
      img.data.copy(out, y * width * 4, y * img.width * 4, y * img.width * 4 + width * 4);
    }
    return out;
  };
  const diff = new PNG({ width, height });
  const changed = pixelmatch(crop(a), crop(b), diff.data, width, height, { threshold: 0.1, includeAA: false });
  const total = Math.max(a.width, b.width) * Math.max(a.height, b.height);
  const changedTotal = changed + (total - width * height);
  fs.writeFileSync(path.join(diffDir, file), PNG.sync.write(diff));
  rows.push({
    route, file, status: changedTotal === 0 ? 'IDENTICAL' : 'DIFF',
    changed: changedTotal, total, pct: +((changedTotal / total) * 100).toFixed(3),
    baseline: `${a.width}x${a.height}`, candidate: `${b.width}x${b.height}`,
  });
}
fs.writeFileSync(summaryPath, JSON.stringify(rows, null, 2) + '\n');
for (const r of rows) {
  console.log(`${r.status.padEnd(9)} ${r.route.padEnd(32)} ${r.changed === null ? '' : `${r.changed} px (${r.pct}%) ${r.baseline} -> ${r.candidate}`}`);
}
