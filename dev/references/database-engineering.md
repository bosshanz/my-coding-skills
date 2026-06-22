# Database Engineering

## When To Use

Use this reference when a task changes or depends on database correctness, performance, operability, or production migration safety:

- Schema design, relational modeling, constraints, indexes, query plans, or large result sets.
- Transactions, isolation levels, locking, deadlocks, idempotency, or consistency guarantees.
- Migrations, backfills, online schema changes, dual writes, data repair, retention, partitioning, or archival.
- Replication, read/write splitting, failover, connection pools, database capacity, slow queries, or database incidents.
- Choosing between PostgreSQL, MySQL, Redis, search indexes, queues, or another persistence technology.

Do not load this reference for business logic that only calls an existing repository abstraction and does not change schema, query shape, transaction behavior, or data volume assumptions.

## Database Design Gate

- Start from access patterns, invariants, write paths, read paths, retention, consistency needs, and expected data volume.
- Name the source of truth for every data item. Derived indexes, caches, search documents, and read models must have a rebuild or repair path.
- Prefer explicit constraints for durable invariants: primary keys, foreign keys, unique indexes, check constraints, and not-null rules when the database supports them.
- Keep the model normalized until a measured access pattern justifies denormalization. When denormalizing, define the consistency mechanism and reconciliation path.
- Use the existing database and migration tooling unless a new store solves a concrete problem the current stack cannot reasonably solve.

## Schema And Constraints

- Every table should have a clear owner, lifecycle, primary key strategy, retention rule, and top query patterns.
- Use stable, intentional identifiers. Avoid exposing auto-increment IDs externally when enumeration or cross-system coupling is a concern.
- Model status fields as explicit state machines when transitions matter; define allowed transitions and who can perform them.
- Add uniqueness constraints for idempotency, natural uniqueness, and duplicate prevention instead of relying only on application checks.
- Treat nullable columns as a domain decision. If `NULL` means unknown, absent, not applicable, or not yet backfilled, name that meaning in the migration or model notes.
- Define referential behavior deliberately: restrict, cascade, set null, or application-managed deletion.

## Query And Index Review

- For every new or materially changed query, identify filter columns, join columns, sort order, result cardinality, and maximum page size.
- Use `EXPLAIN` or `EXPLAIN ANALYZE` for query paths that can touch large tables, hot endpoints, dashboards, exports, background jobs, or user-facing latency budgets.
- Design compound indexes in equality-filter, range-filter, sort-order order according to the target database's planner behavior.
- Avoid indexes that duplicate an existing useful prefix or add write cost without a named query path.
- Bound every list, export, and background scan. Use cursor pagination or bounded batch iteration for deep traversal.
- Watch for N+1 queries, unbounded joins, non-sargable predicates, implicit casts, leading-wildcard searches, and functions applied to indexed columns.

## Transactions And Concurrency

- Keep transactions short, bounded, and free of slow network calls.
- State the isolation assumption when correctness depends on concurrent behavior.
- Use optimistic locking for ordinary user edits where conflict feedback is acceptable.
- Use pessimistic locks only for short critical sections with clear lock ordering and timeout behavior.
- Make retryable operations idempotent. Define unique request keys or natural uniqueness for create/payment/job-trigger style flows.
- For job workers and batch processors, define duplicate handling, retry behavior, dead-letter behavior, and safe resume points.

## Migration And Backfill Safety

- Prefer expand-migrate-contract for production data changes:
  1. Add a compatible new shape.
  2. Backfill historical data in bounded batches.
  3. Dual write or compatibility read during the transition.
  4. Cut reads over gradually.
  5. Remove the old shape after rollback risk is gone.
- Avoid blocking table rewrites, long exclusive locks, and in-place renames on hot production tables.
- For large tables, plan online schema changes, concurrent index creation, throttled backfills, progress visibility, and pause/resume behavior.
- Define rollback limits honestly. Some data migrations are forward-only; say so before launch.
- Verify migrations against realistic data volume when feasible, not only an empty development database.

## Capacity And Operations

- Estimate row counts, write rate, read QPS, hot key distribution, index size, storage growth, retention, and backup/restore time for non-trivial data changes.
- Check connection pool sizing before increasing concurrency. Database saturation often appears as app latency before it appears as database CPU.
- Track slow queries, lock waits, deadlocks, replication lag, connection usage, cache hit rate, table/index bloat, and disk growth where the platform supports it.
- Define alerts on user-visible symptoms first: latency, error rate, saturation, failed jobs, backlog age, and replication lag.
- For read replicas, name the stale-read tolerance and the paths that must read from primary.

## Database Debugging Paths

- Slow query: capture the SQL, parameters, cardinality, plan, indexes, table size, cache behavior, and competing load.
- Deadlock or lock wait: identify statements, lock order, transaction length, indexes used for updates, and retry behavior.
- Data inconsistency: identify source of truth, last good state, write paths, backfill jobs, replication or cache lag, and repair strategy.
- Connection exhaustion: separate request concurrency, transaction duration, pool settings, leaked connections, long-running queries, and job worker concurrency.
- Migration incident: stop or throttle the migration, identify lock or replication impact, confirm rollback feasibility, and preserve evidence before retrying.

## Verification Checklist

Use the smallest applicable set:

- Unit or integration test for constraints, idempotency, state transitions, and transaction conflict behavior.
- Query plan review for hot or large-table queries.
- Migration dry run, rollback review, and backfill resume check for production data changes.
- Load or capacity sanity check for high-volume paths.
- Manual database inspection only as supporting evidence, not the sole proof for repeatable behavior.

## Database Decision Template

```text
Access patterns:
Invariants:
Schema / indexes:
Transaction and isolation assumptions:
Migration / backfill:
Capacity assumptions:
Failure and rollback:
Verification:
```
