#!/usr/bin/env bash
set -u

GROK_HOME_DIR="${GROK_HOME:-$HOME/.grok}"

echo "Grok Build CLI status"
echo "working_dir=$(pwd)"
echo "GROK_HOME=$GROK_HOME_DIR"

if command -v grok >/dev/null 2>&1; then
  echo "grok_path=$(command -v grok)"
  if grok --version >/tmp/grok-build-cli-status-version.$$ 2>/tmp/grok-build-cli-status-version-err.$$; then
    printf "grok_version="
    cat /tmp/grok-build-cli-status-version.$$
  else
    echo "grok_version_error=failed to run grok --version"
    sed 's/^/stderr: /' /tmp/grok-build-cli-status-version-err.$$
  fi
  rm -f /tmp/grok-build-cli-status-version.$$ /tmp/grok-build-cli-status-version-err.$$
else
  echo "grok_missing=true"
fi

if [ -n "${XAI_API_KEY:-}" ]; then
  echo "auth_api_key=set"
else
  echo "auth_api_key=unset"
fi

if [ -f "$GROK_HOME_DIR/auth.json" ]; then
  echo "auth_session_file=present"
else
  echo "auth_session_file=absent"
fi

for path in "$GROK_HOME_DIR/skills" "$HOME/.agents/skills" "$HOME/.claude/skills" ".grok/skills" ".agents/skills" ".claude/skills" "AGENTS.md" "CLAUDE.md" "$GROK_HOME_DIR/AGENTS.md" "$GROK_HOME_DIR/config.toml"; do
  if [ -e "$path" ]; then
    echo "discovered_path=$path"
  fi
done
