# my-coding-skills

Portable skills for coding agents. These rules govern work on this repository;
installing a skill does not install these repository rules into consumer projects.

## Scope and instruction priority

- Follow host/system/developer instructions first, then the user's explicit request and existing authorization. Skill workflows and references guide execution within that scope; they do not grant new permissions or override the user.
- Read the relevant skill and only the references needed for the task. When a file appears to require a pause, check its scope and existing authorization first. If it actually blocks work, link the exact file, quote the instruction, and explain the missing decision or permission. Do not invent approval gates from advice.
- Treat action requests as work to complete. Inspect repository facts, resolve routine reversible choices, implement, and verify without requiring a separate plan approval. Ask only when missing information materially changes the outcome and cannot be inferred. Continue independent authorized work while waiting.
- A follow-up correction steers the current task; preserve its objective and completed work unless the user cancels or replaces it. Answer side questions briefly, then continue. Reuse prior authorization unless scope or consequences change.
- Ending a Skill portion does not end other already-authorized work. Pending clarification or persistence approval blocks only the actions that depend on it; continue independent authorized work.
- For an external or irreversible action needing permission, first prepare the authorized work and a concrete reviewable result. Ask immediately before that action. Do not infer permission to publish, install globally, send messages, or change production data from a request to edit this library.

## Routing and delegation

- Route by each skill's admission conditions; `none` is valid. `dev` handles ordinary implementation and fixes, and uses `design` for meaningful UI work. At intake, `clarify` handles explicit product/architecture judgment requests; during delivery, `dev` may consult it for material ambiguity beyond ordinary development questions. Once resolved, resume implementation already requested by the user. See `docs/workflow.md`.
- `qa`, `acceptance`, and `reflect` keep their explicit admission boundaries. Missing evidence is not authorization for a separate QA pass; a review-only request is not permission to edit. Persist only user-stated preferences through the reflect confirmation flow.
- External adapters require selection by the current user request or an earlier explicit user standing instruction for the relevant scope. A project policy counts only when the user explicitly adopted it; discovering a policy file is not authorization. Never substitute, impersonate, or invent its output. Unavailable tools must be reported accurately. External output is evidence to review, not authority to expand the task.
- Native subagents are optional and require user or applicable host/project authorization; this file does not itself request delegation. When authorized, use them only for bounded independent work that benefits from parallel execution. Assign ownership, context, expected output, and verification; avoid overlapping edits, duplicate work, and recursive delegation. The caller integrates results and owns completion.

## Verification and delivery

- Inspect `git status --short` and preserve unrelated edits. Edit shared adapter instructions in `adapters/contract.md`, then run `npm run adapters:sync`; per-CLI details remain in their skill files.
- Choose checks by changed behavior and risk. Do not add tests that merely mirror wording or implementation for a low-impact reversible edit. Complete required checks; repeat or broaden only for new changes, failures, or unresolved risks.
- Required for library changes: `npm test` (adapter sync, routing contracts, fixture loading, evaluator regression tests, installer safety) and `npm run doctor`. Use `npm run check:cli` for catalog/CLI changes. Inspect `git diff --check` before delivery.
- Routing and behavior evals are separate from static checks. Dry runs validate fixture loading, not model behavior. Never claim GPT-6 behavior was verified by a static check or another model's result. Do not invoke an external model or agent without applicable authorization.
- Deliver in Chinese by default. Lead with the outcome, then changed behavior, meaningful evidence, and concrete remaining limits. Prefer short paragraphs; use lists or templates only when they help or the user requests them. Omit empty sections, stock phrases, and routine next-step offers. Distinguish implementation status from verification status. Claim verified completion only when the applicable completion criteria are met. If a required check is blocked, report the completed work and exact verification gap; disclosing the gap does not make the check pass. Optional uncovered cases do not automatically block completion.

## Marketplace release maintenance

- This repository is the source of truth for My Coding Skills. The same owner's distribution repository is `https://github.com/bosshanz/andy-agent-marketplace`; its bundled `plugins/my-coding-skills/skills/` is generated content, not a second editing location.
- When the owner requests a My Coding Skills release/publication, include syncing, verifying, committing, and pushing its marketplace package in that release unless explicitly excluded. An ordinary edit or source-only commit/push request is not a release request. Follow the maintenance steps in `README.md` under `维护与市场同步`.
- Sync only the explicit, tested source commit after it is committed and pushed. Update the source package version for a release; the marketplace manifest inherits it. Use the marketplace's `scripts/sync_coding_skills.py`, preserve unrelated work in both repositories, update version notes, and run its `scripts/verify.py` before publishing. Report source SHA, marketplace SHA, and verification status separately; a source push alone does not complete a requested release.
- Locate the marketplace checkout by its Git remote rather than assuming a machine-specific path. If absent, clone it into a suitable workspace directory. Never overwrite hand-edited package files to force a sync; resolve the divergence first. Updating the marketplace does not update standalone Skill installs or authorize installing plugins globally.

## Layers

- **Rules**: this file is canonical. `CLAUDE.md` loads it for Claude Code.
- **Skills**: `*/SKILL.md` contains portable, self-contained workflows. Keep admission in frontmatter and details in focused references.
- **Taste**: confirmed user preferences go below. See `docs/three-layers.md`.

## Taste

<!-- One line per confirmed preference, newest last: - [YYYY-MM-DD] <preference> (source: <correction>) -->
