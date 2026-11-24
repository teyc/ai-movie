# Lessons

Escapes not yet fully absorbed into a test, check or rule. One line each:
what slipped, where it should have been caught, what changed. Remove a line
once a test, check or rule makes the lesson automatic. See the
self-improvement loop in `AGENTS.md`.

| Date | What slipped | Should have been caught at | What changed | Still to do |
|---|---|---|---|---|
| 2026-11-24 | child-peek's narration says Mia knows "the sound of Dad's car", but no picture or sound shows a car; with the sound muted, "Not Dad" pays off nothing (caught by the human) | script-doctor, then shot-list | `skills/sound-design` (every sound the script mentions must be planned); am-mcd.15 plants a parking bay and an engine cue | Machine check: every narrated claim about what is seen or heard maps to a shot's `mustSee` or `mustHear` |
| 2026-11-24 | The reference scene child-peek.json looked at the lens, so a board aimed at the street would have shown her looking at us (caught in refinement round 3) | Scene blocking: gaze targets | Boards aim her look at the street corner; the street was moved along x | Check: warn when a look target is the camera unless the shot asks for it |
| 2026-11-24 | In the first-draft boards the wall drew over Mia, because forms are sorted by one average depth (caught on render) | Renderer (visibility) | Stopgap `bias` values on the wall, window and slab boxes | am-e-board-1wg.9 replaces the bias with a visibility check |
| 2026-11-24 | Skills, the child-peek example, boards and half the fixed camera were built with no bead, so the tracker stopped matching the repo (caught by the human asking how closely we follow the flywheel) | AGENTS.md rule 8 was too weak | Rule 9: every change starts from a claimed bead; the polish pass filed and closed the missing beads | Watch at the next meta-review |
| 2026-11-24 | Beads gained appended "Update (draft N)" notes that contradicted their own first paragraph | Converting plan changes into beads | Rule 10: rewrite beads in place; polish pass 1 rewrote all open beads | The bead review (BEAD_REVIEW_PROMPT.md) checks for this |
| 2026-11-24 | Open beads still depended on deferred generation work, blocking phases A to D | Scope change in draft 5 (generation deferred) | Dependencies removed in polish pass 1 | When work is deferred, list everything that depends on it and re-check each link |
| 2026-11-24 | `device_commit_files` sometimes delivered stale content soon after a write | Tooling: file transfer to the Mac | Compare checksums on both sides after each transfer | — |
| 2026-11-24 | Told the human I'd create the GitHub repo before checking that `gh` was signed in here, or that push is allowed from the sandbox (it isn't) | Starting a task: check the tools first | — | Before promising an action that needs credentials or network, check that it works |
| 2026-11-24 | First-draft child-peek boards were called readable, but sh3 (no corner, streetlight or headlight) and sh4 (the scooter reads as a man on a box) fail their must-see lists, and sh2 has no lean or lead room (caught by Claude reviewing on the human's prompt) | Rule 6: render review was too vague | Rule 6 now checks must-see at thumbnail size; loop step 0 hunts for visual gaps; beads am-e-board-1wg.17 (props) and am-e-board-1wg.18 (frame clip) | A review sheet with a must-see checklist per board (am-e-board-1wg.12) |
| 2026-11-24 | The shot list asked for a scooter, headlights and a street corner the renderer can't draw | shot-list skill: no list of what the renderer can draw | Bead am-e-script-5t7.5 | — |
| 2026-11-24 | Strokes run past the frame border in sh2, sh3 and sh5 | Render review | Bead am-e-board-1wg.18 | — |

| 2026-11-24 | Polish pass 1 introduced errors of its own: am-00y.11 said the mannequin has "no clothed form" (the opposite of AGENTS.md), and the boards depended on a manifest defined downstream of them (caught by the fresh-eyes bead review) | Writing beads: check new text against AGENTS.md conventions, and check each new dependency for the order of work, not just for cycles | Fixed in am-e-tool-toz.7 | Keep running a fresh-eyes review after every bulk bead change |
