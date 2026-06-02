# Documentation Rules

## Principle

- Write concise documentation that preserves intent, decision, result, and verification.
- Write all plans, design notes, and delivery documents in Chinese unless the user explicitly requests another language.
- Keep code, commands, API names, protocol names, and configuration keys in their original language; keep all explanatory text and diagram titles in Chinese.
- Do not write long narrative notes unless the user asks for depth.
- Add at least one lightweight diagram when documenting architecture or process design. Prefer Mermaid so the diagram stays editable in Markdown.

## Before Implementation

Write a short note when the task is non-trivial, affects architecture, or needs alignment. Include:

- Goal
- Chosen approach
- Key tradeoff or risk
- Verification plan
- Diagram when the topic involves system boundaries, flow, or multi-step process

## During Implementation

Use lightweight review gates instead of heavyweight process artifacts:

- For feature or bug-fix work, prefer test-first when practical: failing test or reproduced failure first, minimal implementation second, cleanup third.
- For debugging, record the root cause evidence before documenting the fix.
- For plans, keep steps small enough to inspect and verify; avoid writing large standalone plan files unless the user wants them.
- For code review, check goal alignment, edge cases, project conventions, test coverage, and documentation impact.

## After Completion

Update the nearest relevant document, issue, task note, or delivery summary. Include:

- What changed
- How it was verified
- Remaining risk or follow-up, if any
- Diagram refresh when the architecture or process changed materially

## Delivery Output Template

Use this structure for final delivery:

- Goal: ...
- Solution: ...
- Implementation: ...
- Verification: ...
- Risk: ...
- Documentation Update: ...

## Verification Layers

State verification in this order when applicable:

- Reproduction or RED check for bugs and behavior changes
- Targeted test or direct functional check
- Broader build, integration, or regression check
- Diff review against requirements and edge cases
- Plain-language acceptance conclusion

## Compact Templates

Use this pre-task template:

- Goal: ...
- Approach: ...
- Risk: ...

Use this post-task template:

- Change: ...
- Verification: ...
- Risk: ...

## Placement

- Prefer updating an existing canonical document over creating a new one.
- Prefer this order for document placement: existing `docs/` page, existing requirement or design doc, existing issue or task note, then a new minimal document only if none of those exist.
- If no obvious document exists, create the smallest sensible note in the repo's existing documentation area.
- Keep entries short enough to scan in under a minute.
