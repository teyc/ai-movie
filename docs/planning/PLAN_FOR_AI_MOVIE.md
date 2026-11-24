# Plan for ai-movie

Status: **draft 2**, 2026-11-24. A synthesis of three independent plans:

- draft 1 (Claude, written with the human during the storyboard sessions),
- `PLAN_FOR_AI_MOVIE_GPT-6.md` (GPT),
- `PLAN_FOR_AI_MOVIE_Grok.html` (Grok).

Section 15 records what came from where and what was rejected. Refinement
rounds (Flywheel step 4) have not happened yet. Facts about outside services
are marked **verify (2026-11-24)** and must be rechecked before money is
spent.

## 1. Goal and the core bet

Turn a topic into a short, publishable faceless video with little manual work,
while keeping real control over how each shot is composed.

**The bet.** Text prompts are a weak way to control composition. Image and
video models decide for themselves where the camera sits, how figures are
foreshortened, and where people stand and look. ai-movie fixes those choices
in a programmatic storyboard frame first.

**Refinement from the review.** The storyboard frame settles the director's
intent; generation only gets a vote on the result. A generated image that
looks expensive but moves a boot to the wrong rung is a failed take. And the
drawn frame can itself be the final image: the first film uses no image model
at all.

### Non-goals for now

- On-camera presenters, lip sync, or real people's likenesses.
- Character consistency across shots (a hook is left for drama later).
- A graphical editor. Records are JSON, edited by hand or by an LLM.

## 2. Principles

| Principle | What it means in practice | Source |
|---|---|---|
| Storyboard is programmatic and deterministic | No image model in stage 2. Same record and seed give the same drawing | Draft 1, all agree |
| A shot must change what the viewer knows | Each shot names what must be seen, what may be hidden, and what carries across the cut | GPT |
| Voice before visuals | Lock narration, cut a timed rough version from the boards (an *animatic*), then buy generated visuals | GPT |
| Still before motion | Generate and approve a still per shot; animate only shots a still cannot carry | GPT, Grok |
| Spend is reserved before it happens | Every paid call reserves its maximum cost first, under a hard per-video cap | GPT, Grok |
| Stages talk only through files | Any stage can be rerun, replaced, or done by hand | All |
| Approvals pin exact content | An approval records the hash of what was seen or heard; changing it reopens the approval | GPT |
| Models flag, humans approve | Vision or language models may flag problems; they never approve a shot | GPT, Grok |
| Hand-sketched look | Frames look human-drawn; conventions in `AGENTS.md` | Draft 1 |
| Final look is a per-project choice | The sketch itself, or a generated style from the same scene record | GPT and Grok, reconciled |

## 3. Recommended answers to the open questions

These are recommendations. The decisions belong to the human and are tracked
as question beads.

| ID | Question | Recommendation | Notes |
|---|---|---|---|
| Q1 | Format | Narrated explainer first. Then a silent two-person scene, then dialogue drama only if the silent scene reads | All three plans agree on explainer first |
| Q2 | Generation model and route | Decide by experiment (section 10). Candidates: Runway Gen-4 Image for reference stills; Gen-4 Turbo, Kling 4.0, Seedance 2.5, Wan 3.0, MiniMax H3 or Gemini Omni Flash for image-to-video | verify (2026-11-24) |
| Q3 | Text-to-speech with word timings | Pilot with a human recording or Polly. Choose between Amazon Polly (cheapest; word marks give start times, ends estimated) and Cartesia Sonic (word start and end times, 44 languages) after a two-sentence test | verify (2026-11-24) |
| Q4 | Platform, shape, length | YouTube Shorts first, 1080 x 1920, 30 fps, 30 to 45 seconds. Landscape 90 to 150 second explainers later | Shorts accept square or vertical up to 3 minutes; verify (2026-11-24) |
| Q5 | Budget | About $2.50 cash per 36-second film at the rates below; $5 hard ceiling per film; labour reported separately | Section 3.1 |
| Q6 | Language | Australian English (`en-AU`) first. Beats keep stable IDs so a translation can move cue words | GPT |

### 3.1 Budget worked example (GPT's model, rates verify 2026-11-24)

A 36-second film, six six-second slots: four stills, two short motion shots.

| Line | Estimate |
|---|---:|
| 12 Runway Gen-4 Image 1080p stills x 8 credits x $0.01 | $0.96 |
| 20 seconds of Gen-4 Turbo video x 5 credits x $0.01 | $1.00 |
| 700 characters x 2 Polly neural requests (audio and marks) at $16 per million | $0.02 |
| Text generation, local compute and storage allowance | $0.55 |
| **Expected cash** | **about $2.54** |
| **Ceiling per film** | **$5.00** |

