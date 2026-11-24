---
name: screenplay
description: Turn an ai-movie story record into a screenplay of scenes and beats, each beat with what happens, its intended effect on the audience, and narration or dialogue timed to fit. Use after story-writer and before script-doctor.
---

# Screenplay

Break a `story.json` into scenes and beats. The beat list is the spine of
the film: every shot, line of narration and music cue traces back to a beat.

## Inputs

- `story.json` (from the `story-writer` skill).
- The film's style profile and target length.
- The narration mode: single narrator, character dialogue, or both.
  Default to a single narrator for storyboard films (plan section 1.1).

## Procedure

1. **Map structure beats to screen beats.** Each structure beat in the story
   becomes one or more screen beats. A screen beat is one unit of change the
   audience notices: something is revealed, decided, felt or moved.
2. **Group beats into scenes.** A new scene means a new place or a jump in
   time. Each scene gets a location, time of day and light.
3. **For each beat write:**
   - `action`: what the audience sees, in present tense, one or two
     sentences, concrete enough to draw (who, where, posture, gesture, light).
   - `effect`: what the audience should understand or feel at this moment.
   - `characters` present.
   - `spoken`: narration or dialogue, with the speaker; can be empty.
   - `cues`: the words a cut or a change should land on.
   - `targetSeconds` and `minScreenSeconds`.
4. **Time it.** Estimate spoken length at about 2.5 words per second for a
   calm narrator (adjust after a test read). Each observable change needs
   at least a second of lead and a second of resolution with no new words
   on top. If beats don't fit the target length, cut words before cutting
   pictures, then cut beats.
5. **Write two outputs**: `screenplay.json` (the record) and
   `screenplay.fountain` (a readable screenplay in Fountain plain-text
   format, for humans).

## Writing rules for storyboard films

- **Picture first, words second.** Narration adds what the picture cannot
  show (time, thought, irony); it never describes what is on screen.
- **Leave silence.** A held image with no words is often the strongest beat,
  especially at the turn.
- **One change per beat.** If a beat has two changes, split it.
- **Drawable action.** Only write what a posed figure, a prop, light, framing
  or a cut can show. Until faces exist (plan section 7b), write emotion as
  posture, gesture, distance or light, not expressions.
- **Concrete over general.** "Six o'clock, the streetlights blink on" beats
  "every evening".
- **Cues are real words** in the spoken text, chosen where a cut should land.

## Output: screenplay record

```json
{"kind": "screenplay", "version": 1, "id": "child-peek", "payload": {
  "story": "child-peek", "narration": "single-narrator", "voice": "warm, unhurried",
  "scenes": [{"id": "s1", "location": "apartment balcony, street below",
    "timeOfDay": "blue hour", "light": "warm window behind, cool street",
    "beats": [{"id": "b1", "structureBeat": "ki",
      "action": "...", "effect": "...", "characters": ["mia"],
      "spoken": [{"speaker": "narrator", "text": "..."}],
      "cues": [{"id": "watch", "word": "watch", "occurrence": 1}],
      "targetSeconds": 4.5, "minScreenSeconds": 3}]}],
  "totalSeconds": 19.5
}}
```

Fountain basics for `screenplay.fountain`: scene headings start with
`EXT.` or `INT.`; action is plain paragraphs; a character name in capitals
on its own line introduces dialogue; narration is `NARRATOR (V.O.)`;
transitions end in `TO:`. Add a `[[beat b1: effect]]` note under each beat
so the readable script keeps the beat ids.
