# Agent Delegation Skills

A portable collection of development workflow and agent delegation skills for Codex, Claude Code, OpenCode, and other terminal-capable coding agents.

The repository lets a caller agent explicitly delegate work to external agents such as Kimi Code, Claude Code CLI, or Codex CLI, then review, integrate, and verify the result.

Core principles:

- If the user names a target agent, invoke that target agent.
- If the target is unavailable, fail explicitly; do not silently substitute.
- Never simulate, impersonate, or fabricate the target agent's output.
- Delegated results must remain auditable, reviewable, and verifiable.

中文主版本: [README.md](./README.md)

## Included Skills

The repository currently includes five primary skills:

### `agent-delegation`

This is the shared entry point for external-agent delegation, focused on:

- Explicit delegation priority: user choice first, project policy second, and authorized task-based routing only
- No simulated calls, silent fallback, or unauthorized external-agent dispatch
- A common structure for target-agent output, caller review, invocation evidence, and final delivery
- Permission, credential, failure, one-hop delegation, and same-agent child-process rules
- A lightweight doctor script for Skill structure, old paths, script permissions, and target CLI availability

### `dev-workflow`

This is a lightweight full-stack delivery skill with a generic name, focused on:

- Clarification and lightweight solution design before implementation
- Option comparison and recommendation for non-trivial tasks
- Frontend design, UI design, interaction design, state ownership, accessibility, and performance debugging paths
- Backend research, architecture design, capacity estimation, API/event contracts, migrations, failure modes, and middleware decisions
- Delivery across Python, Node, and Go
- Test-first RED-GREEN-REFACTOR for behavior changes when practical
- Reproduction and root-cause analysis before bug fixes
- Diff review, verification, Chinese-language delivery notes, and concise documentation updates
- Diagrams for architecture and workflow design, preferably Mermaid

Trigger guidance: ordinary coding, bug fixing, refactoring, debugging, testing, review, documentation, UI design, backend research, and architecture tasks should trigger `dev-workflow` by default without requiring the user to explicitly write `$dev-workflow`. Use `agent-delegation` or an Adapter only when the user explicitly asks for Kimi, Claude Code, Codex CLI, or another external agent.

### `kimi-code`

This skill lets another agent dispatch Kimi Code CLI for coding or research work, focused on:

- Dispatching Kimi Code as an external coding agent
- Repository research, failure analysis, approach comparison, and independent review
- Scoped implementation tasks, refactors, test additions, and terminal automation
- Having the calling agent review Kimi's diff, run verification, and deliver the final conclusion
- Kimi Code setup, login, sessions, skill directories, and command reference

### `claude-code`

This skill lets another agent dispatch Claude Code CLI, focused on:

- Repository research, independent review, scoped implementation, and terminal automation
- Non-interactive print mode, structured output, sessions, and permission controls
- Safe permission defaults and calling-agent review of results
- Claude Code setup, authentication, permissions, and command reference

### `codex-cli`

This skill lets another agent dispatch Codex CLI, focused on:

- Repository research, independent review, scoped implementation, and terminal automation
- `codex exec`, sandboxing, approvals, structured output, and session resume
- Least-privilege sandbox defaults and calling-agent review of results
- Codex CLI setup, authentication, configuration, and command reference

## Compatibility

This repository is compatible with:

- `Codex`
- `Claude Code`
- `OpenCode`

Compatibility mapping:

- `Codex` uses `agent-delegation/SKILL.md`
- `Codex` uses `dev-workflow/SKILL.md`
- `Codex` uses `kimi-code/SKILL.md`
- `Codex` uses `claude-code/SKILL.md`
- `Codex` uses `codex-cli/SKILL.md`
- `Claude Code` uses `agent-delegation/SKILL.md`
- `Claude Code` uses `dev-workflow/SKILL.md`
- `Claude Code` uses `kimi-code/SKILL.md`
- `Claude Code` uses `claude-code/SKILL.md`
- `Claude Code` uses `codex-cli/SKILL.md`
- `OpenCode` uses `agent-delegation/SKILL.md`
- `OpenCode` uses `dev-workflow/SKILL.md`
- `OpenCode` uses `kimi-code/SKILL.md`
- `OpenCode` uses `claude-code/SKILL.md`
- `OpenCode` uses `codex-cli/SKILL.md`

Notes:

- `agents/openai.yaml` mainly provides better UI metadata for Codex.
- `SKILL.md` and `references/` contain the shared portable content for all three runtimes.
- `Claude Code` and `OpenCode` both support directory-based `SKILL.md` skills.

## Repository Structure

