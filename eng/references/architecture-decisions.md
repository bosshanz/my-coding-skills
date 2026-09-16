# Architecture Decisions

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

Keep logic that changes for the same reason together, with explicit ownership of state and invariants. Make inputs, outputs, errors, and relevant ordering part of the contract so a change can be understood and verified near its owner. Splitting files or adding forwarding layers alone does not create cohesion or reduce coupling. The deletion test is a design heuristic, not measured evidence; use `ablation.md` when the decision needs a controlled comparison.

## Backend Research

- Research before coding when library behavior, protocol choices, schema design, or middleware semantics are uncertain.
- Prefer primary sources: official docs, source code, RFCs, framework references, or direct behavior verification.
- Capture only the decision-relevant outcome: chosen option, rejected options, and why.

## Architecture Framing

- Define module or service seams, responsibilities, and integration points early.
- State data flow, consistency model, retry behavior, timeout strategy, and observability needs.
- Design for operability: logging, metrics, tracing, error surfacing, and rollback path.
- Favor evolvable structures over premature platform complexity.
- Avoid speculative seams. One adapter means a seam is only hypothetical; two real adapters or a concrete testing/operational need make it worth considering.
- Use a component, sequence, or data-flow view only when it clarifies the decision or is requested.

## Worked Example: One Owner For Publish State

- **Applies when:** a UI, request handler, and background worker all describe the same publication.
- **Counterexample:** the handler sets `published = true` when enqueueing, the worker separately tracks delivery, and the UI infers completion from a successful HTTP response. A worker failure leaves three incompatible meanings of success.
- **Better shape:** one domain owner defines allowed transitions and durable operation identity, such as `queued -> running -> succeeded | failed`. The handler acknowledges enqueueing; workers apply guarded transitions; the UI displays that authoritative status. Include item results when partial completion is a real domain outcome. An attempt/version token can reject stale worker updates after a retry or cancellation. Reuse the existing module if it can own this contract; do not introduce a service merely to house an enum.
- **Verify:** delay completion, fail a worker, replay a result, and send an old attempt's completion after a newer attempt begins. Check the durable state and each affected consumer. A rendering test alone cannot prove transition enforcement.

Compare designs by how many callers must understand retries and transition rules. A shared enum without a shared enforcing owner does not solve the problem.

## Source Inspiration

This reference includes a localized extraction of Matt Pocock's `codebase-design` vocabulary: deep modules, interfaces, seams, adapters, leverage, and locality. Source: https://github.com/mattpocock/skills
