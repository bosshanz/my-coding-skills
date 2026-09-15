---
name: verify
description: "Opt-in business-rule checks, real user-journey diagnosis, and final acceptance. Use when the user explicitly requests these checks or invokes $verify; ordinary implementation and developer tests need no separate verification Skill."
when_to_use: "Check a named business rule or journey, protect it with requested tests, or judge completed work against agreed acceptance criteria. Generic code review, running a suite, and ordinary test additions do not trigger this Skill."
argument-hint: "[业务规则 / 用户旅程 / 验收范围 | rule, journey, or acceptance scope]"
---

# Verify

Check the requested behavior against the user's criteria. Start with the user-visible outcome and the authoritative effect: a passing test or success message only proves what it actually observes.

## Scope

- Diagnosis and final acceptance are read-only. They do not authorize source edits, test changes, publishing, or another agent.
- When the user requests protection, add the smallest meaningful test or check for the named rule. Keep the product behavior unchanged unless repair is also authorized. A wrong product is a finding, not a reason to weaken its expected behavior.
- Continue already-authorized repairs or other work after the check; no new workflow or repeated approval is needed. Unrelated journeys and missing evidence do not create more tasks.

## Check The Behavior

1. Establish the target, criteria, relevant revision, and actual evidence. Resolve business meaning from the request, product copy, domain notes, code, and existing checks. Ask only about an unresolved assumption that changes the conclusion.
2. Follow the relevant trigger through state, persistence, visible completion, failure, and recovery. Look for false success, lost work, stale state, wrong permissions, duplicate effects, partial failure, and concurrency where they affect this slice.
3. Test the weakest assumption using the cheapest check that includes the enforcing mechanism. Pure rules can use unit tests; persisted uniqueness, atomicity, or query scoping need the actual storage semantics or a demonstrated equivalent. Reuse fresh evidence and complete required project checks.
4. For each material finding, state the trigger, expected and observed behavior, impact, and reproducible evidence or exact gap. Distinguish confirmed defects from hypotheses. A review can find no defects.

For requested test protection, follow existing test patterns and show that the check detects the relevant failure when feasible. Do not add a framework or change the expected rule just to obtain a green result. Report only checks actually performed.

## Final Acceptance

When the user asks for a final verdict, use:

- `accepted`: agreed criteria and required checks are satisfied by current evidence.
- `accepted with risk`: no blocking criterion or required check remains; named nonblocking risks persist.
- `rejected`: a criterion fails, a blocking regression exists, or required evidence is missing.

Keep evidence, reviewer separation, and authority distinct. The same implementer may self-check but cannot claim independent review. If a separate reviewer is requested and authorized, give a non-implementer the original criteria, revision, and raw evidence before other verdicts; disclose shared context. Technical acceptance does not grant release or merge permission.

Answer the requested question directly, in Chinese by default, with the strongest evidence and material limits. A business diagnosis needs no go/no-go label. Missing required checks remain gaps; optional nearby scenarios do not automatically block completion.
