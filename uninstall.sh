#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ALL_SKILLS=(
  loop-engineering
  clarify
  dev
  acceptance
  kimi-code
  claude-code
  codex-cli
  opencode
)

TARGET="all"
TARGET_WAS_SET=0
DEST=""
DRY_RUN=0
LIST_ONLY=0
REQUESTED=()

usage() {
  cat <<'EOF'
Uninstall this repository's coding-agent Skills.

Usage:
  ./uninstall.sh [skill|group ...] [options]
  ./uninstall.sh --list

Skills:
  loop-engineering
  clarify
  dev
  acceptance
  kimi-code
  claude-code
  codex-cli
  opencode

Groups:
  all          Uninstall every Skill (default)
  methodology  Uninstall loop-engineering
  workflow     Uninstall dev
  planning     Uninstall clarify
  delegation   Uninstall all external-agent adapters
  adapters     Uninstall kimi-code, claude-code, codex-cli, and opencode

Options:
  --target TARGET   agents, codex, claude, gemini, opencode, or all
                    (default: all)
  --dest DIR        Uninstall from a custom Skills directory (must not be / or a system path)
  --dry-run         Print operations without changing files
  --list            List available Skills and groups
  --help, -h        Show this help

Examples:
  ./uninstall.sh
  ./uninstall.sh methodology --target agents
  ./uninstall.sh dev --target agents
  ./uninstall.sh planning --target agents
  ./uninstall.sh acceptance --target agents
  ./uninstall.sh delegation --target claude
  ./uninstall.sh all --target all
  ./uninstall.sh dev --dest /tmp/skills --dry-run

Targets:
  agents    $HOME/.agents/skills (recommended shared location; Codex-supported)
  codex     ${CODEX_HOME:-$HOME/.codex}/skills (legacy Codex location)
  claude    $HOME/.claude/skills
  gemini    $HOME/.gemini/skills
  opencode  $HOME/.config/opencode/skills
  all       agents, claude, gemini, and opencode locations
EOF
}

fail() {
  printf 'uninstall: %s\n' "$*" >&2
  exit 1
}

# Refuse to remove a protected path. Physically resolves the target (following
# symlinks and relative paths) when it exists, so the filesystem root, system
# directories directly under / (e.g. /dev, /etc, /usr), and symlinked roots
# that resolve there are all blocked regardless of how the path was spelled.
# A Skill destination is always <root>/<skill>, so it must never be / or a
# single-component path under /. Without this guard, `./uninstall.sh dev
# --dest /` would rm -rf /dev.
assert_safe_target() {
  local target="$1" resolved=""
  while [[ "$target" != "/" && "$target" == */ ]]; do target="${target%/}"; done
  # Resolve physically when possible so symlinks and relative paths cannot
  # hide the filesystem root. cd INTO the target (not its parent) so a symlink
  # root like /tmp/link -> / resolves to /, not to the link's lexical path.
  if [[ -L "$target" || -d "$target" ]]; then
    resolved="$( cd "$target" 2>/dev/null && pwd -P )" || resolved=""
  fi
  if [[ -z "$resolved" && -e "$target" ]]; then
    local d dir
    d="$(dirname "$target")"
    dir="$( cd "$d" 2>/dev/null && pwd -P )"
    dir="${dir%/}"
    resolved="$dir/$(basename "$target")"
  fi
  [[ -n "$resolved" ]] || resolved="$target"
  while [[ "$resolved" == *//* ]]; do resolved="${resolved/\/\//\/}"; done
  if [[ "$resolved" == "/" ]]; then
    fail "refusing to operate on filesystem root: $1"
  fi
  if [[ "$resolved" =~ ^/[^/]+$ ]]; then
    fail "refusing to operate on a system path directly under /: $1 (use a skills directory like ~/.agents/skills or /tmp/skills)"
  fi
}

append_unique() {
  local value="$1"
  local existing
  for existing in "${RESOLVED[@]:-}"; do
    if [[ "$existing" == "$value" ]]; then
      return
    fi
  done
  RESOLVED+=("$value")
}

resolve_requests() {
  local request skill
  RESOLVED=()

  if [[ "${#REQUESTED[@]}" -eq 0 ]]; then
    REQUESTED=(all)
  fi

  for request in "${REQUESTED[@]}"; do
    case "$request" in
      all)
        for skill in "${ALL_SKILLS[@]}"; do append_unique "$skill"; done
        ;;
      workflow)
        append_unique dev
        ;;
      methodology)
        append_unique loop-engineering
        ;;
      planning)
        append_unique clarify
        ;;
      delegation)
        append_unique kimi-code
        append_unique claude-code
        append_unique codex-cli
        append_unique opencode
        ;;
      adapters)
        append_unique kimi-code
        append_unique claude-code
        append_unique codex-cli
        append_unique opencode
        ;;
      loop-engineering|clarify|dev|acceptance|kimi-code|claude-code|codex-cli|opencode)
        append_unique "$request"
        ;;
      *)
        fail "unknown Skill or group: $request"
        ;;
    esac
  done
}

resolve_destinations() {
  DESTINATIONS=()

  if [[ -n "$DEST" ]]; then
    if [[ "$TARGET" == "all" && "$TARGET_WAS_SET" -eq 1 ]]; then
      fail "--dest cannot be combined with --target all"
    fi
    DESTINATIONS+=("$DEST")
    return
  fi

  local codex_home="${CODEX_HOME:-$HOME/.codex}"
  case "$TARGET" in
    agents|standard)
      DESTINATIONS+=("$HOME/.agents/skills")
      ;;
    codex)
      DESTINATIONS+=("$codex_home/skills")
      ;;
    claude)
      DESTINATIONS+=("$HOME/.claude/skills")
      ;;
    gemini)
      DESTINATIONS+=("$HOME/.gemini/skills")
      ;;
    opencode)
      DESTINATIONS+=("$HOME/.config/opencode/skills")
      ;;
    all)
      DESTINATIONS+=(
        "$HOME/.agents/skills"
        "$HOME/.claude/skills"
        "$HOME/.gemini/skills"
        "$HOME/.config/opencode/skills"
      )
      ;;
    *)
      fail "unknown target: $TARGET"
      ;;
  esac
}

uninstall_skill() {
  local skill="$1"
  local destination_root="$2"
  local destination="$destination_root/$skill"

  assert_safe_target "$destination_root"
  assert_safe_target "$destination"

  if [[ ! -e "$destination" ]]; then
    printf 'not installed: %s\n' "$destination"
    return
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf 'would uninstall %s -> %s\n' "$skill" "$destination"
    return
  fi

  rm -rf "$destination"
  printf 'uninstalled %s -> %s\n' "$skill" "$destination"
}

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --target|--runtime)
      [[ "$#" -ge 2 ]] || fail "$1 requires a value"
      TARGET="$2"
      TARGET_WAS_SET=1
      shift 2
      ;;
    --dest|--dir)
      [[ "$#" -ge 2 ]] || fail "$1 requires a value"
      DEST="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --list)
      LIST_ONLY=1
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --*)
      fail "unknown option: $1"
      ;;
    *)
      REQUESTED+=("$1")
      shift
      ;;
  esac
done

if [[ "$LIST_ONLY" -eq 1 ]]; then
  usage
  exit 0
fi

resolve_requests
resolve_destinations

for destination_root in "${DESTINATIONS[@]}"; do
  for skill in "${RESOLVED[@]}"; do
    uninstall_skill "$skill" "$destination_root"
  done
done
