# Claude Code

Official docs: [CLI reference](https://docs.claude.com/en/docs/claude-code/cli-reference), [headless](https://code.claude.com/docs/en/headless), [permissions](https://code.claude.com/docs/en/permissions). Confirm flags with `claude --help`.

## Install and authentication

- Follow the current official setup for the user's OS.
- Verify with `claude --version`. Inspect login with `claude auth status`.
- Do not ask for, print, or copy tokens or API keys.

## Headless (default)

```sh
claude -p "Mode: research-only. Inspect this repository. Do not edit files. Return evidence, assumptions, and unresolved risks." \
  --permission-mode plan \
  --output-format json
```

```sh
git diff --no-ext-diff | claude -p "Mode: review-only. Review this diff. Do not edit files. Return actionable findings with paths." \
  --output-format json
```

```sh
claude -p "List the changed files and the purpose of each change." \
  --output-format json \
  --json-schema '{"type":"object","properties":{"files":{"type":"array","items":{"type":"string"}}},"required":["files"]}'
```

- `-p` / `--print` runs one prompt and exits. Stdin can carry a diff or log.
- `--output-format` is `text`, `json`, or `stream-json`. Pair `--json-schema` with `json`.
- `--permission-mode plan` for static research and review. `acceptEdits` may fit bounded implementation. `dontAsk` auto-denies anything not already allowed; use it only with an explicit allowlist. Avoid `bypassPermissions` and `--dangerously-skip-permissions` unless the user accepts the risk in an isolated environment.
- `--max-turns` and `--max-budget-usd` bound automation. `--no-session-persistence` skips saving a print-mode session.
- `--bare` skips auto-discovered hooks, plugins, MCP, auto-memory, and `CLAUDE.md`; pass needed context explicitly.
- `--continue` resumes the latest session in this directory. `--resume` takes a session id or name. `--fork-session` creates a new id while resuming.

Interactive `claude` only when the user wants the TUI.

## ACP

Claude Code has no `claude acp` command. An ACP client can spawn `npx -y @agentclientprotocol/claude-agent-acp`. Use ACP only for a client-driven session or editor embedding, not for one-shot dispatch.
