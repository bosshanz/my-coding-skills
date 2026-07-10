# Workflow Admission Control

## Principle

Do not turn every request into a Loop. Do not turn every requirement into a dedicated Clarify session.

Use the lightest workflow that can safely produce a trustworthy result. Process is an escalation mechanism, not a default tax.

## Default Route

Ordinary software requests go directly to `dev`.

`dev` should perform the minimum clarification needed inside the normal conversation, usually by inspecting the repository and asking at most one or two high-value questions when a material decision blocks implementation.

## Escalation Levels

### Level 0 — Direct Change

Use for tiny, local, reversible work with obvious verification.

Examples:

- copy or naming correction;
- small configuration edit;
- isolated mechanical refactor;
- clear one-line bug fix with a regression check.

No dedicated `clarify`, Loop workspace, or independent acceptance is required.

### Level 1 — Normal Dev

Use for ordinary features and bug fixes with a clear target.

`dev` handles lightweight clarification, design, implementation, testing, and completion evidence in one workflow.

### Level 2 — Dedicated Clarify

Escalate only when at least one is true:

- the user explicitly requests an interview or clarification session;
- multiple material product or architecture decisions remain unresolved;
- one or two inline questions cannot remove the ambiguity;
- the change is costly to reverse or crosses important domain boundaries;
- stakeholders use conflicting terminology or success criteria;
- discovery evidence is needed before implementation.

A dedicated Clarify session does not imply a Loop workspace.

### Level 3 — Explicit Loop

Escalate to a tracked Loop only when durable coordination adds real value, such as:

- work spans multiple sessions, agents, teams, or checkpoints;
- state must survive interruption or handoff;
- the task is recurring, scheduled, experimental, or long-running;
- verifier governance, budgets, permissions, or human gates must be tracked;
- multiple bounded iterations are expected;
- auditability or rollback evidence is materially important.

User opt-in is required before creating a Loop workspace unless the repository already mandates one.

### Level 4 — Independent Acceptance

Add a separate acceptance pass when blast radius, irreversibility, subjectivity, or cost of being wrong justifies stronger separation.

## Anti-Patterns

- Creating `loop/` for every feature.
- Running a formal Clarify interview for a clear local change.
- Asking the user questions that repository inspection can answer.
- Requiring independent acceptance for trivial reversible edits.
- Treating more artifacts as evidence of higher engineering maturity.

## Decision Rule

Escalate only when the expected reduction in ambiguity, risk, or coordination cost is greater than the process overhead introduced.