Grok's range of $3 to $8 covers costlier video models. Labour (producer
review time) is the real cost and must be measured per film.

## 4. Workflow and approvals

1. **Brief**: topic, audience, the one question the film answers, evidence,
   locale, delivery shape, cash cap.
2. **Script** as beats. Each beat states a claim or change, its spoken and
   displayed text, cue words with stable IDs, and evidence.
   **Approval 1: script and pronunciation.**
3. **Voice**: synthesise or record the narration and get word timings.
4. **Shot list**: one row per camera setup, tied to a beat and a cue, with
   must-see and may-hide lists and the shot it cuts from.
5. **Storyboard**: each shot becomes a scene record and a sketch frame.
6. **Animatic**: frames cut to the real narration timings, watched as a film.
   **Approval 2: storyboard, judged in sequence, not frame by frame.**
7. **Generation** (optional per film): stills from approved frames, then
   motion for the few shots that need it, within the cash cap.
8. **Captions, music, assembly** into a master.
   **Approval 3: final cut, watched on a phone.**
9. **Publish** with a release receipt: title, captions, rights, disclosure
   decision, visibility.

## 5. Architecture

Node.js 22, CommonJS, no runtime dependencies in the drawing library. FFmpeg
and ffprobe for media, `rsvg-convert` for PNG. Provider code stays out of
`lib/pose`.

| Location | Responsibility |
|---|---|
| `bin/movie.js`, `lib/run/` | Stage selection, validation, dependency hashes, approvals, cost reservation, resume |
| `lib/story/` | Briefs, beats, shot intent, pose-library retrieval, bounded scene repair |
| `lib/pose/` | World geometry, projection, diagnostics, sketch and control exports |
| `lib/media/`, `lib/providers/` | Speech, captions, plates, music, edit compilation, narrow vendor adapters |
| `lib/publish/` | Release packaging and receipts |
| `schema/` | JSON Schemas for every record |
| `projects/<slug>/` | Small, human-editable inputs: brief, script, shots, scenes, approvals, edit decisions. Committed |
| `runs/<slug>/` | Large outputs: frames, audio, plates, clips, masters, cost ledger, run log. Ignored by git |

### 5.1 Records

Every record on disk uses one envelope and is validated on read and write.

```json
{"kind": "shot", "version": 1, "id": "s2", "payload": {}}
```

| Record | Key fields |
|---|---|
| brief | audience, question, evidence, locale, delivery `{width, height, fps}`, cashCapUsd |
| beat | spoken, display, cues `[{id, word, occurrence}]`, evidence, purpose |
| shot | beat, intent, template (reference pose), setup, inCue, mustSee, mayHide, motion, cutFrom |
| scene v2 | camera, environment, lights, figures, props (below) |
| board receipt | scene hash, seed, art path, control paths, projected anchors, diagnostics, approval |
| attempt | shot, board hash, route, model, prompt, attempt number, job id, asset, checks, estimated and billed cost |
| voice | audio path, sample rate, words `[{text, onset, end?}]` |
| captions | cues in sample time, layout, WebVTT sidecar |
| mix | music regions with rights, gain and fades |
| edit | fps, integer frame timeline of shots, voice, captions, mix, master path |
| release | platform, master hash, title, thumbnail, captions, rights, disclosure decision, visibility, remote id |

Example shot (GPT):

```json
{"shot": "s2", "beat": "b2", "intent": "Show the climber's near boot filling the foreground",
 "template": "ladder-from-below", "setup": "ladder-A", "inCue": "reveal",
 "mustSee": ["near boot overlaps lower rung", "ladder recedes upward"],
 "mayHide": ["far wrist"], "motion": "hold", "cutFrom": "s1"}
```

### 5.2 Scene record v2

