'use strict';
// Parallax layer manifest: validation, digests and the move's interpolation.
// The format is documented in README.md, section "Layer manifest".
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EASINGS = ['linear', 'ease-in', 'ease-out', 'ease-in-out'];
const FIXED_KINDS = ['paper', 'frame-marks', 'caption'];
const DIGEST = /^sha256:[0-9a-f]{64}$/;

const digestOf = (buf) => 'sha256:' + crypto.createHash('sha256').update(buf).digest('hex');

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isStr = (v) => typeof v === 'string' && v.length > 0;
const isPair = (v) => Array.isArray(v) && v.length === 2 && v.every(isNum);

// Returns a list of "path: message" strings; empty means valid. With
// opts.baseDir, every art file is read and checked against its digest.
function validateManifest(m, opts = {}) {
  const errors = [];
  const err = (p, msg) => errors.push(`${p}: ${msg}`);
  const only = (obj, p, keys) => {
    for (const k of Object.keys(obj)) if (!keys.includes(k)) err(p ? `${p}.${k}` : k, 'unknown field');
  };

  if (!isObj(m)) return ['(root): manifest must be an object'];
  only(m, '', ['kind', 'version', 'shot', 'scene', 'description', 'canvas', 'frame', 'board', 'layers', 'move', 'fixed']);
  if (m.kind !== 'layer-manifest') err('kind', 'must be "layer-manifest"');
  if (m.version !== 1) err('version', 'must be 1');
  if (!isStr(m.shot)) err('shot', 'must be a shot id');
  if (m.scene !== undefined && !isStr(m.scene)) err('scene', 'must be a path to the scene record');
  if (m.description !== undefined && typeof m.description !== 'string') err('description', 'must be text');

  const canvasOk = isObj(m.canvas) && isNum(m.canvas.w) && isNum(m.canvas.h) && m.canvas.w > 0 && m.canvas.h > 0;
  if (!canvasOk) err('canvas', 'must be {w, h} with both above 0');
  else only(m.canvas, 'canvas', ['w', 'h']);

  const f = m.frame;
  const frameOk = isObj(f) && ['x', 'y', 'w', 'h'].every((k) => isNum(f[k])) && f.w > 0 && f.h > 0;
  if (!frameOk) err('frame', 'must be {x, y, w, h} with w and h above 0');
  else {
    only(f, 'frame', ['x', 'y', 'w', 'h']);
    if (canvasOk && (f.x < 0 || f.y < 0 || f.x + f.w > m.canvas.w || f.y + f.h > m.canvas.h)) {
      err('frame', 'must lie inside the canvas');
    }
  }

  const checkArt = (item, p) => {
    let artOk = false;
    if (!isStr(item.art)) err(`${p}.art`, 'must be a path to the artwork');
    else if (path.isAbsolute(item.art) || path.normalize(item.art).split(path.sep)[0] === '..') {
      err(`${p}.art`, 'must be a path inside the manifest\'s folder');
    } else artOk = true;
    if (item.digest === undefined) err(`${p}.digest`, 'missing');
    else if (typeof item.digest !== 'string' || !DIGEST.test(item.digest)) err(`${p}.digest`, 'must be "sha256:" and 64 lowercase hex digits');
    else if (opts.baseDir && artOk) {
      const file = path.join(opts.baseDir, item.art);
      if (!fs.existsSync(file)) err(`${p}.art`, `file not found: ${item.art}`);
      else if (!fs.statSync(file).isFile()) err(`${p}.art`, `not a file: ${item.art}`);
      else {
        const actual = digestOf(fs.readFileSync(file));
        if (actual !== item.digest) err(`${p}.digest`, `does not match ${item.art} (${actual})`);
      }
    }
  };

  const ids = new Map(); // id -> path where first used
  const claimId = (id, p) => {
    if (!isStr(id)) return err(`${p}.id`, 'must be a non-empty id');
    if (ids.has(id)) return err(`${p}.id`, `"${id}" is already used at ${ids.get(id)}`);
    ids.set(id, p);
  };

  const groups = new Map(); // group name -> index of its first layer
  if (!Array.isArray(m.layers) || m.layers.length === 0) err('layers', 'must be a non-empty list, back to front');
  else {
    m.layers.forEach((l, i) => {
      const p = `layers[${i}]`;
      if (!isObj(l)) return err(p, 'must be an object');
      only(l, p, ['id', 'art', 'digest', 'depth', 'origin', 'group']);
      claimId(l.id, p);
      checkArt(l, p);
      if (!isNum(l.depth) || l.depth <= 0) err(`${p}.depth`, 'must be a distance from the camera in metres, above 0');
      else if (i > 0 && isObj(m.layers[i - 1]) && isNum(m.layers[i - 1].depth) && l.depth > m.layers[i - 1].depth) {
        err(`${p}.depth`, `${l.depth} is farther than layers[${i - 1}].depth ${m.layers[i - 1].depth}; layers run back to front`);
      }
      if (!isPair(l.origin)) err(`${p}.origin`, 'must be [x, y] in canvas units');
      if (l.group !== undefined && !isStr(l.group)) err(`${p}.group`, 'must be a non-empty name');
      const g = isStr(l.group) ? l.group : l.id;
      if (!isStr(g)) return;
      if (!groups.has(g)) groups.set(g, i);
      else {
        const first = m.layers[groups.get(g)];
        if (isPair(l.origin) && isPair(first.origin) && (l.origin[0] !== first.origin[0] || l.origin[1] !== first.origin[1])) {
          err(`${p}.origin`, `differs from layers[${groups.get(g)}].origin in group "${g}"; a group shares one transform`);
        }
      }
    });
    // An ungrouped layer is its own group, named by its id; another layer may
    // not join it by accident through a group of the same name.
    const named = new Set(m.layers.filter((l) => isObj(l) && isStr(l.group)).map((l) => l.group));
    m.layers.forEach((l, i) => {
      if (isObj(l) && l.group === undefined && isStr(l.id) && named.has(l.id)) {
        err(`layers[${i}].id`, `"${l.id}" is also a group name used by other layers; give this layer that group explicitly or rename it`);
      }
    });
  }

  if (m.board !== undefined) {
    if (!isObj(m.board)) err('board', 'must be {art, digest}');
    else {
      only(m.board, 'board', ['art', 'digest']);
      checkArt(m.board, 'board');
    }
  }

  if (m.move !== undefined) {
    const mv = m.move;
    const before = errors.length;
    if (!isObj(mv)) err('move', 'must be an object (omit it to hold the board still)');
    else {
      only(mv, 'move', ['easing', 'easings', 'from', 'to']);
      if (!EASINGS.includes(mv.easing)) err('move.easing', `must be one of ${EASINGS.join(', ')}`);
      if (mv.easings !== undefined) {
        if (!isObj(mv.easings)) err('move.easings', 'must map group names to an easing');
        else for (const [g, e] of Object.entries(mv.easings)) {
          if (!groups.has(g)) err(`move.easings.${g}`, 'no layer or group of this name');
          if (!EASINGS.includes(e)) err(`move.easings.${g}`, `must be one of ${EASINGS.join(', ')}`);
        }
      }
      for (const end of ['from', 'to']) {
        const set = mv[end];
        if (!isObj(set)) { err(`move.${end}`, 'must map group names to {t, s}'); continue; }
        for (const [g, tr] of Object.entries(set)) {
          const p = `move.${end}.${g}`;
          if (!groups.has(g)) err(p, 'no layer or group of this name');
          if (!isObj(tr)) { err(p, 'must be {t: [dx, dy], s}'); continue; }
          only(tr, p, ['t', 's']);
          if (!isPair(tr.t)) err(`${p}.t`, 'must be [dx, dy] in canvas units');
          if (!isNum(tr.s) || tr.s <= 0) err(`${p}.s`, 'must be a scale above 0');
        }
      }
    }
    // Parallax: a nearer group moves (translates and rescales) at least as
    // much as any farther group. A group's depth is its nearest layer's.
    if (errors.length === before && isObj(mv) && Array.isArray(m.layers) && m.layers.every(isObj)) {
      const depthOf = new Map();
      for (const l of m.layers) {
        const g = groupOf(l);
        if (isNum(l.depth)) depthOf.set(g, Math.min(depthOf.get(g) ?? Infinity, l.depth));
      }
      const amount = (g) => {
        const a = transformAt(mv, g, 0), b = transformAt(mv, g, 1);
        return { t: Math.hypot(b.t[0] - a.t[0], b.t[1] - a.t[1]), s: Math.abs(b.s - a.s) };
      };
      const order = [...depthOf.entries()].sort((x, y) => y[1] - x[1]); // far to near
      order.forEach(([near, dn], j) => {
        const an = amount(near);
        for (const [far, df] of order.slice(0, j)) {
          if (df <= dn) continue;
          const af = amount(far);
          if (an.t < af.t - 1e-9 || an.s < af.s - 1e-9) {
            err(`move.to.${near}`, `moves less than "${far}", which is farther (${df} m against ${dn} m); near layers move more`);
            break;
          }
        }
      });
    }
  }

  if (m.fixed !== undefined) {
    let paper = -1;
    if (!Array.isArray(m.fixed)) err('fixed', 'must be a list');
    else m.fixed.forEach((x, i) => {
      const p = `fixed[${i}]`;
      if (!isObj(x)) return err(p, 'must be an object');
      claimId(x.id, p);
      if (!FIXED_KINDS.includes(x.kind)) err(`${p}.kind`, `must be one of ${FIXED_KINDS.join(', ')}`);
      if (x.kind === 'paper') {
        if (paper >= 0) err(`${p}.kind`, `only one paper; fixed[${paper}] is already paper`);
        else paper = i;
      }
      if (x.stack !== 'under' && x.stack !== 'over') err(`${p}.stack`, 'must be "under" or "over" the layers');
      else if (x.kind === 'paper' && x.stack !== 'under') err(`${p}.stack`, 'paper goes under the layers');
      if (x.kind === 'caption') {
        only(x, p, ['id', 'kind', 'stack', 'box']);
        const b = x.box;
        if (!(Array.isArray(b) && b.length === 4 && b.every(isNum) && b[2] > 0 && b[3] > 0)) {
          err(`${p}.box`, 'must be [x, y, w, h] in frame units');
        } else if (frameOk && (b[0] < 0 || b[1] < 0 || b[0] + b[2] > f.w || b[1] + b[3] > f.h)) {
          err(`${p}.box`, 'must lie inside the frame');
        }
      } else if (FIXED_KINDS.includes(x.kind)) {
        only(x, p, ['id', 'kind', 'stack', 'art', 'digest']);
        checkArt(x, p);
      }
    });
  }

  return errors;
}

