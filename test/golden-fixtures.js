// Shared fixture list for the pose golden tests and the review tool.
// The manifest decides coverage; the folder is only checked against it.
'use strict';
const fs = require('fs');
const path = require('path');
const pose = require('../lib/pose/mannequin.js');

const ROOT = path.join(__dirname, '..');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(__dirname, 'pose-manifest.json'), 'utf8'));
const GOLDEN_DIR = path.join(__dirname, 'golden');

function loadScene(folder, name) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, folder, name + '.json'), 'utf8'));
}

// Every fixture: { id, render() -> { svg, warnings } }
function fixtures() {
  const seed = MANIFEST.seed;
  const out = [];
  const { folder, scenes, construction } = MANIFEST.frames;
  for (const name of scenes) {
    for (const c of construction) {
      out.push({
        id: `frame-${name}${c ? '-construction' : ''}`,
        scene: name,
        render: () => pose.renderFrame(loadScene(folder, name), { seed, construction: c }),
      });
    }
  }
  for (const s of MANIFEST.sheets) {
    out.push({
      id: s.name,
      render: () => {
        const names = MANIFEST.frames.scenes;
        return { svg: pose.renderSheet(names.map((n) => loadScene(s.folder, n)), { seed, construction: s.construction }), warnings: [] };
      },
    });
  }
  for (const l of MANIFEST.lineups) {
    out.push({ id: l.name, render: () => ({ svg: pose.renderLineup({ seed, yaw: l.yaw }), warnings: [] }) });
  }
  return out;
}

const goldenPath = (id) => path.join(GOLDEN_DIR, id + '.svg');

module.exports = { MANIFEST, ROOT, GOLDEN_DIR, fixtures, goldenPath, loadScene };
