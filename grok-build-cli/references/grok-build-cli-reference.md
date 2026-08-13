# Grok Build CLI Reference

Condensed from Grok Build CLI documentation and `grok --help`:

- Installer: `curl -fsSL https://x.ai/cli/install.sh | bash`
- Windows PowerShell installer: `irm https://x.ai/cli/install.ps1 | iex`
- Official CLI entry: https://x.ai/cli
- Headless mode is `grok -p` / `--single`. Agent/ACP mode is `grok agent`.

## Install And Authentication

- Verify installation with `grok --version`.
- Interactive login: `grok login`. Device-code login: `grok login --device-auth`.
- Sign out with `grok logout`.
- For CI or environments without a browser, set `XAI_API_KEY` from console.x.ai. A stored session in `~/.grok/auth.json` takes precedence over the API key.
- Do not ask for, print, or copy `XAI_API_KEY`, `~/.grok/auth.json`, or `~/.grok/mcp_credentials.json`.

## Main Commands

```sh
grok
grok --cwd "$(pwd)"
grok -p "Prompt text"
grok -p "Prompt text" --cwd "$(pwd)" --output-format json
grok -p "Prompt text" --tools "read_file,grep,list_dir"
grok -p "Prompt text" --json-schema '{"type":"object"}'
grok --prompt-file ./prompt.txt
grok -p "Prompt text" --continue
grok -p "Prompt text" --resume <session-id>
grok login
grok login --device-auth
grok logout
grok --version
```

## Headless Mode

- `-p` / `--single` runs one prompt, prints the result, and exits. `--prompt-file` and `--prompt-json` also start headless mode.
- `--cwd` sets the working directory before project discovery.
- `--output-format` accepts `plain`, `json`, `streaming-json`, or `streaming-messages-json`.
- `json` emits one object with `text`, `stopReason`, `sessionId`, and `requestId` when the run completes.
- `--json-schema` constrains the final answer, implies `--output-format json`, and puts the validated object in `structuredOutput`.
- Do not parse `text` as the schema object. Across turns it can concatenate intermediate JSON fragments, even when `structuredOutput` is valid.
- Headless mode does not read piped stdin as the prompt. Pass large diffs or logs with command substitution or `--prompt-file`.
- `--tools` allowlists built-in tools. `--disallowed-tools` removes tools from the default set. Internal names include `read_file`, `grep`, `list_dir`, `search_replace`, and `run_terminal_cmd`.
- `--max-turns` bounds agentic loops. `--no-subagents` disables child agents.

## Sessions And Project Context

- Each `grok -p` call starts a new session by default.
- `--continue` resumes the most recent session for the current directory.
- `--resume` resumes a session by ID, or by title for the current directory when the value is not an ID.
- `GROK_HOME` overrides the default `~/.grok` data root.
- Run from the intended repository so Grok discovers `AGENTS.md`, project Skills, and local configuration.

## Skills And Rules

Grok discovers Agent Skills from:

- `.grok/skills/<name>/SKILL.md`
- `<repo-root>/.grok/skills/<name>/SKILL.md`
- `~/.grok/skills/<name>/SKILL.md`
- `.agents/skills/<name>/SKILL.md` and `~/.agents/skills/<name>/SKILL.md`
- Claude-compatible `.claude/skills/` and `~/.claude/skills/` when Claude compatibility is enabled

Grok discovers rule files from:

- `AGENTS.md` in the current directory, repository root, and `~/.grok/AGENTS.md`
- `CLAUDE.md` as a compatibility fallback

Additional Skill directories can be configured under `[skills]` in `~/.grok/config.toml`.

## Permissions And Sandbox

- Default permission mode asks before shell and write tools; read-only tools typically run without a prompt.
- `--permission-mode plan` is accepted for compatibility; prefer `--tools` to keep research and review read-only.
- `--permission-mode acceptEdits` can auto-approve file edits. `--always-approve` / `--yolo` / `--permission-mode bypassPermissions` auto-approves tool calls.
- Use `--always-approve` only after the user accepts the trust boundary. Deny rules and hooks still apply.
- `--sandbox` selects a filesystem/network sandbox profile when the local runtime supports it.

## Output Contract

Ask Grok to return:

- Mode and objective handled.
- Skills used, or reason no Skill was used.
- Files inspected or changed.
- Commands run and notable output.
- Evidence supporting conclusions.
- Assumptions and unresolved risks.
- Suggested verification steps.
