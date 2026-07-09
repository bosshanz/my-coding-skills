# Coding Agent Skills

A portable collection of `loop-engineering`, `clarify`, `dev`, `acceptance`, and external-agent adapter skills for Codex, Claude Code, Gemini CLI, OpenCode, and other Agent Skills-compatible coding agents.

The repository lets a caller agent design agent engineering feedback loops, clarify work, deliver development tasks, independently accept completed work, and explicitly call external agents such as Kimi Code, Claude Code CLI, Codex CLI, or OpenCode CLI when needed.

Core principles:

- If the user names a target agent, invoke that target agent.
- If the target is unavailable, fail explicitly; do not silently substitute.
- Never simulate, impersonate, or fabricate the target agent's output.
- Delegated results must remain auditable, reviewable, and verifiable.
- Design agent engineering methodology through feedback loops instead of stacking prompts and process checklists.
- The first principle of Loop Engineering is: do not trust the Agent; trust the verifier. Prioritize verification gates, permission boundaries, state and memory, scheduling, then Agent capability.
- Use first-principles decomposition before choosing solutions for complex requirements and architecture decisions.
- Use adversarial review for non-trivial designs, fixes, and acceptance decisions by actively looking for counterexamples and weak assumptions.

中文主版本: [README.md](./README.md)

## Included Skills

The repository currently includes eight primary skills:

### `loop-engineering`

This is the top-level Agent Engineering Methodology Skill for designing, auditing, and improving AI coding-agent engineering loops:

- Design feedback loops for clarification, solution design, implementation, debugging, evaluation, delegation, acceptance, release, and docs/memory updates
- Define each loop's target, actor, input, action, signal, gate, escalation, and artifact
- Build a verification ladder that defines hard, soft, safety, cost, and stop/end-rule verification before relying on Agent capability
- Design multi-agent collaboration protocols: explicit authorization, bounded scope, invocation evidence, non-recursive delegation, caller review, and final accountability
- Standardize the optional `loop/` workspace created from `clarify`: `LOOP.md`, `STATE.md`, `ROADMAP.md`, `CONTEXT.md`, and `loop-run-log.md`
- Audit whether skills, README files, installers, doctor scripts, and adapter contracts form a coherent methodology surface

Trigger guidance: use it when the user explicitly invokes `$loop-engineering`, asks for Loop Engineering, Agent Engineering Methodology, feedback-loop design, evaluation loops, multi-agent workflow governance, or wants to upgrade a skill repository into a methodology system. Ordinary feature implementation and Bug repair should still use `dev`.

### `dev`

This is the default Skill for two real development scenarios: end-to-end new-requirement delivery and end-to-end Bug repair:

- New requirements: clarify goals and acceptance criteria through conversation, agree on a solution, then implement, test, and accept it
- Bug fixes: inspect and reproduce the issue, identify the root cause, agree on the repair, then implement the smallest fix, add regression coverage, and accept it
- Superpowers Lite: lightweight design, TDD, systematic debugging, review gates, and evidence-based completion
- Frontend Design: purpose, aesthetic direction, interaction flow, complete states, accessibility, responsiveness, and visual acceptance
- Backend architecture: APIs, service boundaries, cache, messaging, failure modes, observability, and reliability
- Database engineering: schema, constraints, transactions, indexes, query plans, migrations, backfills, capacity, and production safety
- First-principles design and adversarial review: derive solutions from goals, facts, constraints, and assumptions, then actively search for failure paths
- Final diff review against the requirement or root cause, with explicit testing, acceptance, and unverified risks

Trigger guidance: both new requirements and Bug fixes should trigger `dev` by default without requiring `$dev`. `dev` first acts as a thin dispatcher that classifies the task boundary, then loads only the relevant references. Use an Adapter only when the user explicitly asks Kimi, Claude Code, Codex CLI, OpenCode CLI, or another external agent to participate.

### `clarify`

This is an opt-in requirement and architecture alignment Skill for conversations before coding:

- Ask one high-value question at a time and include a recommended answer
- Inspect repository docs or code for factual answers instead of asking the user
- For multi-step, cross-file, high-risk, delegated, or acceptance-heavy work, ask whether to create a `loop/` workspace
- When the user agrees, create `LOOP.md`, `STATE.md`, `ROADMAP.md`, `CONTEXT.md`, and `loop-run-log.md`
- Apply first-principles decomposition to solution-shaped requests by separating goals, facts, constraints, assumptions, and non-goals
- Maintain domain terms in `CONTEXT.md` when useful without turning it into a spec or scratchpad
- Suggest ADRs only for durable, surprising, tradeoff-heavy decisions
- Close by handing clarified behavior, non-goals, boundaries, and verification strategy to `dev`

Trigger guidance: use it when the user explicitly requests `$clarify`, a grilling/interview session, pre-implementation clarification, or durable domain term / ADR capture. Ordinary development requests should still use `dev`.

