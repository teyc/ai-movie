# Round 2 review of draft 3

Draft 3 fixes many contracts, but it still has a planning-to-picture gap:
it names cinematic ingredients without describing how a shot proves them,
and it names motion and continuity without making those results replayable.
The strongest additions below turn subjective style and shot selection into
bounded records, not more checklist prose.

## 1. Replace the word-count heuristic with measured narration capacity

**Severity — critical**

Section 6 still sets “65 to 90 spoken words for a 30 to 45 second film.”
That is not a stable constraint: it silently assumes a speaking rate and
ignores pauses, pronunciation, captions and whether a word is a syllabic
name. The plan has a real voice stage and onsets, but its script gate is
independent of them. A 70-word sentence can be 25 seconds for a careful
human read or shorter for TTS. It can also consume the shot change it was
supposed to explain.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | Stage | Method | Failure handling | Acceptance |
 |---|---|---|---|
-| Script | Brief to beats: opening question, observable change, answer. 65 to 90 spoken words for a 30 to 45 second film. Claims tied to evidence | One redraft after notes; unsupported claims rejected | A viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
+| Script | Brief to beats: opening question, observable change, answer. The beat plan names its desired duration and minimum screen time, not a word target. Claims tied to evidence | One redraft after notes; unsupported claims rejected | The timed rough read has at least one full second of lead and one full second of resolution for each observable change; a viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
@@
 1. **Brief**: topic, audience, the one question the film answers, evidence,
    locale, delivery shape, cash cap.
*** End Patch

Beat records should carry a target interval, the approved utterance hash,
and the measured onset of the first and last non-pause word. The script stage
derives the word budget from a test recording or the selected TTS setting,
not a fixed range. Every beat has to fit in the delivery duration with a
minimum hold; otherwise a shorter line or fewer shots is required.

## 2. Add a small motion contract to each moving shot

**Severity — critical**

Section 8 row 8 proposes start and end poses, but section 5.1 has no motion
payload, source range or contact window. The stage table says to check motion
from start to end and risk foot slide, but a provider or editor cannot tell
whether that is a pan, a walk, a hand reach or a camera drift. “Motion” is
currently only a few words in 7a.3. A generated clip can therefore satisfy a
style prompt while changing the wrong object or breaking the one event the
beat is explaining.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | shot | beat, intent, template (reference pose), setup, inCue, cueOffsetFrames (signed, default 0), mustSee, mayHide, motion, cutFrom |
+| motion | kind, start frame, end frame, locked contacts, moving subject, camera path id, forbidden changes |
@@
 | 8 | Start and end poses with locked contacts, for motion planning | Guide image-to-video and catch foot slide | Interpolation that breaks a locked contact fails |
+
Motion planning uses an explicit, short contract:

```json
{"kind":"action","startFrame":0,"endFrame":72,
 "moving":{"figure":"climber","parts":["rHip","rAn"]},
 "lockedContacts":[{"figure":"climber","joint":"lHa","target":"ladder.rung-7"}],
 "cameraPath":"dolly-in-1",
 "forbiddenChanges":["boot-rung","subject-count"]}
```

For a still, `kind` is `hold` and the contract names a drift or push-in rather
than implying real action. For a generated take, the start board, end board,
and generated frame sequence are all checked against locked contacts and
`forbiddenChanges`. A take may be labelled usable only if the whole interval
preserves the event; it is not enough to have a good frame at frame 72.

## 3. Make cross-shot continuity data, not an annotation

**Severity — important**

Section 7a.2 states that 180-degree lines, eyelines and size jumps can be
checked, but no record declares the fields that would make the check. The
shot record has `cutFrom` and `setup`, yet no axis, subject screen side,
subject count, or relation to the previous composition. A reverse-angle
ladder cut can then pass because both boards are individually readable even
though the subject appears to switch sides or reverse direction.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | shot | beat, intent, template (reference pose), setup, inCue, cueOffsetFrames (signed, default 0), mustSee, mayHide, motion, cutFrom |
+| continuity | axis id, camera side, action screen direction, eyeline target, subject screen side, size jump |
@@
 The 180-degree line, screen direction, eyeline side and size jump between
 adjacent shots can all be checked automatically from scene records; framing
 taste cannot.

