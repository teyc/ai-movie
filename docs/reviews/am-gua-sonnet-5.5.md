# Review of am-gua (neck depth tie-break), Sonnet 5.5

Scope: the `headIt`/`neckIt` lines before `items.sort` in `lib/pose/mannequin.js`.
Rendered old golden vs new for frame-dash, balcony-lean, flying-kick,
ladder-from-below, rising-uppercut and viewed them side by side.

Verdict: correct and narrow. No high findings.

## Answers

- **Several figures?** No. `draw()` runs once per shot and `fig(sh.o)` builds one
  figure, so `items` holds one head blob and one neck capsule. The line-up
  (`mannequin.js` ~1422) calls `draw()` once per profile, so `items.find` never
  sees a second head. Note for the future: a multi-figure `draw()` would make
  `find` pick the first figure's head and neck; the rule would then need to run
  per figure.
- **Camera views.** The rule only fires when the neck is nearer than the head
  (`neck.z < head.z`) and moves it to the head's depth, so it tucks under the
  head. That holds from below (flying-kick, ladder, uppercut), from behind
  (head is the near item, no-op or still correct), and head thrown back. The
  neck joint is inside the skull, so "neck behind head" is true in every view.
- **Can raising neck z hide it behind something it should be in front of?** Only
  items with z strictly between old and new neck z are affected, a gap of about
  0.004 in dash. In the five changed scenes I saw no regression. Dash: the jaw
  line is now clean and the neck stub ends under the chin. Flying-kick: the neck
  line now stops at the jaw. Uppercut: tiny head, a small jaw cleanup.
  Balcony-lean and ladder: no visible change at 700 px. In theory a chest or
  shoulder blob in that gap could now cover the neck's lower end, but the neck
  base sits inside the chest top, so that reads as correct. A far-side hand or
  prop bar sitting between the two z values would flip to in front of the neck;
  that is also plausible. I did not look at the -construction variants.

## Findings

1. **Medium, test.** Nothing pins the rule except the frame-dash golden, which
   only says "drawing changed". A later reorder of `LIMBS` or a change to the
   `z` formula could bring the bug back, and the same golden churn would hide it.
   Without new public API: render the dash scene and assert, in the SVG, that the
   neck capsule path comes before the head `pap` blob path (index compare on the
   output string). It is fragile to markup, so it is optional. The review
   goldens plus a LESSONS line are acceptable if you prefer.
2. **Low, robustness.** The tie case (`neck.z === head.z`) relies on insertion
   order (LIMBS before BL) plus stable sort. That is guaranteed in Node 22 but
   implicit. Setting `neckIt.z = headIt.z + 1e-6` states the intent and survives
   a reorder. The comment should also say "equal z draws the neck first".
3. **Low, future.** `items.find(it => it.k === 'skull')` couples to the LIMBS
   name `skull`. Fine today (the only such entry, lines 490 and 495). Add a
   `neck: 1` flag to the LIMBS entry if more are added.
4. **Low, interaction with am-e-board-1wg.17.** Props (`bar`, `box`, `wheel`, `lamp`)
   share the same sort. A bar with z between the neck's and head's depth would
   now draw in front of the neck where before it was behind. Not seen in any
   fixture, including the prop-* scenes in the other bead.

## Better narrow fix?

A depth bias is the narrowest option and what is there. Alternatives (drawing
the neck in a pass before all items, or using the head's near-side z) change
more behaviour, for example hands in front of the neck, and are not justified.
Using `Math.max` is equivalent. No change needed beyond finding 2.

## Side effect to know about (my own, reviewer)

While looking for a render command I ran `node lib/pose/cli.js render
resource/pose <dir> --png`. That ignores the directory argument and rewrote the
tracked `resource/pose/*.png` files (16 files; the SVGs are byte-identical).
This is a PNG re-encode difference, not a drawing change, but those PNGs now show
as modified. I could not run `git checkout -- resource/pose/*.png` (blocked), so
please restore them with `git checkout -- resource/pose/*.png` (only those
paths) before committing. Also note that the CLI `render` does not take an
output directory, which is worth a bead if that was unexpected.

Also: `node test/golden-review.js` was run, so `test/review/index.html` is
regenerated.

## Resolution (author, 2026-11-25)

| Finding | Resolution |
|---|---|
| Medium: only the frame-dash golden pins the rule | Accepted as is: the five changed goldens pin it, and a markup-order assertion would be fragile. The general fix for touching parts belongs with the visibility check, am-e-board-1wg.9 (lesson logged). |
| Low: tie relies on stable sort | Kept: Node's sort is stable and the comment states the intent. |
| Low: `k === 'skull'` couples to the LIMBS name | Kept: there is one neck entry; revisit if more appear. |
| Side effect: resource/pose PNGs rewritten by the reviewer's render run | Reported to the human; only the PNGs of frames whose drawing changed will be committed. |

After the review, the human pointed out the chin still jutted. The cause was the pose, not code: dash.json gave no `look`, so the head bent 40 degrees back (its limit) to face the horizon. dash.json now looks at the track 1.8 m ahead (bend 10 degrees). Scene data only; no code change after review.
