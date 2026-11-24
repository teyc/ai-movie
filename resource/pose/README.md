# resource/pose

Reference poses and shots for the storyboard mannequin. Each entry is a scene
record (`.json`) and its render (`.png`). Copy a record and change the pose,
profile or camera to make a new shot. The record format is described in
[`lib/pose/README.md`](../../lib/pose/README.md).

![All poses](index.png)

| Scene | Profile | What it shows | Render |
|---|---|---|---|
| [`backflip`](backflip.json) | adult | Inverted arch mid-flip. Uses flex 1.4 for the extra spine range; gaze is free. | ![Backflip](backflip.png) |
| [`balcony-lean`](balcony-lean.json) | adult | Leaning on a balcony rail with crossed forearms, looking down over the edge. | ![Leaning over a balcony](balcony-lean.png) |
| [`carrying-box`](carrying-box.json) | middle-age | Walking with a box held at the waist, leaning back against the load. | ![Carrying a box](carrying-box.png) |
| [`child-peek`](child-peek.json) | child | Child on tiptoe gripping the rail and peeking over, seen from outside and below. | ![Child peeking over](child-peek.png) |
| [`dash`](dash.json) | adult | Sprint start with a strong forward lean. Low side camera so the lean reads as a diagonal. | ![Dash](dash.png) |
| [`dive-reach`](dive-reach.json) | adult | Prone dive toward the camera with the lead hand nearest the lens. | ![Dive reach](dive-reach.png) |
| [`flying-kick`](flying-kick.json) | adult | Airborne kick with the leg coming at the lens. Strong foreshortening on the kicking leg. | ![Flying kick](flying-kick.png) |
| [`ladder-climb`](ladder-climb.json) | adult | Climbing a leaning ladder, hands and feet placed on rungs by reach targets. | ![Climbing a ladder](ladder-climb.png) |
| [`ladder-from-below`](ladder-from-below.json) | adult | The same climb seen from the foot of the ladder. Extreme foreshortening. | ![Ladder from below](ladder-from-below.png) |
| [`lifting-box`](lifting-box.json) | adult-f | Deep squat to lift a box from the floor, looking at the box. | ![Lifting from the floor](lifting-box.png) |
| [`peace-sign`](peace-sign.json) | teen | Raised V hand, looking straight at the camera. | ![Peace sign](peace-sign.png) |
| [`pointing`](pointing.json) | adult | Arm raised to point at something ahead; the gaze follows the hand. | ![Pointing](pointing.png) |
| [`rising-uppercut`](rising-uppercut.json) | adult | Rising punch with an arched body and a tilted camera. | ![Rising uppercut](rising-uppercut.png) |
| [`running-airborne`](running-airborne.json) | child | Mid-stride with both feet off the ground. | ![Running, airborne](running-airborne.png) |
| [`sitting`](sitting.json) | middle-age-f | Seated on a box, hands resting on the thighs. | ![Sitting](sitting.png) |
| [`standing`](standing.json) | adult | Neutral stance, arms relaxed, looking at the horizon. | ![Standing](standing.png) |
| [`three-point-landing`](three-point-landing.json) | adult | Crouched landing with one hand on the ground, seen from above. | ![Three-point landing](three-point-landing.png) |
| [`walking`](walking.json) | adult-f | Mid-step walk with the arms swinging opposite to the legs. | ![Walking](walking.png) |

## Body profiles

Front three-quarter view above, side view below, all at one scale.

![Body profiles](profiles.png)

## Regenerating

```sh
node lib/pose/cli.js render resource/pose --png     # needs rsvg-convert
node lib/pose/cli.js sheet resource/pose index.svg
node lib/pose/cli.js lineup profiles.svg
```

The `.svg` files this writes are ignored by git; the `.png` files are kept.
