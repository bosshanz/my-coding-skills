---
name: loop-engineering
description: "Design, audit, and improve agent engineering methodology: feedback-loop architecture, verifier governance, discovery and delivery loops, evaluation harnesses, delegation protocols, cognitive checkpoints, and operating-model docs for AI coding agents. Use when the user asks for loop engineering, agent engineering methodology, agent workflow design, feedback-loop design, eval-driven agent development, multi-agent coding workflow governance, or upgrading a skill repo from task skills into a methodology. Do not use for ordinary feature implementation or bug fixes; route those through dev unless the work is about the engineering loop itself."
---

# Loop Engineering

Use this Skill to design and maintain the engineering system around AI coding agents. The output is a feedback-loop architecture: what agents do, what evidence they must produce, which checks can disprove bad work, who governs those checks, where humans decide, and how the methodology evolves.

## First Principles

Do not trust the Agent; trust the verifier. Do not trust the verifier blindly; govern the verifier.

Rank loop design priorities in this order:

1. **Verification gates**: hard, soft, safety, cost, and stop/end-rule checks that can reject bad work.
2. **Verifier governance**: who owns the verifier, what real goal it represents, how it is calibrated, isolated, versioned, and reviewed for drift.
3. **Permission boundaries**: what the Agent may read, write, run, delegate, install, spend, or publish.
4. **State and memory**: the durable facts, decisions, signals, and next actions the loop carries forward.
5. **Scheduling mechanism**: when the loop runs, what triggers it, and what cadence or checkpoint governs long-running work.
6. **Agent capability**: model, tool, adapter, or prompt strength, considered only after verification and control surfaces are defined.

The human is not merely the final checker. Humans retain constitutional authority over goals, non-negotiable constraints, verifier definitions, irreversible decisions, and policy changes.

## Boundaries

- Treat this as a methodology and operating-model Skill, not a replacement for `dev`.
- Use `clarify` for a dedicated requirement or architecture interview, `dev` for ordinary implementation and bug repair, and `acceptance` for independent go/no-go review.
- Do not force every loop into a requirement-delivery shape. Discovery, long-running improvement, evaluation, governance, maintenance, learning, and methodology loops need different signals and exit criteria.
- For long-running non-requirement loops, `dev` executes bounded increments or experiments; `acceptance` reviews milestones, checkpoints, or explicit go/no-go gates.
- Use external-agent adapters only when the user or project policy explicitly authorizes a target agent.
- Do not add process for its own sake. Every loop, artifact, or gate must shorten feedback, reduce risk, preserve auditability, reduce uncertainty, or improve repeatability.
- Prefer repository-specific workflow changes over generic methodology prose when a repo is in scope.

## Core Model

A loop is useful only when it can change behavior. Define each loop with:

- **Type**: discovery, delivery, debugging, evaluation, governance, learning, maintenance, or methodology.
- **Target**: the behavior, decision, uncertainty, risk, or workflow the loop controls.
- **Actor**: the agent, tool, CI job, human, or external system responsible for the next action.
- **Input**: the prompt, issue, diff, trace, test, screenshot, log, user feedback, or artifact consumed.
- **Action**: the smallest operation that should move the target forward.
- **Signal**: the evidence emitted by the action.
- **Verifier**: the mechanism that interprets the signal.
- **Gate**: the condition that allows progress or forces revision.
- **Escalation**: what happens when the signal is missing, ambiguous, stale, failing, or no longer aligned with the real target.
- **Artifact**: the durable note, skill, script, test, log, checkpoint, PR comment, ADR, or README update retained for later loops.

Healthy loops have red-capable signals: they can fail before the work is correct and pass after the work is correct. A loop that only produces confidence language is not a verification loop.

For a long-running loop, also define:

- **Cadence**: when the loop runs or what event triggers another iteration.
- **Trend signal**: what should improve, stabilize, or stay within bounds.
- **Continue / stop / pivot criteria**: when to keep iterating, close the loop, or redesign it.
- **Checkpoint artifact**: where the current understanding is summarized without copying the whole chronological log.
- **Verifier review cadence**: when the metric, benchmark, rubric, threshold, or judge must be recalibrated.

## Discovery And Delivery

Do not send an ambiguous problem directly into a delivery loop.

Use a **Discovery Loop** when the target is still uncertain. Its deliverable is reduced uncertainty:

- multiple problem interpretations;
- explicit facts, assumptions, constraints, and unknowns;
- low-cost prototypes or experiments;
- evidence that would change the decision;
- a draft verifier and exit criteria for later delivery.

