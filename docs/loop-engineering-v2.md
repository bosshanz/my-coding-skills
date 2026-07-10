# Loop Engineering v2: Cognitive Governance

This repository treats Loop Engineering as more than repeated Agent execution.

The goal is to preserve human cognitive control while delegating implementation work to Agents, without turning every request into a governed Loop.

## Admission Principle

Use the shortest reliable feedback path:

```text
clear bounded task -> dev
material ambiguity -> targeted dev questions or explicit clarify
stronger independent judgment -> acceptance
persistent or repeated feedback problem -> governed Loop
```

Neither `clarify` nor Loop creation is mandatory for every new requirement.

- `dev` owns ordinary clarification, implementation, testing, and lightweight acceptance.
- `clarify` is an explicit escalation for interviews or material product, domain, architecture, lifecycle, migration, or safety ambiguity.
- A Loop is admitted only when state, feedback, verification, or decisions must persist across independent iterations.

Multi-file, multi-step, important, planned, or tested work is not automatically a Loop.

## Core Principle

```text
Do not trust the Agent; trust the verifier.
Do not trust the verifier blindly; govern the verifier.
```

For an admitted Loop, the design order is:

1. Verification gates.
2. Verifier governance.
3. Permission boundaries.
4. State and memory.
5. Scheduling and checkpoints.
6. Agent capability.

## Two Loops

### Execution Loop

```text
Action -> Signal -> Verification -> Accept / Revise / Rollback
```

### Cognitive Loop

```text
Observe system behavior
-> Review target and verifier
-> Detect proxy drift or missing constraints
-> Update policy
```

The execution loop completes work. The cognitive loop decides whether the system is still doing the right work.

These structures are introduced only when repeated or persistent feedback warrants them. A normal feature or bug fix can remain a bounded `dev` task.

## Clarification, Discovery, And Delivery

Ordinary uncertainty should be resolved with a few targeted questions inside `dev`.

Use the top-level `clarify` Skill when several plausible interpretations would lead to materially different implementations, when the request may be solving the wrong problem, or when a high-leverage decision must be made before delivery.

A clarification conversation does not automatically become a Discovery Loop.

Use a governed Discovery Loop only when uncertainty must be managed through repeated experiments, preserved hypotheses, evaluator design, or continue / stop / pivot decisions across runs.

Discovery may produce:

- a clearer problem definition;
- explicit facts, assumptions, and unknowns;
- low-cost prototypes or experiments;
- a draft verifier;
- a decision to continue, stop, pivot, or begin delivery.

A normal one-time delivery does not need to be labeled a Delivery Loop. A governed Delivery Loop is useful when delivery is repeated, scheduled, resumable, or dependent on persistent state.

## Loop Admission

A governed Loop is normally justified when a strong condition exists or several moderate conditions combine:

- state must survive across sessions, Agents, scheduled runs, or days;
- repeated independent experiments or optimization cycles are required;
- the verifier, benchmark, metric, rubric, threshold, or judge is itself part of the problem;
- future decisions depend on preserved hypotheses, evidence, rejected alternatives, or overrides;
- recurring continue / stop / pivot decisions are required;
- the target is continuous quality, evaluation, operations, learning, or methodology.

The following are not sufficient alone:

- many files;
- many implementation steps;
- a plan;
- tests;
- one clarification round;
- task importance.

The Loop must reduce more complexity than its artifacts and governance introduce.

## Verifier Governance

A consequential or reusable verifier should have:

- a real target it represents;
- an owner;
- isolation from the Maker where needed;
- known false-pass and false-reject modes;
- calibration evidence;
- a version and review cadence.

Tests, metrics, rubrics, benchmarks, and LLM judges can accumulate verification debt when the real goal changes but the evaluator does not.

Ordinary deterministic tests do not require ceremonial verifier governance unless their meaning or integrity is disputed.

## Acceptance Independence

Acceptance is classified by separation strength:

- L0: same-Agent self-check.
- L1: fresh-context review.
- L2: independent Agent or model.
- L3: deterministic external verification.
- L4: human or domain-owner approval.

Higher autonomy is not automatically higher maturity. Mature systems are verifiable, explainable, reversible, and recoverable by humans.

A stronger acceptance level may be enough for a high-risk bounded task; high risk does not automatically require a persistent Loop.

## Cognitive Checkpoint

An admitted Loop workspace includes `CHECKPOINT.md` when future runs need to understand the current rationale.

It records:

- current target;
- what changed and why;
- evidence;
- rejected alternatives;
- unverified areas;
- verifier version;
- current risks;
- continue / stop / pivot decision;
- next experiment;
- rollback path.

`loop-run-log.md` preserves chronology. `CHECKPOINT.md` preserves understanding.

Do not create checkpoints for ordinary bounded tasks that can be understood from the diff, tests, and delivery summary.

## Human Authority

Humans are not merely the final reviewer. They retain authority over:

- goals;
- non-negotiable constraints;
- verifier definitions;
- irreversible decisions;
- value conflicts;
- policy changes.

Agents execute within rules. Verifiers interpret evidence. Humans maintain the constitution of the system.

## Progressive Escalation

```text
Direct dev
  -> stronger in-task clarification
  -> explicit clarify
  -> independent acceptance
  -> Loop workspace
  -> long-running governed Loop
```

Start at the lowest level that can safely solve the problem. Escalate only when evidence shows that the current level is insufficient.
