---
name: script-doctor
description: Review and refine an ai-movie screenplay for structure, clarity of the turn, pacing, tonal balance and humour, and length. Produces rated notes and a revised screenplay. Use after the screenplay skill and before shot-list.
---

# Script doctor

Read `story.json` and `screenplay.json` as a demanding editor would, write
notes, then apply the ones that improve the film and record why.

## Checks

Work through every check. For each problem write a note with severity
(critical, important, minor), the beat ids, and a concrete fix.

### 1. Structure and the turn
- Is the single change from the story visible on screen, in one beat?
- Does the screenplay follow the named structure, and does every structure
  beat have at least one screen beat?
- Does the final image answer or mirror the first?
- Setups have payoffs and payoffs have setups. Nothing is introduced and
  dropped.

### 2. Clarity
- Could a viewer retell the story from the pictures alone, sound off? If
  not, which beat loses them?
- Does each beat's `action` actually produce its `effect`?
- Is every character's want readable without being stated?

### 3. Pacing
- Tabulate beat durations. Flag runs of equal length (monotony), any beat
  too short to read its change (under the minimum screen time), and a turn
  that is rushed.
- The turn and the final beat usually deserve the longest holds.
- Rhythm: vary quiet and busy beats; a pause before the turn helps.
- Does the opening beat hook within its first seconds?

### 4. Balance and tone
- Plot the emotional line beat by beat (calm, curious, tense, low, warm,
  funny, moved). Flag a flat line, or a tone that swings without cause.
- Light and dark: does the film earn its ending with at least one beat of
  contrast (a doubt, a small loss, a false hope)?
- Is the tone consistent with the style profile and the story's register?

### 5. Humour
Add or sharpen humour only where the tone allows it, and never at the cost
of the turn. Tools that work in held drawings:
- **Reversal of expectation**: set up one outcome, deliver another.
- **Rule of three**: pattern, pattern, break.
- **Understatement** in narration against a big picture, or the reverse.
- **Callback**: a detail from early returns at the end.
- **Visual incongruity**: scale, position or a prop in the wrong place.
- **Timing**: the comic beat needs a held moment before it, and a short
  narration line after it, if any.
State where the laugh is and why it lands. If the tone is serious, say so
and add none.

### 6. Words
- Narration that describes the picture: cut it.
- Lines over the beat's time budget: tighten.
- Read it aloud mentally: rhythm, alliteration that trips, a last word that
  lands on the cue.

### 7. Feasibility
- Can every beat be drawn with the current mannequin and props, or with a
  diagram insert? Flag anything needing faces, fingers or effects not yet
  available, and propose a drawable alternative.
- Does the total length meet the target within 10%?

## Output

1. `doctor-notes.md`: the notes, each with severity, beats, fix, and a
   rating of whether it was applied (applied, partly, not applied: reason).
2. A revised `screenplay.json` and `screenplay.fountain`, replacing the
   previous version in place (keep it in version control, not as a copy).
3. A short summary: the three most important changes and the new total
   length.

Do not rewrite the story's change or structure without flagging it as a
critical note for the human; the doctor refines, the human decides direction.
