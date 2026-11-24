# Review of am-e-asm-qgh.6 (layer manifest) by Sonnet 5.5

Scope: uncommitted diff to lib/pose/cli.js and lib/pose/README.md, plus
lib/pose/layers.js, test/layers.test.js, test/fixtures/layers/. Checked:
`node --test` (73 pass), `node lib/pose/cli.js layers test/fixtures/layers/manifest.json`
(ok, prints digest), and throwaway manifests in the scratchpad. The drawing
section does not apply (renderer untouched).

## 1. Wrong against the bead and its consumers

- **medium** README.md "Layer manifest" table, `move` row (and layers.js:111):
  the plan (7a.3) says "start and end translation and scale with easing per
  group". The format has one `easing` for the whole move. An exporter or
  compiler that wants a different easing per group (foreground eases, sky
  holds) needs a breaking change. Allow an optional per-group `easing`
  override now, or have the plan say one easing per move.
- **medium** README.md (format), layers.js:50-63: nothing in the manifest ties
  the layers to the inked board. am-00y.12's first acceptance criterion is
  "stacking the layers at zero offset reproduces the inked board exactly", and
  the plan says the zero-offset composite must match the fully inked board.
  Only `scene` (an optional path, not checked for existence or digest) links
  back. Without an optional `board` item (art plus digest of the flattened
  reference), the flatten-and-compare test has no pinned reference, and adding
  it later changes the format. Add it as an optional field.
- **medium** README.md `layers[].depth`, layers.js:81-84: one field does two
  jobs, stacking order (validator rejects an increase down the list) and
  camera distance. am-mcd.3 notes the wall, window and slab use a depth bias
  as a stopgap, and a rail or figure layer spans a range of depths. A
  representative depth per layer may not sort the same way as the true
  front-to-back order (an arm crossing a rail), so the exporter would have to
  invent depths to pass the validator. Either say depth is the sort key and
  may be biased, or split `depth` from list order.
- **medium** layers.js:107-126: the validator does not check that the move
  honours the depth rule the bead and plan state (near layers move more than
  far ones). Far-moves-more-than-near, a 500-unit translation, and an origin
  at [9999, -5] all pass (verified). The edge-exposure check is rightly the
  compiler's, but a cheap rate-order check (translation and scale change
  non-decreasing as depth falls) would catch inverted parallax at authoring
  time. Without it, am-mcd.3's hand-written sh2 manifest can be inverted and
  still "validate". At minimum say in the README that rate order is not
  checked.
- **low** README.md `canvas`: units are "drawing units", but phase B exporter
  output and the 1080 x 1920 delivery are pixels. The manifest has no
  statement of raster scale, so the compiler must infer it from `frame` vs
  delivery size. Fine for SVG; ambiguous for PNG layers. Document that
  artwork scales to the delivery size by `frame.w`.
- **low** README.md, no field for how much hidden background each layer
  carries behind a cutout. am-e-asm-qgh.5 caps moves so no gap shows; the
  cap needs that margin. Computable only by pixel analysis today. An optional
  per-layer `bleed` would be additive.
- The fixture meets the acceptance criterion: it validates, and a missing
  digest and reversed depth order each fail with a path (tests at
  test/layers.test.js:23 and :35). The hold-still fallback is expressible
  (omit `move`).

## 2. Bugs

- **medium** layers.js:182-187: `transformAt` looks up `move.from[group]` on a
  plain object. A layer whose id is `constructor`, `toString` or `valueOf`
  (valid per the validator) and that the move does not name gets the inherited
  function back, and `a.t[0]` throws `TypeError` (reproduced). Use
  `Object.hasOwn` or a Map, in the validator's `groups` lookups too (those use
  a Map, so they are fine; only `transformAt` and `move.from` are exposed).
  The compiler will call this per frame.
- **low** layers.js:56-59: `art` that names a directory (`"."`) makes
  `fs.readFileSync` throw EISDIR out of the validator instead of returning a
  path error (reproduced). `art` may also contain `..` and reads outside the
  manifest directory (only the digest is revealed, but see safety).
- **low** layers.js:157-158 and cli.js:57: a missing manifest file throws an
  ENOENT stack trace instead of an error line and exit code 1.
- **low** layers.js:128-150: for an unknown `kind`, the `only(...)` unknown
  field check is skipped, so typos on a bad fixed item are not reported.
  Two `paper` items pass. A `frame-marks` or `paper` item's art is not
  checked to be frame size, though the README says it is.
- **low** layers.js:99-103: the id/group-name collision check is correct, but
  a fixed item's id may equal a group name; harmless today.

## 3. Safety

