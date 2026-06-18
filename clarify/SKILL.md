---
name: clarify
description: "Run a dedicated requirement or architecture interview before implementation, with repository-aware questions, one-question-at-a-time alignment, optional CONTEXT.md glossary updates, and sparse ADR capture. Use when the user explicitly invokes $clarify, asks to be grilled/interviewed on a plan, asks to clarify a feature or refactor before coding, or wants durable domain terms or architectural decisions recorded."
---

# Clarify

Use this Skill to turn a loose request into shared understanding before implementation. The output is alignment: clarified behavior, constraints, domain terms, and durable decisions. Do not treat the interview as permission to start coding unless the user explicitly asks to proceed.

## Boundaries

- Keep the session conversational and proportional.
- Ask one question at a time and wait for the answer.
- Include your recommended answer with each question.
- If a question can be answered from the repository, inspect the repository instead of asking.
- Do not create issue-tracker workflows, PRDs, or agent briefs unless the user asks for them.
- Hand off implementation to `$dev` after the design is clear.

## Repository Context

Before asking design questions, inspect the closest relevant context:

- Existing `CONTEXT.md` or `CONTEXT-MAP.md`, if present.
- Existing `docs/adr/` records near the affected area, if present.
- Relevant code paths, tests, docs, and examples that can answer factual questions.
- Existing product language, module names, and user-facing terminology.

If no repository context exists, proceed as a stateless interview and say so briefly.

## Interview Loop

1. State the current understanding in 2-5 bullets:
   - Goal
   - User or system flow
   - Known constraints
   - Open decisions
2. Pick the highest-leverage unresolved decision.
3. Ask exactly one question.
4. Provide a recommended answer and why it fits the current evidence.
5. After the user answers, update the understanding and repeat.

Prefer concrete scenarios over abstract categories. Stress-test edge cases, permissions, failure modes, lifecycle behavior, data ownership, migration impact, and rollback paths when relevant.

## Domain Language

When domain terms matter, keep the vocabulary sharp:

- If the user uses an overloaded term, propose a canonical term.
- If repository docs define a term differently from the user's wording, call out the mismatch and ask which meaning should win.
- If code contradicts the stated domain model, surface the contradiction.
- When a term is resolved, update the nearest relevant `CONTEXT.md` immediately.

`CONTEXT.md` is a glossary, not a spec. Keep it free of implementation details, plans, and transient notes.

Use this compact format when adding terms:

```markdown
## Terms

- **Term**: One-sentence domain meaning. Include contrast with nearby terms only when needed.
```

## ADR Capture

Offer an ADR only when all are true:

- The decision is costly to reverse.
- Future readers would wonder why this path was chosen.
- Real alternatives were considered and rejected.

If an ADR is warranted, create it under the nearest existing `docs/adr/` directory. If none exists, create `docs/adr/` at the relevant root. Use a short numbered filename such as `0001-choose-local-first-sync.md`.

Use this compact ADR shape:

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

The interview is complete when these are clear enough for implementation:

- Target behavior and non-goals.
- Primary flow and important edge cases.
- Affected modules or seams.
- Data/API/state/lifecycle implications, if any.
- Verification strategy.
- Newly resolved domain terms or ADR-worthy decisions have been recorded.

Close with a short design summary and the next recommended `$dev` step.

## Source Inspiration

This Skill is a localized, lightweight adaptation of Matt Pocock's interview, domain-modeling, and ADR-capture patterns. Source: https://github.com/mattpocock/skills
