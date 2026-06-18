# Frontend Design And Quality

## When To Use

Use this reference for UI implementation, frontend design, frontend architecture, accessibility, frontend performance, visual polish, public pages, dashboards, and interaction-heavy components. This is the Frontend Design layer inside `dev`; load it before coding meaningful UI, not only at the final polish step.

## Frontend Design Gate

Before coding a meaningful UI, make a small design commitment:

- Purpose: what job does this interface do, and who uses it?
- Tone: what should it feel like in this product context: utilitarian, editorial, playful, premium, dense, calm, technical, or something else?
- Constraints: framework, existing design system, accessibility, performance, responsive targets, and content shape.
- Differentiation: what makes this screen specific to this product instead of a generic template?

Do not over-design internal tools, but do make even internal tools feel intentional.

## Frontend Aesthetic Gate

- Choose a clear aesthetic direction before coding UI: purpose, audience, product tone, constraints, differentiation, and one memorable design idea when appropriate.
- Avoid generic AI-looking UI: predictable layouts, timid palettes, overused fonts, context-free gradients, and template-like component arrangements.
- Define typography, color roles, spacing rhythm, motion, hierarchy, and visual details intentionally instead of relying on defaults.
- Match visual intensity to product context: internal tools favor clarity, density, and predictability; public or marketing pages can be more distinctive and expressive; dashboards need hierarchy and trust more than decoration.
- Make the interface feel designed for this product and task flow, not generated from a default template.
- Align with the existing design language when the repository already has tokens, components, or brand rules.

## UI State Checklist

Cover the states users actually encounter:

- Loading and optimistic/pending states.
- Empty states with clear next action.
- Error states with visible recovery path.
- Success or completion feedback.
- Hover, active, disabled, focus, and selected states.
- Responsive behavior across the target breakpoints.
- Edge cases: long text, missing images, large numbers, permission-limited data, and slow network.

## Frontend Engineering Gate

- Use CSS Grid for two-dimensional page layouts and Flexbox for one-dimensional alignment.
- Avoid absolute positioning for primary layout; use it only for deliberate overlays, badges, and local effects.
- Centralize backend calls in a typed API client layer with auth, error handling, retry policy, and response normalization when the project structure supports it.
- Prefer project-native framework patterns before introducing new routing, state, build, or data-fetching tools.
- Keep component APIs explicit: props, events/callbacks, slots/children, loading states, disabled states, and validation state.
- For filters, search, pagination, tabs, and sort state, prefer URL state when shareability, refresh persistence, or browser navigation matters.
- Do not introduce a component library, animation system, or state manager unless it removes concrete complexity.

## Accessibility Gate

- Ensure interactive elements are keyboard-operable and have visible focus states.
- Use semantic HTML first; add ARIA only when native semantics are insufficient.
- For forms, connect labels and inputs, make validation errors visible, and use accessible descriptions when needed.
- For modals, drawers, dropdowns, and popovers, manage focus while open and restore focus to the trigger on close.
- Ensure destructive actions are explicit, confirmable when needed, and recoverable when possible.
- Verify color contrast, hit target size, and screen-reader-friendly names for critical controls.

## Frontend Performance Gate

Use this only when the page is user-facing, high-traffic, slow, or performance-sensitive:

- Check Core Web Vitals risk: LCP, INP, and CLS.
- Avoid unnecessary re-renders, excessive client-side state, and duplicated network requests.
- Split code by route or heavy feature when the initial bundle becomes visibly expensive.
- Specify image dimensions, use appropriate formats, and lazy-load below-the-fold media.
- Prefer server-side or build-time data loading when it clearly improves first render and fits the framework.
- Treat hydration errors as correctness bugs: compare server/client markup, browser-only APIs, time/random values, and conditional rendering.

## Frontend Delivery Template

For UI-heavy delivery, include:

- Design direction: the chosen tone and why it fits.
- Implementation: components, data flow, and states covered.
- Accessibility: keyboard, focus, semantics, form errors, and contrast considerations.
- Responsiveness: target breakpoints or layout behavior.
- Verification: tests, visual checks, manual interaction checks, and known limits.

## Verification Checklist

Before delivery, use the smallest applicable set:

- Component/unit test for behavior-heavy components.
- Interaction check for keyboard flow, focus, and visible error states.
- Visual check for responsive layout and key UI states.
- Accessibility check with available project tools or manual semantic review.
- Performance check for pages where load, interaction latency, or layout shift matters.

## Source Inspirations

This reference is a high-level, localized extraction inspired by:

- Anthropic `frontend-design`: deliberate aesthetic direction, production-grade UI, and avoiding generic AI aesthetics. Source: https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
- PeterHdd `engineering-frontend-developer`: frontend architecture, layout, accessibility, Core Web Vitals, typed API clients, and verification gates. Source: https://github.com/PeterHdd/agent-skills/tree/main/skills/engineering-frontend-developer

## Frontend Task Classification

Before implementing UI, classify the task so the checklist stays useful instead of decorative:

| Task type | Focus |
| --- | --- |
| Internal CRUD/admin | Density, keyboard flow, validation, errors, permission states, bulk actions. |
| Dashboard/analytics | Information hierarchy, filtering, loading skeletons, chart empty states, responsive grid. |
| Public/marketing page | Distinct aesthetic direction, typography, motion restraint, content hierarchy, performance. |
| Component/library work | API clarity, controlled/uncontrolled behavior, accessibility states, examples, regression tests. |
| Frontend architecture | Data fetching boundary, route ownership, typed API client, state placement, bundle impact. |

## State And Data Ownership

- Keep server data, URL state, form draft state, and ephemeral UI state separate.
- Prefer URL state for filters, search, pagination, sort, selected tabs, and shareable dashboard views.
- Prefer local component state for temporary UI affordances such as open menus, hover details, and non-shareable drafts.
- Use a shared store only when multiple distant components need the same mutable client state.
- Keep backend calls behind the project’s API/client layer; avoid scattering `fetch` or raw SDK calls across components.

## Accessibility Interaction Patterns

- Buttons perform actions; links navigate. Do not swap semantics for styling convenience.
- Modals and drawers must move focus inside on open, trap focus while open, close with Escape when safe, and restore focus to the trigger.
- Dropdowns, comboboxes, tabs, and menus should follow native or established project patterns for arrow keys and selection.
- Form validation should show visible errors, link errors to fields, and preserve user input after failed submission.
- Loading states should not remove important context or cause large layout shifts.

## Performance Debugging Paths

Use these targeted paths instead of generic “optimize performance” work:

- Slow first render: inspect data waterfall, server/client rendering split, image size, blocking scripts, and route-level code splitting.
- Slow interaction: inspect expensive renders, unnecessary global state updates, synchronous validation, and oversized lists.
- Layout shift: check missing image dimensions, late-loading fonts, conditional banners, and unstable skeleton heights.
- Bundle growth: identify newly imported libraries, route leakage, icon imports, chart libraries, editors, and date/time packages.
- Hydration mismatch: compare server/client branches, browser-only APIs, non-deterministic time/random values, and locale formatting.

## UI Delivery Template

For non-trivial frontend delivery, report:

- Aesthetic direction or reason for using existing style.
- Main user flow and affected states.
- Accessibility checks performed.
- Performance risk and whether it was tested.
- Responsive behavior checked.
- Known gaps or follow-up.
