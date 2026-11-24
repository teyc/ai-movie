# Round 1 review of the ai-movie plan

The plan is strongest when it treats geometry and approvals as data. It is weakest where that data is described but not yet pinned down. A few missing contracts would let stage 2 generate scenes that look plausible but do not replay, cut, or diagnose reliably.

## 1. Define a real pose-library index, not a convention

**Severity — critical**

Section 7 says to retrieve a reference pose by action and contact topology, but section 5.1 has no record for what “contact topology” means and `resource/pose/*.json` contains only scene names and geometry. `resource/pose/README.md` describes what each scene depicts, but that prose is not machine-readable and cannot be queried by the description-to-scene process. This leaves the retrieval step with no vocabulary, no search key, and no way to distinguish the ladder pair as variants of the same setup rather than independent poses.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -118,6 +118,7 @@
 | beat | spoken, display, cues `[{id, word, occurrence}]`, evidence, purpose |
 | shot | beat, intent, template (reference pose), setup, inCue, mustSee, mayHide, motion, cutFrom |
 | scene v2 | camera, environment, lights, figures, props (below) |
+| pose example | stable action, contacts, support, gaze, limb intent, setup id, scene hash, accepted board metadata |
 | board receipt | scene hash, seed, art path, control paths, projected anchors, diagnostics, approval |
 | attempt | shot, board hash, route, model, prompt, attempt number, job id, asset, checks, estimated and billed cost |
@@ -209,11 +210,35 @@
 ## 7. The hardest problem: shot description to scene record
 
 The language model makes directing choices from a vocabulary; code does the
 geometry.

 Before adding that step, materialize each pose example as a normal data record.
 The record should be derived from the scene and a small human review, rather
 than duplicated as free prose:

 ```json
 {"kind":"pose-example","version":1,"id":"ladder-climb",
  "payload":{"actions":["climb"],"setup":"ladder-A","support":["lToe:rung-7","rToe:rung-6"],
  "contacts":[{"figure":"climber","joint":"lHa","target":"ladder.rung-8"},
             {"figure":"climber","joint":"rHa","target":"ladder.rung-7"}],
  "gaze":"next-rung","bodyDomain":"dynamic","sceneHash":"sha256...",
  "limitations":["rear hand may be occluded"],"accepts":["ladder-climb"]}}
 ```

 Searchable fields should include setup, support, left/right contact joints,
 airborne state, gaze target, and occlusion risk. `resource/pose/ladder-climb.json`
 and `ladder-from-below.json` can then be linked as two views of one setup, while
 their poses remain separate examples. Retrieval must preserve setup continuity
 and return scene evidence that the repair loop can validate, not just a tag or
 thumbnail.

 ```diff
 --- a/docs/planning/PLAN_FOR_AI_MOVIE.md
 +++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
 @@
  2. **Retrieve a reference pose** by action and *contact topology* first
     (floor, seat, rail, rung, airborne; which hands and feet touch what), then
     by words. Each reference scene is annotated with these facts. Unknown
     actions go to manual blocking.
 +   Pose examples carry a validated `pose-example` record with setup,
 +   support, contact joints and targets, gaze target, airborne state and
 +   occlusion notes. Two camera views may share a setup but are not collapsed
 +   into one retrieval result. Retrieval has to prove that the requested
 +   contacts exist in the candidate scene; similar embeddings are fallback only.

```

## 2. Resolve the scene-record envelope instead of maintaining two incompatible formats

**Severity — critical**

Section 5.1 defines every record with `kind` and `version`, but its example
scene v2 has `sceneVersion: 2` as a top-level field instead of a `payload`;
today's unversioned format is the format accepted by `renderFrame`. The CLI and
renderer currently read `sc.profile`, `sc.camera`, `sc.pose`, and `sc.props`
directly, as shown in `lib/pose/mannequin.js:1065-1076`. There is therefore no
single unambiguous rule for whether a JSON file is v1, v2, or an envelope.
Rewrites may silently render a v2 file as an unknown profile or a missing camera
before validation has a chance to help.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 Every record on disk uses one envelope and is validated on read and write.

 ```json
 {"kind": "shot", "version": 1, "id": "s2", "payload": {}}
 ```

| Record | Key fields |
@@
 | release | platform, master hash, title, thumbnail, captions, rights, disclosure decision, visibility, remote id |
+
Scene records are the same envelope:

```json
{"kind":"scene","version":1,"id":"ladder-climb","payload":{
 "profile":"adult","camera":{},"pose":{},"props":[]}}
```

Version 1 is the legacy payload accepted by `renderFrame` today. Version 2
uses `camera`, `environment`, `lights`, `figures`, and `props` as payload
fields; it must not also carry `sceneVersion` at the envelope level.
The loader first validates the envelope, then dispatches by `{kind, version}`
and renders through an explicit v1-to-v2 conversion. Code that calls
`renderFrame` directly may receive only a v1 payload; public CLI and run files
must use the envelope.

### 5.2 Scene record v2

- The example begins with `{"kind":"scene","version":2,"id":"handoff-wide",
  "payload":{"camera":...}}`, not `sceneVersion`.

## 3. Make the edit a replayable list of shot intervals

**Severity — important**

The `edit` record says “integer frame timeline” but gives no field shape,
first frame, last frame, source range, transition, or return to a setup.
Section 11's Phase A explicitly cuts from side, to below, and back to side,
which cannot be represented as one shot setup plus a cue under the current
table. FFmpeg assembly will otherwise infer frame ranges in a script or parser,
making the same approved animatic render differently after a voice retake.
This is also the missing boundary for whether a drawing hold or generated clip
can cover a cue.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | captions | cues in sample time, layout, WebVTT sidecar |
 | mix | music regions with rights, gain and fades |
