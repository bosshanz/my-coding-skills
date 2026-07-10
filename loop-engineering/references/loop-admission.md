# Loop Admission Criteria

## Principle

A Loop is not the default container for every task, and `clarify` is not a mandatory phase for every requirement.

Most work should use the shortest sufficient path:

```text
clear ordinary task -> dev -> proportionate verification
```

A Loop is an escalation mechanism for work whose feedback structure itself needs governance: persistent state, repeated experiments, verifier management, cross-run decisions, or long-term evolution.

## Default Route

Use direct delivery by default when the task can be understood, implemented, and verified within one bounded work session.

Examples:

- Small bug fixes with a clear reproduction and regression test.
- Simple CRUD or field changes.
- One-file refactors with obvious verification.
- Documentation edits.
- Formatting, renaming, or mechanical changes.
- Small UI adjustments with clear acceptance criteria.
- Multi-file work that is still bounded, well understood, and easy to verify.

These should normally go directly through `dev`. `dev` may ask a small number of targeted questions inside its normal workflow without invoking the top-level `clarify` Skill or creating a Loop workspace.

## Clarify Admission

Use the top-level `clarify` Skill only when at least one of these is true:

- The user explicitly requests an interview, requirement challenge, or architecture discussion.
- A material product, domain, architecture, lifecycle, or safety decision is unresolved.
- The request is solution-shaped and may be solving the wrong problem.
- Several plausible interpretations would lead to meaningfully different implementations.
- The cost of implementing the wrong interpretation is high.
- Durable domain language or an ADR-worthy decision must be established before delivery.

Do not invoke `clarify` merely because a task is new, multi-step, or touches multiple files. Ordinary clarification remains part of `dev`.

## Loop Admission

Create or propose a Loop only when a strong condition exists or several moderate conditions combine.

### Persistent State

The work spans sessions, agents, scheduled runs, or days and requires preserved state beyond normal task notes.

### Repeated Feedback

The work requires multiple meaningful experiments, measurements, optimization cycles, or recurrent checks.

### Verifier Governance

The evaluator, benchmark, rubric, metric, threshold, or judge is itself part of the engineering problem.

### Cross-Run Decisions

Future iterations depend on understanding previous hypotheses, rejected alternatives, evidence, or human overrides.

### Continue / Stop / Pivot

The work needs explicit decisions about whether to keep investing, terminate, or change direction.

### Continuous Operation

The target is maintaining quality, evaluation, operations, learning, or methodology rather than completing one bounded delivery.

### High-Risk Long-Running Work

Risk is high and the work also requires persistent state, repeated verification, or staged checkpoints. High risk alone may justify stronger acceptance, but does not automatically require a Loop.

## Non-Signals

The following do not by themselves justify a Loop:

- The task is called a project.
- The task touches many files.
- The task has several implementation steps.
- The task needs tests.
- The task needs a plan.
- The task benefits from one round of clarification.
- The task is important.

These may justify careful `dev` work or independent `acceptance`, but not necessarily persistent Loop governance.

## Decision Rule

Ask:

1. Does this need state beyond the current bounded delivery?
2. Does it need repeated independent iterations rather than ordinary implementation steps?
3. Is the verifier itself changing, uncertain, or reusable?
4. Will future decisions depend on preserved rationale and evidence?
5. Does it need recurring continue / stop / pivot decisions?
6. Will the Loop artifacts reduce more complexity than they introduce?

If the answers are mostly no, do not create a Loop.

If only clarification is needed, use lightweight questions inside `dev` or explicitly invoke `clarify` without creating a Loop workspace.

## Escalation Path

Use progressive escalation:

```text
Direct dev
  -> stronger in-task clarification
  -> explicit clarify
  -> independent acceptance
  -> Loop workspace
  -> long-running governed Loop
```

Start at the lowest level that can safely solve the problem. Escalate only when evidence shows the current level is insufficient.

## Final Test

A Loop is justified only when the feedback structure itself is part of the problem.

The goal is not to maximize Loop or `clarify` usage. The goal is to preserve the shortest reliable feedback path.
