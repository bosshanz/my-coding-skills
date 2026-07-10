---
name: loop-engineering
description: "Design, audit, and improve governed feedback systems around AI coding agents: Loop admission, verifier governance, discovery and delivery loops, evaluation harnesses, delegation protocols, cognitive checkpoints, and operating-model docs. Use when the user explicitly asks for Loop Engineering, Agent Engineering methodology, recurring evaluation or optimization, multi-Agent workflow governance, or when the feedback structure itself needs persistent governance. Do not use for ordinary feature implementation, bug fixes, or routine clarification; route those through dev unless escalation criteria are met."
---

# Loop Engineering

Use this Skill to design and maintain governed feedback systems around AI coding Agents.

A Loop is not the default container for every task. It is an escalation mechanism used when the feedback structure itself becomes part of the engineering problem.

## First Principles

Use the shortest reliable feedback path.

```text
ordinary bounded task -> dev
material ambiguity -> targeted dev questions or explicit clarify
stronger independent judgment -> acceptance
persistent or repeated feedback problem -> governed Loop
```

Do not trust the Agent; trust the verifier. Do not trust the verifier blindly; govern the verifier.

For admitted Loops, rank design priorities in this order:

1. Verification gates.
2. Verifier governance.
3. Permission boundaries.
4. State and memory.
5. Scheduling and checkpoints.
6. Agent capability.

Humans retain constitutional authority over goals, non-negotiable constraints, verifier definitions, irreversible decisions, and policy changes.

## Boundaries

- This is a methodology and operating-model Skill, not a replacement for `dev`.
- Ordinary requirements and bugs go directly through `dev`, including proportionate in-task clarification and testing.
- The top-level `clarify` Skill is optional and reserved for explicit interviews or material product, domain, architecture, lifecycle, migration, or safety ambiguity.
- `acceptance` adds a separate go/no-go review when stronger separation is justified.
- A Loop workspace is optional even when `clarify` is used.
- Multi-file, multi-step, important, planned, or tested work is not automatically a Loop.
- Do not add artifacts or gates unless they reduce more complexity, risk, or uncertainty than they introduce.
- External-Agent adapters require explicit user or project authorization.

## Admission Before Design

Read `references/loop-admission.md` before proposing a new Loop or workspace.

Admit a Loop only when a strong condition exists or several moderate conditions combine:

- State must survive across sessions, Agents, scheduled runs, or days.
- The work requires repeated independent experiments, measurements, or optimization cycles.
- The verifier, benchmark, rubric, metric, threshold, or judge is itself under design or governance.
- Future iterations depend on preserved hypotheses, rejected alternatives, evidence, or overrides.
- The work needs recurring continue / stop / pivot decisions.
- The target is continuous quality, evaluation, operations, learning, or methodology rather than one bounded delivery.
- High-risk work also requires persistent state, staged checkpoints, or repeated verification.

Do not admit a Loop merely because:

- several files are affected;
- there are multiple implementation steps;
- a plan or tests are needed;
- one clarification round is useful;
- the task is important;
- stronger acceptance alone is sufficient.

When most admission questions are no, route to `dev` and stop designing a Loop.

## Core Model

For an admitted Loop, define:

- **Type**: discovery, delivery, debugging, evaluation, governance, learning, maintenance, or methodology.
- **Target**: the behavior, decision, uncertainty, risk, or workflow controlled.
- **Actor**: the Agent, tool, CI job, human, or external system responsible for the next action.
- **Input**: the issue, diff, trace, test, screenshot, log, feedback, dataset, or artifact consumed.
- **Action**: the smallest operation that should move the target forward.
- **Signal**: evidence emitted by the action.
- **Verifier**: the mechanism that interprets the signal.
- **Gate**: the condition that permits progress or forces revision.
- **Escalation**: what happens when evidence is missing, ambiguous, stale, failing, or misaligned.
- **Artifact**: durable evidence or understanding retained for later runs.

Healthy Loops have red-capable signals. A Loop that only produces confidence language is not a verification Loop.

For long-running Loops, also define:

- Cadence.
- Trend signal.
- Continue / stop / pivot criteria.
- Checkpoint artifact.
- Verifier review cadence.

## Discovery And Delivery

Discovery is not mandatory for every requirement.

Use ordinary `dev` when the behavior is sufficiently clear and can be verified within one bounded delivery.

Use the top-level `clarify` Skill when material ambiguity cannot be safely resolved with a few in-task questions.

Use a governed **Discovery Loop** only when uncertainty itself must be managed across repeated experiments or preserved decisions. Its output is reduced uncertainty, hypotheses, evidence, prototypes, and a draft verifier.

Use a governed **Delivery Loop** when delivery itself is repeated, scheduled, resumable, or dependent on persistent state. A normal feature delivery is not automatically a Delivery Loop.

Read `references/discovery-loop.md` only when the discovery-to-delivery boundary materially affects the workflow.

## Loop Workspace

A workspace is created only after:

1. Loop admission criteria are met;
2. the Loop is clear enough to name;
3. the user explicitly opts in or directly asks for tracking.

For one active governed Loop:

```text
loop/
  LOOP.md
  STATE.md
  ROADMAP.md
  CONTEXT.md
  CHECKPOINT.md
  loop-run-log.md
```

For concurrent or durable Loops:

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

