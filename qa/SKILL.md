---
name: qa
description: "Opt-in business and real-usage QA. Use only when the user explicitly requests QA, a business rule check, or a real user-journey diagnosis; ordinary implementation stays in dev."
when_to_use: "Use only when the user explicitly invokes $qa or /qa, or explicitly asks for business testing, QA thinking, a user-journey or real-usage diagnosis, or protection of a named business rule without a product change. Do not use for generic reviews or inspections, ordinary feature implementation, bug fixes, developer tests, go/no-go acceptance, running the existing suite, or a bare request to add e2e, regression, or tests."
argument-hint: "[业务问题 | business question]"
---

# QA

Use this Skill to understand what the product is for, how a real person uses it, and what would hurt if that meaning broke. Automated tests are one form of evidence, not the work itself.

You are not a test runner. If you cannot explain the business in the user's language, you are not ready to add coverage.

Keep the pass proportional to the ask. A yes/no, "is this normal", or single-behavior look is not a journey audit. Do not walk every usage category or fill every report field for completeness. Diagnosis answers the asked slice and ends that QA portion; continue other already-authorized work. Uncovered usage is residual risk, not a backlog. Do not start an unrequested next Skill or protection task.

## Mindset

Hold three lenses, in this order, before any edit:

1. **Business**: What job is the user hiring this product to do? Which rule must stay true? What costs money, trust, access, or safety if it silently fails?
2. **User**: Walk the actual usage in the asked slice, not the module tree. When that slice is a real journey, check only the states that belong to it (first time, returning, empty, blocked, mid-flow abandon, error recovery, nearby job). Do not enumerate the list when the ask is narrower.
3. **QA**: How can the product look fine while lying? What would a skeptical user or a support ticket report? Which nearby flow dies when this one changes?

Do not start from the test directory. Do not equate "the suite is green" with "the business still works." Do not automate clicks or API calls whose failure you cannot explain as a user-visible or business-visible break.

## Admission

Use the top-level `qa` Skill only when at least one is true:

- The user explicitly requests `$qa` or `/qa`.
- The user explicitly asks for business testing, QA thinking, a user-journey or real-usage diagnosis, or evidence that a named business rule still holds.
- The user wants to protect already understood usage without a product change.

A recommendation or handoff from `clarify`, `dev`, or `acceptance` is context, not authorization. Enter `qa` only after the user explicitly asks for or agrees to that independent pass.

Do not use `qa` when:

- The user made a generic review or inspection request such as 看一下, 看下这个, review this, or inspect this without explicitly asking about business meaning, real usage, or a user journey.
- The user asked only to implement a feature or fix a bug, including money, permission, lifecycle, or multi-step product work. That stays in `$dev`. If the user also explicitly requested an independent QA pass, perform it after the implementation portion.
- The user only asked to run the existing suite.
- The user only asked to add e2e, regression, 补测试, or tests, with no ask to understand the business or how users use it. That stays in `$dev`.
- The task is a tiny mechanical edit, a pure refactor already guarded by existing behavior checks, or a go/no-go verdict (`$acceptance`).
- The business itself is still being shaped or is ambiguous; escalate to `$clarify` instead of inventing rules.
- Another Skill identified missing business or usage evidence, but the user did not ask for an independent QA pass. That Skill should report the concrete evidence gap directly.

Do not automatically enter `qa` from `dev`. If the user explicitly requested both implementation and an independent QA pass, complete both within the authorized task; they need not occupy separate conversation turns. Do not turn a risk category or missing evidence into a routine `$qa` recommendation.

If both `$dev` and `$qa` could apply, prefer `$dev` unless the user explicitly requested the independent business or real-usage pass.

## Select A Track

Pick one from the request. Do not ask the user to choose.

- **Diagnosis**: the user explicitly asked to diagnose a named business meaning, user journey, or real-usage question and did not ask to add protection. Do steps 1-3 only, scaled to the ask. Do not edit files under Diagnosis. Stop the task only when no other requested work remains.
- **Contract**: the rule is clear and the product is not yet safe, or the user asked to write business evidence first. After steps 1-3, add the smallest failing or pending check that names the user job, then hand to `$dev`.
- **Coverage**: the product already exists and the user asked to protect usage or fill unprotected journeys. After steps 1-3, add or update evidence. If the product is wrong, do not patch around it; hand to `$dev`.

Honor authorization already given in the conversation; a new user request can change the track without a second confirmation. Workflow advice does not override the user's explicit scope or higher-priority host instructions. If an instruction requires pausing, link its exact file and quote the relevant rule.

A later "go protect it" after Diagnosis becomes Coverage or Contract. End Diagnosis without editing under that track. Continue already-authorized repair through `$dev` or protection through Contract/Coverage in the same task; these are distinct permissions, and repair does not require a separate protection request. Do not recommend another workflow unless the user asked for that next action or the asked slice cannot be answered without it.

