# Round 1 review of the ai-movie plan

The first decision is whether blocking a shot in metres earns its producer time. The ladder pair can demonstrate what a camera change communicates. It takes a separate comparison, beginning with an unseen brief, to learn whether building the board was worth doing.

## 1. Test the cost of directing from scratch

**Severity — critical**

Section 10’s text-only arm derives its prompt from a finished scene. That is a good control for the effect of *sending the image*. Every arm has already received the director’s camera and contact decisions. This design cannot answer the business question in section 12 about skipping board labour. The ladder pair even shares a single blocking decision. Counting two takes or two judges as additional briefs would exaggerate the evidence. With eight intents overall, one changed verdict moves the overall first-pass rate by 12.5 points, and class-specific rates are coarser still. An inconclusive pilot should cost the project one small trial, not determine its architecture.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -284,25 +284,27 @@
 
 ## 10. The generation route experiment
 
-Run before building the generation adapter.
-
-- Eight shot intents, including the ladder pair, child behind a rail,
-  carrying a box, dive toward camera, floor lift, the V hand and a neutral
-  standing shot.
-- Three routes: text only (a deterministic shot description from the scene
-  record), reference image (the board plus the same text), and structural
-  control (contour or depth export) where the chosen model supports it.
-- Two attempts per route per intent, same model, style and aspect ratio.
-- Labels hidden and shuffled. Two reviewers score contact, viewpoint, subject
-  count, readability and fit with the previous cut, and log minutes including
-  board creation.
-- **Decision rule, set in advance**: adopt a board-driven route for a shot
-  class if it beats text only on first-pass acceptance by at least 20
-  percentage points without raising the cost per accepted still. Ties: boards
-  for hard geometry, text for simple shots. Both fail contacts: ship the
-  drawn frame.
-- Cost: about 48 stills, roughly $4 at the 1080p rate above, paid from
-  development, not a film's budget.
+Run a capped manual pilot before building the generation adapter. Freeze a
+set of unseen shot briefs, the previous cut, must-see criteria and delivery
+shape. Include ordinary explanatory inserts as well as difficult contacts.
+Keep alternate views of one setup together when counting independent cases.
+
+- First compare workflows. Give one operator the brief to write a direct
+  prompt. Independently block the same brief and submit the board with a
+  scene-derived prompt. Use the same model, style, size and take allowance.
+  Time both workflows from receipt of the brief through review and repair.
+- If the workflows differ, submit the scene-derived prompt alone on the
+  disputed shots to isolate the contribution of the reference pixels.
+  Try structural controls only on a demonstrated failure with a supported
+  input. Price the planned calls against a separate development cap first.
+- Shuffle route labels. Judge first takes against the frozen brief in the
+  cut. Score the approved drawing too, at zero generation spend. Count each
+  brief once per route. Record retries, unrecoverable failures, billed cash
+  and active minutes, including time spent on rejected shots.
+- Before running, the producer sets an acceptable cost in minutes and cash
+  for one additional usable shot. Report paired wins, losses and ties with
+  their counts. A small or mixed result leaves routing provisional. Confirm
+  any proposed default on fresh briefs in phase C before funding automation.
 
 ## 11. Phased delivery
 
```

## 2. Make the first cut reveal something the viewer can find

**Severity — important**

In `resource/pose/ladder-climb.png` I can trace two arms to the upper rungs. In `ladder-from-below.png` the foreground boot and rungs are prominent while the far hand is difficult to pick out. The JSON files have identical pose and ladder data. The evidence supports a lesson about visibility from a viewpoint. It does not establish that someone let go. Section 11 currently lets someone pass the test by repeating the narrator. At 960 × 600 both images also spend considerable width on empty paper. Playing them full-width inside a portrait master makes the hands a small part of the phone image. The edit can test this immediately using the existing plates.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -308,7 +308,7 @@
 
 | Phase | Film | Exit decision |
 |---|---|---|
-| A. First cut, no image model | 15 to 20 seconds: the side-view ladder climb, cut to the same climb from below, back to the side, while the narrator explains what the low camera hides. Existing PNGs as portrait panels, human or Polly voice, captions, hard cuts | Someone new to the project can say which contact disappeared and why; plays on a phone |
+| A. First cut, no image model | Use the ladder pair for a 15 to 20 second observation. Establish the hands in the side view, ask the viewer to track the far hand, then cut low and leave a beat to look. Return to the side for the answer. Choose a portrait crop or detail insert that keeps the comparison and captions legible | Before recording final narration, show the two views silently on a phone to a fresh viewer. Ask them to point to the grip in the first view and describe what they can still see in the second. If the intended change is unclear, adjust framing or choose a clearer comparison. In the voiced cut, check that the viewer understands the climber held the pose |
 | B. First generated film | 30 to 45 seconds; approved animatic; one generated still replacing a drawing, at most one motion shot; parallel cut with the drawing | Private upload with captions and receipt under $5 cash; producer minutes recorded |
 | C. Repeatable explainers | Route experiment done; description-to-scene with repair; three unseen briefs including a non-ladder scene | Two of three films within the cash cap and a 45-minute labour target |
 | D. Continuity and languages | Second-language recut; two figures in one room; a silent parcel handoff | A fluent reviewer signs off; two viewers identify who gives and who hesitates |
```

