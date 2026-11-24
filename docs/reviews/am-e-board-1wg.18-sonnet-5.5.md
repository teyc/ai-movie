# Review: am-e-board-1wg.18 (clip board drawing to the frame border), Sonnet 5.5

Reviewed: uncommitted diff (lib/pose/mannequin.js, test/golden-fixtures.js,
test/pose-manifest.json, test/pose.golden.test.js) plus
test/fixtures/pose/limb-past-frame.{json,svg,png}. `node --test`: 52 pass,
38 fail. All 38 failures are golden comparisons: 36 reference frames
(18 scenes x plain/construction), the sheet, and `test-limb-past-frame`
(no golden file yet). No non-golden test fails, and no warning-list
assertion fails. Nothing run with UPDATE_GOLDEN=1; test/golden/ untouched.
Method: old output rendered from `git show HEAD:lib/pose/mannequin.js` into
the review scratchpad, new output from the working tree, both through
rsvg-convert, compared with magick.

## 1. Wrong against the bead

No high findings. Acceptance met on the renders:

- Stripping the border from the new sh1..sh5 and child-peek renders leaves
  zero non-paper pixels outside the frame rectangle (old renders: 0.9% to
  1.7% of pixels). Nothing but the border crosses the frame.
- Border kept: the last 8 border strokes are byte-identical to the old
  output in sh2, sh3, sh5, child-peek and balcony-lean.
- Inside the frame (30 px inset at 3x) nothing changed: AE 0 on every
  changed scene except float anti-aliasing noise (child-peek 0.01 px,
  sh3 0.001, sh4 0.004). 24 of 36 reference frames are pixel-identical
  overall; the rest differ only in the outer margin.
- Unchanged: backflip, carrying-box, dash, dive-reach, flying-kick,
  lifting-box, peace-sign, pointing, rising-uppercut, running-airborne,
  sitting, standing, three-point-landing, walking. Changed (margin only):
  balcony-lean, child-peek, ladder-climb, ladder-from-below, and sh1..sh5.
- Visual check (sh2, sh3 full size and thumbnail; limb fixture): balusters,
  legs, rail and the arm now end on the frame line; the rail stub at the
  right edge is cut flat. That reads as a cropped picture, which is the
  intent.
- Contact sheet: ids `frame-clip-0..n`, unique (test asserts it). Frameless
  line-up: no `clipPath`, goldens `lineup-*` not in the failing set.
  Construction mode: `.c` groups are inside the clipped group, display
  rules unchanged.

## 2. Bugs

