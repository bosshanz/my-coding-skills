---
name: dev
description: "Implement software requirements, fix bugs, and add developer tests. Use for ordinary repository changes; resolve routine choices and deliver verified work."
when_to_use: "Default entry for implementation and repair requests, including 新需求, 新功能, 改一下, 修 bug, 修复问题 and test additions. Use design for meaningful UI work during delivery; consult clarify only for material decisions that repository evidence and ordinary development questions cannot resolve."
argument-hint: "[新需求 / 修 bug | requirement or bug]"
---

# Dev

Deliver the requested change: establish the target, implement, verify, and report. Follow host instructions and the user's scope; review-only or plan-only requests do not authorize edits. Reuse existing authorization and preserve others' work.

## Work Loop

1. Inspect the relevant code, tests, instructions, and current diff. For a bug, establish inputs, conditions, expected versus observed behavior, and reproduce when possible. Distinguish a suspected cause from an established one. For new work, define an observable success scenario. Resolve routine reversible choices from evidence; ask only about material uncertainty.
2. Make the smallest complete change using existing patterns and technology. A script or existing component is enough when it meets the constraints. Give related rules and state a clear owner and interface; preserve compatibility and failure recovery. Keep unrelated cleanup out. For an unclear or resistant bug, load `references/superpowers-lite.md` before guessing again.
3. Verify the requested behavior and likely regressions at the lowest reliable layer, then complete required project checks. For repairs, compare before and after under the same relevant conditions when feasible. Review the diff for counterexamples and stale documentation. Do not weaken tests to accommodate the implementation. Add coverage only when it can meaningfully detect a failure; repeat checks for new changes, failures, or unresolved risks.
4. Report the outcome, meaningful evidence, and consequential limits in concise Chinese by default. Distinguish implemented from verified: a blocked required check cannot count as passed, while optional uncovered cases are limitations, not automatic blockers. Use a report template only when useful or requested.

User corrections update decisions; side questions do not replace the task. For long work or handoff, retain a compact checkpoint in the existing task record: goal, completion criteria, authorization, evidence, rejected hypotheses, and remaining actions. Reconcile it with current state on resume.

## Decisions And Evidence

- Consult `clarify` only for a material product or architecture decision that repository inspection and ordinary development questions cannot resolve; resume authorized implementation afterward. Use `design` for meaningful UI or interaction work, preserving the brief and existing design system. Trivial styling fixes need no separate process.
- Separate QA or final acceptance requires the user's request. A risk category or evidence gap alone does not trigger `$qa`; verify the affected business meaning within this task. External-agent adapters require explicit user selection for the scope, and native delegation requires applicable authorization.
- Choose evidence by the mechanism enforcing the invariant. Unit tests can prove pure validation and state transitions; persistence, isolation, atomicity, and query scoping require the actual storage semantics or a demonstrably equivalent engine. A mock that removes the invariant cannot prove it. Prefer stable behavior-facing interfaces and reuse sufficient coverage.
- Tie material claims to observations, separate inference from fact, and identify what could overturn the judgment. An improved result alone does not confirm a root cause. Name material untested scenarios and the smallest useful check or missing prerequisite; omit speculative risk inventories.
- Look for counterexamples during self-review without claiming independence. If independent reviewers are requested and authorized, give them the original target, constraints, revision, and raw evidence before others' verdicts; compare findings afterward and disclose shared-context limits. Resolve disagreements with evidence, not consensus.
- Compare alternatives, write plans, or draw diagrams only when they clarify a consequential decision or dependency. A Skill reference adds technical guidance, not a new approval gate. If an applicable rule truly blocks work, cite its file and instruction, explain what is missing, and continue independent authorized work.

## References

Load only the reference needed for the affected behavior. Checklists are thinking aids, not mandatory report sections.

| Reference | Load when |
| --- | --- |
| `references/superpowers-lite.md` | Unclear root cause, failed repair, or requested systematic debugging/test-first guidance. |
| `references/design-and-research.md` | Consequential solution comparison, workflow design, research, diagrams, or dependent work planning. |
| `references/ablation.md` | Deciding whether an optional rule, tool, prompt section, or component contributes enough to retain. |
| `references/backend-engineering.md` | The affected backend responsibility is unclear; use its router, then load the relevant owner. |
| `references/backend-architecture.md` | Service boundaries, cache/queue topology, consistency, reliability, observability, or rollout. |
| `references/backend-quality.md` | Handlers, authorization, tenancy, errors, idempotency, timeouts, backend tests, or process lifecycle. |
| `references/database-engineering.md` | Schema, indexes, transactions, queries, migrations, backfills, replication, capacity, or live data operations. |
| `references/documentation.md` | Existing documentation becomes stale, or a durable artifact is requested or required by the project. |
