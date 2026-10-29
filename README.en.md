# Coding Agent Skills

Optional design, business verification, decision interviews, and repository-local learning, plus engineering principles for all development work.

Implementation, fixes, refactoring, debugging, developer tests, and code review use `eng` as their common engineering entry and run in the current agent. Pure product analysis proceeds directly. There is no default development dispatcher or mandatory clarification / QA / acceptance pipeline. Honor the user's choice not to use Skills.

[中文](README.md)

## Optional Skills

| Skill | Purpose |
| --- | --- |
| `design` | Diagnose design problems from tasks and evidence; choose interaction patterns, visual hierarchy, a consistent design language, and motion. Implementing an established design needs no new design process. |
| `verify` | Explicitly requested business-rule checks, journey diagnosis, or final acceptance. Add protection only when requested; review alone stays read-only. |
| `eng` | A common entry for all development work, governing engineering behavior and taste: avoid unnecessary entities, write maintainable code, make contracts clear, expose failures truthfully, own state explicitly, preserve compatibility, and use evidence. No fixed workflow. |
| `grill-me` | Requested plan challenges and decision interviews: inspect evidence, ask one consequential question at a time, and converge. |
| `reflect` | Learn automatically from corrections, failures, and supported improvements. Lessons stay in the repository; global memory requires an explicit request. |

`verify` combines the former `qa` and `acceptance` purposes while preserving read-only review, requested test protection, and final-verdict boundaries. Read-only review does not edit the reviewed source or tests; within existing authorization it may run checks, operate on isolated test data, and clean up temporary artifacts. Technical acceptance is not publication authority. Independent review requires actual reviewer separation and applicable authorization. Codex metadata disables implicit invocation for `verify` and `grill-me`.

`reflect` follows host persistence rules. Reuse the repository's designated learning log. When no location is known, the first useful entry ends the report with one question about where to keep it (for example root `.agent-learning.md`, a custom path, or conversation only); nothing is written without an answer. If the host forbids automatic persistence, reflect in the conversation only. Distinguish confirmed preferences, evidence-backed lessons, and hypotheses; do not automatically rewrite project instructions. Codex metadata permits implicit invocation; other hosts use the entry description. `$reflect` / `/reflect` remain available for focused retrospectives and maintenance.

## Choosing A Capability

Select the information the task needs; these are not sequential stages.

| Job | Example request | Focus |
| --- | --- | --- |
| Improve an existing interaction | `$design Redesign partial failure and retry for bulk publishing; retain the current visual system.` | State, feedback, and recovery before polish; no mandatory new fonts or animation. |
| Assess an engineering decision | `$eng Check reservation idempotency under concurrent requests and timeout retries.` | Applicability, counterexample, correction, and verification; read only relevant references. |
| Check actual behavior | `$verify Diagnose whether a saved draft survives reload. Do not change code.` | Compare visible claims with authoritative persisted state and identify evidence gaps. |
| Challenge a plan | `$grill-me Pressure-test offline editing, one question at a time.` | Inspect facts, follow consequential branches, and converge on decisions and validation. |
| Learn from an outcome | `$reflect Review this fix and keep supported lessons in the repository.` | Distinguish observations, lessons, and hypotheses; reuse repository records under host rules. |
| Record an explicit preference | `$reflect Replace this project's pnpm preference with npm in its AGENTS.md preference section.` | Use the host-permitted mechanism, replace the same-scope entry, and avoid turning project scope into a global preference. |

