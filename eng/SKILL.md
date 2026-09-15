---
name: eng
description: "Engineering references for backend shape, quality, storage, architecture decisions, debugging, and ablation. Use when those decisions are open. Ordinary features, bugfixes, refactors, and tests do not load this Skill."
when_to_use: "Load only for backend boundaries, tenancy, idempotency, migrations, module shape, failure diagnosis method, or a requested ablation. Pagination, CRUD, CSS, and routine fixes need no engineering Skill."
argument-hint: "[后端 / 数据库 / 调试 | backend, storage, or debugging]"
---

# Engineering references

Read only the file that adds information to the current decision. Project code, actual versions, and the user's constraints take precedence.

| Reference | Relevant work |
| --- | --- |
| `references/backend-architecture.md` | Service boundaries, cache, messaging, failure recovery, capacity, and release compatibility. |
| `references/backend-quality.md` | Authority, tenancy, idempotency, errors, timeouts, and process lifecycle. |
| `references/database-engineering.md` | Constraints, transactions, queries, migrations, backfills, and bounded data operations. |
| `references/architecture-decisions.md` | Module interfaces, depth, state ownership, and evolutionary tradeoffs. |
| `references/debugging.md` | Reproduction, falsifiable hypotheses, diagnosis after failure, and before/after comparison. |
| `references/ablation.md` | Controlled comparison of an optional element; does not authorize paid evals or production changes. |

Do not load every file. A named business-rule check uses `verify`. Interface design uses `design`.
