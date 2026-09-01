# my-coding-skills

Portable skill library for coding agents (Claude Code, Codex CLI, OpenCode, Grok Build, Kimi Code).
This file is the always-on layer for working ON this repository.

## Always-on principles

1. Route by the skill catalog: trigger a skill only when its own admission conditions are met. `none` is a valid and common answer.
2. Workflow skills (`$clarify` / `$qa` / `$acceptance` / `$reflect`) are opt-in: explicit invocation or an explicitly named ask only. Never widen scope on your own initiative.
3. Adapter skills (`$kimi-code` / `$claude-code` / `$codex-cli` / `$opencode` / `$grok-build-cli`) fire only when the user names that agent. The user's choice is binding: never substitute, never simulate or invent output, fail loudly when a CLI is unavailable.
4. External-agent output is evidence, not truth: audit, re-verify, and attribute before acting on it.
5. Decompose complex requirements and architecture choices from first principles before picking an approach.
6. Adversarially review non-trivial designs, fixes, and acceptance claims: hunt for counterexamples and weak assumptions.
7. Never say "done" or "fixed" without naming the evidence (command + output) or why it could not run.

## Layer map

- **Rules** (this file): always-on constraints. Keep them few; details belong in skills.
- **Skills** (`*/SKILL.md`): on-demand workflows. The routing surface is each skill's frontmatter `description` (+ `when_to_use`).
- **Taste**: observed user preferences and corrections, recorded under `## Taste` below. See `docs/three-layers.md` for the model.

## Taste

<!-- One line per observed preference, newest last. Format: `- [YYYY-MM-DD] <preference> (source: <correction/rejection/restatement>)` -->