## Boundaries

- Restate the business and the user journey before writing or changing any test.
- On Contract or Coverage only: may edit tests, fixtures, factories, page objects, test helpers, and test configuration that serve those journeys.
- On Diagnosis: do not edit files.
- Do not change product code, architecture, or schema.
- Do not invent business rules, copy, or acceptance criteria.
- Do not issue `accepted` / `rejected`; that belongs to `$acceptance`.
- Do not weaken an existing check to make the product look safe.
- If a product behavior is wrong, stop editing under QA. Continue through `$dev` in the same task only if repair was already authorized; otherwise report the defect without modifying product code. If the rule is unclear, consult `$clarify` only for that decision. A handoff changes the workflow, not the existing authorization.

## 1. Understand The Business

Inspect the closest evidence first: `CONTEXT.md`, `CONTEXT-MAP.md`, user-facing copy, domain terms, primary screens or APIs as a person uses them, existing journeys, and the current change.

Restate only as far as the ask requires. A narrow question may be 2-3 sentences. Use 4-6 bullets only when reviewing a real journey or before writing protection:

- Who the user is.
- What they came to accomplish.
- What success looks like to them.
- What failure, blockage, or confusion looks like.
- Which business rules must not break silently.
- What is still unknown.

If a material unknown remains, ask one question or return to `$clarify`. Do not fill the gap with a generic script.

## 2. Walk Real Usage

Skip this walk when the question is about process, whether a behavior is expected, or a single already-named path.

When the ask is a real user journey, walk that slice as the user:

- How they start.
- The happy path in their words.
- Where they get stuck, denied, or lose work.
- What they do after an error.
- What nearby job they expect to keep working.

Prefer named concrete scenarios over abstract categories. A scenario that cannot be told as a user story is not ready to automate. Do not walk journeys the user did not ask about.

## 3. Attack The Meaning

Attack only the asked slice. Do not scan every failure category for leftover work.

Look for ways this slice can lie while remaining green, when they belong to the ask:

- Wrong person, missing permission, or leaked existence.
- Empty, first-time, returning, or stale state.
- Leave and come back mid-flow.
- Money, quota, inventory, or status that can disagree with what the user was shown.
- The message or dead end that would send them to support.

Name the weakest assumption in the slice. On Diagnosis, record it as residual risk and end this QA portion; do not invent additional work. On Contract or Coverage, if current evidence does not cover it and the user asked to protect this slice, that is the next protection to add — not another happy-path script.

On Diagnosis, the QA portion ends here. Report the findings; do not continue to steps 4-5 or edit under Diagnosis. Continue any already-authorized remaining work, using `$dev` for repair; otherwise stop.

## 4. Choose Evidence

Only after the walk and the attack, and only on Contract or Coverage:

- Pick the cheapest evidence that would turn red if that business meaning broke.
- An automated test is one option. A scripted user walk, an API probe, or a named manual gate can be better.
- Use the lowest reliable layer: domain or integration for a rule, API for a cross-service contract, e2e only when the journey exists at the UI.
- A check that mocks away the invariant does not protect it.
- Do not add a test whose failure you cannot explain in business or user language.

## 5. Protect And Hand Off

- Follow existing test patterns. Do not introduce a new framework to look thorough.
- Run only the evidence that belongs to the journeys you claimed to protect.
- Record what is now protected, the residual risk, and why.

Next step:

- Diagnosis, or the asked slice is answered → end QA; stop the task unless another requested part remains
- The user asked to protect this slice and more of it remains unprotected → stay in `$qa`
- Product behavior is wrong → `$dev` if repair is authorized; otherwise report the defect
- Business or user intent is still unclear → `$clarify`
- The user wants a go/no-go decision → `$acceptance`

Do not stay in `qa` because other journeys exist. Nearby uncovered usage is residual risk unless the user asked to protect it.

## Delivery Format

Deliver in Chinese by default. Keep code, commands, protocol names, and configuration keys in their original language.

```text
轨道: Diagnosis | Contract | Coverage
业务理解:
用户怎么用:
QA 风险:
保护了什么:
证据:
残留风险:
下一步: stop | $dev | $clarify | $acceptance | stay in $qa
```

On Diagnosis, prefer a short answer. You may omit empty fields. `保护了什么` describes the QA portion as `QA 阶段只诊断，未改文件`; report any separately authorized dev edits accurately. `下一步` is `stop` only when no other requested work remains. `残留风险` names what is still unprotected; it is not a todo. Do not report coverage work as done.

On Contract or Coverage, fill the template. `下一步` is `stop` when the asked slice is protected and no other requested work remains.

If you did not understand the business well enough to fill `业务理解` and `用户怎么用`, do not report coverage work as done.
