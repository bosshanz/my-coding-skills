# Claude Code Reference

Condensed from official Claude Code documentation:

- Setup: https://code.claude.com/docs/en/setup
- CLI reference: https://code.claude.com/docs/en/cli-reference
- Programmatic usage: https://code.claude.com/docs/en/headless
- Authentication: https://code.claude.com/docs/en/authentication
- Permissions: https://code.claude.com/docs/en/permissions

## Install And Authentication

- Use the current official setup instructions for the user's operating system.
- Verify installation with `claude --version`.
- Inspect authentication state with `claude auth status`.
- Do not ask for, print, or copy authentication tokens or API keys.

## Main Commands

```sh
claude
claude -p "Prompt text"
claude -p "Prompt text" --output-format json
claude -p "Prompt text" --output-format stream-json --verbose
claude -p "Prompt text" --json-schema '{"type":"object"}' --output-format json
claude --continue
claude --resume <session-id-or-name>
claude auth status
```

## Print Mode

- `--print` / `-p` runs a non-interactive prompt and prints the result.
- `--output-format` accepts `text`, `json`, or `stream-json` in print mode.
- `--json-schema` requests validated structured output and should be paired with `--output-format json`.
- `--max-turns` and `--max-budget-usd` can bound automation runs.
- `--no-session-persistence` prevents a print-mode session from being saved.
- Use stdin to provide diffs, logs, or other large task context when useful.

## Sessions And Configuration

- `--continue` resumes the most recent conversation in the current directory.
- `--resume` resumes a specific session by ID or name, or opens a picker in interactive use.
- Run from the intended repository directory so Claude Code can discover project instructions and configuration.
- Use `--bare` only when reproducible automation should skip auto-discovered hooks, skills, plugins, MCP servers, auto memory, and `CLAUDE.md` files.

## Permissions

- `--permission-mode plan` is a good default for research and review.
- `--permission-mode acceptEdits` may be appropriate for bounded implementation.
- `--allowedTools` and `--disallowedTools` narrow tool access for a run.
- Avoid `bypassPermissions` and `--dangerously-skip-permissions` unless the user explicitly accepts the risk and the environment is externally isolated.

## Output Contract

Ask Claude Code to return:

- Mode and objective handled.
- Skills used, or reason no Skill was used.
- Files inspected or changed.
- Commands run and notable output.
- Evidence supporting conclusions.
- Assumptions and unresolved risks.
- Suggested verification steps.
