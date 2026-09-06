# Coding Agent Skills

A portable collection of `design`, `clarify`, `dev`, `qa`, `acceptance`, and external-agent adapter skills for Codex, Claude Code, Gemini CLI, OpenCode, Grok Build, and other Agent Skills-compatible coding agents.

The repository lets a caller agent design UI, clarify work, deliver development tasks, protect real user usage with QA thinking, independently accept completed work, and explicitly call external agents such as Kimi Code, Claude Code CLI, Codex CLI, OpenCode CLI, or Grok Build CLI when needed.

Core principles:

- If the user names a target agent, invoke that target agent.
- If the target is unavailable, fail explicitly; do not silently substitute.
- Never simulate, impersonate, or fabricate the target agent's output.
- Delegated results must remain auditable, reviewable, and verifiable.
- Use first-principles decomposition before choosing solutions for complex requirements and architecture decisions.
- Use adversarial review for non-trivial designs, fixes, and acceptance decisions by actively looking for counterexamples and weak assumptions.

中文主版本: [README.md](./README.md)

## Included Skills

The repository currently includes eleven primary skills:

### `design`

This is a standalone design Skill for UI work, invoked on demand by `dev` or directly:

- Interaction direction: define the user job, objects and actions, main flow, state transitions, feedback and control, interruption recovery, and input model first
- New UI or visible reshape: after the interaction is clear, commit to purpose, tone, palette, typography, layout, and a signature element before coding
- Frontend engineering quality: interaction states, accessibility, responsiveness, performance, and verification gates
- AI-native interaction: understanding and clarification, proposal / approval / execution separation, truthful Runtime progress, steering, takeover, checkpoints, and resume
- Motion methodology: concrete durations, easing curves, spring parameters, choreography rules, an animation audit checklist and vocabulary, plus where motion helps and where it does not
- Incorporates the complete Anthropic `frontend-design` UI workflow (Apache-2.0) and distills the animation methodology from emilkowalski/skills (MIT)

Trigger guidance: use it when creating or reshaping meaningful UI; designing or improving user flows, usability, information architecture, state transitions, feedback and recovery, or AI-native interaction; or implementing or auditing animation and micro-interactions. `dev` invokes it automatically for UI or interaction implementation. It is not needed for backend-only work, settled trivial CSS tweaks, independent business QA, or final acceptance.

### `dev`

This is the default Skill for two real development scenarios: end-to-end new-requirement delivery and end-to-end Bug repair:

- New requirements: infer goals and acceptance criteria from context, resolve material unknowns, then implement and verify proportionately
- Bug fixes: inspect evidence, identify the root cause, implement the smallest complete repair, and verify it without renewing existing authorization
- Superpowers Lite: lightweight design, TDD, systematic debugging, review gates, and evidence-based completion
- UI design: invoke the standalone `design` Skill on demand for meaningful UI or interaction-flow creation and reshaping to get interaction direction, visual direction, frontend quality, and motion methodology
- Backend engineering: server-side change contract: caller and permissions, boundary validation, idempotency, errors, and compatibility
- Backend architecture: APIs, service boundaries, cache, messaging, failure modes, observability, and reliability
- Backend quality: request authority, tenant isolation, error mapping, idempotency, timeouts, test layering, and process lifecycle
- Database engineering: schema, constraints, transactions, indexes, query plans, migrations, backfills, capacity, and production safety
- First-principles design and adversarial review: derive solutions from goals, facts, constraints, and assumptions, then actively search for failure paths
- Final diff review against the requirement or root cause, with explicit testing, acceptance, and unverified risks

Trigger guidance: both new requirements and Bug fixes should trigger `dev` by default without requiring `$dev`. `dev` first acts as a thin dispatcher that classifies the task boundary, then loads only the relevant references. Use an Adapter only when the user explicitly asks Kimi, Claude Code, Codex CLI, OpenCode CLI, Grok Build CLI, or another external agent to participate.


### `qa`

This is an opt-in standalone Skill for business understanding, real usage, and QA thinking. It is not a test-script runner:

- Answer the asked slice; do not walk every usage path for completeness
- Restate that slice in the user's language: who is using the product, what they came to do, what success and failure look like, and which business rule must not break silently
- Walk real usage only when reviewing an actual journey, and only for that slice: first time, returning, empty, blocked, mid-flow abandon, error recovery, and nearby jobs that must keep working
- Attack that slice from a QA lens: how the product can stay green while lying to the user or the business
- Enter the diagnosis track only when the user explicitly asks to diagnose a named real-usage question or user journey: answer that slice without editing under Diagnosis, then continue other already-authorized work, including repair through `dev`; stop only when no requested work remains. Uncovered usage is residual risk, not a backlog
- Only after the user asks to protect, choose the cheapest evidence that would turn red; an automated test is one form of evidence, never start from the test directory
- Contract/coverage tracks may edit tests, fixtures, and test configuration; do not change product code or issue go/no-go

