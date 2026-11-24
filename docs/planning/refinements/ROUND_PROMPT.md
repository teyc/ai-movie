You are reviewing a software and film-production plan as a senior architect and working video producer. This is refinement round __ROUND__ in a multi-round process; other reviewers do other rounds.

Read, in this folder:
- docs/planning/PLAN_FOR_AI_MOVIE.md — the current plan (the thing you are reviewing)
- AGENTS.md, README.md, lib/pose/README.md and lib/pose/mannequin.js — the project and its existing code
- resource/pose/ — reference scenes and their renders (look at the images)

You may read the other files in docs/planning/ (earlier competing plans and earlier refinement rounds) for context, but review only PLAN_FOR_AI_MOVIE.md. Do not repeat a change an earlier round already proposed unless you disagree with how it was handled.

Task: propose your best revisions to the plan — to make it a better architecture, add missing features, make it more robust and reliable, more correct about the existing code, and more likely to produce good, watchable films at low cost and low producer effort. Challenge anything you think is wrong, including the core bet. Do not pad: every change must earn its place.

For EACH proposed change give:
1. A short title.
2. Detailed analysis and rationale: what is wrong or missing, why it matters, and what evidence you have (cite files, functions or plan sections).
3. The edit, as a git-diff-style patch against docs/planning/PLAN_FOR_AI_MOVIE.md (unified diff, with enough context lines to apply cleanly).
4. Severity: critical, important, or minor.

For anything about the current state of the world (model capabilities, prices, APIs, platform rules), give a source URL and the date checked, or mark it "unverified". Never present guesses as facts.

Rules:
- Do NOT modify PLAN_FOR_AI_MOVIE.md or any other existing file.
- Do NOT commit, push, or run br.
- Write your output to exactly one new file:
    docs/planning/refinements/ROUND___ROUND___<your-model-name>.md

End with a short list of the questions you think the plan still cannot answer.
