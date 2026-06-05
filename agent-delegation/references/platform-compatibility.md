# Platform Compatibility

## Verified Runtime Targets

This repository currently documents install paths and usage patterns for:

| Runtime | Skill path | Notes |
| --- | --- | --- |
| Codex | `${CODEX_HOME:-$HOME/.codex}/skills/<skill-name>` | Uses `agents/openai.yaml` for UI metadata. |
| Claude Code | `$HOME/.claude/skills/<skill-name>` | Directory skills with `SKILL.md`. |
| OpenCode | `$HOME/.config/opencode/skills/<skill-name>` or `$HOME/.claude/skills/<skill-name>` | Supports directory-style Skills. |

## Planned Or Unverified Targets

These runtimes may be compatible with the same Skill folder pattern, but this repository should not claim full support until install and smoke tests are documented:

- Cursor Agent
- Gemini CLI
- Qwen Code
- Cline
- RooCode
- Windsurf

## Compatibility Rules

- Keep each Skill as a top-level directory containing `SKILL.md`; do not hide adapters under a second-level `agent-adapters/` directory unless every target runtime is verified to recursively discover nested Skills.
- Keep runtime-specific metadata optional. `agents/openai.yaml` improves Codex display but must not be required for other runtimes.
- Prefer bundled scripts with relative instructions such as “run this script from the Skill directory”; do not depend on undocumented runtime-provided environment variables.
- Treat external target CLI availability as runtime-specific. A Skill may be installed even when the target CLI is missing; the adapter must report that explicitly.

## Smoke Test Checklist

For each runtime before marking it verified:

1. Install all Skill directories into the runtime's discovery path.
2. Confirm `agent-delegation` can be explicitly invoked.
3. Confirm a normal coding request can auto-match `dev-workflow`.
4. Confirm explicit requests for Kimi Code, Claude Code, and Codex CLI select the matching adapter.
5. Run `agent-delegation/scripts/agent-delegation-doctor.sh` from the repository or installed Skill collection.
6. Confirm missing target CLIs are reported as unavailable, not simulated.
