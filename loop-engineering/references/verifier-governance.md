# Verifier Governance

## Purpose

A Loop is only as reliable as its verifier. Verification itself must be governed because metrics, tests, and evaluators can drift away from the real goal.

## Verifier Contract

Every important verifier should define:

```text
Verifier:
Owner:
Target behavior:
Evidence source:
Decision rule:
Known blind spots:
Calibration method:
Version:
Review cadence:
```

## Governance Questions

Before trusting a verifier, ask:

- Does it measure the real goal or only a proxy metric?
- Can the Agent modify the verifier, benchmark, threshold, or judge prompt?
- What false positives can it allow?
- What false negatives can it create?
- Does it have known good and bad examples for calibration?
- When should it be reviewed or replaced?

## Isolation Rules

Prefer separating:

- Maker: produces changes.
- Verifier: evaluates changes.
- Owner: maintains evaluation rules.

A system that lets the Maker redefine its own success criteria is not a trustworthy loop.

## Verifier Drift

Treat verifier changes as methodology changes, not ordinary maintenance. Record:

- Why the verifier changed.
- What behavior it now represents.
- What old conclusions may no longer be comparable.
- Which historical evaluations need reinterpretation.
