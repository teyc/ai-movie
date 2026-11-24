# lib/pose

Draws a jointed mannequin as a rough storyboard sketch from a small JSON scene
record. Plain Node.js, no dependencies, no image model. Output is SVG.

## Files

| File | What it is |
|---|---|
| `mannequin.js` | The model and renderer |
| `profiles.json` | Body profiles (toddler to old, female and long-torso / long-leg variants) |
| `cli.js` | Command line |
| `layers.js` | Parallax layer manifest: validator, digests, move interpolation |

## Use

```sh
# one scene, or every .json in a folder; writes .svg beside each .json
node lib/pose/cli.js render resource/pose/dash.json
node lib/pose/cli.js render resource/pose --png          # needs rsvg-convert

# add the skeleton, joints, cross-section rings and line of action
node lib/pose/cli.js render resource/pose/dash.json --construction

# contact sheet of a folder, and the body-profile line-up
node lib/pose/cli.js sheet resource/pose index.svg
node lib/pose/cli.js lineup profiles.svg --yaw 35

# validate a parallax layer manifest and print its digest
node lib/pose/cli.js layers test/fixtures/layers/manifest.json
```

From code:

```js
const pose = require('./lib/pose/mannequin.js');
const { svg, warnings } = pose.renderFrame(scene, { construction: false, seed: 11 });
```

`warnings` lists any joint angle that was clamped to its range, any reach
target that was out of reach, and any gaze that fell short of its target.
The same scene and seed always give the same drawing.

## Scene record

Units are metres and degrees. Axes: `x` is the figure's left, `y` is up,
`z` is the figure's front when `yaw` is 0. The ground is `y = 0`.

```json
{
  "name": "Carrying a box",
  "description": "Free text, not used by the renderer.",
  "profile": "middle-age",
  "camera": { "pos": [2.7, 1.2, 1.7], "at": [0, 1, 0.2], "zoom": 1, "rollDeg": 0 },
  "stand": true,
  "ground": true,
  "props": [{ "t": "box", "mid": ["lHa", "rHa"], "off": [0, 0.06, -0.02], "size": [0.46, 0.36, 0.36] }],
  "lineOfAction": ["head", "neck", "pelvis", "rKn", "rToe"],
  "pose": { "root": { "p": [0, 1, 0], "pitch": -8 }, "lSh": [8, 12, 0], "lEl": 75 }
}
```

| Field | Meaning |
|---|---|
| `profile` | A name from `profiles.json`, or an inline profile object |
| `camera.pos`, `camera.at` | Camera position and the point it looks at. The figure is scaled to fit the frame, so distance sets perspective, not size |
| `camera.zoom` | Above 1 crops in |
| `camera.verticalFovDeg` | Fixed camera: true perspective with this vertical field of view, centred on `at`. Without it the figure is auto-fitted to the frame |
| `frame` | `{w, h}` in drawing units; default 320 x 200. Portrait 9:16 is `{w: 180, h: 320}`. Everything but the sketched border is clipped to the frame rectangle (8 units in from the edge) |
| `camera.rollDeg` | Tilts the camera |
| `stand` | Shifts the figure so its lowest point rests on the ground. Do not combine with reach targets |
| `ground` | Draws a short ground stroke under feet, hands or knees that touch the floor |
| `lineOfAction` | Joints the construction overlay's sweep line passes through |

### Pose

Every angle is relative to the parent joint and defaults to 0. Angles
outside the range are clamped and reported.

| Key | Joint | Values | Range |
|---|---|---|---|
| `root` | Pelvis | `p` position, `yaw`, `pitch` (forward lean), `roll` | free |
| `lum` | Lower spine | `[bend forward, bend left, twist left]` | -30..60, ±25, ±10 |
| `tho` | Upper spine | same | -25..40, ±25, ±35 |
| `nk` | Neck | same, added to the default curve | ±50, ±40, ±70 |
| `hd` | Head | same; only used when `look` is `"free"` | -40..30, ±20, ±40 |
| `lSh`, `rSh` | Shoulder | `[raise forward, raise sideways, rotate]` | -50..180, -30..180, ±90 |
| `lEl`, `rEl` | Elbow | bend | 0..150 |
| `lHip`, `rHip` | Hip | `[raise forward, out sideways, rotate]` | -20..120, -25..45, ±40 |
| `lKn`, `rKn` | Knee | bend | 0..150 |
| `lAn`, `rAn` | Ankle | positive lifts the toes | -45..25 |

Other pose keys:

| Key | Meaning |
|---|---|
| `look` | A point `[x, y, z]` to look at. Omitted means the horizon straight ahead. `"free"` turns the solver off and uses `hd` |
| `lHand`, `rHand` | `"open"`, `"fist"` (default) or `"v"` |
| `ik` | Reach targets: `lWr`, `rWr` for wrists and `lAn`, `rAn` for ankles. The elbow or knee is solved to get there |
| `pole` | Optional direction hints for IK elbows: `lEl`, `rEl` |
| `foot` | Optional foot directions for IK legs: `l`, `r` |
| `flex` | Multiplies every range. 1.4 allows acrobatic arches |

The neck continues the upper spine's curve by default: it takes half the
`tho` bend plus a small forward tilt. The head then turns to face `look`.

Joint names for `lineOfAction` and prop anchors: `pelvis`, `waist`, `chest`,
`neck`, `skull`, `head`, and per side (`l`/`r`) `Sh`, `El`, `Wr`, `Ha`, `Hip`,
`Kn`, `An`, `Toe`.

### Props

