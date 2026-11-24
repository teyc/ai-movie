# Round 3 review of the storyboard film

The first production decision is what the child sees and how the audience recognises the change. The architecture should make that sequence cheap to stage, time, revise and restore. This review uses draft 6 and the checked-in drawings.

## 1. Give the child a playable reaction before building the character system

**Critical**

Phase A (§11) asks the audience to infer a feeling from a changed face. In `resource/pose/child-peek.json`, `pose.look` equals `camera.pos`. In the PNG the child appears to address us over the rail. There is no object of discovery, and the two strokes on the oval describe head orientation alone. `fig()` constructs that oval and `draw()` draws the arcs. Neither takes an expression. A closer crop of the same head cannot deliver the reversal. Section 7b specifies identity across views but gives the actor no way to perform two different reactions in the same view. Meanwhile §1 calls character consistency a non-goal and §3 still directs production to an explainer. These choices determine which film a developer would actually make first. The renderer baseline already exists in `test/pose.golden.test.js` and `test/pose-manifest.json`. Phase A can use it immediately.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -55,7 +55,7 @@
 ### Non-goals for now
 
 - On-camera presenters, lip sync, or real people's likenesses.
-- Character consistency across shots (a hook is left for drama later).
+- A general-purpose facial animation rig. Character identity across held boards is required (section 7b).
 - A graphical editor. Records are JSON, edited by hand or by an LLM.
 
 ## 2. Principles
@@ -84,7 +84,7 @@
 
 | ID | Question | Recommendation | Notes |
 |---|---|---|---|
-| Q1 | Format | Narrated explainer first. Then a silent two-person scene, then dialogue drama only if the silent scene reads | All three plans agree on explainer first |
+| Q1 | Format | Start with the narrated child-peek micro-story in section 11. Use the explainer workflow for briefs that pose a factual question. | The phase A story is decided |
 | Q2 | Generation model and route | Decide by experiment (Appendix A.5). Candidates: Runway Gen-4 Image for reference stills; Gen-4 Turbo, Kling 4.0, Seedance 2.5, Wan 3.0, MiniMax H3 or Gemini Omni Flash for image-to-video | verify (2026-11-24) |
 | Q3 | Text-to-speech with word timings | Pilot with a human recording or Polly. Choose between Amazon Polly (cheapest; word marks give start times, ends estimated) and Cartesia Sonic (word start and end times, 44 languages) after a two-sentence test | verify (2026-11-24) |
 | Q4 | Platform, shape, length | YouTube Shorts first, 1080 x 1920, 30 fps, 30 to 45 seconds. Landscape 90 to 150 second explainers later | Shorts accept square or vertical up to 3 minutes; verify (2026-11-24) |
@@ -585,6 +585,7 @@
 - The character layer stays in the sketch style set by the style profile.
 - Every figure in a scene record refers to a character sheet; the story's
   character list links each character to its sheet.
+- Keep identity on the sheet and performance on the board. Give the sheet named expressions only as the screenplay needs them. A shot selects one with its pose and gaze. For phase A, draw the same child neutral and in the chosen reaction, using the same face proportions, with a change in brow, mouth and posture legible at the actual shot size.
 - Recognisability test: in a contact sheet of thumbnails, a fresh viewer
   can tell the characters apart and pick out the main character.
 - Later, the turnaround doubles as the identity reference for generated
@@ -594,7 +595,7 @@
 
 | Order | Change | Why now | Done when |
 |---|---|---|---|
-| 1 | Regression tests on the 18 reference scenes and the warnings | Everything below changes drawing code | Any drawing change fails until goldens are updated deliberately |
+| 1 (implemented for v1) | Keep the shipped 18-scene manifest, clean and construction SVGs, sheet, line-ups and expected warnings as the compatibility baseline | The child micro-story adds new art on top of an existing tested renderer | Existing fixtures pass unchanged when the new character layer is disabled |
 | 2 | Per-render state: remove globals (`P`, `GS`, `HS`, `BL`, `EX`, `FACE`, `CLAMPS`, `rnd`) | Multi-figure and repeat renders depend on it | Render order cannot change any output |
 | 3 | Public fixed camera: vertical field of view, delivery frame size, near-plane clipping. Build on the fixed scale-and-offset path `draw` already uses for `renderLineup` (`sh.fix`) | Scene records always auto-fit the projected figure into a 320 x 200 frame, so a camera cannot stay put across shots or place a subject on a third | A locked camera keeps a world marker on the same pixel while the subject moves; a primitive crossing the near plane is clipped, never projected from behind the lens |
 | 4 | IK guards, joint limits on reach targets, named contact sites, coded diagnostics (section 7, step 5) | Needed by section 7 | An impossible elbow on a reachable target is reported with its code |
