# Focused Debugging And Test-First Guidance

Reference for an unclear or resistant bug, or a requested test-first approach. Use within the current task and its existing authorization.

## Diagnose Before Repeating Edits

- Read the full failure and trace the actual path through inputs, callers, state, and configuration. Compare a nearby working path and relevant recent changes.
- Build the smallest feedback loop capable of exposing the reported symptom: an existing test, command, trace replay, or local probe. Confirm it can fail for the original defect before treating a pass as evidence of repair.
- Form a falsifiable hypothesis, state the observation that would contradict it, and isolate variables so results can distinguish causes. Independent read-only investigations can run together when delegation is authorized; avoid overlapping changes that obscure attribution.
- Compare the original and repaired behavior with the same reproducer and relevant conditions. Preserve enough input, environment, and result evidence to tell a root-cause repair from a symptom that merely disappeared. Use an isolated baseline when needed; do not revert others' work or weaken the check to manufacture a pass.
- When a repair fails or evidence contradicts the hypothesis, re-examine assumptions before repeating edits. Investigate rather than introducing an automatic permission pause.
- If reproduction is unavailable, state the uncertainty. Inspect existing logs and use reversible local instrumentation within scope; ask only for missing evidence or access that is necessary. Remove temporary diagnostics after use.

## Test-First When Useful

- Prefer one observable behavior per cycle: demonstrate failure, make the smallest repair, then refactor if needed. Do not prewrite a large batch of imagined tests.
- Choose a check that still contains the mechanism causing the failure. Do not delete working code or add ceremony to enforce test-first ordering.

Once the cause is addressed, complete the relevant project checks and report the result.

## Source Inspiration

Focused adaptation of Superpowers' systematic debugging and Matt Pocock's diagnosing-bugs / TDD patterns:
- https://github.com/obra/superpowers
- https://github.com/mattpocock/skills
