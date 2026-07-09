# Coding Agent Skills

这是一个面向 Agent Engineering Methodology 和多 Agent 编码工作流的可移植 Skill 集合。

它提供 `loop-engineering`、`clarify`、`dev`、`acceptance` 和外部 Agent Adapter，让 Codex、Claude Code、Gemini CLI、OpenCode 及其他支持 Agent Skills 的调用方 Agent，可以共享同一套 Skill 内容，并在需要时显式调用 Kimi Code、Claude Code CLI、Codex CLI 或 OpenCode CLI。

核心原则：

- 用户指定谁，就实际调用谁。
- 不能调用时明确失败，不静默替换。
- 不模拟、不伪装、不编造目标 Agent 的输出。
- 外部 Agent 的结果必须可审计、可复核、可验证。
- 用反馈闭环设计 agent 工程方法论，而不是只堆叠提示词和流程清单。
- Loop Engineering 的第一性原则是：不要相信 Agent，要相信验证器；优先级是验证阀门、权限边界、状态记忆、调度机制、Agent 能力。
- 对复杂需求和架构选择先做第一性原理拆解，再选择方案。
- 对非平凡设计、修复和验收结论做对抗式审查，主动寻找反例和薄弱假设。

English version: [README.en.md](./README.en.md)

## 仓库内容

当前包含 8 个主 Skill：

### `loop-engineering`

这是顶层 Agent Engineering Methodology Skill，用于设计、审计和改进 AI 编码 Agent 的工程闭环：

- 设计需求澄清、方案、实现、调试、评测、委托、验收、发布和文档/记忆更新的反馈闭环
- 为每个 loop 定义 target、actor、input、action、signal、gate、escalation 和 artifact
- 建立 verification ladder，先定义硬验证、软验证、安全验证、成本验证和停止/结束规则，再谈 Agent 能力
- 设计多 Agent 协作协议：显式授权、边界、调用证据、非递归委托、调用方复核和最终责任
- 规范 `clarify` 中可选的 `loop/` 工作区：`LOOP.md`、`STATE.md`、`ROADMAP.md`、`CONTEXT.md`、`loop-run-log.md`
- 审计现有 skill / README / install / doctor / adapter contract 是否形成一致的方法论表面

触发建议：用户明确写 `$loop-engineering`、要求 Loop Engineering、Agent Engineering Methodology、反馈闭环设计、evaluation loop、多 Agent 工作流治理，或希望把 Skill 仓库升级成方法论体系时使用。普通功能实现和 Bug 修复仍走 `dev`。

### `dev`

这是面向真实开发场景的默认 Skill，围绕“新需求交付”和“Bug 修复”两条完整闭环：

- 新需求：聊天澄清目标与验收标准，确认方案，再实施编码、测试和验收
- Bug 修复：审查问题、稳定复现、定位根因、确认修复方案，再实施最小修复、回归测试和验收
- Superpowers Lite：轻量设计、TDD、系统化调试、review gate 和 evidence-based completion
- Frontend Design：页面目的、审美方向、交互流程、完整状态、可访问性和响应式验收
- 后端架构：API、服务边界、缓存、消息、失败模式、可观测性和可靠性
- 数据库工程：schema、约束、事务、索引、查询计划、迁移、回填、容量和生产安全
- 第一性原理设计和对抗式审查：从目标、事实、约束和假设推出方案，并主动寻找失败路径
- 交付前对照需求或根因做 diff review，并明确测试、验收和未验证风险

触发建议：新增需求和 Bug 修复都默认触发 `dev`，不需要用户显式写 `$dev`。`dev` 先作为薄调度器判断任务边界，再按矩阵加载相关 reference。只有用户明确要求 Kimi / Claude Code / Codex CLI / OpenCode CLI 等外部 Agent 参与时，才走对应 Adapter。

### `clarify`

这是一个手动开启的需求/架构对齐 Skill，适合在编码前做一次有边界的访谈：

- 一次只问一个高价值问题，并给出推荐答案
- 能从仓库文档或代码查到的事实就先查，不把问题抛回给用户
- 对多轮、跨文件、高风险或需要委托/验收的任务，询问是否创建 `loop/` 工作区
- 用户同意后生成 `LOOP.md`、`STATE.md`、`ROADMAP.md`、`CONTEXT.md`、`loop-run-log.md`
- 对 solution-shaped 的请求做第一性原理拆解，分离目标、事实、约束、假设和非目标
- 需要时维护 `CONTEXT.md` 里的领域词汇，但不把它变成实现方案或草稿
- 只在决策难以逆转、未来读者会疑惑、且确有取舍时建议写 ADR
- 访谈结束后把清晰的行为、非目标、边界和验证策略交给 `dev`

