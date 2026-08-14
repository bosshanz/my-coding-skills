# Backend Quality

## When To Use

Use this reference when implementing, reviewing, or repairing backend behavior inside an already chosen shape:

- HTTP or RPC handlers, application services, domain rules, repositories, and job consumers.
- Authn, authz, tenancy, error mapping, timeouts, cancellation, and request-level idempotency.
- Backend tests, log/metric hygiene, compatibility of existing contracts, or process lifecycle.

Do not load it to choose stores, split services, add a cache or queue, or change schema, migrations, or destructive data operations. Load `backend-architecture.md` or `database-engineering.md` for those.

Skip it for tiny mechanical edits that cannot change authority, effects, bounds, or failure behavior.

## First Principles

A backend request is an untrusted claim that some actor may cause a bounded effect and receive a truthful answer. Quality is that this remains true under retry, concurrency, hostile input, and partial failure.

1. **Success means the durable effect happened.** Returning OK on an attempted write is a lie unless the contract names eventual consistency and a repair path.
2. **Identity, permission, and tenancy are three questions.** Who is calling, what action is allowed, which rows may be touched. A request identifier is a locator, not a capability.
3. **Invariants are enforced at the write.** Check-then-act loses to a concurrent request. Pair application rules with constrained updates, unique constraints, or short transactions. Scarce balances follow `database-engineering.md`.
4. **Every resource is bounded.** Time, payload, result size, batch size, retries, fan-out, and transaction duration. Unbounded work is a latent incident.
5. **Retry is the environment.** Clients, proxies, and queues duplicate work. Effects are idempotent or detect duplicates. At-least-once is the default; exactly-once is a protocol you must build.
6. **You must reconstruct a request without leaking it.** Correlation IDs, low-cardinality metrics, and structured outcome logs. Secrets, tokens, and raw payloads do not belong in logs.
7. **A test that removes the invariant does not prove it.** Mocks cannot certify uniqueness, isolation, tenant scoping, or constraint failure.

Derive the gates below from these. Do not add a layer, pattern, or framework feature unless it protects one of them.

## Task Classification

Keep the checklist useful, not decorative:

| Task type | Focus |
| --- | --- |
| Handler / CRUD | Authority, tenancy, validation, error mapping, pagination. |
| Money / inventory / state machine | Idempotency, constrained write, append-only correction, conflict. |
| Background job | At-least-once safety, poison handling, timeout, no remote IO inside a long transaction. |
| Webhook / callback | Signature or authenticity check, replay protection, idempotency. |
| Internal admin | Explicit privilege, audit trail, no silent authz bypass. |

## Authority Gate

- Authenticate at the edge. Do not re-parse credentials in repositories.
- Authorize the action against the loaded or addressed resource, not only the route.
- Derive tenant and owner from the authenticated principal. A client-supplied `org_id`, `user_id`, or `tenant_id` is a claim to authorize, not a scope to trust.
- Treat object IDs as untrusted locators. Load-by-id without an ownership or tenant check is IDOR.
- Unauthorized callers must not learn that a foreign resource exists unless the product explicitly allows it.
- Fail closed on missing auth, failed auth, or ambiguous tenancy.
- Feature flags, admin tools, and impersonation do not skip authorization. Those paths are explicit, narrower, and auditable.

## Input And Effect Gate

- Parse and validate at the protocol edge with the project's schema. Reject fields the client must not set: role, price, balance, tenant, status, totals, timestamps.
- Do not interpolate request data into SQL, shell, or scripts. Bind values. Allowlist identifiers used for sort, filter, or table/column names.
- Safe methods do not change state. Do not hide writes behind `GET` or `HEAD`.
- Writes that create, pay, or trigger jobs need an idempotency key or a natural unique constraint.
- Do not report success before the write commits. If a side effect must not diverge from the write, publish in the same transaction via the project's outbox pattern; see `backend-architecture.md`.
- Batch endpoints are atomic or return an explicit per-item result. Silent partial success is a contract bug.

## Error Mapping Gate

