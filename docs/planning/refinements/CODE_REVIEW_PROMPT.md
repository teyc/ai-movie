# Code review prompt (second model, per code bead)

Run in a fresh session of a model that did not write the change, from the
repo root. Replace `<bead>` and `<range>` (for example `HEAD~1..HEAD`), then
paste everything below the line.

---

You are reviewing one change to ai-movie before its bead is closed. Read
`AGENTS.md`, then `br show <bead>` (the bead is the specification), then
`git diff <range>` and the files it touches. Run `node --test`.

Report, in this order, with file and line for each:

1. **Wrong against the bead**: acceptance criteria not met, or met in a way
   that wouldn't survive a real input.
2. **Bugs**: incorrect logic, edge cases (empty, zero, missing fields,
   multibyte text, very long or very short input), resource or error
   handling, anything that fails silently.
3. **Safety**: secrets written to disk or logs, paid calls without a cap,
   destructive file operations, shelling out with untrusted strings.
4. **Tests**: what the tests don't prove; a missing case that would catch
   finding 1 or 2.
5. **Drawing changes** (renderer code only): render the affected scenes and
   say what changed visually, against the conventions in AGENTS.md.
6. **Simplifications** worth making now; skip style nits.

Rate each finding high, medium or low. Don't edit code. Write the findings
to `docs/reviews/<bead>-<model>.md`, or say "no findings" with what you
checked.
