---
name: shot-list
description: Turn a doctored ai-movie screenplay into a shot list (découpage), choosing for each beat the shot size, angle, lens, composition, depth layers, tonal key, light, parallax move and continuity, inside the film's style profile. Use after script-doctor and before scene blocking.
---

# Shot list

The director and cinematographer's job: decide how each beat is seen. The
output is `shots.json`, one entry per appearance on screen, which scene
blocking turns into boards.

## Inputs

- `screenplay.json` (doctored), `story.json`.
- The style profile (plan section 7a.6) and character sheets if they exist.
- The pose library (`resource/pose/`) and shot recipes, as starting points.

## Procedure

1. **Read the whole screenplay first** and mark the turn, the final image,
   and any beat that needs a reveal or a reaction.
2. **Plan the sequence before single shots:**
   - Where the establishing shot is, and how shot sizes progress (usually
     wide to close as information narrows).
   - The axis for each scene (the line between subjects or along the
     action) and which side the camera stays on.
   - Where the eye will be at each cut, so the next shot puts its subject
     near there or deliberately elsewhere.
3. **For each beat choose the cheapest intelligible shot:** a staged scene,
   a reuse of an earlier setup, an insert, a point-of-view shot, or an
   authored diagram. Split a beat into two shots only if one picture cannot
   carry its change.
4. **For each shot record** (plan sections 5.1 and 7a.1): size, angle, lens
   feel, composition (rule, subject placement, headroom and lead room),
   depth layers (foreground, midground, background), tonal key, light
   motivation, movement (`hold` or a `parallax` drift or push-in with
   direction, amount and duration), continuity (axis, camera side, who looks
   at what, screen direction), must-see and may-hide lists, the beat and cue
   it is tied to with any offset, the reference pose or recipe to start from,
   and one reason sentence.
5. **Check the style profile.** Prefer its values; explain any break.
6. **Check the grammar**: no accidental 180-degree crossing; eyelines that
   match across cuts; size jumps big enough to read as intentional; the turn
   gets a distinct shot; the final image rhymes with the first.
7. **Check the timing**: shot durations sum to the screenplay's beats; no
   shot is shorter than the time a viewer needs to find its must-see element.

## Choosing, quickly

| Beat needs | Usually |
|---|---|
| Where are we | Wide or extreme wide, eye level or high, still or slow drift |
| Who is this, what do they want | Medium to medium close-up, eye level or the character's height |
| A detail matters | Insert or close-up, short hold |
| A reaction or feeling | Close-up or medium close-up held longer; for mannequins, a posture change |
| What a character sees | Point of view from their eye height and angle |
| Smallness, isolation | High angle, wide, lots of negative space |
| Power, awe, threat | Low angle, wider lens, closer |
| Tension | Tighter framing, longer lens, low-key, unbalanced composition |
| Calm, warmth | Balanced composition, soft motivated light, gentle drift |
| A reveal | A cut to a new viewpoint, or parallax that uncovers it |

Parallax moves (plan section 7a.3): a slow push-in on emotion, a lateral
drift for place, a counter-drift to make a foreground element slide past.
Keep moves small; near layers move more than far ones.

## Output: shots record

```json
{"kind": "shots", "version": 1, "id": "child-peek", "payload": {
  "screenplay": "child-peek", "styleProfile": "...",
  "axes": [{"id": "street-A", "between": ["balcony", "street"]}],
  "shots": [{"id": "sh1", "beat": "b1", "anchor": {"kind": "speech", "cue": "watch", "offsetFrames": 0},
    "seconds": 4.5, "size": "wide", "angle": "low", "lens": "normal",
    "composition": {"rule": "thirds", "subject": "upper-right", "headroom": "generous"},
    "layers": {"fg": "...", "mg": "...", "bg": "..."},
    "key": "low-key", "motivation": "...",
    "move": {"kind": "parallax", "type": "push-in", "amount": 0.06, "seconds": 4.5},
    "continuity": {"axis": "street-A", "cameraSide": "street", "looks": [{"who": "mia", "at": "street-left"}]},
    "mustSee": ["..."], "mayHide": ["..."],
    "startFrom": {"pose": "child-peek"}, "reason": "..."}]
}}
```

Next step: scene blocking turns each shot into a scene record and a board
(plan section 7).
