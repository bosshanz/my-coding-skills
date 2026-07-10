# Discovery Loop

## Purpose

Not every problem should enter a delivery loop immediately. Discovery Loop reduces uncertainty and creates the assumptions and verification strategy required by later delivery work.

## Discovery vs Delivery

Discovery Loop:

```text
Target: reduce uncertainty
Signal: evidence, feedback, prototypes, conflicts, new hypotheses
Gate: enough understanding to define a meaningful next action
Artifact: problem definition, assumptions, prototypes, verification draft
```

Delivery Loop:

```text
Target: deliver defined behavior
Signal: diff, tests, runtime evidence
Gate: acceptance criteria satisfied
Artifact: code, tests, docs, release evidence
```

## Discovery Activities

- Generate multiple interpretations of the problem.
- Separate facts, assumptions, constraints, and unknowns.
- Build low-cost prototypes before expensive implementation.
- Identify what evidence would change the decision.
- Turn uncertainty into explicit hypotheses.

## Exit Conditions

A Discovery Loop should stop when:

- The problem is understood enough for implementation.
- The direction is proven unnecessary.
- A different hypothesis becomes more valuable.

Discovery is not failed delivery. Reducing uncertainty is the deliverable.
