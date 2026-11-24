# Review: am-e-board-1wg.17 (street props), second model

Checked: AGENTS.md, bead, diff of lib/pose/mannequin.js, lib/pose/README.md,
test/pose-manifest.json, test/pose.golden.test.js, the four prop-*.json
fixtures, child-peek must-see lists. `node --test`: 98 tests, 94 pass, 4 fail,
and the four are exactly the expected missing goldens (test-prop-scooter,
-street-sh1, -light-sh3, -car). Every existing golden passes byte-identical.
Rendered the four fixtures (`--png`, full size and 90x160 thumbnail).
Scratch: /private/tmp/claude-501/-Users-chuitey-OSS-ai-movie/435539f6-43d6-44ce-87d0-75b880ed88d9/scratchpad/review4/

## 1. Wrong against the bead

- HIGH: The empty parking bay does not read (acceptance: a fresh viewer
  names it). test/fixtures/pose/prop-street-sh1.json renders the bay as two
  stray heavy lines at the bottom of the frame (the far end line and one side
  line, the other side off-frame). At full size and at thumbnail it looks like a
  road corner or a kerb return, not a bay. Needs a camera or bay placement
  where both side lines and the end line show, or a wider bay depiction (for
  example parallel side lines visibly running to the kerb), then a re-look.
  Human should judge before approving that golden.
- MEDIUM: sh3 must-see is "one bright light rounding the corner under the
  streetlight". prop-light-sh3.json has a streetlight prop but it is not
  recognisable in the render; the frame shows the rail, a corner kerb wedge at
  the left, and a lone lamp. The lamp reads (see item 5) but "under the
  streetlight" is not demonstrated. Either move the streetlight into frame or
  record that sh3 will not show it.
- MEDIUM: bead asks for "a seated rider pose". No pose or preset was added;
  the rider is a hand-built `ik` block in prop-scooter.json (README says so).
  It reads acceptably, but the next scene needs to copy ten numbers. Fine if the
  human accepts the fixture as the deliverable, otherwise file a follow-up bead.
- Otherwise met: scooter (two wheels, body, bars), square box on rack, car,
  streetlight, kerb, bay, lamp with beam wedge, README entries, fixtures not in
  child-peek, existing goldens unchanged.

## 2. Bugs and edge cases

- MEDIUM: README and comment say kerb `side` 1 puts the footpath on the LEFT of
  from-to. The code (lib/pose/mannequin.js, kerb: `n = [-d[2],0,d[0]] * side`)
  gives +z for travel along +x, which is the RIGHT of travel seen from above
  with y up. The fixtures are consistent with the code (side -1 towards the
  balcony wall), so the docs are wrong. Fix the README table line and the code
  comment (lib/pose/README.md street table, `kerb` row).