| Type | Fields |
|---|---|
| `box` | `size: [w, h, d]`, and either `c` (centre) or `mid` (two joints to sit between) with optional `off`. `floor: true` rests it on the ground. `yaw` turns it. `bias` nudges its depth order |
| `bar` | `a`, `b` end points and radius `r` |
| `ladder` | `base`, `top` centre-line points, `halfWidth`, `rungSpacing` |
| `railing` | `from`, `to` at floor level, `height`, `balusterSpacing` |

### Profiles

Multipliers on the adult skeleton: `h` (height), `leg`, `torso`, `arm`,
`neck`, `head`, `sh` (shoulder width), `hip`, `rib`, `girth`, `belly`,
`breast`. `post` adds default posture offsets per joint type, and `flex`
scales joint ranges.

## Layer manifest

One manifest per shot describes a board split into cutout layers by depth,
and the parallax move assembly applies to them (plan section 7a.3). It is
written by hand in phase A and by the exporter in phase B, and read by the
compiler. The fixture is `test/fixtures/layers/manifest.json`; validate with
`node lib/pose/cli.js layers <manifest.json>`.

```json
{
  "kind": "layer-manifest",
  "version": 1,
  "shot": "sh2",
  "scene": "scenes/sh2.json",
  "canvas": { "w": 200, "h": 340 },
  "frame": { "x": 10, "y": 10, "w": 180, "h": 320 },
  "layers": [
    { "id": "wall", "art": "wall.svg", "digest": "sha256:…", "depth": 2.55, "origin": [100, 170] },
    { "id": "mia", "art": "mia.svg", "digest": "sha256:…", "depth": 1.9, "origin": [100, 170], "group": "rail" },
    { "id": "balusters", "art": "balusters.svg", "digest": "sha256:…", "depth": 1.7, "origin": [100, 170], "group": "rail" }
  ],
  "move": {
    "easing": "ease-in-out",
    "from": { "wall": { "t": [0, 0], "s": 1 }, "rail": { "t": [0, 0], "s": 1 } },
    "to": { "wall": { "t": [-4.8, 0], "s": 1 }, "rail": { "t": [-7.2, 0], "s": 1 } }
  },
  "fixed": [
    { "id": "paper", "kind": "paper", "stack": "under", "art": "paper.svg", "digest": "sha256:…" },
    { "id": "caption", "kind": "caption", "stack": "over", "box": [16, 262, 148, 40] }
  ]
}
```

| Field | Meaning |
|---|---|
| `canvas` | `{w, h}`: the common artwork size. Every layer is drawn at full canvas size, transparent where empty. Units are the artwork's own: SVG user units (the scene's drawing units), or pixels for raster layers |
| `frame` | `{x, y, w, h}`: the delivery window inside the canvas. The margin around it is overscan, and it caps how far a move can go before an edge shows. Must lie inside the canvas |
| `board` | Optional `{art, digest}`: the fully inked board at frame size. The zero-offset composite's frame window must match it (the exporter's flatten-and-compare check) |
| `layers` | Ordered back to front; the list order is the stacking order. `art` is a path inside the manifest's folder; `digest` is `sha256:` and the 64 hex digits of the file's bytes |
| `layers[].depth` | Camera distance in metres of the nearest point the layer shows, taken from the scene record (true geometry, not the renderer's depth `bias`). It may not increase down the list. A group's depth is its nearest layer's |
| `layers[].origin` | `[x, y]` in canvas units: the point the layer scales about |
| `layers[].group` | Layers that touch (a hand on a rail) share one group and so one transform, so a grip or a foot can't slide. A layer without a group is its own group, named by its `id`. Layers in a group must have the same origin, and no other layer's `id` may equal a group name |
| `move` | Optional; without it the board is held still. `from` and `to` map group names to `{t: [dx, dy], s}`. A group not named keeps the identity (`t: [0, 0]`, `s: 1`). `s` must be above 0. `easing` is one of `linear`, `ease-in` (u²), `ease-out` (1 − (1 − u)²), `ease-in-out` (3u² − 2u³); optional `easings` maps a group to its own. The transforms are authoritative |
| `fixed` | Items fixed in delivery space, not moved: `paper` (at most one), `frame-marks` (each with `art` and `digest`, drawn at frame size) and `caption` (a `box` `[x, y, w, h]` inside the frame). `stack` is `under` or `over` the layers; paper is always under |

A point `p` of a layer's art lands at `origin + s · (p − origin) + t` in
canvas space, and at that minus `[frame.x, frame.y]` in delivery space. The
move has no duration: it runs over the shot, from `u = 0` on the shot's first
frame to `u = 1` on its last, and the shot's length comes from the cuts in
the timed voice. `t` and `s` are interpolated by the eased `u`
(`layers.transformAt(move, group, u)`).

The manifest's own digest is sha256 of its file bytes. The edit pins it so
preview and assembly use the same split. Unknown fields are rejected so typos
fail. The validator does not check that near layers move more than far
ones, or in the same direction: a manifest holds finished transforms, not
the camera move behind them, so a tracking shot (near group held, background
drifting) or per-group easing can't be judged from it. Nor does it check that
`board`, paper and frame-mark art are drawn at frame size. Rate order through
the whole move, and that no cutout edge, gap or frame edge shows, belong to
the compiler (am-e-asm-qgh.5).

## Known limits

- Reach targets (`ik`) bypass the joint-range check.
- Nothing detects limbs passing through each other or through props.
- Each form is drawn as its outer envelope, so there are no concave outlines.
- Depth order is by each form's average distance, which can mis-sort long
  props and overlapping limbs.
- Joint ranges, proportions and muscle shapes are estimates, not measured data.
- No environment or lighting. Very large boxes (walls) can sort in front of nearer forms; give them a positive `bias` until the visibility check lands.
- The fixed camera does not yet clip forms crossing the near plane; keep the camera clear of geometry.
- The source is prototype code with terse names. It is formatted but not yet
  refactored.
