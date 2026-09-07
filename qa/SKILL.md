---
name: qa
description: "Opt-in business and real-usage QA. Use only when the user explicitly requests QA, a business rule check, or a real user-journey diagnosis; ordinary implementation stays in dev."
when_to_use: "Use only when the user explicitly invokes $qa or /qa, or explicitly asks for business testing, QA thinking, a user-journey or real-usage diagnosis, or protection of a named business rule without a product change. Do not use for generic reviews or inspections, ordinary feature implementation, bug fixes, developer tests, go/no-go acceptance, running the existing suite, or a bare request to add e2e, regression, or tests."
argument-hint: "[业务问题 | business question]"
---

# QA

Check whether the asked business meaning or real usage holds. Start from the user's job and the rule that must remain true, then inspect actual usage and ways it can fail while looking correct. A green suite is evidence for its coverage, not proof that the business works.

## Scope

Use only for an explicit QA, business-rule, or real-usage request. Another Skill's recommendation or an evidence gap is not authorization. Generic reviews, implementation, bug fixes, and bare requests to add tests stay in `dev`; final go/no-go goes to `acceptance`. Material ambiguity about the business needs clarification rather than invented rules.

Choose the mode from the request without asking the user to choose a workflow:

- **Diagnosis:** answer the named business or usage question without editing files. Finish this QA portion once answered; continue other already-authorized work if any.
- **Contract:** when the user requests business evidence before implementation, add the smallest meaningful failing or pending check for the defined rule. Product fixes belong to `dev`.
- **Coverage:** when the user asks to protect understood usage, add or update its evidence. If the product is wrong, report the defect rather than changing the rule or patching around it.

Follow host instructions, the user's scope, and existing authorization. A later request can authorize protection or repair without a second confirmation. Authorized repairs can continue through `dev` in the same task; diagnosis alone does not authorize them. Keep unrelated journeys out. If an applicable rule blocks work, cite its file and instruction and identify what is missing.

## Examine The Asked Slice

1. Read the nearest product evidence: domain notes, user-facing copy, relevant screens or APIs, existing journeys, and current changes. Establish who uses it, what success means, and which failure matters. Ask only if a material business assumption cannot be resolved from evidence.
2. For a journey, follow how the user starts, succeeds, gets blocked, abandons work, and recovers. Inspect only states relevant to that journey. A single-behavior question needs a focused check, not a full journey audit.
3. Form an initial judgment from the user job and raw evidence before adopting the implementer's explanation. Look for counterexamples such as wrong permissions, stale state, lost work, partial failure, or disagreement between visible success and persisted money, stock, quota, or status. Name the weakest assumption and check whether the evidence covers it.
4. For each material finding, give the trigger, expected versus observed behavior, user impact, and reproducible evidence or its precise gap. Separate confirmed defects from hypotheses and identify what could change the judgment. A review may find no defects.

Independent review requires actual separation from implementation and applicable delegation authorization; this Skill does not itself request another agent. Authorized reviewers first form judgments from original materials, then compare them. Disclose shared-context limits and resolve disagreements with evidence, not consensus.

## Add Protection When Requested

After understanding and challenging the rule, choose the cheapest evidence that would fail if its business meaning broke. Use domain/integration checks for rules, API checks for cross-service contracts, and e2e for behavior that depends on the UI. A scripted or manual check may be appropriate; a mock that removes the invariant cannot protect it.

Follow existing test patterns, preserve others' work, and run the relevant checks. Do not introduce a framework to look thorough or weaken the rule to make tests pass. Report protection only for behavior actually checked. Missing tools or blocked required checks remain verification gaps.

## Delivery

Answer in concise Chinese by default with the finding, supporting evidence, and consequential uncertainty. When protection was requested, state what was changed and verified. No mode label or fixed report template is required. Uncovered nearby usage is a limitation, not an automatic new task; end when the requested slice and other authorized work are complete.
