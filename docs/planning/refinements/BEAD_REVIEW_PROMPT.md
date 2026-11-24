# Bead review prompt (fresh eyes)

Run in a fresh session of a model that has not worked on this repo, from the
repo root. Paste everything below the line.

---

You are reviewing the task graph for ai-movie before any agent builds from it.
Read `AGENTS.md`, then `.beads/issues.jsonl` (one bead per line; ignore closed
beads except as context). Use `docs/planning/PLAN_FOR_AI_MOVIE.md` only to
check facts, not to fill gaps: each open bead must be workable from its own
text plus the files it names.

The near-term product is a storyboard film (static sketched boards, parallax,
voice, light music, captions). Phase A is `examples/child-peek/`. Generation
is deferred to phase E.

Report, in this order, each with bead ids and a one-line fix:

1. **Not self-contained**: an agent would have to read the plan or guess to do
   it, or the text contradicts itself.
2. **Wrong dependencies**: a bead blocked by something it doesn't need
   (especially anything deferred blocking phase A or B), or missing a real
   prerequisite.
3. **Duplicates or overlaps** that would make two agents do the same work.
4. **Untestable acceptance criteria**, or criteria that don't prove the task.
5. **Gaps**: work the phase A or phase B films need that no bead covers.
6. **Scope creep**: beads that serve deferred work but are not labelled or
   prioritised as deferred.

Rate each finding high, medium or low. Don't propose new features. Don't edit
files; write your findings to
`docs/planning/refinements/BEAD_REVIEW_<model>.md`.
