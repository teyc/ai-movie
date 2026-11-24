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
   - `spoken`: narration or dialogue, with the speaker and its reading notes
     (see Reading notes below); can be empty.
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

## Reading notes

The read decides whether a line lands, and a TTS voice or a human reader
can only follow what is written down. Write the notes in two parts.

**Voice direction, once per film** (`voiceDirection`): who the narrator is
(age, manner, relationship to the story), accent, register, pitch, pace,
distance from the mic, and what to avoid. Check the direction against the
style profile and the tone in the story record.

**Delivery, per spoken line** (`spoken[].delivery`):
- `intent`: what the line does for the listener (sets a scene, confides,
  corrects, lands a joke).
- `emphasis`: the word or words to lift. Usually one or none.
- `inflection`: rising, falling or flat, and where. Statements fall. In
  Australian and some other accents, guard against a rising end on
  statements unless it's wanted.
- `pace`, and `startAt`: seconds from the start of the shot.
- `pauses` inside the line, each with its length and whether a breath fits.
- `breaths`: where the reader breathes. Breathe at the start of a line, at
  a full stop with a gap of about 0.4 s or more, and silently through
  wordless beats. Never breathe inside a phrase that holds a cue word.
  Mark a breath as audible only when it carries meaning (a gasp, the start
  of a smile).
- `marked`: the line with `(breath)` and `|` (a pause without a breath)
  written in, so it can be read at a glance.

Comedy and turns depend on timing: say where a line sits relative to the
sound or picture event it follows ("after the brake squeak, not on the
cut"). In the Fountain file, put the delivery in a parenthetical and the
timing in a `[[note]]`.

**For TTS**, generate each line as a separate request, with a style prompt
built from the voice direction plus that line's intent, inflection and
pace. Place each line at its `startAt`, so the pauses between lines are
exact silence (over room tone) rather than the model's guess. Inside a
line, turn `|` and short pauses into the model's pause tags. Keep audible
breaths only where the notes ask for them.

## Output: screenplay record

```json
{"kind": "screenplay", "version": 1, "id": "child-peek", "payload": {
  "story": "child-peek", "narration": "single-narrator", "voiceDirection": {"who": "...", "accent": "...", "register": "...", "pitch": "...", "pace": "...", "mic": "...", "avoid": ["..."]},
  "scenes": [{"id": "s1", "location": "apartment balcony, street below",
    "timeOfDay": "blue hour", "light": "warm window behind, cool street",
    "beats": [{"id": "b1", "structureBeat": "ki",
      "action": "...", "effect": "...", "characters": ["mia"],
      "spoken": [{"speaker": "narrator", "text": "...", "delivery": {"marked": "(breath) ... | ...", "intent": "...", "emphasis": ["..."], "inflection": "...", "pace": "...", "startAt": 0.8, "pauses": [{"after": "...", "seconds": 0.5, "breath": false}], "breaths": ["..."]}}],
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
