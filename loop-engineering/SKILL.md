---
name: loop-engineering
description: "Design, audit, and improve agent engineering methodology: feedback-loop architecture, verification gates, evaluation harnesses, delegation protocols, and operating-model docs for AI coding agents. Use when the user asks for loop engineering, agent engineering methodology, agent workflow design, feedback-loop design, eval-driven agent development, multi-agent coding workflow governance, or upgrading a skill repo from task skills into a methodology. Do not use for ordinary feature implementation or bug fixes; route those through dev unless the work is about the engineering loop itself."
---

# Loop Engineering

Use this Skill to design and maintain the engineering system around AI coding agents. The output is a feedback-loop architecture: what agents do, what evidence they must produce, which checks can disprove bad work, where humans decide, and how the methodology evolves.

## Boundaries

- Treat this as a methodology and operating-model Skill, not a replacement for `dev`.
- Use `clarify` for a dedicated requirement or architecture interview, `dev` for ordinary implementation and bug repair, and `acceptance` for independent go/no-go review.
- Use external-agent adapters only when the user or project policy explicitly authorizes a target agent.
- Do not add process for its own sake. Every loop, artifact, or gate must shorten feedback, reduce risk, preserve auditability, or improve repeatability.
- Prefer repository-specific workflow changes over generic methodology prose when a repo is in scope.

## Core Model

A loop is useful only when it can change behavior. Define each loop with:

- **Target**: the behavior, decision, risk, or workflow the loop controls.
- **Actor**: the agent, tool, CI job, human, or external system responsible for the next action.
- **Input**: the prompt, issue, diff, trace, test, screenshot, log, or artifact consumed.
- **Action**: the smallest operation that should move the target forward.
- **Signal**: the evidence emitted by the action.
- **Gate**: the condition that allows progress or forces revision.
- **Escalation**: what happens when the signal is missing, ambiguous, stale, or failing.
- **Artifact**: the durable note, skill, script, test, log, PR comment, ADR, or README update retained for later loops.

Healthy loops have red-capable signals: they can fail before the work is correct and pass after the work is correct. A loop that only produces confidence language is not a verification loop.

## Durable Loop Workspace

For multi-step or resumable work, use a durable `loop/` workspace when the user opts in during `clarify` or directly asks for loop tracking:

```text
loop/
  LOOP.md
  STATE.md
  ROADMAP.md
  CONTEXT.md
  loop-run-log.md
```

Use these files as the shared state surface across `clarify`, `dev`, `acceptance`, and authorized external agents:

- `LOOP.md`: stable contract for target, scope, actors, feedback loops, gates, and escalation rules.
- `STATE.md`: current status, latest decisions, blockers, open questions, and next action.
- `ROADMAP.md`: milestones, tasks, acceptance criteria, and verification ladder.
- `CONTEXT.md`: loop-local repository facts, domain terms, constraints, relevant files, and commands.
- `loop-run-log.md`: append-only chronological evidence log for actions, user answers, commands, decisions, and handoffs.

Do not create this workspace silently. `clarify` should ask once after the work is clear enough to name. If `loop/` already exists and appears unrelated, ask whether to reuse it, archive it, or create a separate loop directory before writing.

## Workflow

### 1. Frame The Methodology Problem

Identify whether the user is asking to:

- Design a new agent workflow or operating model.
- Audit an existing agent workflow for weak feedback, missing gates, or unclear ownership.
- Upgrade a skill repository into a broader agent engineering methodology.
- Add evaluation, acceptance, CI, observability, or delegation protocols.
- Convert repeated agent failures into stronger loops, tests, docs, or skills.

State the methodology target and the non-goals before proposing structure.

### 2. Inventory Existing Loops

Inspect local skills, docs, scripts, CI, tests, issue templates, PR flows, and adapter contracts before inventing new artifacts. Map the relevant current loops:

- Request clarification loop.
- Durable loop workspace creation and update loop.
- Design and planning loop.
- Implementation loop.
- Debugging and reproduction loop.
- Test and evaluation loop.
- External-agent delegation loop.
- Review and acceptance loop.
- Release, rollback, and monitoring loop.
- Documentation, memory, and methodology update loop.

For each loop, name the current trigger, owner, signal, gate, and gap.

### 3. Design Loop Contracts

For every new or changed loop, define a compact contract:

```text
Loop:
Trigger:
Owner:
Inputs:
Actions:
Evidence:
Gate:
Escalation:
Durable artifact:
```

Keep contracts short enough to be used in real work. Put detailed rules inside a Skill only when they affect agent behavior at task time; put project explanation in README or docs.

### 4. Build The Verification Ladder

Choose the smallest evidence ladder that can disprove wrong work:

1. Static evidence: diff review, schema checks, lint, typecheck, parser validation.
2. Unit or fixture evidence: focused tests, golden files, contract tests.
3. Integration evidence: real service paths, CLI commands, API calls, database fixtures.
4. UI or runtime evidence: browser checks, screenshots, logs, traces, manual acceptance.
5. CI or release evidence: pipeline status, migration dry runs, rollout guards.
6. Independent acceptance: separate go/no-go review for high-risk work.

Do not require every rung for every task. Select rungs based on blast radius, reversibility, and cost of being wrong.

### 5. Govern Agent Delegation

When a loop involves another agent, preserve accountability:

- Require explicit user or project authorization before invoking an external agent.
- State the delegated scope, allowed files, edit permission, test permission, and expected output.
- Prevent recursive external-agent delegation unless explicitly authorized.
- Preserve invocation evidence and separate the target agent's conclusion from the caller's review.
- Require the caller agent to inspect diffs, run or review verification, and own the final answer.
- Let target CLIs use matching non-adapter skills such as `dev`, `clarify`, `acceptance`, or `loop-engineering` when discoverable.

Delegation is a loop amplifier only when the caller can verify the result. Otherwise it is just unreviewed parallel work.

### 6. Update The Methodology Surface

When changing this repository or a similar skill system, keep the surface consistent:

- Add or update the Skill folder, `SKILL.md`, and `agents/openai.yaml`.
- Update installer and uninstaller skill lists, groups, examples, and package manifests.
- Update doctor or validation scripts so the new methodology layer is checked.
- Update README and README translations with the new conceptual model, trigger guidance, install commands, and examples.
- Keep adapter contracts aligned with the method: external agents must not be simulated, recursively delegated, or treated as accepted without caller verification.

### 7. Accept The Methodology Change

Before delivery, verify:

- The new loop has a clear target, trigger, owner, evidence, gate, and escalation.
- The loop does not duplicate an existing Skill's normal job.
- The shortest feedback path got clearer or faster.
- The methodology can be invoked by name and discovered through frontmatter.
- Install, uninstall, list, and doctor paths include any new Skill.
- Documentation explains when to use the methodology layer versus `dev`, `clarify`, and `acceptance`.

## Output Formats

Use this structure for design or audit work:

```text
Methodology target:
Current loop inventory:
Proposed loop architecture:
Skill and agent routing:
Verification gates:
Artifacts to change:
Rollout plan:
Risks and open decisions:
```

Use this shorter structure for repository changes:

```text
Methodology change:
Files changed:
Validation:
Residual risk:
```

## Review Checklist

- Does each loop have evidence that can fail?
- Is the human checkpoint placed at the highest-leverage irreversible decision?
- Are ordinary coding tasks still routed to `dev` instead of this Skill?
- Are independent review and acceptance separate when risk justifies separation?
- Is delegation explicit, auditable, non-recursive by default, and reviewed by the caller?
- Are docs and install tooling consistent with the new methodology surface?
