#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ALL_SKILLS=(
  agent-delegation
  dev-workflow
  kimi-code
  claude-code
  codex-cli
)

TARGET="all"
TARGET_WAS_SET=0
DEST=""
FORCE=0
DRY_RUN=0
LIST_ONLY=0
REQUESTED=()

usage() {
  cat <<'EOF'
Install this repository's coding-agent Skills.

Usage:
  ./install.sh [skill|group ...] [options]
  ./install.sh --list

Skills:
  agent-delegation
  dev-workflow
  kimi-code
  claude-code
  codex-cli

Groups:
  all          Install every Skill (default)
  workflow     Install dev-workflow
  delegation   Install agent-delegation and all external-agent adapters
  adapters     Install kimi-code, claude-code, and codex-cli

Options:
  --target TARGET   agents, codex, claude, gemini, opencode, or all
                    (default: all)
  --dest DIR        Install into a custom Skills directory
  --force, -f       Replace an existing installed Skill
  --dry-run         Print operations without changing files
  --list            List available Skills and groups
  --help, -h        Show this help

Examples:
  ./install.sh
  ./install.sh dev-workflow --target agents
  ./install.sh delegation --target claude --force
  ./install.sh all --target gemini --force
  ./install.sh all --target all --force
  ./install.sh dev-workflow --dest /tmp/skills --dry-run

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
  printf 'install: %s\n' "$*" >&2
  exit 1
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
        append_unique dev-workflow
        ;;
      delegation)
        append_unique agent-delegation
        append_unique kimi-code
        append_unique claude-code
        append_unique codex-cli
        ;;
      adapters)
        append_unique kimi-code
        append_unique claude-code
        append_unique codex-cli
        ;;
      agent-delegation|dev-workflow|kimi-code|claude-code|codex-cli)
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

install_skill() {
  local skill="$1"
  local destination_root="$2"
  local source="$ROOT/$skill"
  local destination="$destination_root/$skill"

  [[ -f "$source/SKILL.md" ]] || fail "missing source Skill: $source/SKILL.md"

  if [[ -e "$destination" && "$FORCE" -ne 1 ]]; then
    fail "destination already exists: $destination (use --force to replace it)"
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf 'would install %s -> %s\n' "$skill" "$destination"
    return
  fi

  mkdir -p "$destination_root"
  if [[ -e "$destination" ]]; then
    rm -rf "$destination"
  fi
  cp -R "$source" "$destination"
  printf 'installed %s -> %s\n' "$skill" "$destination"
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
    --force|-f)
      FORCE=1
      shift
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
    install_skill "$skill" "$destination_root"
  done
done
