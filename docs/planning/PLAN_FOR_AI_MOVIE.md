# Plan for ai-movie

Status: **draft 3**, 2026-11-24. Draft 2 was a synthesis of three independent
plans:

- draft 1 (Claude, written with the human during the storyboard sessions),
- `PLAN_FOR_AI_MOVIE_GPT-6.md` (GPT),
- `PLAN_FOR_AI_MOVIE_Grok.html` (Grok).

Draft 3 applies refinement round 1 (Copilot and GPT, in
`refinements/ROUND_1_*.md`). Section 15 records what came from where in the
synthesis; section 17 rates every refinement change. Facts about outside
services are marked **verify (2026-11-24)** and must be rechecked, with the
purchase record in section 3.2, before money is spent.

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
| Every shot is a cinematic choice, stated | Shot size, angle, lens, composition, depth layers, movement, tonal key and light motivation are named in the shot record with a reason, and drawn in the board (section 7a) | Human, round 1 |
| One consistent style per film | A style profile (symmetrical tableau, colour-field epic, Hong Kong police thriller, black-and-white noir, and so on) bounds every shot choice; breaks need a reason (section 7a.6) | Human, round 1 |
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
review time) is the real cost and must be measured per film (the `labour`
record in section 5.1).

### 3.2 Purchase record before the first paid call

The example above is illustrative. Before the first purchase, record for the
chosen endpoint and model: input and output limits, orderable clip lengths,
billing unit and rounding, currency, the maximum units per attempt, and the
primary source URL with the date checked. For each motion slot, show the
ordered duration, the usable trim or approved still hold, and the maximum
spend including its permitted retake. If the verified offer cannot fill the
cut within the cap, use the approved drawing.

## 4. Workflow and approvals

1. **Brief**: topic, audience, the one question the film answers, evidence,
   locale, delivery shape, cash cap.
2. **Script** as beats. Each beat states a claim or change, its spoken and
   displayed text, cue words with stable IDs, and evidence. A style profile
   is chosen for the film (section 7a.6).
   **Approval 1: script, pronunciation and style profile.**
3. **Voice**: synthesise or record the narration and get word timings. For a
   short human read, hand-mark the caption phrase bounds and named cut cues
   on the actual take, stored as sample offsets with the audio's hash, so a
   pickup can never silently reuse stale timings.
