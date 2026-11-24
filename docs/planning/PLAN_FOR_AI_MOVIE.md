# Plan for ai-movie

Status: **draft 1**, written by one model (Claude) from one working session
on 2026-11-24. Flywheel calls for competing drafts from other models, a
synthesis, and 4 to 5 refinement rounds before this is treated as settled.
None of that has happened yet. See "Flywheel status" at the end.

## 1. Goal

Turn a topic into a short, publishable faceless video with as little manual
work as possible, while keeping control over how each shot is composed.

The bet: text prompts are a poor way to control composition. Video and image
models decide for themselves where the camera sits, how figures are
foreshortened, and where people stand and look. ai-movie fixes those choices
in a programmatic storyboard frame first, and hands generation a shot that is
already composed.

### Non-goals (for now)

- On-camera presenters, lip sync, or real people's likenesses.
- Character consistency across shots. The storyboard does not need it, and
  the plan does not depend on it.
- A graphical editor. Scene records are JSON; editing happens in text or
  through an LLM.
- Live-action footage.

## 2. The workflow, end to end

1. Chui gives a topic, a target length and a format.
2. A script is written and broken into shots, each with narration and a
   short description of what is seen.
3. Each shot description becomes a **scene record**: body profiles, poses,
   gaze, props, environment and camera.
4. The scene record is rendered as a sketch frame and reviewed.
5. Each approved frame drives generation of the final shot.
6. Narration is synthesised with word timings; captions and music follow.
7. Shots are cut to the narration and rendered to a video file.
8. Title, thumbnail and description are produced, and the video is uploaded.

A human approves at three points: the script, the storyboard frames, and the
final render. Everything between approvals runs unattended.

## 3. Decisions so far

| Decision | Detail |
|---|---|
| Storyboard is programmatic | No image model in stage 2. A frame is drawn from a scene record by code, deterministically |
| One representation | A frame is an assembly of posed figures, blob objects and cuboid buildings, plus camera and lighting. The earlier 2D option was dropped |
| Hand-sketched look | Frames must look human-drawn, and the cinematic feel of each frame is judged alongside the drawing |
| Pose model | Joints relative to a three-piece spine, each with a permitted range, plus a flexibility multiplier |
| Gaze is an input | Every pose states a look target, except dynamic poses |
| Drawing conventions | Recorded in `AGENTS.md` under "Storyboard conventions" |
| Stack | Node.js 22, no runtime dependencies so far, SVG output |
| Method | Agent Flywheel: plan, then beads, then code |

## 4. Architecture

Each stage is a separate module that reads files from a project folder and
writes files back. Stages communicate only through these files, so any stage
can be rerun, replaced or done by hand.

```
projects/<slug>/
  project.json        topic, format, length, aspect ratio, target platform
  script.md           approved script
  shots.json          ordered shots: id, narration, description, duration
  scenes/<shot>.json  scene record per shot (lib/pose format, extended)
  frames/<shot>.png   storyboard render
  gen/<shot>.*        generated image or clip
  audio/narration.*   voiceover, plus word timings
  captions.srt
  render.mp4
  publish.json        title, description, tags, thumbnail path, upload state
```

`projects/` is ignored by git except for a small example project used in
tests.

### Data contracts

The scene record format already exists (`lib/pose/README.md`). Before more
stages are built, it and `shots.json` need JSON Schemas, and every stage must
validate its inputs against them and fail loudly.

## 5. Stages

### 5.1 Script and shot list

- Input: `project.json`. Output: `script.md`, then `shots.json`.
- An LLM writes the script for the chosen format and length, then splits it
  into shots of roughly 2 to 6 seconds of narration each.
- Acceptance: total narration length within 10% of the target; every shot has
  narration, a visual description, and an estimated duration.
- Blocked on the format decision (open question Q1).

### 5.2 Storyboard

- Input: one shot. Output: `scenes/<shot>.json` and `frames/<shot>.png`.
- An LLM converts the shot description into a scene record. The renderer
  draws it. The record is validated, and any clamped joint, unreachable
  target or gaze shortfall is reported back so the LLM can correct it.