## 3. Keep an ambiguous paid submission charged against the cap

**Severity — critical**

Section 5.3 leaves a crash window after the provider accepts a request and before the job ID reaches disk. There is then nothing to poll. A second local worker can also read the same remaining balance before the first worker’s reservation becomes visible. Renaming individual output files solves neither problem. Section 9 already calls for lost-response tests but gives them no spending invariant. With the small cap in section 3.1, correctness means being able to stop with money still reserved even if the shot is abandoned.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -187,9 +187,18 @@
 versions, seed and model settings. A changed title rebuilds only the release;
 a changed spoken line rebuilds its audio, captions, affected cuts, mix and
 master. Outputs are written to a temporary file, checked, then renamed into
-place. Paid calls persist their reservation and intent before the network
-call and the provider's job id immediately after, so a crash resumes by
-polling rather than paying twice.
+place. Serialize reservation decisions per film. Under the same lock, check settled
+charges plus outstanding maximum charges plus the new maximum against the
+cap and durably record the attempt key and reservation before submission.
+All workers and reruns of that film share this ledger.
+
+Persist a returned job ID and resume polling it. If submission may have
+succeeded without a recorded ID, keep the reservation open. Reconcile by
+attempt key, or replay that key only when the adapter has verified provider
+deduplication for the retry window. Otherwise mark the attempt unresolved,
+use the drawing if needed, and require billing or job evidence to settle it.
+A creative retake gets its own key and reservation. Test a lost acknowledgement
+followed by restart and two workers competing for the last available funds.
 
 ## 6. Stages
 
@@ -348,7 +357,7 @@
 | Voice before visuals, animatic approval | GPT | Draft 1 and Grok put visuals first |
 | Fixed camera mode before environments | GPT, confirmed in code | Draft 1 and Grok missed that framing is always automatic |
 | Must-see / may-hide / cut-from on shots | GPT | — |
-| Cost reservation and job ids before network calls | GPT | — |
+| Cost reservation before submission | GPT | Reconcile ambiguous submissions under the original reservation (§5.3) |
 | Route experiment with a pre-set decision rule | GPT, widened with Grok's structural-control route | Grok's "control maps are the primary route" kept as a candidate, not a decision |
 | Depth and pose exports | Grok, merged with GPT's contour and object-id passes | — |
 | Evaluation set of 30 to 50 descriptions | Grok | — |
```

## 4. Separate retrieval examples from the directing exam

**Severity — important**

Section 7 promotes the same accepted records into both the retrieval library and the evaluation set. A system can then improve its measured accept rate by retrieving the answer. Section 9 also tracks previously accepted records, a valuable regression check that measures a different property. Merely splitting filenames leaks near-duplicates such as the two ladder views. Rejected briefs matter too. Excluding the shots the producer had to block manually would hide the labour the plan hopes to save.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -236,12 +236,17 @@
    frame margins, support under seated bodies, at least 60% of each figure in
    frame unless intended. Human judgement: acting, readability, weight,
    intended ambiguity.
-7. **Choose in sequence**: show two or three candidates between the previous
-   and next approved frames. Accepted records join the pose library and the
-   evaluation set.
-
-An **evaluation set** of 30 to 50 shot descriptions with human-accepted
-records (Grok) measures the method over time.
+7. **Choose in sequence**: show candidate framings in the rough cut.
+   Save approved records as retrieval examples and regression fixtures.
+
+Reserve part of the 30 to 50 descriptions as a blind directing test before
+tuning retrieval or repair. Split by setup or brief family, keeping related
+views together. Withhold the test descriptions, reference solutions and
+review notes from retrieval and tuning. Judge against the brief in sequence,
+allowing multiple valid compositions. Report first-pass accepts, accepts
+after repair, manual blocks, abandoned shots and producer minutes over all
+assigned briefs. If a test case enters the library, replace it with a fresh
+unseen case before the next reported evaluation.
 
 ## 8. Storyboard renderer roadmap
 
```

## 5. Give visibility checks an independent depth test

**Severity — important**

