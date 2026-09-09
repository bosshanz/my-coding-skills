# Ablation For A Concrete Decision

Load when the user requests an ablation, or when a delivery decision depends on the contribution of an optional rule, prompt section, tool, or component. Ordinary implementation does not require proving every element individually. Use only authorized resources and side effects; this reference does not authorize an external agent, a paid evaluation, or production changes.

## Define What The Comparison Can Decide

- Name the factor, the claimed benefit, and whether the decision is to retain, simplify, remove, or investigate it. State a falsifiable hypothesis and a meaningful change threshold before examining results.
- Choose representative inputs and a fixed behavior-facing verifier. Include the failure cases the factor is supposed to prevent, not only convenient happy paths. A wording check or fixture dry run cannot establish agent behavior.
- Compare quality or failure rate with relevant cost and latency. Keep permission, compatibility, data integrity, and other required constraints in both variants. Do not remove a required safeguard from a live system to measure its value.

## Run A Comparable Baseline And Variant

- Preserve the full baseline and make one variant with only the chosen factor removed or disabled. Use isolated copies/configurations; do not reset a shared checkout or change other agents' work.
- Hold inputs, repository and dependency versions, environment, model/version, settings, tool availability apart from the tested tool, verifier, and comparable budgets as constant as practical. Record uncontrolled differences and any minimal compatibility change needed to keep the variant runnable.
- Start both variants from clean, equivalent state. Do not share conversation history, memory, caches, generated artifacts, or already-fixed fixtures that could reveal another run's result. Control or record run order and warm-up effects when timing matters.
- For nondeterministic behavior, use paired repeated runs on the same cases, matched seeds where supported, and a bounded run budget appropriate to the decision. Retain every attempt, failure, timeout, and aggregate variation; do not rerun only failures until a preferred result appears.
- The evaluator uses the same criteria for both variants. Conceal variant labels from a subjective evaluator where practical. A reviewer or external model still needs applicable authorization; use available deterministic evidence when it is sufficient.

## Interpret Without Overclaiming

- Report each variant, the controlled conditions, cases and repetitions, measured differences and variation, and material limits alongside the decision.
- A degradation supports a contribution under these conditions, not universal necessity. No detected change does not prove uselessness: the sample may miss a rare failure, the effect may be small, or another element may compensate. An improvement likewise needs evidence beyond one favorable run.
- Single-factor removal measures its contribution in this configuration. If interactions could change the decision, consider a small combined comparison within scope instead of claiming independent effects or expanding into an exhaustive matrix.
- If removing the factor makes the system unable to run, record that dependency result; do not equate it with a measured quality benefit. Confounded, noisy, or incomplete comparisons may remain inconclusive.
- Restore temporary setup and integrate a supported change only within the original implementation authorization. An experiment-only request ends with findings; it does not authorize applying the result.

For a requested experiment record, use a compact table such as `variant | conditions | cases/runs | quality/failures | cost/latency | variation/limits`. It is an optional artifact, not a new delivery format.
