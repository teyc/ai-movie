# Round 2 review of the ai-movie plan

Reviewed draft 3. The highest-priority change is to make the final edit select the exact media the producer approved. The other revisions concern which images earn their place in that edit and how to tell whether the sequence works.

## 1. Bind every cut to the approved media

**Severity** — critical

Round 1 C3 settled the timeline arithmetic. Its implementation in §5.1 still leaves the editor unable to replay a creative choice. Two generated takes and the drawing can share a board hash, a shot ID and the same 45-frame trim. Phase B explicitly needs two cuts that differ in precisely this respect. The attempt record identifies an asset, but no interval selects an attempt or its bytes. A correct frame count in §9 would pass even with the rejected take on screen. Keep the board as provenance and make the selected media an independent input to approval and assembly.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -167,2 +167,3 @@
 {"startFrame": 38, "endFrame": 83, "shot": "ladder-side-1", "board": "sha256...",
+ "media": {"kind": "clip", "sha256": "..."},
  "sourceInFrame": 0, "sourceOutFrame": 45, "transition": {"kind": "cut"}}
@@ -175,3 +176,9 @@
 affected intervals and the master stale; changing only a mix region does not
-rebuild boards.
+rebuild boards. Resolve each media digest to the approved drawing, still or
+clip. For clips, hash the delivery-fps conform that was reviewed and interpret
+source frames on that conform. For stills, omit source frame bounds and hold
+the selected image for the interval. Verify bytes before assembly and fail
+with the shot id on a missing asset or digest mismatch. In the phase B test,
+swap only the selected take: the board approval survives, the final approval
+reopens, and the two edits reproduce their respective cuts offline.
 
```

## 2. Let the cheapest intelligible shot win

**Severity** — important

§10 now compares prompting with 3D blocking fairly for a shot that needs a depicted scene. It still selects the medium before asking what image would answer the question. In an explainer about why a viewpoint hides a hand, a side-on diagram of the camera, hand and intervening body could explain the cause after the two views establish the effect. A third polished view might simply repeat the effect. §7 routes unknown actions to manual blocking and §4 sends every shot through a scene record. This systematically omits an inexpensive editorial option. Round 1 G1 tested who should do the blocking. This is a decision about whether the beat needs a staged performance at all.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -109,7 +109,11 @@
    camera setup or plate. Each appearance is tied to a beat and a cue, with
    an editorial offset from the cue, must-see and may-hide lists, and the
    shot it cuts from.
-5. **Storyboard**: each shot becomes a scene record and a sketch frame.
+5. **Storyboard**: choose the image that supplies the missing information.
+   Use a scene record for staged action. An explanatory insert can supply an
+   authored diagram or annotated detail directly as its board and final still.
+   Carry its source digest, evidence, style and must-see test through the
+   same animatic and approval. Pose retrieval applies to staged action.
 6. **Animatic**: frames cut to the real narration timings, watched as a film.
    **Approval 2: storyboard, judged in sequence, not frame by frame.**
 7. **Generation** (optional per film): stills from approved frames, then
@@ -537,6 +541,12 @@
   12.5 points, so a small or mixed result leaves routing provisional; any
   proposed default is confirmed on fresh briefs in phase C before automation
   is funded.
+- On an explanatory brief that can be answered graphically, cut one simple
+  diagram or detail insert into the same slot. Time its preparation and ask
+  a fresh viewer the brief's question after playback. If it communicates the
+  answer within budget, keep that route eligible even when both generated
+  workflows pass. Score this as a choice of shot, outside the paired model
+  comparison.
 - Cost: priced against a separate development cap before running, not a
   film's budget.
 
```

## 3. Ground the performer before solving the eyeline

**Severity** — important

In mannequin.js, fig computes the desired direction from an estimated head position, clamps the neck and head, and measures the residual in requested angles. Later, draw applies stand by translating joints and shapes vertically. The world target stays put. Thus the warning can be clear while the final head points above or below a nearby object. Both performers in the proposed §5.2 handoff use stand and explicit world targets. Their attention is the scene's performance. §7's ten-degree test needs to measure the final ray. This is separate from round 1's reach-limit diagnostics and can preserve existing v1 drawings.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -224,7 +224,13 @@
 
 Solving order: world props, then each figure against its anchors, then held
 props. Circular anchors (hands solved against a box placed by those hands)
-are rejected.
+are rejected. Preserve legacy v1 drawing behaviour. For v2, finish support
+placement before aiming at a world target. Measure the angle between the
+final head-forward vector and the vector from the final eye point to the
+resolved target. Report an undefined direction for coincident points.
+Test two grounded performers of different heights looking at a nearby parcel:
+the reported error must agree with an independent measurement from the
+exported final transforms, including when the requested turn is impossible.
 
 ### 5.3 Run state
 