-| edit | fps, integer frame timeline of shots, voice, captions, mix, master path |
+| edit | fps, voice asset hash, timed intervals, captions, mix, master path |
 | release | platform, master hash, title, thumbnail, captions, rights, disclosure decision, visibility, remote id |
+
An edit interval is replayable data, not only a generated timeline:

```json
{"startFrame":38,"endFrame":83,"shot":"ladder-side-1",
 "board":"sha256...","sourceInFrame":0,"sourceOutFrame":45,
 "transition":{"kind":"cut"}}
```

Adjacent intervals may reuse a setup or board. Every frame is an integer at
the delivery fps, source ranges are 0-based and half-open, and an interval
must have a nonzero duration. The assembly stage derives absolute cue
positions from the voice hash and edit intervals, never by rescanning captions.
Changing a board hash, source range or voice hash marks the affected intervals
and master stale; changing only a mix region does not rebuild the boards.

## 4. Distinguish a reachable target from a valid target

**Severity — important**

`lib/pose/README.md` states that reach targets bypass the joint-range check,
while `mannequin.js` returns warnings for clamping and unreachable targets.
Section 7's repair loop and section 8's IK roadmap therefore need a reason
code. A target can be geometrically reachable but require an elbow or ankle
beyond its permitted range; it can also be in range with no margin or on the
wrong side of a prop. Reporting only "reach failed" does not tell the bounded
repair loop whether to move a prop, adjust the pole vector, or move the root.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | 4 | IK guards, joint limits on reach targets, named contact sites, structured diagnostics | Needed by section 7 | An impossible elbow on a reachable target is reported |
+
The reach diagnostic is structured and figure-specific:

```json
{"code":"ik.joint-limit","figure":"climber","endEffector":"rWr",
 "target":"ladder.rung-7","requested":[...],"achieved":[...],
 "joint":"rEl","requestedDeg":160,"allowedDeg":[0,150],
 "resolution":"move-root"}
```

Permit codes include `target-outside-workspace`,
`joint-range-exceeded`, `pole-conflict`, `contact-distance`, and
`prop-intersection`. `stand` plus reach remains invalid rather than a repair
candidate. The repair allow-list may change the target, root, or pole hint,
but may not silently increase `flex` or clear diagnostics. A scene that is
geometrically solvable still requires contact and visibility checks before
acceptance.

## 5. Pin the renderer contract with fixtures, not only golden images

**Severity — important**

Section 9 proposes golden SVG text for every reference scene, but golden text
is extremely sensitive to harmless formatting changes and no fixture currently
records which `name`, `profile`, `camera`, pose, prop, and seed must be tested.
There are no test files yet. The 18 JSON records in `resource/pose/` are
examples, but relying on a folder scan alone gives no explicit guarantee that
every file is renderable, every warning is expected, or every generated sheet
and lineup is in the suite.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 - **Drawings.** Golden SVG text for all reference scenes, frames, sheet and
   line-up at a fixed seed: exact comparison, since rendering is deterministic.
   When a golden must change, render old, new and a difference image side by
   side for the human, who approves before the update. Region checks (grip,
   gaze, pelvis join, V hand) can be added if whole-frame comparison misses
   local defects.
+  Maintain a renderer manifest that names each scene fixture, fixed seed,
  expected warning codes, and whether it is a solo frame, sheet fixture or
  lineup fixture. A folder scan may discover files, but not decide coverage.
  The test asserts: no unexpected warning, no unknown joint or prop, identical
  SVG for repeated calls, and stable SVG for a fixed seed. Golden text changes
  require a visual diff and a human approval, as already specified.

## 6. Put producer time in the run ledger and use it as an exit criterion

**Severity — important**

The plan defines a 45-minute labour target for repeatable explainers but has
no on-disk record of how the time is measured or whether it includes manual
blocking, review, prompt repair and redrawing. Cash is ledgered per attempt,
but `labour` is only reported separately in the budget. A run can therefore
meet the cash cap while consuming more time than the target, and a project
pass can exclude difficult shots.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | Record | Key fields |
@@
 | brief | audience, question, evidence, locale, delivery `{width, height, fps}`, cashCapUsd |
+| labour | run id, stage, task, started and ended samples, active seconds, blocker type, notes |
 | beat | spoken, display, cues `[{id, word, occurrence}]`, evidence, purpose |
@@
 | C. Repeatable explainers | Route experiment done; description-to-scene with repair; three unseen briefs including a non-ladder scene | Two of three films within the cash cap and a 45-minute labour target |
+
The C phase pass requires total active minutes from brief through private
master, including rejected takes and manual scene repair. It excludes waiting
for provider jobs but not producer review or repair. The labour ledger is
entered by the producer for a task and is not inferred from chat timestamps.
Report median and maximum by stage, plus the number of shots needing manual
blocking. Replacing a hard brief is an excluded failure, not a pass.

## Questions the plan still cannot answer

- When should a setup be reused as the next shot versus rebuilt as a new
  scene, and how is continuity corrected if it changes?
- Which contact and support checks are machine-verifiable on a hand-sketched
  render, and which remain human judgement even after control exports exist?
- What minimum test sample is enough to conclude that a reference library
  improves a route rather than merely retrieving familiar poses?