The fixed-camera row in section 8 overlooks `draw(sh)`’s `sh.fix` override, used by `renderLineup`. The actual gaps are a public calibrated camera, arbitrary frame size and clipping. More consequentially, `draw` projects blob point clouds, takes their convex hulls and sorts each item by one depth. `expandProps` subdivides the ladder rails, but an individual rung or limb still gets one sort key. A projected ID pass painted in that order can align perfectly with a physically wrong overlap. In the low ladder frame a foreground rung crosses the boot, exactly where a wrong ordering would change the story. Alignment alone, the proposed acceptance test, cannot detect this error. A bounded visibility check on required regions would be enough for the first film that needs automation.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -249,9 +249,9 @@
 |---|---|---|---|
 | 1 | Regression tests on the 18 reference scenes and the warnings | Everything below changes drawing code | Any drawing change fails until goldens are updated deliberately |
 | 2 | Per-render state: remove globals (`P`, `GS`, `HS`, `BL`, `EX`, `FACE`, `CLAMPS`, `rnd`) | Multi-figure and repeat renders depend on it | Render order cannot change any output |
-| 3 | Fixed camera mode beside today's auto-fit, with frame size and near-plane clipping | Today `draw` always rescales to the figure, so a camera cannot stay put across shots or place a subject on a third | A figure walking across a fixed frame changes position and size |
+| 3 | Expose a fixed camera with vertical FOV, delivery dimensions and near-plane clipping. Reuse the fixed projection scale and offset path used by `renderLineup` | Public scene records currently auto-fit projected joint bounds in a 320 × 200 viewBox | A locked camera keeps a world marker at the same pixel as the subject moves. Crossing the near plane clips the primitive without projecting points behind the lens |
 | 4 | IK guards, joint limits on reach targets, named contact sites, structured diagnostics | Needed by section 7 | An impossible elbow on a reachable target is reported |
-| 5 | Control exports: clean contour, joint skeleton, depth, object-id pass | Generation routes and visibility checks need them | Overlays line up with the sketch in both ladder views |
+| 5 | Keep stable part and prop IDs through geometry expansion. For occlusion-critical regions, compare camera-space surface depths on common camera rays using simple surface proxies. Export aligned contour, skeleton and depth when a consumer needs them | Painter order alone can hide the wrong contact | In a crossing-bar fixture where the nearer bar changes along the overlap, the visible ID switches at the known crossing. Check both ladder views against the drawn overlaps. Flag disagreements or ambiguous proxy intersections for review before automatic acceptance |
 | 6 | Several figures in one depth-sorted draw list, namespaced joints | Two-person scenes | Two people share a floor with correct overlap |
 | 7 | Environment presets and one key light with floor shadows | Places and mood | A reverse angle keeps the door and light direction |
 | 8 | Start and end poses with locked contacts, for motion planning | Guide image-to-video and catch foot slide | Interpolation that breaks a locked contact fails |
