# lib/pose

Draws a jointed mannequin as a rough storyboard sketch from a small JSON scene
record. Plain Node.js, no dependencies, no image model. Output is SVG.

## Files

| File | What it is |
|---|---|
| `mannequin.js` | The model and renderer |
| `profiles.json` | Body profiles (toddler to old, female and long-torso / long-leg variants) |
| `cli.js` | Command line |

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

## Known limits

- Reach targets (`ik`) bypass the joint-range check.
- Nothing detects limbs passing through each other or through props.
- Each form is drawn as its outer envelope, so there are no concave outlines.
- Depth order is by each form's average distance, which can mis-sort long
  props and overlapping limbs.
- Joint ranges, proportions and muscle shapes are estimates, not measured data.
- No environment or lighting.
- The source is prototype code with terse names. It is formatted but not yet
  refactored.
