# Loop Engineering v2: Cognitive Governance

This repository treats Loop Engineering as more than repeated Agent execution.

The goal is to preserve human cognitive control while delegating implementation work to Agents.

## Core Principle

```text
Do not trust the Agent; trust the verifier.
Do not trust the verifier blindly; govern the verifier.
```

The design order is:

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

## Discovery Before Delivery

Ambiguous work should enter a Discovery Loop before a Delivery Loop.

Discovery reduces uncertainty and produces:

- a clearer problem definition;
- explicit facts, assumptions, and unknowns;
- low-cost prototypes or experiments;
- a draft verifier;
- a decision to continue, stop, pivot, or begin delivery.

Delivery implements behavior only after meaningful verification exists.

## Verifier Governance

A verifier should have:

- a real target it represents;
- an owner;
- isolation from the Maker where needed;
- known false-pass and false-reject modes;
- calibration evidence;
- a version and review cadence.

Tests, metrics, rubrics, benchmarks, and LLM judges can all accumulate verification debt when the real goal changes but the evaluator does not.

## Acceptance Independence

Acceptance is classified by separation strength:

- L0: same-Agent self-check.
- L1: fresh-context review.
- L2: independent Agent or model.
- L3: deterministic external verification.
- L4: human or domain-owner approval.

Higher autonomy is not automatically higher maturity. Mature loops are verifiable, explainable, reversible, and recoverable by humans.

## Cognitive Checkpoint

The loop workspace includes `CHECKPOINT.md`.

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

## Human Authority

Humans are not merely the final reviewer. They retain authority over:

- goals;
- non-negotiable constraints;
- verifier definitions;
- irreversible decisions;
- value conflicts;
- policy changes.

Agents execute within rules. Verifiers interpret evidence. Humans maintain the constitution of the system.