Trigger guidance: use it only when the user explicitly invokes `$qa` / `/qa`, or explicitly asks for business testing, QA thinking, diagnosis of a named user journey or real-usage question, or protection of a named business rule. Generic requests such as "look at this," "review this," or "inspect this Skill" do not trigger QA; another Skill's recommendation is not user authorization. A bare request to add e2e, regression, or tests stays in `dev`, as do ordinary implementation and developer tests; formal acceptance stays in `acceptance`; unclear business goes back to `clarify`. `dev` must not auto-invoke or routinely recommend `qa`.

### `clarify`

This is the pre-implementation Skill for senior product judgment and architecture alignment. It applies a senior PM's judgment without taking on the full organizational scope of a PM, and owns whether to build, who it is for, the key tradeoffs, the first slice, and how success is measured:

- For product-shaped work, recommend build, experiment, or stop, and name the target user, user job, priorities, and key tradeoffs
- Ask one high-value question with a recommended answer only when the unknown could change the judgment; otherwise recommend directly
- When confidence is too low for delivery, define a low-cost experiment and the next decision it should unlock
- Inspect repository docs or code for factual answers instead of asking the user
- Apply first-principles decomposition to solution-shaped requests by separating goals, facts, constraints, assumptions, and non-goals
- Maintain domain terms in `CONTEXT.md` when useful without turning it into a spec or scratchpad
- Suggest ADRs only for durable, surprising, tradeoff-heavy decisions
- When explicitly requested and the judgment is clear, produce a lightweight product brief, decision memo, PRD, or experiment brief
- Do not own ongoing roadmaps, backlog or sprint management, stakeholder coordination, delivery tracking, or date commitments, and do not simulate having taken ownership. Even when `$clarify` is explicitly invoked, state the boundary briefly and stop; at most, suggest a bounded one-time decision or operating-model artifact as a separate next request and name the human owner or authorized system required for continued execution. Hand off to `dev` to implement or `design` for interaction or visual direction by default; use `qa` only when the user explicitly requested an independent business or real-usage pass

Trigger guidance: use it when the user explicitly requests `$clarify`, product analysis, whether or what to build, target users, prioritization and tradeoffs, first-slice scoping, success measures, low-cost experiments, a grilling/interview session, or durable domain term / ADR capture. Ordinary development requests should still use `dev`.

### `acceptance`

This is a top-level independent acceptance Skill for go/no-go review after implementation:

- Compare against clarified requirements, acceptance criteria, issues, PR descriptions, or task notes
- Review current diff, test evidence, CI, manual checks, screenshots, logs, docs, migrations, and rollback notes
- Adversarially test the acceptance decision against edge inputs, permissions, concurrency, migrations, rollback, and recovery paths
- Stay in verification mode by default; judge real-usage and business evidence directly and name concrete gaps, send product defects to `$dev`, and send an unclear target to `$clarify`; use `$qa` only when the user explicitly requests a separate business or real-usage protection pass
- Return `accepted`, `accepted with risk`, or `rejected`

Trigger guidance: use it when the user explicitly invokes `$acceptance`, asks for final acceptance, wants an independent review of `dev` output, or needs a pre-launch go/no-go decision. Acceptance is evidence-based and does not require a prior QA stage.

### `reflect`
An explicit taste-loop skill: it captures durable corrections the user makes in conversation into the always-on layer, so the next session starts already knowing them.
- Only durable corrections/preferences: explicit `$reflect`, or phrases like "from now on", "always", "stop doing"
- One signal becomes one line: what to do, scope, source; no source, no entry
- Every preference write is confirmed first; apply the current correction immediately and continue other authorized work while persistence is pending. No guessing what the user "probably prefers", no silent writes
- In this repo it writes the `## Taste` section of `AGENTS.md`; in consumer projects it writes their existing always-on instruction file, or asks - it never creates config files unilaterally
- If a correction exposes a wrong SKILL.md, it names the contradiction and proposes the fix - it does not edit beyond its pass
Trigger advice: one-off task feedback ("rename this variable") does not trigger it; product/business rules go to `clarify` / `qa`; ordinary work goes to `dev`.

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

### `grok-build-cli`

