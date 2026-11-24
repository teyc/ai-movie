# Plan for ai-movie

## 1. Summary

Make the first film about a subject this repository can already demonstrate honestly: how a camera changes the way we read the same action. Cut from the side view of the climber to the view from the foot of the ladder while the narrator explains what disappeared behind the near leg. This can be a finished illustrated short with a voice, deliberate cuts and captions. It also gives us a controlled experiment when we replace one drawing with a generated image. Three decisions matter most. **Lock the spoken performance before buying visuals. Compose in the delivery frame with an explicit list of things the audience must see. Buy motion only when a still cannot carry the beat.** Measure success in accepted shots, editing minutes and dollars per released film.

## 2. Where I disagree

- **The drawing settles the director's intent. Generation gets a vote on the result.** A model can reproduce the lean of a ladder while quietly moving a boot between rungs. Treat that as a failed take even if it looks expensive. Keep the board, a literal description and a short acceptance card together. An exact drawing can itself be the best final image.
- **A pretty pose is too small a unit of production.** A shot earns a place by changing what the viewer knows. A runner in the middle of an empty frame works on the contact sheet. Cut two such shots together and the runner may reverse direction or appear to run in place. Plan what carries across the cut, where the viewer last looked, and how long they have to read the change.
- **Reverse the README's dependency between generation and voice.** Synthesize or record whole thoughts first. Cut a rough film with timed drawings, called an *animatic*, and listen once with eyes closed. An extra clause can cost two extra shots. Finding that in the recording booth costs less than finding it in the edit.
- **Keep automatic framing as the legacy camera mode.** In `draw`, the projected joint bounds determine scale and centre. Moving the character cannot reliably place them on the left third of a locked shot. Add a fixed lens and viewport before adding streets or dramatic lighting. The existing 320 × 200 composition is a legitimate original format, including for the pilot.
- **Retain the reviewed drawing language.** In the reference sheet, the near hand in *Dive reach* is large enough to overlap the head. In *Peace sign* the small V only reads if given screen space. More anatomical detail would solve neither issue. Keep the three hand shapes, clothed silhouette, curved head guides, relative spine and sparse ink. Express dramatic extremes through pose and camera.

## 3. Answers to the open questions

External capability, price and policy notes below carry the research date **24 November 2026 — verify**. These are documentation checks, with no live account or purchase test. Repeat the checks for the actual region, account, voice and model version before the first paid run. Dollar caps, test thresholds and durations elsewhere in this plan are proposed production settings.

**1 · Format.** Start with a single off-screen narrator, one idea, one visual comparison and a payoff. Commission six explainers of 30–45 seconds only after the pilot. A silent two-character scene comes next, for example one person offering a box and the other hesitating. It tests acting, eye lines and continuity without introducing speech synchronisation. Dialogue drama follows only if a viewer can tell who wants what in the silent cut. An anthology that alternates these formats immediately would make failed pilots hard to diagnose.

**2 · Generation.** Use the board plus a descriptive prompt to make a styled still. Approve that frame, then animate it only if needed. A *reference* suggests appearance or layout. A *control image* encodes structure in a particular model's expected representation. A *first frame* sets the starting photograph for a clip. None promises that the last frame will retain a hand contact. Convert the same board into prose for accessibility, shot search and a fair text-only comparison.