- **low** layers.js:55-60: `art` is joined to `baseDir` without containment, so
  a manifest from another source can make the validator hash any readable
  file. No write, no shell-out, no network. If manifests ever come from
  outside the repo, reject `..` segments.
- No secrets, no paid calls, no destructive operations.

## 4. Tests

- **medium** test/layers.test.js: `transformAt` is tested only on the fixture
  and `unnamed`; no case for a layer id like `constructor` (bug above), and
  none for a move that names only one end.
- **low** test/layers.test.js:49-55 pins the expected digest prefix
  `sha256:3f2c29d4`, so editing wall.svg for any reason (or a CRLF checkout
  with no `.gitattributes` in the repo) breaks the test with a confusing
  message. Consider `eol=lf` for test/fixtures/layers/*.svg in
  .gitattributes, since digests are over file bytes.
- **low** Missing: art that is a directory, absolute `art`, `canvas` unknown
  field, `fixed` that is not an array, a group whose members are not adjacent
  in the list, and CLI exit code and output (no test runs `cli.js layers`).
- **low** The fixture has no ungrouped far/near pair showing the intended
  rate order, and no push-in (`s` != 1) case.

## 5. Drawing changes

Not applicable.

## 6. Simplifications

- **low** layers.js:12-16: fine. `groupOf` (line 190) is exported but unused
  and untested; either test it or drop it until the compiler needs it.
- **low** README.md: the format paragraph says the validator rejects unknown
  fields and that the compiler owns exposure checks; also state that rate
  order and move magnitude are unchecked (see 1).

## Verdict

No high findings. The format covers the three consumers except the items
marked medium in section 1, each of which would be an additive or breaking
change later if not settled now: per-group easing, the inked-board reference,
and the depth/stacking coupling. The `transformAt` prototype-key crash should
be fixed before the compiler uses it.

## Resolution (author, 2026-11-24)

| Finding | Outcome |
|---|---|
| M1 easing per group | Fixed: optional `move.easings` per group; test added |
| M2 no inked-board reference | Fixed: optional `board {art, digest}` at frame size; test added |
| M3 depth does two jobs | Documented: list order is the stacking order; depth is the true camera distance of the layer's nearest point (not the renderer bias) and must agree with the order |
| M4 inverted parallax validates | Documented as unchecked, owned by the compiler (am-e-asm-qgh.5, rewritten to say so). A rate-order check was added, then removed after the second pass (see below) |
| M5 prototype-key ids crash `transformAt` | Fixed with `Object.hasOwn`; test added |
| M6 missing tests | Added: one-end move, `s` ≠ 1, non-adjacent group members, prototype ids |
| L art is a directory | Fixed: "not a file" error |
| L missing manifest throws in the CLI | Fixed: reported as an error line |
| L art not confined | Fixed: must be inside the manifest's folder |
| L two paper items | Fixed: at most one paper |
| L raster units | Documented: canvas units are the artwork's own (SVG user units or pixels) |
| L typos on a fixed item with a bad kind | Not fixed: the bad kind is reported, which is enough to stop the file |
| L no bleed field | Not added: overscan is `canvas` minus `frame`; the exporter (am-00y.12) and the compiler's edge check (am-e-asm-qgh.5) can add it if they need it |
| L CRLF digest brittleness | Not fixed now: no Windows checkouts expected |
| L CLI untested, `groupOf` unused | CLI checked by hand; `groupOf` kept for the compiler and exporter, and now tested |

## Second pass (Sonnet 5.5)

Scope: the parallax check as rewritten (layers.js:146-178), `board`, `move.easings`,
art confinement and not-a-file check, one paper, `validateManifestFile` read errors,
`Object.hasOwn` in `transformAt`. `node --test`: 84 pass. Probes are throwaway
(scratchpad review2/p.js), run against the fixture.

No high findings.

### Wrongly accepted (inverted parallax still validates)

- **medium** layers.js:159-164, 172: the check compares scalar magnitudes only
  (distance the centre point travels, and |Δs|), never direction or sign. All of
  these validate (verified): far group drifts [-3,0] while the near group drifts
  [+3,0] (opposite directions); far drifts left, near moves up; far pulls out
  (s 1 to 0.95) while near pushes in (1 to 1.06). Real parallax moves every layer
  the same way, near ones further, and a push-in and a pull-out cannot coexist in
  one shot. Check that the centre-point displacement vectors of near and far
  point the same way (dot product at least 0, or near's vector projected on far's
  at least as long), and that Δs has the same sign (or is zero).
- **medium** layers.js:162, 251: only the endpoints u=0 and u=1 are compared, but
  `move.easings` (new this pass) lets groups run different easings. Near
  `ease-in` with far `ease-out` and a larger near total passes (verified), yet at
  u=0.5 the far group has moved 0.75 of its distance and the near group 0.25 of
  its, so mid-shot the parallax is inverted. Either sample the comparison at a few
  u (0.25, 0.5, 0.75), or require the same easing for groups that are compared.
  Samples are cheap since `transformAt` takes u.

### Wrongly rejected

- **medium** layers.js:166-177: a locked-on subject is rejected. A tracking shot
  where the camera follows a figure holds the near group still and drifts the
  background; `to: {wall: t [-5,0]}` with `rail` unnamed fails ("rail moves less
  than wall"). That is correct parallax (the subject is the camera's reference),
  and the plan's "near moves more" is about layers at rest in the world.
  Held-still near groups need an escape: for example exempt a group that has no
  entry in `from`/`to` only when stated by an explicit `move.lock: [group]`, or
  document that the validator forbids tracking shots and the compiler cannot
  author them.
- **low** layers.js:159, README.md:169 ("independent of origins"): the claim holds
  for one camera move expressed with origins that are compensated by `t`, but a
  scale about a different origin per group still changes the centre displacement.
  Far scale 1.05 about [10,10] and near 1.06 about the centre [100,170] is
  rejected (near centre displacement 0, far 9.2). That is arguably a bad move
  (a push-in has one focus) but the message "moves less than" will confuse the
  author. Reword the README to say the check measures where the group carries the
  frame's centre, and name that origins differing per group count.
- Verified accepted, so not wrongly rejected: push-in about the frame centre,
  push-in about an off-centre focus with `t = (1-s)(P-c)`, drift plus push-in,
  groups at equal depth (skipped, line 170), a group spanning depths (uses its
  nearest layer), `from` at s != 1 (only the difference counts).

### Other checks

- `board {art, digest}`: unknown fields, null, bad digest and digest mismatch
  all report with a path. **low** layers.js:111-117: the README says it is "at
  frame size" and the zero-offset flatten test depends on that, but neither
  `board` nor the existing frame-marks/paper items are checked for size (same as
  first pass, not fixed, not claimed fixed).
- `move.easings`: unknown group and unknown easing both reported, `__proto__` key
  from JSON.parse is rejected as no group. Fine.
- Art confinement: absolute, `..`, `sub/../../x` rejected; `sub/..` accepted
  (normalised to a path inside). **low** layers.js:53,59: a symlink inside the
  manifest folder can still point outside; hash-only exposure, no action needed
  unless manifests come from outside the repo. Directory art reports "not a
  file".
- At most one paper: second paper reported at `fixed[2].kind`. Fine.
- `validateManifestFile`: ENOENT and EISDIR return an error and `digest: null`;
  the CLI handles both (cli.js:57-ish path prints errors). Fine.
- `transformAt`: `constructor`, `__proto__` return the identity; test exists.
  Fine.
- Resolution table: M1, M2, M5, M6 and the L rows resolve their findings. M4 is
  only partly resolved: the check exists but accepts opposite-direction and
  mixed push/pull moves and eased mid-shot inversion (above), and now rejects
  tracking shots. The bead comment (reopen note) is addressed for different
  origins, not for the points above.

## Verdict (second pass)

No high findings. Three medium: direction and sign not compared, easings make the
endpoint-only comparison unsound mid-shot, and a held near group (tracking shot)
is rejected with no way to say it is intended.

## Resolution of the second pass (author, 2026-11-24)

The three medium findings were all in the near-moves-more check, and each fix
so far had opened a new case. The cause is structural: a manifest holds
finished transforms, not the camera move behind them, so a tracking shot (M3),
per-group easing (M2) and direction (M1) can't be judged from it. The check
is removed from the validator (it was in unpushed commit dae2659, which still
holds it) and the README says rate order and direction are not checked.
am-e-asm-qgh.5 now owns rate order through the whole move, derives or checks
each group's transform from the shot's move and the depths, and must say
whether tracking shots are allowed. A test pins that a tracking shot
validates.

| Finding | Outcome |
|---|---|
| M1 direction and sign not compared | Moot: check removed; owned by am-e-asm-qgh.5 |
| M2 only u=0 and u=1 compared | Moot: check removed; am-e-asm-qgh.5 checks the whole move |
| M3 tracking shots rejected | Fixed by removal; am-e-asm-qgh.5 decides how a shot asks for tracking |
| L "independent of origins" overclaims | Sentence removed with the check |
| L board, paper, frame-marks not checked for frame size | Documented as unchecked in the README |
| L symlink inside the folder can point outside | Not fixed: manifests come from this repo |