Use a **Delivery Loop** only when the intended behavior and meaningful verification are sufficiently defined. Read `references/discovery-loop.md` when deciding whether work is ready to move from discovery to delivery.

## Durable Loop Workspace

For multi-step or resumable work, use a durable loop workspace when the user opts in during `clarify` or directly asks for loop tracking.

For one active task, a repository may use:

```text
loop/
  LOOP.md
  STATE.md
  ROADMAP.md
  CONTEXT.md
  CHECKPOINT.md
  loop-run-log.md
```

For multiple concurrent or durable loops, prefer:

```text
loops/
  <loop-id>/
    LOOP.md
    STATE.md
    ROADMAP.md
    CONTEXT.md
    CHECKPOINT.md
    loop-run-log.md
```

Use these files as the shared state surface across `clarify`, `dev`, `acceptance`, and authorized external agents. Their roles, durability tiers, and promotion rules are defined canonically in `references/context-model.md`.

Do not create a workspace silently. `clarify` should ask once after the work is clear enough to name. If an existing workspace appears unrelated, ask whether to reuse it, archive it, or create a separate named loop directory.

For a long-running loop:

- use `STATE.md` for the current hypothesis, latest signal, blocker, and next experiment;
- use `ROADMAP.md` for cadence, checkpoints, and continue / stop / pivot criteria;
- use `CHECKPOINT.md` for the current understanding snapshot;
- use `loop-run-log.md` as the append-only chronological evidence trail.

Read `references/checkpoint-artifact.md` before designing a checkpoint format.

## Workflow

### 1. Frame The Methodology Problem

Identify whether the user is asking to:

- Design a new agent workflow or operating model.
- Audit an existing agent workflow for weak feedback, missing gates, verifier drift, or unclear ownership.
- Upgrade a skill repository into a broader agent engineering methodology.
- Add evaluation, acceptance, CI, observability, verifier governance, or delegation protocols.
- Convert repeated agent failures into stronger loops, tests, docs, or skills.
- Establish a discovery loop for a problem that is not ready for delivery.
- Establish a long-running loop for quality, evaluation, operations, governance, learning, or methodology evolution.

State the methodology target, loop type, time horizon, non-goals, and current uncertainty before proposing structure.

### 2. Inventory Existing Loops

Inspect local skills, docs, scripts, CI, tests, issue templates, PR flows, metrics, evaluators, and adapter contracts before inventing new artifacts. Map the relevant current loops:

- Discovery and requirement clarification loop.
- Durable workspace creation and update loop.
- Design and planning loop.
- Implementation loop.
- Debugging and reproduction loop.
- Test and evaluation loop.
- Verifier maintenance and calibration loop.
- External-agent delegation loop.
- Review and acceptance loop.
- Release, rollback, and monitoring loop.
- Documentation, memory, checkpoint, and methodology update loop.

For each loop, name the current trigger, owner, signal, verifier, gate, gap, and human authority point.

### 3. Design Loop Contracts

For every new or changed loop, define a compact contract:

```text
Loop:
Type:
Target:
Trigger / Cadence:
Owner:

Inputs:
Allowed actions:
Forbidden actions:

Evidence:
Verifier:
Verifier owner:
Gate:

Budget:
Rollback:
Human authority:
Escalation:

Durable artifact:
```

Keep contracts short enough to be used in real work. Omit fields only when they are genuinely irrelevant, not because they are inconvenient.

For long-running loops, extend the contract only as needed:

```text
Trend signal:
Continue / stop / pivot:
Checkpoint artifact:
Verifier review cadence:
```

### 4. Build The Verification Ladder

Choose the smallest evidence ladder that can disprove wrong work:

1. Hard verification: deterministic checks such as tests, lint, typecheck, parser validation, schema checks, contract tests, benchmarks, and migration dry runs.
2. Soft verification: review, screenshots, logs, traces, manual acceptance, UX judgment, rubrics, and human-readable evidence for behavior hard checks cannot fully cover.
3. Safety verification: permission, security, data integrity, rollback, idempotency, blast radius, and recovery checks.
4. Cost verification: runtime, token, API, compute, migration, storage, operational, and human-review cost boundaries.
5. Stop and end rules: explicit conditions for stopping, rejecting, escalating, accepting with risk, continuing, or pivoting.
6. Independent acceptance: a chosen independence level for high-risk or subjective work.

Do not require every rung for every task. Select rungs based on blast radius, reversibility, cost of being wrong, and amount of subjective judgment.

