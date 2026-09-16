#!/usr/bin/env bash
set -u

echo "Claude Code status"
echo "working_dir=$(pwd)"
echo "CLAUDE_CONFIG_DIR=${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

if command -v claude >/dev/null 2>&1; then
  echo "claude_path=$(command -v claude)"
  if claude --version >/tmp/claude-code-status-version.$$ 2>/tmp/claude-code-status-version-err.$$; then
    printf "claude_version="
    cat /tmp/claude-code-status-version.$$
  else
    echo "claude_version_error=failed to run claude --version"
    sed 's/^/stderr: /' /tmp/claude-code-status-version-err.$$
  fi
  if claude auth status >/tmp/claude-code-status-auth.$$ 2>/tmp/claude-code-status-auth-err.$$; then
    echo "auth_status=available"
  else
    echo "auth_status=unavailable_or_not_logged_in"
  fi
  rm -f /tmp/claude-code-status-version.$$ /tmp/claude-code-status-version-err.$$ /tmp/claude-code-status-auth.$$ /tmp/claude-code-status-auth-err.$$
else
  echo "claude_missing=true"
fi

for path in "$HOME/.claude/skills" ".claude/skills" "CLAUDE.md" ".claude/CLAUDE.md"; do
  if [ -e "$path" ]; then
    echo "discovered_path=$path"
  fi
done