Design covers diagnosis and tradeoffs, visual fundamentals, interaction patterns, motion, design language, and evaluation for product tools, presentation websites, and native interfaces. Alongside [calibration examples](design/references/design-direction.md#calibration-examples), six paired cases cover [browsing versus comparison, form dependencies, and action reversibility](design/references/interaction.md#paired-examples), [existing brand constraints](design/references/design-direction.md#paired-examples), and [interaction frequency and reduced motion](design/references/animation.md#paired-examples). Each pair holds the background constant and changes one decisive constraint, with concrete choices, reasons, costs, reconsideration conditions, and verification methods. Inspect rendered output for appearance, actual interaction for flows, and normal-speed playback plus interruption for motion.

Engineering examples cover [idempotency and tenant isolation](eng/references/software-quality.md#worked-examples-idempotency-and-tenant-scope), [compatible migrations](eng/references/database-engineering.md#worked-example-renaming-a-populated-column), and [publish-state ownership](eng/references/architecture-decisions.md#worked-example-one-owner-for-publish-state). Database-specific syntax names its engine rather than posing as a universal rule.

The [verification scenarios](verify/references/scenarios.md) cover lost payment responses, restored drafts, account/permission switches, partial batches, conflicting or missing documentation, out-of-order responses, isolated reproduction, and sufficient evidence. Checks connect product expectations, technical mechanisms, and actual evidence, distinguishing unmet requirements, missing required evidence, and non-blocking risks. They reuse existing tools without requiring a new test framework. `reflect` handles same-scope replacements, narrow exceptions, and explicit retractions; writes follow host rules and never default to global memory.

These are guidance examples, not executed test reports. Upstream attribution explains the method's origin, not measured gains from this library. See [workflow and evaluation](docs/workflow.md) for evidence levels and [rules, capabilities, and preferences](docs/three-layers.md) for where information belongs.

## Product And Architecture Documents

During substantive product design work, `design` creates or maintains the minimum useful product document: user tasks, business rules, flow states, interaction, visuals, motion, and observable acceptance criteria. During substantive architecture changes, `eng` maintains background constraints, module responsibilities, the technology stack, databases and middleware, data and state ownership, key mechanisms, and tradeoffs; when development work changes business rules or user-visible behavior without a design pass, `eng` also syncs affected entries in an existing product document. Product documents distinguish confirmed decisions, proposals, and hypotheses; architecture documents distinguish the current implementation from planned changes.

Check project navigation and reuse existing material first. If no suitable location exists, default to `docs/product.md` and `docs/architecture.md`, creating only the document needed for the task and updating only affected content. Small fixes do not require new documents. When project rules and authorization permit, the project's `AGENTS.md` records actual paths, purposes, and maintenance expectations; the global template gives discovery and maintenance principles without fixed paths. `verify` uses these materials alongside actual evidence; missing documents do not prevent checks that remain valid. Documentation does not automatically chain Skills or add approvals. See [document ownership and project rules](docs/three-layers.md).

## Engineering References

`eng/SKILL.md` provides shared engineering principles across development work. Existing architecture, storage, debugging, and ablation notes remain in `eng/references/`; load only what a concrete decision needs, not a whole frontend/backend/client checklist. `skills references` prints packaged paths. Installing `eng` or `all` copies these files.

## Installation

No arguments display help without installing or uninstalling anything. Select a Skill or group explicitly; the default target is `agents`. Installation does not change project rules or memories.

```bash
./install.sh --list
./install.sh design --target agents --dry-run
./install.sh design --target agents
./install.sh verify --target agents
./install.sh grill-me --target agents
```

```bash
npx --package my-coding-skills skills list
npx --package my-coding-skills skills add design --target agents
npx --package my-coding-skills skills references
```

These interfaces describe the current source. Until a release includes this change, older registry packages retain their previous behavior. Use `node bin/skills.mjs` for the local checkout.

| Group | Members |
| --- | --- |
| `ui` | `design` |
| `quality` | `verify` |
| `engineering` | `eng` |
| `meta` | `reflect` |
| `all` | All five Skills, only when explicitly selected |

`grill-me` has no single-skill group alias; install it directly by name or via `all`. Targets: `agents` (default, `~/.agents/skills`), `codex` (`${CODEX_HOME:-$HOME/.codex}/skills`), `claude`, `gemini`, `opencode`, and `all`. The `all` target writes to agents, claude, gemini, and opencode. `--dest DIR` selects one custom directory and cannot be combined with an explicit `--target all`. `--force` replaces an existing same-name Skill.

The global rules template remains a separate opt-in:

```bash
./install.sh --global-rules --target codex --dry-run
./install.sh --global-rules --target codex
```

This requires Node.js 18+, preserves non-managed content, backs up changes, skips identical content, and refuses a nonempty shadowing `AGENTS.override.md`. In this mode `--dest` selects a rules directory. Adopt only relevant guidance; project commands and constraints belong in the project's own instructions.

## Migration

`dev`, `clarify`, `qa`, `acceptance`, and installation groups `workflow` / `planning` are retired. `external-cli`, its former aliases `kimi-code`, `claude-code`, `codex-cli`, `opencode`, `grok-build-cli`, and the `adapters` / `delegation` groups are removed; the installer rejects these names and does not silently delete leftover directories. Old installed entries remain discoverable until explicitly removed.

Preview removal at the original installation target, preserve any local modifications, then select the replacement capability:

```bash
./uninstall.sh dev clarify qa acceptance --target agents --dry-run
./uninstall.sh dev clarify qa acceptance --target agents
./uninstall.sh adapters --target agents
./install.sh verify --target agents
```

Use the original `codex`, `claude`, or other target if applicable. Uninstall still accepts legacy names and groups. Uninstalling `quality` includes `verify`, `qa`, and `acceptance`; uninstalling `adapters` removes the deleted `external-cli` and leftover adapter directories; uninstalling `all` includes current and retired entries. No-argument uninstall only displays help.

Useful `dev` references now load through optional `eng`. `superpowers-lite.md` became `debugging.md`; module and architecture material from `design-and-research.md` remains in `architecture-decisions.md`. Repeated workflow, reference-routing, and generic documentation guidance were removed. Git history retains the original files.

## Scope And Evidence

- Development work and code review use `eng` principles and proceed directly in the current agent; honor requests to use no Skills. Design decisions may use `design`; business checks or final acceptance explicitly request `verify`; engineering principles and on-demand references come from `eng`; requested plan challenges use `grill-me`; corrections, failures, and supported improvements can trigger repository-local learning with `reflect`.
- Skills do not grant publication, production access, unrelated work, or recursive delegation. Finish other authorized work after a check.

```bash
npm test
npm run doctor
npm run check:cli
git diff --check
```

Static tests cover catalog and reference integrity, fixture loading, evaluator regression, and installer safety. `doctor` checks resources. See [workflow and evaluation](docs/workflow.md) for proxy routing, response checks, host self-reports, and real execution.

The execution fixture no longer injects `dev`. Historical results describe their original versions. Static checks do not prove model behavior or quality after simplification. Establishing benefit requires comparable with/without runs on the same model, tasks, and environment; external model use still needs authorization.

## Repository Structure

```text
design/
  SKILL.md
  agents/
    openai.yaml
  references/
    animation.md
    design-direction.md
    interaction.md
verify/
  SKILL.md
  agents/
    openai.yaml
  references/
    scenarios.md
eng/
  SKILL.md
  agents/
    openai.yaml
  references/
    ablation.md
    architecture-decisions.md
    software-architecture.md
    software-quality.md
    database-engineering.md
    debugging.md
grill-me/
  SKILL.md
  agents/
    openai.yaml
reflect/
  SKILL.md
  agents/
    openai.yaml
templates/
  AGENTS.md
install.sh
uninstall.sh
bin/
  skills.mjs
docs/
  workflow.md
  three-layers.md
```

## Marketplace Release Maintenance

This repository is the source of truth. [Andy's Agent Marketplace](https://github.com/bosshanz/andy-agent-marketplace) distributes a pinned generated package; do not edit its bundled Skill copies directly.

An owner-requested release includes source and marketplace publication unless explicitly excluded. Ordinary edits or source-only commit/push requests are not releases. For release: update the source package version and lockfile, run required checks, commit and push the tested source, then sync only that full SHA.

Locate the marketplace checkout by its remote, preserve unrelated edits in both repositories, and run there:

```bash
python3 scripts/sync_coding_skills.py /path/to/my-coding-skills FULL_COMMIT_SHA
python3 scripts/verify.py
git diff --check
```

Resolve manually edited generated content instead of forcing a sync. Update marketplace version notes, stage only release files, commit and push, and check CI. Report the source SHA, marketplace SHA, and verification separately. Marketplace publication does not update standalone installations or authorize global plugin installation. Details: [维护与市场同步](README.md#维护与市场同步).

## License

Original content is [MIT](LICENSE). Source acknowledgements, where applicable, appear in individual references.