| Route | Candidate and documented input, 24 November 2026 — verify | Production decision |
|---|---|---|
| Text or reference → still | Runway Gen-4 Image. Compare prompt only against the same prompt with a reference image. [Model catalogue](https://docs.dev.runwayml.com/guides/models/) · [Input specifications](https://docs.dev.runwayml.com/assets/inputs/) | First paid experiment. Send clean unlabelled artwork. Put wardrobe, material, time of day and continuity in words. Score copying of board ink as a defect if the brief calls for a painted plate. A plate is the finished image used in the edit. |
| Image → video | Runway Gen-4 Turbo accepts a prompt image for image-to-video. [Input specifications](https://docs.dev.runwayml.com/assets/inputs/) | Give it the accepted plate and one motion instruction, e.g. a small shift of weight with locked camera. Review the entire take. |
| Text → video | Runway lists a text-to-video operation and Gen-4.5 video generation. Confirm the exact model/ratio/duration tuple with a single minimal request before enabling it. [API reference](https://docs.dev.runwayml.com/api/) · [Models](https://docs.dev.runwayml.com/guides/models/) | Alternative for incidental atmosphere. Text should express screen relationships, e.g. “near boot covers the lower rung”, since model interpretation of world coordinates is untested. |
| Structural control → still | Black Forest Labs FLUX.1 Canny [dev] conditions an image on edges, with separate terms for model use and outputs. [Publisher's model card](https://huggingface.co/black-forest-labs/FLUX.1-Canny-dev) | Investigate if references consistently miss silhouettes. Export clean outer contours in the model's expected polarity and dimensions. Verify model-use rights and compute cost before a commercial trial. Avoid sending the decorative border or every construction ring as an edge. |

**3 · Word timings.** Choose Amazon Polly neural speech with word speech marks. Request audio and marks separately with the identical text, voice, engine and locale. A mark supplies a word onset in milliseconds and byte offsets in the input. Derive a caption window from adjacent onsets, punctuation and audio duration. Preserve the distinction between an observed onset and an estimated end. Alternative for a better performance: record a human reading and use forced alignment, which fits a known transcript to a waveform. Require a listening pass on proper names for either route. **24 November 2026 — verify** voice/region and word-mark support with a two-sentence pilot. [Polly speech marks](https://docs.aws.amazon.com/polly/latest/dg/speechmarks.html) · [Output fields](https://docs.aws.amazon.com/polly/latest/dg/output.html)

**4 · Destination.** Target YouTube Shorts first, 1080 × 1920, 30 progressive frames per second, with a 30–45 second editorial target. A tall rectangle favours a single person and leaves room for type, but it can hide a second actor or the end of an extended arm. Compose natively. In the very first film, deliberately exhibit the complete landscape drawings as panels in a portrait canvas with captions underneath. Make a separate 1920 × 1080 camera setup for longer 90–150 second landscape explainers later. Treat Reels and TikTok as subsequent exports with their own preview and disclosure review. **24 November 2026 — verify** YouTube documents square or vertical uploads up to three minutes as Shorts for standard channels under its date rules and requires disclosure of realistic generated or meaningfully altered scenes. The uploader records the applicable decision for each cut. [Shorts eligibility](https://support.google.com/youtube/answer/15424877?hl=en) · [YouTube disclosure guidance](https://support.google.com/youtube/answer/14328491)

**5 · Budget.** Cost one 36-second film with six six-second editorial slots. Use four stills and two shots with five seconds of movement and one second of intentional stillness. Plan twelve still attempts including alternatives, and four five-second motion attempts including retakes. Rates below are **24 November 2026 — verify**, in USD before tax. [Runway API rates](https://docs.dev.runwayml.com/guides/pricing/) · [Polly pricing](https://aws.amazon.com/polly/pricing/)

| Line | Estimate |
|---|---:|
| Twelve Gen-4 Image 1080p plates × 8 credits × $0.01 | $0.96 |
| Twenty generated Gen-4 Turbo seconds × 5 credits × $0.01 | $1.00 |
| 700 neural characters × two Polly requests × $16/million | $0.023 |
| Allocations for text generation, local rendering/storage, owned music | $0.30 + $0.25 + $0 |
| Expected marginal cash, rounded | $2.54 |
| Operating ceiling, including contingency | $5.00 |
| Producer/editor, assumed 45 minutes at $60/hour once templates work | $45.00 |

Expect roughly $48 fully loaded under those assumptions. Pilot labour of two to four hours is a more honest development allowance. Report actual labour, unused purchased credits, subscriptions, rights purchases and tax separately. A minimum credit purchase is a cash outlay even if this film consumes few credits. Reserve against the upper bound *before* each attempt. Drop the second motion shot first when funds run short. An unpriced SKU or uncertain charge holds the reservation. Never let automatic retries spend the contingency without counting the previous attempt.

**6 · Language.** Start with Australian English (`en-AU`) and a producer-approved voice. Define the idea and evidence once, and author the spoken line, displayed text, pronunciation hints, voice and timing per locale. Adapt idioms and the visual cue word together. Use stable beat IDs so “look at the boot” can move later in a translated sentence. Re-record, realign, reflow captions and rebuild that locale's timeline. Share approved silent plates where they still fit. Bilingual captions are a separately designed deliverable. A language without a reviewed voice and caption font stays in draft.

## 4. Architecture and stage contracts

A local Node 22 CommonJS command drives a directory of production files. The operator can stop after any stage, edit a shot and resume. Keep the current pose CLI usable. Use the installed rasteriser for PNG and FFmpeg/ffprobe for encoding and media inspection. Check both executable versions and required filters at startup. Use command arguments, atomic same-volume renames and a single writer per production. Introduce an official signing client for Polly only if an installed AWS CLI cannot satisfy the adapter. Keep provider dependencies outside the drawing library.

| Proposed location | Responsibility |
|---|---|
| `bin/movie.js`, `lib/run/` | Stage selection, document validation, dependency hashes, approvals, cost reservation and recovery |
| `lib/story/`, `resource/pose/` | Briefs, beats, shot intent, retrieval of the existing records, bounded corrections |
| `lib/pose/` | Authoritative world geometry, projection, diagnostics, sketch and control exports |
| `lib/media/`, `lib/providers/` | Speech, captions, plate selection, sound, edit compilation and narrowly scoped vendor adapters |
| `lib/publish/`, `test/` | Release packaging and receipts, offline test fixtures and media checks |
| `productions/<film>/` | Brief, sources and rights, script per locale, shots, approved scenes and edit decisions. Small, human-editable inputs |
| `runs/<film>/` | Content-addressed media, stage receipts, review copies, rendered masters and cost ledger. Large local working files |

Examples below illustrate the proposed persisted payloads. Small excerpts use short IDs for readability. Wrap each payload in the same envelope on disk. Validate at read and write boundaries. IDs join records. Hashes identify specific revisions. An approval pins the hash of exactly what was seen or heard.

**Envelope and brief**

```json
{"kind":"brief","version":1,"id":"camera-study","inputs":[],"payload":{"audience":"beginning camera operators","question":"What does camera height hide?","evidence":["repo:ladder-climb","repo:ladder-from-below"],"locale":"en-AU","delivery":{"width":1080,"height":1920,"fps":30},"cashCapUsd":5}}
```

**Script → voice and shot planning.** Each beat states a claim or dramatic change. The cue is a stable ID attached to an occurrence in the localised spoken text. A claim can be checked against both listed reference records.

```json
{"beat":"b2","locale":"en-AU","spoken":"Watch the near boot.","display":"Watch the near boot.","cues":[{"id":"reveal","word":"boot","occurrence":1}],"evidence":["repo:ladder-from-below"],"purpose":"Direct attention before the angle changes"}
```

**Shot list → board and edit.** One row per continuous camera setup. Describe subject-left versus frame-left explicitly. The localised editor may hold this shot before the specified cue. An adjoining shot owns the cut on the cue.

```json
{"shot":"s2","beat":"b2","intent":"Show the climber's nearer boot filling the foreground","template":"ladder-from-below","setup":"ladder-A","inCue":"reveal","mustSee":["near boot overlaps lower rung","ladder recedes upward"],"mayHide":["far wrist"],"motion":"hold","cutFrom":"s1"}
```

**Scene → renderer.** Below is a separate proposed two-person setup. All geometry uses legacy metres, axes and degrees. Vertical field of view measures the vertical angle visible to the camera. Coordinates of a room start at the centre of its floor. A light direction points along incident rays. Use a right/up/front basis in documentation that names each axis explicitly, preserving positive x as the neutral figure's left. Resolve standing shifts before looking up final joint anchors.

```json
{
  "sceneVersion":2,"id":"handoff-wide","frame":{"w":1080,"h":1920},
  "camera":{"mode":"fixed","pos":[0,1.35,3.8],"at":[0,1,0],"verticalFovDeg":42,"rollDeg":0},
  "environment":{"id":"store","type":"room","floorCentre":[0,0,0],"size":[4,2.8,5],"visibleWalls":["back","left"]},
  "lights":[{"id":"window","type":"directional","direction":[0.6,-0.8,0],"softness":0.7}],
  "figures":[
    {"id":"giver","profile":"middle-age","stand":true,"pose":{"root":{"p":[-0.46,1,0],"yaw":65},"look":[0.45,1.55,0],"lEl":78,"rEl":78,"lHand":"open","rHand":"open"}},
    {"id":"receiver","profile":"adult","stand":true,"pose":{"root":{"p":[0.46,1,0],"yaw":-65},"look":[-0.46,1.1,0],"lHand":"open","rHand":"open"}}
  ],
  "props":[{"id":"parcel","t":"box","mid":["giver.lHa","giver.rHa"],"off":[0,0.06,0],"size":[0.4,0.28,0.3]}],
  "ground":true
}
```

Create a legacy adapter at `toInternal`: an unversioned record has one implicit figure, legacy fit, existing global props and the original defaults. Qualify bare joint IDs within that figure. Preserve custom inline profiles. A v2 record uses a single world camera and namespaced anchors across all figures. Resolve world props first, solve figures against independent anchors, then attach held props. Reject dependency cycles such as solving the hands against a box whose position is defined by those same hands. Separate a set's dimensions from shot-specific visible walls. The light initially conveys direction and a simple floor shadow, with the same paper and contour treatment.

**Board → review and generation.** Anchors in the receipt use normalised screen coordinates, origin at top left. Visibility is evaluated after occlusion. A required joint can be valid in world space and hidden in the picture.

```json
{"shot":"s2","sceneRef":"sc-s2","seed":11,"art":"s2.png","controls":{"contour":"s2-edge.png"},"anchors":{"climber.lAn":[0.55,0.74]},"diagnostics":[],"approvedBy":"producer","approvedDigest":"board-2"}
```

**Generation → edit.** Store each attempt, including rejects. The selection references a specific downloaded asset. Provider URLs expire independently of the edit.

```json
{"shot":"s2","board":"board-2","route":"referenceStill","model":"gen4_image","prompt":"Low camera behind the climber. Keep the near boot across the rung. Matte blue overalls.","attempt":1,"remoteJob":"job-81","asset":"assets/plate-81.png","selection":"accepted","checks":{"nearBoot":"pass","wardrobe":"pass"},"estimatedUsd":0.08}
```

**Voice → captions and edit.** Sample positions count decoded audio samples at the stated rate. Keep exact input bytes for offset matching. These examples give one short line and one cue, with estimated windows bounded by the clip length.

```json
{"beat":"b2","locale":"en-AU","audio":"b2.wav","rate":48000,"samples":72000,"words":[{"text":"Watch","sample":0},{"text":"the","sample":17520},{"text":"near","sample":24000},{"text":"boot","sample":43200,"cue":"reveal"}],"endMethod":"next onset or clip end"}
```

```json
{"locale":"en-AU","beat":"b2","timebase":"localSamples48000","cues":[{"from":0,"until":72000,"text":"Watch the near boot."}],"layout":"portrait-panel-lower","sidecar":"camera-study.en-AU.vtt"}
```

**Music → mix.** A cue sheet records ownership and exact region of use. Silence is a valid empty list. Preserve the dialogue-only master for translations.

```json
{"rate":48000,"music":[{"asset":"owned-loop.wav","rights":"rights/producer-loop","fromSample":0,"untilSample":72000,"gainDb":-24,"fadeOutSamples":12000}],"voice":"b2.wav"}
```

**Assembly → master.** Use a single integer frame timeline. All intervals include the start and exclude the end. Convert absolute sample positions to the nearest frame once, including cumulative offsets from earlier beats. At 30 fps and 48 kHz one frame is 1,600 samples. Pad the tail to the last frame. The following is a complete miniature 45-frame edit using the cue above.

```json
{"fps":30,"audioRate":48000,"frames":45,"shots":[{"id":"s1","asset":"side.png","in":0,"out":27},{"id":"s2","asset":"assets/plate-81.png","in":27,"out":45}],"voice":"b2.wav","captions":"camera-study.en-AU.vtt","mix":"mix.wav","master":"camera-study.en-AU.mp4"}
```

**Publishing → receipt.** Link master, title, thumbnail, timed text, source inventory, disclosure judgement and review date. A manual upload gets a receipt too.

```json
{"platform":"youtube","locale":"en-AU","masterDigest":"master-45","title":"One climb, two camera angles","thumbnail":"cover.png","captions":"camera-study.en-AU.vtt","rights":["producer-voice","repo-art"],"disclosure":{"decision":"yes","reason":"Realistic generated recreation","reviewDate":"2026-11-24"},"visibility":"private","remoteId":"example-id","state":"uploaded"}
```

**Run state.** Cache by canonicalised input content, implementation version, toolchain, seed and model settings. Audio and visuals have separate dependency chains. A changed title invalidates the package only. A new spoken line invalidates its audio, captions, affected cue boundaries, mix and master. A new source claim reopens the linked shot approval. Use temporary outputs, inspect and hash them, then install atomically. Save approval and selection separately from the asset so an alternate take cannot silently replace an approved one.

```json
{"submissionKey":"s2-take1-v4","state":"submitted","reservedUsd":0.08,"billedUsd":null,"providerId":"job-81","inputDigests":["board-2","prompt-4"],"attempt":1}
```

Persist reservation and intent before network I/O under the production lock. Persist returned job ID immediately. Resume by polling that ID. After an ambiguous submission, reconcile against provider history or use a documented idempotency key (a request identifier that prevents double execution). Without either, stop for operator reconciliation. Release reservations only on confirmed non-charge or conversion to settled cost. An unknown final charge stays counted at its maximum.

## 5. Each stage in detail

| Stage | Inputs, work and outputs | Failure and retry boundary | Cash allowance and acceptance test |
|---|---|---|---|
| Script | Turn brief and evidence into opening question, observable change, answer. Draft 65–90 spoken words for the normal short. Read aloud. Store claims, sources, cue IDs and separately editable display copy. | If the answer needs outside footage, rewrite or source it. Allow one text redraft after producer notes. Reject unsupported claims. | Within shared $0.30 text allowance. A reader can answer the opening question using a specific image. Producer approves meaning and pronunciation before recording. |
| Shot list | For each beat identify exactly what will be different on screen at the end. Assign stable actor/set IDs, camera side, focal subject, cue word, must-see and allowed occlusions. Use an insert (a closer detail shot) when two actions compete. | If continuous motion exceeds the clip window, design two cuts on an action or use separate held poses. Tighten the script if shots merely illustrate the same noun. | Same shared text allowance. Every line maps to coverage or an intentional hold. Every shot changes information, scale or viewpoint. Check adjacent screen direction. |
| Storyboard | Resolve each intent into one approved scene and framing. Render sketch plus diagnostic view. Assemble pictures against measured voice as soon as available. Preserve the rough pencil character even when asking for realistic plates. | Correct scene geometry locally. Show candidate cameras side by side. After two repair rounds route to manual blocking (placing actors and camera). | Local compute. Producer identifies required action at phone size with captions covered. Hard geometry diagnostics and visible requirements pass before visual spending. |
| Generation | Render literal shot prose from projected geometry, add art direction, submit approved board or text baseline, download image and log real settings. Animate only approved first frames. Save enough head/tail footage to trim a shaky start or end. | Transient rate limits get bounded backoff with provider wait hints. Polling can repeat without resubmission. Invalid ratios require a changed request. A moderation stop goes to the producer. One creative retake per selected shot within the ledger. Fall back to a held still. | Expected $1.96 for visuals in example budget. Inspect start, middle and end, then watch at speed for limb drift, changing rungs, camera jumps or unintended writing. Compare appearance with neighbouring plates. |
| Voice and captions | Make one performance per complete thought or paragraph with identical speech-mark request. Decode to mono 48 kHz PCM (uncompressed samples). Map source UTF-8 byte ranges to display tokens, then group into phrases. Export WebVTT timed text and optional burned captions. | Missing marks or text mismatch block that recording. Retry only the failed half if inputs still match. For a changed pronunciation regenerate both. Edit the line before speeding up the voice. | Example $0.023, reserve again for pickups. Check ordered onsets, accurate cue words, whole waveform coverage and no clipped syllables. Target two lines and ≤17 visible characters/second for English, review exceptions at phone size. |
| Music | Begin with silence. Audition one owned instrumental bed at low gain under a completed voice edit. Reduce it under dense phrases, fade at a musical boundary, store attribution and permitted uses. | If a track fights consonants or rights are unclear, mute it and audition the voice-only cut. Reuse the mix recipe when the timeline changes. | $0 new licence in the base case. Compare on a phone speaker with and without music. The producer must still hear the cue word without reading. |
| Assembly | Compile the edit into FFmpeg operations using checked asset paths. Fit panels deliberately, composite captions using a bundled or cleared font, mix, encode H.264 video and AAC audio in MP4. Produce a clean master plus separately selectable captions when requested. | Missing media or an accidental gap stops compilation with shot ID. On encode failure retry locally from immutable sources. Never hide a short take by silently looping it. | Within $0.25 compute/storage allocation. Probe 1080 × 1920, 30 fps and frame count. Decode the whole file, compare duration within one frame after codec padding, check first/last frame and every cut. House audio target −16 LUFS integrated (perceived programme loudness), peak ≤−1 dBTP (true peak). |
| Publishing | Render a cover from an approved frame, write a title that states the actual comparison, package language, captions, sources, rights, disclosure and master hash. Upload privately by hand first. Watch the platform transcode on a phone before release. | Missing rights or obsolete policy snapshot blocks release. An interrupted upload resumes or reconciles its receipt. Never re-upload merely because visibility change failed. | No paid distribution in pilot. Producer signs off on legibility, sound and disclosure in the actual preview, records URL, visibility and release time. Compare retention around the reveal across subsequent films, without treating one short as an audience study. |

## 6. From natural language to a shootable scene

Give the language model a small directing job. It chooses an action, subject, reference pose, relationship, camera family and required on-screen evidence from a vocabulary. Code owns the mathematics. Keep the source sentence beside the choices so a human can see where a request was simplified.

1. **Parse intent.** For “from below, the boot looms while the climber looks to the next rung”, extract action = climb, camera = low/rear, attention = near boot, gaze target = next rung, continuity = same climb. Distinguish what the performer looks at from what the audience should look at. An unspecified side can be chosen using the previous shot. A contradictory request such as seeing a face straight on from directly behind goes back as a choice of two framings.
2. **Retrieve by action and contact topology.** Label the 18 existing records by support (floor, seat, rail, rung, airborne), contacts, profile, gesture, camera sector and dynamic/static status. Match support and contacts before words or body shape. Retrieve both ladder records. Their pose and prop values match, so copy the pose once and try both cameras. A seated child should start from `sitting` with a new profile and adjusted seat height. Copying `child-peek` would inherit the wrong support. Unsupported action goes to manual blocking or a simpler insert.
3. **Resolve anchors in metres.** Name each ladder rung and contact site from the same geometry as `expandProps`. For rung k, interpolate at k × spacing / vertical rise. The existing ladder's eighth rung centre is [0, 2.4, 0.85]. Its right wrist target is [−0.2, 2.4, 0.78]. The offset makes sense as a wrist approach position, distinct from a palm actually touching metal. Declare which *surface* must touch which prop. Solve in order: support height, pelvis, legs, torso, shoulders, wrists, then gaze. Fix world anchors while adjusting the body. An independently placed prop can drive hands. A carried box can instead follow hands.
4. **Try bounded alternatives.** Starting from the retrieved scene, enumerate up to three safe camera sectors, two shot sizes and two offsets. Set the actual destination viewport. Project required surfaces and figure bounds, estimate what covers each and reserve the caption area. Reject impossible/behind-camera candidates. Rank survivors first by must-see contacts and correct direction, then by clearance from the frame edge and previous camera continuity. Keep a wide and a closer candidate if both pass. Reward an intentional silhouette overlap when it is the point of the shot.
5. **Use the renderer as feedback.** Call today's `renderFrame` immediately. Persist its original warnings. Add structured diagnostics with figure, joint, requested/achieved value and units at the solver. For a wrist 0.08 m short, move the root toward the anchored side or reduce torso lean, then retest both feet. For gaze shortfall turn the torso toward the target or choose a camera showing the actual gaze. For a clamped joint adjust the parent first. Preserve locked contacts and camera-side constraints. Restrict edits to an allow-list and two rounds. Never clear warnings by inflating flexibility. Dynamic poses can explicitly request free gaze and an approved flex profile.
6. **Separate solvability from readability.** Automatically check finite geometry, contact-surface error (initial target ≤0.03 m), visible required regions, gaze angle (initial target ≤10° when gaze carries the story), frame margins and screen direction. Thresholds are commissioning targets to calibrate against reviewed examples. A seated body can have perfect ankle positions and float above a seat. Include a seat support test. A manual exception records reason, owner and exact scene revision. Non-finite geometry always fails.
7. **Choose in sequence.** Show two or three candidate frames between the preceding and following approved frames at delivery size. Producer answers “Which boot do I see first?”, “Does the next cut answer the question?” and “Does the body look as if it bears weight?” Leave acting, taste, intended ambiguity, distracting tangencies and emotional clarity to that review. Store the selected scene and reason. A visual model may flag discrepancies later, but it cannot approve the shot.

**Evidence from the current baseline.** In-memory renders of all 18 records produced a single warning, a seven-degree gaze shortfall in `three-point-landing`. Nine records omit `pose.look` and rely on the horizon fallback. Keep legacy behaviour under test. Require an authored gaze choice on new records. The ladder comparison demonstrates why zero warnings cannot certify visibility. In `child-peek` the balusters interrupt the arms while the head clears the rail. Treating all subject occlusion as failure would reject the very composition that describes peeking.

## 7. Renderer roadmap

| Order | Change and reason to do it now | Completion evidence |
|---|---|---|
| 1 | Freeze the legacy output. Capture public API behaviour for frames, sheets and lineup. Seed sketch wobble through the existing `rng`. Record warnings and projected geometry before extracting code. | All 18 stills and the reviewed line treatment survive refactoring. |
| 2 | Extract projection and viewport from `draw`. Keep joint-bounds fit, add fixed vertical lens, independent width/height, near-plane clipping and usable up vector at steep angles. Let the camera remain fixed as a subject moves. | A person walks from centre to frame edge. Moving the same lens backwards shrinks that person. Render both portrait and landscape without stretching. |
| 3 | Return per-figure state from `fig` and localise `P`, `GS`, `HS`, `BL`, `EX`, `FACE`, `CLAMPS` and random state. Keep `loft`, `shp` and silhouette joins intact. Separate solve, project, draw and inspect internally. | Sequential mixed profiles, plus sheet and lineup calls, cannot alter subsequent frame output. |
| 4 | Guard `ik2` against a zero target distance, minimum reach and a pole parallel to the limb. Compute achieved flexion after solving. Add grip/sole contact surfaces, anchor names from `expandProps`, joint IDs in `lim` warnings and residual gaze from the final head orientation. | Show a reachable wrist with an impossible elbow bend as a diagnostic. A raised rung shifts dependent contact sites consistently. |
| 5 | Add unlabelled plate, contour, joint points and visible object-ID output using the same camera. An object-ID pass colours each surface by identifier for measuring coverage. Split long bars/faces where mean depth misorders a critical overlap. | In both ladder views joint overlays coincide with the sketch. The boot/rung overlap and the near rail in `child-peek` agree with human-labelled sample points. |
| 6 | Compose several figures in one world-space draw list. Namespace parent tags as well as joints so the second torso cannot hide the first actor's arm by accident. Support object-only inserts and an empty establishing shot. | Two actors share a floor, sensible relative sizes, depth order and a box with deterministic ownership. |
| 7 | Add room floor, back wall, door and window as planes/boxes, then street kerb and facade only when a shot calls for them. Specify visible/cutaway walls. Introduce one key light and a simple planar cast shadow. | A reverse angle preserves door position and light direction. Sketch remains readable in monochrome at phone size. |
| 8 | Add start/end blocking on a shared set for action continuity. Specify which contacts are locked during the interval. Draw sampled poses to inspect foot slide before sending to a motion provider. | Approved start and end poses can be cut to either neighbour. Interpolation that breaks a locked contact fails inspection. |

## 8. Testing strategy

**Drawings need three distinct checks.** First, geometric assertions on joints, projections, support, gaze and contact sites tell us *what* moved. Second, render fixed seeds to PNG with a pinned rasteriser. Compare decoded pixels against the committed reference PNGs, initially at native dimensions. Record any baseline mismatch before accepting a reference as a golden image. Use exact equality for the pinned environment, plus a tolerant edge-distance comparison in alternate toolchains. A shifted boot can disappear in a whole-frame average, so retain tight regions around the grip, gaze lines, pelvis joins and the V hand. Third, present reference, candidate and coloured difference side by side. The producer approves changed silhouettes as drawings and records why before updating any baseline. Golden updates run as an explicit command.

Use `node --test` for contract, geometry and orchestration tests. Render all 18 records, both construction modes, the sheet and profile lineup. Alternate seeds and call orders. Add adversarial cases for invalid enum, negative rung spacing, unknown joint, vertical camera, coincident wrist/shoulder, overly close targets, custom profile and v1 auto-grounding. Compare reference coordinates across sizes without comparing stylised wobble across seeds. Test new cameras on a ladder close-up and a wide two-person handoff. Decode a short master and inspect around cut frames, caption bounds and audio transients. A flash at the cut may be invisible to a duration check.

For paid services use saved representative responses and a local fake job that can complete late, fail after submission or lose a response. Kill and resume between reservation, job ID, download and approval. Offline tests must make zero paid calls. A separately budgeted live smoke run on onboarding and model change proves authentication, accepted dimensions, media download and alignment on a real waveform. Record actual billing and model identity. Do not expect byte-identical generated pixels from a remote service.

**Decision experiment.** Pre-register eight different intents including the matched ladder pair, child behind a rail, carrying a box, dive toward camera, floor lift, V hand and a simple neutral shot. For each, make two independent attempts per route with identical style, model, aspect and text, changing only presence of the reference. That is 32 stills, about $2.56 at the example 1080p rate. Pay this from development, separately from the per-film cap. Shuffle and hide route labels. Two reviewers score contact, viewpoint, subject count, action readability and suitability for the preceding cut. Mark first-pass acceptance, disagreements, best of two, spend and minutes *including board creation*. Provisional adoption gate: reference wins first-pass acceptance by at least 20 percentage points with no rise in fully loaded cost per accepted plate. Report counts by shot class and repeat on unseen briefs before committing. If tied, keep boards for difficult geometry and approve simple text-only shots directly. If both fail contacts, release the drawn insert or shoot a real insert.

## 9. Phased delivery

| Phase | Film the operator can actually watch | Exit decision |
|---|---|---|
| A · First afternoon cut | A 15–20 second private MP4. Open on the side-view ladder, cut to the identical climb from below, return to the side as the narrator explains the revealed contact. Use the actual PNGs as full panels, an original human voice recording or timed Polly read, manually marked captions and silence under speech. Hard cuts only. | Someone unfamiliar with the project can point to a contact that disappeared and identify the cause as a camera change. File plays through on a phone. No generator account is needed. |
| B · First generated film | Expand to one 30–45 second short, approve the timed animatic, replace a drawing with one generated plate and buy at most one moving take initially. Keep a parallel cut with the drawing for comparison. | Deliver a private upload with captions and receipt under $5 marginal cash. Inspect the actual transcode. Record producer minutes and retries. |
| C · Repeatable single-actor series | Run the route experiment, add native portrait shot solving and bounded language-to-scene repair. Ship three unseen briefs, including one non-ladder scene. | At least two of three films finish within the cash cap and 45-minute labour target, with every must-see checked. If labour dominates, simplify recurring shots before expanding models. |
| D · Continuity and languages | Recut one film in a second reviewed language. Add two-person blocking on one room set, then produce the silent parcel exchange. | A fluent reviewer signs the localised cut. Two viewers independently identify who gives, who hesitates and which object moved in the silent scene. |
| E · Character drama | One 30-second dialogue scene. Start with off-camera speech or a listening reaction. Add synchronised visible speech only when a test shot passes at delivery size. | Both roles remain identifiable across cuts, screen direction is coherent, and the producer accepts the incremental cost per finished second. Decide whether to expand or keep the explainer line. |

## 10. Risks and mitigations

| Early sign | Consequence | Action |
|---|---|---|
| Low-angle boot switches rung during motion | The reveal teaches an event that never occurred | Review the complete take against named involuntary changes. Cut on a stable image, use the drawn insert, or shoot the detail. |
| Generic text shots pass just as often | Manual board labour consumes the margin | Route simple atmosphere to text. Keep board approvals for contact, geometry and repeated setups. Track review time by class. |
| Every actor is centred, even in a reverse angle | Viewer's attention jumps or direction reverses | Lock set coordinates, camera side and gaze target. Preview adjacent shots together before spending. |
| Assembly burns in captions and the platform overlays a second copy | Two layers obscure a contact | Package a clean upload with timed sidecar by default, proof the platform preview, and label burned-caption exports separately. |
| A generator updates, rejects a ratio or changes prices | Silent framing drift or an unexpected bill | Pin settings and the rate-table revision, test a known shot at onboarding, stop when prices or outputs cannot be reconciled. Keep accepted local media. |
| A synthetic voice misreads a name or translation | The cut points to the wrong object on the wrong word | Approve audio per locale, persist byte-to-token mapping and recut from measured onsets. |
| An actor's appearance or the room changes on a reverse | The viewer infers a different place or person | Approve a small continuity pack showing wardrobe, prop dimensions, light side and one approved still. Use it and compare adjacent shots. |
| Rights, synthetic-media disclosure or factual evidence are missing | A finished master cannot responsibly be released | Bind source and licence records to each selected asset, review the destination's current policy at upload, keep a private master and substitute the disputed asset. |
| The story relies on exact physical technique | A plausible-looking drawing gets mistaken for instruction | Choose camera literacy for the pilot. For instructional commissions, a subject expert must approve the depicted technique and generated replacement before publication. |

## 11. Work items

Dependencies refer to item numbers below. The first six produce a film independently of later automation. Acceptance criteria describe observable output. Each test states how to find a failure.

**01 · Commission the camera comparison.** Write a one-page-equivalent brief with audience, viewing question, two reference records, desired duration and an accountable producer. Accept when the producer can describe the answer without mentioning the software. Test by comparing pose, prop and camera fields across both ladder records. Depends on none.

**02 · Write and record the pilot read.** Draft a short read with an audible cue before the change of angle. Record an original take and mark phrase/word onsets by listening. Accept a 15–20 second clean recording with a usable breath at the cut. Test that the script, transcript and heard words agree. Depends on 01.

**03 · Lay out the portrait panels.** Place both full reference images at their original ratio on a portrait canvas with a separate caption band. Accept when the nearer boot remains visible and there is room for two lines of type. Test both frames at actual phone viewing size. Depends on 01.

**04 · Compile a frame-accurate rough cut.** Implement the smallest local edit reader and FFmpeg invocation for two stills, hard cuts, a return shot and PCM voice. Accept a playable MP4 with the change landing on the marked word. Test the join with the preceding and following decoded frame and check duration against sample count. Depends on 02, 03.

**05 · Deliver captions and a release package.** Convert pilot marks into timed phrases, export WebVTT and package the clean master, thumbnail, title and rights inventory. Accept when a reviewer can enable captions and read the full film on a phone. Test first/last cues and an intentional two-line break. Depends on 04.

**06 · Screen the pilot.** Play the completed cut once for a viewer unfamiliar with the poses. Ask which contact changed visibility and why. Accept when they identify the camera change unaided. Test a revised cut if their answer suggests the actor moved instead. Record the response and editing minutes. Depends on 05.

**07 · Version production records.** Implement validators for brief, locale script, shot, asset, edit and release payloads, adding the optional v2 scene reader at the renderer boundary when needed. Accept references that resolve to one ID and reject invalid units or missing evidence. Test malformed and older records with actionable paths. Depends on 04.

**08 · Add resumable stage receipts.** Hash canonical inputs and tool versions, reserve a single writer and atomically install completed outputs. Accept when a renamed title rebuilds only its release package. Test interrupted writes, stale writer recovery and two concurrent invocations. Depends on 07.

**09 · Reserve and reconcile spend.** Implement a per-film USD ledger with persisted intent, reserved amount, job ID and settlement. Accept when uncertain charges consume headroom and approval cannot overdraw it. Test two competing five-second generation requests with money for only one, and crash after remote acceptance. Depends on 08.

**10 · Add Polly audio and word marks.** Request both with identical UTF-8 input and voice settings. Store originals, decoded samples and normalised onsets. Accept a real narrated sentence with an audible correctly placed cue. Test multibyte text and loss of the marks response after audio succeeds. Depends on 07, 09.

**11 · Schedule localised captions and cuts.** Attach cue IDs to occurrences in the speech marks, map spoken forms to display text and recalculate global frame boundaries. Accept a changed spoken line without leftover cues from the old read. Test repeated words, abbreviations, delayed starts and a final word followed by silence. Depends on 04, 10.

**12 · Baseline the drawings.** Pin raster settings, inventory warning output and create visual comparisons using the existing 18 approved PNGs. Accept a clean baseline or individually explained drift. Test a displaced boot and a missing V stroke to show the comparison catches local defects. Depends on 01.

**13 · Support an explicit camera.** Extract the fixed projection and preserve legacy automatic fit. Accept portrait and landscape renders that retain camera position, focal angle and subject placement across poses. Test centre-to-edge translation, distance scaling, camera aligned with world up and near-plane crossings. Depends on 12.

**14 · Make figure solving self-contained.** Move mutable joint/shape/profile/wobble state into each render, keeping legacy outputs. Accept repeatable `renderFrame`, `renderSheet` and `renderLineup` in arbitrary order. Test alternating a child, an acrobat and an adult with identical seeds before and after lineup rendering. Depends on 12.

**15 · Give contacts names and residuals.** Derive rung and rail sites once, check post-solve joint limits, attach measured surface distances and gaze error. Accept actionable figure/joint diagnostics without losing legacy warning strings. Test coincident targets, unreachable and too-close limbs, invalid spacing and a moved rung. Depends on 14.

**16 · Index the reference poses.** Annotate all 18 records with action, support, required contacts, camera sector and approved dynamic allowances. Accept retrieval of both views of the same climb while retaining one shared world pose. Test blind requests for crouching, sitting and peeking that use different wording. Depends on 12.

**17 · Extract shot intent.** Constrain a text planner to known actors, actions, cue IDs, camera families and visibility requirements. Supply deterministic parsing for a hand-authored intent. Accept an explicit manual path for unknown actions. Test ambiguous “left”, explicitly concealed hands and contradictory viewpoints. Depends on 07, 16.

**18 · Solve and repair candidate scenes.** Combine templates, named anchors and bounded camera alternatives. Apply renderer feedback with two repair rounds and locked constraints. Accept a feasible ladder shot and a useful manual handoff for an impossible one. Test that repairs preserve both feet and never increase flexibility to erase diagnostics. Depends on 13, 15, 17.

**19 · Export review and control views.** Render clean board, contour and visible object-ID layers from one projection and show adjacent shots for approval. Accept matching export dimensions and one revision-pinned selection. Test rail/hand overlap, border exclusion, a cropped required foot and stale approvals. Depends on 13, 14.

**20 · Generate and select a plate.** Implement one reference-capable image adapter plus a text-only setting. Download accepted bytes, persist failed attempts and keep separate wardrobe/style references when supported. Accept one image the producer can substitute into the pilot edit. Test throttling, rejected inputs, expired download links and lost submission responses with a fake service. Depends on 09, 19.

**21 · Animate one approved frame.** Add an image-to-video adapter with a fixed maximum duration and one explicitly budgeted retake. Accept one trimmed motion shot or a deliberate still fallback after failure. Test hand drift flagged during review, a too-short take and resumption of an existing job. Depends on 20.

**22 · Mix narration and music.** Add a rights-cleared optional bed and envelope under the spoken line. Measure integrated loudness and true peak. Accept both a clean voice stem and intelligible master. Test silence-only music, a loud transient and a locale revision that changes the fade point. Depends on 11.

**23 · Inspect and privately upload the first generated short.** Extend packaging with hash-bound approvals, disclosure decision and receipt. Produce the 30–45 second cut. Accept a private platform preview with the intended title, captions and framing under the cash cap. Test a visibility update after an already successful upload without duplicating it. Depends on 05, 09, 20, 22. Motion from 21 is optional.

**24 · Run the controlled plate comparison.** Commission the 32-image trial in section 8, blind the labels and count labour and failures by shot class. Accept a written decision to adopt, limit or abandon reference conditioning for each class. Test the scoring sheet with a deliberately swapped rung before the reviewers see experimental plates. Depends on 18, 19, 20.

**25 · Commission three unseen explainers.** Select briefs after the route comparison, track authoring and review minutes, and ship three distinct complete cuts. Accept a repeatability report against the phase C gates with actual misses included. Test one rerender after changing a single beat and confirm unaffected assets are reused. Depends on 06, 11, 18, 23, 24.

**26 · Add shared sets and two-person scenes.** Introduce v2 rooms, stable prop ownership, namespaced joints and interleaved depth sorting. Accept the parcel exchange setup with both actors in proportion and an object-only insert. Test an illegal circular anchor, two identically named local joints, and a reverse view that preserves the door. Depends on 13, 14, 15, 19.

**27 · Light the set and preserve continuity.** Add one directional light, floor shadows and an appearance sheet carried across setups. Accept two angles with consistent world light and distinguishable silhouettes. Test that changing camera side leaves the light fixed and the old ink-only golden images unchanged. Depends on 26.

**28 · Release a second-language cut.** Adapt one approved explainer with a fluent reviewer, choose a supported voice or original recording and fit cuts to local cue words. Accept a self-contained package with accurate type, audio and captions in that language. Test a longer translation and punctuation that changes phrase grouping without changing the pictured action. Depends on 11, 23.

**29 · Direct a silent exchange.** Block start and end poses, record locked contacts and cut the parcel handoff as a wide shot, detail and reaction. Accept the scene if two viewers understand the hesitation and ownership transfer without narration. Test it muted in forward sequence and compare the parcel's hand, side and height on each adjacent cut. Depends on 21, 26, 27.

**30 · Decide whether dialogue earns production.** Add per-speaker voice tracks and a listening reaction to the proven silent exchange. Budget one visible-speech experiment separately. Accept a 30-second screened scene, cost per finished second and a signed decision about further drama. Test blind speaker attribution, gaze across the cut and visible speech synchronisation if used. Depends on 25, 29.
