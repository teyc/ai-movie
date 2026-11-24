'use strict';
// Layer manifest validator (lib/pose/layers.js) against the hand-authored
// fixture in test/fixtures/layers/.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const L = require('../lib/pose/layers.js');

const dir = path.join(__dirname, 'fixtures', 'layers');
const file = path.join(dir, 'manifest.json');
const fixture = () => JSON.parse(fs.readFileSync(file, 'utf8'));
const check = (m) => L.validateManifest(m, { baseDir: dir });
const paths = (errors) => errors.map((e) => e.slice(0, e.indexOf(':')));

test('the fixture validates, art digests included', () => {
  const r = L.validateManifestFile(file);
  assert.deepStrictEqual(r.errors, []);
  assert.strictEqual(r.digest, L.digestOf(fs.readFileSync(file)));
  assert.strictEqual(r.manifest.layers.length, 3);
});

test('a missing digest fails with its path', () => {
  const m = fixture();
  delete m.layers[1].digest;
  assert.deepStrictEqual(check(m), ['layers[1].digest: missing']);
});

test('a missing digest on fixed artwork fails with its path', () => {
  const m = fixture();
  delete m.fixed[0].digest;
  assert.deepStrictEqual(check(m), ['fixed[0].digest: missing']);
});

test('reversed depth order fails with its path', () => {
  const m = fixture();
  m.layers[2].depth = 3; // balusters drawn last but placed behind the wall
  const e = check(m);
  assert.deepStrictEqual(paths(e), ['layers[2].depth']);
  assert.match(e[0], /farther than layers\[1\]\.depth 1\.9; layers run back to front/);
});

test('equal depths are allowed', () => {
  const m = fixture();
  m.layers[2].depth = 1.9;
  assert.deepStrictEqual(check(m), []);
});

test('a digest that does not match its file fails', () => {
  const m = fixture();
  m.layers[0].digest = 'sha256:' + '0'.repeat(64);
  const e = check(m);
  assert.deepStrictEqual(paths(e), ['layers[0].digest']);
  assert.match(e[0], /does not match wall\.svg \(sha256:3f2c29d4/);
});

test('a malformed digest and a missing art file fail', () => {
  const m = fixture();
  m.layers[0].digest = 'sha256:ABC';
  m.layers[1].art = 'nowhere.svg';
  assert.deepStrictEqual(paths(check(m)), ['layers[0].digest', 'layers[1].art']);
});

test('without a base directory, files are not read', () => {
  const m = fixture();
  m.layers[1].art = 'nowhere.svg';
  assert.deepStrictEqual(L.validateManifest(m), []);
});

test('layers in one group must share an origin', () => {
  const m = fixture();
  m.layers[2].origin = [90, 170];
  const e = check(m);
  assert.deepStrictEqual(paths(e), ['layers[2].origin']);
  assert.match(e[0], /group "rail"/);
});

test('a layer id that doubles as another group name fails', () => {
  const m = fixture();
  m.layers[0].id = 'rail';
  m.move.from = { rail: { t: [0, 0], s: 1 } };
  m.move.to = { rail: { t: [-7.2, 0], s: 1 } };
  assert.deepStrictEqual(paths(check(m)), ['layers[0].id']);
});

test('duplicate ids fail, across layers and fixed items', () => {
  const m = fixture();
  m.fixed[1].id = 'wall';
  assert.deepStrictEqual(paths(check(m)), ['fixed[1].id']);
});

test('the move must name real groups, a known easing and positive scales', () => {
  const m = fixture();
  m.move.easing = 'bounce';
  m.move.to.nope = { t: [0, 0], s: 1 };
  m.move.to.wall.s = 0;
  m.move.from.rail.t = [1];
  assert.deepStrictEqual(paths(check(m)), ['move.easing', 'move.from.rail.t', 'move.to.wall.s', 'move.to.nope']);
});

test('a layer name inside a group is not a move target', () => {
  const m = fixture();
  m.move.to.mia = { t: [0, 0], s: 1 };
  assert.deepStrictEqual(paths(check(m)), ['move.to.mia']);
});

test('a manifest with no move is a held board', () => {
  const m = fixture();
  delete m.move;
  assert.deepStrictEqual(check(m), []);
  assert.deepStrictEqual(L.transformAt(undefined, 'wall', 0.5), { t: [0, 0], s: 1 });
});

test('the frame must lie inside the canvas, and captions inside the frame', () => {
  const m = fixture();
  m.frame.x = 30; // 30 + 180 > 200
  m.fixed[1].box = [16, 300, 148, 40]; // 300 + 40 > 320
  assert.deepStrictEqual(paths(check(m)), ['frame', 'fixed[1].box']);
});

test('fixed items need a known kind and stack, and paper goes under', () => {
  const m = fixture();
  m.fixed[0].stack = 'over';
  m.fixed[1].kind = 'title';
  delete m.fixed[1].stack;
  assert.deepStrictEqual(paths(check(m)), ['fixed[0].stack', 'fixed[1].kind', 'fixed[1].stack']);
});

test('unknown fields fail, so typos are caught', () => {
  const m = fixture();
  m.layers[0].dept = 2;
  m.moves = {};
  assert.deepStrictEqual(paths(check(m)), ['moves', 'layers[0].dept']);
});

test('header, canvas and layer list are required', () => {
  assert.deepStrictEqual(paths(L.validateManifest({})), ['kind', 'version', 'shot', 'canvas', 'frame', 'layers']);
  assert.deepStrictEqual(L.validateManifest(null), ['(root): manifest must be an object']);
});

test('invalid JSON is reported, not thrown', (t) => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'layers-'));
  t.after(() => fs.rmSync(tmp, { recursive: true }));
  const bad = path.join(tmp, 'm.json');
  fs.writeFileSync(bad, '{ "kind": ');
  assert.match(L.validateManifestFile(bad).errors[0], /^\(root\): not valid JSON/);
});

