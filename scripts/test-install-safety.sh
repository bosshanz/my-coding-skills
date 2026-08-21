#!/usr/bin/env bash
# Regression test for the install.sh / uninstall.sh safety guard.
#
# Guarantees that a typo like `./uninstall.sh dev --dest /` can never
# rm -rf /dev (or any other path directly under /). Every case here is
# non-mutating: exploit cases pass --dest / (refused before any filesystem
# change) plus --dry-run; the legitimate case uses a private temp dir.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INSTALL="$ROOT/install.sh"
UNINSTALL="$ROOT/uninstall.sh"

pass=0
fails=0
tmp_base=""
link="/tmp/my-coding-skills-safety-link"

cleanup() {
  [ -n "$tmp_base" ] && rm -rf "$tmp_base"
  [ -L "$link" ] && rm -f "$link"
}
trap cleanup EXIT

# Run a command and assert it FAILS with a "refusing to operate" message.
assert_refuses() {
  local out rc
  out="$("$@" 2>&1)"
  rc=$?
  if [[ $rc -eq 0 ]]; then
    printf 'FAIL: expected refusal but command succeeded: %s\n' "$*" >&2
    printf '  output: %s\n' "$out" >&2
    fails=$((fails+1))
    return
  fi
  if ! grep -q "refusing to operate" <<<"$out"; then
    printf 'FAIL: expected "refusing to operate" message: %s\n' "$*" >&2
    printf '  output: %s\n' "$out" >&2
    fails=$((fails+1))
    return
  fi
  pass=$((pass+1))
  printf 'ok (refused): %s\n' "$*"
}

# Run a command and assert it SUCCEEDS.
assert_allows() {
  local out rc
  out="$("$@" 2>&1)"
  rc=$?
  if [[ $rc -ne 0 ]]; then
    printf 'FAIL: expected success but got %s: %s\n' "$rc" "$*" >&2
    printf '  output: %s\n' "$out" >&2
    fails=$((fails+1))
    return
  fi
  pass=$((pass+1))
  printf 'ok (allowed): %s\n' "$*"
}

# --- exploit cases: must refuse ---
assert_refuses "$UNINSTALL" dev --dest / --dry-run
assert_refuses "$INSTALL"  dev --dest / --force --dry-run
assert_refuses "$INSTALL"  --dest / --dry-run
assert_refuses "$UNINSTALL" dev --dest /usr --dry-run
assert_refuses "$UNINSTALL" dev --dest /dev --dry-run
assert_refuses "$UNINSTALL" dev --dest // --dry-run

# --- symlink-to-root bypass: must refuse ---
ln -s / "$link"
assert_refuses "$UNINSTALL" dev    --dest "$link" --dry-run
assert_refuses "$INSTALL"  clarify --dest "$link" --dry-run
rm -f "$link"

# --- legitimate cases: must succeed ---
tmp_base="$(mktemp -d)"
dest="$tmp_base/skills"
assert_allows "$INSTALL"  dev --dest "$dest" --dry-run
assert_allows "$INSTALL"  dev --dest "$dest"
if [ ! -f "$dest/dev/SKILL.md" ]; then
  printf 'FAIL: real install did not create %s/dev/SKILL.md\n' "$dest" >&2
  fails=$((fails+1))
else
  pass=$((pass+1)); printf 'ok (real install created SKILL.md)\n'
fi
if [ ! -f "$dest/dev/references/qa-handoff.md" ]; then
  printf 'FAIL: real install did not copy %s/dev/references/qa-handoff.md\n' "$dest" >&2
  fails=$((fails+1))
else
  pass=$((pass+1)); printf 'ok (real install copied dev/references/qa-handoff.md)\n'
fi
assert_allows "$INSTALL" design --dest "$dest"
for vendored_file in \
  "$dest/design/references/design-direction.md" \
  "$dest/design/references/anthropic-frontend-design-LICENSE.txt"; do
  if [ ! -f "$vendored_file" ]; then
    printf 'FAIL: real install did not copy vendored design file: %s\n' "$vendored_file" >&2
    fails=$((fails+1))
  else
    pass=$((pass+1)); printf 'ok (real install copied %s)\n' "${vendored_file#$dest/}"
  fi
done
assert_allows "$UNINSTALL" dev --dest "$dest"
if [ -e "$dest/dev" ]; then
  printf 'FAIL: real uninstall did not remove %s/dev\n' "$dest" >&2
  fails=$((fails+1))
else
  pass=$((pass+1)); printf 'ok (real uninstall removed dev)\n'
fi

# Catalog parity: every packaged SKILL.md directory must be named by
# `install.sh all` and accepted as an explicit skill argument.
catalog_dest="$tmp_base/catalog"
mkdir -p "$catalog_dest"
all_out="$("$INSTALL" all --dest "$catalog_dest" --dry-run 2>&1)" || {
  printf 'FAIL: install.sh all --dry-run failed\n  output: %s\n' "$all_out" >&2
  fails=$((fails+1))
  all_out=""
}
adapters_out="$("$INSTALL" adapters --dest "$catalog_dest" --dry-run 2>&1)" || {
  printf 'FAIL: install.sh adapters --dry-run failed\n  output: %s\n' "$adapters_out" >&2
  fails=$((fails+1))
  adapters_out=""
}
for skill_md in "$ROOT"/*/SKILL.md; do
  skill="$(basename "$(dirname "$skill_md")")"
  if [[ -n "$all_out" ]] && grep -q "would install $skill ->" <<<"$all_out"; then
    pass=$((pass+1)); printf 'ok (all dry-run includes %s)\n' "$skill"
  else
    printf 'FAIL: install.sh all --dry-run omitted %s\n' "$skill" >&2
    fails=$((fails+1))
  fi
  assert_allows "$INSTALL" "$skill" --dest "$catalog_dest" --dry-run
done
if grep -q "would install grok-build-cli ->" <<<"$adapters_out"; then
  pass=$((pass+1)); printf 'ok (adapters dry-run includes grok-build-cli)\n'
else
  printf 'FAIL: install.sh adapters --dry-run omitted grok-build-cli\n' >&2
  fails=$((fails+1))
fi

printf '\n%d passed, %d failed\n' "$pass" "$fails"
[ "$fails" -eq 0 ]