Version 1 (today's format, `lib/pose/README.md`) stays readable: an
unversioned record means one figure, automatic framing, and today's defaults.
Version 2 adds:

- **camera**: `mode` `"fixed"` (explicit position, look-at, vertical field of
  view, roll, frame size) or `"fit"` (today's behaviour).
- **environment**: rooms, ground, cuboid buildings, doors, windows, starting
  as named presets that expand to geometry (Grok).
- **lights**: one directional key light first, with a simple floor shadow.
- **figures**: an array, each with `id`, profile and pose. Joint names are
  namespaced (`giver.lHa`) so props and constraints can refer across figures.
- **look is required** on new records. Only dynamic poses use `"free"`.

```json
{
  "sceneVersion": 2, "id": "handoff-wide", "frame": {"w": 1080, "h": 1920},
  "camera": {"mode": "fixed", "pos": [0, 1.35, 3.8], "at": [0, 1, 0], "verticalFovDeg": 42},
  "environment": {"type": "room", "floorCentre": [0, 0, 0], "size": [4, 2.8, 5], "visibleWalls": ["back", "left"]},
  "lights": [{"type": "directional", "direction": [0.6, -0.8, 0], "softness": 0.7}],
  "figures": [
    {"id": "giver", "profile": "middle-age", "stand": true,
     "pose": {"root": {"p": [-0.46, 1, 0], "yaw": 65}, "look": [0.45, 1.55, 0], "lEl": 78, "rEl": 78}},
    {"id": "receiver", "profile": "adult", "stand": true,
     "pose": {"root": {"p": [0.46, 1, 0], "yaw": -65}, "look": [-0.46, 1.1, 0]}}
  ],
  "props": [{"id": "parcel", "t": "box", "mid": ["giver.lHa", "giver.rHa"], "size": [0.4, 0.28, 0.3]}]
}
```

Solving order: world props, then each figure against its anchors, then held
props. Circular anchors (hands solved against a box placed by those hands)
are rejected.

### 5.3 Run state

Each stage output is cached by the hash of its inputs, code version, tool
versions, seed and model settings. A changed title rebuilds only the release;
a changed spoken line rebuilds its audio, captions, affected cuts, mix and
master. Outputs are written to a temporary file, checked, then renamed into
place. Paid calls persist their reservation and intent before the network
call and the provider's job id immediately after, so a crash resumes by
polling rather than paying twice.

## 6. Stages

| Stage | Method | Failure handling | Acceptance |
|---|---|---|---|
| Script | Brief to beats: opening question, observable change, answer. 65 to 90 spoken words for a 30 to 45 second film. Claims tied to evidence | One redraft after notes; unsupported claims rejected | A viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
| Voice | Human recording or TTS with word timings, decoded to 48 kHz mono | Missing marks or text mismatch blocks the beat | Ordered onsets, correct cue words, no clipped syllables |
| Shot list | Per beat: what is different on screen at the end, camera side, focal subject, cue, must-see, may-hide | Shots that merely illustrate the same noun are cut; tighten the script instead | Every line maps to a shot or an intentional hold; adjacent screen direction checked |
| Storyboard | Shot to scene record (section 7), render sketch and diagnostics | Two repair rounds, then manual blocking | Required action identifiable at phone size with captions covered; hard diagnostics pass |
| Animatic | Approved boards cut to the narration timings | Re-block shots that don't read in sequence | Producer approves the sequence |
| Generation | Still from the approved board (route from section 10), downloaded and logged; motion only from approved stills | Bounded backoff on rate limits; one creative retake per shot; fall back to the drawn still | Must-see items present; start, middle and end of motion checked for drift |
| Captions | Words grouped into phrases from the timings; WebVTT; optional burn-in | Reflow when a line changes | Two lines max, about 17 characters per second, inside the safe area |
| Music | Start with silence; one owned or licensed bed, ducked under speech | Mute if it fights consonants or rights are unclear | Cue words audible without reading on a phone speaker |
| Assembly | Integer frame timeline compiled to FFmpeg; H.264 and AAC in MP4 | Missing media stops with the shot id; never silently loop a short take | Correct size and fps, duration within one frame, cuts on cue frames, -16 LUFS integrated, peak at or below -1 dBTP |
| Publish | Cover from an approved frame, title stating the actual comparison, release receipt | Missing rights or disclosure blocks release | Private upload watched on a phone before going public |

## 7. The hardest problem: shot description to scene record

The language model makes directing choices from a vocabulary; code does the
geometry.

1. **Parse intent**: action, subject, camera family, what the performer looks
   at, what the audience should look at, continuity with the previous shot.
   Contradictions (a face seen straight on from behind) go back as a choice of
   two framings.
2. **Retrieve a reference pose** by action and *contact topology* first
   (floor, seat, rail, rung, airborne; which hands and feet touch what), then
   by words. Each reference scene is annotated with these facts. Unknown
   actions go to manual blocking.
3. **Resolve named anchors in metres** (rung 8 of this ladder, the top rail)
   from the same geometry the renderer uses, and declare which surface must
   touch which prop.
4. **Try bounded camera candidates**: up to three camera sectors, two shot
   sizes, two offsets, projected in the delivery frame with the caption area
   reserved. Rank by must-see visibility, screen direction, frame margins and
   continuity.
5. **Use the renderer as an oracle**: render, collect structured diagnostics
   (figure, joint, requested and achieved values), and apply fixes from an
   allow-list for at most two rounds. Never clear a warning by raising
   flexibility.
6. **Separate solvable from readable.** Automatic checks: finite geometry,
   contact error (start at 3 cm or less), required regions visible after
   occlusion, gaze error (start at 10 degrees or less when gaze matters),
   frame margins, support under seated bodies, at least 60% of each figure in
   frame unless intended. Human judgement: acting, readability, weight,
   intended ambiguity.
7. **Choose in sequence**: show two or three candidates between the previous
   and next approved frames. Accepted records join the pose library and the
   evaluation set.

An **evaluation set** of 30 to 50 shot descriptions with human-accepted
records (Grok) measures the method over time.

## 8. Storyboard renderer roadmap

| Order | Change | Why now | Done when |
|---|---|---|---|
| 1 | Regression tests on the 18 reference scenes and the warnings | Everything below changes drawing code | Any drawing change fails until goldens are updated deliberately |
| 2 | Per-render state: remove globals (`P`, `GS`, `HS`, `BL`, `EX`, `FACE`, `CLAMPS`, `rnd`) | Multi-figure and repeat renders depend on it | Render order cannot change any output |
| 3 | Fixed camera mode beside today's auto-fit, with frame size and near-plane clipping | Today `draw` always rescales to the figure, so a camera cannot stay put across shots or place a subject on a third | A figure walking across a fixed frame changes position and size |
| 4 | IK guards, joint limits on reach targets, named contact sites, structured diagnostics | Needed by section 7 | An impossible elbow on a reachable target is reported |
| 5 | Control exports: clean contour, joint skeleton, depth, object-id pass | Generation routes and visibility checks need them | Overlays line up with the sketch in both ladder views |
| 6 | Several figures in one depth-sorted draw list, namespaced joints | Two-person scenes | Two people share a floor with correct overlap |
| 7 | Environment presets and one key light with floor shadows | Places and mood | A reverse angle keeps the door and light direction |
| 8 | Start and end poses with locked contacts, for motion planning | Guide image-to-video and catch foot slide | Interpolation that breaks a locked contact fails |

Later, from draft 1: concave outlines, per-profile muscle shapes, night,
headlights and wet-ground lighting.

## 9. Testing

- **Drawings.** Golden SVG text for all reference scenes, frames, sheet and
  line-up at a fixed seed: exact comparison, since rendering is deterministic.
  When a golden must change, render old, new and a difference image side by
  side for the human, who approves before the update. Region checks (grip,
  gaze, pelvis join, V hand) can be added if whole-frame comparison misses
  local defects.
- **Geometry.** Unit tests on joints, projection, contacts and warnings,
  independent of drawing. Adversarial cases: invalid enums, unknown joints,
  coincident wrist and shoulder, camera looking straight down, unreachable
  targets.
- **Contracts and orchestration.** `node --test`, schema fixtures, kill and
  resume between reservation, job id, download and approval.
- **Paid services.** Saved responses and a fake job service that completes
  late, fails after submission, or loses a response. Offline tests make zero
  paid calls; a separately budgeted live smoke test runs on onboarding and
  model change.
- **Media.** Decode the master; check size, fps, frame count, cut frames,
  caption bounds, loudness and true peak.
- **Scene generation.** Validity, warning count and human accept rate on the
  evaluation set; every previously accepted record must still render cleanly.

## 10. The generation route experiment

Run before building the generation adapter.

- Eight shot intents, including the ladder pair, child behind a rail,
  carrying a box, dive toward camera, floor lift, the V hand and a neutral
  standing shot.
- Three routes: text only (a deterministic shot description from the scene
  record), reference image (the board plus the same text), and structural
  control (contour or depth export) where the chosen model supports it.
- Two attempts per route per intent, same model, style and aspect ratio.
- Labels hidden and shuffled. Two reviewers score contact, viewpoint, subject
  count, readability and fit with the previous cut, and log minutes including
  board creation.
- **Decision rule, set in advance**: adopt a board-driven route for a shot
  class if it beats text only on first-pass acceptance by at least 20
  percentage points without raising the cost per accepted still. Ties: boards
  for hard geometry, text for simple shots. Both fail contacts: ship the
  drawn frame.
- Cost: about 48 stills, roughly $4 at the 1080p rate above, paid from
  development, not a film's budget.

## 11. Phased delivery

| Phase | Film | Exit decision |
|---|---|---|
| A. First cut, no image model | 15 to 20 seconds: the side-view ladder climb, cut to the same climb from below, back to the side, while the narrator explains what the low camera hides. Existing PNGs as portrait panels, human or Polly voice, captions, hard cuts | Someone new to the project can say which contact disappeared and why; plays on a phone |
| B. First generated film | 30 to 45 seconds; approved animatic; one generated still replacing a drawing, at most one motion shot; parallel cut with the drawing | Private upload with captions and receipt under $5 cash; producer minutes recorded |
| C. Repeatable explainers | Route experiment done; description-to-scene with repair; three unseen briefs including a non-ladder scene | Two of three films within the cash cap and a 45-minute labour target |
| D. Continuity and languages | Second-language recut; two figures in one room; a silent parcel handoff | A fluent reviewer signs off; two viewers identify who gives and who hesitates |
| E. Drama | One 30-second dialogue scene, starting with off-camera speech | Roles identifiable across cuts; decide whether drama is worth its cost |

## 12. Risks

| Early sign | Consequence | Response |
|---|---|---|
| Generated boot changes rung during motion | The film shows an event that didn't happen | Review whole takes; cut on a stable frame; use the drawn insert |
| Text-only shots pass as often as boards | Board labour eats the margin | Route simple shots to text; keep boards for contacts and geometry |
| Every subject centred, even on reverse angles | Direction flips between shots | Fixed cameras, locked set coordinates, preview adjacent shots |
| Description-to-scene plateaus | Every shot needs manual blocking | Grow the pose library from accepted frames; keep humans in the loop longer |
| Provider changes model, ratio or price | Silent framing drift or a surprise bill | Pin settings and rate tables; smoke-test on change; stop when costs can't be reconciled |
| Voice misreads a name or a translation | The cut lands on the wrong word | Per-locale audio approval; recut from measured onsets |
| Burned captions plus platform captions | Two layers hide the action | Default to a clean master with sidecar captions |
| Rights or AI-disclosure rules missed | A finished film can't be released | Rights record per asset; check current rules at upload |
| Prototype renderer code | Changes break drawings silently | Regression tests before any refactor |

## 13. Open decisions for the human

Q1 to Q6 in section 3. Also: whether the first channel's visual style is the
sketch itself or generated plates (can be per film; phase A uses the sketch).

## 14. Work breakdown

Tracked as beads in `.beads/` (`br ready` shows what can start). Phases are
labels `phase-a` to `phase-e`. Phase A can start immediately and needs no
paid service.

## 15. Synthesis log

| Topic | Taken from | Rejected or changed, and why |
|---|---|---|
| Explainer first, vertical Shorts first | All three | — |
| Phase A without any image model | GPT | Grok's phase 0 with full generation: slower and costs money before the cheap path is proven |
| Voice before visuals, animatic approval | GPT | Draft 1 and Grok put visuals first |
| Fixed camera mode before environments | GPT, confirmed in code | Draft 1 and Grok missed that framing is always automatic |
| Must-see / may-hide / cut-from on shots | GPT | — |
| Cost reservation and job ids before network calls | GPT | — |
| Route experiment with a pre-set decision rule | GPT, widened with Grok's structural-control route | Grok's "control maps are the primary route" kept as a candidate, not a decision |
| Depth and pose exports | Grok, merged with GPT's contour and object-id passes | — |
| Evaluation set of 30 to 50 descriptions | Grok | — |
| Environment presets | Grok | — |
| Cartesia as a TTS candidate | Grok | Not chosen yet; it returns word ends as well as starts, Polly is cheaper. Human decides (Q3) |
| Sketch as final look vs control signal | Both | Reconciled as a per-project choice |
| Golden tests on SVG text | Draft 1 | GPT's pixel comparison deferred: output is deterministic text, so exact SVG comparison is simpler and stricter; pixel and region checks added only if needed |
| Schemas, validator, description-to-scene loop, lighting wish-list | Draft 1 | — |
| TypeScript orchestrator | Grok | Rejected: the agreed stack is dependency-free JavaScript |
| Web review UI | Grok | Deferred: a generated HTML review sheet covers phases A to C |

Model and price facts checked on 2026-11-24 against Runway's pricing page,
Amazon Polly pricing, YouTube's Shorts help page, Cartesia's API docs, and
provider listings for Kling 4.0, Seedance 2.5, Wan 3.0, MiniMax H3, Gemini
Omni Flash and FLUX 3.

## 16. Flywheel status

| Step | State |
|---|---|
| Foundation bundle | Done |
| Initial plan | Draft 1 |
| Competing plans | Done: GPT and Grok |
| Synthesis | This document, draft 2 |
| Refinement rounds (4 to 5) | Not started |
| Convert to beads | Updated to draft 2 |
| Polish beads | One pass after the update |
| Swarm | Not planned at this size |