@@ -651,6 +652,8 @@
 | C. Repeatable storyboard films | Description-to-scene with repair; three new stories, including one in a different style profile | Two of three films within the cash cap and a 45-minute labour target, counting all active producer minutes from brief to private master (rejected takes and manual repair included, provider waiting excluded) from the labour ledger. Report median and maximum by stage and the number of shots needing manual blocking. Swapping out a hard brief counts as a failure |
 | D. Continuity, dialogue and languages | A silent parcel handoff; a short dialogue scene with two voices; a second-language recut | Two viewers identify who gives and who hesitates; roles identifiable across cuts; a fluent reviewer signs off |
 | E. Generation and post (optional, later) | Route experiment (Appendix A.5), then one generated still replacing a drawing with a parallel cut, at most one motion shot; post-production beyond the mix if it earns its cost | Private upload under $5 cash; decide whether generated plates beat the drawn film for the cost |
+
+**Phase A coverage.** Choose what the child spots and why it changes their expectation before recording the line. Board the search at the rail, the object as the child sees it, and a return close enough to read the changed expression. Aim the first look at the object's place in the set. Use one consistent child design and two expression drawings. Hand-authored board details and a single manually separated drift on the object insert are sufficient for A. Reserve reusable cutout export and the general character renderer for B. In the silent check, ask what the child saw and which change in the child gave away the feeling.
 
 **Comprehension counts in phase C.** Before each phase C film, write the
 audience question (for a story: what was the turn, and what did the main
```

## 2. Make layered motion reproduce the approved drawing and preserve contact

**Critical**

The acceptance test for row 3b in §8 can pass while the child’s grip slides along the rail. In `balcony-lean.png` the near arm crosses the rail and the torso sits behind it. A single figure plane and a single rail plane cannot in general reproduce that interleaving. `expandProps()` splits rails into bars and `draw()` interleaves primitives in depth order. `renderFrame()` then wraps them in a paper rectangle and `draw()` inks a border. Moving finished SVGs would move the border or cover underlying art. Round 2 specified what to watch during motion. Draft 6 introduces a new source of motion, so assembly now needs an executable layer contract and an honest fallback when the drawing cannot be separated.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -453,13 +453,10 @@
 - **Parallax from layered cutouts (phase B's camera movement).** Instead of
   rendering 3D camera paths, the renderer exports each board as separate
   cutout layers by depth: background, midground set, each figure, foreground
-  props. Assembly translates and scales each layer at a rate set by its
-  depth, so near layers move more than far ones, which reads as a real
-  camera drift or push-in at almost no cost. Rules: layer gaps (what was
+  props. Export a manifest with the common canvas, ordered transparent artwork by digest, transform origin, and start/end translation and scale with easing for each group. Keep paper, framing marks and caption coordinates fixed in delivery space. The edit pins the manifest digest and frame range so preview and assembly evaluate the same move. Rules: layer gaps (what was
   hidden behind a cutout) are filled by drawing the full background, not
   just its visible part; moves stay small enough that no cutout edge or gap
-  shows; layer depths come from the scene record, so parallax is consistent
-  with the board's perspective. Full 3D camera paths stay for later.
+  shows. Split a rail or limb where front/back order changes. Group touching parts under one transform wherever independent movement would open a grip or slide a foot. Start with the fully inked board and compare its pixels with the zero-offset composite at delivery size, allowing rasterisation tolerance. Play the full move with contact points and canvas edges checked. If separation fails, hold that board and place the intended drift on a separable shot. Full 3D camera paths stay for later.
 - **A reveal is not an enlargement.** Projection divides by depth, so a
   camera moving sideways changes what is hidden; scaling a still does not.
   A held still allows only a crop inside its bounds, previewed exactly,
```

## 3. Give reverse angles a common set and a common source of light

**Important**

Section 8 expects a reverse to keep the door and light direction, but §5.2 embeds an entire room and directional light in each board. The two ladder JSONs demonstrate the cost of that design even for a single prop: both repeat the base, top, spacing, pose and reach targets. An axis ID can detect a crossed line while a window has silently moved behind the listener. On a reverse, the same window may correctly move from screen left to screen right. A world-space source and a persistent landmark settle the difference, and give the background a job in the cut.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -254,6 +254,8 @@
   "props": [{"id": "parcel", "t": "box", "mid": ["giver.lHa", "giver.rHa"], "size": [0.4, 0.28, 0.3]}]
 }}
 ```
+
+For v2, let boards of one location reference a shared set revision. Store floor and axes, fixed props, landmarks and motivated light sources in set coordinates. A camera setup references that set and stores its view. A board references the setup and adds cast, the current state of movable props and any beat-motivated light change. Inline sets still work for one-offs. Resolve these references to the same geometry before projection and include their digests in the board receipt. On a wide/reverse/return fixture, move the shared window once: every dependent view inherits its position and key direction, and unrelated sets stay current. Review the sequence for where the window and the lit cheek appear from each viewpoint.
 
 Solving order: world props, then each figure against its anchors, then held
 props. Circular anchors (hands solved against a box placed by those hands)
```

