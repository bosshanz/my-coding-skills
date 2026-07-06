#!/usr/bin/env bash
set -u

echo "OpenCode status"
echo "working_dir=$(pwd)"
echo "OPENCODE_CONFIG_DIR=${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}"
echo "OPENCODE_DATA_DIR=${OPENCODE_DATA_DIR:-$HOME/.local/share/opencode}"

if command -v opencode >/dev/null 2>&1; then
  echo "opencode_path=$(command -v opencode)"
  if { opencode --version >/tmp/opencode-status-version.$$; } 2>/tmp/opencode-status-version-err.$$; then
    printf "opencode_version="
    cat /tmp/opencode-status-version.$$
  else
    echo "opencode_version_error=failed to run opencode --version"
    sed 's/^/stderr: /' /tmp/opencode-status-version-err.$$
  fi
  if { opencode auth list >/tmp/opencode-status-auth.$$; } 2>/tmp/opencode-status-auth-err.$$; then
    echo "auth_status=available"
  else
    echo "auth_status=unavailable_or_not_logged_in"
  fi
  rm -f /tmp/opencode-status-version.$$ /tmp/opencode-status-version-err.$$ /tmp/opencode-status-auth.$$ /tmp/opencode-status-auth-err.$$
else
  echo "opencode_missing=true"
fi

for path in "$HOME/.config/opencode/skills" "$HOME/.agents/skills" "$HOME/.claude/skills" ".opencode/skills" ".agents/skills" ".claude/skills" "AGENTS.md" "CLAUDE.md" "$HOME/.config/opencode/AGENTS.md" "$HOME/.config/opencode/opencode.json"; do
  if [ -e "$path" ]; then
    echo "discovered_path=$path"
  fi
done
