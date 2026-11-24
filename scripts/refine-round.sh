#!/usr/bin/env bash
# Run one plan refinement round with an external coding agent.
#
#   scripts/refine-round.sh <round> codex             # Codex CLI, must be logged in
#   scripts/refine-round.sh <round> codex --overshoot # push the same Codex session for more
#   scripts/refine-round.sh <round> deepseek          # DeepSeek Harness, needs DEEPSEEK_API_KEY or a dsh login
#
# The agent writes docs/planning/refinements/ROUND_<round>_<model>.md and
# must not touch any other file. The script shows what changed afterwards.
set -euo pipefail

round="${1:?usage: refine-round.sh <round> codex|deepseek [--overshoot]}"
tool="${2:?usage: refine-round.sh <round> codex|deepseek [--overshoot]}"
mode="${3:-}"

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
mkdir -p docs/planning/refinements
prompt="$(sed "s/__ROUND__/$round/g" docs/planning/refinements/ROUND_PROMPT.md)"
overshoot="I am positive that you missed or screwed up at least 80 elements of that complex plan. Go back through every section again, including the data contracts, the renderer roadmap, the testing strategy, the phases, the risks and the budget, and add the further changes to the same file."

case "$tool" in
  codex)
    if [ "$mode" = "--overshoot" ]; then
      codex exec resume --last "$overshoot"
    else
      codex exec --sandbox workspace-write --cd "$root" "$prompt"
    fi
    ;;
  deepseek)
    if [ "$mode" = "--overshoot" ]; then
      echo "For DeepSeek, open the session in 'npx @deepseek-ai/dsh@0.2.2-rc.5 web' and paste:" >&2
      echo "$overshoot" >&2
      exit 1
    fi
    npx -y @deepseek-ai/dsh@0.2.2-rc.5 --profile headless --permission-mode workspace-write "$prompt"
    ;;
  *)
    echo "unknown tool: $tool (use codex or deepseek)" >&2
    exit 2
    ;;
esac

echo
echo "Changes after the round (only a new file under docs/planning/refinements/ is expected):"
git status --short
