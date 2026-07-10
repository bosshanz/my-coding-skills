---
name: clarify
description: "Run a dedicated requirement, discovery, or architecture interview before implementation. Use only when the user explicitly invokes $clarify or asks for an interview/challenge, or when a material product, domain, architecture, lifecycle, or safety decision cannot be resolved inside ordinary dev clarification. Supports repository-aware questions, one-question-at-a-time alignment, optional Loop admission, optional CONTEXT.md glossary updates, sparse ADR capture, and explicit transition from discovery to delivery. Do not use as a mandatory phase for every new requirement."
---

# Clarify

Use this Skill to turn a materially ambiguous or high-leverage request into shared understanding before implementation. The output is alignment: clarified behavior, constraints, assumptions, domain terms, verification strategy, and durable decisions.

`clarify` is an escalation path, not the default first step for every requirement. Ordinary software work should stay in `dev`, which can ask a few targeted questions inside its normal delivery flow.

## Admission

Use the top-level `clarify` Skill only when at least one condition applies:

- The user explicitly requests `$clarify`, an interview, requirement challenge, or architecture discussion.
- A material product, domain, architecture, lifecycle, migration, or safety decision is unresolved.
- The request is solution-shaped and may be solving the wrong problem.
- Several plausible interpretations would lead to meaningfully different implementations.
- Implementing the wrong interpretation would have a high cost.
- Durable domain language or an ADR-worthy decision must be established first.

Do not invoke `clarify` merely because work is new, multi-step, important, or touches multiple files.

If one or two focused questions inside `dev` can safely remove the ambiguity, keep the work in `dev`.

## Boundaries

- Keep the session conversational and proportional.
- Ask one question at a time and wait for the answer.
- Include a recommended answer with each question.
- Inspect repository evidence instead of asking factual questions the repository can answer.
- Do not create a Loop workspace unless Loop admission is justified and the user explicitly opts in or directly asks for one.
- Do not create issue-tracker workflows, PRDs, or Agent briefs unless requested.
- Do not push an ambiguous problem into delivery merely to create visible progress.
- Do not treat clarification as permission to start coding unless the user explicitly asks to proceed.
- Hand off implementation to `$dev` only after the behavior or next experiment is sufficiently defined.

## Repository Context

Before asking design questions, inspect the closest relevant context:

- Existing durable `CONTEXT.md` or `CONTEXT-MAP.md`.
- Existing `loop/` or `loops/<loop-id>/` workspace, if one is already active.
- Existing `docs/adr/` records near the affected area.
- Relevant code paths, tests, docs, examples, evaluators, fixtures, and metrics.
- Existing product language, module names, and user-facing terminology.

If no repository context exists, proceed as a stateless interview and say so briefly.

## Interview Cycle

1. State the current understanding in 2-5 bullets:
   - Goal.
   - User or system flow.
   - Known facts and constraints.
   - Assumptions and unknowns.
   - Open decisions.
2. Pick the highest-leverage unresolved decision.
3. Ask exactly one question.
4. Provide a recommended answer and explain why it fits the evidence.
5. After the user answers, update the understanding and repeat only while material ambiguity remains.

Stop asking questions when the remaining uncertainty is cheap to resolve during implementation. Do not continue the interview for completeness or ceremony.

Prefer concrete scenarios over abstract categories. Stress-test edge cases, permissions, failure modes, lifecycle behavior, data ownership, migration impact, rollback paths, and evaluation quality when relevant.

## Discovery Mode

Use discovery mode only when the real problem, user need, product direction, interface boundary, or meaningful verifier is still uncertain enough that direct delivery would be premature.

Discovery may:

- separate facts, assumptions, constraints, unknowns, and non-goals;
- generate multiple plausible interpretations or approaches;
- identify what evidence would change the decision;
- use low-cost prototypes or experiments before expensive delivery;
- produce a draft verifier, human gate, or acceptance strategy.

Discovery is complete when uncertainty is low enough to define a bounded implementation or experiment. Reducing uncertainty is a valid deliverable; do not present it as completed feature delivery.

Read `../loop-engineering/references/discovery-loop.md` when the discovery-to-delivery boundary is unclear.

## Loop Admission

`clarify` does not imply a Loop, and a Discovery conversation does not automatically require a Loop workspace.