- LOW: missing required fields fail with raw TypeErrors ("Cannot read
  properties of undefined (reading '0')") for kerb without `to`/`from` and lamp
  without `at`. The new test only asserts `assert.throws` on one of these, so it
  passes by accident of the exception type. A validation message would be
  better; `scooter`/`car` with no `at` silently default to the origin.
- LOW: standalone `lamp` defaults `ground` to 0, but the street sits at y = -6
  in these scenes. A beam without `ground` floats silently at y = 0.
- LOW: lamp with zero `dir` and a vertical `dir` with `beam` do not crash or
  produce NaN (checked), but the beam collapses to nothing silently. Zero-length
  kerb draws a point, no NaN.
- LOW: non-flat street props (wheels, boxes, lamps) behind the camera are not
  clipped; P2 clamps z to 0.05 so a car behind the camera draws a stretched
  shape (render length grew 18.4k to 25.6k chars). The README concedes the
  near-plane limit for forms, so this is expected but worth a bead before the
  environment presets.
- Near-plane clip maths checked: NEAR = 0.3, `t = (NEAR - za)/(zb - za)`,
  `lerp(A,B,t)`: correct for either endpoint behind; the divisor is non-zero
  because the branch is only reached when exactly one endpoint is < NEAR. The
  all-in-front branch keeps the original single stroke (2 points) or the arc
  polyline; the clipped branch draws each arc chord as a straight segment, fine.
  Camera-space `cs` uses the same basis as P2, so consistent.
- No effect on existing scenes: the new flat loop, wheel, lamp and `extra`
  paths run only for the new prop types (`pr.t === 'flat'` etc.) and consume
  `rnd()` only inside them, so existing random sequences and frame fitting
  (fit uses joints only) are untouched. Confirmed by the 94 passing goldens.

## 3. Safety

Nothing found. No I/O, no shelling out, no network added.

## 4. Tests

- The clip test only checks `max |coordinate| < 5000` and that a fully-behind
  kerb leaves the SVG length unchanged. It does not test a multi-point arc
  (lamp beam) straddling the near plane, nor that the clipped end lands near the
  frame edge rather than just "not huge". A coordinate bound of 5000 is loose.
- The `box: false` test proves only "shorter SVG". There is no test for the
  depth sort of the scooter (rider over body) or the car cabin bias; those are
  covered only by the goldens, which the human reviews by eye.
- No test for missing-field errors beyond one `assert.throws` (see Bugs).
- No test that the kerb `side` convention matches the README (would have caught
  the left/right error).

## 5. Drawing changes

Depth sorting: scooter parts and car cabin (`bias: -1`) look right in all
renders; the cabin sits over the body, far wheels are hidden, near wheels draw
over the body. Sorting is by average depth, so a camera very close to a long
car could still mis-sort, as README already warns.

What reads:
- prop-scooter: at thumbnail a viewer names a scooter with a rider, a clear
  square box on the back, two wheels (rear wheel is mostly behind the body but
  its tyre shows), and a single headlight starburst. The best of the four.
- prop-car: reads as a boxy van or truck with four wheels (two visible on the
  far side), two lamps with halos and ground wedges. The README admits the
  upright windscreen. Beam wedges look right but start low-left and are long.
- prop-light-sh3: a lone starburst with a faint ground wedge reads as "a
  light" at thumbnail, but it is small and the rail dominates the frame.

What does not:
- prop-street-sh1: the bay (see High) and the kerb read, the streetlight post
  reads, the figure gives scale. The bay is the failure.
- prop-light-sh3: streetlight not identifiable (Medium above); the corner reads
  only as two light kerb lines at the left.

Conventions: halo ticks are ten short radial strokes round a lamp, in ink.
They are on the prop layer, not the mannequin, and are not hatching, but they
are close to "speed/emphasis lines", which AGENTS.md rules out for the
mannequin layer, and the starburst looks like a sun or sparkle at thumbnail.
MEDIUM: needs the human's explicit okay (the bead says the value pass shades
the light later); otherwise replace with a plain ringed disc plus the beam
wedge. Nothing else conflicts: no hatching, no fingers, no spiky hair.

## 6. Simplifications

- The three beam strokes (two edges plus an arc) could be one polyline in a
  single `flat` item; low value.
- `flat` needs the `pr.pts.length === 2` special case only to get seg()
  overshoot; the clipped branch always calls seg. Using seg for 2-point strokes
  in both paths (it already does) lets the first branch be dropped. Low.
- `STREET` handlers and `expandProps` are otherwise tidy and the placer helper
  is a good shared frame.

## Summary

High: bay does not read in prop-street-sh1 (acceptance criterion).
Medium: streetlight not shown in prop-light-sh3 (sh3 must-see); no seated-rider
pose preset (only a fixture ik block); kerb `side` documented backwards;
halo ticks vs the "no speed lines" convention need the human's decision.
The four missing goldens are the only failing tests; existing goldens are
byte-identical.

## Second pass (Sonnet 5.5)

Checked the delta in lib/pose/mannequin.js, README, tests and the two changed
fixtures. `node --test`: 98 tests, 94 pass, exactly the four expected golden
failures. Existing goldens still byte-identical. Scratch renders in
scratchpad/review4/ (n-*.png, nthumbs.png, wall.png).

Findings

- HIGH (needs human eye, as before): the empty bay still does not read at
  90x160. prop-street-sh1 now shows a car cut off by the left frame edge
  (reads as a van/truck seen from behind, not clearly a parked car), the far
  bay line sits on top of the kerb so it merges into it, and the "empty bay"
  is two diagonal strokes at the bottom. A viewer would name a street with a
  truck and a kerb, not "an empty parking bay". Ideas: shift the camera so the
  car is fully in frame and both bays show; give the bay a visible far end line
  one metre off the kerb; or accept the README's own note ("a lone empty bay
  reads weakly") and re-aim sh1 instead.
