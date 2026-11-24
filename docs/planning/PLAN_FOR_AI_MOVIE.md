# Plan for ai-movie

Status: **draft 5**, 2026-11-24. Draft 5 records the human's scope decision
(section 1.1): the first product is a storyboard film. Draft 2 was a synthesis of three independent
plans:

- draft 1 (Claude, written with the human during the storyboard sessions),
- `PLAN_FOR_AI_MOVIE_GPT-6.md` (GPT),
- `PLAN_FOR_AI_MOVIE_Grok.html` (Grok).

Draft 3 applied refinement round 1 and draft 4 applies round 2 (Copilot and
GPT each, in `refinements/ROUND_*.md`). Section 15 records what came from where in the
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

### 1.1 Near-term scope: the storyboard film (human decision, 2026-11-24)

Well-made storyboard frames, held as static shots, with voice and a little
music, are enough to tell a story. So the first product is a **storyboard
film**: the approved animatic *is* the deliverable. The front end goes from a
story to a screenplay with intended beats, and from there to shots.

In scope now: story, screenplay with beats, voice, shot list, boards with
full cinematic intent (size, angle, lens, composition, layers, tonal key,
light, style profile), animatic, a light music bed, captions, assembly.

Deferred: image and video generation, the route experiment (section 10),
camera moves beyond simple holds, cost reservation for paid generation,
post-production beyond the mix (grading, conforming, sound design,
regeneration). These stay in the plan for a later phase and are not built
until the storyboard film works.

### Non-goals for now

- On-camera presenters, lip sync, or real people's likenesses.
- Character consistency across shots (a hook is left for drama later).
- A graphical editor. Records are JSON, edited by hand or by an LLM.

## 2. Principles

| Principle | What it means in practice | Source |
|---|---|---|
| First product is a storyboard film | Static boards, voice and a light music bed tell the story; generation comes later and only if it adds something (section 1.1) | Human, 2026-11-24 |
| Story first, then screenplay with intended beats | Every shot traces back to a beat that states what happens and what the audience should understand or feel | Human, 2026-11-24 |
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

1. **Story**: logline, premise, characters (each with a body profile),
   setting, the change the story turns on, intended audience and length,
   delivery shape, style profile. For an explainer, the story is the
   question and its answer, with evidence.
2. **Screenplay with intended beats.** Scenes, each with a location and time
   of day, broken into beats. Each beat states what happens, the intended
   effect on the audience (what they should understand or feel at that
   moment), who is in it, and its narration or dialogue with cue words. The
   beat list is the spine every later stage traces back to.
   **Approval 1: story, screenplay beats, pronunciation, style profile and
   character sheets (section 7b).**
3. **Voice**: synthesise or record the narration and get word timings. For a
   short human read, hand-mark the caption phrase bounds and named cut cues
   on the actual take, stored as sample offsets with the audio's hash, so a
   pickup can never silently reuse stale timings.
4. **Shot list**: one row per appearance in the cut. A return cut reuses a
   camera setup or plate. Each appearance is tied to a beat and a cue, with
   an editorial offset from the cue, must-see and may-hide lists, and the
   shot it cuts from.
5. **Storyboard**: choose the cheapest image that supplies the missing
   information. Staged action becomes a scene record and a sketch frame. An
   explanatory insert can instead be an authored diagram or annotated detail
   (for example a side-on sketch of camera, hand and the body between them),
   used directly as its board and final still. It carries a source digest,
   evidence, the style profile and a must-see test through the same animatic
   and approval. Pose retrieval applies only to staged action.
6. **Animatic**: frames cut to the real narration timings, watched as a film.
   **Approval 2: storyboard, judged in sequence, not frame by frame.**
