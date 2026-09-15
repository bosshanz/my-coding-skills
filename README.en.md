# Coding Agent Skills

Optional design, business verification, explicit preference capture, and external CLI adapters, plus directly readable engineering references.

Ordinary implementation, fixes, product analysis, and developer tests run in the current agent. There is no default development dispatcher or mandatory clarification / QA / acceptance pipeline. Honor the user's choice not to use Skills.

[中文](README.md)

## Optional Skills

| Skill | Purpose |
| --- | --- |
| `design` | Concrete interaction, visual, frontend quality, and motion decisions. Implementing an established design needs no new design process. |
| `verify` | Explicitly requested business-rule checks, journey diagnosis, or final acceptance. Add protection only when requested; review alone stays read-only. |
| `eng` | Backend boundaries, quality, storage, architecture decisions, debugging method, or ablation. Ordinary features, fixes, and tests do not load it. |
| `reflect` | Explicit `$reflect` / `/reflect` preference recording. Ordinary corrections do not trigger persistence. |
| `kimi-code` | Selected Kimi Code invocation, permissions, sessions, and troubleshooting. |
| `claude-code` | Selected Claude Code CLI invocation and evidence review. |
| `codex-cli` | Cross-host Codex invocation or explicitly requested CLI automation / isolated CLI work. Current Codex work proceeds directly. |
| `opencode` | Selected OpenCode CLI invocation and sessions. |
| `grok-build-cli` | Selected Grok Build CLI invocation, permissions, and output handling. |

`verify` combines the former `qa` and `acceptance` purposes while preserving read-only review, requested test protection, and final-verdict boundaries. Technical acceptance is not publication authority. Independent review requires actual reviewer separation and applicable authorization.

`reflect` follows host persistence rules and records only user-stated preferences. Reuse clear authorization for the entry and destination; ask only about material ambiguity. Its Codex metadata disables implicit invocation; portable descriptions retain the explicit-only boundary. See [Codex invocation policy](https://learn.chatgpt.com/docs/build-skills#optional-metadata).

## Engineering References

Backend, storage, architecture, debugging, and ablation notes are loaded by the optional `eng` skill from `eng/references/`. Read only the file needed for the current decision. `skills references` prints packaged paths. Installing `eng` or `all` copies these files.

## Installation

No arguments display help without installing or uninstalling anything. Select a Skill or group explicitly; the default target is `agents`. Installation does not change project rules or memories.

```bash
./install.sh --list
./install.sh design --target agents --dry-run
./install.sh design --target agents
./install.sh verify --target agents
./install.sh claude-code --target agents
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
| `adapters` / `delegation` | All five external CLI adapters |
| `all` | All nine Skills, only when explicitly selected |

Targets: `agents` (default, `~/.agents/skills`), `codex` (`${CODEX_HOME:-$HOME/.codex}/skills`), `claude`, `gemini`, `opencode`, and `all`. The `all` target writes to agents, claude, gemini, and opencode. `--dest DIR` selects one custom directory and cannot be combined with an explicit `--target all`. `--force` replaces an existing same-name Skill.

The global rules template remains a separate opt-in:

```bash
./install.sh --global-rules --target codex --dry-run
./install.sh --global-rules --target codex
```

This requires Node.js 18+, preserves non-managed content, backs up changes, skips identical content, and refuses a nonempty shadowing `AGENTS.override.md`. In this mode `--dest` selects a rules directory. Adopt only relevant guidance; project commands and constraints belong in the project's own instructions.

## Migration

`dev`, `clarify`, `qa`, `acceptance`, and installation groups `workflow` / `planning` are retired. The installer reports a migration hint instead of silently renaming or deleting existing copies. Old installed entries remain discoverable until explicitly removed.

Preview removal at the original installation target, preserve any local modifications, then select the replacement capability:

```bash
./uninstall.sh dev clarify qa acceptance --target agents --dry-run
./uninstall.sh dev clarify qa acceptance --target agents
./install.sh verify --target agents
```

Use the original `codex`, `claude`, or other target if applicable. Uninstall still accepts legacy names and groups. Uninstalling `quality` includes `verify`, `qa`, and `acceptance`; uninstalling `all` includes current and retired entries. No-argument uninstall only displays help.

Useful `dev` references now load through optional `eng`. `superpowers-lite.md` became `debugging.md`; module and architecture material from `design-and-research.md` remains in `architecture-decisions.md`. Repeated workflow, reference-routing, and generic documentation guidance were removed. Git history retains the original files.

## Scope And Evidence

- Ordinary work and generic code review proceed directly in the current agent. Design decisions may use `design`; business checks or final acceptance explicitly request `verify`; backend, storage, architecture, or debugging method uses `eng`; preference recording invokes `reflect`.
- External adapters require selection by the current request or an applicable explicit standing instruction. Discovering a policy file is not authorization.
- Actually invoke the chosen CLI, report unavailability accurately, preserve real output, and review its evidence. Pass through the user's Skill selection or prohibition; do not require a development Skill in the child.
- Skills do not grant publication, production access, unrelated work, or recursive delegation. Finish other authorized work after a check.

```bash
npm test
npm run doctor
npm run check:cli
git diff --check
```

Static tests cover adapter sync, catalog and reference integrity, fixture loading, evaluator regression, and installer safety. `doctor` checks resources; missing optional CLIs produce warnings. See [workflow and evaluation](docs/workflow.md) for proxy routing, response checks, host self-reports, and real execution.

The execution fixture no longer injects `dev`. Historical results describe their original versions. Static checks do not prove model behavior or quality after simplification. Establishing benefit requires comparable with/without runs on the same model, tasks, and environment; external model use still needs authorization.

## Repository Structure

```text
design/
  SKILL.md
  agents/
    openai.yaml
  references/
    animation.md
    anthropic-frontend-design-LICENSE.txt
    design-direction.md
    interaction.md
    quality.md
verify/
  SKILL.md
  agents/
    openai.yaml
eng/
  SKILL.md
  agents/
    openai.yaml
  references/
    ablation.md
    architecture-decisions.md
    backend-architecture.md
    backend-quality.md
    database-engineering.md
    debugging.md
reflect/
  SKILL.md
  agents/
    openai.yaml
kimi-code/
  SKILL.md
  agents/
    openai.yaml
  references/
    kimi-code-reference.md
  scripts/
    kimi-code-status.sh
claude-code/
  SKILL.md
  agents/
    openai.yaml
  references/
    claude-code-reference.md
  scripts/
    claude-code-status.sh
codex-cli/
  SKILL.md
  agents/
    openai.yaml
  references/
    codex-cli-reference.md
  scripts/
    codex-cli-status.sh
opencode/
  SKILL.md
  agents/
    openai.yaml
  references/
    opencode-reference.md
  scripts/
    opencode-status.sh
grok-build-cli/
  SKILL.md
  agents/
    openai.yaml
  references/
    grok-build-cli-reference.md
  scripts/
    grok-build-cli-status.sh
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

Original content is [MIT](LICENSE). `design/references/design-direction.md` is adapted from a pinned Apache-2.0 source; its [license](design/references/anthropic-frontend-design-LICENSE.txt) is distributed alongside it. Motion references preserve attribution to [Emil Kowalski's MIT-licensed skills](https://github.com/emilkowalski/skills).
