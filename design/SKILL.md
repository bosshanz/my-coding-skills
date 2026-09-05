---
name: design
description: "UI interaction design, visual direction, frontend quality, and motion guidance."
when_to_use: "Use when creating or reshaping meaningful UI; designing or improving user flows, usability, information architecture, state transitions, feedback, recovery, or AI-native interactions; or implementing and auditing animation and micro-interactions. Establishes how users understand and control the system before visual polish and coding. Do not use for backend-only work, trivial CSS tweaks, independent business QA, or final acceptance."
argument-hint: "[界面 / 流程 | UI or flow]"
---

# Design

## Purpose

Use this Skill as the design authority for UI work:

1. **Interaction direction**: decide how users understand the system, complete the main job, receive truthful feedback, stay in control, and recover from interruption or failure.
2. **Visual direction**: establish purpose, tone, palette, typography, layout, and a signature element before visual implementation.
3. **Implementation quality**: apply frontend engineering, accessibility, responsiveness, performance, and verification gates while building.
4. **Motion**: design, implement, review, or improve animation and micro-interactions with concrete technique, not just taste.

The product brief, existing design system, and explicit user constraints always take precedence over the guidance in this Skill. If the product intent is still being shaped, send the work to `$clarify` instead of inventing a product brief.

## When To Use

Invoke for meaningful UI creation or visible reshaping; interaction-flow, usability, information-architecture, state-transition, feedback, recovery, or AI-native interaction work; animation work or audits; and visual-quality reviews. `dev` invokes this Skill for frontend-heavy or interaction-heavy implementation; users may also invoke it directly for design work before implementation.

Do not use for backend-only work, data pipelines, settled trivial CSS tweaks, independent business or real-usage QA, or final acceptance. If the product intent, target user, or job is still materially unclear, return to `$clarify`. If the interaction is already defined and the request is ordinary implementation, `$dev` owns delivery and loads this Skill only as needed.

## Reference Loading Policy

Load the smallest reference set that materially improves the work.

| Reference | Load when |
| --- | --- |
| `references/interaction.md` | Designing or auditing product interaction: user flows, information architecture, state transitions, feedback and control, async work, recovery, input ergonomics, or AI-native behavior. Load before visual direction for product UI. |
| `references/design-direction.md` | New UI or meaningful visual reshaping where visual direction, typography, layout, signature element, copy, or design self-critique matters. Load after interaction for product UI; load first for primarily visual or marketing work. |
| `references/quality.md` | Frontend engineering, UI states, accessibility, responsiveness, visual quality, frontend performance, and verification gates. Load during implementation after the relevant design direction is clear. |
| `references/animation.md` | Implementing, reviewing, or improving animation and micro-interactions, or deciding where motion helps and where it does not. |

## Workflow

Treat design commitments as working decisions, not automatic approval gates. For an implementation request, choose routine details from the brief and existing system and continue building. For a design-only request, deliver the requested proposal and stop. Ask only when a missing product choice materially changes the result; if an instruction requires a pause, identify its exact file and wording.

### Product UI Or Interaction Work

1. Inspect the current behavior and repository constraints before proposing a new flow. A static screenshot does not prove how an interaction works.
2. Load `references/interaction.md`. Make a proportional interaction commitment: user and job, interaction thesis, primary objects and actions, main flow, critical states and transitions, feedback and control, recovery, and input model.
3. Critique the interaction before visual polish: look for unnecessary effort, ambiguity, dead ends, hidden consequences, false progress, destructive actions, latency gaps, lost work, and broken interruption or resume behavior.
4. If the task creates or visibly reshapes UI, load `references/design-direction.md` and make the visual hierarchy reinforce the interaction hierarchy. Preserve the existing visual system for interaction-only repairs unless changing it solves a demonstrated problem.
5. Load `references/quality.md` during implementation and verify representative interaction scenarios, not only component appearance.
6. Load `references/animation.md` only when motion materially improves feedback, spatial continuity, state communication, explanation, or rare delight.

### Primarily Visual Or Marketing Work

1. Load `references/design-direction.md` and follow its brainstorm → explore → plan → critique → build → critique process.
2. Commit to purpose, tone, palette, typography, layout, and a signature element before coding.
3. Load `references/interaction.md` only when the page contains a meaningful journey, tool, form, or stateful interactive moment.
4. Load `references/quality.md` during implementation and pass the applicable accessibility, responsive, state, and performance gates.

### Motion Work

1. Load `references/animation.md` before writing animation code.
2. Pass the frequency and purpose gate before adding motion, and name where animation should stay absent.
3. For audit or improvement requests, run the `animation.md` audit checklist over the codebase and rank findings by severity.

## Delivery Format

Follow the calling context's default language (Chinese when invoked from `dev`). Keep design and motion terminology, CSS properties, and library names in their original language.

For interaction work, report proportionally:

- **Interaction direction**: user, job, context, and the chosen interaction thesis.
- **Main flow**: primary path, important branches, and where the user can leave, cancel, undo, or resume.
- **State and recovery**: critical transitions, async feedback, error handling, preserved work, and truthful completion.
- **Input and ergonomics**: keyboard, pointer, touch, focus, and high-frequency behavior as applicable.
- **Verification**: scenarios checked, evidence, and known limits.

For combined UI work, add the visual direction and implementation-quality evidence. Keep artifacts proportional: a small component does not need a full journey map, while a multi-step or high-consequence flow should not be reduced to a styling plan.

## Source Inspiration

- `design-direction.md` and `quality.md`: Anthropic's `frontend-design` skill, Apache-2.0 (see `references/anthropic-frontend-design-LICENSE.txt`).
- `animation.md`: distilled from Emil Kowalski's skills, MIT license: https://github.com/emilkowalski/skills
