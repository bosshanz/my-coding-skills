# Design And Research

## Lightweight Design

- Start from the user's goal, success criteria, constraints, and the smallest useful deliverable.
- Ask only enough questions to remove material ambiguity; prefer one clear question at a time.
- For non-trivial work, propose 2-3 approaches with tradeoffs, then recommend one.
- Scale the design to the task: a few bullets for small work, a short structured design for larger work, and a diagram only when it clarifies boundaries or flow.
- Avoid mandatory long design docs unless the user asks or the decision needs durable review.

## Implementation Planning

- Break work into small, reviewable steps that can be verified independently.
- Each step should name the relevant files or modules when they are known.
- Include the expected verification for the step: failing test, targeted test, build check, manual functional check, or review checklist.
- Use YAGNI aggressively: remove scope that does not directly support the current goal.
- Prefer batching only mechanical or low-risk changes; keep behavior changes easy to inspect.
- Split delivery into tracer-bullet vertical slices when the work spans layers. Each slice should prove a narrow complete path, not only one horizontal layer.

## Codebase Design Vocabulary

Use this vocabulary when discussing module shape or refactoring:

- **Module**: anything with an interface and an implementation, from a function to a package.
- **Interface**: everything a caller must know to use the module correctly: types, invariants, ordering, errors, configuration, and performance expectations.
- **Seam**: the place where behavior can vary without editing the caller.
- **Adapter**: a concrete implementation that sits at a seam.
- **Depth**: how much useful behavior sits behind how little interface a caller must learn.
- **Leverage**: the caller benefit from a deep module.
- **Locality**: the maintainer benefit from concentrating change, bugs, and verification in one place.

Prefer deep modules: small interfaces with meaningful behavior behind them. Use the deletion test: if deleting a module makes complexity disappear, it was probably pass-through; if deleting it spreads complexity across callers, it was earning its place.

## Frontend Design

- Start from user goal, main task flow, and the information hierarchy.
- Define the key screens, states, edge states, and transitions before polishing visuals.
- Produce interfaces that are intentional, not generic. Keep typography, spacing, color, and component emphasis coherent.
- Cover loading, empty, error, success, hover, focus, and responsive states.
- Add a flow diagram when the UI involves multi-step interaction, branching, or role-based paths.

## UI And Interaction

- Prefer simple flows with clear actions and minimal ambiguity.
- Reduce user effort: fewer steps, stronger defaults, obvious feedback.
- Make destructive or irreversible actions explicit.
- Align interaction details with the product's existing design language when one exists.

## Backend Research

- Research before coding when library behavior, protocol choices, schema design, or middleware semantics are uncertain.
- Prefer primary sources: official docs, source code, RFCs, framework references, or direct behavior verification.
- Capture only the decision-relevant outcome: chosen option, rejected options, and why.

## Research Output Template

Use this structure for technical research:

- Background
- Options
- Comparison
- Recommendation
- Why the other options were not chosen

## Architecture Framing

- Define module or service seams, responsibilities, and integration points early.
- State data flow, consistency model, retry behavior, timeout strategy, and observability needs.
- Design for operability: logging, metrics, tracing, error surfacing, and rollback path.
- Favor evolvable structures over premature platform complexity.
- Avoid speculative seams. One adapter means a seam is only hypothetical; two real adapters or a concrete testing/operational need make it worth considering.
- For architecture design, include at least one component or service relationship diagram.
- For process design, include at least one flowchart or sequence diagram.
- When data movement is central to the design, include a lightweight data flow diagram.

## Source Inspiration

This reference includes a localized extraction of Matt Pocock's `codebase-design` vocabulary: deep modules, interfaces, seams, adapters, leverage, and locality. Source: https://github.com/mattpocock/skills