### 5. Govern The Verifier

Read `references/verifier-governance.md` for important loops.

At minimum, decide:

- what real target the verifier represents;
- who owns and may change it;
- whether the Maker can modify tests, benchmarks, thresholds, or judge prompts;
- known false-pass and false-reject modes;
- calibration evidence and verifier version;
- when drift review is required.

A system that allows the Maker to redefine its own success criteria is not a trustworthy loop.

### 6. Select Acceptance Independence

Read `references/acceptance-independence.md` and choose the smallest sufficient level:

- L0: same-agent self-check;
- L1: fresh-context review;
- L2: independent agent or model review;
- L3: deterministic external verification;
- L4: human or domain-owner approval.

“Independent acceptance” is a claim that must be evidenced, not merely a role name.

### 7. Govern Agent Delegation

When a loop involves another agent, preserve accountability:

- Require explicit user or project authorization before invoking an external agent.
- State the delegated scope, allowed files, edit permission, test permission, and expected output.
- Prevent recursive external-agent delegation unless explicitly authorized.
- Preserve invocation evidence and separate the target agent's conclusion from the caller's review.
- Require the caller agent to inspect diffs, run or review verification, and own the final answer.
- Let target CLIs use matching non-adapter skills such as `dev`, `clarify`, `acceptance`, or `loop-engineering` when discoverable.

Delegation is a loop amplifier only when the caller can verify the result. Otherwise it is just unreviewed parallel work.

### 8. Preserve Cognitive Control

A loop must leave enough evidence for a future human or agent to understand why the current state exists.

For important changes, capture:

- what changed and why;
- which evidence supported the decision;
- which alternatives were rejected;
- what remains unverified;
- current risks and rollback path;
- which verifier version produced the conclusion.

Use a checkpoint artifact instead of forcing readers to reconstruct understanding from a long run log.

### 9. Update The Methodology Surface

When changing this repository or a similar skill system, keep the surface consistent:

- Add or update the Skill folder, `SKILL.md`, and `agents/openai.yaml`.
- Update installer and uninstaller skill lists, groups, examples, and package manifests.
- Update doctor or validation scripts so the methodology layer is checked.
- Update README and README translations with the conceptual model, trigger guidance, install commands, and examples.
- Keep adapter contracts aligned with the method: external agents must not be simulated, recursively delegated, or treated as accepted without caller verification.

### 10. Accept The Methodology Change

Before delivery, verify:

- The new loop has a clear target, trigger, owner, evidence, verifier, gate, and escalation.
- The verifier has an owner, alignment rationale, isolation rule, and review strategy where risk justifies them.
- Verification gates are designed before relying on Agent capability.
- Permission boundaries, state/memory, scheduling, budget, rollback, and human authority are explicit where relevant.
- Discovery work is not prematurely presented as delivery.
- Long-running loops identify cadence, trend signal, checkpoint artifact, and continue / stop / pivot criteria.
- The loop does not duplicate an existing Skill's normal job.
- The shortest feedback path became clearer or faster.
- The methodology can be invoked by name and discovered through frontmatter.
- Documentation explains when to use the methodology layer versus `dev`, `clarify`, and `acceptance`.

## Output Formats

Use this structure for design or audit work:

```text
Methodology target:
Current uncertainty:
Current loop inventory:
Proposed loop architecture:
Verifier governance:
Skill and agent routing:
Acceptance independence:
Artifacts to change:
Rollout plan:
Risks and open decisions:
```

Use this shorter structure for repository changes:

```text
Methodology change:
Files changed:
Validation:
Understanding preserved:
Residual risk:
```

## Review Checklist

- Does each loop have evidence that can fail?
- Is the verifier governed rather than merely trusted?
- Are real goals distinguished from proxy metrics?
- Are verifier, permission boundary, state/memory, scheduler, and Agent capability ordered in that priority?
- Are hard, soft, safety, cost, and stop/end-rule verification covered at the smallest practical level?
- Is ambiguous work routed through discovery before delivery?
- If the loop is long-running, does it define cadence, checkpoint artifacts, verifier review, and stop or pivot criteria?
- Is the human checkpoint placed at the highest-leverage irreversible or value-laden decision?
- Is acceptance independence appropriate and evidenced?
- Can the loop be understood without reading the entire chronological log?
- Are ordinary coding tasks still routed to `dev` instead of this Skill?
- Is delegation explicit, auditable, non-recursive by default, and reviewed by the caller?
- Are docs and install tooling consistent with the methodology surface?