Do not create a workspace for ordinary delivery notes, a one-time plan, or a short clarification conversation.

Use:

- `LOOP.md` for the stable contract and authority boundaries.
- `STATE.md` for current mutable state.
- `ROADMAP.md` for phase, milestones, gates, and checkpoints.
- `CONTEXT.md` for task-local facts and evaluation context.
- `CHECKPOINT.md` for the current rationale and understanding snapshot.
- `loop-run-log.md` for append-only chronological evidence.

Read `references/context-model.md` and `references/checkpoint-artifact.md` when a workspace is actually admitted.

## Workflow

### 1. Run Admission

First classify the request:

```text
Direct dev
Explicit or material clarify
Independent acceptance
Governed Loop
```

State why the chosen level is sufficient. If a lower level can solve the problem safely, use it.

### 2. Frame The Methodology Problem

For admitted methodology work, state:

- target;
- Loop type;
- time horizon;
- non-goals;
- current uncertainty;
- why ordinary `dev`, `clarify`, or `acceptance` is insufficient.

### 3. Inventory Existing Feedback

Inspect relevant skills, docs, scripts, CI, tests, metrics, evaluators, issue/PR flows, and adapter contracts.

Map only the Loops relevant to the target, such as:

- recurring discovery or experimentation;
- implementation or debugging increments;
- evaluation and verifier maintenance;
- external-Agent delegation;
- checkpoint acceptance;
- release, rollback, and monitoring;
- durable context and methodology evolution.

For each, identify trigger, owner, signal, verifier, gate, gap, and human authority.

### 4. Design A Compact Contract

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

For long-running work, add only what is needed:

```text
Trend signal:
Continue / stop / pivot:
Checkpoint artifact:
Verifier review cadence:
```

Keep the contract smaller than the complexity it governs.

### 5. Build A Proportionate Verification Ladder

Select the smallest sufficient set:

1. Hard verification: tests, typecheck, schema validation, contracts, benchmarks, migration dry runs.
2. Soft verification: review, screenshots, traces, manual acceptance, UX judgment, rubrics.
3. Safety verification: permissions, security, integrity, rollback, idempotency, recovery.
4. Cost verification: runtime, token, compute, API, storage, operations, human review.
5. Stop rules: reject, retry, escalate, accept with risk, continue, stop, or pivot.
6. Independent acceptance where blast radius or subjectivity justifies it.

Do not impose the full ladder on ordinary deterministic tasks.

### 6. Govern The Verifier

Read `references/verifier-governance.md` when a reusable or consequential verifier controls decisions.

Define proportionately:

- the real target represented;
- owner and change authority;
- isolation from the Maker;
- false-pass and false-reject risks;
- calibration and version;
- drift review cadence.

Ordinary tests do not require ceremonial governance unless their meaning or integrity is disputed.

### 7. Select Acceptance Independence

Read `references/acceptance-independence.md` when stronger separation is needed:

- L0: same-Agent self-check.
- L1: fresh-context review.
- L2: independent Agent or model.
- L3: deterministic external verification.
- L4: human or domain-owner approval.

Independent acceptance is evidenced separation, not a role label.

### 8. Govern Delegation

When another Agent participates:

- require explicit authorization;
- state scope, permissions, files, tests, and expected output;
- prevent recursive delegation by default;
- preserve invocation evidence;
- separate the delegated conclusion from caller review;
- keep final responsibility with the caller.

### 9. Preserve Cognitive Control

For important checkpoints, record:

- what changed and why;
- supporting evidence;
- rejected alternatives;
- unverified areas;
- risks and rollback path;
- verifier version;
- continue / stop / pivot decision.

Do not create `CHECKPOINT.md` for every ordinary task. Use it only in an admitted workspace where future runs need the rationale.

### 10. Accept The Methodology Change

Before delivery, verify:

- Loop admission was justified.
- A simpler route was considered and rejected for a concrete reason.
- The Loop has target, trigger, owner, evidence, verifier, gate, and escalation.
- Verification and governance are proportionate to risk.
- Permission, state, scheduling, budget, rollback, and human authority are explicit where relevant.
- Discovery is not confused with ordinary clarification.
- A workspace is created only when persistence is genuinely needed.
- The Loop does not duplicate `dev`, `clarify`, or `acceptance`.
- The feedback path became more reliable without unnecessary process.

## Output Formats

For design or audit:

```text
Admission decision:
Why simpler routing is insufficient:
Methodology target:
Current feedback inventory:
Proposed Loop architecture:
Verifier governance:
Agent and Skill routing:
Acceptance independence:
Artifacts:
Risks and open decisions:
```

For repository changes:

```text
Methodology change:
Admission boundary:
Files changed:
Validation:
Understanding preserved:
Residual risk:
```

## Review Checklist

- Was Loop admission evaluated before Loop design?
- Could ordinary `dev` solve the task with proportionate verification?
- Is top-level `clarify` used only for explicit or material ambiguity?
- Is a workspace avoided unless persistence or repeated feedback justifies it?
- Does each admitted Loop have evidence that can fail?
- Is the verifier governed only to the depth warranted?
- Are real goals distinguished from proxy metrics?
- Are human authority and irreversible decisions clear?
- Is acceptance independence appropriate and evidenced?
- Can future runs understand the current state without replaying the entire log?
- Is delegation explicit, auditable, non-recursive by default, and reviewed by the caller?