test('rate order is left to the compiler (a tracking shot validates)', () => {
  // The near group held still while the wall drifts: valid when the camera
  // follows the subject. The validator does not judge rate order or direction.
  const m = fixture();
  m.move.to = { wall: { t: [-6, 0], s: 1 } };
  assert.deepStrictEqual(check(m), []);
});

test('a push-in interpolates scale', () => {
  const m = fixture();
  m.move.to.wall.s = 1.03;
  m.move.to.rail.s = 1.08;
  assert.deepStrictEqual(check(m), []);
  assert.deepStrictEqual(L.transformAt(m.move, 'rail', 0.5), { t: [-3.6, 0], s: 1.04 });
});

test('a move may name a group at one end only', () => {
  const m = fixture();
  delete m.move.from.wall;
  delete m.move.from.rail;
  assert.deepStrictEqual(check(m), []);
  assert.deepStrictEqual(L.transformAt(m.move, 'rail', 1), { t: [-7.2, 0], s: 1 });
});

test('a group may have its own easing', () => {
  const m = fixture();
  m.move.easings = { rail: 'linear', nope: 'ease-in', wall: 'bounce' };
  assert.deepStrictEqual(paths(check(m)), ['move.easings.nope', 'move.easings.wall']);
  m.move.easings = { rail: 'linear' };
  assert.deepStrictEqual(check(m), []);
  assert.deepStrictEqual(L.transformAt(m.move, 'rail', 0.25), { t: [-1.8, 0], s: 1 });
});

test('ids that are Object prototype keys are handled', () => {
  const m = fixture();
  m.layers[0].id = 'constructor';
  m.move.from = { rail: { t: [0, 0], s: 1 } };
  m.move.to = { rail: { t: [-7.2, 0], s: 1 } };
  assert.deepStrictEqual(check(m), []);
  assert.deepStrictEqual(L.transformAt(m.move, 'constructor', 1), { t: [0, 0], s: 1 });
  assert.deepStrictEqual(L.transformAt(m.move, 'toString', 1), { t: [0, 0], s: 1 });
});

test('group members need not be adjacent in the stack', () => {
  const m = fixture();
  m.layers.push({ ...m.layers[1], id: 'mia-hand', depth: 1.6 }); // a hand drawn over the rail
  m.move.to = { wall: { t: [-4.8, 0], s: 1 }, rail: { t: [-7.2, 0], s: 1 } };
  assert.deepStrictEqual(check(m), []);
});

test('the inked board is pinned by digest', () => {
  const m = fixture();
  m.board = { art: 'paper.svg', digest: m.fixed[0].digest };
  assert.deepStrictEqual(check(m), []);
  delete m.board.digest;
  assert.deepStrictEqual(check(m), ['board.digest: missing']);
});

test('art must stay inside the manifest folder and be a file', () => {
  const m = fixture();
  m.layers[0].art = '../layers.test.js';
  m.layers[1].art = '.';
  assert.deepStrictEqual(check(m).map((e) => e.replace(/ \(.*/, '')), [
    'layers[0].art: must be a path inside the manifest\'s folder',
    'layers[1].art: not a file: .',
  ]);
});

test('only one paper', () => {
  const m = fixture();
  m.fixed.push({ ...m.fixed[0], id: 'paper2' });
  assert.deepStrictEqual(paths(check(m)), ['fixed[2].kind']);
});

test('a missing manifest file is reported, not thrown', () => {
  const r = L.validateManifestFile(path.join(dir, 'missing.json'));
  assert.match(r.errors[0], /^\(root\): cannot read .*missing\.json: ENOENT/);
});

test('easings run 0 to 1 and the move interpolates per group', () => {
  for (const name of L.EASINGS) {
    assert.strictEqual(L.ease(name, 0), 0);
    assert.strictEqual(L.ease(name, 1), 1);
  }
  assert.strictEqual(L.ease('ease-in-out', 0.5), 0.5);
  assert.strictEqual(L.ease('ease-in', 0.5), 0.25);
  assert.strictEqual(L.ease('linear', 2), 1);
  const mv = fixture().move;
  assert.deepStrictEqual(L.transformAt(mv, 'rail', 0.5), { t: [-3.6, 0], s: 1 });
  assert.deepStrictEqual(L.transformAt(mv, 'wall', 1), { t: [-4.8, 0], s: 1 });
  assert.deepStrictEqual(L.transformAt(mv, 'unnamed', 1), { t: [0, 0], s: 1 });
  assert.throws(() => L.ease('bounce', 0.5), /unknown easing/);
  assert.deepStrictEqual(fixture().layers.map(L.groupOf), ['wall', 'rail', 'rail']);
});
