# Animation

Load this reference for meaningful motion work: micro-interactions, enter/exit animations, gesture-driven UI, and animation audits or improvements. It covers technique — durations, easing curves, springs, choreography — plus an audit checklist and vocabulary for precise instructions. For whether animation fits the visual direction at all, see design-direction.md; for state, accessibility, and delivery gates, see quality.md.

## Core Motion Parameters

### Duration

UI animations stay under 300ms. Perceived speed matters as much as actual speed: ease-out at 200ms *feels* faster than ease-in at 200ms; a fast spinner makes loading feel faster even at identical load time.

| Interaction class | Duration |
| --- | --- |
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| Marketing / explanatory | Can be longer |

- Make tooltips instant after the first one opens (skip delay + skip animation).
- Asymmetric timing: slow where the user is deciding (hold-to-confirm fill: 2s linear), fast where the system responds (release: 200ms ease-out). Exits typically faster than entrances.
- Frequency shortens duration: the more often an animation is seen, the shorter and subtler it should be.

### Easing

Decision order:

- Entering or exiting → **`ease-out`** (starts fast, feels responsive)
- Moving / morphing on screen → **`ease-in-out`**
- Hover / color change → **`ease`**
- Constant motion (marquee, progress, hold-to-confirm fill) → **`linear`**
- Default → **`ease-out`**

Never use `ease-in` on UI — it starts slow, delaying the exact moment the user is watching. Built-in CSS easings are too weak for deliberate motion; define strong custom curves as tokens:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* strong ease-out for UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* strong ease-in-out for on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS-like drawer curve */
```

- Mirror the easing on reversible transitions (inverse cubic-bézier control points) so the return path matches the outbound path.
- Source curves from easing.dev or easings.co rather than hand-rolling them.

### Springs

Springs have no fixed duration — they settle from physics parameters, and they carry velocity when interrupted (keyframes restart from zero). Use for: drags with momentum, interruptible gestures, "alive" elements, decorative mouse-tracking.

```js
// Apple-style — recommended, easier to reason about
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Traditional physics — more control
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

| Interaction | Damping | Response (s) |
| --- | --- | --- |
| Default UI | 1.0 (critically damped, no overshoot) | 0.3–0.4 |
| Move / reposition | 1.0 | 0.4 |
| Rotation | 0.8 | 0.4 |
| Drawer / sheet / flick release | ~0.8 (slight bounce) | 0.3 |

- Keep bounce subtle (0.1–0.3) and reserve it for momentum-driven or playful interactions. Overshoot on a menu that just faded in feels wrong; overshoot on a flicked card feels right.
- Interrupt cleanly: always animate from the presentation (live on-screen) value, never the target. On a reversal, blend velocity through the re-target — hard-cutting creates a "brick wall."
- Velocity handoff: pass the gesture's release velocity as the spring's initial velocity so there is no seam between drag and animation.
- Momentum projection: don't snap from the release point — project the resting position (`current + (v/1000)·d/(1−d)`, d ≈ 0.998), then snap to the nearest target.
- Interpolate mouse-linked values with `useSpring` instead of tying them 1:1 to cursor position — but only when the motion is decorative.

### Choreography

- Stagger group entrances 30–80ms per item; longer feels slow. Stagger is decorative — never block interaction while it plays.
- Enter and exit along the same path (a panel sliding in from the right dismisses to the right), anchored to the trigger (`transform-origin` at the trigger; modals exempt, keep centered).
- Orchestrate related changes so they read as one coordinated motion; intermediate frames should telegraph the outcome, not interpolate blindly.
- Materialize glass surfaces instead of just fading them: animate blur + scale together on enter/exit.

## Where to Animate — and Where Not To

Every animation must answer "why does this animate?" Valid purposes: feedback, spatial continuity, state indication, preventing a jarring change, explanation, and delight (rare moments only). "It looks cool" on a frequently-seen element is not valid.

### Frequency gate (run first)

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, command palette, core nav) | No animation. Ever. |
| Tens of times/day (hover states, list navigation, frequent toggles) | None, or near-imperceptible |
| Occasional (modals, drawers, toasts, settings) | Standard animation |
| Rare / first-time (onboarding, empty states, success, celebration) | Delight budget lives here |

### Animate (high-conviction seams)

