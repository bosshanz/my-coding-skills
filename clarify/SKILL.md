---
name: clarify
description: "Clarify product or architecture decisions when explicitly requested; during dev, resolve material ambiguity beyond ordinary development questions, then return to delivery."
when_to_use: "Use when the user explicitly invokes $clarify or asks for product analysis, whether or what to build, target users or jobs, prioritization and tradeoffs, first-slice scope, success measures, low-cost experiments, a requirements interview, or, during dev, material product, domain, architecture, lifecycle, migration, or safety alignment that ordinary dev questions cannot resolve. Own product shaping and handoff, not ongoing roadmaps, backlog or sprint management, stakeholder coordination, delivery tracking, or implementation. Do not use as a mandatory phase for ordinary requirements."
argument-hint: "[问题或机会 | problem or opportunity]"
---

# Clarify

Resolve a consequential product or architecture decision. Ordinary implementation starts in `dev`; task size or importance alone does not require clarification. During authorized delivery, resolve only the material ambiguity and then resume implementation. Standalone clarification ends with a recommendation and does not authorize coding.

Follow host instructions and the user's scope. Inspect repository facts and reuse settled decisions before asking. If an applicable rule blocks work, cite its file and instruction, explain the missing decision, and continue independent authorized work.

## Reach A Judgment

1. Inspect the closest relevant code, user-facing behavior, tests, product notes, domain terms, and existing decisions. Use `CONTEXT.md`, `CONTEXT-MAP.md`, or ADRs when present; their absence need not block a conversation.
2. Separate the desired outcome from the proposed feature. Identify observed facts, constraints, assumptions, and a concrete success scenario. Distinguish a reproduced failure, a reported symptom, and a new opportunity; do not turn an unconfirmed cause into a requirement.
3. Form a provisional recommendation. State the weakest assumption and what evidence would change it. If a material unknown could change the recommendation, ask one focused question with a recommended answer grounded in the evidence. Update the judgment after the answer; stop interviewing when remaining choices can be resolved during ordinary development.
4. For product work, recommend `build`, `experiment`, or `stop`. Explain the target user and job, current alternative, consequential tradeoff, smallest coherent first slice and non-goals, and a success signal tied to user value. Include only what supports the decision; no fixed report fields are required.
5. Define the evidence needed for the next bounded action. What would fail if the claimed behavior were wrong? What important behavior remains uncovered? Which decision, if any, belongs to a human? Describe missing business or real-usage evidence directly; it does not automatically require `$qa`.

Prefer concrete scenarios over labels. Stress-test permissions, lifecycle, data ownership, interface boundaries, migration, rollback, and recovery when they affect the decision. Keep related rules and state together; extra layers need a current reason. A script, prototype, or existing workflow may be enough to test a complete first slice.

When uncertainty is too high for implementation, propose the cheapest experiment that can change the decision. To assess an optional element, compare with and without it under controlled conditions and define the verifier and meaningful difference first. Designing an experiment does not authorize running or applying it. For reusable or high-impact evaluators, consider version, calibration, isolation, ownership, and blind spots; ordinary tests need no governance ceremony.

## Boundaries And Completion

- Own one-time product shaping and technical alignment, not ongoing roadmap/backlog maintenance, sprint planning, stakeholder coordination, delivery tracking, or resource commitments. If asked to take over those operations, state the scope limit and required human owner or authorized system; do not simulate continued management. A separately requested one-time artifact remains possible.
- Create a brief, PRD, decision memo, or experiment brief when requested. Use durable domain terms only where terminology affects behavior; update an existing glossary only when justified and authorized. A glossary is not a task plan. Capture an ADR only for a costly-to-reverse decision with real rejected alternatives that future readers need to understand.
- Use `design` for interaction or visual direction once the slice is defined, and `dev` for implementation. Separate business QA requires an explicit request. A recommendation to stop must be explained; it does not silently cancel an already requested implementation.
- Finish when the next bounded action is meaningful, not when every question is answered. During delivery, summarize the resolved decision and continue the original task without renewing its authorization. For standalone clarification, give the recommendation, evidence, and consequential unknowns in concise Chinese by default.

## Source Inspiration

Adapted from Matt Pocock's interview, domain-modeling, and ADR-capture patterns: https://github.com/mattpocock/skills