```text
agent-delegation/
  SKILL.md
  agents/openai.yaml
  references/
    routing-policy.md
    output-contract.md
    safety-policy.md
    invocation-evidence.md
    platform-compatibility.md
  scripts/
    agent-delegation-doctor.sh
dev-workflow/
  SKILL.md
  agents/openai.yaml
  references/
    stack.md
    design-and-research.md
    documentation.md
    frontend-quality.md
    backend-architecture.md
kimi-code/
  SKILL.md
  agents/openai.yaml
  references/
    kimi-code-reference.md
  scripts/
    kimi-code-status.sh
claude-code/
  SKILL.md
  agents/openai.yaml
  references/
    claude-code-reference.md
  scripts/
    claude-code-status.sh
codex-cli/
  SKILL.md
  agents/openai.yaml
  references/
    codex-cli-reference.md
  scripts/
    codex-cli-status.sh
LICENSE
README.md
README.en.md
```


## Comet-Inspired Direction

This repository borrows [Comet](https://github.com/rpamis/comet)'s engineering pattern without copying its OpenSpec + Superpowers five-phase workflow. The first absorbed layer is intentionally lightweight:

- Use invocation evidence to prove that the requested target agent was actually invoked.
- Use a lightweight doctor script to check Skill structure, script permissions, old path cleanup, and target CLI availability.
- Use platform compatibility documentation to separate verified runtimes from planned or unverified runtimes.
- Keep `agent-delegation` lightweight; do not introduce a full installer, state machine, or automatic multi-agent orchestration yet.

```bash
agent-delegation/scripts/agent-delegation-doctor.sh
```

## Installation

### 1. Install for Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R agent-delegation "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R dev-workflow "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R kimi-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R claude-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R codex-cli "${CODEX_HOME:-$HOME/.codex}/skills/"
```

### 2. Install for Claude Code

```bash
mkdir -p "$HOME/.claude/skills"
cp -R agent-delegation "$HOME/.claude/skills/"
cp -R dev-workflow "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
cp -R claude-code "$HOME/.claude/skills/"
cp -R codex-cli "$HOME/.claude/skills/"
```

### 3. Install for OpenCode

You can choose either option:

Option A, use the native OpenCode directory:

```bash
mkdir -p "$HOME/.config/opencode/skills"
cp -R agent-delegation "$HOME/.config/opencode/skills/"
cp -R dev-workflow "$HOME/.config/opencode/skills/"
cp -R kimi-code "$HOME/.config/opencode/skills/"
cp -R claude-code "$HOME/.config/opencode/skills/"
cp -R codex-cli "$HOME/.config/opencode/skills/"
```

Option B, reuse the Claude Code directory:

```bash
mkdir -p "$HOME/.claude/skills"
cp -R agent-delegation "$HOME/.claude/skills/"
cp -R dev-workflow "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
cp -R claude-code "$HOME/.claude/skills/"
cp -R codex-cli "$HOME/.claude/skills/"
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

You can invoke Skills explicitly; ordinary development tasks should also auto-match `dev-workflow` without requiring `$dev-workflow`:

```text
Use $agent-delegation to ask Kimi Code to review this module, then separately verify its findings.
```

```text
Use $dev-workflow to implement a new feature with a brief plan first, then verify it and update docs.
```

```text
Use $kimi-code to dispatch Kimi Code for a scoped repository research task.
```

```text
Use $claude-code to dispatch Claude Code for an independent diff review.
```

```text
Use $codex-cli to dispatch Codex CLI for a read-only repository research task.
```

### Claude Code

Claude Code discovers and loads matching skills on demand. After installation, it can trigger automatically or be invoked explicitly.

Explicit example:

```text
/agent-delegation
```

```text
/dev-workflow
```

```text
/kimi-code
```

```text
/claude-code
```

```text
/codex-cli
```

### OpenCode

OpenCode discovers and loads matching skills on demand. Once installed in a supported directory, normal task prompts can trigger it.


## Automatic Trigger Guidance

- Use `dev-workflow` by default for ordinary software development requests: feature implementation, bug fixes, debugging, refactoring, tests, review, docs, UI/interaction design, backend research, architecture, and middleware integration.
- Use `agent-delegation` or a specific Adapter only when the user explicitly names an external agent: `kimi-code`, `claude-code`, or `codex-cli`.
- If external delegation is not authorized, do not dispatch another agent merely because it may help; use `dev-workflow` as the main workflow.

## Agent Delegation Contract

When the user explicitly names an external agent, the caller must actually invoke that target. The caller must not replace, simulate, or impersonate the target agent's output.

Recommended delivery separates:

1. Target-agent invocation status and original findings
2. Caller-agent review, corrections, and additional risks
3. Final recommendation and verification conclusion

If the target agent, CLI, authentication, or required permission is unavailable, report the failure explicitly and obtain user approval before substituting another target or completing the work directly.

## Default Behavior

`dev-workflow` defaults to:

- Chinese for plans, design notes, and delivery documents
- Original language for code, commands, protocol names, and configuration keys
- Lightweight diagrams for architecture and process design
- Test-first work for behavior changes and root-cause analysis for bug fixes when practical
- Explicit verification steps, review conclusions, and plain-language acceptance conclusions before delivery
- Lightweight process by default, without mandatory worktrees, long specs, or multi-agent orchestration
- Reference-based frontend quality and backend architecture checklists when needed, instead of turning external skills into a long default process

## License

This repository is licensed under the [MIT License](./LICENSE).
