# Storyboard film bead review

Reviewed 94 open records in the 103-record tracker snapshot, including grouping epics. The nine closed records supplied context. Each row gives one proposed change.

## 1. Beads that need more information

| Severity | Beads | Finding and fix |
|---|---|---|
| High | am-mcd.2, am-mcd.4 | The pilot compiler promises cue-aligned cuts, but sh3 in `examples/child-peek/shots.json` has a descriptive beat and a null frame, and sh1 anchors to “watch” after the narration begins. Assign the editor to resolve sh3 against the take, specify how the first interval starts at zero, and require a contiguous edit through the last frame. |
| Medium | am-00y.11 | The character-sheet task says the mannequin has “no clothed form”, contradicting the clothed base in AGENTS.md and its own unchanged-goldens requirement. Preserve the base drape and specify which garment details the character sheet adds. |
| Medium | am-mcd.5, am-mcd.15 | Packaging requires every asset to be owned, while sourcing explicitly allows CC0 effects. Have the rights list distinguish producer-owned recordings from CC0 recordings and retain evidence for either. |
| Medium | am-e-pub-5yn.1, am-mcd.13 | The platform decision recommends 30–45 seconds while the Phase B brief specifies 60–90 seconds. State which film each duration applies to before approving the delivery brief. |
| Medium | am-e-contract-tnm.1 | The schema task requires a plan-only v2 example and lists cue fields that differ from the example shot array’s typed speech and picture anchors. Name a standalone v2 fixture and spell out the migration and accepted anchor variants. |
| Medium | am-e-contract-tnm.4 | A lost submission acknowledgement must remain unresolved, yet acceptance says every crash after submission resumes by polling. Specify separate restart outcomes for persisted and missing job IDs. |
| Low | am-e-script-5t7.1, am-mcd.11 | The format decision places the dialogue scene in D, while its milestone title and label say E and the plan’s phase table says D. Align the decision and milestone on one phase. |

## 2. Wrong dependencies

| Severity | Beads | Finding and fix |
|---|---|---|
| High | am-mcd.3, am-mcd.4, am-e-asm-qgh.5, am-00y.12 | The pilot boards must write a manifest whose definition follows the compiler, which itself waits for those boards. Define the manifest and a hand-authored fixture before the boards and exporter, leaving move rendering downstream of the compiler. |
| High | am-mcd.4, am-e-asm-qgh.5, am-mcd.5, am-mcd.6 | Packaging and the drift can finish independently, so the screening may play the packaged static rough cut. Gate packaging on the drifted master and screen that package by digest. |
| High | am-mcd.15, am-mcd.3, am-mcd.4 | The car-setup task must prove the scooter sound resolves on the picture cut, but both finished boards and the mixer wait on it. Close the sourcing and cue specification first and assign the synchronised playback check to the compiled pilot. |
| High | am-mcd.13, am-e-asm-qgh.3, am-e-voice-fi2.2, am-e-voice-fi2.3 | The film permits a human read, yet both captions and the animatic transitively require selecting and implementing TTS. Make both consume a common timed-voice record and require the adapter only for a synthesised read. |
| High | am-mcd.13, am-00y.12 | B requires reusable depth-layer export, but its milestone can pass with a second hand-separated film. Make B consume the exporter’s manifest for at least one moving shot. |
| Medium | am-e-board-1wg.12, am-00y.5, am-00y.6 | The review sheet promises continuity and style flags before either producer is required. Define their result format first and gate the integrated sheet on representative output from both checks. |
| Medium | am-e-contract-tnm.7, am-mcd.4, am-e-asm-qgh.5 | The restore bead can become ready before there is a child-peek compiler or layered cut to rebuild. Gate the actual restore demonstration on the assembled pilot and its selected assets. |
| Medium | am-e-gen-cnl.1, am-e-gen-cnl.4, am-e-gen-cnl.9, am-mcd.7 | The experiment waits for a final model decision it is supposed to inform, demands structural-control export before a failure warrants it, and never gates the generated film. Select trial candidates first, make structural control conditional, and require the experiment verdict before producing the selected route. |

