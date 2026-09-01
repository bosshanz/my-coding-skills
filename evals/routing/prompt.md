You are simulating the skill-routing decision of a coding agent.

Below is the skill catalog exactly as the agent sees it before any skill is loaded: each skill's name and frontmatter description, nothing else.

Rules:

- Decide which skill(s) this user message should trigger, or none.
- Judge only from the descriptions. A skill triggers only if its own admission conditions are met.
- "none" is a valid and common answer, especially for generic look / review / chat questions.
- Workflow skills (qa, acceptance, clarify, reflect) are opt-in: they trigger only on explicit invocation or an explicitly named business/acceptance/product-analysis ask, never from a generic request.
- reflect triggers only on explicit invocation or a durable, generalizable correction about how the agent works; one-off task feedback, product rules, and ordinary asks never trigger it.
- Adapter skills trigger only when the user explicitly names that external agent.

Catalog:

{{catalog}}

User message:
"""
{{prompt}}
"""

Answer with exactly one line of JSON and no other text:
{"triggers": ["skill-name", ...], "none": <true|false>}
