# Backend Architecture

## When To Use

Use this reference when a task changes service boundaries, storage, cache, queue, consistency model, throughput, reliability, production migration risk, security boundary, or observability behavior.

## Backend Architecture Gate

- Clarify functional requirements and non-functional targets: latency, throughput, durability, consistency, availability, data retention, and traffic shape.
- Estimate capacity for non-trivial systems at 1x, 5x, and 10x load; show assumptions and math instead of stating numbers without derivation.
- Start with the fewest components possible. Every new service, cache, queue, search index, or scheduler must justify itself against a simpler alternative.
- Prefer a modular monolith until operational readiness, team boundaries, or measured bottlenecks justify service extraction.
- Define sync vs async boundaries explicitly: caller dependency, latency budget, retry behavior, timeout strategy, and fallback behavior.
- For every technology choice, answer: why this over the simpler or already-standard project option?

## Service Boundary And API Contract

- Define each service or module's responsibility, owner, inputs, outputs, and failure behavior.
- Prefer deep modules at important seams: keep caller-facing interfaces small while hiding meaningful behavior, invariants, retries, and failure handling inside the module.
- Do not add a new adapter seam just because it is theoretically testable. A seam should have real variation, a meaningful external dependency, or a concrete testing/operability reason.
- Use the deletion test for architecture proposals: if removing the module removes complexity, it may be shallow pass-through; if removing it spreads complexity across callers, it likely provides leverage and locality.
- Document API contracts for service boundaries: request schema, response schema, error codes, auth requirement, rate limits, and versioning expectations.
- Keep public API versioning discoverable and stable; avoid breaking existing clients without a migration path.
- Bound result sizes with pagination or limits; avoid unbounded queries and over-fetching.
- Validate and sanitize user input at the API boundary using the project's schema validation conventions.
- Keep secrets, URLs, credentials, and feature flags in environment or configuration systems, not hardcoded literals.

## Data Store And Query Rules

- For schema design, constraints, indexes, transactions, query plans, migrations, backfills, and database operations, also load `database-engineering.md`.
- Choose the data store from access patterns, transaction needs, consistency needs, scale, and operational familiarity.
- Prefer MySQL or PostgreSQL for relational models, transactional workflows, reporting joins, and strong schema constraints.
- Define each table or collection's top query patterns, expected cardinality, index strategy, and latency expectation when volume matters.
- Review new or modified query paths with `EXPLAIN` or `EXPLAIN ANALYZE` against realistic data volume when performance risk exists.
- Use cursor-based pagination for deep or large result sets instead of offset pagination when page depth can grow.
- Keep connection pools bounded; investigate connection saturation before increasing limits.
- Never use full-text/search infrastructure as the source of truth unless the system is explicitly designed that way.

## Cache Rules

- Add Redis only when it solves a concrete latency, throughput, coordination, rate limit, or ephemeral-state problem.
- Every cache must define TTL, invalidation strategy, key design, expected hit-rate goal, and stale-read tolerance.
- Prefer cache-aside for ordinary read caching; use write-through only when write latency and consistency tradeoffs are understood.
- Avoid caches without expiry. If hit rate is low or invalidation is unclear, remove the cache or fix the key design.
- For cache stampede risk, use jittered TTL, request coalescing, locks, or stale-while-revalidate according to project conventions.

## Queue And Event Rules

- Use RocketMQ or the project's existing queue for asynchronous workflows, retries, delayed processing, traffic smoothing, and decoupled service communication.
- Every event must define message contract, idempotency key, schema version, producer, consumer, retry policy, ordering requirement, and dead-letter behavior.
- Consumers must be safe to retry and should handle duplicate, delayed, and out-of-order messages when the queue semantics allow them.
- Use an outbox or equivalent transactional publishing pattern when database writes and event publication must not diverge.
- Monitor producer rate, consumer throughput, backlog age, retry count, and dead-letter volume.

## Failure Mode And Reliability Checklist

For every important component, state:

- What fails and the blast radius.
- Who or what is affected.
- How the failure is detected.
- Timeout, retry, circuit breaker, fallback, or degradation behavior.
- Recovery path and rollback path.
- Whether the system fails open, fails closed, serves stale data, or blocks the operation.

## Migration And Rollout Rules

- For production schema changes, prefer expand-migrate-contract: add new shape, dual-write or backfill, migrate reads, then remove old shape.
- Avoid in-place renames on live columns, tables, queues, or event schemas without compatibility windows.
- For large tables, use online schema change mechanisms or concurrent index creation when the database supports them.
- Run migrations forward and backward on realistic data volume when feasible; define a rollback plan before launch.
- Use feature flags, staged rollout, canary, or shadow mode for risky behavior changes.