Each shot's continuity record is explicit:

```json
{"axis":"ladder-A","cameraSide":"low-left","actionDirection":"up",
 "eyeline":{"subject":"climber","target":"next-rung","screenSide":"left"},
 "subjectSide":"left","size":"medium"}
```

A reverse angle requires a stated 180-degree break and matching action or
gaze changes. The checker warns on direction reversal, an unexplained
size jump and eyeline disagreement with an adjacent cut. It does not decide
whether the break is dramatic; it prevents an accidental continuity error
from reaching the final cut.

## 4. Make style approval reproducible with a reference strip

**Severity — important**

Draft 3 adds style profiles, palette and texture, but approval is only a
named profile. It does not give the generator or reviewer a concrete
testable reference for the three things most likely to drift: value, line
weight and background density. A profile in words can mean a different
look to each model and person. It can also pass approval once and drift
shot to shot because each prompt is generated separately.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | style profile | framing, angle and lens habits, movement, tonal key and contrast, light, palette, texture, editing rhythm, image aspect ratio (section 7a.6) |
+| style reference | profile id, reference board strip, allowed palette, value sample, line-weight sample, background-density sample, provenance |
@@
 - The style profile is approved with the script (approval 1), because it
   shapes every shot after it.

Approval 1 also pins a small style reference strip: one wide, one close,
and one ordinary insert or environment board rendered with the final value
and line conventions. It is stored with a hash and used as the visual
reference for later board and plate reviews. The shot prompt may describe
the look in words, but generated stills and motion are checked against the
reference strip for tonal key, subject separation and background density.
A style difference that is intentional is represented by a named scene
key or palette change and approved; it is not accepted by silently changing
the prompt.

## 5. Lock rights, provenance and disclosure before generation, not at release

**Severity — critical**

The plan's `release` record has rights and a disclosure decision, but
provider assets can enter the project earlier as downloaded stills and
clips. The `attempt` record has cost and a prompt, but no source
attribution, licence class, provider terms snapshot or whether the asset
will be used for public training or publication. A clip can pass every visual
check and still have to be discarded after the production is spent.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | attempt | shot, board hash, route, model, prompt, attempt number, job id, asset, checks, estimated and billed cost |
+| asset provenance | asset hash, provider, model and model settings, licence or terms snapshot, input assets, public-use and disclosure flags |
@@
 9. **Publish** with a release receipt: title, captions, rights, disclosure
    decision, visibility.
+
No attempt or downloaded asset is eligible for the storyboard or master until
its provenance record is complete. A provider's terms snapshot is dated and
linked or stored locally. Every source image, voice, music track and
generated asset has a source record. A missing term, source licence or
AI-disclosure choice blocks assembly and is not inferred from provider
defaults.

## 6. Define the minimum phone readability threshold

**Severity — important**

The acceptance rules say required action must read at phone size and the
final cut is watched on a phone. They do not define a pass/fail protocol.
“Watched on a phone” can vary with device, viewing app and whether captions
covered the action. This makes repeated shots hard to compare and lets a
board that was readable in the 960-pixel contact sheet fail in the vertical
master.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | Storyboard | Shot to scene record (section 7), render sketch and diagnostics | Two repair rounds, then manual blocking | Required action identifiable at phone size with captions covered; hard diagnostics pass |
@@
 | Publish | Cover from an approved frame, title stating the actual comparison, release receipt | Missing rights or disclosure blocks release | Private upload watched on a phone before going public |
+
Phone review uses the delivery crop, not a desktop contact sheet. The board
and the animatic are shown at one fixed reference size, with captions
represented by the actual safe-area band and at the final line length.
The fixed test freezes: device or screenshot width, distance from the
viewer, viewing duration, and whether sound is on. A required action passes
only if the first independent reviewer can identify it in that condition
before the shot ends. A second review is used for disagreement. If a subject
is smaller than the must-see threshold, change the shot size or add a detail
insert rather than approving a more detailed board.

## Questions the plan still cannot answer

- What is a long enough lead and hold around each narrated observable change
  for the target audience and spoken language?
- For a moving shot, which contact or forbidden change is the hard event:
  the foot, the hand, the subject count or the camera relation?
- How is one style profile represented in a way that two providers and two
  reviewers will judge consistently?
