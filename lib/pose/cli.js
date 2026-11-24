#!/usr/bin/env node
// Command line for the pose mannequin.
//
//   node lib/pose/cli.js render <scene.json | folder> [--construction] [--png]
//   node lib/pose/cli.js sheet <folder> <out.svg> [--construction]
//   node lib/pose/cli.js lineup <out.svg> [--yaw 35] [--construction]
//
// render writes an .svg beside each .json. --png also writes a .png and needs
// rsvg-convert on the PATH.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const pose = require('./mannequin.js');

const args = process.argv.slice(2);
const flag = (name) => args.includes('--' + name);
const value = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : fallback;
};
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--yaw');
const [command, first, second] = positional;

function sceneFiles(target) {
  if (fs.statSync(target).isDirectory()) {
    return fs
      .readdirSync(target)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => path.join(target, f));
  }
  return [target];
}

const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

if (command === 'render' && first) {
  for (const file of sceneFiles(first)) {
    const { svg, warnings } = pose.renderFrame(load(file), { construction: flag('construction') });
    const out = file.replace(/\.json$/, '.svg');
    fs.writeFileSync(out, svg);
    if (flag('png')) execFileSync('rsvg-convert', [out, '-o', out.replace(/\.svg$/, '.png')]);
    console.log(out + (warnings.length ? '  [' + warnings.join('; ') + ']' : ''));
  }
} else if (command === 'sheet' && first && second) {
  const scenes = sceneFiles(first).map(load);
  fs.writeFileSync(second, pose.renderSheet(scenes, { construction: flag('construction') }));
  console.log(second);
} else if (command === 'lineup' && first) {
  const svg = pose.renderLineup({ yaw: Number(value('yaw', 35)), construction: flag('construction') });
  fs.writeFileSync(first, svg);
  console.log(first);
} else {
  console.error('Usage:\n  cli.js render <scene.json | folder> [--construction] [--png]\n  cli.js sheet <folder> <out.svg> [--construction]\n  cli.js lineup <out.svg> [--yaw 35] [--construction]');
  process.exit(1);
}