## 4. Make the style profile specify what the storyboard renderer can draw

**Important**

Section 7a.6 assigns palette to generation and texture to grading. Yet its colour-field profile relies on saturated colour and its thriller relies partly on movement unavailable in §1.1. Two different profile names can therefore resolve to the same deliverable. In `child-peek.png`, the head and rails have nearly the same ink weight. In `mannequin.js`, `css()` provides one `.ink` rule and `.pap` fill, while `strk()` receives widths and wobble from drawing calls. The value pass can separate a face from a rail, but the character sheet and the environment also need to share a drawing convention across a wide, an insert and a close-up. Round 2’s pinned strip is a good approval surface. What is missing is a feasible style to render into it.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -506,8 +506,8 @@
 | Movement | Allowed moves and their character: locked-off, precise lateral tracking, whip pans, handheld, slow push-ins |
 | Tonal key and contrast | Default key, contrast range, whether black-and-white |
 | Light | Typical motivations, hard or soft, time of day, practical lights |
-| Palette | Colour scheme or monochrome; used by generation, ignored by the value pass |
-| Texture | Grain, softness, halation; generation and grading only |
+| Paper, ink and fills | Specify paper, ink and the two or three drawable fill values. For a colour profile, supply flat swatches with distinct value roles or approve a monochrome interpretation on the strip. |
+| Drawing marks | Shared outline and interior line widths at delivery size, wobble and optional character hatching. Decide how detail simplifies in a wide and how marks hold up in close-up. Apply these choices to characters, sets and authored inserts. |
 | Editing | Average shot length, cut types, transitions, rhythm against narration |
 | Aspect ratio | Within the delivery frame: full frame, or a letterboxed or pillarboxed image area |
 
@@ -522,6 +522,7 @@
 
 How it is used:
 
