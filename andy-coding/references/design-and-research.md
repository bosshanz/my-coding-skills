# Design And Research

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

- Define service boundaries, responsibilities, and integration points early.
- State data flow, consistency model, retry behavior, timeout strategy, and observability needs.
- Design for operability: logging, metrics, tracing, error surfacing, and rollback path.
- Favor evolvable structures over premature platform complexity.
- For architecture design, include at least one component or service relationship diagram.
- For process design, include at least one flowchart or sequence diagram.
- When data movement is central to the design, include a lightweight data flow diagram.
