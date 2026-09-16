# OpenCode

Official docs: [CLI commands](https://opencode.ai/v2/docs/cli/commands/), [skills](https://opencode.ai/docs/skills/), [rules](https://opencode.ai/docs/rules/). Confirm flags with `opencode run --help`.

## Install and authentication

- Follow the current official setup for the user's OS.
- Verify with `opencode --version`.
- Configure providers with `opencode auth login` (`opencode providers` is the same command group). Inspect with `opencode auth list` or `opencode auth ls`.
- Do not ask for, print, or copy tokens, API keys, `.env` values, or `~/.local/share/opencode/auth.json`.

## Headless (default)

```sh
opencode run \
  --dir "$(pwd)" \
  "Mode: research-only. Inspect this repository. Do not edit files. Return evidence, assumptions, and unresolved risks."
```

```sh
opencode run \
  --dir "$(pwd)" \
  --format json \
  "Mode: review-only. Review the current diff. Do not edit files. Return actionable findings with paths."
```

```sh
opencode run \
  --dir "$(pwd)" \
  --agent plan \
  "Mode: propose-only. Compare implementation options. Do not edit files."
```

- `opencode run [message..]` is the non-interactive entry. `--dir` sets the working directory.
- `--format json` emits raw JSON events. `--file` attaches files. `--agent` selects an OpenCode agent such as `plan` when configured.
- `--continue` / `-c` and `--session` / `-s` continue a previous session. `--fork` copies that session first.
- `--variant` sets provider-specific reasoning effort when the model supports it.
- `--auto` auto-approves permissions that are not explicitly denied; use it only when the user accepts the trust boundary. Deny rules still block.
- `--attach` connects to an existing `opencode serve` instance.

Interactive `opencode` only when the user wants the TUI. `opencode --mini` starts the minimal interface when available.

## ACP

`opencode acp` runs OpenCode as an ACP server. Use it only when a real ACP client will drive the session.

## Skills and rules

Skills: `.opencode/skills/`, `~/.config/opencode/skills/`, `.agents/skills/`, `~/.agents/skills/`, and Claude-compatible `.claude/skills/` / `~/.claude/skills/`. Rules: repository `AGENTS.md`, `~/.config/opencode/AGENTS.md`, and `CLAUDE.md` as a compatibility fallback.
