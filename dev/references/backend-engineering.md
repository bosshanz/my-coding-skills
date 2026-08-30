# Backend Engineering

## When To Use

Use this reference for a server-side behavior change: an HTTP/RPC/GraphQL endpoint, webhook, worker, command, backend integration, authentication or authorization path, public/internal contract, or backend failure path.

Do not load it only because a frontend calls an unchanged server contract. Pair it with `backend-architecture.md` for service, storage, cache, queue, migration, reliability, observability, or rollout changes; pair it with `database-engineering.md` for schema, query, transaction, migration, or capacity changes.

## Backend Change Contract

Before editing, make the local contract explicit:

- Identify the caller or actor, allowed action, target resource, and tenant or ownership scope.
- Define validated input, successful output, expected error outcomes, compatibility expectations, and bounded result size.
- Name the domain invariant, state transition, source of truth, and idempotency behavior where a write or retry is possible.
- State external dependencies, timeout and retry behavior, and the evidence that will verify the change.
- Start from the closest existing handler, service, repository, and test pattern before adding a new abstraction.

## Boundary Safety

- Validate untrusted input at the transport boundary: type, required fields, size, format, bounds, and pagination limits.
- Authenticate the caller, then authorize the action against the specific resource and tenant. Do not treat authentication as authorization.
- Derive owner, tenant, and permission scope from trusted identity or server-side lookup; never trust a client-supplied identifier as proof of access.
- Verify webhook signatures, timestamps, replay protection, and idempotency before processing externally delivered events.
- Keep secrets, credentials, tokens, internal errors, and unnecessary personal data out of responses and logs.

## Behavior, Data, And Dependencies

- Keep transport handlers thin; place reusable business rules, invariants, and state transitions in the project’s appropriate service or domain boundary.
- Keep transactions short and free of slow network calls. Use database constraints or idempotency keys for invariants that must hold under concurrency.
- Retry only operations whose retry safety is understood. Give workers and webhooks safe duplicate handling and an explicit failure or dead-letter path when applicable.
- Set explicit timeouts for remote calls. Bound retries, distinguish transient from permanent failures, and expose a fallback or escalation path when the caller needs one.
- Escalate to `backend-architecture.md` when a database write and event publication, queue semantics, cache invalidation, or new infrastructure component must remain consistent.

## Error And Observability Contract

- Return stable, machine-usable error categories that fit project conventions; do not leak stack traces or dependency internals.
- Preserve correlation or request identifiers and log the outcome, duration, dependency, and safe diagnostic context needed to investigate failures.
- Add metrics, traces, audit signals, or alert coverage when a new production-critical path, integration, worker, or sensitive action needs operational visibility.
- Make behavior compatible by default. Version or stage a contract when existing clients cannot safely tolerate a direct change.

## Verification Checklist

Use the smallest applicable set:

- Unit-test business rules, state transitions, validation, and error mapping.
- Integration-test the boundary when authentication, authorization, persistence, transactions, or dependency wiring can change the outcome.
- Test the negative cases that define the boundary: unauthenticated, wrong role or tenant, invalid input, conflict, duplicate delivery, timeout, and bounded list results as applicable.
- Add or update a contract test when another client or service depends on the changed API or event shape.
- Reproduce the original failure and add regression coverage for backend bug fixes.
- Do not treat a successful happy-path request, compilation, or a mocked dependency alone as proof of production behavior.

## Escalate Deliberately

| Change | Also load |
| --- | --- |
| Service boundaries, storage, cache, queues, consistency, reliability, rollout, or production observability | `backend-architecture.md` |
| Schema, constraints, indexes, query plans, transactions, migrations, backfills, replication, or capacity | `database-engineering.md` |
| Material security, privacy, tenant-isolation, or irreversible data risk | The project’s security policy and an explicit acceptance or human decision when required |
