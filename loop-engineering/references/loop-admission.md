# Loop Admission Criteria

## Principle

A Loop is not the default container for every task.

A Loop is a governance mechanism for work that needs persistent state, repeated feedback, explicit verification, or long-term evolution. Most ordinary requests should remain simple conversations or direct delivery tasks.

## Do Not Create A Loop For

Examples:

- Small bug fixes with a clear reproduction and deterministic test.
- Simple CRUD changes.
- One-file refactors with obvious verification.
- Documentation edits.
- Formatting, renaming, or mechanical changes.
- Small UI adjustments with clear acceptance criteria.

These should normally go directly through `dev`.

## Consider A Loop When Multiple Conditions Exist

Create a Loop when the work has one or more of these characteristics:

### Persistent State

The work spans multiple sessions, agents, or days and requires preserved context.

### Uncertain Target

The real problem, product direction, architecture, or solution space is unclear.

### Repeated Feedback

The work requires multiple experiments, measurements, or optimization cycles.

### Independent Verification

The result needs stronger acceptance, evaluation, benchmarks, or governance.

### High Risk

The cost of being wrong is high due to migration, security, reliability, product impact, or irreversible decisions.

### Continuous Improvement

The goal is not a single delivery but maintaining quality, evaluation, operations, or methodology.

## Decision Rule

Ask:

1. Does this need memory beyond the current conversation?
2. Does this need more than one meaningful iteration?
3. Is the verifier itself part of the problem?
4. Will future decisions depend on understanding why previous choices were made?
5. Is there value in continue / stop / pivot decisions?

If most answers are no, do not create a Loop.

## Clarify Behavior

`clarify` should not ask about Loop creation for every request.

Use normal clarification for ordinary work.

Introduce Loop workspace only when complexity, uncertainty, risk, or duration justifies the overhead.

The goal is not to maximize Loop usage. The goal is to create a Loop only when the feedback structure itself becomes part of solving the problem.