// Reads and validates a manifest file, checking artwork digests against the
// files beside it. The manifest's own digest is sha256 of the file's bytes.
function validateManifestFile(file) {
  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch (e) {
    return { errors: [`(root): cannot read ${file}: ${e.code || e.message}`], digest: null };
  }
  let m;
  try {
    m = JSON.parse(buf.toString('utf8'));
  } catch (e) {
    return { errors: [`(root): not valid JSON: ${e.message}`], digest: digestOf(buf) };
  }
  return { errors: validateManifest(m, { baseDir: path.dirname(file) }), digest: digestOf(buf), manifest: m };
}

function ease(name, u) {
  const x = Math.min(1, Math.max(0, u));
  switch (name) {
    case 'linear': return x;
    case 'ease-in': return x * x;
    case 'ease-out': return 1 - (1 - x) * (1 - x);
    case 'ease-in-out': return x * x * (3 - 2 * x);
    default: throw new Error(`unknown easing "${name}"`);
  }
}

// The transform of a group at u (0 at the shot's first frame, 1 at its last).
// A group the move does not name keeps the identity transform at that end.
// move.easings may give a group its own easing.
function transformAt(move, group, u) {
  const id = { t: [0, 0], s: 1 };
  if (!move) return id;
  const own = (o, k) => (o && Object.hasOwn(o, k) ? o[k] : undefined);
  const a = own(move.from, group) || id;
  const b = own(move.to, group) || id;
  const k = ease(own(move.easings, group) || move.easing, u);
  return { t: [a.t[0] + (b.t[0] - a.t[0]) * k, a.t[1] + (b.t[1] - a.t[1]) * k], s: a.s + (b.s - a.s) * k };
}

const groupOf = (layer) => layer.group || layer.id;

module.exports = { validateManifest, validateManifestFile, digestOf, ease, transformAt, groupOf, EASINGS };
