#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FAIL=0
WARN=0

info() { printf 'info: %s\n' "$*"; }
pass() { printf 'pass: %s\n' "$*"; }
warn() { printf 'warn: %s\n' "$*"; WARN=$((WARN + 1)); }
fail() { printf 'fail: %s\n' "$*"; FAIL=$((FAIL + 1)); }

check_file() {
  if [ -f "$ROOT/$1" ]; then pass "file exists: $1"; else fail "missing file: $1"; fi
}

check_executable() {
  if [ -x "$ROOT/$1" ]; then pass "executable: $1"; else fail "not executable: $1"; fi
}

check_absent() {
  if [ -e "$ROOT/$1" ]; then fail "old path still exists: $1"; else pass "old path absent: $1"; fi
}

check_command() {
  if command -v "$1" >/dev/null 2>&1; then pass "command available: $1 ($(command -v "$1"))"; else warn "command missing: $1"; fi
}

info "Skills doctor"
info "root=$ROOT"
VERSION="$(sed -n 's/.*"version": "\(.*\)".*/\1/p' "$ROOT/package.json" | head -1)"
[ -n "$VERSION" ] && info "version=$VERSION"

check_file "install.sh"
check_executable "install.sh"
check_file "uninstall.sh"
check_executable "uninstall.sh"

for skill in design verify reflect kimi-code claude-code codex-cli opencode grok-build-cli; do
  check_file "$skill/SKILL.md"
  check_file "$skill/agents/openai.yaml"
  if [ -f "$ROOT/$skill/SKILL.md" ]; then
    if grep -q "^name: $skill$" "$ROOT/$skill/SKILL.md"; then
      pass "frontmatter name matches: $skill"
    else
      fail "frontmatter name mismatch: $skill"
    fi
  fi
done

for ref in README.md debugging.md architecture-decisions.md ablation.md backend-architecture.md backend-quality.md database-engineering.md; do
  check_file "references/$ref"
done

for ref in interaction.md design-direction.md quality.md animation.md anthropic-frontend-design-LICENSE.txt; do
  check_file "design/references/$ref"
done

check_file "kimi-code/references/kimi-code-reference.md"
check_file "claude-code/references/claude-code-reference.md"
check_file "codex-cli/references/codex-cli-reference.md"
check_file "opencode/references/opencode-reference.md"
check_file "grok-build-cli/references/grok-build-cli-reference.md"
check_executable "kimi-code/scripts/kimi-code-status.sh"
check_executable "claude-code/scripts/claude-code-status.sh"
check_executable "codex-cli/scripts/codex-cli-status.sh"
check_executable "opencode/scripts/opencode-status.sh"
check_executable "grok-build-cli/scripts/grok-build-cli-status.sh"
check_executable "scripts/skills-doctor.sh"
check_file "scripts/check-routing-policy.mjs"
check_file "scripts/test-install-safety.sh"
check_file "scripts/sync-adapters.mjs"
check_file "bin/skills.mjs"
check_file "package-lock.json"
check_file "CHANGELOG.md"
check_file "adapters/contract.md"
check_file "adapters/adapters.yaml"
check_file "evals/routing/fixtures.yaml"
check_file "evals/routing/runner.mjs"
check_file "evals/routing/prompt.md"
check_file "evals/behavior/fixtures.yaml"
check_file "evals/behavior/runner.mjs"
check_file "evals/e2e/smoke.mjs"
check_file "evals/lib/contracts.mjs"
check_file "evals/execution/harness.mjs"
check_file "evals/execution/runner.mjs"
check_file "evals/execution/harness.test.mjs"
check_file "AGENTS.md"
check_file "templates/AGENTS.md"
check_file "scripts/install-global-rules.mjs"
check_file "docs/workflow.md"
check_file "evals/results/README.md"
check_file ".github/workflows/evals.yml"

check_absent "dev"
check_absent "clarify"
check_absent "qa"
check_absent "acceptance"
check_absent "agent-delegation"
check_absent "dev-workflow"
check_absent "design-interview"
check_absent "andy-coding"
check_absent "andy-dev"
check_absent "codebase-improve"
check_absent "loop-engineering"

if grep -R "_SKILL_DIR" "$ROOT" --exclude-dir=.git --exclude-dir=node_modules --exclude=skills-doctor.sh >/tmp/skills-doctor-grep.$$ 2>/dev/null; then
  fail "undocumented *_SKILL_DIR reference found"
  sed 's/^/  /' /tmp/skills-doctor-grep.$$
else
  pass "no undocumented *_SKILL_DIR references"
fi
rm -f /tmp/skills-doctor-grep.$$

if grep -R "\[TODO\|TODO:\|FIXME\|XXX" "$ROOT" --exclude-dir=.git --exclude-dir=node_modules --exclude=skills-doctor.sh >/tmp/skills-doctor-todo.$$ 2>/dev/null; then
  warn "TODO-style markers found"
  sed 's/^/  /' /tmp/skills-doctor-todo.$$
else
  pass "no TODO-style markers"
fi
rm -f /tmp/skills-doctor-todo.$$

check_command kimi
check_command claude
check_command codex
check_command opencode
check_command grok

info "warnings=$WARN failures=$FAIL"
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