4. **Shot list**: one row per appearance in the cut. A return cut reuses a
   camera setup or plate. Each appearance is tied to a beat and a cue, with
   an editorial offset from the cue, must-see and may-hide lists, and the
   shot it cuts from.
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
| brief | audience, question, evidence, locale, delivery `{width, height, fps}`, cashCapUsd, style profile id |
| style profile | framing, angle and lens habits, movement, tonal key and contrast, light, palette, texture, editing rhythm, image aspect ratio (section 7a.6) |
| beat | spoken, display, cues `[{id, word, occurrence}]`, evidence, purpose |
| shot | beat, intent, template (reference pose), setup, inCue, cueOffsetFrames (signed, default 0), mustSee, mayHide, motion, cutFrom |
| scene | v1 (today's format) or v2 payload: camera, environment, lights, figures, props (section 5.2) |
| pose example | actions, setup id, support, contacts `[{figure, joint, target}]`, gaze target, airborne, occlusion notes, scene hash, limitations |
| board receipt | scene hash, seed, art path, control paths, projected anchors, diagnostics, approval |
| attempt | shot, board hash, route, model, prompt, attempt number, job id, asset, checks, estimated and billed cost |
| voice | audio path, sample rate, words `[{text, onset, end?}]` |
| captions | cues in sample time, layout, WebVTT sidecar |
| mix | music regions with rights, gain and fades |
| edit | fps, voice asset hash, intervals (below), captions, mix, master path |
| release | platform, master hash, title, thumbnail, captions, rights, disclosure decision, visibility, remote id |
| labour | run id, stage, task, start and end time, active seconds, blocker type, notes; entered by the producer |

An edit is a list of replayable intervals, not a timeline rebuilt each run:

```json
{"startFrame": 38, "endFrame": 83, "shot": "ladder-side-1", "board": "sha256...",
 "sourceInFrame": 0, "sourceOutFrame": 45, "transition": {"kind": "cut"}}
```

Frames are integers at the delivery fps; ranges are zero-based and
half-open; an interval must be at least one frame long. Cut positions come
from the voice hash plus each shot's cue and offset, never from rescanning
captions. Changing a board hash, source range or voice hash marks the
affected intervals and the master stale; changing only a mix region does not
rebuild boards.

Example shot (GPT):

```json
{"shot": "s2", "beat": "b2", "intent": "Show the climber's near boot filling the foreground",
 "template": "ladder-from-below", "setup": "ladder-A", "inCue": "reveal",
 "mustSee": ["near boot overlaps lower rung", "ladder recedes upward"],
 "mayHide": ["far wrist"], "motion": "hold", "cutFrom": "s1"}
```

### 5.2 Scene records

Scenes use the same envelope as every other record: `{"kind": "scene",
"version": 1 or 2, "id": ..., "payload": {...}}`. The loader validates the
envelope, dispatches on kind and version, and converts v1 to v2 explicitly
before rendering. Version 1 is today's format (`lib/pose/README.md`): one
figure, automatic framing, today's defaults. For backward compatibility the
CLI also accepts a bare, unwrapped v1 file such as those in `resource/pose/`;
everything the pipeline writes is wrapped. `renderFrame` called directly
takes a v1 payload until the v2 renderer lands.

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
{"kind": "scene", "version": 2, "id": "handoff-wide", "payload": {
  "frame": {"w": 1080, "h": 1920},
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
}}
```

Solving order: world props, then each figure against its anchors, then held
props. Circular anchors (hands solved against a box placed by those hands)
are rejected.

### 5.3 Run state

Each stage output is cached by the hash of its inputs, code version, tool
versions, seed and model settings. A changed title rebuilds only the release;
a changed spoken line rebuilds its audio, captions, affected cuts, mix and
master. Outputs are written to a temporary file, checked, then renamed into
place.

**Paid calls.** Reservation decisions for a film are serialised under one
lock shared by every worker and rerun. Under that lock, settled charges plus
outstanding maximum charges plus the new maximum are checked against the cap,
and the attempt key and reservation are written durably before submission.
A returned job id is persisted at once and polled on resume. If a submission
may have succeeded but no id was recorded, the reservation stays open: the
attempt is reconciled by its key, replayed only if the adapter has verified
the provider's de-duplication for that window, and otherwise marked
unresolved until billing or job evidence settles it. A creative retake gets
its own key and reservation.

## 6. Stages

| Stage | Method | Failure handling | Acceptance |
|---|---|---|---|
| Script | Brief to beats: opening question, observable change, answer. 65 to 90 spoken words for a 30 to 45 second film. Claims tied to evidence | One redraft after notes; unsupported claims rejected | A viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
| Voice | Human recording or TTS, decoded to 48 kHz mono. For a short human read, hand-marked phrase bounds and cut cues on the actual take, stored with the audio hash | Missing required marks or text mismatch blocks the beat | Ordered onsets, correct cue words, no clipped syllables |
| Shot list | Per beat: what is different on screen at the end, camera side, focal subject, cue, must-see, may-hide | Shots that merely illustrate the same noun are cut; tighten the script instead | Every line maps to a shot or an intentional hold; adjacent screen direction checked |
| Storyboard | Shot to scene record (section 7), render sketch and diagnostics | Two repair rounds, then manual blocking | Required action identifiable at phone size with captions covered; hard diagnostics pass |
| Animatic | Approved boards cut to the narration timings | Re-block shots that don't read in sequence | Producer approves the sequence |
| Generation | Still from the approved board (route from section 10), downloaded and logged; motion only from approved stills | Bounded backoff on rate limits; one creative retake per shot; fall back to the drawn still | Must-see items present; start, middle and end of motion checked for drift |
| Captions | Words grouped into phrases from the timings; WebVTT; optional burn-in | Reflow when a line changes | Two lines max, about 17 characters per second, inside the safe area |
| Music | Start with silence; one owned or licensed bed, ducked under speech | Mute if it fights consonants or rights are unclear | Cue words audible without reading on a phone speaker |
| Assembly | Integer frame timeline compiled to FFmpeg; H.264 and AAC in MP4 | Missing media stops with the shot id; never silently loop a short take; reversed or empty intervals rejected | Correct size and fps, duration within one frame, cut boundaries match the approved edit (cue sample rounded to the nearest frame, then the editorial offset applied), -16 LUFS integrated, peak at or below -1 dBTP |
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
   by words. Each reference scene has a validated `pose example` record
   (setup, support, contact joints and targets, gaze target, airborne state,
   occlusion notes). Two camera views of one setup share a setup id but stay
   separate results. A candidate must be shown to contain the requested
   contacts; text or embedding similarity is only a fallback. Unknown actions
   go to manual blocking.
3. **Resolve named anchors in metres** (rung 8 of this ladder, the top rail)
   from the same geometry the renderer uses, and declare which surface must
   touch which prop.
4. **Try bounded camera candidates**: up to three camera sectors, two shot
   sizes, two offsets, projected in the delivery frame with the caption area
   reserved. Rank by must-see visibility, screen direction, frame margins and
   continuity.
5. **Use the renderer as an oracle**: render, collect structured diagnostics,
   and apply fixes from an allow-list for at most two rounds. Each diagnostic
   carries a code so the repair knows what to change:

   ```json
   {"code": "ik.joint-range-exceeded", "figure": "climber", "endEffector": "rWr",
    "target": "ladder.rung-7", "joint": "rEl", "requestedDeg": 160, "allowedDeg": [0, 150],
    "suggestion": "move-root"}
   ```

   Codes include `target-outside-workspace`, `joint-range-exceeded`,
   `pole-conflict`, `contact-distance`, `prop-intersection` and
   `gaze-shortfall`. The allow-list may move a target, the root or a pole
   hint; it may never raise flexibility or clear a diagnostic. `stand`
   combined with reach targets is invalid, not repairable.
6. **Separate solvable from readable.** Automatic checks: finite geometry,
   contact error (start at 3 cm or less), required regions visible after
   occlusion, gaze error (start at 10 degrees or less when gaze matters),
   frame margins, support under seated bodies, at least 60% of each figure in
   frame unless intended. Human judgement: acting, readability, weight,
   intended ambiguity.
7. **Choose in sequence**: show two or three candidate framings in the rough
   cut, between the previous and next approved frames. Approved records
   become retrieval examples and regression fixtures.

An **evaluation set** of 30 to 50 shot descriptions (Grok) measures the
method, kept apart from the retrieval library so the system cannot score well
by retrieving the answer (GPT round 1). Split it by setup or brief family,
keeping related views together; withhold the test descriptions, solutions and
review notes from retrieval and tuning. Judge against the brief in sequence,
allowing several valid compositions. Report first-pass accepts, accepts after
repair, manual blocks, abandoned shots and producer minutes over all assigned
briefs. A test case that enters the library is replaced before the next
reported evaluation.

## 7a. Cinematic language

Draft 2 treated a frame as geometry: a correct figure, a camera, and what
must be visible. A storyboard is more than that. It is where shot selection,
camera movement, background, perspective and mood are decided, and the
storyboard is the only place in this pipeline where those decisions are
cheap. This section makes them explicit, recorded, drawn and checked.

### 7a.1 The shot vocabulary

Every shot record states these choices, each with a one-line reason tied to
what the shot must make the viewer understand or feel:

| Choice | Values | What it does |
|---|---|---|
| Size | extreme close-up, close-up, medium close-up, medium, medium long, wide, extreme wide; insert | Sets what the viewer can read and how intimate the moment feels |
| Angle | eye level, low, high, overhead, worm's-eye, Dutch tilt | Power, vulnerability, unease; camera height is the subject of the pilot film |
| Lens feel | wide (about 24 mm), normal (35 to 50 mm), long (85 mm and up) | Wide exaggerates depth and foreshortening and lets the camera come close; long compresses space and flattens the background. Stored as vertical field of view plus camera distance |
| Composition | rule of thirds, centred and symmetrical, one-point perspective, leading lines, frame within a frame, negative space; headroom and lead room | Where the eye goes first, and which way the shot faces |
| Depth layers | named foreground, midground and background elements | Depth and scale; a foreground element (a rung, a doorframe) makes a frame read as three-dimensional |
| Movement | static, pan, tilt, dolly in or out, truck, pedestal or crane, arc, handheld; on stills, a slow push-in or drift | Reveals, follows or emphasises. A dolly changes perspective; a zoom does not |
| Tonal key | high-key (light, low contrast), mid-key, low-key (dark, strong contrast), silhouette | The single biggest mood control, and visible even in a sketch |
| Light motivation | the source in the world: window, overhead lamp, sun at a time of day (dawn, golden hour, blue hour, night), headlights, screen glow | Makes the key believable and keeps light direction consistent across cuts |

Example additions to a shot record:

```json
{"size": "medium close-up", "angle": "low", "lens": "wide",
 "composition": {"rule": "thirds", "subject": "left", "leadRoom": "right"},
 "layers": {"fg": "lower rung", "mg": "near boot", "bg": "sky"},
 "move": {"type": "dolly-in", "frames": 45, "ease": "in-out"},
 "key": "low-key", "motivation": "late sun behind the ladder, rim light",
 "reason": "Make the near boot loom so the hidden hand is felt as missing"}
```

### 7a.2 Grammar across cuts

Shots are chosen as a sequence, not one at a time:

- **The 180-degree line**: the camera stays on one side of the line between
  two subjects or along a direction of travel, so screen direction holds.
- **Eyelines and screen direction** match across a cut; a look off-screen
  left is answered by a subject on the right.
- **Size progression**: establish, then move closer as information narrows;
  jump in size by enough that a cut reads as intentional.
- **Cut on action or on a look**, and on the narration's cue word.
- **Rhythm**: shot length follows how long the viewer needs to find the
  must-see element, then the cut.

The 180-degree line, screen direction, eyeline side and size jump between
adjacent shots can all be checked automatically from scene records; framing
taste cannot.

### 7a.3 How it is drawn

The sketch must show these choices, or the animatic cannot be judged:

- **Value pass (light versus dark).** Line art alone cannot show mood. Add a
  simple two- or three-tone block-in (shadow masses as flat greys over paper,
  like a thumbnail value study), driven by the tonal key and the light
  motivation. High-key boards stay mostly paper; low-key boards are mostly
  dark with the subject picked out; a silhouette is a flat dark shape against
  light.
- **Background and perspective.** Environments are drawn with deliberately
  lower line weight and detail than the figure, so the subject reads first.
  The horizon line and vanishing points follow from the camera and are drawn
  faintly; horizon placement is a composition choice, not an accident.
- **Composition guides** (thirds grid, safe area, caption band) as an
  optional overlay on review sheets, with headroom and lead room checked.
- **Camera movement.** Scene v2 gains an optional camera path: keyframes of
  position, look-at and field of view over frames, with easing. The renderer
  draws start and end frames with movement arrows on the board, and renders
  the in-between frames for the animatic so moves are judged in time, not
  imagined. The same path becomes the movement instruction for image-to-video
  and the push-in or drift on held stills in assembly.

### 7a.4 Where it plugs in

| Stage | What changes |
|---|---|
| Shot list | Chooses from the vocabulary, with a reason per choice, and checks the sequence grammar |
| Storyboard (section 7) | Maps vocabulary to numbers: size and lens to camera distance and field of view, angle to camera height and pitch, composition to where the subject lands in frame; the cinematic heuristics guide becomes this mapping |
| Animatic | Shows movement and tonal key in time |
| Text route | Uses the vocabulary words a model understands ("low-angle wide-lens medium close-up, low-key, rim light from behind") |
| Generation | The approved key, motivation and movement go into the prompt; the value pass can serve as a lighting reference |
| Review | Thirds grid and safe-area overlay; automatic flags for a crossed 180-degree line, missing lead room, a weak size jump, or a subject with too little tonal contrast against its background |

### 7a.5 A reference library of shot recipes

Alongside the pose library, keep a small library of named shot recipes, each
a scene record plus a rendered board and a note on when to use it: for
example an establishing wide to insert, an over-the-shoulder pair, a
one-point-perspective corridor, a low-angle hero, a high-angle isolation, a
silhouette against a window, a dolly-in to a realisation, and a dolly zoom.
They give the shot step starting points the way reference poses do for the
figure.

### 7a.6 Style profiles: one look per film

The vocabulary is not chosen freely shot by shot. Each film (or series) has
a **style profile**, and every shot choice is made inside it, so the film is
stylistically consistent. The profile records preferences and limits for
each dimension of the vocabulary, plus the things that only exist at film
level:

| Field | What it fixes |
|---|---|
| Framing and composition | Preferred rules (symmetry, thirds, deep staging), headroom habits, how often to break them |
| Angle and lens habits | Preferred and avoided angles; lens feel (flat long lens or close wide lens) |
| Movement | Allowed moves and their character: locked-off, precise lateral tracking, whip pans, handheld, slow push-ins |
| Tonal key and contrast | Default key, contrast range, whether black-and-white |
| Light | Typical motivations, hard or soft, time of day, practical lights |
| Palette | Colour scheme or monochrome; used by generation, ignored by the value pass |
| Texture | Grain, softness, halation; generation and grading only |
| Editing | Average shot length, cut types, transitions, rhythm against narration |
| Aspect ratio | Within the delivery frame: full frame, or a letterboxed or pillarboxed image area |

Illustrative profiles, described by their visual traits:

| Profile | Traits |
|---|---|
| Symmetrical tableau (in the manner of Wes Anderson) | Centred one-point compositions, flat frontal staging, eye-level camera, precise lateral tracking and whip pans, high-key, pastel palette, locked-off frames held for a beat |
| Colour-field epic (in the manner of Zhang Yimou) | Large saturated colour fields with symbolic meaning, wide and extreme-wide compositions, patterns of many figures, slow deliberate movement, strong graphic shapes |
| Hong Kong police thriller | Handheld and fast moves, low angles, Dutch tilts, long lenses on crowded streets, night exteriors with neon and sodium light, wet surfaces, short shot lengths |
| Film noir, black and white | Low-key, hard single sources, deep shadows and silhouettes, venetian-blind and window shadow patterns, wet streets at night, low and canted angles, slow push-ins |

How it is used:

- The shot list and the scene step choose from the profile's preferred
  values first; a deliberate break is allowed but must carry a reason.
- The review sheet flags shots that drift from the profile (a handheld shot
  in a locked-off film, a high-key shot in a noir).
- The value pass uses the profile's key and contrast; noir boards are mostly
  dark, tableau boards mostly paper.
- Generation receives the profile's traits as plain description of the look
  (composition, light, palette, texture), not just a name, so results stay
  consistent across shots and don't depend on how a model reads a name.
  Prompts describe a style; they never ask a model to reproduce a specific
  film's frames.
- The style profile is approved with the script (approval 1), because it
  shapes every shot after it.

## 8. Storyboard renderer roadmap

| Order | Change | Why now | Done when |
|---|---|---|---|
| 1 | Regression tests on the 18 reference scenes and the warnings | Everything below changes drawing code | Any drawing change fails until goldens are updated deliberately |
| 2 | Per-render state: remove globals (`P`, `GS`, `HS`, `BL`, `EX`, `FACE`, `CLAMPS`, `rnd`) | Multi-figure and repeat renders depend on it | Render order cannot change any output |
| 3 | Public fixed camera: vertical field of view, delivery frame size, near-plane clipping. Build on the fixed scale-and-offset path `draw` already uses for `renderLineup` (`sh.fix`) | Scene records always auto-fit the projected figure into a 320 x 200 frame, so a camera cannot stay put across shots or place a subject on a third | A locked camera keeps a world marker on the same pixel while the subject moves; a primitive crossing the near plane is clipped, never projected from behind the lens |
| 4 | IK guards, joint limits on reach targets, named contact sites, coded diagnostics (section 7, step 5) | Needed by section 7 | An impossible elbow on a reachable target is reported with its code |
| 5 | Stable part and prop ids through geometry expansion. A visibility check for occlusion-critical regions that compares camera-space depth along shared camera rays using simple surface proxies. Contour, skeleton and depth exports when a consumer needs them | `draw` sorts each form by one average depth (`items.sort`), so a painted id pass can line up perfectly with a physically wrong overlap, exactly where a rung crosses a boot | In a crossing-bars fixture the visible id switches at the known crossing; both ladder views agree with the drawn overlaps; disagreements are flagged for review, never auto-accepted |
| 6 | Several figures in one depth-sorted draw list, namespaced joints | Two-person scenes | Two people share a floor with correct overlap |
| 7 | Environment presets and one key light with floor shadows | Places and mood | A reverse angle keeps the door and light direction |
| 8 | Start and end poses with locked contacts, for motion planning | Guide image-to-video and catch foot slide | Interpolation that breaks a locked contact fails |
| 3a | Value pass: two- or three-tone shadow block-in from tonal key and light motivation | Light versus dark is the main mood control and must be visible in boards (section 7a.3) | High-key, low-key and silhouette versions of one scene read as different moods at phone size |
| 3b | Camera paths: keyframed position, look-at and field of view with easing; start and end boards with movement arrows; in-between frames for the animatic | Movement is a shot choice and must be judged in time | A dolly-in and a zoom from the same start frame visibly differ in perspective |
| 3c | Composition overlay and checks: thirds grid, safe area, caption band, headroom and lead room | Framing must be reviewable and partly checkable | Subject placed on a third by a fixed camera lands within tolerance |
| 6a | Background drawn at lower line weight and detail; faint horizon and vanishing points | The subject must read first; perspective must be visible | In a street preset, the figure is still the first thing a viewer finds |

Rows 3a to 3c follow row 3 (they need the fixed camera); row 6a goes with
environments. Later, from draft 1: concave outlines, per-profile muscle
shapes, night, headlights and wet-ground lighting.

## 9. Testing

- **Drawings.** Golden SVG text for all reference scenes, frames, sheet and
  line-up at a fixed seed: exact comparison, since rendering is deterministic.
  When a golden must change, render old, new and a difference image side by
  side for the human, who approves before the update. Region checks (grip,
  gaze, pelvis join, V hand) can be added if whole-frame comparison misses
  local defects. A **renderer manifest** names every fixture, its seed, its
  expected warning codes and whether it is a frame, sheet or line-up case; a
  folder scan may discover files but does not decide coverage.
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

Run a capped manual pilot before building the generation adapter. The
business question is whether blocking a shot in metres earns its producer
time, so the main comparison is between whole workflows, not just between
inputs. (A text prompt derived from a finished scene record already carries
the director's camera and contact decisions, so comparing it with the board
only measures the effect of sending the picture.)

- Freeze a set of unseen shot briefs, the previous cut, the must-see criteria
  and the delivery shape. Include ordinary explanatory inserts as well as
  hard contacts. Alternate views of one setup count as one case.
- **Workflow comparison.** One operator writes a direct prompt from the
  brief. Independently, the same brief is blocked as a scene and submitted as
  the board plus a scene-derived prompt. Same model, style, size and take
  allowance. Time both from receiving the brief through review and repair.
- **Isolating the picture.** Where the workflows differ, submit the
  scene-derived prompt alone on the disputed shots. Try structural control
  (contour or depth) only on a demonstrated failure, with a model that
  supports it.
- **Judging.** Labels shuffled; first takes judged against the frozen brief
  in the cut. The approved drawing is scored too, at zero generation spend.
  Record retries, unrecoverable failures, billed cash and active minutes,
  including time on rejected shots.
- **Decision rule, set before running.** The producer sets what one extra
  usable shot is worth in minutes and cash. Report paired wins, losses and
  ties with counts. With eight cases one changed verdict moves the rate by
  12.5 points, so a small or mixed result leaves routing provisional; any
  proposed default is confirmed on fresh briefs in phase C before automation
  is funded.
- Cost: priced against a separate development cap before running, not a
  film's budget.

## 11. Phased delivery

| Phase | Film | Exit decision |
|---|---|---|
| A. First cut, no image model | 15 to 20 seconds built on the ladder pair, whose pose and ladder are identical, so the lesson is about what a viewpoint shows. Establish the hands in the side view and ask the viewer to track the far hand; cut low and leave a beat to look; return to the side for the answer. Use a portrait crop or a detail insert, not full-width panels, so hands and captions stay legible on a phone. Human or Polly voice, captions, hard cuts | Before recording final narration, show the two views silently on a phone to a fresh viewer: they point to the grip in the first view and say what they can still see in the second. If the intended change is unclear, reframe or choose a clearer comparison. In the voiced cut, check the viewer understands the climber held the pose and only the camera moved |
| B. First generated film | 30 to 45 seconds; approved animatic; one generated still replacing a drawing, at most one motion shot; parallel cut with the drawing | Private upload with captions and receipt under $5 cash; producer minutes recorded |
| C. Repeatable explainers | Route experiment done; description-to-scene with repair; three unseen briefs including a non-ladder scene | Two of three films within the cash cap and a 45-minute labour target, counting all active producer minutes from brief to private master (rejected takes and manual repair included, provider waiting excluded) from the labour ledger. Report median and maximum by stage and the number of shots needing manual blocking. Swapping out a hard brief counts as a failure |
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

Q1 to Q6 in section 3. Also:

- Q7. The first channel's visual style: the sketch itself or generated
  plates (can be per film; phase A uses the sketch), and which style profile
  the first films use.
- Q8. How many active producer minutes one extra accepted shot is worth
  (needed for the section 10 decision rule).
- Q9. Which recurring audience question justifies a second film after the
  ladder demonstration.

Raised by round 1 and not yet answered: when a setup should be reused for
the next shot versus rebuilt; which contact and support checks are truly
machine-verifiable on a sketch; which shot classes lose enough in a held
drawing to justify buying motion; and how large a test sample is enough to
show a reference library helps rather than merely retrieving familiar poses.

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
| Cost reservation and job ids before network calls | GPT | Round 1: serialised per film, ambiguous submissions stay charged (section 5.3) |
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

Model and price facts were spot-checked on 2026-11-24 against these pages.
They remain **verify** until the purchase record in section 3.2 is made:

- Runway API pricing: https://docs.dev.runwayml.com/guides/pricing/
- Amazon Polly pricing: https://aws.amazon.com/polly/pricing/
- Polly speech marks: https://docs.aws.amazon.com/polly/latest/dg/speechmarks.html
- YouTube Shorts length and shape: https://support.google.com/youtube/answer/15424877
- Cartesia TTS timestamps: https://docs.cartesia.ai/api-reference/tts/websocket
- Seedance 2.5, Wan 3.0, Kling 4.0 comparison: https://wavespeed.ai/blog/ai-comparisons/seedance-2-5-vs-wan-3-0-vs-kling-4-0/
- MiniMax H3 model card: https://huggingface.co/minimaxai/minimax-h3
- Gemini Omni Flash: https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash

## 16. Flywheel status

| Step | State |
|---|---|
| Foundation bundle | Done |
| Initial plan | Draft 1 |
| Competing plans | Done: GPT and Grok |
| Synthesis | Draft 2 |
| Refinement rounds (4 to 5) | Round 1 applied (Copilot, GPT) plus the human's cinematography and style notes: draft 3 |
| Convert to beads | Updated to draft 3 |
| Polish beads | One pass after each update |
| Swarm | Not planned at this size |

## 17. Refinement log

Ratings: **agree** (applied as proposed), **partly** (applied with changes),
**reject** (not applied). Diffs were applied by hand where they did not
apply cleanly.

### Round 1

| # | Source | Change | Severity | Rating | Where and why |
|---|---|---|---|---|---|
| C1 | Copilot | Machine-readable pose-example records; retrieval must prove the contacts exist | critical | agree | 5.1, 7 step 2. Prose descriptions cannot be queried |
| C2 | Copilot | Scenes use the common envelope; dispatch on kind and version; no `sceneVersion` | critical | partly | 5.2. Applied, but the CLI still accepts bare v1 files so the 18 reference scenes and today's commands keep working |
| C3 | Copilot | Edit as replayable half-open frame intervals | important | agree | 5.1. Merged with G6's cue offsets |
| C4 | Copilot | Coded IK and contact diagnostics so repair knows what to change | important | agree | 7 step 5, roadmap row 4 |
| C5 | Copilot | Renderer manifest naming fixtures, seeds and expected warnings | important | partly | 9. Manifest added; the claim that golden SVG text breaks on harmless formatting does not hold, since the text is generated by our own code |
| C6 | Copilot | Producer-entered labour ledger as a phase C exit criterion | important | agree | 5.1, 11 |
| G1 | GPT | Route experiment compares whole workflows (direct prompt vs blocking), counts setups once, treats small results as provisional | critical | agree | 10. Draft 2's design gave every arm the director's decisions, so it could not answer whether blocking pays |
| G2 | GPT | Phase A: silent test first, portrait crop or detail insert, lesson about viewpoint | important | agree | 11. Checked: the two ladder scenes do share pose and props |
| G3 | GPT | Serialise reservations per film; ambiguous submissions stay charged | critical | agree | 5.3 |
| G4 | GPT | Keep the evaluation set apart from the retrieval library | important | agree | 7 |
| G5 | GPT | Fixed camera builds on the existing `sh.fix` path; single-depth sort cannot support visibility checks | important | agree | 8 rows 3 and 5. Both code claims checked and correct; it also corrects draft 2's "always rescales" |
| G6 | GPT | A shot is an appearance (return cuts reuse a setup); signed cue offset; hand-marked timing for human reads | important | agree | 4, 5.1, 6 |
| G7 | GPT | Auditable purchase record before the first paid call | important | partly | 3.2, 15. Record added and source URLs listed; the facts were spot-checked on 2026-11-24, not unverified, but stay "verify" until the purchase record exists |
| H1 | Human | Cinematography: shot selection, movement, background, perspective, mood, light versus dark | — | agree | New section 7a, roadmap rows 3a to 3c and 6a |
| H2 | Human | Stylistic consistency per film | — | agree | New section 7a.6, style profile record |