```

## 6. Let the editor place a cut around the spoken cue

**Severity — important**

Section 4 equates a shot with a setup, yet Phase A returns to its opening setup. Section 5.1 gives the shot an `inCue`, and section 6 accepts cuts “on cue frames.” An editor may need the low angle on screen before the word “hand” so the viewer has time to search, or may hold the drawing through a pause. A cue identity is useful for a translation. Treating it as an exact cut time removes that latitude. Likewise, the Phase A human recording has no specified way to acquire timing marks. A short film needs a cheap manual path that survives an audio pickup without silently reusing stale timing.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -86,8 +86,9 @@
    displayed text, cue words with stable IDs, and evidence.
    **Approval 1: script and pronunciation.**
 3. **Voice**: synthesise or record the narration and get word timings.
-4. **Shot list**: one row per camera setup, tied to a beat and a cue, with
-   must-see and may-hide lists and the shot it cuts from.
+4. **Shot list**: one row per intended appearance in the cut. Reuse a camera
+   setup or plate on a return cut. Tie the appearance to a beat and cue,
+   with must-see and may-hide lists and the shot it cuts from.
 5. **Storyboard**: each shot becomes a scene record and a sketch frame.
 6. **Animatic**: frames cut to the real narration timings, watched as a film.
    **Approval 2: storyboard, judged in sequence, not frame by frame.**
@@ -127,7 +128,7 @@
 |---|---|
 | brief | audience, question, evidence, locale, delivery `{width, height, fps}`, cashCapUsd |
 | beat | spoken, display, cues `[{id, word, occurrence}]`, evidence, purpose |
-| shot | beat, intent, template (reference pose), setup, inCue, mustSee, mayHide, motion, cutFrom |
+| shot | beat, intent, template (reference pose), setup, inCue, signed cueOffsetFrames (default 0), mustSee, mayHide, motion, cutFrom |
 | scene v2 | camera, environment, lights, figures, props (below) |
 | board receipt | scene hash, seed, art path, control paths, projected anchors, diagnostics, approval |
 | attempt | shot, board hash, route, model, prompt, attempt number, job id, asset, checks, estimated and billed cost |
@@ -196,14 +197,14 @@
 | Stage | Method | Failure handling | Acceptance |
 |---|---|---|---|
 | Script | Brief to beats: opening question, observable change, answer. 65 to 90 spoken words for a 30 to 45 second film. Claims tied to evidence | One redraft after notes; unsupported claims rejected | A viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
-| Voice | Human recording or TTS with word timings, decoded to 48 kHz mono | Missing marks or text mismatch blocks the beat | Ordered onsets, correct cue words, no clipped syllables |
+| Voice | Human recording or TTS decoded to 48 kHz mono. For a short human read, hand-mark caption phrase bounds and named cut cues on the actual take. Store sample offsets with its audio hash | Missing required marks or text mismatch blocks the beat | Ordered onsets, correct cue words, no clipped syllables |
 | Shot list | Per beat: what is different on screen at the end, camera side, focal subject, cue, must-see, may-hide | Shots that merely illustrate the same noun are cut; tighten the script instead | Every line maps to a shot or an intentional hold; adjacent screen direction checked |
 | Storyboard | Shot to scene record (section 7), render sketch and diagnostics | Two repair rounds, then manual blocking | Required action identifiable at phone size with captions covered; hard diagnostics pass |
 | Animatic | Approved boards cut to the narration timings | Re-block shots that don't read in sequence | Producer approves the sequence |
 | Generation | Still from the approved board (route from section 10), downloaded and logged; motion only from approved stills | Bounded backoff on rate limits; one creative retake per shot; fall back to the drawn still | Must-see items present; start, middle and end of motion checked for drift |
 | Captions | Words grouped into phrases from the timings; WebVTT; optional burn-in | Reflow when a line changes | Two lines max, about 17 characters per second, inside the safe area |
 | Music | Start with silence; one owned or licensed bed, ducked under speech | Mute if it fights consonants or rights are unclear | Cue words audible without reading on a phone speaker |
-| Assembly | Integer frame timeline compiled to FFmpeg; H.264 and AAC in MP4 | Missing media stops with the shot id; never silently loop a short take | Correct size and fps, duration within one frame, cuts on cue frames, -16 LUFS integrated, peak at or below -1 dBTP |
+| Assembly | Integer frame timeline compiled to FFmpeg; H.264 and AAC in MP4 | Missing media stops with the shot id; never silently loop a short take | Correct size and fps, duration within one frame, cut boundaries match the approved edit (round absolute cue samples to the nearest frame, then apply the editorial offset). Reject reversed or empty shot intervals, -16 LUFS integrated, peak at or below -1 dBTP |
 | Publish | Cover from an approved frame, title stating the actual comparison, release receipt | Missing rights or disclosure blocks release | Private upload watched on a phone before going public |
 
 ## 7. The hardest problem: shot description to scene record
```

## 7. Make the rate card auditable before reserving money

**Severity — important**

Sections 3 and 15 describe the same vendor details as both awaiting verification and already checked. Section 15 names several pages without URLs or the billing increments behind the example. Prices, model availability, timing features and platform rules in those sections are **unverified** in this review. Even using only the plan’s own arithmetic, one call count does not identify an orderable clip length or demonstrate how two six-second slots will be filled. Section 6 forbids silently looping a short take. Producer choices about trimming a longer take or holding a still affect both the edit and the reservation. Recording one working purchase path is sufficient for the pilot.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -360,10 +360,15 @@
 | TypeScript orchestrator | Grok | Rejected: the agreed stack is dependency-free JavaScript |
 | Web review UI | Grok | Deferred: a generated HTML review sheet covers phases A to C |
 
-Model and price facts checked on 2026-11-24 against Runway's pricing page,
-Amazon Polly pricing, YouTube's Shorts help page, Cartesia's API docs, and
-provider listings for Kling 4.0, Seedance 2.5, Wan 3.0, MiniMax H3, Gemini
-Omni Flash and FLUX 3.
+External model names, rates, timing features and platform rules in this
+draft are **unverified**. Section 3.1 is an illustrative estimate. Before
+the first purchase, record the selected endpoint and model, input/output
+limits, orderable clip lengths, billing unit and rounding, currency, and
+maximum units per attempt with the primary source URL and date checked.
+For each motion slot, show the ordered duration, usable trim or approved
+still hold, and the maximum spend including its permitted retake. If the
+verified offer cannot fill the cut within the cap, use the approved drawing.
+Record the platform source and check date with the release decision.
 
 ## 16. Flywheel status
 
```

## Questions the plan still cannot answer

- Which recurring audience question would justify making a second film after the ladder demonstration?
- How many active producer minutes is one additional accepted shot worth, and does that answer change when the drawing already reads?
- Which classes of shot, if any, lose enough meaning in a drawn hold to justify buying motion?
