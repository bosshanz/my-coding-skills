# Changelog

Notable changes to this skill collection. Dates are absolute; versions follow
a coarse 0.x scheme tied to capability batches.

## [0.5.0] - 2026-09-01
### Added
- `CLAUDE.md`: always-on Rules layer for developing this repository (route
discipline, adapter binding, evidence gate) plus the Rules / Skills / Taste
layer map and an empty `## Taste` section.
- `docs/three-layers.md`: three-layer audit of all 10 skills and the explicit
taste-loop design (Observe -> Extract -> Learn -> Apply -> Verify).
- `reflect/` (11th skill): explicit taste loop - captures durable user
corrections into the always-on layer, one confirmed line at a time; wired
into `bin/skills.mjs`, `install.sh`, the routing/behavior fixtures, and
both READMEs.
### Changed
- All 10 `SKILL.md` frontmatter: trigger text moved verbatim into
`when_to_use`, `argument-hint` added; `evals/routing` catalog now renders
`description + when_to_use` to match how harness listings present skills.

## [0.4.0] - 2026-08-31

### Added

- `design/references/interaction.md`: interaction direction, object/action
  modeling, task flow, state-transition contracts, async feedback and control,
  recovery, input ergonomics, AI-native control loops, critique, and
  evidence-based verification.
- Routing and behavior fixtures for interaction redesign, AI-native flows,
  visual-only proof boundaries, and proportional interaction delivery.

### Changed

- `design` now treats interaction direction as a first-class responsibility
  before visual direction, frontend quality, and motion; product UI loads the
  interaction reference before visual design, while primarily visual or
  marketing work keeps a lighter path.
- `dev`, `clarify`, adapter routing guidance, Codex UI metadata, bilingual
  README documentation, doctor checks, and install safety checks now expose
  the interaction-design capability and its workflow boundaries.

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