- Exists today: the mannequin, 11 body profiles, gaze, reach targets, hand
  types, boxes, bars, ladders, railings, and 18 reference scenes.
- Missing, in order of value:
  1. Regression tests, so refactoring and new features don't silently change
     drawings.
  2. Description-to-scene-record conversion.
  3. Environment: rooms, cuboid buildings, ground plane, doors and windows.
  4. Lighting and cast shadows: room light, dawn, evening, night, headlights,
     wet ground.
  5. Joint limits enforced on reach targets; interpenetration warnings.
  6. Multiple figures per frame (already possible in the model, untested).
  7. Drawing quality items listed in `lib/pose/README.md` under known limits.

### 5.3 Generation

- Input: frame and scene record. Output: `gen/<shot>.*`.
- Two routes, to be tested against each other:
  - **Reference route**: send the frame as a composition or pose reference
    with a text prompt. Keeps the exact camera and pose, if the model honours
    the reference.
  - **Text route**: derive a precise shot description from the scene record
    (camera height and angle, lens feel, each figure's pose and gaze) and
    send only text. Works with any model; less control.
- Blocked on choosing a model (Q2).

### 5.4 Voice, captions, music

- Narration through a TTS service that returns word-level timings (Q3).
- Captions generated from those timings, not from re-transcription.
- Music from a licensed library or a generator, ducked under narration.

### 5.5 Assembly

- ffmpeg: each shot held for its narration span, simple cuts or crossfades,
  optional slow push-in on stills, captions burned in or attached, music
  mixed. Output `render.mp4` at the project's aspect ratio.
- Acceptance: audio and picture in sync to within one frame at each cut.

### 5.6 Publish

- Title, description, tags and thumbnail drafted from the script.
- Upload and scheduling through the platform's API (Q4).
- Must apply each platform's rules on disclosing AI-generated content.

## 6. Open questions

| ID | Question | Why it matters |
|---|---|---|
| Q1 | Which format: narrated explainer over visuals, or character drama? | Decides script shape, shot count, and how much the storyboard matters |
| Q2 | Which image or video model, and does it accept a reference image? | Decides between the reference and text routes in 5.3 |
| Q3 | Which TTS provider, and does it return word timings? | Assembly and captions depend on timings |
| Q4 | Which platforms, aspect ratio and length? | Affects framing, pacing, upload code and disclosure rules |
| Q5 | Budget per video for generation and voice? | Bounds model choice and retries |
| Q6 | Language or languages? | TTS choice, caption fonts |

## 7. Risks

- **Models may ignore the reference frame.** Mitigation: test both routes in
  5.3 on the same five shots before building further.
- **Description-to-pose is the hardest step.** An LLM writing joint angles
  can produce poses that are legal but read wrongly. Mitigation: the renderer
  reports problems; a library of named reference poses (resource/pose) gives
  starting points to adapt rather than compose from nothing.
- **Platform policy** on repetitive or AI-generated content can limit reach
  or monetisation. Mitigation: check rules for the chosen platforms before
  building publishing.
- **Prototype code quality.** `lib/pose/mannequin.js` has terse names from
  rapid iteration. Mitigation: regression tests first, then refactor.

## 8. Flywheel status

| Step | State |
|---|---|
| Foundation bundle (stack, AGENTS.md, context) | Done |
| Initial plan | This document, draft 1 |
| Competing plans from other models | Not done |
| Synthesis and 4 to 5 refinement rounds | Not done |
| Convert plan to beads | Done for draft 1 with `br`: 39 beads (8 epics, 6 decision questions, 25 tasks and features) |
| Polish beads (4 to 6 passes, dedupe, fresh-eyes review) | One pass: template lint clean; added the missing Q6 bead and a pipeline-runner bead |
| Swarm | Not planned; a single session is enough at this size |

Beads created from this draft should be revisited after the refinement
rounds and after Q1 to Q4 are answered.
