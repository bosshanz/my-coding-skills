# Frontend Quality

## When To Use

Use this reference for UI implementation, frontend architecture, accessibility, frontend performance, visual polish, public pages, dashboards, and interaction-heavy components.

## Frontend Aesthetic Gate

- Choose a clear aesthetic direction before coding UI: purpose, audience, product tone, constraints, and differentiation.
- Avoid generic AI-looking UI: predictable layouts, timid palettes, overused fonts, context-free gradients, and template-like component arrangements.
- Define typography, color roles, spacing rhythm, motion, hierarchy, and visual details intentionally instead of relying on defaults.
- Match visual intensity to product context: internal tools favor clarity, density, and predictability; public or marketing pages can be more distinctive and expressive.
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

## Verification Checklist

Before delivery, use the smallest applicable set:

- Component/unit test for behavior-heavy components.
- Interaction check for keyboard flow, focus, and visible error states.
- Visual check for responsive layout and key UI states.
- Accessibility check with available project tools or manual semantic review.
- Performance check for pages where load, interaction latency, or layout shift matters.

## Source Inspirations

This reference is a high-level, localized extraction inspired by:

- Anthropic `frontend-design`: distinctive, production-grade interfaces and avoiding generic AI aesthetics. Source: https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
- PeterHdd `engineering-frontend-developer`: frontend architecture, layout, accessibility, Core Web Vitals, typed API clients, and verification gates. Source: https://github.com/PeterHdd/agent-skills/tree/main/skills/engineering-frontend-developer