This skill lets another agent dispatch Grok Build CLI, focused on:

- Repository research, independent review, scoped implementation, and terminal automation
- Non-interactive `grok -p`, JSON / schema output, session continuation, and tool allowlists
- Safe `--always-approve` / `--yolo` defaults and calling-agent review of results
- Grok Build CLI setup, authentication, Skill / Rules directories, and command reference

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
design/
  SKILL.md
  agents/openai.yaml
  references/
    interaction.md
    design-direction.md
    quality.md
    animation.md
    anthropic-frontend-design-LICENSE.txt
dev/
  SKILL.md
  agents/openai.yaml
  references/
    superpowers-lite.md
    stack.md
    design-and-research.md
    documentation.md
    backend-engineering.md
    backend-architecture.md
    backend-quality.md
    database-engineering.md
qa/
  SKILL.md
  agents/openai.yaml
clarify/
  SKILL.md
  agents/openai.yaml
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
grok-build-cli/
  SKILL.md
  agents/openai.yaml
  references/
    grok-build-cli-reference.md
  scripts/
    grok-build-cli-status.sh
adapters/
  contract.md
  adapters.yaml
evals/
  routing/
    fixtures.yaml
    runner.mjs
    prompt.md
  behavior/
    fixtures.yaml
    runner.mjs
  e2e/
    smoke.mjs
  results/
    README.md
scripts/
  skills-doctor.sh
  check-routing-policy.mjs
  test-install-safety.sh
  sync-adapters.mjs
bin/
  skills.mjs
package.json
package-lock.json
CHANGELOG.md
LICENSE
README.md
README.en.md
install.sh
uninstall.sh
```


## Dev Integration Direction

`dev` is not a full Superpowers installer. It is the default-trigger thin dispatcher that combines:

- Superpowers-inspired lightweight engineering discipline: clarify, design, plan, use TDD when practical, debug systematically, review, verify, and prefer evidence over claims.
- Matt Pocock Skills-inspired sharper engineering rules: red-capable debugging feedback loops, tracer-bullet TDD, and deep module / seam / interface architecture vocabulary.
- UI interaction direction, visual direction, frontend quality, and motion methodology provided by the standalone `design` Skill: product UI starts with the user job, objects/actions, main flow, state transitions, feedback, control, and recovery, then lets the visual layer reinforce that hierarchy. Visual reshaping still uses the complete Anthropic `frontend-design` workflow, with animation methodology distilled from emilkowalski/skills loaded only when useful. `dev` invokes it on demand for meaningful UI or interaction implementation. The upstream Apache-2.0 body and license ship with `design`.
- Senior database engineering practice: data modeling, constraints, transactions, indexes, query plans, migrations, backfills, and production database safety.
- First-principles backend implementation quality: authority, truthful effects, bounded resources, retry-safe handlers, observability hygiene, and tests that can prove invariants.
- First-principles reasoning to constrain solution choices, and adversarial review to challenge designs, fixes, and completion claims.
- Lazy reference loading by task boundary, so the checklists do not all become default context for every task.
- Lightweight boundaries: no mandatory worktrees, long specs, per-task subagents, or full Superpowers installation by default.
- Top-level `qa` is an opt-in independent business and real-usage pass; `dev` keeps developer tests and proportionate business-risk verification, reports evidence gaps directly, and does not make `$qa` the default next stage.
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

# Install only the UI design Skill
./install.sh ui --target agents --force

# Install only the default workflow into the shared standards-oriented directory
./install.sh dev --target agents --force

# Install only the product-judgment / architecture-alignment Skill
./install.sh planning --target agents --force

# Install only the business/usage QA Skill
./install.sh qa --target agents --force

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

- `design`: UI interaction direction, visual direction, frontend quality, and motion methodology
- `dev`: default development workflow integrating Superpowers Lite; invokes `design` on demand for UI tasks
- `qa`: understand the business and real usage, then protect them with QA thinking instead of piling on test scripts
- `clarify`: senior pre-implementation product judgment and architecture alignment, excluding ongoing PM operations and delivery management
- `acceptance`: independent acceptance and go/no-go verification
- `kimi-code` / `claude-code` / `codex-cli` / `opencode` / `grok-build-cli`: external-agent adapters
- `workflow`: install only `dev`
- `ui`: install only `design`
- `planning`: compatibility group name; install only `clarify` for product judgment / architecture alignment
- `quality`: install `qa` and `acceptance`
- `delegation`: install all external-agent adapters
- `adapters`: install the five adapters only
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
for skill in design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli; do
  cp -R "$skill" "$HOME/.agents/skills/"
done
```

