#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ALL_SKILLS=(
  design
  verify
  eng
  reflect
  external-cli
)

TARGET="agents"
TARGET_WAS_SET=0
DEST=""
FORCE=0
DRY_RUN=0
LIST_ONLY=0
GLOBAL_RULES=0
REQUESTED=()

usage() {
  cat <<'EOF'
Install selected coding-agent Skills. No selection changes no files.

Usage:
  ./install.sh <skill|group ...> [options]
  ./install.sh --list

Skills:
  design verify eng reflect external-cli

Groups:
  all          Install every Skill (explicit opt-in)
  ui           Install design
  quality      Install verify
  engineering  Install eng
  meta         Install reflect (explicit invocation only)
  adapters     Install external-cli
  delegation   Alias for adapters

Aliases (install external-cli):
  kimi-code claude-code codex-cli opencode grok-build-cli

Options:
  --target TARGET   agents (default), codex, claude, gemini, opencode, or all
  --dest DIR        Custom Skills directory; cannot be / or a system path
  --dry-run         Print operations without changing files
  --list            List available Skills and groups
  --help, -h        Show this help
  --force, -f       Replace an existing installed Skill
  --global-rules    Install the rules template into Codex global AGENTS.md only
                    (requires Node.js 18+; preserves other content and backs up changes)

Examples:
  ./install.sh design --target agents
  ./install.sh verify --dest ./local-skills --dry-run
  ./install.sh external-cli --target agents
  ./install.sh claude-code --target agents
  ./install.sh adapters --target claude
  ./install.sh all --target all --dry-run
  ./install.sh --global-rules --target codex --dry-run

Targets:
  agents    $HOME/.agents/skills
  codex     ${CODEX_HOME:-$HOME/.codex}/skills
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

# Refuse to install into or remove a protected path. Physically resolves the
# target (following symlinks and relative paths) when it exists, so the
# filesystem root, system directories directly under / (e.g. /dev, /etc, /usr),
# and symlinked roots that resolve there are all blocked regardless of how the
# path was spelled. A Skill destination is always <root>/<skill>, so it must
# never be / or a single-component path under /.
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
  ALIAS_NOTES=()
  [[ "${#REQUESTED[@]}" -gt 0 ]] || fail "choose a Skill or group explicitly; use --list"
  for request in "${REQUESTED[@]}"; do
    case "$request" in
      all)
        for skill in "${ALL_SKILLS[@]}"; do append_unique "$skill"; done
        ;;
      ui) append_unique design ;;
      quality) append_unique verify ;;
      engineering) append_unique eng ;;
      meta) append_unique reflect ;;
      delegation|adapters|external-cli) append_unique external-cli ;;
      kimi-code|claude-code|codex-cli|opencode|grok-build-cli)
        append_unique external-cli
        ALIAS_NOTES+=("$request")
        ;;
      dev|clarify|qa|acceptance|workflow|planning)
        fail "retired Skill or group: $request; use verify for requested checks, or work directly. See README migration notes."
        ;;
      design|verify|eng|reflect) append_unique "$request" ;;
      *) fail "unknown Skill or group: $request" ;;
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

  assert_safe_target "$destination_root"
  assert_safe_target "$destination"

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

if [[ "$#" -eq 0 ]]; then
  usage
  exit 0
fi

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
    --global-rules)
      GLOBAL_RULES=1
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

if [[ "$GLOBAL_RULES" -eq 1 ]]; then
  [[ "${#REQUESTED[@]}" -eq 0 && "$FORCE" -eq 0 ]] || fail "--global-rules cannot be combined with Skills/groups or --force"
  [[ "$TARGET_WAS_SET" -eq 0 || "$TARGET" == "codex" ]] || fail "--global-rules currently supports --target codex only"
  command -v node >/dev/null 2>&1 || fail "--global-rules requires Node.js 18+"
  exec node "$ROOT/scripts/install-global-rules.mjs" "${DEST:-${CODEX_HOME:-$HOME/.codex}}" "$DRY_RUN"
fi

resolve_requests
resolve_destinations

for destination_root in "${DESTINATIONS[@]}"; do
  for skill in "${RESOLVED[@]}"; do
    install_skill "$skill" "$destination_root"
  done
done

if [[ "${#ALIAS_NOTES[@]}" -gt 0 ]]; then
  printf 'note: %s now install external-cli. Remove leftover old adapter directories with ./uninstall.sh %s\n' "${ALIAS_NOTES[*]}" "${ALIAS_NOTES[*]}"
fi