- MEDIUM: README line 134 is stale: "Kerbs, bay lines and beams are drawn on the
  ground plane under everything else". Beams are now depth-sorted items; only
  flats are under everything. The comment at mannequin.js:1120 and
  lampParts' "laid on the ground" wording at :1220 are similar. Doc fix only.
- MEDIUM: the lamp (disc and halo ticks) is still not near-plane clipped, so a
  lamp behind the camera draws a halo with coordinates near 11,700 (checked
  with a lamp 6 m behind the camera, beam clipped correctly). The new clip
  test only covers kerbs. Low in practice (lamps behind the camera are not a
  shot), but the README says clipping covers beams; say lamps are excepted.
- LOW: `need()` is only used for kerb and lamp. scooter/car/streetlight/bay
  without `at` still default to the origin silently; a kerb with a non-numeric
  coordinate still gives a raw TypeError ("reading 'map'"). `need` checks array
  length but not that entries are finite numbers.
- LOW: bay `count` is not validated: 0 falls back to 1, 2.5 draws a
  half-bay asymmetric row, -2 draws a mirrored row. No NaN.
- LOW: beam z is the lamp's depth minus 0.01, so a form whose average depth is
  nearer than the lamp but which is physically behind the pool end (a big
  building box seen from behind the vehicle) can still cover the beam. The
  pool end is nearer than the lamp whenever the lamp faces the camera, and
  that case is correct. Inherent to average-depth sorting; README already warns.

Answers to the specific questions

- Beam vs wall behind and forms in front: tested directly with a throwaway
  scene (low camera 0.5 m, lamp 1 m up, beam length 5, a 12 m by 3 m wall box
  behind the lamp, and separately a box in front of the pool). The wall does
  not cover the beam (both wedge edges and the arc show over it); the nearer
  box covers the beam where it overlaps, and the beam shows either side of it.
  Both behave as intended. In the car fixture the beam also shows over the
  body from the front view.
- clipLine: correct. Same maths as before (t = (NEAR - za)/(zb - za), only
  reached when exactly one end is behind NEAR), returns [] for fully-behind
  lines, one stroke per chord for polylines (the arc becomes chords, fine). The
  all-in-front branch keeps the original single stroke so unclipped output is
  unchanged. A beam with the lamp in front and the pool behind the camera stays
  bounded (max coordinate 2447 in the test; not huge).
- Does the beam now stay attached to the lamp: yes, in the scooter, car and
  light-sh3 renders the wedge edges start at the lamp. prop-light-sh3 now reads
  clearly as a light with a cone and the far streetlight arm at the top left;
  the cone is the clearest of the props at thumbnail. The scooter headlight and
  its wedge read.
- Anything broken: no. Validation messages are clear for the cases the tests
  cover (kerb `to`, lamp beam `ground`).

## Resolution (author, 2026-11-24)

| Finding | Outcome |
|---|---|
| H empty bay does not read (both passes) | Open, put to the human. Tried: a row of bays, a parked car beside the empty one, the back line set 0.3 m off the kerb, re-framed camera. The prop draws correctly; at 90x160 an empty bay from a low camera is still weak, and the car reads as a van (boxes can't slope). Composition of sh1 is am-mcd.3's (findings written into its description) |
| M streetlight not identifiable in light-sh3 | Fixture camera raised 0.8 m and the streetlight moved to the far corner; at the board's height the near railing hides it (noted in am-mcd.3 via this fixture's description) |
| M no seated rider pose added | Put to the human: the rider pose is the fixture's ik block (documented in the README scooter row); a reusable pose preset would be a scene-format feature (am-e-contract-tnm.1) |
| M kerb `side` documented backwards | Fixed: code comment and README now say +1 is the right of from→to seen from above |
| M halo ticks vs "no speed lines" | Put to the human for explicit approval |
| M (2nd) README and comments say beams are on the ground | Fixed |
| M (2nd) lamp disc and halo not near-plane clipped | Fixed: a lamp behind the near plane is not drawn |
| L missing kerb/lamp fields give a raw TypeError | Fixed: need() gives a clear error; tests match the message |
| L standalone lamp beam floats with ground 0 | Fixed: a beam requires `ground` |
| L need() only on kerb and lamp; bay `count` unvalidated | Left: the other props default `at` to the origin by design; count is author input |
| L big boxes can still cover a beam from behind a vehicle | Left: the average-depth limit, owned by am-e-board-1wg.9 |
