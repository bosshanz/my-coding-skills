# Kimi Code

Official docs: [getting started](https://www.kimi.com/code/docs/en/kimi-code-cli/getting-started.html), [kimi command](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-command.html). Confirm flags with `kimi --help`.

## Install and authentication

- macOS/Linux: `curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash`
- Windows PowerShell: `irm https://code.kimi.com/kimi-code/install.ps1 | iex`
- npm: `npm install -g @moonshot-ai/kimi-code` (follow the current official Node version)
- Verify with `kimi --version`.
- Login: `kimi login` (device-code) or interactive `/login`. Supports Kimi Code OAuth and a Kimi platform API key. `/logout` or the documented logout command clears credentials.
- Do not ask for or print API keys.

## Headless (default)

```sh
kimi -p "Mode: research-only. Inspect this repository. Do not edit files. Return evidence, assumptions, and unresolved risks."
```

```sh
kimi -p "List the changed files and the purpose of each change." --output-format stream-json
```

- `--prompt` / `-p` runs one prompt and streams the assistant to stdout. It does not open the TUI. Non-interactive `-p` uses auto permission; static deny rules still apply.
- `--output-format` is `text` or `stream-json`, and only with `-p`.
- `--continue` / `-c` resumes the latest session for this directory. `--session` / `-S` resumes a chosen or specified session. Do not combine `--continue` with `--session`.
- `--yolo` / `-y` is Ask When Needed: ordinary tools may run without a prompt; risky actions, questions, and plans can still ask. `--auto` is Never Ask. Do not combine `--yolo` with `--auto`.
- `--plan` starts Plan mode (read-only exploration first).
- `-p` cannot be combined with `--yolo`, `--auto`, or `--plan`.
- Resume may take `--auto`, `--yolo`, or `--plan` to override the saved mode.
- `--model` / `-m` selects a model alias. `--add-dir` adds a workspace directory. `--agent` / `--agent-file` select a profile for a new session and cannot combine with `--session` / `--continue`.
- `--skills-dir` replaces auto-discovered Kimi skill directories for this launch; repeatable.

Interactive `kimi` only when the user wants the TUI.

## ACP

`kimi acp` runs Kimi as an ACP server over stdio. Use it only when a real ACP client will drive the session. `--login` on that command runs device-code login for ACP terminal-auth.

## Local data

Default root `~/.kimi-code/`; override with `KIMI_CODE_HOME`. User skills: `~/.kimi-code/skills/`, `~/.agents/skills/`. Project skills: `.kimi-code/skills/`, `.agents/skills/`.