```

## 4. Cut on a change of attention, including in silence

**Severity** — important

§7a.2 treats an off-screen look to the left as requiring a subject on the right. A point-of-view insert can centre the parcel. In a reverse showing the other performer, the direction of their answering look matters. The subject's horizontal position alone establishes neither relationship. §5.1 also derives every cut from a voice hash even though phase D requires a silent handoff. A signed offset from speech (round 1 G6) cannot anchor a beat in a scene with no voice track. Let the editor time the offer, hesitation and reaction in frames and review what the viewer infers across the cut.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -172,4 +172,7 @@
 half-open; an interval must be at least one frame long. Cut positions come
-from the voice hash plus each shot's cue and offset, never from rescanning
-captions. Changing a board hash, source range or voice hash marks the
+from a tagged timing anchor on each appearance. A speech anchor resolves
+the cue against its voice hash and adds the editorial offset. A picture
+anchor names a visual beat and its chosen timeline frame (for example, the
+first frame the receiver withdraws). It also supports a silent master with
+no voice hash or captions. Retiming a picture beat reopens the animatic. Changing a board hash, source range or voice hash marks the
 affected intervals and the master stale; changing only a mix region does not
@@ -362,7 +365,13 @@
   two subjects or along a direction of travel, so screen direction holds.
-- **Eyelines and screen direction** match across a cut; a look off-screen
-  left is answered by a subject on the right.
+- **Eyeline match**: name who looks and the intended target. A point-of-view
+  insert may centre that target. For a shot/reverse-shot exchange, project
+  the two look directions and review the apparent height and direction of
+  the answering look. Apply an axis warning only where a shared axis is
+  established; a neutral view or a visible crossing can reorient the viewer.
 - **Size progression**: establish, then move closer as information narrows;
   jump in size by enough that a cut reads as intentional.
-- **Cut on action or on a look**, and on the narration's cue word.
+- **Cut on action, a look, a reaction or a spoken cue.** In the silent
+  handoff, hold the offer long enough to register the pause, then cut to
+  the response. Compare the cut one beat earlier: keep the timing that lets
+  viewers identify who hesitated without a caption supplying the answer.
 - **Rhythm**: shot length follows how long the viewer needs to find the
@@ -370,5 +379,5 @@
 
-The 180-degree line, screen direction, eyeline side and size jump between
-adjacent shots can all be checked automatically from scene records; framing
-taste cannot.
+With a declared axis and targets, projection can flag a side change or an
+unexpected reversal. Leave ambiguous axes unscored. Review the cut in time
+to decide whether a viewer can follow the change of attention.
 
```

## 5. Distinguish a reveal from an enlargement

**Severity** — important

In resource/pose/ladder-from-below.png the near leg fills the lower ladder and the climber's body conceals much of the upper action. Enlarging that plate enlarges the occlusion. Translating a camera relative to the ladder can change which surfaces are visible. In draw, P2 projects camera-space coordinates as x/z and y/z, so points at different depths respond differently to a lateral camera move. §7a.3 nevertheless sends the same path to a held still and to moving-camera generation. That lets an approved reveal turn into a decorative push during fallback. Specify the intended change in the visible image and preview the actual affordable way of making it.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -392,8 +392,14 @@
   position, look-at and field of view over frames, with easing. The renderer
   draws start and end frames with movement arrows on the board, and renders
   the in-between frames for the animatic so moves are judged in time, not
-  imagined. The same path becomes the movement instruction for image-to-video
-  and the push-in or drift on held stills in assembly.
+  imagined. Record the visible result that motivates the move. A still
+  permits a crop within its image bounds; preview that exact crop, including
+  its end framing and available resolution. A reveal behind a foreground
+  object needs changing viewpoint: render the path from geometry, obtain a
+  verified moving take, or cut to a second board that shows the reveal.
+  For example, track past a rail until the hand appears. Check the hand at
+  the reveal frame and play the entire move for distracting edge flicker.
+  If fallback changes the reveal or its timing, review it in the cut.
 
 ### 7a.4 Where it plugs in
 
