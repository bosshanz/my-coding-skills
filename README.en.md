# Agent Delegation Skills

A portable collection of development workflow and agent delegation skills for Codex, Claude Code, Gemini CLI, OpenCode, and other Agent Skills-compatible coding agents.

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

This is the default Skill for two real development scenarios: end-to-end new-requirement delivery and end-to-end Bug repair:

- New requirements: clarify goals and acceptance criteria through conversation, agree on a solution, then implement, test, and accept it
- Bug fixes: inspect and reproduce the issue, identify the root cause, agree on the repair, then implement the smallest fix, add regression coverage, and accept it
- Superpowers Lite: lightweight design, TDD, systematic debugging, review gates, and evidence-based completion
- Frontend Design: purpose, aesthetic direction, interaction flow, complete states, accessibility, responsiveness, and visual acceptance
- Backend architecture: APIs, data, storage, cache, messaging, migrations, failure modes, observability, and reliability
- Final diff review against the requirement or root cause, with explicit testing, acceptance, and unverified risks

Trigger guidance: both new requirements and Bug fixes should trigger `dev-workflow` by default without requiring `$dev-workflow`. Use `agent-delegation` or an Adapter only when the user explicitly asks Kimi, Claude Code, Codex CLI, or another external agent to participate.

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

Every Skill follows the directory format defined by the [Agent Skills specification](https://agentskills.io/specification), with `SKILL.md` as the portable core. The specification standardizes the **Skill format**; it does not require every client to scan one universal global directory.

| Installer target | User-level directory | Notes |
| --- | --- | --- |
| `agents` | `~/.agents/skills/` | **Default and recommended.** Codex officially supports this path, and it is a useful shared standards-oriented Skill root. |
| `claude` | `~/.claude/skills/` | Claude Code user discovery path. |
| `gemini` | `~/.gemini/skills/` | Gemini CLI user discovery path. |
| `opencode` | `~/.config/opencode/skills/` | OpenCode user discovery path. |
| `codex` | `${CODEX_HOME:-$HOME/.codex}/skills/` | Legacy Codex-compatible path; prefer `~/.agents/skills/` for new installs. |

`agents/openai.yaml` only enhances Codex UI metadata. Other runtimes share `SKILL.md`, `references/`, and `scripts/`. If a tool does not document discovery from `~/.agents/skills/`, use its runtime-specific target instead of assuming format compatibility implies path discovery.

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
    superpowers-lite.md
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
install.sh
```


## Dev Workflow Integration Direction

`dev-workflow` is not a full Superpowers installer and not a standalone frontend design skill. It is the default-trigger collection that combines:

- Superpowers-inspired lightweight engineering discipline: clarify, design, plan, use TDD when practical, debug systematically, review, verify, and prefer evidence over claims.
- Frontend Design-inspired UI discipline: choose an aesthetic direction before coding, avoid generic AI-looking UI, and cover real states, interactions, accessibility, and performance.
- Lightweight boundaries: no mandatory worktrees, long specs, per-task subagents, or full Superpowers installation by default.

## Comet-Inspired Direction

This repository borrows [Comet](https://github.com/rpamis/comet)'s engineering pattern without copying its OpenSpec + Superpowers five-phase workflow. The first absorbed layer is intentionally lightweight:

- Use invocation evidence to prove that the requested target agent was actually invoked.
- Use a lightweight doctor script to check Skill structure, script permissions, old path cleanup, and target CLI availability.
- Use platform compatibility documentation to separate verified runtimes from planned or unverified runtimes.
- Keep `agent-delegation` lightweight: provide only a directory-copying `install.sh`, without a package manager, state machine, or automatic multi-agent orchestration.

```bash
agent-delegation/scripts/agent-delegation-doctor.sh
```

## Installation

### Option A: Use `install.sh` (recommended)

The repository includes a dependency-free Shell installer. By default it installs every Skill into `~/.agents/skills/`:

```bash
git clone <your-repository-url>
cd my-coding-skills
./install.sh
```

Common examples:

```bash
# Default: install every Skill into ~/.agents/skills/
./install.sh

# Install only the default workflow into the shared standards-oriented directory
./install.sh dev-workflow --target agents --force

# Install into runtime-specific Claude Code, Gemini CLI, or OpenCode paths
./install.sh all --target claude --force
./install.sh all --target gemini --force
./install.sh all --target opencode --force

# Install into ~/.agents plus Claude, Gemini, and OpenCode paths
./install.sh all --target all --force

# Explicitly use the legacy Codex location when required
./install.sh all --target codex --force

# Use a custom directory or preview operations
./install.sh dev-workflow --dest /tmp/skills --force
./install.sh all --target agents --dry-run

# Show help, Skills, and groups
./install.sh --list
```

Supported skills and groups:

- `dev-workflow`: default development workflow integrating Superpowers Lite and Frontend Design
- `agent-delegation`: external-agent delegation contract
- `kimi-code` / `claude-code` / `codex-cli`: external-agent adapters
- `workflow`: install only `dev-workflow`
- `delegation`: install `agent-delegation` and all adapters
- `adapters`: install the three adapters only
- `all`: install every Skill; default when no Skill is named

Installer options:

- `--target agents|codex|claude|gemini|opencode|all`
- `--dest <directory>`
- `--force` / `-f`
- `--dry-run`
- `--list`

### Option B: Manual copy install

Install into the shared directory first:

```bash
mkdir -p "$HOME/.agents/skills"
for skill in agent-delegation dev-workflow kimi-code claude-code codex-cli; do
  cp -R "$skill" "$HOME/.agents/skills/"
done
```

If the target tool does not scan `~/.agents/skills/`, copy the same directories into its runtime-specific location:

```bash
# Claude Code
mkdir -p "$HOME/.claude/skills"
cp -R agent-delegation dev-workflow kimi-code claude-code codex-cli "$HOME/.claude/skills/"

# Gemini CLI
mkdir -p "$HOME/.gemini/skills"
cp -R agent-delegation dev-workflow kimi-code claude-code codex-cli "$HOME/.gemini/skills/"

# OpenCode
mkdir -p "$HOME/.config/opencode/skills"
cp -R agent-delegation dev-workflow kimi-code claude-code codex-cli "$HOME/.config/opencode/skills/"
```

## Recommended Setup

1. Prefer `~/.agents/skills/` as the shared, standards-oriented Skill root.
2. Codex can use that directory directly; older environments can still select `--target codex`.
3. Use explicit Claude Code, Gemini CLI, or OpenCode targets when those tools do not scan the shared directory.
4. `--target all` writes to `agents`, `claude`, `gemini`, and `opencode`; it does not duplicate the install into the legacy Codex path.

## Usage

### Codex

You can invoke Skills explicitly; ordinary development tasks should also auto-match `dev-workflow` without requiring `$dev-workflow`:

```text
Use $agent-delegation to ask Kimi Code to review this module, then separately verify its findings.
```

```text
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

- Use the new-requirement track in `dev-workflow` to discuss requirements and acceptance criteria, agree on a solution, implement, test, and accept the result.
- Use the Bug-fix track in `dev-workflow` to inspect and reproduce the issue, identify the root cause, agree on the repair, implement the smallest fix, run regression tests, and accept the result.
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
