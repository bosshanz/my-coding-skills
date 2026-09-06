# Focused Debugging And Test-First Guidance

Load only for an unclear or resistant bug, or an explicit request for systematic debugging / TDD. Ordinary delivery uses the loop in `dev`; this reference adds no plan, design, review, or approval stage. The historical filename is retained for installed references.

## Diagnose Before Repeating Edits

- Read the full failure and trace the actual path through inputs, callers, state, and configuration. Compare a nearby working path and relevant recent changes.
- Build the smallest feedback loop capable of exposing the reported symptom: an existing test, command, trace replay, or local probe. Confirm it can fail for the original defect before treating a pass as evidence of repair.
- Form a falsifiable hypothesis and isolate variables in experiments so results can distinguish causes. Independent read-only investigations can run together; avoid overlapping changes that obscure attribution.
- When a repair fails or evidence contradicts the hypothesis, re-examine assumptions before repeating edits. Investigate rather than introducing an automatic permission pause.
- If reproduction is unavailable, state the uncertainty. Inspect existing logs and use reversible local instrumentation within scope; ask only for missing evidence or access that is necessary. Remove temporary diagnostics after use.

## Test-First When Useful

- Prefer one observable behavior per cycle: demonstrate failure, make the smallest repair, then refactor if needed. Do not prewrite a large batch of imagined tests.
- Evidence selection follows `dev`'s shared rules. Do not delete working code or add ceremony to enforce test-first ordering.

Return to `dev`'s verification and completion conditions after the cause is addressed. Do not rerun an entire workflow from this reference.

## Source Inspiration

Focused adaptation of Superpowers' systematic debugging and Matt Pocock's diagnosing-bugs / TDD patterns:
- https://github.com/obra/superpowers
- https://github.com/mattpocock/skills