## 3. Duplicate or overlapping ownership

| Severity | Beads | Finding and fix |
|---|---|---|
| Medium | am-mcd.15, am-mcd.3, am-e-board-1wg.17 | All three can edit sh1 or sh3 to show the bay and the light. Give the prop bead isolated fixtures, the story bead the shot specification, and the board bead the final scene placement. |
| Medium | am-e-script-5t7.3, am-00y.5 | Both implement an adjacent-shot screen-direction check. Give one bead the rule and its pass/fail fixtures, and have the other call it. |
| Medium | am-e-voice-fi2.7, am-e-voice-fi2.4, am-e-asm-qgh.1 | The library and music tasks both claim placement or ducking, while assembly also handles the bed. Have the library resolve assets, the mix own gain and cue timing, and assembly consume the resulting stem. |

## 4. Acceptance criteria that can pass with a broken result

| Severity | Beads | Finding and fix |
|---|---|---|
| High | am-e-asm-qgh.1 | “Both phase B cuts” are unspecified and the actual parallel generated cut belongs to E. Rebuild a named storyboard fixture offline, measure its loudness and peak, and verify a selected-take swap invalidates only final approval. |
| Medium | am-00y.12 | Flattening at zero offset cannot expose missing artwork hidden under a figure. Specify a displaced foreground or exposed-background fixture and check the newly visible region against complete background art. |
| Medium | am-e-board-1wg.12, am-e-asm-qgh.3 | A stale board hash and a list of approved board hashes can both pass when the wrong voice, captions or edit timing plays. Pin the timed animatic inputs and demonstrate that a timing-only change reopens animatic approval. |
| Medium | am-e-gen-cnl.7 | “High precision” on known-bad stills cannot reveal false alarms on good stills. Include labelled good and bad examples and agree on the required precision and minimum detected defects before scoring. |
| Low | am-e-script-5t7.5 | Its only acceptance case depends on street props still being unimplemented. Use a fixed capability-list fixture with one missing and one supported item, so the check survives the prop work. |
| Low | am-mcd.14 | A decision comment can satisfy acceptance without running the promised audition. Require the predeclared question, both cut IDs, viewing order, responses, minutes and resulting decision in the record. |

## 5. Missing Phase A or B work

| Severity | Beads | Finding and fix |
|---|---|---|
| High | am-mcd.3, am-mcd.15, am-e-script-5t7.3 | The correction calls for one bright headlight, but sh3’s current must-see still asks for plural headlights and toes at the frame edge while the board task specifies a foreground shoulder. Assign reconciliation of the final sh3 must-see list before rendering and review that exact list. |
| Medium | am-mcd.13, am-e-voice-fi2.7, am-e-script-5t7.3 | B’s film lists four writing skills and the library expects a sound list, but no B deliverable produces that list or checks narration against picture or sound, the escape recorded in LESSONS.md. Assign the existing sound-design step to the film and trace sensory claims to a shot’s must-see or must-hear evidence before mixing. |
| Medium | am-mcd.3, am-mcd.6, am-e-board-1wg.12 | A calls for a repeatable phone review before the reusable review sheet is ready. Assign a shared pilot review record with crop, display size, distance, duration, caption band, sound state and per-shot results, then reuse it in B. |

## 6. Deferred scope appearing in earlier phases

| Severity | Beads | Finding and fix |
|---|---|---|
| High | am-00y.13, am-00y.15, am-mcd.13 | A Phase B decision can turn a required P1 character task into an image-model adapter, placing generation on the first storyboard film’s path. Give B an approved drawn fallback and route any model implementation to E. |
| Medium | am-e-gen-cnl, am-e-gen-cnl.3, am-e-gen-cnl.4, am-e-gen-cnl.5, am-e-gen-cnl.6, am-e-gen-cnl.7 | The generation epic is P2 without a deferred label, and five deferred children retain B, C or D labels. Align phase and deferred metadata across the generation branch so earlier-phase queries return the intended work. |