7. **Generation** (deferred; optional per film later): stills from approved
   frames, then motion for the few shots that need it, within the cash cap.
   In the storyboard film the approved boards are the final pictures.
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
| story | logline, premise, characters `[{id, characterSheet, description}]`, setting, turning change, audience, target length, style profile id |
| character sheet | id, name, role, body profile, silhouette shapes, garments as forms, value per garment, signature props, face option, turnaround hashes (section 7b) |
| scene (screenplay) | number, location, time of day, characters present, beats in order |
| style profile | framing, angle and lens habits, movement, tonal key and contrast, light, palette, texture, editing rhythm, image aspect ratio (section 7a.6) |
| beat | scene, what happens, intended effect (understand or feel), characters, spoken (narration or dialogue, with speaker), display, cues `[{id, word, occurrence}]`, evidence, target duration, minimum screen time |
| shot | beat, intent, template (reference pose), setup, inCue, cueOffsetFrames (signed, default 0), mustSee, mayHide, motion, cutFrom |
| scene | v1 (today's format) or v2 payload: camera, environment, lights, figures, props (section 5.2) |
| pose example | actions, setup id, support, contacts `[{figure, joint, target}]`, gaze target, airborne, occlusion notes, scene hash, limitations |
| board receipt | scene hash, seed, art path, control paths, projected anchors, diagnostics, approval |
| attempt | shot, board hash, route, model, prompt, attempt number, job id, asset, checks, estimated and billed cost |
| asset provenance | asset hash, source (provider and model and settings, or author, or library), licence or dated terms snapshot, input assets, public-use and AI-disclosure flags |
| motion | kind (`hold` with drift or push-in, `camera`, `action`), start and end frame, moving figure and parts, locked contacts, camera path id, visible result the move must produce, forbidden changes |
| continuity | axis id (if an axis is established), camera side, action screen direction, who looks at what, subject screen side, size |
| style reference | profile id, reference board strip hashes, first approved finished plate (generated films), marked focal light-dark boundary and story detail, provenance |
| voice | audio path, sample rate, words `[{text, onset, end?}]` |
| captions | cues in sample time, layout, WebVTT sidecar |
| mix | music regions with rights, gain and fades |
| edit | fps, voice asset hash, intervals (below), captions, mix, master path |
| release | platform, master hash, title, thumbnail, captions, rights, disclosure decision, visibility, remote id |
| labour | run id, stage, task, start and end time, active seconds, blocker type, notes; entered by the producer |

An edit is a list of replayable intervals, not a timeline rebuilt each run:

```json
{"startFrame": 38, "endFrame": 83, "shot": "ladder-side-1", "board": "sha256...",
 "media": {"kind": "clip", "sha256": "..."},
 "sourceInFrame": 0, "sourceOutFrame": 45, "transition": {"kind": "cut"},
 "anchor": {"kind": "speech", "cue": "reveal", "offsetFrames": -6}}
```

Frames are integers at the delivery fps; ranges are zero-based and
half-open; an interval must be at least one frame long.

- **Selected media.** Each interval names the exact drawing, still or clip
  by digest; the board is provenance, not the picture. For clips, the digest
  is of the reviewed delivery-fps conform and source frames refer to it; for
  stills, source bounds are omitted and the image is held. Bytes are
  verified before assembly; a missing asset or digest mismatch fails with
  the shot id. Swapping only the selected take keeps the board approval and
  reopens the final approval.
- **Timing anchors.** A `speech` anchor resolves a cue against the voice
  hash and adds the editorial offset. A `picture` anchor names a visual beat
  and its chosen frame (the first frame the receiver withdraws), which also
  allows a silent film with no voice or captions. Retiming a picture beat
  reopens the animatic. Cut positions never come from rescanning captions.
- Changing a board hash, media digest, source range or voice hash marks the
  affected intervals and the master stale; changing only a mix region does
  not rebuild boards.

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

**Ground before aiming the gaze (v2).** Today `fig()` aims the head at the
look target, and `draw()` moves the whole figure onto the floor afterwards,
so a grounded figure can look past a nearby object with no warning. In v2,
support placement finishes before gaze is solved, and the gaze error is the
angle between the final head-forward vector and the vector from the final eye
point to the target (undefined, and reported, for coincident points). v1
drawings keep today's behaviour. Test: two grounded figures of different
heights looking at a nearby parcel, with the reported error matching an
independent measurement from the exported transforms.

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
| Screenplay | Story to scenes and beats, each beat with what happens and its intended effect. For an explainer: opening question, observable change, answer. Each beat has a target duration and minimum screen time; the word budget comes from a test read or the chosen voice's measured rate (65 to 90 words for 30 to 45 seconds is only a first estimate). Claims tied to evidence | One redraft after notes; unsupported claims rejected; a beat that doesn't fit gets a shorter line or fewer shots | The timed read leaves at least a second of lead and a second of resolution around each observable change; a viewer can answer the opening question from a specific image; producer approves meaning and pronunciation |
| Voice | Human recording or TTS, decoded to 48 kHz mono. For a short human read, hand-marked phrase bounds and cut cues on the actual take, stored with the audio hash | Missing required marks or text mismatch blocks the beat | Ordered onsets, correct cue words, no clipped syllables |
| Shot list | Per beat: what is different on screen at the end, camera side, focal subject, cue, must-see, may-hide | Shots that merely illustrate the same noun are cut; tighten the script instead | Every line maps to a shot or an intentional hold; adjacent screen direction checked |
| Storyboard | Shot to scene record (section 7), render sketch and diagnostics | Two repair rounds, then manual blocking | Required action identifiable at phone size with captions covered; hard diagnostics pass |
| Animatic | Approved boards cut to the narration timings | Re-block shots that don't read in sequence | Producer approves the sequence |
| Generation | Still from the approved board (route from section 10), downloaded and logged with a complete provenance record; motion only from approved stills, against the shot's motion contract | Bounded backoff on rate limits; one creative retake per shot; fall back to the drawn still. An asset with incomplete provenance (terms, source licence, disclosure flag) is not eligible for the edit | Must-see items present; a take is usable only if the whole interval keeps the locked contacts and avoids the forbidden changes, not just a good final frame |
| Captions | Words grouped into phrases from the timings; WebVTT; optional burn-in | Reflow when a line changes | Two lines max, about 17 characters per second, inside the safe area |
| Music | Start with silence; one owned or licensed bed, ducked under speech | Mute if it fights consonants or rights are unclear | Cue words audible without reading on a phone speaker |
| Assembly | Integer frame timeline compiled to FFmpeg; H.264 and AAC in MP4 | Missing media stops with the shot id; never silently loop a short take; reversed or empty intervals rejected | Correct size and fps, duration within one frame, cut boundaries match the approved edit (cue sample rounded to the nearest frame, then the editorial offset applied), -16 LUFS integrated, peak at or below -1 dBTP |
| Publish | Cover from an approved frame, title stating the actual comparison, release receipt | Missing rights or disclosure blocks release | Private upload watched on a phone before going public |

**Phone review protocol.** Boards, animatic and master are reviewed in the
delivery crop at one fixed reference size, with the real caption band at
final line length, a fixed viewing distance and duration, and sound stated
on or off. A required action passes only if the first independent reviewer
identifies it in those conditions before the shot ends; a second reviewer
settles disagreement. If a subject is below the must-see size, change the
shot size or add a detail insert rather than approving a more detailed board.

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

Each shot's choices are resolved from the film's style profile, then the
setup, then shot overrides, and the resolved values are shown on the board
receipt. The producer writes one reason per shot, tied to what it must make
the viewer understand or feel, and explains any deliberate departure from
the profile; shared choices inherit their reason from the profile.

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
- **Eyeline match**: each shot names who looks at what. A point-of-view
  insert may centre the target. In a shot and reverse shot, the two look
  directions are projected and the apparent height and direction of the
  answering look are reviewed. Axis rules apply only where an axis is
  established; a neutral view or a visible crossing can reorient the viewer.
- **Size progression**: establish, then move closer as information narrows;
  jump in size by enough that a cut reads as intentional.
- **Cut on action, a look, a reaction or a spoken cue.** In a silent scene,
  hold the offer long enough to register the pause, then cut to the
  response; compare against the cut one beat earlier and keep the timing that
  lets viewers tell who hesitated without a caption.
- **Rhythm**: shot length follows how long the viewer needs to find the
  must-see element, then the cut.

With a declared axis and look targets in the `continuity` record, projection
can flag a side change, an unexpected reversal or an eyeline disagreement; a
deliberate 180-degree break must be stated. Ambiguous axes are left
unscored, and the cut is always reviewed in time to judge whether a viewer
can follow the change of attention. Framing taste is never automated.

### 7a.3 How it is drawn

The sketch must show these choices, or the animatic cannot be judged:

- **Value pass (light versus dark).** Line art alone cannot show mood. Add a
  simple two- or three-tone block-in (shadow masses as flat greys over paper,
  like a thumbnail value study), driven by the tonal key and the light
  motivation. High-key boards stay mostly paper; low-key boards are mostly
  dark with the subject picked out; a silhouette is a flat dark shape against
  light.
- **Background and perspective.** The focal subject and the story-bearing
  set detail get first claim on contrast and line weight; everything else is
  subdued. In the peeking shot the rail is the obstacle that tells the story,
  so its height against the child's head is kept and the competing balusters
  are quietened. Horizon and vanishing directions come from the camera and
  the set's axes; construction guides appear only on request, and a
  vanishing point may lie off-frame. Horizon placement is a composition
  choice, not an accident.
- **Composition guides** (thirds grid, safe area, caption band) as an
  optional overlay on review sheets, with headroom and lead room checked.
- **Camera movement.** Scene v2 gains an optional camera path: keyframes of
  position, look-at and field of view over frames, with easing. The renderer
  draws start and end frames with movement arrows on the board, and renders
  the in-between frames for the animatic so moves are judged in time, not
  imagined. Each move records the visible result that motivates it, in the
  shot's `motion` contract.
- **A reveal is not an enlargement.** Projection divides by depth, so a
  camera moving sideways changes what is hidden; scaling a still does not.
  A held still allows only a crop inside its bounds, previewed exactly,
  including the end framing and the resolution left. A reveal behind a
  foreground object needs a changed viewpoint: render the path from
  geometry, get a verified moving take, or cut to a second board that shows
  it (track past a rail until the hand appears; check the hand at the reveal
  frame and play the whole move for edge flicker). If a fallback changes
  the reveal or its timing, it is reviewed again in the cut.

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
- **Visual references, not just words.** Approval 1 also pins a style
  reference strip: one wide, one close and one insert or environment board,
  rendered with the final value and line conventions and stored by hash. At
  animatic approval a representative board is marked with its focal
  light-dark boundary and the story detail that must survive at phone size.
  For generated films, the first approved finished plate is pinned as the
  reference for palette, edge treatment and texture. Every later board and
  plate is reviewed against these images, judged by local value relationships
  (does the head separate from the rail?) rather than a global darkness target.
- **Mixed-media seams.** Each replacement plate is played between its
  neighbours with captions on. If the switch from drawing to generated image,
  or a change of light, reads as a change of place or time, match it
  locally, motivate the break in the cut, or use the approved drawing.
  Intentional mood changes are judged against the dramatic beat and recorded
  as a named key or palette change, never by quietly editing a prompt.

## 7b. Character sheets: from mannequin to sketched character

The mannequin is the skeleton and the camera's proof; the audience needs to
recognise people. A **character sheet** turns a posed mannequin into a
sketched character, the same in every shot, the way a production designer's
model sheet does for a storyboard artist.

| Field | Contents |
|---|---|
| Identity | Character id, name, role in the story, body profile (from `profiles.json`) |
| Silhouette | The few shapes that make the character recognisable at thumbnail size: hair mass (as one shape on the head oval), headwear, coat or dress length and flare, trousers or skirt, footwear bulk, bag, glasses |
| Clothing as forms | Garments attached to the body's own forms: a coat is a loft around the torso and upper legs that hangs below the pelvis; sleeves wrap the arm segments; a skirt flares from the pelvis; a hat is a simple solid on the head. They move with the pose because they are built on the same joints |
| Value | Which garments are dark, mid or light, so two characters separate in the value pass and the main character holds the strongest contrast |
| Signature props | Objects the character always carries or uses |
| Face | Default: the head oval with face-direction lines, as agreed. Optional: two or three simple marks (brow line, eye line, mouth) for expression in close-ups only |
| Turnaround | Front, three-quarter, side and back renders from the mannequin with the sheet applied, plus one action pose; stored by hash as the visual reference |

Rules:

- The sheet is approved with the story (approval 1), alongside the style
  profile; the line weight and detail of the overlay follow the profile.
- Overlays stay simple and in the sketch style: silhouette shapes and a few
  fold lines, never rendered detail. The agreed mannequin conventions
  (no fingers, no spiky hair, no hatching, clothed form, draped bust) still
  hold; hair is one mass, not strands.
- Every figure in a scene record refers to a character sheet; the story's
  character list links each character to its sheet.
- Recognisability test: in a contact sheet of thumbnails, a fresh viewer
  can tell the characters apart and pick out the main character.
- Later, the turnaround doubles as the identity reference for generated
  plates, which is where character consistency becomes hard.

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
| 6b | Character-sheet overlays: hair mass, headwear, garments as lofts on the body's forms, props, garment values in the value pass; turnaround renders | Viewers follow people, not mannequins | Two characters in one frame are told apart at thumbnail size; a coat hangs and moves with the pose in front, side and back views |
| 6a | Set-detail emphasis by focal subject and story detail; optional perspective guides | The viewer may need to find a doorway before a figure; the rail in the peeking shot carries the story | In two versions of one street view, viewers find the designated doorway or figure first; guides never appear on the final board |

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

**Deferred** with generation (section 1.1); kept here for the later phase.

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
- **The cheapest intelligible shot.** On an explanatory brief that can be
  answered graphically, also cut a simple diagram or annotated detail insert
  into the same slot, time its preparation, and ask a fresh viewer the
  brief's question after playback. If it explains the answer within budget,
  that route stays eligible even when both generated workflows pass. It is
  scored as a choice of shot, outside the paired model comparison.
- Cost: priced against a separate development cap before running, not a
  film's budget.

## 11. Phased delivery

| Phase | Film | Exit decision |
|---|---|---|
| A. First cut, no image model | 15 to 20 seconds built on the ladder pair, whose pose and ladder are identical, so the lesson is about what a viewpoint shows. Establish the hands in the side view and ask the viewer to track the far hand; cut low and leave a beat to look; return to the side for the answer. Use a portrait crop or a detail insert, not full-width panels, so hands and captions stay legible on a phone. Human or Polly voice, captions, hard cuts | Before recording final narration, show the two views silently on a phone to a fresh viewer: they point to the grip in the first view and say what they can still see in the second. If the intended change is unclear, reframe or choose a clearer comparison. In the voiced cut, check the viewer understands the climber held the pose and only the camera moved |
| B. First storyboard film | A short story (about 60 to 90 seconds) from story to screenplay beats to boards: static shots with full cinematic intent in one style profile, two figures and simple environments where the story needs them, a value pass for mood, voice, a light music bed, captions | A fresh viewer retells the story's turn and names what the main character wanted; every shot traces to a beat; producer minutes recorded |
| C. Repeatable storyboard films | Description-to-scene with repair; three new stories, including one in a different style profile | Two of three films within the cash cap and a 45-minute labour target, counting all active producer minutes from brief to private master (rejected takes and manual repair included, provider waiting excluded) from the labour ledger. Report median and maximum by stage and the number of shots needing manual blocking. Swapping out a hard brief counts as a failure |
| D. Continuity, dialogue and languages | A silent parcel handoff; a short dialogue scene with two voices; a second-language recut | Two viewers identify who gives and who hesitates; roles identifiable across cuts; a fluent reviewer signs off |
| E. Generation and post (optional, later) | Route experiment (section 10), then one generated still replacing a drawing with a parallel cut, at most one motion shot; post-production beyond the mix if it earns its cost | Private upload under $5 cash; decide whether generated plates beat the drawn film for the cost |

**Comprehension counts in phase C.** Before each phase C film, write the
audience question (for a story: what was the turn, and what did the main
character want) and the visible evidence a correct answer would cite.
After one normal phone playback with the intended audio and captions, a
fresh target viewer gives their answer and says which image explained it;
the unaided response is recorded. A film counts toward the two required
passes only if it meets the cash, labour and comprehension criteria
together. Time for the check and any recut is counted as labour. One viewer
can expose a failed explanation; a pass is reported as a pilot observation.

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

Raised by round 2 and not yet answered: how long a lead and hold each
narrated change needs for the audience and language; for each moving shot,
which contact or forbidden change is the hard event; how a style profile can
be judged consistently by two providers and two reviewers; whether viewers
read a drawing-to-plate switch as intentional; and how long a hesitation can
last before viewers read refusal instead of uncertainty.

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
| Refinement rounds (4 to 5) | Round 1 (Copilot, GPT, human notes): draft 3. Round 2 (Copilot, GPT): draft 4. Human scope decision: draft 5 |
| Convert to beads | Updated to draft 5; generation beads deferred (`deferred` label, lowest priority) |
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

### Round 2

| # | Source | Change | Severity | Rating | Where and why |
|---|---|---|---|---|---|
| C1 | Copilot | Word budget measured from a test read or the voice's rate; lead and hold around each change | critical | partly | 6. Applied; 65 to 90 words kept as a first estimate only, because the script stage needs a number before any voice exists |
| C2 | Copilot | Motion contract per moving shot: moving parts, locked contacts, forbidden changes, whole-interval check | critical | agree | 5.1, 6 |
| C3 | Copilot | Continuity as data: axis, camera side, direction, eyeline, subject side, size | important | partly | 5.1, 7a.2. Merged with G4: axis rules only where an axis is declared |
| C4 | Copilot | Style reference strip pinned at approval 1 | important | agree | 7a.6. Merged with G6 |
| C5 | Copilot | Provenance complete before an asset is eligible, not just at release | critical | agree | 5.1, 6 |
| C6 | Copilot | Fixed phone review protocol | important | agree | 6 |
| G1 | GPT | Edit intervals select exact media by digest; swapping a take reopens only final approval | critical | agree | 5.1. Phase B's parallel cuts were otherwise indistinguishable |
| G2 | GPT | Cheapest intelligible shot: authored diagrams and annotated inserts as boards and finals | important | agree | 4, 10. Every shot was being forced through a staged scene |
| G3 | GPT | Ground the figure before solving gaze; measure the final ray | important | agree | 5.2. Checked in code: gaze is solved in `fig()` before `draw()` applies `stand` |
| G4 | GPT | Cut on a change of attention; picture timing anchors for silent scenes; eyeline by look targets | important | agree | 5.1, 7a.2 |
| G5 | GPT | A reveal needs a viewpoint change; a still allows only a previewed crop | important | agree | 7a.3 |
| G6 | GPT | Profile inheritance with one reason per shot; local value judgement; story detail gets contrast, not blanket background fading; mixed-media seams | important | agree | 7a.1, 7a.3, 7a.6, roadmap 6a. Replaces draft 3's blanket "backgrounds lighter" rule |
| G7 | GPT | Phase C requires a comprehension check per film | important | agree | 11 |

### Human scope decision (draft 5)

| # | Source | Change | Rating | Where |
|---|---|---|---|---|
| H3 | Human | The first product is a storyboard film: static boards, voice and a light music bed; generation, the route experiment and post-production beyond the mix are deferred | agree | 1.1, 2, 4, 10, 11 |
| H4 | Human | Front end goes from story to screenplay with intended beats | agree | 4, 5.1, 6 |
| H5 | Human | Character sheets turn posed mannequins into recognisable sketched characters | agree | 5.1, 7b, roadmap 6b |
