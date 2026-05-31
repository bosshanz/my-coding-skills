#!/usr/bin/env bash
set -u

echo "Kimi Code status"
echo "working_dir=$(pwd)"
echo "KIMI_CODE_HOME=${KIMI_CODE_HOME:-$HOME/.kimi-code}"

if command -v kimi >/dev/null 2>&1; then
  echo "kimi_path=$(command -v kimi)"
  if kimi --version >/tmp/kimi-code-status-version.$$ 2>/tmp/kimi-code-status-version-err.$$; then
    printf "kimi_version="
    cat /tmp/kimi-code-status-version.$$
  else
    echo "kimi_version_error=failed to run kimi --version"
    sed 's/^/stderr: /' /tmp/kimi-code-status-version-err.$$
  fi
  rm -f /tmp/kimi-code-status-version.$$ /tmp/kimi-code-status-version-err.$$
else
  echo "kimi_missing=true"
fi

if [ -d "${KIMI_CODE_HOME:-$HOME/.kimi-code}" ]; then
  echo "data_dir_exists=true"
else
  echo "data_dir_exists=false"
fi

for dir in "$HOME/.kimi-code/skills" "$HOME/.agents/skills" ".kimi-code/skills" ".agents/skills"; do
  if [ -d "$dir" ]; then
    echo "skills_dir=$dir"
  fi
done