- low, lib/pose/mannequin.js:998-1003. The clip is the nominal rectangle at
  8..W-8, but the border strokes wobble by about +/-1 unit (bottom border
  sits at y 191.4..192.5 in sh2's SVG). Where the wobble runs inward of the
  clip edge, content can show up to about 0.6 unit (about 2 px at 3x) past
  the border. Invisible at thumbnail size. Acceptable; say so in the bead
  close note rather than tighten.
- low, lib/pose/mannequin.js:999. The default id `frame-clip` is fixed. Two
  single-frame SVGs inlined into one HTML page (a review page or contact
  sheet built outside renderSheet) collide; the first clip wins, which is
  harmless only when the frame sizes match. renderFrame output with a
  different `frame {w,h}` (portrait) inlined next to a landscape one would
  mis-clip. Consider deriving the id from W x H, or document that single
  frames must be used as standalone documents.
- low (pre-existing, not caused by this change). renderSheet takes W/H as the
  default frame size and ignores `scene.frame`, so the clip rectangle in a
  sheet is the default frame even for portrait scenes. Unchanged from
  before; file if the sheet ever shows portrait boards.

## 3. Safety

No findings. No I/O, no shelling out, ids are generated from an integer or a
constant.

## 4. Tests

- medium, test/pose.golden.test.js:58-67. The unit test checks structure
  (clipPath string, 8 `class="ink"` after the last `</g>`), not behaviour.
  The acceptance criterion is "no stroke apart from the border crosses the
  frame in any child-peek board", and no test renders the child-peek scenes
  (examples/child-peek/scenes/sh1..sh5.json are not in the manifest). Once
  goldens are approved, `test-limb-past-frame` will pin the SVG text, which
  proves the wrapper exists but not that it clips. A rasterising check would
  prove it, but the repo has no runtime dependencies. Options: add the
  child-peek boards to the golden set (am-mcd.3 owns the boards, so probably
  file a follow-up), or accept the structural test and say so.
- low, test/pose.golden.test.js:62. `svg.lastIndexOf('</g>')` as "end of the
  clipped group" is brittle: it relies on the clip group being the last
  `</g>` in the document. It holds today (border strokes are paths, not
  groups). A future group after the border would fail the test misleadingly;
  that is a fail-loud direction, so fine.
- low. The fixture crosses the top edge (hand and forearm) and the bottom
  edge (both legs); the old render shows that (fixture AE 1122 in the
  margin), so it is a real escape test. It does not cross left/right. Fine
  for one fixture.
- Process: the fixture is registered under a new `testFrames` manifest key
  with a `test-` id and gets no warning assertion (fixtures with `scene`
  undefined are skipped by the warnings check; `scene: name` is set, so
  `expectedWarnings[name] || []` applies, i.e. the fixture must render
  with zero warnings; it currently does, since only the golden fails).
  The existing "manifest covers every reference scene" test is unaffected
  because the fixture lives in a separate folder. OK.

## 5. Drawing changes

Summary: the only visual change is that everything outside the frame
rectangle is no longer drawn; the border and its overshoots are
byte-identical, and everything inside the frame is unchanged. Against the
AGENTS.md storyboard conventions: the hand-sketched look is intact (nothing
inside was touched); no convention is affected.

- 18 of 36 reference frames and the three-scene sheet content: no visual
  change in the frame; only frames that had drawing in the margin change
  (listed above). The margin content in those frames was figures, rails or
  ladder rungs running off the page; removing it is the intended fix.
- Contact sheet: each cell already sat in a nested `<svg>` that cuts at the
  cell edge, so the new clip now also cuts the strip between the border and
  the cell edge (up to 8 units). Same direction as the single-frame fix.
- Thumbnail size (sh2, sh3, sh5 at 240 px wide): the frames read as closed
  boxes; no stray strokes outside.

Things the clip could break elsewhere:

- medium, am-00y.12 (layer export, open) and lib/pose/layers.js. The
  exporter must split a board into transparent layers and "stacking layers
  reproduces the inked board exactly". Clipping is one `<g>` around the whole
  body, so a layer exporter that slices the body into per-figure/per-prop
  groups has to re-apply the clip per layer (or drop it and clip at
  composition), and "frame marks are not layers" now relies on the border
  being outside the clipped group, which it is. Nothing breaks today (nothing
  parses the SVG: `grep` finds no consumer of the body markup besides
  golden-review.js, which treats it as an opaque data URI). Add a line to
  am-00y.12's description about the clip and the stable group boundary, so
  the exporter doesn't depend on the body being a flat list of siblings.
- low. examples/child-peek/boards.png (tracked) is now stale for sh2, sh3,
  sh5 (and the untracked scenes/*.svg). Regenerating belongs to am-mcd.3
  (block and render the micro-story boards), which this bead blocks; mention
  it in the close note so boards are re-rendered before the human reviews them.
- low. lib/pose/README.md does not describe the frame border or clip. If the
  SVG structure is documented as a contract anywhere (layer manifest section
  mentions frame marks), add one sentence that the body is wrapped in
  `<clipPath id="frame-clip">` and the border follows it.

## 6. Simplifications

- low. `sh.clipId` is an ad-hoc field on the internal scene object set via
  `Object.assign` in renderSheet. Passing it as a second argument to `draw`
  would avoid mutating the shape of `sh`; skip if am-e-board-1wg.3 (context
  split) is about to reshape this anyway.

## Verdict

No high findings. Goldens need the human's approval through
`node test/golden-review.js` (changed frames are margin-only plus the new
fixture) before `UPDATE_GOLDEN=1`. Medium items are about follow-up beads,
not blockers.

## Resolution (author, 2026-11-24)

| Finding | Outcome |
|---|---|
| M1 acceptance unproven by a test | Added a test that renders every child-peek board and asserts nothing is drawn before the clip group and only the eight border strokes after it. With SVG clipping, that proves no other stroke can cross the frame |
| M2 layer export and the single clip group | am-00y.12 rewritten in place: layers carry no clip, are drawn over the full canvas, and the frame window is applied at composition |
| L clip at the nominal border line | Accepted: about 0.6 units against a 1-unit wobble, invisible at delivery size |
| L fixed default id in inlined HTML | Accepted: SVGs are not inlined together today; renderSheet already uses unique ids |
| L stale boards.png and scene renders | Belongs to am-mcd.3 (it re-renders every board) |
| L README does not mention the clip | Fixed: `frame` row |
| L sheet ignores scene.frame; clipId via Object.assign | Pre-existing / style; left |