触发建议：只有用户明确要求 `$clarify`、需求拷问、方案访谈、先聊清楚再写，或需要沉淀领域词汇/ADR 时使用；普通开发请求仍走 `dev`。

### `acceptance`

这是一个顶层独立验收 Skill，用于在实现完成后做单独的 go/no-go 复核：

- 对照澄清后的需求、验收标准、issue、PR 描述或任务记录
- 审查当前 diff、测试证据、CI、手动验证、截图、日志、文档、迁移和回滚说明
- 对验收结论做对抗式反证，检查边界输入、权限、并发、迁移、回滚和恢复路径
- 默认只验收不改代码；发现问题时给出阻塞项、风险和下一步 `$dev` 修复建议
- 输出 `accepted`、`accepted with risk` 或 `rejected`

触发建议：用户明确写 `$acceptance`、要求最终验收、要求独立复核 `dev` 结果、需要上线前 go/no-go 判断，或希望把“澄清 → 开发 → 验收”拆成清晰三段时使用。

### `kimi-code`

这是一个让其他 Agent 调度 Kimi Code CLI 做编码或研究的 Skill，重点包括：

- 把 Kimi Code 作为外部编码 Agent 调度
- 支持仓库研究、故障定位、方案对比、独立 review
- 支持有边界的实现任务、重构、测试补充和终端自动化
- 要求调用方 Agent 在 Kimi 完成后复核 diff、运行验证、再交付结论
- 包含 Kimi Code 安装、登录、会话、Skill 目录和命令参考

### `claude-code`

这是一个让其他 Agent 调度 Claude Code CLI 的 Skill，重点包括：

- 支持仓库研究、独立 review、有边界的实现任务和终端自动化
- 支持非交互 print mode、结构化输出、会话和权限控制
- 默认限制危险权限，并要求调用方 Agent 复核结果
- 包含 Claude Code 安装、认证、权限和命令参考

### `codex-cli`

这是一个让其他 Agent 调度 Codex CLI 的 Skill，重点包括：

- 支持仓库研究、独立 review、有边界的实现任务和终端自动化
- 支持 `codex exec`、sandbox、approval、结构化输出和会话恢复
- 默认使用最小 sandbox 权限，并要求调用方 Agent 复核结果
- 包含 Codex CLI 安装、认证、配置和命令参考

### `opencode`

这是一个让其他 Agent 调度 OpenCode CLI 的 Skill，重点包括：

- 支持仓库研究、独立 review、有边界的实现任务和终端自动化
- 支持 `opencode run` 非交互调用、TUI 交互、session 续接、agent 选择、文件附件和 JSON 输出
- 默认要求调用方 Agent 保留 OpenCode 调用证据，并在 OpenCode 完成后复核结果
- 包含 OpenCode 安装、登录、Skill / Rules 目录和命令参考

## 兼容性

