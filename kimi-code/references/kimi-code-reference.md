# Kimi Code Reference

Condensed from the official Kimi Code CLI documentation:

- Getting started: https://moonshotai.github.io/kimi-code/zh/guides/getting-started
- Command reference: https://moonshotai.github.io/kimi-code/zh/reference/kimi-command
- Kimi Agent Skills: https://moonshotai.github.io/kimi-code/zh/customization/skills

## Install And Login

- Recommended macOS/Linux install: `curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash`
- Windows PowerShell install: `irm https://code.kimi.com/kimi-code/install.ps1 | iex`
- npm install: `npm install -g @moonshot-ai/kimi-code`
- npm requires Node.js 24.15.0 or newer.
- Verify with `kimi --version`.
- First login is interactive: run `kimi`, then `/login`.
- `/login` supports Kimi Code OAuth and Moonshot AI Open Platform API key login.
- `/logout` clears current credentials.

## Main Commands

```sh
kimi
kimi --continue
kimi --session
kimi --session <id>
kimi --plan
kimi --auto
kimi --yolo
kimi -p "Prompt text"
kimi -p "Prompt text" --output-format stream-json
kimi --skills-dir /path/to/skills
kimi export -y
kimi export <sessionId> -o ./bug-report.zip --no-include-global-log
kimi migrate
```

## Flag Notes

- `--prompt` / `-p` runs a single non-interactive prompt and streams assistant output to stdout.
- `--output-format stream-json` is only valid with `--prompt`.
- `--continue` / `-C` resumes the latest session for the current directory.
- `--session` / `-S` resumes a chosen or specified session.
- `--plan` starts a new Plan-mode session.
- `--model` / `-m` selects a model alias for this launch.
- `--yolo` auto-approves ordinary tool calls, including file writes and shell commands.
- `--auto` starts auto permission mode where tool approvals are handled automatically.
- `--skills-dir` replaces automatically discovered user and project Kimi Skill directories; repeat it to mount multiple dirs.

## Incompatible Flag Combinations

- Do not combine `--continue` with `--session`.
- Do not combine `--yolo` or `--auto` with `--continue` or `--session`.
- Do not combine `--auto` with `--yolo`.
- Do not combine `--plan` with `--continue` or `--session`.
- Do not combine `--prompt` with `--yolo`, `--auto`, or `--plan`.
- Use `--output-format` only with `--prompt`.

## Local Data And Skills

- Default data root: `~/.kimi-code/`
- Override data root: `KIMI_CODE_HOME=/path/to/root`
- User Kimi Skills: `~/.kimi-code/skills/`, `~/.agents/skills/`
- Project Kimi Skills: `.kimi-code/skills/`, `.agents/skills/`
- Extra Kimi Skill dirs in `config.toml`: `extra_skill_dirs = ["~/team-skills", ".agents/team-skills"]`

## Kimi Skill Frontmatter

```markdown
---
name: code-style
description: Project code style and review rules
type: prompt
whenToUse: Use when editing or reviewing source code
arguments:
  - target
---
```

Directory-form Kimi Skills use `<name>/SKILL.md`; flat skills may be a single `<name>.md`.
