# Behavior Evidence Examples

Read only the scenario relevant to the requested check. These are examples for choosing evidence, not a mandatory suite or authorization to exercise production effects. Use the host's available browser, CLI, logs, and isolated test storage; no specific browser package is required. Select affected journeys from the request and changed behavior, using the diff when helpful.

## Match The Claim To The Evidence

| Claim | Relevant evidence | Insufficient alone |
| --- | --- | --- |
| A user can complete the flow | Execute the affected steps and inspect the resulting authoritative state | Screenshot or success toast |
| A retry cannot duplicate an effect | Duplicate/concurrent attempts through the enforcing mechanism, then count durable effects | Mocked handler returning twice |
| A fix resolves the reported bug | Same reproducer and conditions before/after, when feasible | An unrelated passing suite |
| A change is ready for acceptance | Agreed criteria and required checks at the relevant revision | Test count or reviewer confidence |

Reuse evidence when its revision, configuration, inputs, and dependencies still apply. Rerun when those changed or freshness is material; no need to rerun every command merely to repeat a status. Record a minimal reproduction, expected/observed effect, and evidence location. Never invent a defect to fill a report quota.

## Response Lost After Payment

- **Trigger:** in a provider sandbox or controlled test double, commit a payment but drop its response; retry the same operation.
- **Inspect:** the provider operation identity, local order/payment record, and reconciliation result. Confirm one charge and eventual truthful local state. A local database count cannot prove provider-side uniqueness.
- **Countercheck:** a genuinely new operation follows the intended business rule; idempotency must not silently suppress unrelated work.
- **Limit:** a test double proves local handling only. Without provider evidence, report that boundary as unverified. Do not create real charges for a diagnosis.

## Saved Draft After Refresh Or Restart

- **Trigger:** edit a draft, wait for the claimed save acknowledgment, then reload or restart at the boundary the product promises to survive.
- **Inspect:** the restored content and the actual persistence layer. Repeat an interrupted save if recovery is in scope. Distinguish committed work from unsaved input according to the product contract.
- **Countercheck:** use a new edit so old cached content cannot masquerade as a successful save.
- **Limit:** a DOM snapshot before reload does not establish durability; browser reload does not establish server-process recovery.

## Permission Or Account Switch

- **Trigger:** with two authorized test accounts, load a resource as A, switch to B, then attempt the affected read or action using A's known ID.
- **Inspect:** server authorization, cache/account scope, visible data, and durable rows. Verify a permitted B operation still succeeds.
- **Expected:** use the product's stated denial and draft-isolation behavior; do not invent a universal rule that all drafts must survive or be erased on account switch.
- **Limit:** hiding a button is not authorization proof. Never access unrelated users' data to construct the test.

## Partial Batch Completion

- **Trigger:** let two test items succeed and one fail; retry according to the advertised contract.
- **Inspect:** per-item results, operation identities, retained user context, and final effects. If the contract retries failed items, successful items must not be repeated. If the batch is atomic, assert rollback instead of assuming partial success is valid.
- **Countercheck:** refresh or revisit the operation to ensure the visible result agrees with durable progress.
- **Limit:** browser observations prove interaction behavior; storage/provider evidence establishes duplicate or missing effects.

## Sources And Limits

The evidence mapping draws on [Superpowers verification-before-completion](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md); affected-flow exploration and reproducible browser evidence are informed by [gstack QA](https://github.com/garrytan/gstack/blob/main/docs/skills.md#qa). These locally written examples preserve this library's scope and host-tool boundaries. They are not claims that these scenarios have been executed or that a Skill outperforms the host baseline.
