# Changelog

Notable changes to this skill collection. Dates are absolute; versions follow
a coarse 0.x scheme tied to capability batches.

## [Unreleased]

## [0.8.0] - 2026-10-29

### Removed

- 删除 `external-cli` Skill 及其参考与状态脚本；安装器拒绝 `external-cli`、`adapters`、`delegation` 和旧适配器别名，卸载器仍可清理遗留目录，`doctor` 不再检测外部 CLI。

### Changed

- `reflect` 不再在仓库根目录自动创建 `.agent-learning.md`：没有已登记或已存在的经验日志时，首次记录前在汇报末尾询问一次落点，未回答则只留在对话中；用户明确要求留在仓库但未给路径时使用根目录默认文件。消除默认写入与“共享仓库文件需授权”的冲突。
- `eng` 解除对 `design` 参考文件的跨 Skill 硬依赖，保留自包含的界面对齐与已有动效约束，避免普通样式改动被拉入像素级设计评审或默认新增动效；新增非界面改动同步既有产品文档受影响条目，并在开始相关工作前按需读取仓库已有经验日志。
- 显式声明全部 Codex `agents/openai.yaml` 的隐式调用策略（`verify` 与 `grill-me` 关闭隐式调用），为 `grill-me` 和 `reflect` 补齐 `when_to_use` 元数据，并收敛全局模板 `templates/AGENTS.md` 与 `eng` 的重复准则。
- 清理 `external-cli` 移除后的遗留项：修正 `bin/skills.mjs` 帮助中的失效 `delegation` 示例、`README.md` 的能力计数与文案标点、调试参考的委派口径、设计参考的原生平台说明，以及静态校验器中已废弃的根目录 `references/` 分支。
- Codex 子智能体编排由默认委派改为按需委派：仅在工作量大且可独立推进、需要隔离上下文、并行收益明确或用户要求时委派；优先级为用户当前请求 > 项目 `AGENTS.md` > 全局规则；委派默认只有一层。
- 全局编排规则与 README 不再硬编码 Worker 模型，以 `worker.toml` 为准，并增加一致性测试；移除 `CLAUDE.md` 中失效的 `## Taste` 引用。
- `design` 与 `eng` 分别在实质变化中按需维护产品设计和架构文档，项目规则提供导航；小修复不强制新建文档，也不自动串联 Skills。
- `verify` 补充预期依据、文档冲突与缺失处理、检查范围推导、隔离复现和验收原因；场景覆盖请求乱序及证据充分性。
- 行为评估支持显式参考文件和预期首行结论，增加结论误判与引用边界的回归检查；静态与单元检查不代表已完成模型效果对照。
- `eng` 补充抽象、状态归属、失败回退、兼容与验证强度的决策边界和重新判断条件，消除适配器数量门槛的暗示；增加成对行为评估案例，尚未运行模型对照。

## [0.7.0] - 2026-09-16

### Added

- 新增 `grill-me`：先查证据，一次追问一个关键问题，收敛决策。

### Changed
- `reflect` 支持日常复盘与仓库内经验积累，区分偏好、经验和假设；持久化遵循宿主规则，全局记忆需用户明确要求。
- `eng` 成为所有开发任务的统一工程原则入口，强调“如无必要，勿增实体”、可维护表达、清晰契约、真实失败、状态归属、兼容性和证据，不规定固定流程。
- 工程参考改为 `software-architecture.md` 与 `software-quality.md`，按契约、状态、副作用、资源和演进组织，补充行为测试、依赖长期成本和实际交付物验证；服务端内容保留为条件性例子。
- `design` 聚焦交互、视觉、动效、无障碍与适配，删除重复的前端工程质量规范及库选型内容。
- 全部 6 个 Skill 入口、15 份现存参考和展示文案改为简体中文，保留命令、标识符、来源链接和许可证。
- 补充工程条件、反例与验证例证，以及 `verify` 的行为证据场景；这些指导和静态检查不代表已测得模型增益。
- 五个外部 CLI 入口合并为 `external-cli`，原名称保留为安装别名和可卸载的历史目录；默认使用无头命令，ACP 仅用于客户端驱动会话。
- CLI 参考按本地帮助更新，涵盖 Kimi 的继续会话参数、权限模式含义与恢复模式覆盖；安装器、目录、文档和评估夹具同步更新。

## [0.6.0] - 2026-09-15

### Added

- Optional `eng` skill as a thin load table for backend, storage, architecture,
  debugging, and ablation references, so installed agents can read those files.
- `skills references` lists the packaged `eng/references/` paths.
- The separate global rules installer remains opt-in, with managed-block
  updates, backups, idempotence, and protection against shadowing overrides.

### Changed

- Retired `dev` and `clarify` as workflow entries. Ordinary implementation,
  analysis, and developer tests now run directly in the host agent.
- Combined `qa` and `acceptance` into optional `verify`, preserving read-only
  diagnosis, requested test protection, and final-verdict boundaries.
- Made `reflect` explicit-only, including Codex invocation metadata; removed
  routine correction capture and redundant confirmation for authorized writes.
- Narrowed `design` to concrete references and decisions, removed repeated
  delivery/process text, and qualified blanket motion rules.
- Recorded the design gate in `design/references/interaction.md`: prove
  willingness and value before optimizing experience and packaging.
- Moved useful development references into `eng/references/`; renamed
  debugging and architecture-decision documents and removed repeated routers.
- Install and uninstall now require an explicit selection; no arguments only
  show help. Default target is `agents`. Retired names remain uninstallable,
  while install reports migration instructions. No global copies are changed
  automatically.
- External adapters preserve user Skill selections and prohibitions instead of
  requiring a development workflow in the target. Current Codex work does not
  need a redundant Codex CLI subprocess.
- Updated routing/response fixtures, installer regression checks, and bilingual
  docs. Execution fixtures no longer force-load `dev`; historical results are
  not reclassified as evidence for this version.

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
