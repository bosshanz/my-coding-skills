---
name: clarify
description: "Run a dedicated requirement, discovery, or architecture interview before implementation, with repository-aware questions, one-question-at-a-time alignment, optional loop workspace creation, optional CONTEXT.md glossary updates, sparse ADR capture, and explicit transition from discovery to delivery. Use when the user invokes $clarify, asks to be interviewed on a plan, wants to clarify a feature or refactor before coding, wants to reduce uncertainty before delivery, or wants durable domain terms or architectural decisions recorded."
---

# Clarify

Use this Skill to turn a loose request into shared understanding before implementation. The output is alignment: clarified behavior, constraints, assumptions, domain terms, verification strategy, and durable decisions. Do not treat the interview as permission to start coding unless the user explicitly asks to proceed.

## Boundaries

- Keep the session conversational and proportional.
- Ask one question at a time and wait for the answer.
- Include your recommended answer with each question.
- If a question can be answered from the repository, inspect the repository instead of asking.
- Do not create a loop workspace unless the user explicitly says yes or directly asks for one.
- Do not create issue-tracker workflows, PRDs, or agent briefs unless the user asks for them.
- Do not push an ambiguous problem into delivery merely to make progress.
- Hand off implementation to `$dev` only after the behavior or next experiment is sufficiently defined.

## Repository Context

Before asking design questions, inspect the closest relevant context:

- Existing durable `CONTEXT.md` or `CONTEXT-MAP.md`.
- Existing `loop/` or `loops/<loop-id>/` workspace.
- Existing `docs/adr/` records near the affected area.
- Relevant code paths, tests, docs, examples, evaluators, fixtures, and metrics.
- Existing product language, module names, and user-facing terminology.

If no repository context exists, proceed as a stateless interview and say so briefly.

## Interview Loop

1. State the current understanding in 2-5 bullets:
   - Goal.
   - User or system flow.
   - Known facts and constraints.
   - Assumptions and unknowns.
   - Open decisions.
2. Pick the highest-leverage unresolved decision.
3. Ask exactly one question.
4. Provide a recommended answer and why it fits current evidence.
5. After the user answers, update the understanding and repeat.

Prefer concrete scenarios over abstract categories. Stress-test edge cases, permissions, failure modes, lifecycle behavior, data ownership, migration impact, rollback paths, and evaluation quality when relevant.

## Discovery Loop

Use discovery mode when the real problem, user need, product direction, interface boundary, or meaningful verifier is still uncertain.

Discovery should:

- separate facts, assumptions, constraints, unknowns, and non-goals;
- generate multiple plausible interpretations or approaches;
- identify what evidence would change the decision;
- prefer low-cost prototypes or experiments before expensive delivery;
- produce a draft verifier, human gate, or acceptance strategy.

Discovery is complete when uncertainty is low enough to define a bounded implementation or experiment. Reducing uncertainty is a valid deliverable; do not present it as completed feature delivery.

Read `../loop-engineering/references/discovery-loop.md` when the discovery-to-delivery boundary is unclear.

## Optional Loop Workspace

After the initial understanding is clear enough to name the work, ask whether to create a durable loop workspace when the task is multi-step, cross-file, high-risk, likely to span agents, likely to need resumed context, or expected to remain in discovery for multiple iterations.

Use this question:

```text
是否要为这件事创建 Loop 工作区，持续跟踪 `LOOP.md`、`STATE.md`、`ROADMAP.md`、`CONTEXT.md`、`CHECKPOINT.md` 和 `loop-run-log.md`？我的建议：多轮、跨文件、需要验收/委托，或者需求仍处于探索阶段时选 yes；小任务选 no。
```

If the user says no, continue without creating files. If the user says yes or already asked for a loop, read `references/loop-workspace.md` and create or update the workspace before continuing.

Use `loop/` for one active task. Prefer `loops/<loop-id>/` for multiple concurrent, independently scheduled, or durable loops. If an existing workspace appears unrelated, ask whether to reuse it, archive it, or create a separate named loop directory.

## First-Principles Clarification

Use first-principles clarification when the request is ambiguous, solution-shaped, architecture-heavy, or likely to encode hidden assumptions:

- Separate the desired outcome from the proposed implementation.
- Identify facts, constraints, assumptions, invariants, unknowns, and non-goals before debating solutions.
- Ask what must remain true if the current UI, API, storage model, framework, metric, or workflow were replaced.
- Challenge inherited labels and abstractions when they obscure real domain behavior.
- Distinguish the real goal from proxy metrics.
- Convert resolved assumptions into acceptance criteria, verifier requirements, or domain terms before handing off to `$dev`.

## Verifier Design During Clarification

Before delivery, clarify what evidence could disprove the solution:

- What should turn red when behavior is wrong?
- Is the evidence deterministic, subjective, or mixed?
- Who owns the verifier?
- Can the implementation Agent change the verifier or threshold?
- What important behavior is not covered?
- Which decision must remain human-only?

For reusable or high-impact verification, read `../loop-engineering/references/verifier-governance.md`.

## Domain Language

When domain terms matter, keep the vocabulary sharp:

- If the user uses an overloaded term, propose a canonical term.
- If repository docs define a term differently, call out the mismatch and ask which meaning should win.
- If code contradicts the stated domain model, surface the contradiction.
- When a term is resolved, update the nearest relevant durable `CONTEXT.md`.

`CONTEXT.md` is a glossary, not a spec. Keep it free of implementation details, plans, and transient notes.

If a loop workspace is active, use its `CONTEXT.md` for task-local repository facts, constraints, files, commands, evaluation context, and temporary terms. Use repo-level `CONTEXT.md` only for durable domain terms. The canonical tier model lives in `loop-engineering/references/context-model.md`.

## ADR Capture

Offer an ADR only when all are true:

- The decision is costly to reverse.
- Future readers would wonder why this path was chosen.
- Real alternatives were considered and rejected.

If warranted, create it under the nearest `docs/adr/` directory using a short numbered filename.

```markdown
# Title

## Status

Accepted

## Context

Why the decision exists.

## Decision

What was chosen.

## Consequences

What this enables, what it costs, and what would make us revisit it.
```

## Exit Criteria

The interview or discovery loop is complete when these are clear enough for the next bounded action:

- Target behavior, uncertainty to reduce, and non-goals.
- Primary flow and important edge cases.
- Facts, assumptions, and unresolved unknowns.
- Affected modules or seams.
- Data/API/state/lifecycle implications, if any.
- Verification strategy and verifier ownership.
- Human-only or irreversible decisions.
- Whether work is ready for delivery or should remain in discovery.
- Active workspace has been updated if the user opted in.
- Newly resolved domain terms or ADR-worthy decisions have been recorded.
- `CHECKPOINT.md` explains the current rationale without requiring the full run log.

Close with a short summary and the next recommended discovery, experiment, or `$dev` step.

## Source Inspiration

This Skill is a localized, lightweight adaptation of Matt Pocock's interview, domain-modeling, and ADR-capture patterns. Source: https://github.com/mattpocock/skills
