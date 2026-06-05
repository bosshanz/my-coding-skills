#!/usr/bin/env bash
set -u

echo "Codex CLI status"
echo "working_dir=$(pwd)"
echo "CODEX_HOME=${CODEX_HOME:-$HOME/.codex}"

if command -v codex >/dev/null 2>&1; then
  echo "codex_path=$(command -v codex)"
  if codex --version >/tmp/codex-cli-status-version.$$ 2>/tmp/codex-cli-status-version-err.$$; then
    printf "codex_version="
    cat /tmp/codex-cli-status-version.$$
  else
    echo "codex_version_error=failed to run codex --version"
    sed 's/^/stderr: /' /tmp/codex-cli-status-version-err.$$
  fi
  if codex login status >/tmp/codex-cli-status-auth.$$ 2>/tmp/codex-cli-status-auth-err.$$; then
    echo "auth_status=available"
  else
    echo "auth_status=unavailable_or_not_logged_in"
  fi
  rm -f /tmp/codex-cli-status-version.$$ /tmp/codex-cli-status-version-err.$$ /tmp/codex-cli-status-auth.$$ /tmp/codex-cli-status-auth-err.$$
else
  echo "codex_missing=true"
fi

for path in "$HOME/.codex/config.toml" "$HOME/.codex/skills" ".agents/skills" "AGENTS.md"; do
  if [ -e "$path" ]; then
    echo "discovered_path=$path"
  fi
done
