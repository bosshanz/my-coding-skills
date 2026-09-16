# Grok Build

Official docs: [CLI reference](https://x.ai/docs/build/cli/reference), [overview](https://docs.x.ai/build/overview). Confirm flags with `grok --help`.

## Install and authentication

- macOS/Linux: `curl -fsSL https://x.ai/cli/install.sh | bash`
- Windows PowerShell: `irm https://x.ai/cli/install.ps1 | iex`
- npm: `npm i -g @xai-official/grok`
- Verify with `grok --version`. Update with `grok update`.
- Interactive login: `grok login`. Headless/device-code: `grok login --device-auth`. Sign out: `grok logout`.
- CI may set `XAI_API_KEY`. A stored `~/.grok/auth.json` session takes precedence over the API key.
- Do not ask for, print, or copy `XAI_API_KEY`, `~/.grok/auth.json`, or `~/.grok/mcp_credentials.json`.

## Headless (default)

```sh
grok -p "Mode: research-only. Inspect this repository. Do not edit files. Return evidence, assumptions, and unresolved risks." \
  --cwd "$(pwd)" \
  --tools "read_file,grep,list_dir" \
  --output-format json \
  --max-turns 16 \
  --no-subagents
```

```sh
grok -p "Mode: review-only. Review this diff.

$(git diff --no-ext-diff)

Do not edit files. Return actionable findings with paths." \
  --cwd "$(pwd)" \
  --tools "read_file,grep,list_dir" \
  --output-format json \
  --max-turns 16 \
  --no-subagents
```

- `-p` / `--single` prints one result and exits. `--prompt-file` for a large prompt. Headless mode does not treat piped stdin as the prompt.
- `--output-format` is `plain`, `json`, `streaming-json`, or `streaming-messages-json`. `--json-schema` implies `json` and puts the validated object in `structuredOutput`; do not parse `text` as that object.
- `--tools` allowlists built-in tools (`read_file`, `grep`, `list_dir`, `search_replace`, `run_terminal_cmd`). `--disallowed-tools` removes tools. `--allow` / `--deny` are permission-rule aliases.
- `--max-turns` bounds the loop. `--no-subagents` disables child agents. `--no-plan` disables plan mode.
- `--continue` / `-c` resumes the latest session for this directory. `--resume` takes an id or title. `--fork-session` creates a new id while resuming. `--worktree` starts in a new git worktree.
- `--permission-mode plan` for research/review when useful; prefer `--tools` to keep a run read-only. `--always-approve` / `--yolo` / `bypassPermissions` only after the user accepts the trust boundary. `dontAsk` auto-denies anything that would prompt.
- `grok inspect` shows discovered rules, skills, plugins, hooks, and MCP for this directory.

Interactive `grok` only when the user wants the TUI.

## ACP

`grok agent stdio` runs Grok as an ACP server over JSON-RPC. Use it only when a real ACP client will drive the session. For one-shot work stay on `grok -p`.
