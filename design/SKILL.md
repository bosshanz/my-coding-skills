---
name: design
description: "UI design direction, visual quality, and motion/animation guidance. Use when creating meaningful new UI or reshaping existing UI, when implementing, reviewing, or auditing animations and micro-interactions, or when invoked by `dev` for frontend design work. Establishes aesthetic direction before coding and provides engineering and verification gates during implementation. Do not use for backend-only work or trivial CSS tweaks."
---

# Design

## Purpose

Use this Skill as the design authority for UI work:

1. **New UI or reshape**: establish the visual direction before coding — purpose, tone, palette, typography, layout, and a signature element.
2. **Implementation quality**: apply frontend engineering, accessibility, and verification gates while building.
3. **Motion**: design, implement, review, or improve animation and micro-interactions with concrete technique, not just taste.

The product brief, existing design system, and explicit user constraints always take precedence over the guidance in this Skill.

## When To Use

Invoke for meaningful UI creation or visible UI reshaping, for animation work, animation audits, or visual-quality reviews. `dev` invokes this Skill for frontend-heavy tasks; users may also invoke it directly.

Do not use for backend-only work, data pipelines, or trivial CSS tweaks.

## Reference Loading Policy

Load the smallest reference set that materially improves the work.

| Reference | Load when |
| --- | --- |
| `references/design-direction.md` | New UI or meaningful UI reshaping where visual direction, typography, layout, signature element, copy, or design self-critique matters. Load first. |
| `references/quality.md` | Frontend engineering, interaction states, accessibility, responsiveness, visual quality, frontend performance, and verification gates. Load after design-direction for meaningful UI. |
| `references/animation.md` | Implementing, reviewing, or improving animation and micro-interactions, or deciding where motion helps and where it does not. |

## Workflow

### New UI Or Reshape

1. Load `references/design-direction.md` and follow its brainstorm → explore → plan → critique → build → critique process.
2. Commit to a design direction before coding: purpose, tone, palette, typography, layout, signature element.
3. Load `references/quality.md` during implementation and pass its verification gates: loading, empty, error, success, focus, responsive, and reduced-motion states.

### Motion Work

1. Load `references/animation.md` before writing animation code.
2. Pass the frequency and purpose gate before adding motion, and name where animation should stay absent.
3. For audit or improvement requests, run the `animation.md` audit checklist over the codebase and rank findings by severity.

## Delivery Format

Follow the calling context's default language (Chinese when invoked from `dev`). Keep design and motion terminology, CSS properties, and library names in their original language.

## Source Inspiration

- `design-direction.md` and `quality.md`: Anthropic's `frontend-design` skill, Apache-2.0 (see `references/anthropic-frontend-design-LICENSE.txt`).
- `animation.md`: distilled from Emil Kowalski's skills, MIT license: https://github.com/emilkowalski/skills
