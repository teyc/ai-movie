# Round 3 review of the storyboard-film plan

Round 3 is the last architecture pass. It should remove the few places where
the plan would add work before it proves the child-peek micro-story, and where
the story record cannot yet demand a particular character reaction or edit.

## 1. Remove deferred paid-generation criteria from storyboard phases

**Severity — critical**

Section 1.1 makes the near-term product static boards, parallax, voice, music
and captions. It explicitly defers paid generation and cost bookkeeping.
Section 11 still defines phase C as "within the cash cap" and says to exclude
provider waiting from the 45-minute labour target. For phases A to D the plan
has no paid provider work, so the cash cap is inherited Appendix A material,
and a provider-wait exclusion has no meaning. This would make phase C harder
to start or cause the exit test to be misread as a generation test.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
-| C. Repeatable storyboard films | Description-to-scene with repair; three new stories, including one in a different style profile | Two of three films within the cash cap and a 45-minute labour target, counting all active producer minutes from brief to private master (rejected takes and manual repair included, provider waiting excluded) from the labour ledger. Report median and maximum by stage and the number of shots needing manual blocking. Swapping out a hard brief counts as a failure |
+| C. Repeatable storyboard films | Description-to-scene with repair; three new stories, including one in a different style profile | Two of three local storyboard films within a 45-minute active-producer labour target, counting all work from brief to private master including rejected boards and manual repair. Report median and maximum by stage and the number of shots needing manual blocking. Swapping out a hard brief counts as a failure |
@@
**Comprehension counts in phase C.** Before each phase C film, write the
audience question (for a story: what was the turn, and what did the main
character want) and the visible evidence a correct answer would cite.
After one normal phone playback with the intended audio and captions, a
fresh target viewer gives their answer and says which image explained it;
the unaided response is recorded. A film counts toward the two required
-passes only if it meets the cash, labour and comprehension criteria
+passes only if it meets the labour and comprehension criteria
 together. Time for the check and any recut is counted as labour. One viewer
 can expose a failed explanation; a pass is reported as a pilot observation.
## 2. Make character expression a real pose and shot input

**Severity — critical**

Phase A is a child who peeks over a rail, "sees something, and their face
changes." Section 7b defines a face on the head oval, but the scene record
v2 only carries joint poses and `look`; it has no expression field or reaction
beat. A change in expression could be left to the human or to an ambiguous
off-screen change, but it must be reproducible between boards and over
parallax. The existing mannequin is deliberately faceless, while the micro-
story depends on the face being the evidence of emotion.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
 | character sheet | id, name, role, body profile, silhouette shapes, garments as forms, value per garment, signature props, face option, turnaround hashes (section 7b) |
+| expression | character id, named expression, intensity, onset frame or cue, duration, mouth and brow feature offsets |
@@
 | Face | Simple features (brow, eyes, nose, mouth) in a fixed style, built on the head oval and its face-direction lines |
 | Hatching | Whether and how the character is shaded with hatching, following the style profile |
 | Turnaround | Front, three-quarter, side and back renders from the mannequin with the sheet applied, plus one action pose; stored by hash as the visual reference |
+
Use a small expression vocabulary rather than free-form prose:
`neutral`, `concern`, `surprise`, `fear`, `relief`, `amusement`, `sadness`
and `anger`. An expression record belongs to a character, not a whole scene.
It is resolved after gaze and head transforms, because the brow and mouth
must remain attached to the turned head. An expression change has an onset
and duration tied to the voice cue or a picture anchor. A missing onset
blocks the reaction board; it may not be inferred from a generic "face
changes" line.
## 3. Treat phase A as one readable turn, not four free-shot tests

**Severity — important**

The phase A description names child peek, reaction and parallax, but it does
not state the required cut sequence or the evidence that differentiates
the four boards. Three or four boards could be repeated images rather than
a story: wide reveal, child, view, reaction. It should define a minimum
editorial beat and require a one-sentence written turn before implementation.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b docs/planning/PLAN_FOR_AI_MOVIE.md
@@
| A. First micro-story (human decision, 2026-11-24) | 15 to 20 seconds, three or four boards, built from the existing child-peek scene: a child peeks over a balcony rail, sees something, and their face changes. Story to screenplay beats to boards, narrated (human read), captions, one parallax drift, hard cuts. Tests the plumbing and the screenplay-to-beats step together | Shown silently first on a phone: a fresh viewer says what happened. Then voiced: they can retell the moment and say what the child felt |
| A. First micro-story (human decision, 2026-11-24) | 15 to 20 seconds, three or four boards: (1) child and rail establish the obstacle, (2) reveal what lies beyond the rail, (3) child reaction shows what it means, and (4) optional side detail or hold. The sequence, target emotional change and any spoken line are frozen before blocking | Shown silently first on a phone: a fresh viewer says what the child saw and that it mattered. Then voiced: they retell the same turn and name the child's feeling. A repeated wide view or an undifferentiated reaction is a failed cut, even if each board renders cleanly |

## 4. Test character identity and parallax over sequences

**Severity — important**

Section 9 tests individual SVG fixtures and hand-entered warning counts, but
the final storyboard film depends on identity and movement across frames.
Character clothing, features and hatching can vary shot to shot even when
each board itself is valid. A cutout parallax move can expose gaps or detached
edges only after frame 20. A static golden test cannot catch those defects.

```diff
--- a/docs/planning/PLAN_FOR_AI_MOVIE.md
+++ b/docs/planning/PLAN_FOR_AI_MOVIE.md
@@
-**Drawings.** Golden SVG text for all reference scenes, frames, sheet and
+**Drawings.** Golden SVG text for all reference scenes, frames, sheet and
   line-up at a fixed seed: exact comparison, since rendering is deterministic.
@@
   folder scan may discover files but does not decide coverage.
+  Character fixtures render every approved character sheet in front, side
  and back views and in the story poses. Compare silhouette, garment
  attachment, feature placement and value with the approved turnaround.
  Parallax fixtures render every frame of a permitted move and fail on newly
  exposed gaps, detached cutout edges or a visible discontinuity in the
  story-bearing set detail.

## Questions the plan still cannot answer

- Which expression and reaction on the child proves that the unseen subject
  beyond the rail matters, rather than merely showing surprise?
- What proportion of storyboard-film labour is story and screenplay work
  before the first board, and does it stay below the 45-minute target?