```

## 6. Approve a visual reference for the whole cut

**Severity** — important

§7a.6 approves a written profile with the script. A drawn ladder followed by one generated plate can meet every named camera and lighting preference and still look like footage from two different films. Phase B deliberately creates this seam. In child-peek.png the rail crosses the child's arms and the head just clears its top edge. There the rail is the obstacle that tells the story. A blanket reduction in environmental detail (§7a.3) or a global target for dark pixels (§7a.6) says little about whether the small head separates from the rail. Use a local value relationship and an actual reference image to judge continuity, while leaving room for a motivated shift in mood.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -329,8 +329,10 @@
 
 ### 7a.1 The shot vocabulary
 
-Every shot record states these choices, each with a one-line reason tied to
-what the shot must make the viewer understand or feel:
+Resolve these choices from the approved film profile, setup and shot
+overrides. Show the resolved choices on the board receipt. The producer
+writes one reason for the shot and explains deliberate departures; shared
+choices inherit their rationale from the profile.
 
 | Choice | Values | What it does |
 |---|---|---|
@@ -382,10 +384,12 @@
   motivation. High-key boards stay mostly paper; low-key boards are mostly
   dark with the subject picked out; a silhouette is a flat dark shape against
   light.
-- **Background and perspective.** Environments are drawn with deliberately
-  lower line weight and detail than the figure, so the subject reads first.
-  The horizon line and vanishing points follow from the camera and are drawn
-  faintly; horizon placement is a composition choice, not an accident.
+- **Background and perspective.** Give the focal subject and story-bearing
+  set detail first claim on contrast. In the peeking shot, preserve the
+  rail's height against the child's head and subdue competing balusters.
+  Derive horizon and vanishing directions from the camera and set axes.
+  Show construction guides on request; keep visible architectural edges
+  and overlaps in the clean board. A vanishing point may lie off screen.
 - **Composition guides** (thirds grid, safe area, caption band) as an
   optional overlay on review sheets, with headroom and lead room checked.
 - **Camera movement.** Scene v2 gains an optional camera path: keyframes of
@@ -459,7 +463,15 @@
   Prompts describe a style; they never ask a model to reproduce a specific
   film's frames.
 - The style profile is approved with the script (approval 1), because it
-  shapes every shot after it.
+  shapes every shot after it. At animatic approval, select a representative
+  board as the visual reference. Mark the focal light/dark boundary and the
+  story detail that must survive at phone size. For generated work, pin the
+  first approved finished plate as a reference for palette, edge treatment
+  and texture. Reuse these images on the review sheet. Play each replacement
+  between its neighbours with captions on. If the change in medium or light
+  looks like a change of place or time, match it locally, motivate the break
+  in the cut, or use the approved drawing. Judge intentional mood changes
+  against the dramatic beat.
 
 ## 8. Storyboard renderer roadmap
 
@@ -476,7 +488,7 @@
 | 3a | Value pass: two- or three-tone shadow block-in from tonal key and light motivation | Light versus dark is the main mood control and must be visible in boards (section 7a.3) | High-key, low-key and silhouette versions of one scene read as different moods at phone size |
 | 3b | Camera paths: keyframed position, look-at and field of view with easing; start and end boards with movement arrows; in-between frames for the animatic | Movement is a shot choice and must be judged in time | A dolly-in and a zoom from the same start frame visibly differ in perspective |
 | 3c | Composition overlay and checks: thirds grid, safe area, caption band, headroom and lead room | Framing must be reviewable and partly checkable | Subject placed on a third by a fixed camera lands within tolerance |
-| 6a | Background drawn at lower line weight and detail; faint horizon and vanishing points | The subject must read first; perspective must be visible | In a street preset, the figure is still the first thing a viewer finds |
+| 6a | Set-detail emphasis by focal subject; optional perspective guides | The viewer may need to find a doorway before a figure | In two versions of one street view, viewers can find the designated doorway or figure first; construction guides stay off the final plate |
 
 Rows 3a to 3c follow row 3 (they need the fixed camera); row 6a goes with
 environments. Later, from draft 1: concave outlines, per-profile muscle
```

## 7. Require comprehension on the repeatability trial

**Severity** — important

The script row in §6 asks whether a viewer could answer the opening question. Phase A actually asks a viewer. Phase C, where the team decides whether the workflow scales, can pass on speed and price while producing three uninformative films. Section 10 measures usable shots, which cannot establish that a sequence explains its subject. Add one cheap end-to-end observation per existing trial film. A single viewer is enough to expose a failed explanation, but a pass should be reported as a pilot observation.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@ -550,6 +550,14 @@
 | D. Continuity and languages | Second-language recut; two figures in one room; a silent parcel handoff | A fluent reviewer signs off; two viewers identify who gives and who hesitates |
 | E. Drama | One 30-second dialogue scene, starting with off-camera speech | Roles identifiable across cuts; decide whether drama is worth its cost |
 
+For phase C, before production write the audience question and the visible
+evidence a correct answer would cite. After one normal phone playback with
+the intended audio and captions, ask a fresh target viewer for their answer
+and which image explained it. Record their unaided response. Count a film
+toward the two required passes only when that same film meets the cash,
+labour and comprehension criteria. Count producer time for the check and
+any recut. Report all three outcomes and viewer counts.
+
 ## 12. Risks
 
 | Early sign | Consequence | Response |
```

## Questions the plan still cannot answer

- Which recurring audience question would benefit from seeing a spatial relationship that a simpler diagram could already explain?
- When watching the mixed-media cut, do viewers interpret the switch from drawing to generated plate as intentional, or as a change of subject?
- In the silent handoff, how long can the receiver hesitate before viewers read refusal instead of uncertainty?
