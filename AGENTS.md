# AGENTS.md

Operating manual for any coding agent working in this repository. Read it,
and `docs/LESSONS.md`, at the start of every session and again after every
context compaction.

## Rules

0. **The human's instructions override everything here.** If Chui says
   otherwise, do what he says. He has also asked to be kept on the flywheel:
   when a request skips plan → beads → code, jumps ahead of the current phase,
   or starts a side quest, say so in one line, name the bead or phase it
   belongs to, and offer to file it. Then do what he decides.
1. **No file deletion** without explicit permission from the human.
2. **No destructive git commands**: no `git reset --hard`, `git clean -fd`,
   `git checkout -- .`, forced pushes, or `rm -rf` on tracked paths.
3. **Work on `main`.** There is no `master`.
4. **Edit code by hand.** No scripts that rewrite source files in bulk.
5. **No file proliferation.** Change the file in place; never add
   `mannequin_v2.js`, `cli_new.js` or similar.
6. **Check after every change.** Run the tests (see Commands). For anything
   that draws, render it and look at it at full size and at phone thumbnail
   size, check it against the shot's must-see list, and say plainly what
   fails before calling it done.
7. **Multi-agent awareness.** Never stash, revert or overwrite changes you did
   not make. If a file you need has someone else's uncommitted edits, stop and
   ask.
8. **Plan first, then beads, then code.** The plan in
   `docs/planning/PLAN_FOR_AI_MOVIE.md` is the source of truth for intent.
   Work is tracked as beads; pick work with `br ready --json`.
9. **Every change starts from a claimed bead.** That includes skills,
   examples, docs and quick fixes. If no bead fits, create one, then claim it.
   Close it with proof (a commit, a test, a render).
10. **Beads stay self-contained.** When the plan changes, rewrite the affected
    bead descriptions in place. Never append "update" notes underneath.
11. **Never weaken the process to get work through.** You may add rules,
    checks, tests and lessons. You may not delete or loosen a test, check or
    rule, raise a tolerance, or mark expected output as acceptable just to
    make something pass, without the human's agreement. Changes to this Rules
    section need the human.

## Project

A pipeline for faceless videos. The distinctive part is stage 2: a
programmatic storyboard that fixes camera, pose and gaze before any image or
video model is involved. See `README.md` for the stage table and
`docs/planning/PLAN_FOR_AI_MOVIE.md` for the plan.

| Path | What it is |
|---|---|
| `lib/pose/` | Storyboard mannequin: model, renderer, profiles, CLI. Format documented in its README |
| `resource/pose/` | Reference scene records (`.json`) with renders (`.png`) |
| `docs/planning/` | Plan documents |
| `docs/LESSONS.md` | Escapes not yet absorbed into a test, check or rule; read at session start |
| `.beads/` | Task tracking (beads). `issues.jsonl` is committed; the database is not |
| `skills/` | Pipeline skills (symlink to `.claude/skills` for Claude Code), used in order: `story-writer` → `screenplay` → `script-doctor` → `shot-list` → `sound-design` |
| `examples/` | Worked examples of the pipeline; `examples/child-peek/` is the phase A micro-story |

## Tech stack

- Node.js 22, plain CommonJS, no runtime dependencies so far. Keep it that way
  unless a bead says otherwise.
- SVG output; PNG conversion through `rsvg-convert` when available.
- Tests: `node --test` (built in). No test framework to install.

## Commands

```sh
node lib/pose/cli.js render resource/pose --png     # render every reference scene
node lib/pose/cli.js render <scene.json> --construction
node lib/pose/cli.js sheet resource/pose index.svg
node lib/pose/cli.js lineup profiles.svg
node --test                                         # all tests (golden renders included)
node test/golden-review.js                          # side-by-side review of changed drawings
UPDATE_GOLDEN=1 node --test                         # accept reviewed drawing changes
node scripts/narrate.js generate examples/child-peek --dry-run   # show the TTS requests, no API call
node scripts/narrate.js generate examples/child-peek             # paid: needs GEMINI_API_KEY or GEMINI_VIDEO_API_KEY in the environment
node scripts/narrate.js assemble examples/child-peek --pick b1=1,b2=2,b4=1,b5=1
```

## Storyboard conventions (decided with the human)

These came from review of rendered frames. Do not undo them without asking.

- A frame is figures, props and buildings as simple primitives, plus camera
  and later lighting. It must look hand-sketched.
- Joints are relative to a three-piece spine; every joint has a permitted
  range; a flexibility setting allows acrobatic poses.
- Every pose states where the figure looks. Only dynamic poses (falls, flips)
  use `"look": "free"`. The neck follows the spinal curve.
- Two layers. The **mannequin** (construction layer): hands are one of three
  types (open, fist, V); heads are an oval with two curved cross-lines showing
  face direction; no fingers, no spiky hair, no hatching, no speed lines;
  clothed form. The **character layer**, drawn from a character sheet, adds
  fingers, the character's real hairstyle (spiky included), facial features
  and hatching, and must draw them the same way in every shot.
