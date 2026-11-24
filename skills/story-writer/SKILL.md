---
name: story-writer
description: Write or develop a short story for an ai-movie storyboard film. Picks a plot structure from a catalogue (hero's journey, kishōtenketsu, man in a hole and others), fits it to the film length, and writes the story record. Use before the screenplay skill.
---

# Story writer

Turn an idea, a premise or a vague wish ("something warm about a kid waiting
for her dad") into a **story record** that the `screenplay` skill can break
into scenes and beats.

## Inputs

- The idea, from the human.
- Target length in seconds, delivery shape, audience, and the style profile
  if already chosen. Ask only for what is missing and matters; otherwise
  choose sensibly and say what you chose.

## Procedure

1. **Find the change.** Every story, however short, turns on one change:
   in a situation, a relationship, or what a character knows or feels. Write
   it in one sentence before anything else ("Mia stops waiting and starts
   celebrating"). If you cannot, the idea is a situation, not a story yet.
2. **Size it.** Use the length table below to choose how many beats the
   story can carry. A 20-second film has room for one turn, not a journey.
3. **Pick two or three candidate structures** from
   `references/plot-structures.md` that fit the change and the length.
   Sketch the story in each in two or three lines, then choose one and say
   why. Do not force a long structure onto a short film: compress it to its
   essential beats, or pick a shorter structure.
4. **Define the characters.** For each: what they want in this story, what
   stands in the way (which can be nothing, in kishōtenketsu), one visible
   trait an audience can read in a sketch, and a body profile from
   `lib/pose/profiles.json` (toddler, child, teen, adult, adult-f,
   middle-age, middle-age-f, old, old-f, long-torso, long-legs).
5. **Set the world.** Location, time of day and light (dawn, golden hour,
   blue hour, night, interior lamp), and one or two concrete details that
   make it specific.
6. **Choose the tone and a style profile** (plan section 7a.6), or propose
   one if none exists. Tone includes where the humour comes from, if any.
7. **Write the story record** (below) and a plain-language synopsis of no
   more than 120 words.

## Length guide

| Length | Beats | Shape that fits |
|---|---|---|
| 15 to 20 s | 3 to 5 | One turn: kishōtenketsu, setup and punchline, single reversal |
| 30 to 45 s | 5 to 8 | Man in a hole, a small quest, a reveal |
| 60 to 90 s | 8 to 14 | Compressed three acts, story circle, a short hero's journey (call, threshold, ordeal, return) |
| 2 to 5 min | 15 to 40 | Full three acts, Save the Cat, hero's journey |

## Output: story record

```json
{"kind": "story", "version": 1, "id": "child-peek", "payload": {
  "logline": "One sentence: who wants what, and what changes.",
  "change": "The single turn the story is about.",
  "structure": {"name": "kishotenketsu", "why": "Four beats, no villain, fits 20 seconds"},
  "structureBeats": [{"name": "ki", "summary": "..."}],
  "characters": [{"id": "mia", "profile": "child", "wants": "...", "obstacle": "...",
                  "visibleTrait": "...", "characterSheet": null}],
  "setting": {"location": "...", "timeOfDay": "blue hour", "light": "...", "details": ["..."]},
  "tone": {"register": "warm, gently funny", "humour": "reversal of expectation"},
  "styleProfile": "id or inline profile",
  "audience": "...", "targetSeconds": 20, "delivery": {"width": 1080, "height": 1920, "fps": 30},
  "synopsis": "Up to 120 words."
}}
```

Write it to the project or example folder as `story.json`.

## Rules

- Visual first: the story must be tellable in held drawings with a narrator.
  Prefer changes an audience can see in a pose, a light change or an object.
- Current constraint: mannequins have no facial features until the
  hands-and-faces decision (plan section 7b), so carry emotion in posture,
  gesture, distance, light and framing, not in expressions.
- One story, one change. Cut subplots before the screenplay stage.
- Name the structure you used; the script doctor checks against it.
