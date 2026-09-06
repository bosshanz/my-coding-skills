---
name: dev
description: "Implement software requirements, fix bugs, and add developer tests. Use for ordinary repository changes; resolve routine choices and deliver verified work."
when_to_use: "Default entry for implementation and repair requests, including 新需求, 新功能, 改一下, 修 bug, 修复问题 and test additions. Use design for meaningful UI work during delivery; consult clarify only for material decisions that repository evidence and ordinary development questions cannot resolve."
argument-hint: "[新需求 / 修 bug | requirement or bug]"
---

# Dev

Deliver the requested software change through one proportional loop: establish the target, implement, verify, and report. These are working decisions, not separate approval turns.

## Entry And Scope

- Use for ordinary implementation, bug fixes, refactors, and developer-test additions. For a review-only or plan-only request, keep that scope; do not infer permission to edit.
- Follow higher-priority host instructions and the user's explicit scope over workflow advice. Reuse existing authorization and resolved decisions. Finish clear action requests without another plan approval.
- Inspect repository facts before asking. Resolve routine reversible choices yourself. If a material product or architecture choice cannot be resolved in ordinary development discussion, consult `clarify` for that decision, then resume the already authorized implementation. Clarification is not a new task or a permission reset.
- Use `design` for meaningful UI or interaction creation or reshaping. Preserve the brief and existing design system. Load only applicable guidance; a trivial CSS fix needs no design process.
- Do not auto-invoke or routinely recommend `$qa`; a risk category alone is not enough. Verify relevant business meaning within this task and report concrete evidence gaps. Separate QA and acceptance passes require the user's request.
- Use external-agent adapters only when the user selects that agent. Preserve others' edits; do not duplicate active work.
- If an instruction actually blocks work, link its exact file, quote the rule, and explain the missing decision or permission. Continue independent authorized work. Prepare a reviewable result before requesting any still-needed external or irreversible action approval.

## Delivery Loop

1. **Establish the target.** Read relevant code, tests, repository instructions, and the current diff. Identify intended behavior and the smallest useful verification. For bugs, distinguish evidence from hypotheses and reproduce when possible. Compare approaches only when the tradeoffs could change the outcome.
2. **Implement.** Make the smallest complete change using existing patterns. Preserve compatibility and relevant failure/recovery behavior. Keep unrelated cleanup out. For unclear or resistant bugs, load `references/superpowers-lite.md` instead of guessing repeatedly.
3. **Verify.** Check the requested behavior and likely regressions at the lowest reliable layer, then run required project checks. Review the diff for scope, counterexamples, and stale docs. Do not weaken tests or `qa` business/user-journey checks to fit the implementation. Add regression coverage when it meaningfully detects the failure; do not add tests that merely mirror wording or implementation for low-impact reversible edits. After checks pass, repeat or broaden only for new changes, failures, or unresolved concerns.
4. **Finish.** Report the outcome, meaningful evidence, and concrete remaining limits. Distinguish implemented from verified. Never claim verified completion while an applicable required check is blocked; explaining the gap does not make it pass. Optional uncovered cases are concrete limitations, not automatic blockers. If blocked, name what is complete and the exact missing prerequisite; do not turn an evidence gap into an automatic new workflow.

A user correction steers this loop; preserve completed work and the original objective unless cancelled. A side question does not end the requested implementation. Small changes can complete the entire loop without a written plan or report template.

## Shared Decision And Evidence Rules

These rules apply to all references below. References supply technical detail; their checklists are internal prompts for the affected behavior, not mandatory report sections or additional workflow stages.

- Compare alternatives when an unresolved tradeoff could change the implementation, or the user asks for a comparison. Task size alone does not require multiple proposals; reuse settled decisions.
- Use a written plan when coordination or dependencies make it useful. Add a diagram when it clarifies a boundary, sequence, or data flow that prose would obscure, or when requested. Neither is an approval gate by default.
- Choose evidence by the mechanism enforcing the invariant. Pure validation, error mapping, and state-transition logic can use unit tests; persistence constraints, isolation, atomicity, and query scoping need checks exercising the actual storage behavior. Use the project's database or a demonstrably equivalent engine for those semantics. A mock that removes the invariant is not evidence for it.
- Prefer tests through stable behavior-facing interfaces. Use controllable external dependencies without mocking away the behavior being checked. Reuse sufficient existing coverage; add regression tests when they can detect the defect. Reproduction unavailable or test-first impractical calls for the strongest available check and a precise limitation, not invented evidence.
- Final replies follow the delivery format below. Reference templates are optional outlines for a requested artifact or an existing project documentation requirement; include only applicable fields. Update stale documentation under `references/documentation.md` without creating a new report by default.

## Delivery Format

Deliver in Chinese by default. Lead with the outcome and use short prose. Include commands/results only when they substantiate the conclusion; never invent them.

If the user requests a structured report, use relevant fields: 需求确认 (or 问题与根因), 实现内容, 测试与验收, 风险与未验证项. Add tradeoffs or next steps only when useful to an unresolved decision. Keep code and protocol names in their original language.

## Reference Loading Policy

Load the smallest reference set that can materially improve the work.

| Reference | Load when |
| --- | --- |
| `design` skill (invoke, not a reference) | New UI, meaningful UI or interaction reshaping, flow/usability work, AI-native interaction, motion/animation work, or visual-quality review. |
| `references/superpowers-lite.md` | A bug has an unclear cause, a repair failed, or the user explicitly requests systematic debugging or test-first guidance. |
| `references/design-and-research.md` | Solution comparison, workflow design, diagrams, research, or a multi-step plan. |
| `references/backend-engineering.md` | Backend change whose affected responsibility is unclear; use its routing table, then load only the applicable owner below. Skip when the owner is already clear. |
| `references/backend-architecture.md` | Component/service boundaries, cache or queue topology, cross-component consistency, reliability targets, observability strategy, or rollout. |
| `references/backend-quality.md` | Handlers, authz, tenancy, error mapping, idempotency, timeouts, backend tests, or process lifecycle. |
| `references/database-engineering.md` | Schema, constraints, indexes, transactions, query plans, migrations, backfills, replication, capacity, destructive data operations, or production data access. |
| `references/stack.md` | Choosing language, framework, database, queue, cache, or integration technology. |
| `references/documentation.md` | A change makes existing documentation stale, or a durable artifact is requested or required by the project. |
