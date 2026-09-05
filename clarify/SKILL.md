---
name: clarify
description: "Clarify product or architecture decisions when explicitly requested; during dev, resolve material ambiguity beyond ordinary development questions, then return to delivery."
when_to_use: "Use when the user explicitly invokes $clarify or asks for product analysis, whether or what to build, target users or jobs, prioritization and tradeoffs, first-slice scope, success measures, low-cost experiments, a requirements interview, or, during dev, material product, domain, architecture, lifecycle, migration, or safety alignment that ordinary dev questions cannot resolve. Own product shaping and handoff, not ongoing roadmaps, backlog or sprint management, stakeholder coordination, delivery tracking, or implementation. Do not use as a mandatory phase for ordinary requirements."
argument-hint: "[问题或机会 | problem or opportunity]"
---

# Clarify

Use this Skill to turn a materially ambiguous or high-leverage request into a shared judgment before implementation. Apply the judgment of a senior product manager without claiming the organizational scope of a full-time PM. Produce alignment on whether to build, for whom, which tradeoffs matter, the first slice, the success signal, constraints, assumptions, domain terms, verification strategy, and durable decisions.

`clarify` is the home for product-shaping decisions and for architecture or domain alignment that ordinary `dev` questions cannot safely resolve. It is an escalation path, not the default first step for every requirement. Ordinary software work should stay in `dev`.

## Admission

**Direct entry:** use when the user explicitly invokes `$clarify`, requests product analysis, requirement challenge, architecture discussion, prioritization, first-slice scope, or an experiment / success-measure decision. A generic implementation request enters `dev` first.

**During delivery:** `dev` may consult this Skill when a material product, domain, architecture, lifecycle, or migration decision remains unresolved after repository inspection and ordinary development questions. Examples include incompatible interpretations, an undefined target user or success signal that changes the implementation, or a costly domain choice. Work being new, important, or multi-file is not sufficient.

Resolve only that decision, preserve the original request and authorization, and return to `dev` when implementation was already requested. A standalone clarification request ends with a recommendation; it does not itself authorize implementation.

Do not admit ongoing product operations or delivery management. Explicit invocation does not expand this boundary.

## Boundaries

Follow higher-priority host instructions and the user's explicit scope over workflow advice. Reuse repository facts and resolved decisions. If a rule requires pausing, link the exact file, quote the instruction, and name the unresolved decision; continue any independent authorized work.

- Keep the session conversational and proportional.
- Ask one question at a time only while a material unknown could change the judgment; when the evidence is sufficient, make the recommendation directly and invite challenge.
- Include a recommended answer with each question. When the open decision is product-shaped, recommend a product judgment, not a menu of options.
- Inspect repository evidence instead of asking factual questions the repository can answer.
- Create a lightweight product brief, decision memo, PRD, or experiment brief only when the user explicitly asks for that artifact and the underlying judgment is sufficiently clear.
- Do not take on ongoing roadmap maintenance, backlog grooming, sprint planning, stakeholder coordination, delivery tracking, status reporting, or date and resource commitments.
- When asked to own those ongoing PM operations, respond briefly that `clarify` cannot take that responsibility. Do not provide a takeover cadence, simulate continued execution, or remain in discovery. Offer a separately scoped, one-time decision or operating-model artifact only as a possible next request, identify the human owner or authorized system needed for continued execution, and stop.
- Do not invent interaction or visual direction; that belongs to `$design` after the slice is defined.
- Do not invent then implement; that belongs to `$dev`.
- Do not implement protection for already understood usage. Put the rule into the verification strategy for `$dev`; use `$qa` only when the user explicitly requests an independent business or real-usage pass.
- Do not push an ambiguous problem into delivery merely to create visible progress.
- A clarification-only request does not authorize coding. If clarification was part of an already requested implementation, resume `$dev` when the material decision is resolved; do not ask for the same authorization again.
- Hand off to `$dev` for implementation or `$design` when the next need is interaction or visual direction. Hand off to `$qa` only when the user explicitly requested that independent pass and the behavior is sufficiently defined. Stopping is valid when the judgment is not to build.

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
- Convert resolved assumptions into a first slice, success signal, acceptance criteria, verifier requirements, or domain terms before handing off to `$dev` or `$design`; include `$qa` only for an explicitly requested independent pass.

## Verifier Design

Before delivery, clarify only the verification questions proportionate to the task:

- What evidence should turn red when behavior is wrong?
- Is the evidence deterministic, subjective, or mixed?
- What important behavior is not covered?
- Which decision must remain human-only?
- If the evidence should come from real usage or a business rule a user can feel, describe that evidence directly in the verification strategy. Do not route to `$qa` merely because of the evidence type.

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

Review the smallest relevant set against existing evidence; do not request confirmation for decisions already resolved:

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
- Whether the work should go to `$dev`, `$design`, remain in discovery, or stop; include `$qa` only when the user explicitly requested it.
- Durable terms or ADR-worthy decisions have been recorded only when justified.

For consultation during an authorized implementation, briefly summarize the resolved decision and resume delivery in the same task. Only standalone clarification ends with a recommendation: prefer `$dev` for implementation or `$design` for interaction or visual direction, and use `$qa` only for an explicitly requested independent pass. A recommendation not to build should be explained to the user; it does not silently cancel an explicit implementation request.

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
