# my-coding-skills

Portable optional skills and engineering references. These rules govern this repository; installing a Skill does not install these rules into consumer projects.

## Scope

- Follow host instructions, the user's current request, and existing authorization. A request to work without Skills takes precedence over optional workflows. Development work uses `eng` as the common engineering-principles entry and runs in the current agent unless delegation is warranted as below; it prescribes no fixed workflow, and Skills do not chain automatically. Pure analysis proceeds directly.
- `design` adds concrete UI guidance. `verify` handles explicitly requested business checks or final acceptance; review-only work does not authorize edits. `grill-me` provides requested decision interviews. `reflect` learns from corrections, failures, and verified improvements during repository work, keeping lessons repository-local under host persistence rules; global memory requires an explicit user request.
- Native subagents are used on demand: delegate only for large independent work, context isolation, clear parallel benefit, or when the user asks; otherwise work in the current agent. Precedence: the user's current request, then project `AGENTS.md`, then global host rules. When delegating, assign bounded ownership, avoid overlapping work, keep delegation one level deep unless the user asks for more, and keep judgment, integration, and verification with the lead agent.
- Editing this library does not authorize global installation, publishing, production changes, or messages to others. Preserve unrelated edits and reuse existing authorization within its scope.

## Structure and verification

- `*/SKILL.md` contains a self-contained optional capability. Engineering documents live with the optional `eng` skill in `eng/references/`. Keep installation and migration docs consistent with the catalog.
- `external-cli` and its former adapter names are removed; they are rejected by the installer and remain uninstall-only leftovers.
- Required for library changes: `npm test`, `npm run doctor`, and `git diff --check`. Catalog or installer CLI (`bin/skills.mjs`) changes also require `npm run check:cli`. Inspect `git status --short` and preserve unrelated work.
- Choose additional checks by changed behavior and actual risk. Fixture loading and static checks do not prove model behavior. Do not invoke external models or agents without applicable authorization. Keep historical evaluation results in their original context.
- Deliver in concise Chinese: outcome, relevant evidence, and material gaps. A required check that did not run is not a pass. Optional uncovered cases do not automatically block completion.

## Marketplace release maintenance

- This repository is the source of truth for My Coding Skills. The same owner's distribution repository is `https://github.com/bosshanz/andy-agent-marketplace`; its bundled `plugins/my-coding-skills/skills/` is generated content, not a second editing location.
- When the owner requests a My Coding Skills release/publication, include syncing, verifying, committing, and pushing its marketplace package in that release unless explicitly excluded. An ordinary edit or source-only commit/push request is not a release request. Follow the maintenance steps in `README.md` under `维护与市场同步`.
- Sync only the explicit, tested source commit after it is committed and pushed. Update the source package version for a release; the marketplace manifest inherits it. Use the marketplace's `scripts/sync_coding_skills.py`, preserve unrelated work in both repositories, update version notes, and run its `scripts/verify.py` before publishing. Report source SHA, marketplace SHA, and verification status separately; a source push alone does not complete a requested release.
- Locate the marketplace checkout by its Git remote rather than assuming a machine-specific path. If absent, clone it into a suitable workspace directory. Never overwrite hand-edited package files to force a sync; resolve the divergence first. Updating the marketplace does not update standalone Skill installs or authorize installing plugins globally.

## Confirmed preferences

Store only preferences explicitly authorized for this repository, with their scope and source. Follow host persistence rules; temporary task corrections do not automatically become repository policy.