所有 Skill 都遵循 [Agent Skills 开放规范](https://agentskills.io/specification) 的目录形式，以 `SKILL.md` 作为可移植主体。需要注意：开放规范统一的是 **Skill 格式**，并不要求所有客户端扫描同一个全局目录。

| 安装目标 | 用户级目录 | 说明 |
| --- | --- | --- |
| `agents` | `~/.agents/skills/` | **推荐共享目录**。Codex 官方支持该目录，也适合作为共享的标准化 Skill 根目录。默认 `./install.sh` 会同时安装到所有支持的目标。 |
| `claude` | `~/.claude/skills/` | Claude Code 的用户级发现目录。 |
| `gemini` | `~/.gemini/skills/` | Gemini CLI 的用户级发现目录。 |
| `opencode` | `~/.config/opencode/skills/` | OpenCode 的用户级发现目录。 |
| `codex` | `${CODEX_HOME:-$HOME/.codex}/skills/` | Codex 旧兼容目录；新安装优先使用 `~/.agents/skills/`。 |

`agents/openai.yaml` 仅用于增强 Codex UI 元数据；其他运行时共享 `SKILL.md`、`references/` 和 `scripts/`。若一个工具尚未声明会扫描 `~/.agents/skills/`，请使用对应的运行时目标，不要仅凭格式兼容性假设它会自动发现该目录。

## 目录结构

```text
loop-engineering/
  SKILL.md
  agents/openai.yaml
dev/
  SKILL.md
  agents/openai.yaml
  references/
    superpowers-lite.md
    stack.md
    design-and-research.md
    documentation.md
    frontend-quality.md
    backend-architecture.md
    database-engineering.md
clarify/
  SKILL.md
  agents/openai.yaml
  references/
    loop-workspace.md
acceptance/
  SKILL.md
  agents/openai.yaml
kimi-code/
  SKILL.md
  agents/openai.yaml
  references/
    kimi-code-reference.md
  scripts/
    kimi-code-status.sh
claude-code/
  SKILL.md
  agents/openai.yaml
  references/
    claude-code-reference.md
  scripts/
    claude-code-status.sh
codex-cli/
  SKILL.md
  agents/openai.yaml
  references/
    codex-cli-reference.md
  scripts/
    codex-cli-status.sh
opencode/
  SKILL.md
  agents/openai.yaml
  references/
    opencode-reference.md
  scripts/
    opencode-status.sh
scripts/
  skills-doctor.sh
LICENSE
README.md
README.en.md
install.sh
```


## Agent Engineering Methodology

`loop-engineering` 是这个仓库的方法论层。它不直接替代编码、访谈或验收，而是定义这些动作如何形成可验证的工程闭环。

- `loop-engineering` 负责设计和审计 loop：触发条件、责任主体、输入、动作、证据、闸门、升级路径和沉淀产物。
- `clarify` 是需求/架构澄清 loop，并在用户同意时创建 `loop/` 工作区。
- `dev` 是实现、调试、测试和轻量验收 loop；如果 `loop/` 存在，先读上下文并持续更新状态和日志。
- `acceptance` 是独立 go/no-go 验收 loop；如果 `loop/` 存在，把验收结论写回状态和日志。
- 外部 Agent Adapter 是委托 loop 的执行器；只有用户或项目策略显式授权时才使用。

方法论目标是让每一次 agent 行动都有可观察信号和失败条件：错误假设能被测试、日志、diff review、截图、CI、人工验收或独立 acceptance 及时反证。

Loop Engineering 的第一性原则是：不要相信 Agent，要相信验证器。设计优先级固定为：1. 验证阀门；2. 权限边界；3. 状态记忆；4. 调度机制；5. Agent 能力。验证阀门至少按风险选择硬验证、软验证、安全验证、成本验证和停止/结束规则。

长期非需求型 Loop 不应被强行套成“澄清 → 开发 → 验收”的一次性交付。对于 evaluation、质量治理、方法论演进、维护或学习型 loop，`loop-engineering` 定义 cadence、趋势信号、gate、checkpoint artifact，以及 continue / stop / pivot 条件；`dev` 只执行当前有边界的增量或实验；`acceptance` 只在 milestone、checkpoint 或明确 go/no-go gate 做独立判断。

## Dev 集成方向

`dev` 不是完整 Superpowers 的安装包，也不是单独的前端设计 Skill。它是一个默认触发的薄调度器：

- 从 Superpowers 吸收轻量工程纪律：澄清、设计、计划、TDD、系统化调试、review gate、完成前验证和 evidence over claims。
- 从 Matt Pocock 的 Skills 吸收更硬的工程规则：red-capable 调试反馈环、tracer-bullet TDD、deep module / seam / interface 架构词汇。
- 从 Frontend Design 吸收 UI 质量纪律：先确定审美方向，避免 generic AI UI，覆盖真实状态、交互、可访问性和性能。
- 从资深数据库工程实践吸收数据建模、约束、事务、索引、查询计划、迁移、回填和生产数据库安全。
- 用第一性原理约束方案选择，用对抗式审查反证设计、修复和完成声明。
- 按任务边界懒加载 reference，不把所有检查清单变成每个任务的默认上下文。
- 保留轻量边界：默认不强制 worktree、长 spec、每任务 subagent 或完整 Superpowers 安装。
- 顶层 `acceptance` 提供独立验收；`dev` 内部仍保留轻量验收 gate，避免小任务被迫拆流程。

## Comet 吸收方向

本仓库参考 [Comet](https://github.com/rpamis/comet) 项目的工程化思路，但不照搬其 OpenSpec + Superpowers 五阶段流程。当前只吸收第一阶段能力：

- 用调用证据证明目标 Agent 被真实调用，而不是由调用方模拟。
- 用轻量 doctor 脚本检查 Skill 结构、脚本权限、旧目录残留和目标 CLI 可用性。
- 用平台兼容文档区分已验证运行时和计划支持运行时。
- 保持外部 Agent Adapter 轻量；只提供目录复制型 `install.sh`，不引入包管理器、状态机或自动多 Agent 编排。

```bash
scripts/skills-doctor.sh
```

## 安装方式

### 方式 A：使用 `install.sh`（推荐）

仓库根目录提供零依赖 Shell 安装器。默认命令会把全部 Skill 安装到所有支持的目标目录（`~/.agents/skills/`、`~/.claude/skills/`、`~/.gemini/skills/`、`~/.config/opencode/skills/`）：

```bash
git clone <your-repository-url>
cd my-coding-skills
./install.sh
```

常用示例：

```bash
# 默认：安装全部 Skill 到所有支持的目标目录
./install.sh

# 只安装 Agent Engineering Methodology 层
./install.sh methodology --target agents --force

# 只安装默认研发工作流到开放标准目录
./install.sh dev --target agents --force

# 只安装需求/架构访谈 Skill
./install.sh planning --target agents --force

# 只安装独立验收 Skill
./install.sh acceptance --target agents --force

# 安装到 Claude Code、Gemini CLI 或 OpenCode 的专用目录
./install.sh all --target claude --force
./install.sh all --target gemini --force
./install.sh all --target opencode --force

# 同时安装到 ~/.agents、Claude、Gemini 和 OpenCode 目录
./install.sh all --target all --force

# 仍需旧 Codex 路径时显式选择 legacy target
./install.sh all --target codex --force

# 安装到自定义目录或仅预览
./install.sh dev --dest /tmp/skills --force
./install.sh all --target agents --dry-run

# 查看帮助、Skill 和分组
./install.sh --list
```

支持的 Skill / 分组：

- `loop-engineering`：Agent Engineering Methodology 与反馈闭环设计
- `dev`：默认研发工作流，集成 Superpowers Lite 和 Frontend Design
- `clarify`：手动需求/架构访谈，支持领域词汇和 ADR 轻量沉淀
- `acceptance`：独立验收与 go/no-go 复核
- `kimi-code` / `claude-code` / `codex-cli` / `opencode`：外部 Agent Adapter
- `workflow`：只安装 `dev`
- `methodology`：只安装 `loop-engineering`
- `planning`：只安装 `clarify`
- `delegation`：安装四个外部 Agent Adapter
- `adapters`：只安装四个 Adapter
- `all`：安装全部 Skill；未指定 Skill 时的默认值

安装器支持：

- `--target agents|codex|claude|gemini|opencode|all`
- `--dest <directory>`
- `--force` / `-f`
- `--dry-run`
- `--list`

### 方式 B：手动复制安装

推荐先安装到共享目录：

```bash
mkdir -p "$HOME/.agents/skills"
for skill in loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode; do
  cp -R "$skill" "$HOME/.agents/skills/"
done
```

如果目标工具不扫描 `~/.agents/skills/`，将相同目录复制到对应位置：

```bash
# Claude Code
mkdir -p "$HOME/.claude/skills"
cp -R loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode "$HOME/.claude/skills/"

# Gemini CLI
mkdir -p "$HOME/.gemini/skills"
cp -R loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode "$HOME/.gemini/skills/"

# OpenCode
mkdir -p "$HOME/.config/opencode/skills"
cp -R loop-engineering clarify dev acceptance kimi-code claude-code codex-cli opencode "$HOME/.config/opencode/skills/"
```

## 推荐安装策略

1. 默认 `./install.sh` 会同时写入 `agents`、`claude`、`gemini`、`opencode` 四个目录，保证各 Agent 都能发现 Skill。
2. 如果只想安装到共享目录，使用 `--target agents`；Codex 旧环境可继续选择 `--target codex`。
3. 如果只想安装到某个特定 Agent，使用 `--target claude|gemini|opencode`。
4. 推荐把 `~/.agents/skills/` 作为共享、标准化的 Skill 根目录，但 Claude Code、Gemini CLI、OpenCode 目前不扫描该目录，因此默认策略是全部安装。

## 使用方式

### Codex

可以直接显式调用；普通开发任务也应由运行时自动匹配 `dev`，不需要总是写 `$dev`：

```text
Use $loop-engineering to design an agent engineering feedback-loop architecture for this repository, including routing between clarify, dev, acceptance, and external-agent adapters.
```

```text
Use $dev to implement a new feature with a brief plan first, then verify it and update docs.
```

```text
Use $clarify to clarify this refactor one question at a time before we implement it.
```

```text
Use $clarify to interview me first and ask whether to create a loop workspace for this multi-step change.
```

```text
Use $acceptance to independently verify the completed change against the agreed criteria and return accepted, accepted with risk, or rejected.
```

```text
Use $kimi-code to dispatch Kimi Code for a scoped repository research task.
```

```text
Use $claude-code to dispatch Claude Code for an independent diff review.
```

```text
Use $codex-cli to dispatch Codex CLI for a read-only repository research task.
```

```text
Use $opencode to dispatch OpenCode CLI for a scoped repository research task.
```

### Claude Code

Claude Code 会按需发现并加载 Skill。安装后可以自动触发，也可以直接显式调用。

显式调用示例：

```text
/loop-engineering
```

```text
/dev
```

```text
/clarify
```

```text
/acceptance
```

```text
/kimi-code
```

```text
/claude-code
```

```text
/codex-cli
```

```text
/opencode
```

### OpenCode

OpenCode 会按需发现并加载 Skill。只要目录安装正确，就可以通过正常任务描述触发。


## 自动触发建议

- 需要设计或审计 Agent Engineering Methodology、反馈闭环、evaluation loop、多 Agent 工作流治理时使用 `loop-engineering`。
- 新需求默认使用 `dev` 的需求交付路径：聊天确认需求和验收标准、确认方案、编码、测试、验收。
- Bug 默认使用 `dev` 的修复路径：审查与复现、定位根因、确认方案、最小修复、回归测试、验收。
- 长期非需求型 Loop 默认由 `loop-engineering` 定义 loop contract；每次落地改动再交给 `dev` 处理一个有边界的增量。
- `dev` 先判断任务类型和变更边界，只加载与当前任务相关的 reference；不要因为默认触发就读取所有 reference。
- 专门要求“先拷问/访谈/沉淀领域词汇或 ADR”时使用 `clarify`；对多轮、跨文件、高风险或需要委托/验收的任务，`clarify` 应询问是否创建 `loop/` 工作区，访谈结束后再切回 `dev` 实施。
- 专门要求“最终验收/独立复核/go-no-go/验收结论”时使用 `acceptance`；长期 Loop 中只在 milestone、checkpoint 或明确 gate 上调用它，它默认不继续实现，发现问题后交回 `dev` 修复。
- 用户明确指定外部 Agent 时才使用具体 Adapter：`kimi-code`、`claude-code`、`codex-cli`、`opencode`。
- 如果用户没有授权外部委托，不要因为“可能有帮助”就自动调度外部 Agent；先使用 `dev` 完成主流程。

## 外部 Agent Adapter 协议

当用户明确指定外部 Agent 时，调用方 Agent 必须实际调用目标 Agent，不得自行替代、模拟或伪装目标 Agent 的输出。

推荐交付时明确区分：

1. 目标 Agent 的调用状态和原始结论
2. 调用方 Agent 的复核、纠正和补充风险
3. 最终建议和验证结论

如果目标 Agent、CLI、认证或所需权限不可用，必须明确报告失败，并在替换目标或自行完成前征得用户同意。

### 目标 CLI 内部 Skill 路由

外部 CLI 的选择必须显式；但一旦用户或项目策略选定了 `kimi-code`、`claude-code`、`codex-cli` 或 `opencode`，目标 CLI 内部可以根据任务自动使用它能发现的全局/用户级和项目/本地非 Adapter Skill。

- 用户明确指定某个 Skill 时，优先尊重用户指定。
- 当全局 Skill 和项目本地 Skill 都匹配时，优先使用项目本地 Skill，因为它通常更贴近当前仓库的约束、命令和领域语义。
- Agent 方法论、反馈闭环、evaluation loop 或多 Agent 工作流设计优先使用 `loop-engineering`。
- 普通实现或 Bug 修复优先让目标 CLI 使用可发现的 `dev`。
- 需求/架构访谈优先使用 `clarify`。
- 独立 go/no-go 验收优先使用 `acceptance`。
- 子 CLI 不得自动再调用 `kimi-code`、`claude-code`、`codex-cli`、`opencode` 等外部 Agent Adapter，除非用户明确授权多 Agent 编排。
- 目标 CLI 的输出应说明实际使用了哪些 Skill；未使用时说明原因。

## 默认行为

`dev` 默认要求：

- 方案、设计说明、交付文档以中文呈现
- 代码、命令、协议名、配置键名保留原文
- 架构设计和流程设计补充轻量图示
- 行为变更优先测试先行，Bug 修复优先根因定位
- 交付前明确验证方式、review 结论和验收结论
- 保持轻量，不默认引入强制 worktree、长篇 spec 或多 Agent 编排
- 需要时按 reference 加载前端质量、后端架构和数据库工程检查清单，而不是把外部 Skill 原样变成默认长流程

## 许可证

本仓库使用 [MIT License](./LICENSE)。
