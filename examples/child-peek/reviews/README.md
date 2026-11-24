# Phone reviews: child-peek

One record per review, so reviews can be compared over time: the board
reviews in phase A (am-mcd.3), the screening (am-mcd.6), and later the
review sheet (am-e-board-1wg.12) reuses the same format.

Copy `template.json` to `YYYY-MM-DD-<what>-<reviewer>.json` and fill it in:

- **shown**: what was played, with the digest of each file, so a later review
  knows it was looking at the same thing.
- **display**: the conditions. Phone or phone-sized, delivery crop, size on
  screen, viewing distance, whether captions and sound were on. A silent
  review comes before a voiced one.
- **unaidedQuestions**: ask before prompting, and write down the viewer's own
  words. For child-peek: what happened, and what did the child feel?
- **perShot**: every `mustSee` and `mustHear` item from `shots.json`, marked
  seen or heard, with a note when it isn't.
- **verdict** and **actions**: pass, fail or revise, and the beads that
  follow from it.

Reviewers are anonymous labels. Mark whether the viewer is new to the
project: only a fresh viewer's answers count for the phase A exit check.
