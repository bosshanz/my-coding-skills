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

check_file "install.sh"
check_executable "install.sh"
check_file "uninstall.sh"
check_executable "uninstall.sh"

for skill in loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode; do
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

for ref in superpowers-lite.md stack.md design-and-research.md documentation.md frontend-quality.md backend-architecture.md database-engineering.md; do
  check_file "dev/references/$ref"
done

check_file "clarify/references/loop-workspace.md"
check_file "kimi-code/references/kimi-code-reference.md"
check_file "claude-code/references/claude-code-reference.md"
check_file "codex-cli/references/codex-cli-reference.md"
check_file "opencode/references/opencode-reference.md"
check_executable "kimi-code/scripts/kimi-code-status.sh"
check_executable "claude-code/scripts/claude-code-status.sh"
check_executable "codex-cli/scripts/codex-cli-status.sh"
check_executable "opencode/scripts/opencode-status.sh"
check_executable "scripts/skills-doctor.sh"

check_absent "agent-delegation"
check_absent "dev-workflow"
check_absent "design-interview"
check_absent "andy-coding"
check_absent "andy-dev"
check_absent "codebase-improve"

if grep -R "_SKILL_DIR" "$ROOT" --exclude-dir=.git --exclude=skills-doctor.sh >/tmp/skills-doctor-grep.$$ 2>/dev/null; then
  fail "undocumented *_SKILL_DIR reference found"
  sed 's/^/  /' /tmp/skills-doctor-grep.$$
else
  pass "no undocumented *_SKILL_DIR references"
fi
rm -f /tmp/skills-doctor-grep.$$

if grep -R "\[TODO\|TODO:\|FIXME\|XXX" "$ROOT" --exclude-dir=.git --exclude=skills-doctor.sh >/tmp/skills-doctor-todo.$$ 2>/dev/null; then
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

info "warnings=$WARN failures=$FAIL"
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