- Map domain outcomes to stable, machine-readable classes: validation, unauthenticated, forbidden, not found, conflict, rate limited, dependency failure.
- Client errors stay in the contract. Do not leak stack traces, SQL, internal hostnames, or configuration.
- Log the internal cause. Return the safe external code and a non-sensitive message.
- Do not catch an error and return success. If work is deferred, the response must say so.
- Error codes that clients branch on are part of the public contract. Changing them is a migration.

## Bounds Gate

- Every outbound call has an explicit timeout. Do not rely on default infinite clients.
- Propagate deadlines and cancellation inward. Do not start expensive work after the caller is gone when the runtime can detect it.
- Limit body size, page size, batch size, upload size, and outbound fan-out.
- Bound retries with a budget and jitter. Do not retry a non-idempotent call without a key.
- Hold transactions only for local storage work. Do not call HTTP, SMTP, or a queue broker while a row lock is held.

## Layering Gate

Follow the project's existing module shape first. Do not introduce a hexagonal or clean-architecture tree to satisfy this file.

- Protocol adapters translate transport to an application command. They do not own business outcomes.
- Application methods own the use case: resource-level authz, transaction start/commit, and repository calls.
- Repositories persist and fetch. They do not decide whether the business action is allowed.
- A new package earns its place by hiding an invariant or a real seam. A pass-through service that only forwards to a repository is not quality; see the deletion test in `design-and-research.md`.

## Concurrency And Jobs

- Do not read-modify-write scarce state. Use a constrained update and treat zero rows as a business failure.
- Ordinary user edits use optimistic concurrency. A zero-row update is a conflict, not success.
- Job handlers are safe to run twice. Detect duplicates with the same key the write path uses.
- Poison messages go to a dead-letter path after a bounded retry. Infinite retry is not resilience.
- Webhooks verify authenticity first, then apply the same idempotency rule as any other write.

## Observability Hygiene

`backend-architecture.md` owns whether metrics, logs, traces, and SLOs exist. This gate owns whether they are safe and useful.

- Give every request and job a correlation ID that crosses process boundaries.
- Log actor, action, resource type and id, outcome, latency, and error class.
- Do not log secrets, tokens, passwords, session cookies, full request or response bodies, or PII that support does not require.
- Metric labels stay low-cardinality: route, status class, dependency name. Never `user_id` or raw path with ids.
- Separate expected business outcomes (4xx, conflict) from operational failures (5xx, timeout) in metrics.
- Trace outbound calls. Do not create a span per iteration on a hot loop.

## Test Gate

- Prove each invariant at the lowest layer that still contains it.
- Authz, tenancy, uniqueness, state transitions, and idempotency need an integration test against a real database or an equivalent engine. A mock repository cannot certify them.
- Mocks belong at true network seams: payment providers, email, foreign HTTP APIs.
- Cover the paths that change meaning: happy path, unauthenticated, wrong tenant, invalid input, duplicate or conflict, dependency timeout.
- Time, randomness, and ID generation are injectable or fixed in tests when they affect the invariant.
- Do not weaken a test to match a sloppy handler.

## Process Lifecycle

- Liveness means the process should stay alive. Readiness means it can serve. A process that cannot reach its data store is not ready.
- On shutdown: stop accepting work, drain in-flight requests or rely on at-least-once redelivery, then exit.
- Do not apply production schema migrations as a side effect of serving traffic unless that is the project's explicit, reviewed mechanism.
- Required config fails startup. Do not discover a missing secret on the first user request.

## Compatibility Gate

- Public response fields, event fields, and client-facing error codes are additive until a compatibility window exists.
- Removing, renaming, or changing the meaning of a field is a migration, not a cleanup.
- Do not change pagination semantics or default sort order under an existing endpoint without a version or explicit compatibility window.

## Verification Checklist

Use the smallest applicable set:

- Cross-tenant or cross-owner request is denied, including raw object IDs.
- Write or job path is idempotent, or uniqueness rejects the duplicate.
- Timeouts, page or batch limits, and body size limits are present on new IO.
- Client errors do not leak internals; operational failures are distinguishable in metrics or logs.
- Logs carry a correlation ID and do not contain secrets or raw payloads.
- The core invariant has an integration test, not only a mocked unit test.
- Readiness or shutdown behavior is checked only when process lifecycle changed.

## Delivery Template

```text
Authority:
Effect and idempotency:
Bounds:
Failure mapping:
Verification:
```
