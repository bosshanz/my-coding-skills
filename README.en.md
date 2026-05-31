# My Coding Skills

Andy's personal skills repository for publishing, reuse, and ongoing iteration.  
中文主版本: [README.md](./README.md)

## Included Skill

The repository currently includes two primary skills:

### `andy-coding`

This is a personal full-stack delivery skill focused on:

- Planning and solution design before implementation
- Option comparison and recommendation for non-trivial tasks
- Frontend design, UI design, and interaction design
- Backend research, architecture design, and middleware decisions
- Delivery across Python, Node, and Go
- Verification, Chinese-language delivery notes, and concise documentation updates
- Diagrams for architecture and workflow design, preferably Mermaid

### `kimi-code`

This skill lets Codex dispatch Kimi Code CLI for coding or research work, focused on:

- Dispatching Kimi Code as an external coding agent
- Repository research, failure analysis, approach comparison, and independent review
- Scoped implementation tasks, refactors, test additions, and terminal automation
- Having Codex review Kimi's diff, run verification, and deliver the final conclusion
- Kimi Code setup, login, sessions, skill directories, and command reference

## Compatibility

This repository is compatible with:

- `Codex`
- `Claude Code`
- `OpenCode`

Compatibility mapping:

- `Codex` uses `andy-coding/SKILL.md`
- `Codex` uses `kimi-code/SKILL.md`
- `Claude Code` uses `andy-coding/SKILL.md`
- `Claude Code` uses `kimi-code/SKILL.md`
- `OpenCode` uses `andy-coding/SKILL.md`
- `OpenCode` uses `kimi-code/SKILL.md`

Notes:

- `agents/openai.yaml` mainly provides better UI metadata for Codex.
- `SKILL.md` and `references/` contain the shared portable content for all three runtimes.
- `Claude Code` and `OpenCode` both support directory-based `SKILL.md` skills.

## Repository Structure

```text
andy-coding/
  SKILL.md
  agents/openai.yaml
  references/
    stack.md
    design-and-research.md
    documentation.md
kimi-code/
  SKILL.md
  agents/openai.yaml
  references/
    kimi-code-reference.md
  scripts/
    kimi-code-status.sh
LICENSE
README.md
README.en.md
```

## Installation

### 1. Install for Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R andy-coding "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R kimi-code "${CODEX_HOME:-$HOME/.codex}/skills/"
```

### 2. Install for Claude Code

```bash
mkdir -p "$HOME/.claude/skills"
cp -R andy-coding "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
```

### 3. Install for OpenCode

You can choose either option:

Option A, use the native OpenCode directory:

```bash
mkdir -p "$HOME/.config/opencode/skills"
cp -R andy-coding "$HOME/.config/opencode/skills/"
cp -R kimi-code "$HOME/.config/opencode/skills/"
```

Option B, reuse the Claude Code directory:

```bash
mkdir -p "$HOME/.claude/skills"
cp -R andy-coding "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
```

## Recommended Setup

If you want one skill to work across `Codex`, `Claude Code`, and `OpenCode`, keep this repository in any development directory and then copy or symlink the skill into each runtime's discovery path.

The lowest-maintenance setup is:

1. Install `Codex` to `${CODEX_HOME:-$HOME/.codex}/skills/<skill-name>`
2. Install `Claude Code` to `~/.claude/skills/<skill-name>`
3. Install `OpenCode` to `~/.config/opencode/skills/<skill-name>`
4. If you prefer OpenCode's Claude-compatible path, install it to `~/.claude/skills/<skill-name>`

## Usage

### Codex

You can invoke it explicitly:

```text
Use $andy-coding to implement a new feature with a brief plan first, then verify it and update docs.
```

```text
Use $kimi-code to dispatch Kimi Code for a scoped repository research task.
```

### Claude Code

Claude Code discovers and loads matching skills on demand. After installation, it can trigger automatically or be invoked explicitly.

Explicit example:

```text
/andy-coding
```

```text
/kimi-code
```

### OpenCode

OpenCode discovers and loads matching skills on demand. Once installed in a supported directory, normal task prompts can trigger it.

## Default Behavior

This skill defaults to:

- Chinese for plans, design notes, and delivery documents
- Original language for code, commands, protocol names, and configuration keys
- Lightweight diagrams for architecture and process design
- Explicit verification steps and plain-language acceptance conclusions before delivery

## License

This repository is licensed under the [MIT License](./LICENSE).
