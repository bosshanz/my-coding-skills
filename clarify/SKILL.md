---
name: clarify
description: "Apply senior product-manager judgment to ambiguous, high-leverage product or technical work before implementation. Use when the user explicitly invokes $clarify or asks for product analysis, whether or what to build, target users or jobs, prioritization and tradeoffs, first-slice scope, success measures, low-cost experiments, a requirements interview, or material product, domain, architecture, lifecycle, migration, or safety alignment that ordinary dev questions cannot resolve. Own product shaping and handoff, not ongoing roadmaps, backlog or sprint management, stakeholder coordination, delivery tracking, or implementation. Do not use as a mandatory phase for ordinary requirements."
---

# Clarify

Use this Skill to turn a materially ambiguous or high-leverage request into a shared judgment before implementation. Apply the judgment of a senior product manager without claiming the organizational scope of a full-time PM. Produce alignment on whether to build, for whom, which tradeoffs matter, the first slice, the success signal, constraints, assumptions, domain terms, verification strategy, and durable decisions.

`clarify` is the home for product-shaping decisions and for architecture or domain alignment that ordinary `dev` questions cannot safely resolve. It is an escalation path, not the default first step for every requirement. Ordinary software work should stay in `dev`.

## Admission

Use the top-level `clarify` Skill only when at least one condition applies:

- The user explicitly requests `$clarify`, an interview, requirement challenge, architecture discussion, 产品分析, 要不要做, 做什么, 目标用户, 优先级或取舍, 第一期怎么切, 成功怎么算, 低成本实验, should we build, what to build, product prioritization, first slice, or how to measure success.
- A material product, domain, architecture, lifecycle, migration, or safety decision is unresolved.
- The request is solution-shaped and may be solving the wrong problem.
- Who it is for, the first slice, or the success signal is still undefined and would change the work.
- Several plausible interpretations would lead to meaningfully different implementations.
- Implementing the wrong interpretation would have a high cost.
- Durable domain language or an ADR-worthy decision must be established first.

Do not invoke `clarify` merely because work is new, multi-step, important, or touches multiple files.

If one or two focused questions inside `dev` can safely remove the ambiguity, keep the work in `dev`.

Do not admit a request whose primary job is ongoing product operations or delivery management. Explicitly invoking `$clarify` does not expand this boundary.

## Boundaries

- Keep the session conversational and proportional.
- Ask one question at a time only while a material unknown could change the judgment; when the evidence is sufficient, make the recommendation directly and invite challenge.
- Include a recommended answer with each question. When the open decision is product-shaped, recommend a product judgment, not a menu of options.
- Inspect repository evidence instead of asking factual questions the repository can answer.
- Create a lightweight product brief, decision memo, PRD, or experiment brief only when the user explicitly asks for that artifact and the underlying judgment is sufficiently clear.
- Do not take on ongoing roadmap maintenance, backlog grooming, sprint planning, stakeholder coordination, delivery tracking, status reporting, or date and resource commitments.
- When asked to own those ongoing PM operations, respond briefly that `clarify` cannot take that responsibility. Do not provide a takeover cadence, simulate continued execution, or remain in discovery. Offer a separately scoped, one-time decision or operating-model artifact only as a possible next request, identify the human owner or authorized system needed for continued execution, and stop.
- Do not invent visual direction; that belongs to `$design` after the slice is defined.
- Do not invent then implement; that belongs to `$dev`.
- Do not protect already understood usage; that belongs to `$qa`.
- Do not push an ambiguous problem into delivery merely to create visible progress.
- Do not treat clarification as permission to start coding unless the user explicitly asks to proceed.
- Hand off to `$dev` for implementation, `$design` when the next need is visual direction, or `$qa` when the next need is to protect an already understood user job, only after the behavior or next experiment is sufficiently defined. Stopping is valid when the judgment is not to build.

## Senior Product Judgment

For product-shaped work, own the smallest useful set:

- Frame the real problem separately from the proposed feature.
- Name the target user, the job, the current alternative, and why the problem matters now.
- Recommend `build`, `experiment`, or `stop`; state the weakest assumption and what evidence would change the judgment.
- Prioritize outcomes and tradeoffs, then define the smallest coherent first slice and explicit non-goals.
- Define a success signal that reflects user or business value rather than an easy proxy metric.
- Prefer a low-cost experiment when confidence is too low for delivery, and define the decision the experiment should unlock.

Keep product artifacts decision-oriented. Do not manufacture exhaustive ceremony, invented research, fake certainty, or delivery commitments merely because the user asks for a PM-shaped output.

## Repository Context

Before asking product or architecture questions, inspect the closest relevant context:

- Existing durable `CONTEXT.md` or `CONTEXT-MAP.md`.
- Existing `docs/adr/` records near the affected area.
- Relevant code paths, tests, docs, examples, evaluators, fixtures, and metrics.
- Existing product language, module names, and user-facing terminology.

If no repository context exists, proceed as a stateless interview and say so briefly.

## Interview Cycle

