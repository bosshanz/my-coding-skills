# Changelog

Notable changes to this skill collection. Dates are absolute; versions follow
a coarse 0.x scheme tied to capability batches.

## [0.3.0] - 2026-08-30

### Added

- L1 routing eval (`evals/routing/`): 38 fixtures seeded from the historical
  qa mis-trigger commits plus boundary cases for every skill; two-level
  scoring (Haiku first pass, Opus re-check); `--backend claude` mode runs the
  eval through an authenticated `claude -p` when no API key is available.
  `npm run eval:routing`.
- L2 behavior eval (`evals/behavior/`): 8 fixtures asserting delivery-template
  conformance (qa diagnosis stops, acceptance verdict enum, adapter
  unavailability reporting, dev not recommending `$qa`). `npm run
  eval:behavior`.
- L3 e2e smoke (`evals/e2e/smoke.mjs`): asks real headless CLIs which skill
  they would invoke; advisory by default, `--strict` to fail. `npm run
  eval:e2e`.
- Nightly evals workflow (`.github/workflows/evals.yml`): runs `npm test`,
  both evals, uploads reports as artifacts. Requires the
  `ANTHROPIC_API_KEY` secret.
- Adapter contract single source (`adapters/contract.md` +
  `adapters/adapters.yaml` + `scripts/sync-adapters.mjs`): the five adapter
  SKILL.md files now render their shared sections from one template;
  `--check` runs as part of `npm test`, `npm run adapters:sync` rewrites.
- Eval result recording (`--record` writes `evals/results/`).
- `CHANGELOG.md` (this file); `skills-doctor.sh` now prints the package
  version.

### Changed

- Shared adapter sections are byte-identical across the five adapters modulo
  `display`/`short`/`aliases` tokens; opencode's recursion limits moved into
  the standard section; claude-code's self-dispatch guard now lives in
  Dispatch Decision (outside the generated block).
- `npm test` additionally verifies adapter sync.
- devDependencies: `yaml`, `@anthropic-ai/sdk` (eval runners only).

## [0.2.0] - 2026-08-30

### Added

- `dev/references/backend-engineering.md` wired into the dev loading table
  and both README trees.
- Reverse completeness checks in `check-routing-policy.mjs`: every
  README-tree path must exist; every `references/*.md` must be referenced in
  its SKILL.md and both trees (154 checks total).
- Chinese trigger phrases in the `dev` description.

### Changed

- README directory trees now list `scripts/`, `bin/`, `package.json`,
  `uninstall.sh`.
- `acceptance` inlines the L0-L4 independence ladder (was a separate
  11-line reference).
- `claude-code` gains a self-dispatch guard: when the caller is already
  Claude Code, answer directly instead of spawning a subprocess unless the
  user explicitly requests an isolated pass.

## [0.1.0] - 2026-08-23

- Initial 10-skill set: `design`, `dev`, `qa`, `clarify`, `acceptance`, and
  five external-agent adapters (`kimi-code`, `claude-code`, `codex-cli`,
  `opencode`, `grok-build-cli`).
- `install.sh` / `uninstall.sh`, `scripts/skills-doctor.sh`,
  `scripts/check-routing-policy.mjs`, `scripts/test-install-safety.sh`.