- **Feedback gaps**: pressable elements with no `:active` → `transform: scale(0.97)`, `transition: transform 160ms ease-out` (subtle: 0.95–0.98). Destructive one-click actions → hold-to-confirm fill.
- **Teleporting state**: conditional renders, route content, accordions that snap, list adds/removes → fade/scale entrance from `scale(0.95–0.97)` + `opacity: 0`, ease-out, with a matching exit. `@starting-style` for entry without JS.
- **Missing spatial story**: panels/popovers/menus appearing with no link to their trigger → scale in from the trigger's origin. Dismissable surfaces → symmetric exit paths, `translateY(100%)` percentages, not hardcoded pixels.
- **Group entrances**: a grid/list that pops in all at once on an occasionally-seen page → 30–80ms stagger.
- **Gesture seams**: draggable/swipeable elements that snap with no physics → springs, velocity-based dismissal, rubber-banding at boundaries instead of hard stops.
- **Delight moments**: rare, high-emotion moments rendered flat — first-run, empty states, success, celebration. The only places bounce and longer beats are welcome.

### Do NOT animate

- Keyboard-initiated actions — command palettes, shortcuts, focus jumps. Raycast has no open/close animation; that is the correct experience.
- Functional data the user is reading or acting on (a chart in a banking app). Decoration hinders comprehension.
- High-frequency list items, hover states, and toggles — delete or reduce to near-imperceptible.
- Ambient/looping motion anywhere outside marketing or delight moments.
- Anything that only "works" as a slow, showy animation — it fails the budget.

## Audit Checklist

Run category by category over the codebase. Severity: **HIGH** = feel-breaking, **MEDIUM** = noticeably off, **LOW** = polish.

| Category | Check |
| --- | --- |
| Purpose & frequency | Every animation can name a valid purpose; none on keyboard or 100+/day actions; high-frequency motion deleted or minimized |
| Easing & duration | No `ease-in` on UI; strong custom curves, not weak built-ins; UI under 300ms; tooltips instant after the first |
| Physicality & origin | No `scale(0)` (use `scale(0.9–0.97)` + opacity); popovers/dropdowns/tooltips scale from their trigger; modals centered; pressables have press feedback |
| Interruptibility | Rapidly-triggered or reversible motion uses transitions/springs, not keyframes; gestures carry velocity; asymmetric enter/exit timing |
| Performance | Only `transform`/`opacity` animated; no `transition: all` or layout properties; Framer Motion uses full `transform` strings, not `x`/`y` shorthand, on busy pages; no parent CSS variables driving child transforms |
| Accessibility | `prefers-reduced-motion` handled (gentler, not zero); hover motion gated behind `(hover: hover) and (pointer: fine)` |
| Cohesion & tokens | Curves/durations live as shared tokens, not hand-typed duplicates; motion matches product personality; group entrances staggered; double-exposing crossfades blur-masked |
| Missed opportunities | Teleporting state, spatially disconnected surfaces, flat rare moments — reported separately, a handful at most |

Fix-preference order when proposing changes: delete → reduce → fix easing → fix origin/physicality → make interruptible → move to GPU → asymmetric timing → polish (blur masks, stagger, `@starting-style`, springs) → accessibility & cohesion.

Useful greps: `transition: all`, `ease-in`, `scale(0)`, `@keyframes` near toast/toggle code, `transform-origin`, `prefers-reduced-motion`, `setProperty('--`, `animate={{ x`.

When feel can't be judged from code alone, say so — recommend slow-motion playback (2–5× duration or DevTools Animations panel at 10%), frame-by-frame stepping, real-device testing for gestures, and a fresh-eyes pass the next day.

## Anti-patterns

| Anti-pattern | Problem | Fix |
| --- | --- | --- |
| `transition: all` | Animates unintended properties off-GPU | Name exact properties: `transition: transform 200ms ease-out` |
| `ease-in` on UI | Delays the moment the user watches most | `ease-out` or a strong custom curve |
| `scale(0)` entrance | Comes from nowhere; nothing in the real world does | `scale(0.95)` + `opacity: 0` |
| Duration > 300ms on a UI element | Feels slow and disconnected | Cut to the band for its class |
| Animating layout properties (`width`, `height`, `margin`, `top`, `left`) | Layout + paint every frame, jank | `transform`/`opacity` only |
| `transform-origin: center` on a popover | Ignores the trigger relationship | Origin at the trigger; modals stay centered |
| Keyframes on toasts/toggles | Restart from zero on rapid retrigger | CSS transitions or springs |
| Symmetric enter/exit timing | Release feels as slow as the deliberate press | Slow the deciding phase, snap the response |
| Framer Motion `x`/`y`/`scale` shorthand under load | Main-thread rAF, drops frames | Full `transform` string |
| CSS variable on a parent driving child transforms | Style recalc storm across all children | Set `transform` on the element directly |
| Gratuitous ambient/looping motion on functional UI | Distraction, battery, vestibular risk | Delete; keep loops to marketing/delight |
| Exit along a different path than entry | User loses the spatial story | Symmetric paths, mirrored easing |
| Distance-only dismissal threshold | Flicks don't register | Velocity check: `abs(distance)/elapsedMs > ~0.11` |
| Hard stops at drag boundaries | Reads as "frozen" | Rubber-banding: progressive resistance |
| Everything-at-once group entrance | Flat, no choreography | 30–80ms stagger, decorative and non-blocking |
| Crossfade that double-exposes two states | Reads as two objects swapping | `filter: blur(2px)` bridge during the transition (keep < 20px — heavy blur is expensive, especially Safari) |
| No `:active` on pressable elements | Interface feels dead | `scale(0.97)` on press, 160ms ease-out |
| Feedback only at gesture end | Drag feels disconnected | Continuous 1:1 tracking from pointer-down |