If the target tool does not scan `~/.agents/skills/`, copy the same directories into its runtime-specific location:

```bash
# Claude Code
mkdir -p "$HOME/.claude/skills"
cp -R design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli "$HOME/.claude/skills/"

# Gemini CLI
mkdir -p "$HOME/.gemini/skills"
cp -R design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli "$HOME/.gemini/skills/"

# OpenCode
mkdir -p "$HOME/.config/opencode/skills"
cp -R design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli "$HOME/.config/opencode/skills/"
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
Use $dev to implement a new feature with a brief plan first, then verify it and update docs.
```

```text
Use $qa to first understand the real business and how a user uses it, then protect those journeys. Do not start from test scripts.
```

```text
Use $design to review and improve the animations on this page.
```

```text
Use $design to redesign this multi-step publish flow, including state transitions, cancellation, retry, and recovery before visual polish.
```

```text
Use $clarify to clarify this refactor one question at a time before we implement it.
```

```text
Use $clarify to decide whether we should build this, who it is for, and what the first slice is.
```

```text
Use $clarify to prioritize these product opportunities, explain the key tradeoffs, and propose the cheapest experiment that could change the decision.
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

```text
Use $grok-build-cli to dispatch Grok Build CLI for a scoped repository research task.
```

### Claude Code

Claude Code discovers and loads matching skills on demand. After installation, it can trigger automatically or be invoked explicitly.

Explicit example:

```text
/design
```

```text
/dev
```

```text
/qa
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

```text
/grok-build-cli
```

### OpenCode

OpenCode discovers and loads matching skills on demand. Once installed in a supported directory, normal task prompts can trigger it.


## Automatic Trigger Guidance

- Use `design` when creating or reshaping meaningful UI; designing or improving user flows, usability, state transitions, feedback and recovery, or AI-native interaction; or implementing or auditing animation and micro-interactions. `dev` invokes it automatically for UI or interaction implementation.
- Use the new-requirement track in `dev` to establish the target, select a compatible approach, implement, and verify proportionately; workflow steps are not separate approval turns.
- Use the Bug-fix track in `dev` to inspect and reproduce the issue, identify the root cause, implement the smallest repair, and run relevant verification.
- Let `dev` classify the task type and changed boundary first, then load only the references relevant to the current task; do not read every reference merely because `dev` triggered.
- Use `clarify` when the user explicitly asks for product analysis, whether or what to build, target users, prioritization and tradeoffs, first-slice scoping, success measures, low-cost experiments, a grilling/interview session, or durable domain term / ADR capture. It applies senior PM judgment but does not own ongoing PM operations; next is normally `$dev` for implementation, `$design` for interaction or visual direction, or stop.
- Use `qa` only when the user explicitly invokes `$qa` / `/qa`, or explicitly asks for business testing, QA thinking, diagnosis of a named user journey or real-usage question, or protection of a named business rule. Generic look/review requests do not trigger it; a bare add-e2e, regression, or add-tests request stays in `dev`.
- Use `acceptance` when the user explicitly asks for final acceptance, independent verification, go/no-go review, or an acceptance decision; it does not continue implementation by default and judges business and real-usage evidence directly. Send product defects to `$dev` and an unclear target to `$clarify`; use `$qa` only when the user explicitly requests that separate pass.
- Use a specific Adapter only when the user explicitly names an external agent: `kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli`.
- If external delegation is not authorized, do not dispatch another agent merely because it may help; use `dev` as the main workflow.

## Routing And Behavior Evals

See [workflow and evaluation](docs/workflow.md) for intake, delivery consultation, and completion boundaries. Report evidence types separately:

| Check | Scope | Command |
| --- | --- | --- |
| Static | Structure, fixture loading, installer safety, evaluator counterexamples | `npm test` |
| Routing proxy | Description only by default; extended metadata is explicit | `npm run eval:routing -- --surface description` |
| Response contract | Text fields, enums, and restrictions | `npm run eval:behavior` |
| Host self-report | Authorized CLI reports a choice, not proven execution | `npm run eval:e2e -- --cli <target>` |
| Execution | Temporary project implementation, read-only scope, authorized continuation | `npm run eval:execution -- --prepare` |

First-pass failures remain failures. Routing `--recheck` is diagnostic; response evaluation defaults to one attempt and `--attempts 2` preserves both attempts. `--record` saves Markdown and raw-response JSON. Description and extended surfaces are reported separately; neither claims universal host discovery fidelity.

