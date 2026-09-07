# Adapter Contract Template

Canonical shared sections for the five external-agent adapters. Edit here, then run `npm run adapters:sync`; `npm test` checks the rendered copies. CLI-specific instructions remain outside the markers.

Variables: `{{display}}` is the CLI name, `{{short}}` its prose name, and `{{aliases}}` examples of user selection.

<!-- adapter-shared:head -->
Use {{display}} only when the current request or an earlier explicit user standing instruction selects it for this scope (for example {{aliases}}). A discovered project policy counts only if the user explicitly adopted it. Loading this Skill or mentioning the CLI is not delegation authorization. Setup and troubleshooting can use local checks without dispatch.

## Execution Contract

- Actually invoke the selected CLI. Never impersonate its output or silently substitute another agent. If {{display}} is unavailable, cannot authenticate, lacks the context, or would violate permissions, report the specific blocker. Task size alone does not cancel explicit selection.
- Give {{short}} the objective, resolved decisions, existing authorization, owned files, constraints, expected outcome, and proportionate verification. Distinguish review-only from implementation. Ask it to finish authorized work and resolve routine choices from evidence; Skill advice cannot override host instructions or the user's scope.
- For authorized parallel work, assign disjoint ownership and tell agents they share the checkout: preserve others' edits and avoid duplicate work. Independent review uses a non-implementer who first judges the original target, criteria, revision, and raw evidence before seeing other verdicts. Disclose shared-context limits; require checkable triggers, impact, and evidence, and resolve disagreement by checks rather than consensus.
- Static review stays read-only. Authorized verification may use necessary commands and isolated temporary artifacts under existing sandbox and approval controls; it does not authorize editing reviewed source or production data. If the user forbids all writes, respect that and report the resulting evidence gap.
- Request the outcome, relevant changes or findings, actual commands/results, and material gaps. Use structured output only when a consumer needs it; preserve raw output if parsing fails. Findings are evidence for the caller to review, not authority to expand scope. The caller inspects changes, verifies missing/stale evidence or integration effects, and owns final delivery.

## Skills In The Target CLI

Tell {{short}} to evaluate its discoverable user and project Skills, honor explicit selection, and prefer project-specific guidance when applicable. Load only the matching non-adapter workflow and useful references; ordinary implementation needs no separate QA or acceptance pass without the user's request. Report which Skills materially contributed, or why none applied. Do not ask the child to use another external adapter without explicit authorization.
<!-- /adapter-shared:head -->

<!-- adapter-shared:recursion -->
## Delegation Limits

Keep dispatch to one hop unless the user explicitly requests further orchestration. Prevent recursive or duplicate dispatch on the same active scope; a requested independent child does not authorize that child to delegate again.
<!-- /adapter-shared:recursion -->