## Observability And Launch Gate

- Define metrics, logs, traces, dashboards, alerts, SLOs, and runbook notes before launch for production-impacting changes.
- Separate liveness and readiness checks when deploying services with external dependencies.
- Alert on symptoms users feel first: error rate, latency, availability, backlog age, failed jobs, and saturation.
- For every SLO, define the corresponding alert and owner response path.
- Preserve enough structured logging to trace a request through API, service, database, cache, and queue boundaries.

## Backend Verification Checklist

Use the smallest applicable set before delivery:

- Endpoint tests for valid input, missing auth, wrong role, invalid input, and bounded result size.
- Query plan review for new or modified query paths where data volume matters.
- Migration dry run and rollback review for schema or data changes.
- Queue retry/idempotency/dead-letter check for async workflows.
- Health check and graceful degradation check for dependency failures when reliability risk is material.
- Load or capacity sanity check at expected peak and 10x for non-trivial architecture changes.

## Existing System Assessment

When improving an existing backend system:

1. Measure current QPS, p50/p95/p99 latency, error rate, storage growth, queue backlog, and cache hit rate where available.
2. Identify the actual bottleneck with evidence; do not guess from architecture diagrams alone.
3. Prefer the smallest change that resolves most of the problem: index, query rewrite, cache, async job, read replica, bounded pagination, or configuration fix.
4. Preserve what works and migrate incrementally; avoid big-bang rewrites for systems already serving production traffic.
5. Re-check observability before scaling complexity.

## Source Inspirations

This reference is a high-level, localized extraction inspired by:

- PeterHdd `engineering-system-designer`: requirements, capacity estimation, simplest viable architecture, datastore/API design, failure modes, monitoring, and self-verification. Source: https://github.com/PeterHdd/agent-skills/tree/main/skills/engineering-system-designer
- PeterHdd `engineering-backend-architect`: modular monolith bias, database/query rules, cache TTL and invalidation, event idempotency/schema version, health checks, migrations, endpoint verification, and reliability debugging. Source: https://github.com/PeterHdd/agent-skills/tree/main/skills/engineering-backend-architect

## Architecture Decision Template

Use this compact template for non-trivial backend decisions:

- Context: current system, constraints, and traffic/data shape.
- Requirement: functional goal and non-functional targets.
- Options: 2-3 realistic approaches, including the simplest viable option.
- Decision: chosen option and why simpler alternatives are insufficient.
- Data model: entities, ownership, indexes, retention, and migration path.
- API/event contract: request/response or message schema, errors, retries, and versioning.
- Failure mode: blast radius, detection, fallback, recovery, and rollback.
- Verification: tests, query plans, migration dry run, load sanity check, and observability.

## Capacity Estimation Template

For systems where scale matters, estimate with visible assumptions:

```text
Users: ...
Peak QPS: ...
Read/write ratio: ...
Payload size: ...
Daily storage growth: ...
Retention: ...
Hot data set: ...
1x / 5x / 10x bottleneck: ...
```

Convert estimates into design decisions: connection pool size, indexes, pagination, cache TTL, queue partitions/topics, consumer concurrency, storage growth, and alert thresholds.

## API And Error Contract Checklist

- Define success response, validation errors, auth errors, permission errors, conflict errors, rate limits, and dependency failures.
- Keep error codes stable and machine-readable when clients depend on them.
- Include idempotency keys for create/payment/job-trigger style endpoints where retries are likely.
- Bound list endpoints with pagination, maximum page size, and deterministic ordering.
- Define timeout and retry expectations between services; do not rely on default HTTP/client behavior.

## Data Migration Playbook

For production data changes:

1. Expand: add nullable columns, new tables, or compatible event fields.
2. Backfill: migrate historical data in bounded batches with progress visibility.
3. Dual write or compatibility read: keep old and new paths consistent during rollout.
4. Cut over reads: move traffic gradually and monitor symptoms.
5. Contract: remove old shape only after compatibility windows and rollback risk are gone.

Always document rollback limits. Some migrations are forward-only; say so explicitly.

## Reliability Debugging Paths

- High latency: separate app time, database time, cache time, queue wait, and downstream dependency time.
- Error spikes: group by endpoint, dependency, deploy version, tenant, and input class.
- Queue backlog: compare producer rate, consumer rate, retry rate, dead-letter count, and oldest message age.
- Database saturation: inspect slow queries, locks, connection pool exhaustion, missing indexes, and transaction length.
- Cache problems: inspect hit rate, stampede, stale data, key cardinality, TTL distribution, and invalidation path.
