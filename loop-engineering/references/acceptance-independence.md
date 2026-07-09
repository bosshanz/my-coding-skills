# Acceptance Independence Levels

## Purpose

Acceptance quality depends on separation between creation and judgment.

## Levels

### L0 — Self Check

Same agent and same context verifies its own work.

Suitable for low-risk changes.

### L1 — Fresh Context Review

Same model, but a new context without implementation reasoning history.

Reduces self-justification bias.

### L2 — Independent Agent Review

Different agent or model evaluates the result.

Suitable for architecture and important behavior changes.

### L3 — Deterministic External Verification

CI, tests, benchmarks, schema validators, browser automation, or other objective checks.

### L4 — Human / Domain Owner Approval

Required for irreversible, product, safety, security, compliance, or value decisions.

## Selection Rule

Choose independence level based on:

- Blast radius.
- Reversibility.
- Cost of being wrong.
- Amount of subjective judgment required.
