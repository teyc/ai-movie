#!/usr/bin/env node
// Side-by-side review of drawings that differ from their golden files.
//
//   node test/golden-review.js        writes test/review/index.html
//
// For each changed fixture the page shows the golden (old), the current
// render (new), and a difference overlay. Approve by eye, then run
//   UPDATE_GOLDEN=1 node --test
'use strict';
const fs = require('fs');
const path = require('path');
const { fixtures, goldenPath } = require('./golden-fixtures.js');

const outDir = path.join(__dirname, 'review');
fs.mkdirSync(outDir, { recursive: true });

const dataUri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const rows = [];
for (const fx of fixtures()) {
  const now = fx.render().svg;
  const file = goldenPath(fx.id);
  const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (old === now) continue;
  const oldImg = old ? `<img src="${dataUri(old)}">` : '<p>(no golden yet)</p>';
  rows.push(`<section><h2>${fx.id}</h2><div class="row">
  <figure><figcaption>Golden (old)</figcaption>${oldImg}</figure>
  <figure><figcaption>Current (new)</figcaption><img src="${dataUri(now)}"></figure>
  <figure><figcaption>Difference</figcaption><div class="diff">${old ? `<img src="${dataUri(old)}">` : ''}<img class="top" src="${dataUri(now)}"></div></figure>
</div></section>`);
}

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Golden review</title><style>
body{font-family:system-ui,sans-serif;margin:24px;color:#222}
.row{display:flex;gap:16px;flex-wrap:wrap}figure{margin:0;flex:1;min-width:280px}
img{width:100%;display:block;border:1px solid #ccc}
.diff{position:relative}.diff img.top{position:absolute;inset:0;mix-blend-mode:difference}
</style></head><body><h1>Golden review: ${rows.length} changed</h1>
<p>Black in the difference column means unchanged. Approve, then run <code>UPDATE_GOLDEN=1 node --test</code>.</p>
${rows.join('\n') || '<p>No differences.</p>'}</body></html>`;
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log(`${rows.length} changed fixture(s); wrote ${path.relative(process.cwd(), path.join(outDir, 'index.html'))}`);
