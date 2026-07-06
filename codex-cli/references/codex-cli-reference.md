# Codex CLI Reference

Condensed from official OpenAI Codex documentation:

- CLI overview: https://developers.openai.com/codex/cli
- Command line options: https://developers.openai.com/codex/cli/reference
- Non-interactive mode: https://developers.openai.com/codex/noninteractive
- Authentication: https://developers.openai.com/codex/auth
- Configuration: https://developers.openai.com/codex/config-basic

## Install And Authentication

- Use the current official CLI installation instructions.
- Verify installation with `codex --version`.
- Use `codex login` for interactive authentication and `codex login status` to inspect status.
- For programmatic workflows such as CI, follow the official API key guidance.
- Do not ask for, print, or copy tokens, API keys, or `auth.json` contents.

## Main Commands

```sh
codex
codex exec "Prompt text"
codex exec -C /path/to/repo --sandbox read-only "Prompt text"
codex exec --json "Prompt text"
codex exec --output-schema ./schema.json --output-last-message ./result.json "Prompt text"
codex exec resume --last "Continue the task"
codex login status
```

## Non-Interactive Exec Mode

- `codex exec` runs a task non-interactively.
- `-C` / `--cd` selects the working directory before the task begins.
- `--json` prints newline-delimited JSON events instead of formatted text.
- `--output-last-message` writes the assistant's final message to a file.
- `--output-schema` supplies a JSON Schema for the expected final response shape.
- `codex exec resume` continues a non-interactive session; `--last` selects the most recent session for the current working directory.
- Use stdin when a script needs to pass a large prompt, diff, or log safely.

## Sandbox And Approvals

- `--sandbox read-only` is the default choice for research and review.
- `--sandbox workspace-write` allows edits inside the workspace for implementation.
- `--sandbox danger-full-access` should be rare and explicitly justified.
- `--ask-for-approval never` is appropriate for non-interactive runs only when the sandbox and environment provide sufficient safety.
- Avoid `--dangerously-bypass-approvals-and-sandbox` / `--yolo` unless the user explicitly accepts the risk and the environment is externally hardened.

## Configuration And Project Context

- Codex inherits defaults from `~/.codex/config.toml`; `-c key=value` overrides configuration for one invocation.
- `CODEX_HOME` changes the Codex data and configuration root.
- Run from the intended repository so Codex discovers applicable `AGENTS.md` files and project Skills.
- Use the current CLI help and official reference for flags because capabilities evolve over time.

## Output Contract

Ask Codex to return:

- Mode and objective handled.
- Skills used, or reason no Skill was used.
- Files inspected or changed.
- Commands run and notable output.
- Evidence supporting conclusions.
- Assumptions and unresolved risks.
- Suggested verification steps.
