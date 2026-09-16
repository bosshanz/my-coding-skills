# Design Direction

Local adaptation: workflow routing has been adjusted to use the current host directly; upstream visual guidance and attribution are retained.

Make deliberate choices about palette, typography, and layout for the actual brief. For an expressive concept, seek a distinct visual identity and take aesthetic risks only when they serve the subject. For an existing product or a repeated-use tool, preserve its identity, native platform conventions, and clarity. Do not invent a client demand for novelty.

## Ground it in the subject

Choose routine visual details from the brief and existing system. Invent a subject only for explicitly open-ended concept work, and state the chosen subject, audience, and page's job. If a missing product choice materially changes the requested result and cannot be inferred from the brief or repository, resolve that choice directly, then resume any already-authorized design or implementation. If there's any information in your memory about the human's preferences, context about what they're building, or designs you've made before – use that as a hint. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the template answer, only use if that's truly the best option.

Typography carries the personality of the page. Choose one typeface family or a deliberately complementary pair according to the content and existing system, and set a clear type scale with intentional weights, widths, and spacing. Use expressive type where the brief calls for it; in dense tools, prioritize legibility, hierarchy, and familiar platform typography.

Structure is information. Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

Use non-user-triggered motion sparingly. Prefer motion that explains a person's action or preserves spatial continuity. A page-load sequence or reveal may suit an expressive brief, but repeated section entrances and ambient effects need a concrete purpose. Respect reduced motion and keep frequent actions immediate.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: brainstorm, explore, plan, critique, build, critique again

For calibration: AI-generated design right now clusters around three looks: (1) a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta accent; (2) a near-black background with a single bright acid-green or vermilion accent; (3) a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns. All three are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. Just like a human designer who's hired, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the human's design brief: create a compact token system with color, type, layout, and signature. Color: describe the palette as 4–6 named hex values. Type: the family or families and their roles; one family may cover headings, body, and data through size and weight. Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Focal point: the content or action that deserves emphasis; an expressive signature is optional. Reuse existing tokens for established products instead of inventing a new palette.

Before coding, check that the design fits the brief and existing system. Revise concrete mismatches, then proceed. Originality is a design consideration, not a prerequisite for implementation or an additional user-approval gate. If the user explicitly requested approval of the design before implementation, wait for that approval. Use the chosen design to guide color, type, and layout decisions.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and a element-based selector like .cta). This can happen often with paddings/margins between sections.

Try to do a lot of this planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element be the one memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Critique your own work as you build, taking screenshots if your environment supports it – a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creators have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand, and therefore easier to use. They are design material, not decoration. Bring the same intentionality to copy that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's side of the screen. Name things by what people control and recognize, never by how the system is built. A person manages notifications, not webhook config. Describe what something does in plain terms rather than selling it. Being specific is always better than being clever.

Use active voice as default. A control should say exactly what happens when it's used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the register conversational and tuned: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each element do exactly one job. A label labels, an example demonstrates, and nothing quietly does double duty.

## Calibration Examples

- **Marketing concept:** a brief about field recording may justify distinctive sound imagery and expressive type. Choose one relevant focal treatment; a generic waveform on every card adds decoration without meaning. Compare the rendered result with the actual subject and copy.
- **Existing admin tool:** preserve its type, controls, and navigation. Improve a partial publish result with per-item status and a clear retry action; a new display font does not solve that task. Check both the rendered hierarchy and the retry behavior.
- **Native desktop workflow:** follow established platform controls and content readability. A memorable hero or elaborate entrance is not a requirement for a settings pane. Inspect focus, resizing, and repeated use as well as appearance.

These examples illustrate choices, not completed user studies. Upstream reference: [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md). Preserve the bundled attribution and license; local adaptations retain host authorization and existing-system precedence.