For execution evaluation, dispatch each generated task through an authorized agent, save its actual response, and run `npm run eval:execution -- --verify <directory>`. Independent file and behavior checks complement manual review of the actual trace for redundant confirmation or transient out-of-scope actions. See the workflow document for steps and limits.

Shared adapter sections render from `adapters/contract.md`; run `npm run adapters:sync` after editing. Nightly still runs routing and response proxies using `ANTHROPIC_API_KEY`, without automatically dispatching execution agents. Historical reports retain their original scoring and are not directly comparable.

## External Agent Adapter Contract

When the user explicitly names an external agent, the caller must actually invoke that target. The caller must not replace, simulate, or impersonate the target agent's output.

Recommended delivery separates:

1. Target-agent invocation status and original findings
2. Caller-agent review, corrections, and additional risks
3. Final recommendation and verification conclusion

If the target agent, CLI, authentication, or required permission is unavailable, report the failure explicitly and obtain user approval before substituting another target or completing the work directly.

Setup or troubleshooting guidance uses relevant references and local checks without authorizing dispatch; loading an adapter alone is not a reason to ask for delegation approval. Static review defaults to read-only access. Necessary verification within an authorized review may use scoped commands and isolated temporary artifacts, without authorizing reviewed-source edits, production data changes, or approval bypasses. Honor an explicit ban on all filesystem writes and report any resulting verification gap.

### Internal Skill Routing In Target CLIs

External CLI selection must be explicit; once the current request or an earlier explicit user standing instruction selects `kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli`, the target CLI may automatically use the global/user and project/local non-adapter Skills it can discover. A project policy counts only when the user explicitly adopted it for the relevant scope; discovering the file is not authorization.

- Respect any Skill explicitly named by the user.
- Prefer project-local Skills over global Skills when both apply, because project-local Skills usually better capture the current repository's constraints, commands, and domain language.
- Prefer `design` for UI interaction design, visual direction, usability, AI-native interaction, or animation work.
- Prefer discoverable `dev` for ordinary implementation or Bug repair inside the target CLI.
- Prefer `clarify` for senior product judgment, requirement, or architecture discovery; ongoing roadmaps, backlog or sprint management, stakeholder coordination, and delivery tracking remain out of scope.
- Use `qa` only when the user explicitly requests independent business understanding, real-usage diagnosis, or QA protection.
- Prefer `acceptance` for independent go/no-go verification.
- The child CLI must not automatically invoke external-agent adapters such as `kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli` unless the user explicitly authorizes multi-agent orchestration.
- The target CLI output should state which Skills were used, or why none were used.

## Default Behavior

`dev` defaults to:

- Chinese for plans, design notes, and delivery documents
- Original language for code, commands, protocol names, and configuration keys
- Lightweight diagrams for architecture and process design
- Test-first work for behavior changes and root-cause analysis for bug fixes when practical
- Explicit verification steps, review conclusions, and plain-language acceptance conclusions before delivery
- Lightweight process by default, without mandatory worktrees, long specs, or multi-agent orchestration
- Reference-based or `design`-Skill-based frontend design, backend architecture, backend quality, and database engineering checklists when needed, instead of turning external skills into a long default process

## License

This repository's own content is licensed under the [MIT License](./LICENSE). The vendored third-party Apache-2.0 content in `design/references/design-direction.md` is accompanied by its full license at [design/references/anthropic-frontend-design-LICENSE.txt](./design/references/anthropic-frontend-design-LICENSE.txt); `design/references/animation.md` is distilled from the MIT-licensed [emilkowalski/skills](https://github.com/emilkowalski/skills).

## GPT-6 Prompting Adaptation

Based on [official GPT-6 Astra prompting guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#prompting-best-practices), checked on 2026-09-05, this library tunes follow-through, instruction conflicts, response length, authorized delegation, and proportional verification. Model selection and CLI permission parameters retain their adapter-specific contracts.

[AGENTS.md](AGENTS.md) is the canonical repository rule file; `CLAUDE.md` loads it. Skill installation does not copy these repository rules into consumer projects. Standalone skills carry their relevant execution boundaries: finish clear implementation requests, block only work dependent on a material unanswered question, and reuse existing authorization. QA, review-only work, external-agent dispatch, and preference persistence retain their admission boundaries.

`npm test` and `npm run doctor` check static contracts, adapter synchronization, and installer safety. Behavior fixtures cover concise delivery, existing authorization, continuation after clarification, and plan-only scope. The text runner uses Anthropic / Claude; dry-run checks fixture loading only. Real execution reports separately identify the host, scope, and limits, without treating static checks as model evidence.