## Vocabulary

Names for precise implementation instructions. Each row is a pattern, not a spec.

| Pattern | When to use |
| --- | --- |
| Scale in / Pop in | Element appears; pop adds a slight overshoot for a bouncy landing |
| Reveal | Content uncovered via clip-path or mask instead of fading in |
| Enter / Exit | The animation an element plays when added/removed — always define both |
| Stagger | Multiple items enter together; small delay per item |
| Origin-aware animation | Popover/menu grows from its trigger, not its own center |
| Continuity transition | State change that keeps the user oriented by visually connecting before/after (exit continuity) |
| Shared element transition | An element travels between positions (thumbnail → card) |
| Layout animation | A size/position change animates to the new spot instead of snapping |
| Direction-aware transition | Forward navigation slides one way, back slides the opposite |
| Scroll reveal | Element fades/slides in as it enters the viewport |
| Scroll-driven animation | Animation progress tied directly to scroll position |
| Skeleton / shimmer | Placeholder with a moving sheen while content loads |
| Number ticker | Digits roll or count to a new value; use tabular numbers so widths don't shift |
| Text morph | Text animates character-by-character on change, drawing attention to the new value |
| Hold to confirm | Progress fill while the user holds a button (destructive actions) |
| Drag to reorder | Item moved within a list while others shift to make room |
| Swipe to dismiss | Drag a surface off-screen to close it (toast, sheet, drawer) |
| Rubber-banding | Resistance and snap-back at a scroll or drag boundary |
| Follow-through | Parts of an element keep settling after the main motion stops, adding weight |
| Anticipation | A small wind-up opposite the move, hinting at what's coming |
| Pulse | Gentle repeating scale/opacity change to draw attention — sparingly |
| Line drawing | SVG path draws itself in (onboarding, empty states) |
| Crossfade | One element fades out as another fades in, in the same spot |

## Accessibility

- `prefers-reduced-motion: reduce` → replace slides, springs, and parallax with short opacity cross-fades; drop transform-based motion and overshoot. Keep opacity/color transitions that aid comprehension — reduced motion is gentler, not zero, and feedback (press states, state changes, errors) must still communicate.
- In JS, branch transform values on `useReducedMotion()` rather than relying on CSS alone.
- Gate hover motion behind `@media (hover: hover) and (pointer: fine)` — touch fires false hovers on tap.
- `prefers-reduced-transparency: reduce` → make translucent surfaces solid: drop the blur, raise background opacity.
- Avoid full-viewport moving backgrounds and slow loops (~0.2 Hz, one cycle per 5s) — prime vestibular triggers.

```css
@media (prefers-reduced-motion: reduce) {
  .sheet { transition: opacity 200ms ease; transform: none !important; }
}
```

## Motion Library Selection

Only add a library when it removes concrete complexity (see quality.md) — plain CSS transitions are the right tool for a simple hover or fade.

| Task | Use |
| --- | --- |
| Springs, layout animations, enter/exit, gesture-driven values | [motion](https://motion.dev) (Framer Motion) |
| Toasts / notifications | [Sonner](https://sonner.emilkowal.ski) |
| Animated numbers (counters, prices, stats) | [NumberFlow](https://number-flow.barvian.me) |
| Drag and drop | [dnd kit](https://dndkit.com) |
| Unstyled accessible primitives (dialog, popover, menu, select) | [base-ui](https://base-ui.com) |

- CSS (and WAAPI) beat rAF-based JS under load: CSS for predetermined motion, JS/springs for dynamic, interruptible, gesture-driven motion.
- Hand-built toasts or div-based dropdowns with manual focus handling → use Sonner / base-ui instead.

---

Distilled from [emilkowalski/skills](https://github.com/emilkowalski/skills) (MIT license).
