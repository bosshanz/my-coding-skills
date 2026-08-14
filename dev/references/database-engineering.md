# Database Engineering

## When To Use

Use this reference when a task changes or depends on database correctness, performance, operability, or production migration safety:

- Schema design, relational modeling, constraints, indexes, query plans, or large result sets.
- Transactions, isolation levels, locking, deadlocks, idempotency, or consistency guarantees.
- Migrations, backfills, online schema changes, dual writes, data repair, retention, partitioning, or archival.
- Destructive SQL, ORM destroy helpers, tombstones, retention jobs, or erasure.
- Production or shared-database writes, live data repair, or agent-operated SQL.
- Replication, read/write splitting, failover, connection pools, database capacity, slow queries, or database incidents.
- Choosing between PostgreSQL, MySQL, Redis, search indexes, queues, or another persistence technology.

Do not load this reference for business logic that only calls an existing repository abstraction and does not change schema, query shape, transaction behavior, data volume assumptions, a delete / retire path, or live database access.

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
- Define referential behavior deliberately: restrict, cascade, set null, or application-managed deletion. Physical deletes follow Destructive Data Operations.

## Destructive Data Operations

User-facing business actions change state. Physical deletes belong to named retention, erasure, or cleanup jobs.

Do not ban `DELETE`. Ban unbounded or irreversible destruction of durable domain records.

The same red line applies to ORM calls, query builders, repositories, and raw SQL. `destroy`, `deleteMany`, `onDelete: Cascade`, and equivalent helpers are physical deletes.

Choose one lifecycle per table. Do not default every table to `deleted_at`:

- Durable domain records: explicit state transition (`cancel`, `void`, `revoke`, `expire`, `close`).
- Identity that must remain queryable as gone: tombstone.
- Ephemeral, derived and rebuildable, or past a named retention or erasure policy: physical delete.

Red lines:

- In request handlers and ordinary write models, do not physically delete ledger, order, account, permission, or other audit-relevant records.
- Do not use `DELETE` or an ORM destroy helper to express a business event.
- Do not run `DELETE` or `UPDATE` without a `WHERE` clause bounded to a named primary-key set or fixed batch size.
- Do not put `TRUNCATE`, `DROP TABLE`, or `DROP DATABASE` in application code.
- Do not use `ON DELETE CASCADE` or ORM `onDelete: Cascade` as the default for domain aggregates.
- Do not hard-delete audit, compliance, or money-movement records.
- Do not erase a durable record by nulling or overwriting its business payload.

Physical `DELETE` is allowed only when all of these are true:

- The data is ephemeral, derived and rebuildable, or past a named retention or erasure policy.
- The delete is bounded to a primary-key set or fixed batch size.
- Owner, trigger, and rollback or repair path are named.
- The delete is not the only record of a user-visible business event.

If using a tombstone, define how uniqueness, default queries, and foreign keys treat inactive rows. Do not default to a database-wide `REVOKE DELETE`; scope privileges by role.

## Production Data Access

Treat unknown, shared, staging-with-prod-data, and production databases as read-only until the user explicitly approves a write.

- Default to `SELECT` or `EXPLAIN`. Do not default to `EXPLAIN ANALYZE` on production; it can execute and lock.
- Before any `INSERT`, `UPDATE`, `DELETE`, or DDL, estimate affected rows, name the rollback or repair path, and wait for explicit user approval.
- Do not use application credentials to "just fix one row."
- Do not run migrate, seed, or truncate against a production `DATABASE_URL`.

## Query And Index Review

- For every new or materially changed query, identify filter columns, join columns, sort order, result cardinality, and maximum page size.
- Use `EXPLAIN` for query paths that can touch large tables, hot endpoints, dashboards, exports, background jobs, or user-facing latency budgets. Use `EXPLAIN ANALYZE` on realistic non-production data, or on production only with explicit approval.
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
- For money, inventory, seats, coupons, or other scarce balances, do not read-modify-write. Use a single constrained update such as `UPDATE ... SET bal = bal - :n WHERE id = :id AND bal >= :n`, and treat zero rows as a business failure.
- Posted ledger, audit, and money-movement rows are append-only. Correct with a new row, not an update or delete of the original.
- For job workers and batch processors, define duplicate handling, retry behavior, dead-letter behavior, and safe resume points.

## Migration And Backfill Safety

- Prefer expand-migrate-contract for production data changes:
  1. Add a compatible new shape.
  2. Backfill historical data in bounded batches.
  3. Dual write or compatibility read during the transition.
  4. Cut reads over gradually.
  5. Remove the old shape after rollback risk is gone.
- Avoid blocking table rewrites, long exclusive locks, and in-place renames on hot production tables.
- Do not add `NOT NULL` without a default, or a prior backfill, on a populated table.
- Do not change a column type or enum in place on a hot populated table.
- Do not put a schema change and a full-table backfill in the same transaction.
- Do not create a unique index before duplicate rows are removed or made compatible.
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
- Bounded-delete or tombstone review for any path that removes or retires durable rows.
- Constrained-update or append-only review for balance and ledger paths.
- Production write approval and row-estimate check before live data changes.
- Migration dry run, rollback review, and backfill resume check for production data changes.
- Load or capacity sanity check for high-volume paths.
- Manual database inspection only as supporting evidence, not the sole proof for repeatable behavior.

## Database Decision Template

```text
Access patterns:
Invariants:
Schema / indexes:
Transaction and isolation assumptions:
Deletion / retention:
Production access:
Migration / backfill:
Capacity assumptions:
Failure and rollback:
Verification:
```