- Figures are a clothed form: the bust is drape with one horizontal stretch
  line; the female torso is slender; shoulders slope, no large traps.
- Limbs carry the sketching curves (calf full at the back, straight shin,
  glutes and arms asymmetric). The pelvis is a wedge; limbs grow out of their
  parent form rather than being drawn as separate ovals.
- "Manga" in a request means extreme pose states, not manga styling.

## Self-improvement loop

Fixing a mistake is half the job; the other half is making the process catch
it next time.

0. **Hunt for gaps; don't wait to be told.** Review your own output the way
   the human would.
   - *Visual*: look at every board as a director and an art teacher would.
     Can a stranger read it at thumbnail size? Is every must-see item there?
     Are anatomy, eyelines, screen direction, scale and the frame edge right?
   - *Process*: did a step produce something the next step couldn't use (a
     shot list asking for things the renderer can't draw)? Did work go around
     the beads? Is a bead, skill or rule out of date?
   Call each gap out to the human unprompted, ranked by severity, and file it
   as a bead or a lesson.
1. **Trace every escape.** When the human, a reviewer or a later stage
   catches a defect, name the step that should have caught it first: a
   skill, a check, a test, a rule in this file, or a bead description. Fix
   that step as well as the defect, in the same bead or a new one.
2. **Log it.** Add one line to `docs/LESSONS.md`: date, what slipped, where it
   should have been caught, and what changed (bead or commit). When a lesson
   has been absorbed into a test, check or rule, remove its line, so the log
   stays short and current.
3. **Turn repeats into machine checks.** If the same kind of escape happens
   twice, the fix is a test or validator check, not more prose.
4. **Retro at landing.** Before committing, answer three questions: What did
   the human correct? What surprised me? What would I do differently? Each
   answer becomes a lesson, a bead, or nothing.
5. **Meta-review.** At each phase exit, or every 10 closed beads, a model that
   hasn't worked on the repo reviews this file, `skills/` and
   `docs/LESSONS.md` for drift, contradictions and rules nobody follows
   (`docs/planning/refinements/BEAD_REVIEW_PROMPT.md` is the bead version).
   Findings come to the human as proposals.

## Working alongside other agents

Sometimes more than one agent works here at once: for example, Claude Code on
the human's Mac and a cloud Claude session reaching the repo through a bridge.

## Landing a session

1. File beads for any remaining or discovered work, and do the retro
   (self-improvement loop, step 4).
2. Run the checks.
3. For a code bead, get a second model's review first
   (`docs/planning/refinements/CODE_REVIEW_PROMPT.md`) and resolve its high
   findings. Then update bead status (`br close <id> --reason "..."`).
4. `br sync --flush-only`, then stage `.beads/` with the code.
5. Commit, then `git pull --rebase` and `git push`. Work is not finished until it is pushed to
   `origin` (github.com/teyc/ai-movie). If you cannot push (no credentials in a sandbox), say so
   and leave the push to the human.

## Tools

- **br** (beads_rust): issue tracker. Start with `br ready --json`; claim with
  `br update <id> --claim --actor "$AGENT_NAME"` (atomic: sets the assignee and
  `in_progress`); finish with
  `br close <id> --reason "Completed: <proof>"`. Set `RUST_LOG=error`.
- **bv** (beads viewer, installed on the human's Mac as `bvr`): use only its
  `--robot-*` flags.

<!-- br-agent-instructions-v1 -->

---

## Beads Workflow Integration

This project uses [beads_rust](https://github.com/Dicklesworthstone/beads_rust) (`br`/`bd`) for issue tracking. Issues are stored in `.beads/` and tracked in git.

### Essential Commands

```bash
# View ready issues (open, unblocked, not deferred)
br ready              # or: bd ready

# List and search
br list --status=open # All open issues
br show <id>          # Full issue details with dependencies
br search "keyword"   # Full-text search

# Create and update
br create --title="..." --description="..." --type=task --priority=2
br update <id> --status=in_progress
br close <id> --reason="Completed"
br close <id1> <id2>  # Close multiple issues at once

# Sync with git
br sync --flush-only  # Export DB to JSONL
br sync --status      # Check sync status
```

### Workflow Pattern

1. **Start**: Run `br ready` to find actionable work
2. **Claim**: Use `br update <id> --claim --actor "$AGENT_NAME"`
3. **Work**: Implement the task
4. **Complete**: Use `br close <id>`
5. **Sync**: Always run `br sync --flush-only` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `br ready` shows only open, unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers 0-4, not words)
- **Types**: task, bug, feature, epic, chore, docs, question
- **Blocking**: `br dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
br sync --flush-only    # Export beads changes to JSONL
git commit -m "..."     # Commit everything
git push                # Push to remote
```

### Best Practices

- Check `br ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `br create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always sync before ending session

<!-- end-br-agent-instructions -->