+- Resolve the profile against the current board and movement capabilities at approval 1. If a signature choice cannot appear on screen, name a drawable substitute or choose another profile. For example, carry the thriller rhythm with a held canted wide and a hard cut to a tight detail. Show the substitution on the existing strip and preview the cut at speed before building the remaining shots.
 - The shot list and the scene step choose from the profile's preferred
   values first; a deliberate break is allowed but must carry a reason.
 - The review sheet flags shots that drift from the profile (a handheld shot
```

## 5. Let a dramatic pause change the voice edit

**Important**

Section 6 requires a second of lead and resolution around every change. I disagree with retaining this round-two rule as a universal acceptance gate. It makes an instant recognition and a reluctant decision play at the same minimum cadence. More fundamentally, §4 locks a take before boards exist. The signed cue offset moves a picture cut, but §5.1 has only one voice asset clock. Moving a cut cannot create silence between two words. If the child’s expression needs another half-second, the alternatives should include inserting a clean pause at a phrase break without recording every later line again.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -204,6 +204,7 @@
   and its chosen frame (the first frame the receiver withdraws), which also
   allows a silent film with no voice or captions. Retiming a picture beat
   reopens the animatic. Cut positions never come from rescanning captions.
+- Allow the rough cut to add or trim a pause at a producer-marked clean phrase boundary. Keep the approved source take and its sample marks. Save ordered source sample ranges and inserted silence durations, render the edited voice and derive its hash and source-to-edit sample map. Resolve speech cues and caption bounds through that map before rounding cuts to frames. A cue removed by a trim blocks assembly. Use a pickup when a splice damages breath or inflection. Test a half-second pause on the reaction: earlier cues stay put, later speech and captions shift together, picture anchors are reviewed, and the bed follows the new duration.
 - Changing a board hash, media digest, source range or voice hash marks the
   affected intervals and the master stale; changing only a mix region does
   not rebuild boards.
@@ -283,7 +284,7 @@
 
 | Stage | Method | Failure handling | Acceptance |
 |---|---|---|---|
-| Screenplay | Story to scenes and beats, each beat with what happens and its intended effect. For an explainer: opening question, observable change, answer. Each beat has a target duration and minimum screen time; the word budget comes from a test read or the chosen voice's measured rate (65 to 90 words for 30 to 45 seconds is only a first estimate). Claims tied to evidence | One redraft after notes; unsupported claims rejected; a beat that doesn't fit gets a shorter line or fewer shots | The timed read leaves at least a second of lead and a second of resolution around each observable change; a viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
+| Screenplay | Story to scenes and beats, each beat with what happens and its intended effect. For an explainer: opening question, observable change, answer. Each beat has a target duration and minimum screen time; the word budget comes from a test read or the chosen voice's measured rate (65 to 90 words for 30 to 45 seconds is only a first estimate). Claims tied to evidence | One redraft after notes; unsupported claims rejected; a beat that doesn't fit gets a shorter line or fewer shots | The timed read leaves room for the beat’s intended recognition, surprise or hesitation at playback speed; a viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
 | Voice | Human recording or TTS, decoded to 48 kHz mono. For a short human read, hand-marked phrase bounds and cut cues on the actual take, stored with the audio hash | Missing required marks or text mismatch blocks the beat | Ordered onsets, correct cue words, no clipped syllables |
 | Shot list | Per beat: what is different on screen at the end, camera side, focal subject, cue, must-see, may-hide | Shots that merely illustrate the same noun are cut; tighten the script instead | Every line maps to a shot or an intentional hold; adjacent screen direction checked |
 | Storyboard | Shot to scene record (section 7), render sketch and diagnostics | Two repair rounds, then manual blocking | Required action identifiable at phone size with captions covered; hard diagnostics pass |
```

## 6. Test whether the extra directing work earns its screen time

**Important**

Section 11 tests whether people understand the film and whether production fits the labour cap. Viewers can answer correctly and still want to stop watching. They can also infer the entire turn from the read. Neither outcome tells the producer which moving or elaborately staged shots justify repeating. Round 1 compared generation routes. The live editorial choice is cheaper to test with the actual boards and voice, inside the first finished film. Compare one disputed decision at a time so a preference leads to a specific edit.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -662,6 +662,8 @@
 together. Time for the check and any recut is counted as labour. One viewer
 can expose a failed explanation; a pass is reported as a pilot observation.
 
+**Before repeating the phase B workflow**, audition one expensive or doubtful editorial choice in context. Keep the approved version and make a cheap alternate from its assets: for example, lock off the same reaction instead of drifting, with identical timing, voice, music and captions. Pick the question in advance (does drift sustain anticipation or draw attention to the rail?). Give fresh viewers different first versions and ask where attention wandered or anticipation changed before showing the alternate. Keep the version that serves the beat, log the extra producer minutes and the reason. Mixed responses leave the choice provisional. Use this as an editorial decision about that sequence, never as a general claim about audience retention.
+
 ## 12. Risks
 
 | Early sign | Consequence | Response |
```

## 7. Keep irreplaceable production media outside the disposable run cache

**Important**

Sections 5 and 5.3 commit small inputs and ignore large run outputs. Phase A explicitly requires a human take. A hash can detect loss of the only recording, but it cannot reproduce the performance. The same problem applies to an approved hand-drawn reaction and a licensed bed. Per-file atomic rename protects a write in progress. It does nothing for a producer restoring yesterday’s approved edit onto a new machine. A modest local archive suffices for the pilot.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -276,6 +276,8 @@
 a changed spoken line rebuilds its audio, captions, affected cuts, mix and
 master. Outputs are written to a temporary file, checked, then renamed into
 place.
+
+Treat original recordings, imported art, music and any manually retouched layer as source media. At ingest copy each into a durable project asset store keyed by digest, with a backup outside the run directory. Commit a small manifest linking each digest to its project role and provenance. Cache only reproducible derivatives in runs. Before signing off the pilot, restore the project and source assets in an empty run directory, build offline with the recorded tool versions, and check picture boundaries, voice cues and selected media against the approved edit. Report a missing digest and its affected shots before starting an encode.
 
 See Appendix A.2 for paid-call bookkeeping (deferred with generation).
 
```

## Questions the plan still cannot answer

- What discovery changes this particular child’s expectation, and what visible reaction would distinguish that feeling from simple surprise?
- At the intended phone size, how much expression can the chosen drawing style carry before the shot needs a different pose or cut?
- Which beat in the first full film benefits enough from parallax to justify separating its artwork?
- After the first few films, is most producer time going into performance, blocking, or timing revisions?
