# Platform Compatibility

## Format And Discovery Are Different

The [Agent Skills specification](https://agentskills.io/specification) defines the
portable Skill directory format, including `SKILL.md`. It does not require every
compatible client to scan one universal user-level directory.

Use `$HOME/.agents/skills` as this repository's recommended shared installation
location. Codex officially discovers user Skills there. Other clients may require
their own discovery directory, so the installer also supports runtime-specific
targets.

## Documented Runtime Targets

| Runtime | Skill path | Notes |
| --- | --- | --- |
| Shared / Codex | `$HOME/.agents/skills/<skill-name>` | Recommended default. Codex discovers this user-level path. |
| Codex legacy | `${CODEX_HOME:-$HOME/.codex}/skills/<skill-name>` | Retained for backward compatibility. |
| Claude Code | `$HOME/.claude/skills/<skill-name>` | Directory skills with `SKILL.md`. |
| Gemini CLI | `$HOME/.gemini/skills/<skill-name>` | Runtime-specific user Skill directory. |
| OpenCode | `$HOME/.config/opencode/skills/<skill-name>` | Runtime-specific user Skill directory. |

## Planned Or Unverified Targets

These runtimes may be compatible with the same Skill folder pattern, but this repository should not claim full support until install and smoke tests are documented:

- Cursor Agent
- Qwen Code
- Cline
- RooCode
- Windsurf

## Compatibility Rules

- Keep each Skill as a top-level directory containing `SKILL.md`; do not hide adapters under a second-level `agent-adapters/` directory unless every target runtime is verified to recursively discover nested Skills.
- Keep runtime-specific metadata optional. `agents/openai.yaml` improves Codex display but must not be required for other runtimes.
- Do not describe `$HOME/.agents/skills` as a universal discovery path. It is the recommended shared location in this repository and an official Codex path; Claude Code, Gemini CLI, and OpenCode retain explicit runtime targets.
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
