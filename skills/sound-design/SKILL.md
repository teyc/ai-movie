---
name: sound-design
description: Design the sound for an ai-movie storyboard film (room tone, ambience, spot effects, foley, music placement, J and L cuts, silence, perspective) and write sound.json, anchored to the shot list. Use after shot-list and before voice recording and the mix; also use when a story point depends on something heard rather than seen.
---

# Sound design

Static boards show very little movement, so sound does much of the work: it
tells the viewer what is happening offscreen, where and when we are, what is
moving, and that two shots are the same place. The output is `sound.json`, a
list of sounds per scene and shot, which the sound library resolves to files
and the mix places under the narration.

## Inputs

- `screenplay.json`, `shots.json`, `story.json` (setting, time of day, tone).
- The style profile (its editing rhythm and key often suggest how dense or
  sparse the sound should be).
- The sound library tags (`am-e-voice-fi2.7`), if it exists yet.

## The layers

| Layer | What it is | Rule of thumb |
|---|---|---|
| Narration or dialogue | The spoken words | Always the clearest thing; nothing featured sits on a cue word |
| Room tone | The quiet sound of one place with no one making noise: air, hum, distant hiss | One per location, continuous across every cut in that location, never digital silence |
| Ambience | The life of the place: traffic, birds, wind, a neighbour's TV | Sets time of day and mood; changes only when place or time changes |
| Spot effects | Specific events: a door, an engine, a streetlight buzzing on | Each one has a story reason and an anchor |
| Foley | Sounds performed in sync with visible action: footsteps, cloth, hands on a rail | Only for contact the viewer can see, at the moment it happens |
| Music | The bed | Enters, swells and leaves on story beats, ducked under speech |

## Procedure

1. **Read the screenplay and shot list together.** Mark every story point
   that depends on hearing something, especially anything the narration
   *claims* about a sound. If a line says "she knows the sound of", the film
   must make that sound.
2. **Per location, choose room tone and ambience.** Same place, same bed
   across cuts: a jump in room tone tells the ear the place changed.
3. **Per beat, write what must be heard** (`mustHear`), in the same way the
   shot list writes `mustSee`. Prefer one featured sound per shot; two
   featured sounds at once cancel each other out.
4. **Use offscreen sound to plant and pay off.** A sound heard before its
   source is seen creates expectation; changing what the sound turns out to
   be is a cheap, fair twist.
5. **Choose the sound edits:**
   - *J cut*: the next shot's sound starts before its picture, which pulls
     the viewer forward (an engine heard before the headlights appear).
   - *L cut*: a sound carries on past the cut, which lets a moment linger.
   - *Sound bridge*: one continuous sound across a change of place or time.
   - *Hard sound cut*: the sound changes exactly on the picture cut, for a
     reveal or a shock.
6. **Set the perspective.** Hear from the point of audition: usually the
   character the shot belongs to, otherwise the camera. A distant sound is
   quieter, duller (less treble) and more reverberant; a point-of-view shot
   hears what the character hears.
7. **Place silence deliberately.** Dropping the ambience to room tone for a
   beat before the turn makes the turn land. Silence still has room tone
   underneath.
8. **Place the music.** Say where it enters, where it lifts and where it
   ends, and whether it plays under the narration or answers it. In a short
   film, music that starts late usually lands harder.
9. **Set levels as tiers, not numbers:** narration, then the featured effect,
   then ambience, then room tone. The mix turns tiers into gain, with
   loudness at -16 LUFS integrated and peaks at or below -1 dBTP.
10. **Check for phone speakers.** They lose almost everything below about
    150 to 200 Hz. A rumble won't read; give each important sound its
    identity in the mid and high range (an engine's whine, not its throb).
11. **Run two checks:**
    - *Eyes closed*: listening with no picture, can you follow where you are
      and what changed?
    - *Sound off*: does the picture still work? If it doesn't, either the
      sound is doing a job the picture should share, or the film should
      assume sound on and say so in the brief.
12. **Source each sound** by library tag. Use owned recordings or CC0 files,
    each with a provenance record. Never download without the producer's
    approval, and never use a sound without provenance.

## Choosing, quickly

| Story needs | Usually |
|---|---|
| Where and when are we | Ambience with a time-of-day marker (birds settling, streetlights, distant traffic) |
| Something approaching | An offscreen spot effect growing louder, started as a J cut |
| A reveal | A hard sound cut, or a sound that changes character on the cut |
| A held feeling | An L cut, or the ambience thinning to room tone |
| The turn | A beat of near-silence just before it |
| Comedy | Precise timing: a small sound after the pause, not on it |
| Continuity across a reverse | The same room tone and ambience, panned or filtered for the new side |
| A character's presence | A recurring sound motif (a jingle of keys, a particular engine) |

## Output: sound-design record

```json
{"kind": "sound-design", "version": 1, "id": "<film>", "payload": {
  "shots": "<film>",
  "locations": [{"id": "...", "roomTone": "<tag>", "ambience": ["<tag>", "..."]}],
  "music": {"bed": "<tag>", "enter": {"anchor": "..."}, "lift": {"anchor": "..."}, "end": {"anchor": "..."}},
  "sounds": [{"id": "fx1", "shot": "sh3", "layer": "spot|foley|ambience",
    "what": "...", "tag": "<library tag>", "tier": "featured|support|bed",
    "anchor": {"kind": "speech|picture", "cue": "...", "beat": "...", "offsetFrames": 0},
    "edit": "j-cut|l-cut|bridge|hard", "perspective": "who hears it, how far",
    "mustHear": true, "reason": "..."}],
  "checks": {"eyesClosed": "...", "soundOff": "..."}
}}
```

## Worked example: child-peek ("Even Better")

- **Location** `balcony-evening`: low city room tone; ambience of distant
  traffic and a few birds settling (blue hour), continuous under all five
  shots, so the cuts feel like one place.
- **sh1** spot: the streetlight ticking and buzzing on, timed to its flicker.
  It marks dusk, and it's the light the headlights will later round.
- **sh2** foley: Mia's fingers tapping the metal rail, a small sound of
  waiting. It keeps clear of the cue word "car".
- **sh3** spot, J cut: an engine starts offscreen, screen-left, about half a
  second before the cut. It's mid-range and ambiguous enough to be Dad's car,
  and it grows as the single light rounds the corner.
- **sh4** hard sound cut: on the cut, the engine resolves into a scooter's
  higher two-stroke whine and a brake squeak. "Not Dad." follows the squeak,
  not the cut.
- **sh5**: the scooter cuts out; a beat of room tone only; then the music
  bed, which has been silent until now, lifts under "Even better." and holds
  to the end.
- **Checks**: with eyes closed, you hear evening, waiting, something coming,
  something else arriving, then delight. With the sound off, the empty
  parking bay in sh1 and the single headlight in sh3 carry the
  set-up (am-mcd.15).

Next step: the sound library resolves each tag to a file with provenance,
and the mix (`am-e-voice-fi2.4`) places the sounds by their anchors.