Before proposing a workspace, read `../loop-engineering/references/loop-admission.md` and check whether the feedback structure itself needs governance.

A Loop is usually justified only when the work needs one or more strong signals such as:

- state preserved across sessions, Agents, scheduled runs, or days;
- repeated independent experiments or optimization cycles;
- verifier design, calibration, versioning, or drift management;
- future decisions that depend on preserved hypotheses and rejected alternatives;
- recurring continue / stop / pivot decisions;
- continuous quality, evaluation, operations, learning, or methodology work.

The following do not justify a Loop by themselves:

- multiple files;
- several implementation steps;
- a plan;
- tests;
- one round of clarification;
- high importance without persistence or repeated feedback.

## Optional Loop Workspace

Only after Loop admission is justified and the work is clear enough to name, ask once whether the user wants a durable workspace.

Use a concise question such as:

```text
这项工作需要跨轮保存状态并持续做实验、评估或 continue / stop / pivot 决策。是否创建 Loop 工作区持续跟踪？我的建议：这种情况下选 yes；若本次可以在一个有边界的交付中完成，选 no。
```

If the user says no, continue clarification without creating files. If the user says yes or directly requested a Loop, read `references/loop-workspace.md` and create or update the workspace.

Use `loop/` for one active governed Loop. Prefer `loops/<loop-id>/` for concurrent, independently scheduled, or durable Loops. If an existing workspace is unrelated, ask whether to reuse, archive, or create a separate named directory.

## First-Principles Clarification

Use first-principles clarification when the request is ambiguous, solution-shaped, architecture-heavy, or likely to encode hidden assumptions:

- Separate the desired outcome from the proposed implementation.
- Identify facts, constraints, assumptions, invariants, unknowns, and non-goals before debating solutions.
- Ask what must remain true if the current UI, API, storage model, framework, metric, or workflow were replaced.
- Challenge inherited labels and abstractions when they obscure real domain behavior.
- Distinguish the real goal from proxy metrics.
- Convert resolved assumptions into acceptance criteria, verifier requirements, or domain terms before handing off to `$dev`.

## Verifier Design

Before delivery, clarify only the verification questions proportionate to the task:

- What evidence should turn red when behavior is wrong?
- Is the evidence deterministic, subjective, or mixed?
- What important behavior is not covered?
- Which decision must remain human-only?

For reusable or high-impact evaluators, additionally clarify owner, isolation, version, calibration, and drift review. Read `../loop-engineering/references/verifier-governance.md` only when that depth is warranted.

Do not impose verifier-governance ceremony on ordinary deterministic tests.

## Domain Language

When domain terms materially affect the design:

- Propose a canonical term for overloaded language.
- Surface mismatches between repository docs and user wording.
- Surface contradictions between code and the stated domain model.
- Update the nearest durable `CONTEXT.md` only when the term should outlive the current work.

`CONTEXT.md` is a glossary, not a specification. Keep implementation details, plans, and transient notes out of it.

If a Loop workspace is active, use its `CONTEXT.md` for task-local facts and evaluation context. Use repo-level `CONTEXT.md` only for durable domain terms.

## ADR Capture

Offer an ADR only when all are true:

- The decision is costly to reverse.
- Future readers would reasonably ask why it was chosen.
- Real alternatives were considered and rejected.

Do not create ADRs for ordinary implementation choices.

## Exit Criteria

Clarification is complete when the next bounded action is safe and meaningful, not when every possible question has been answered.

Confirm the smallest relevant set:

- Target behavior or uncertainty to reduce.
- Important non-goals and constraints.
- Material assumptions or unknowns.
- Primary flow and significant edge cases.
- Affected boundaries or modules, when needed.
- Proportionate verification strategy.
- Human-only or irreversible decisions, when relevant.
- Whether the work should return to direct `dev`, remain in discovery, or enter a governed Loop.
- Durable terms or ADR-worthy decisions have been recorded only when justified.
- If a Loop workspace exists, its state and checkpoint are current.

Close with a short summary and the next recommended action. Prefer returning to `$dev`; recommend a Loop only when admission criteria are met.

## Source Inspiration

This Skill is a localized, lightweight adaptation of Matt Pocock's interview, domain-modeling, and ADR-capture patterns. Source: https://github.com/mattpocock/skills