1. State the current understanding in 2-5 bullets:
   - Goal or user job.
   - First slice or flow.
   - Known facts and constraints.
   - Assumptions and unknowns.
   - Open decisions.
2. Form a provisional recommendation from the available evidence.
3. Pick the highest-leverage unresolved decision.
4. If that uncertainty could change the recommendation, ask exactly one question, provide the recommended answer, and explain why it fits the evidence.
5. If no material uncertainty remains, give the recommendation directly instead of forcing an interview.
6. After the user answers, update the understanding and repeat only while material ambiguity remains.

Stop asking questions when the remaining uncertainty is cheap to resolve during implementation. Do not continue the interview for completeness or ceremony. Do not stay in interview mode when a clear product recommendation can be challenged.

Prefer concrete scenarios over abstract categories. Stress-test edge cases, permissions, failure modes, lifecycle behavior, data ownership, migration impact, rollback paths, and evaluation quality when relevant.

## Discovery Mode

Use discovery mode only when the real problem, user job, whether to build, first slice, success signal, interface boundary, or meaningful verifier is still uncertain enough that direct delivery would be premature.

Discovery may:

- separate facts, assumptions, constraints, unknowns, and non-goals;
- form a product judgment and name who it is for, what job, why now, the first slice, and the success signal;
- generate multiple plausible interpretations or approaches;
- identify what evidence would change the decision, including not building;
- use low-cost prototypes or experiments before expensive delivery;
- produce a draft verifier, human gate, or acceptance strategy.

Discovery is complete when uncertainty is low enough to define a bounded implementation or experiment, or when the recommended action is to stop. Reducing uncertainty is a valid deliverable; do not present it as completed feature delivery.

## First-Principles Clarification

Use first-principles clarification when the request is ambiguous, solution-shaped, architecture-heavy, or likely to encode hidden assumptions:

- Separate the desired outcome from the proposed implementation.
- Identify facts, constraints, assumptions, invariants, unknowns, and non-goals before debating solutions.
- Ask what must remain true if the current UI, API, storage model, framework, metric, or workflow were replaced.
- Challenge inherited labels and abstractions when they obscure real domain behavior.
- Distinguish the real goal from proxy metrics.
- Convert resolved assumptions into a first slice, success signal, acceptance criteria, verifier requirements, or domain terms before handing off to `$dev`, `$qa`, or `$design`.

## Verifier Design

Before delivery, clarify only the verification questions proportionate to the task:

- What evidence should turn red when behavior is wrong?
- Is the evidence deterministic, subjective, or mixed?
- What important behavior is not covered?
- Which decision must remain human-only?
- If the evidence should come from real usage or a business rule a user can feel, name `$qa` as the owner of that evidence.

For reusable or high-impact evaluators, additionally clarify owner, isolation, version, calibration, and drift review.

Do not impose verifier-governance ceremony on ordinary deterministic tests.

## Domain Language

When domain terms materially affect the design:

- Propose a canonical term for overloaded language.
- Surface mismatches between repository docs and user wording.
- Surface contradictions between code and the stated domain model.
- Update the nearest durable `CONTEXT.md` only when the term should outlive the current work.

`CONTEXT.md` is a glossary, not a specification. Keep implementation details, plans, and transient notes out of it. Use repo-level `CONTEXT.md` only for durable domain terms.

## ADR Capture

Offer an ADR only when all are true:

- The decision is costly to reverse.
- Future readers would reasonably ask why it was chosen.
- Real alternatives were considered and rejected.

Do not create ADRs for ordinary implementation choices.

## Exit Criteria

Clarification is complete when the next bounded action is safe and meaningful, not when every possible question has been answered.

Confirm the smallest relevant set:

- Whether to build, experiment, or stop.
- Target behavior or uncertainty to reduce.
- Who and the job, when the work is product-shaped.
- Important priorities and tradeoffs, when they change the slice.
- First slice, success signal, and important non-goals, when the work is product-shaped.
- Material assumptions or unknowns.
- Primary flow and significant edge cases.
- Affected boundaries or modules, when needed.
- Proportionate verification strategy.
- Human-only or irreversible decisions, when relevant.
- Whether the work should go to `$dev`, `$qa`, `$design`, remain in discovery, or stop.
- Durable terms or ADR-worthy decisions have been recorded only when justified.

Close with a short summary and the next recommended action. Prefer `$dev` for implementation. Prefer `$design` when the slice is defined and the next need is visual direction. Prefer `$qa` when the rules are clear and the next need is to protect how a user actually uses the product. Prefer stop when the judgment is not to build.

When the work is product-shaped, the summary must name the product judgment, first slice, and success signal:

```text
产品判断: build | experiment | stop
对象与任务:
关键取舍:
第一期与非目标:
成功信号:
关键假设与验证:
下一步: $dev | $qa | $design | stay | stop
```

Deliver in Chinese by default. Keep code, commands, protocol names, and configuration keys in their original language.

## Source Inspiration

This Skill is a localized, lightweight adaptation of Matt Pocock's interview, domain-modeling, and ADR-capture patterns. Source: https://github.com/mattpocock/skills
