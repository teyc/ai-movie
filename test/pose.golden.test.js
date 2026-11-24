// Golden regression tests for the pose renderer.
//
//   node --test                     run the tests
//   UPDATE_GOLDEN=1 node --test     rewrite the golden files (only after the
//                                   human has approved the change; see
//                                   test/golden-review.js)
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const pose = require('../lib/pose/mannequin.js');
const { MANIFEST, ROOT, GOLDEN_DIR, fixtures, goldenPath, loadScene } = require('./golden-fixtures.js');

const UPDATE = process.env.UPDATE_GOLDEN === '1';

test('manifest covers every reference scene in the folder, and nothing missing', () => {
  const { folder, scenes } = MANIFEST.frames;
  const onDisk = fs.readdirSync(path.join(ROOT, folder)).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
  assert.deepEqual([...scenes].sort(), onDisk, 'add new scenes to test/pose-manifest.json, or remove deleted ones');
});

if (UPDATE) fs.mkdirSync(GOLDEN_DIR, { recursive: true });

for (const fx of fixtures()) {
  test(`golden: ${fx.id}`, () => {
    const { svg, warnings } = fx.render();
    const file = goldenPath(fx.id);
    if (UPDATE) {
      fs.writeFileSync(file, svg);
      return;
    }
    assert.ok(fs.existsSync(file), `missing golden ${path.relative(ROOT, file)}; run UPDATE_GOLDEN=1 node --test`);
    assert.ok(svg === fs.readFileSync(file, 'utf8'),
      `${fx.id} changed. Review with: node test/golden-review.js, then UPDATE_GOLDEN=1 node --test`);
    if (fx.scene !== undefined) {
      const expected = MANIFEST.frames.expectedWarnings[fx.scene] || [];
      assert.deepEqual(warnings, expected, `${fx.scene}: unexpected warnings`);
    }
  });
}

test('rendering is deterministic for a fixed seed', () => {
  const scene = loadScene('resource/pose', 'dash');
  assert.equal(pose.renderFrame(scene, { seed: 11 }).svg, pose.renderFrame(scene, { seed: 11 }).svg);
});

test('render order does not change output', () => {
  const a = loadScene('resource/pose', 'dash');
  const b = loadScene('resource/pose', 'child-peek');
  const first = pose.renderFrame(a, { seed: 11 }).svg;
  pose.renderLineup({ seed: 3, yaw: 90 });
  pose.renderFrame(b, { seed: 5, construction: true });
  pose.renderSheet([a, b], { seed: 7 });
  assert.equal(pose.renderFrame(a, { seed: 11 }).svg, first);
});

test('frame drawing is clipped to the frame; the border is not', () => {
  const scene = loadScene('test/fixtures/pose', 'limb-past-frame');
  const svg = pose.renderFrame(scene, { seed: 11 }).svg;
  assert.match(svg, /<clipPath id="frame-clip"><rect x="8" y="8" width="304" height="184"\/><\/clipPath><g clip-path="url\(#frame-clip\)">/);
  // The clipped group closes before the border (four sides, two strokes each), which ends the drawing.
  const tail = svg.slice(svg.lastIndexOf('</g>') + 4, svg.lastIndexOf('</svg>'));
  assert.equal((tail.match(/class="ink"/g) || []).length, 8, 'the border strokes come after the clipped group');
  const portrait = pose.renderFrame({ ...scene, frame: { w: 180, h: 320 } }, { seed: 11 }).svg;
  assert.match(portrait, /<rect x="8" y="8" width="164" height="304"\/>/);
});

test('every child-peek board draws inside the frame clip; only the border is outside', () => {
  const dir = 'examples/child-peek/scenes';
  const names = fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
  assert.ok(names.length >= 5);
  for (const n of names) {
    const svg = pose.renderFrame(loadScene(dir, n), { seed: 11 }).svg;
    const open = svg.indexOf('<g clip-path="url(#frame-clip)">');
    const paper = svg.indexOf('fill="#F1EFE8"/>') + 'fill="#F1EFE8"/>'.length;
    assert.match(svg.slice(paper, open), /^<clipPath id="frame-clip"><rect [^>]*\/><\/clipPath>$/, `${n}: nothing drawn before the clip group`);
    const tail = svg.slice(svg.lastIndexOf('</g>') + 4, svg.lastIndexOf('</svg>'));
    assert.match(tail, /^(<path d="[^"]*" class="ink" stroke-width="[\d.]+"\/>){8}$/, `${n}: only the border after the clip group`);
  }
});

test('contact sheet frames each have their own clip id; the line-up has none', () => {
  const scenes = ['dash', 'standing', 'sitting'].map((n) => loadScene('resource/pose', n));
  const ids = [...pose.renderSheet(scenes, { seed: 11 }).matchAll(/<clipPath id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['frame-clip-0', 'frame-clip-1', 'frame-clip-2']);
  assert.doesNotMatch(pose.renderLineup({ seed: 11 }), /clipPath/);
});

test('a changed profile number changes the drawing (the tests can fail)', () => {
  const scene = loadScene('resource/pose', 'standing');
  const before = pose.renderFrame(scene, { seed: 11 }).svg;
  const tweaked = { ...scene, profile: { ...pose.PROFILES[scene.profile], leg: 1.05 } };
  assert.notEqual(pose.renderFrame(tweaked, { seed: 11 }).svg, before);
});
