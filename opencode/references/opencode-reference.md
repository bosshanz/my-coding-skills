# OpenCode Reference

Condensed from official OpenCode documentation:

- CLI reference: https://opencode.ai/docs/cli/
- Agent Skills: https://opencode.ai/docs/skills/
- Rules / instructions: https://opencode.ai/docs/rules/
- Server: https://opencode.ai/docs/server/
- Troubleshooting: https://opencode.ai/docs/troubleshooting/

## Install And Authentication

- Use the current official setup instructions for the user's operating system.
- Verify installation with `opencode --version`.
- Configure model/provider credentials with `opencode auth login`.
- Inspect configured providers with `opencode auth list` or `opencode auth ls`.
- Do not ask for, print, or copy authentication tokens, API keys, `.env` values, or `~/.local/share/opencode/auth.json`.

## Main Commands

```sh
opencode
opencode [project]
opencode --continue
opencode --session <session-id>
opencode run "Prompt text"
opencode run --dir "$(pwd)" "Prompt text"
opencode run --format json "Prompt text"
opencode run --agent plan "Prompt text"
opencode run --file ./artifact.png "Prompt text"
opencode run --continue "Prompt text"
opencode run --session <session-id> "Prompt text"
opencode auth login
opencode auth list
opencode models
opencode serve
```

## Run Mode

- `opencode` without a command starts the terminal UI.
- `opencode run [message..]` runs a prompt non-interactively for scripts, automation, and direct terminal delegation.
- `--dir` selects the working directory for the run.
- `--format json` emits raw JSON events.
- `--agent` selects an OpenCode agent such as `plan` when configured.
- `--file` attaches files to the prompt.
- `--continue` and `--session` continue previous sessions.
- `--attach` can connect a run to an existing `opencode serve` instance.
- `--auto` auto-approves permissions that are not explicitly denied; use it only when the user accepts the trust boundary.

## Skills And Rules

OpenCode discovers Agent Skills from:

- `.opencode/skills/<name>/SKILL.md`
- `~/.config/opencode/skills/<name>/SKILL.md`
- `.claude/skills/<name>/SKILL.md`
- `~/.claude/skills/<name>/SKILL.md`
- `.agents/skills/<name>/SKILL.md`
- `~/.agents/skills/<name>/SKILL.md`

OpenCode discovers rule files from:

- `AGENTS.md` in the repository tree.
- `~/.config/opencode/AGENTS.md`.
- Claude-compatible `CLAUDE.md` files when compatibility is enabled.

OpenCode can also load extra instruction files through `opencode.json` or `~/.config/opencode/opencode.json`.

## Output Contract

Ask OpenCode to return:

- Mode and objective handled.
- Skills used, or reason no Skill was used.
- Files inspected or changed.
- Commands run and notable output.
- Evidence supporting conclusions.
- Assumptions and unresolved risks.
- Suggested verification steps.

## Local Caveat

In this repository's current runtime, `/Users/andy/.opencode/bin/opencode` exists, but simple commands such as `opencode --version`, `opencode run --help`, and `opencode auth list` exited with signal 137 during creation of this adapter. Treat that as a local runtime problem until verified in a normal terminal.
