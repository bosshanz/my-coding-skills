---
name: design
description: "UI interaction, visual direction, and motion references for meaningful design work. Use for requested interface design, flow redesign, visual reshaping, or animation work."
when_to_use: "Use when a task needs concrete interaction or visual decisions, or a design critique. Ordinary implementation of an established design, trivial CSS edits, backend work, and business acceptance need no design workflow."
argument-hint: "[界面 / 流程 / 动效 | UI, flow, or motion]"
---

# Design

Use the references that add concrete information to the requested design decision. The user's brief, existing design system, platform conventions, and accessibility needs take precedence over stylistic recommendations.

| Reference | Relevant work |
| --- | --- |
| `references/interaction.md` | Behavior and value before packaging, stateful product flows, object identity, async feedback, interruption, preserved work, and recovery. |
| `references/design-direction.md` | Visual exploration, typography, palette, layout, and product-specific copy. |
| `references/quality.md` | Frontend state handling, accessibility, responsive behavior, and performance. |
| `references/animation.md` | Motion timing, curves, springs, gestures, interruption, and reduced-motion behavior. |

Inspect the existing experience before changing it. Resolve critical flow and state behavior before visual polish when both are in scope. Read only the reference needed for the affected decision; a meaningful UI task does not require loading every file.

For implementation requests, choose routine details from the brief and existing system, then build and verify. For design-only requests, provide the proposal. Use screenshots for appearance and actual interaction evidence for state, persistence, and recovery. No separate design approval or fixed report is required.

Keep technical implementation details out of product copy unless they help its user decide or act. Explain the chosen direction and meaningful verification in the caller's language, proportionally to the task.

## Sources

`design-direction.md` is adapted from pinned third-party Apache-2.0 content; its license is in `references/anthropic-frontend-design-LICENSE.txt`. `animation.md` is adapted from Emil Kowalski's MIT-licensed skills. Preserve attribution when reusing these files.