### `acceptance`

This is a top-level independent acceptance Skill for go/no-go review after implementation:

- Compare against clarified requirements, acceptance criteria, issues, PR descriptions, or task notes
- Review current diff, test evidence, CI, manual checks, screenshots, logs, docs, migrations, and rollback notes
- Adversarially test the acceptance decision against edge inputs, permissions, concurrency, migrations, rollback, and recovery paths
- Stay in verification mode by default; when issues are found, report blockers, risks, and the next `$dev` repair step
- Return `accepted`, `accepted with risk`, or `rejected`

Trigger guidance: use it when the user explicitly invokes `$acceptance`, asks for final acceptance, wants an independent review of `dev` output, needs a pre-launch go/no-go decision, or wants a clear clarify -> develop -> accept workflow.

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

### `opencode`

This skill lets another agent dispatch OpenCode CLI, focused on:

- Repository research, independent review, scoped implementation, and terminal automation
- Non-interactive `opencode run`, TUI interaction, session continuation, agent selection, file attachments, and JSON output
- Invocation evidence plus calling-agent review after OpenCode completes
- OpenCode setup, login, Skill / Rules directories, and command reference

## Compatibility

Every Skill follows the directory format defined by the [Agent Skills specification](https://agentskills.io/specification), with `SKILL.md` as the portable core. The specification standardizes the **Skill format**; it does not require every client to scan one universal global directory.

| Installer target | User-level directory | Notes |
| --- | --- | --- |
| `agents` | `~/.agents/skills/` | **Recommended shared directory.** Codex officially supports this path, and it is a useful shared standards-oriented Skill root. The default `./install.sh` installs to every supported target. |
| `claude` | `~/.claude/skills/` | Claude Code user discovery path. |
| `gemini` | `~/.gemini/skills/` | Gemini CLI user discovery path. |
| `opencode` | `~/.config/opencode/skills/` | OpenCode user discovery path. |
| `codex` | `${CODEX_HOME:-$HOME/.codex}/skills/` | Legacy Codex-compatible path; prefer `~/.agents/skills/` for new installs. |

`agents/openai.yaml` only enhances Codex UI metadata. Other runtimes share `SKILL.md`, `references/`, and `scripts/`. If a tool does not document discovery from `~/.agents/skills/`, use its runtime-specific target instead of assuming format compatibility implies path discovery.

## Repository Structure

```text
loop-engineering/
  SKILL.md
  agents/openai.yaml
dev/
  SKILL.md
  agents/openai.yaml
  references/
    superpowers-lite.md
    stack.md
    design-and-research.md
    documentation.md
    frontend-quality.md
    backend-architecture.md
    database-engineering.md
clarify/
  SKILL.md
  agents/openai.yaml
  references/
    loop-workspace.md
acceptance/
  SKILL.md
  agents/openai.yaml
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
opencode/
  SKILL.md
  agents/openai.yaml
  references/
    opencode-reference.md
  scripts/
    opencode-status.sh
scripts/
  skills-doctor.sh
LICENSE
README.md
README.en.md
install.sh
```


## Agent Engineering Methodology

`loop-engineering` is the methodology layer in this repository. It does not replace coding, interviewing, or acceptance; it defines how those actions form verifiable engineering loops.

- `loop-engineering` designs and audits loops: triggers, responsible actors, inputs, actions, evidence, gates, escalation paths, and durable artifacts.
- `clarify` is the requirement and architecture clarification loop, and creates a `loop/` workspace when the user opts in.
- `dev` is the implementation, debugging, testing, and lightweight acceptance loop; when `loop/` exists, it reads the context first and keeps state and logs current.
- `acceptance` is the independent go/no-go verification loop; when `loop/` exists, it writes the decision back to state and log files.
- External-agent adapters execute delegation loops and should only be used when the user or project policy explicitly authorizes them.

The methodology goal is to make every agent action observable and falsifiable: bad assumptions should be disproved quickly by tests, logs, diff review, screenshots, CI, human acceptance, or independent acceptance.

The first principle of Loop Engineering is: do not trust the Agent; trust the verifier. The fixed design priority is: 1. verification gates; 2. permission boundaries; 3. state and memory; 4. scheduling mechanism; 5. Agent capability. Choose verification gates from hard verification, soft verification, safety verification, cost verification, and stop/end rules based on risk.

Long-running non-requirement loops should not be forced into a one-shot clarify -> develop -> accept delivery shape. For evaluation, quality governance, methodology evolution, maintenance, or learning loops, `loop-engineering` defines the cadence, trend signal, gate, checkpoint artifact, and continue / stop / pivot criteria; `dev` executes only the current bounded increment or experiment; `acceptance` is used only at milestones, checkpoints, or explicit go/no-go gates.

## Dev Integration Direction

`dev` is not a full Superpowers installer and not a standalone frontend design skill. It is the default-trigger thin dispatcher that combines:

- Superpowers-inspired lightweight engineering discipline: clarify, design, plan, use TDD when practical, debug systematically, review, verify, and prefer evidence over claims.
- Matt Pocock Skills-inspired sharper engineering rules: red-capable debugging feedback loops, tracer-bullet TDD, and deep module / seam / interface architecture vocabulary.
- Frontend Design-inspired UI discipline: choose an aesthetic direction before coding, avoid generic AI-looking UI, and cover real states, interactions, accessibility, and performance.
- Senior database engineering practice: data modeling, constraints, transactions, indexes, query plans, migrations, backfills, and production database safety.
- First-principles reasoning to constrain solution choices, and adversarial review to challenge designs, fixes, and completion claims.
- Lazy reference loading by task boundary, so the checklists do not all become default context for every task.
- Lightweight boundaries: no mandatory worktrees, long specs, per-task subagents, or full Superpowers installation by default.
- Top-level `acceptance` provides independent acceptance; `dev` still keeps its lightweight internal acceptance gate so small tasks do not require a split workflow.

## Comet-Inspired Direction

This repository borrows [Comet](https://github.com/rpamis/comet)'s engineering pattern without copying its OpenSpec + Superpowers five-phase workflow. The first absorbed layer is intentionally lightweight:

- Use invocation evidence to prove that the requested target agent was actually invoked.
- Use a lightweight doctor script to check Skill structure, script permissions, old path cleanup, and target CLI availability.
- Use platform compatibility documentation to separate verified runtimes from planned or unverified runtimes.
- Keep external-agent adapters lightweight: provide only a directory-copying `install.sh`, without a package manager, state machine, or automatic multi-agent orchestration.

```bash
scripts/skills-doctor.sh
```

## Installation

### Option A: Use `install.sh` (recommended)

The repository includes a dependency-free Shell installer. By default it installs every Skill into all supported target directories (`~/.agents/skills/`, `~/.claude/skills/`, `~/.gemini/skills/`, and `~/.config/opencode/skills/`):

```bash
git clone <your-repository-url>
cd my-coding-skills
./install.sh
```

Common examples:

```bash
# Default: install every Skill into all supported target directories
./install.sh

# Install only the Agent Engineering Methodology layer
./install.sh methodology --target agents --force

# Install only the default workflow into the shared standards-oriented directory
./install.sh dev --target agents --force

# Install only the requirement/architecture interview Skill
./install.sh planning --target agents --force

# Install only the independent acceptance Skill
./install.sh acceptance --target agents --force

# Install into runtime-specific Claude Code, Gemini CLI, or OpenCode paths
./install.sh all --target claude --force
./install.sh all --target gemini --force
./install.sh all --target opencode --force

# Install into ~/.agents plus Claude, Gemini, and OpenCode paths
./install.sh all --target all --force

# Explicitly use the legacy Codex location when required
./install.sh all --target codex --force

# Use a custom directory or preview operations
./install.sh dev --dest /tmp/skills --force
./install.sh all --target agents --dry-run

# Show help, Skills, and groups
./install.sh --list
```

Supported skills and groups:

- `loop-engineering`: Agent Engineering Methodology and feedback-loop design
- `dev`: default development workflow integrating Superpowers Lite and Frontend Design
- `clarify`: opt-in requirement and architecture interview with lightweight domain-term and ADR capture
- `acceptance`: independent acceptance and go/no-go verification
- `kimi-code` / `claude-code` / `codex-cli` / `opencode`: external-agent adapters
- `workflow`: install only `dev`
- `methodology`: install only `loop-engineering`
- `planning`: install only `clarify`
- `delegation`: install all external-agent adapters
- `adapters`: install the four adapters only
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
for skill in loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode; do
  cp -R "$skill" "$HOME/.agents/skills/"
done
```

If the target tool does not scan `~/.agents/skills/`, copy the same directories into its runtime-specific location:

```bash
# Claude Code
mkdir -p "$HOME/.claude/skills"
cp -R loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode "$HOME/.claude/skills/"

# Gemini CLI
mkdir -p "$HOME/.gemini/skills"
cp -R loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode "$HOME/.gemini/skills/"

# OpenCode
mkdir -p "$HOME/.config/opencode/skills"
cp -R loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode "$HOME/.config/opencode/skills/"
```

## Recommended Setup

1. By default, `./install.sh` writes to `agents`, `claude`, `gemini`, and `opencode` so every agent can discover the Skills.
2. To install only into the shared directory, use `--target agents`; older Codex environments can still select `--target codex`.
3. To install into a single runtime only, use `--target claude|gemini|opencode`.
4. Prefer `~/.agents/skills/` as the shared, standards-oriented Skill root, but because Claude Code, Gemini CLI, and OpenCode do not currently scan that directory, the default strategy is to install everywhere.

## Usage

### Codex

You can invoke Skills explicitly; ordinary development tasks should also auto-match `dev` without requiring `$dev`:

```text
Use $loop-engineering to design an agent engineering feedback-loop architecture for this repository, including routing between clarify, dev, acceptance, and external-agent adapters.
```

```text
Use $dev to implement a new feature with a brief plan first, then verify it and update docs.
```

```text
Use $clarify to clarify this refactor one question at a time before we implement it.
```

```text
Use $clarify to interview me first and ask whether to create a loop workspace for this multi-step change.
```

```text
Use $acceptance to independently verify the completed change against the agreed criteria and return accepted, accepted with risk, or rejected.
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

```text
Use $opencode to dispatch OpenCode CLI for a scoped repository research task.
```

### Claude Code

Claude Code discovers and loads matching skills on demand. After installation, it can trigger automatically or be invoked explicitly.

Explicit example:

```text
/loop-engineering
```

```text
/dev
```

```text
/clarify
```

```text
/acceptance
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

```text
/opencode
```

### OpenCode

OpenCode discovers and loads matching skills on demand. Once installed in a supported directory, normal task prompts can trigger it.


## Automatic Trigger Guidance

- Use `loop-engineering` when the work is about Agent Engineering Methodology, feedback-loop design, evaluation loops, or multi-agent workflow governance.
- Use the new-requirement track in `dev` to discuss requirements and acceptance criteria, agree on a solution, implement, test, and accept the result.
- Use the Bug-fix track in `dev` to inspect and reproduce the issue, identify the root cause, agree on the repair, implement the smallest fix, run regression tests, and accept the result.
- Route long-running non-requirement loops through `loop-engineering` for the loop contract; hand each concrete increment to `dev` as a bounded change.
- Let `dev` classify the task type and changed boundary first, then load only the references relevant to the current task; do not read every reference merely because `dev` triggered.
- Use `clarify` when the user explicitly asks for a grilling/interview session, pre-implementation clarification, or durable domain term / ADR capture. For multi-step, cross-file, high-risk, delegated, or acceptance-heavy work, `clarify` should ask whether to create a `loop/` workspace, then return to `dev` for implementation afterward.
- Use `acceptance` when the user explicitly asks for final acceptance, independent verification, go/no-go review, or an acceptance decision. In long-running loops, invoke it at milestones, checkpoints, or explicit gates; it does not continue implementation by default and should hand defects back to `dev`.
- Use a specific Adapter only when the user explicitly names an external agent: `kimi-code`, `claude-code`, `codex-cli`, or `opencode`.
- If external delegation is not authorized, do not dispatch another agent merely because it may help; use `dev` as the main workflow.

## External Agent Adapter Contract

When the user explicitly names an external agent, the caller must actually invoke that target. The caller must not replace, simulate, or impersonate the target agent's output.

Recommended delivery separates:

1. Target-agent invocation status and original findings
2. Caller-agent review, corrections, and additional risks
3. Final recommendation and verification conclusion

If the target agent, CLI, authentication, or required permission is unavailable, report the failure explicitly and obtain user approval before substituting another target or completing the work directly.

### Internal Skill Routing In Target CLIs

External CLI selection must be explicit; once the user or project policy selects `kimi-code`, `claude-code`, `codex-cli`, or `opencode`, the target CLI may automatically use the global/user and project/local non-adapter Skills it can discover.

- Respect any Skill explicitly named by the user.
- Prefer project-local Skills over global Skills when both apply, because project-local Skills usually better capture the current repository's constraints, commands, and domain language.
- Prefer `loop-engineering` for agent methodology, feedback-loop, evaluation-loop, or multi-agent workflow design.
- Prefer discoverable `dev` for ordinary implementation or Bug repair inside the target CLI.
- Prefer `clarify` for requirement or architecture interviews.
- Prefer `acceptance` for independent go/no-go verification.
- The child CLI must not automatically invoke external-agent adapters such as `kimi-code`, `claude-code`, `codex-cli`, or `opencode` unless the user explicitly authorizes multi-agent orchestration.
- The target CLI output should state which Skills were used, or why none were used.

## Default Behavior

`dev` defaults to:

- Chinese for plans, design notes, and delivery documents
- Original language for code, commands, protocol names, and configuration keys
- Lightweight diagrams for architecture and process design
- Test-first work for behavior changes and root-cause analysis for bug fixes when practical
- Explicit verification steps, review conclusions, and plain-language acceptance conclusions before delivery
- Lightweight process by default, without mandatory worktrees, long specs, or multi-agent orchestration
- Reference-based frontend quality, backend architecture, and database engineering checklists when needed, instead of turning external skills into a long default process

## License

This repository is licensed under the [MIT License](./LICENSE).
