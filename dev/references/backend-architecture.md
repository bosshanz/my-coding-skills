# Backend Architecture

## Scope

Use when the task changes component/service boundaries, cache or queue topology, cross-component consistency, reliability targets, observability strategy, or rollout behavior. An ordinary handler repair or isolated query change does not require this reference.

This file owns component decisions and operational strategy. `backend-quality.md` owns implementation within existing boundaries; `database-engineering.md` owns schemas, query plans, transactions, migrations, and live data operations. Load either only when that responsibility also changes. `stack.md` owns technology preferences when selecting a new technology.

## Component Decisions

- Identify the changed responsibility, its callers, contract, and failure behavior. Compare alternatives only under `dev`'s shared decision rules; reuse settled project choices.
- Start with the fewest components that meet the requirement. Prefer a modular monolith until operational readiness, team boundaries, or measured bottlenecks justify extraction.
- Define synchronous versus asynchronous boundaries from caller dependency, latency budget, consistency, and recovery needs.
- A new seam should hide meaningful complexity or have real variation, a concrete testing need, or an operational purpose. Use `design-and-research.md` only when deeper module comparison is needed.
- Keep contracts compatible through rollout. Coordinate changes to public APIs and events with their consumers; implementation-level validation and error mapping belong in `backend-quality.md`.

## Cache Strategy

- Add a cache only for a demonstrated latency, throughput, coordination, rate-limit, or ephemeral-state need.
- Define invalidation, key design, stale-read tolerance, and expiry or another justified lifetime policy. Estimate a useful hit-rate target when performance motivates the cache.
- Prefer cache-aside for ordinary reads; assess write-through against write latency and consistency needs.
- Address stampedes with jitter, request coalescing, locks, or stale-while-revalidate according to project conventions.
- Keep a rebuild or recovery path from the source of truth. Remove a cache whose benefit does not justify its invalidation complexity.

## Queue And Cross-Component Consistency

- Use the project's existing queue when it meets the requirement; consult `stack.md` only for a technology choice.
- Define producer/consumer ownership, message contract and version, delivery and ordering guarantees, retry budget, and dead-letter or equivalent terminal-failure handling.
- When a database write and event publication cannot diverge, use an outbox or an equivalent transactional publishing mechanism. Account for duplicate delivery and recovery across the boundary; implementation of duplicate-safe writes belongs to the affected quality/database guidance.
- Monitor producer rate, consumer throughput, oldest backlog age, retries, and terminal failures when those determine operational health.

## Reliability And Rollout

For the affected important components, identify failure blast radius, detection, timeout/retry budget, degradation behavior, recovery, and rollback limits. Make fail-open, fail-closed, stale-read, or blocking behavior an explicit contract where it matters.

- Use feature flags, canary, staged rollout, or shadow traffic when they reduce a concrete rollout risk.
- Coordinate mixed-version components and event consumers through a compatibility window. Storage migration/backfill procedures belong in `database-engineering.md`; do not repeat them as a second rollout checklist.
- Define health and shutdown expectations when changing availability strategy; process implementation belongs in `backend-quality.md`.

## Observability And Capacity

- Change metrics, traces, dashboards, alerts, SLOs, and runbooks only where the new production behavior needs evidence or a response path. Reuse existing coverage; an incidental production code change does not require all of these artifacts.
- Alert on user-visible error, latency, availability, backlog, or saturation. For a new SLO, identify an alert and owner response path. Log/metric hygiene belongs in `backend-quality.md`.
- Estimate capacity when traffic or data volume could change the architecture. Show assumptions for expected peak and justified growth scenarios rather than requiring fixed load multipliers on every task.
- Measure available latency, error rate, storage growth, queue backlog, or cache hit rate to identify the actual bottleneck. Prefer the smallest targeted fix and incremental migration.

## Verification

Select checks for the changed cross-component behavior under `dev`'s shared evidence rules:

- Cache invalidation, expiry, stale-read tolerance, and recovery from cache loss.
- Event publication/delivery failures, duplicate handling, backlog recovery, and terminal failure paths.
- Degradation and recovery under dependency failure.
- Mixed-version compatibility, rollout signals, and rollback limits.
- Capacity checks when a decision depends on throughput or growth assumptions.

Handler tests and database checks remain with their owning references. Reuse their evidence rather than running a second verification pass here.

## Decision Artifacts

For a requested or project-required architecture decision document, select relevant material: context, unresolved alternatives, chosen boundary, contract, failure/recovery behavior, rollout, and supporting evidence. Include capacity calculations or a diagram only when `dev`'s shared triggers apply. This is not a required final-response template.

## Source Inspirations

This reference is a high-level, localized extraction inspired by:

- PeterHdd `engineering-system-designer`: requirements, capacity estimation, simplest viable architecture, datastore/API design, failure modes, monitoring, and self-verification. Source: https://github.com/PeterHdd/agent-skills/tree/main/skills/engineering-system-designer
- PeterHdd `engineering-backend-architect`: modular monolith bias, database/query rules, cache TTL and invalidation, event idempotency/schema version, health checks, migrations, endpoint verification, and reliability debugging. Source: https://github.com/PeterHdd/agent-skills/tree/main/skills/engineering-backend-architect
