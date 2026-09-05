# Durable Documentation

Load when the requested change makes an existing document stale or the user asks for a durable artifact. This reference does not add a planning, testing, or approval phase to `dev`.

- Update the closest canonical documentation when behavior or a public contract changes. Do not create a separate delivery note merely because implementation is non-trivial.
- Preserve the decision, rationale, observable behavior, and relevant verification. Exclude transient investigation logs unless needed to understand the result.
- For a requested design or architecture document, include the constraints, meaningful alternatives, chosen approach, and remaining uncertainty. Use a diagram only when it clarifies boundaries or flow.
- Write explanatory prose in Chinese by default; preserve code, commands, API names, and configuration keys.
- Prefer an existing docs page or requirement document. Create a new file only when the information needs to persist and has no suitable home.
- Match the user's requested format. An optional delivery note can cover goal, change, verification, and remaining risk; omit empty fields. In-chat completion follows `dev`'s concise delivery format.
