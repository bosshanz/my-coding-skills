# Coding Agent Skills

这是一个面向多 Agent 编码工作流的可移植 Skill 集合。

它提供 `design`、`clarify`、`dev`、`qa`、`acceptance` 和外部 Agent Adapter，让 Codex、Claude Code、Gemini CLI、OpenCode、Grok Build 及其他支持 Agent Skills 的调用方 Agent，可以共享同一套 Skill 内容，并在需要时显式调用 Kimi Code、Claude Code CLI、Codex CLI、OpenCode CLI 或 Grok Build CLI。

核心原则：

- 用户指定谁，就实际调用谁。
- 不能调用时明确失败，不静默替换。
- 不模拟、不伪装、不编造目标 Agent 的输出。
- 外部 Agent 的结果必须可审计、可复核、可验证。
- 对复杂需求和架构选择先做第一性原理拆解，再选择方案。
- 对非平凡设计、修复和验收结论做对抗式审查，主动寻找反例和薄弱假设。

English version: [README.en.md](./README.en.md)

## 仓库内容

当前包含 11 个主 Skill：

### `design`

这是面向 UI 工作的独立设计 Skill，由 `dev` 按需调用，也可以直接触发：

- 交互方向：先定义用户任务、对象与动作、主流程、状态转换、反馈与控制、中断恢复和输入模型
- 新 UI 或可见重塑：在交互层清楚后确定目的、基调、配色、字体、版式和 signature element
- 前端工程质量：交互状态、可访问性、响应式、性能与验收 gate
- AI Native 交互：理解与澄清、proposal / approval / execution 分层、真实 Runtime 进度、steering、takeover、checkpoint 和 resume
- 动效方法论：具体时长、easing 曲线、弹簧参数、编排规则、动画审计清单与术语表，以及“哪里该动、哪里不该动”的判断
- 完整纳入 Anthropic `frontend-design` 的 UI 设计工作流（Apache-2.0），并蒸馏 emilkowalski/skills 的动画方法论（MIT）

触发建议：创建或重塑有意义的 UI，设计或改进用户流程、可用性、信息架构、状态转换、反馈恢复、AI Native 交互，或实现/审计动画与微交互时使用；`dev` 在 UI 或交互实现任务中会自动调用。纯后端工作、已定行为的细碎 CSS 调整、独立业务 QA 或最终验收不需要它。

### `dev`

这是面向真实开发场景的默认 Skill，围绕“新需求交付”和“Bug 修复”两条完整闭环：

- 新需求：从上下文确定目标与验收标准，仅澄清影响结果的未知项，直接实施并按风险验证
- Bug 修复：审查证据、定位根因，实施最小完整修复并验证；已有授权不重复确认
- Superpowers Lite：轻量设计、TDD、系统化调试、review gate 和 evidence-based completion
- UI 设计：有意义的 UI 或交互流程创建、重塑时按需调用独立的 `design` Skill，获得交互方向、视觉方向、前端质量与动效方法论
- 后端工程：服务端行为变更契约：调用方与权限、边界校验、幂等、错误与兼容
- 后端架构：API、服务边界、缓存、消息、失败模式、可观测性和可靠性
- 后端质量：请求权威、租户隔离、错误映射、幂等、超时、测试分层和进程生命周期
- 数据库工程：schema、约束、事务、索引、查询计划、迁移、回填、容量和生产安全
- 第一性原理设计和对抗式审查：从目标、事实、约束和假设推出方案，并主动寻找失败路径
- 交付前对照需求或根因做 diff review，并明确测试、验收和未验证风险

触发建议：新增需求和 Bug 修复都默认触发 `dev`，不需要用户显式写 `$dev`。`dev` 先作为薄调度器判断任务边界，再按矩阵加载相关 reference。只有用户明确要求 Kimi / Claude Code / Codex CLI / OpenCode CLI / Grok Build CLI 等外部 Agent 参与时，才走对应 Adapter。


### `qa`

这是按需使用、面向业务理解、真实用法和 QA 思维的独立 Skill，不是测试脚本执行器：

- 按被问的那一刀作答，不要为了完整把所有用法走一遍
- 先用用户的语言说清这一刀：谁在用、来干什么、成功/失败长什么样、哪条业务规则不能静默坏掉
- 真的在审一条用户旅程时，才按真实用法走该切片：第一次、回访、空态、被拒绝、中途离开、出错后怎么办、旁边哪件事还得能用
- 再用 QA 视角攻击这一刀：产品怎样看起来是绿的，但对用户或业务已经在说谎
- 用户明确要求诊断某条真实用法或用户旅程时才走诊断轨道：回答被问的切片，诊断阶段不改文件；结束该阶段后继续其他已授权工作，包括通过 `dev` 修复；没有剩余请求时才 stop。未覆盖是残留风险，不是待办
- 用户明确要求保护之后，才选择最便宜、会红灯的证据；自动化测试只是证据的一种，禁止从测试目录出发堆脚本
- 契约/覆盖轨道可改测试、夹具和测试配置，不改产品代码，不做 go/no-go

触发建议：只在用户明确写 `$qa` / `/qa`，或明确要求业务测试、QA 思维、某条用户旅程/真实用法诊断、保护已命名业务规则时使用。一般的「看一下」「看下这个 Skill」「review this」不触发 QA；其他 Skill 的建议也不等于用户授权。只说「补 e2e / 回归 / 补测试」、实现功能、开发者测试仍走 `dev`；正式验收走 `acceptance`；业务本身还不清时回 `clarify`。`dev` 不自动调用或例行推荐 `qa`。

### `clarify`

这是动手前的资深产品判断和架构对齐 Skill。它采用资深 PM 的判断方式，但不承接完整 PM 组织职责，负责该不该做、为谁做、关键取舍、第一期切多大、成功怎么算：

- 产品向问题时给出判断（做、先试、停），明确目标用户、用户任务、优先级与关键取舍
- 有可能改变判断的未知项时，一次只问一个高价值问题并给出推荐答案；证据充分时直接给建议
- 信心不足时优先定义低成本实验，以及实验需要解锁的下一项决策
- 能从仓库文档或代码查到的事实就先查，不把问题抛回给用户
- 对 solution-shaped 的请求做第一性原理拆解，分离目标、事实、约束、假设和非目标
- 需要时维护 `CONTEXT.md` 里的领域词汇，但不把它变成实现方案或草稿
- 只在决策难以逆转、未来读者会疑惑、且确有取舍时建议写 ADR
- 用户明确要求且判断已经清楚时，可以输出轻量产品方案、决策 memo、PRD 或实验 brief
- 不承接持续 roadmap、backlog/sprint 管理、stakeholder 协调、交付跟踪或排期承诺，也不模拟已经接管；即使显式调用 `$clarify`，也应简短说明边界并停止，最多建议把一次性的决策或运营机制文档作为后续独立任务，并明确持续执行所需的人类负责人或授权系统。对齐后默认交给 `dev` 实施或 `design` 定交互/视觉；只有用户明确要求独立业务/真实用法检查时才交给 `qa`

触发建议：用户明确要求 `$clarify`、产品分析、要不要做/做什么、目标用户、优先级与取舍、第一期怎么切、成功怎么算、低成本实验、需求拷问、方案访谈，或需要沉淀领域词汇/ADR 时使用；普通开发请求仍走 `dev`。

### `acceptance`

这是一个顶层独立验收 Skill，用于在实现完成后做单独的 go/no-go 复核：

- 对照澄清后的需求、验收标准、issue、PR 描述或任务记录
- 审查当前 diff、测试证据、CI、手动验证、截图、日志、文档、迁移和回滚说明
- 对验收结论做对抗式反证，检查边界输入、权限、并发、迁移、回滚和恢复路径
- 默认只验收不改代码；直接判断真实用法/业务证据是否充分并记录具体缺口，产品行为错走 `$dev`，目标不清走 `$clarify`；只有用户明确要求独立业务/真实用法保护时才使用 `$qa`
- 输出 `accepted`、`accepted with risk` 或 `rejected`

触发建议：用户明确写 `$acceptance`、要求最终验收、要求独立复核 `dev` 结果或需要上线前 go/no-go 判断时使用。验收以证据为准，不要求先经过 QA。

### `reflect`
这是显式 taste 回路的独立 Skill,把用户在会话里给出的持久性纠正沉淀到 always-on 层,让下一个会话一开始就知道:
- 只接「持久性纠正/偏好」:点名 `$reflect`,或用户说出「以后…」「别再…」「always / stop doing」这类可泛化的话
- 一次信号只提炼一行:做什么、适用范围、来源;没有来源不入库
- 落盘前必须逐条确认；当前纠正立即遵循，待确认只阻塞偏好写入，其他已授权工作继续；绝不臆测用户「大概喜欢」，绝不静默写入
- 本仓库写 `AGENTS.md` 的 `## Taste` 区;消费方项目写其已有的 always-on 说明文件,没有就问,绝不擅自新建配置
- 纠正暴露出某个 SKILL.md 本身教错了,只指认和提议,不越权改
触发建议:一次性任务反馈(「这个变量改名」)不触发;产品/业务规则走 `clarify` / `qa`;普通需求走 `dev`。

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

### `grok-build-cli`

这是一个让其他 Agent 调度 Grok Build CLI 的 Skill，重点包括：

- 支持仓库研究、独立 review、有边界的实现任务和终端自动化
- 支持 `grok -p` 非交互调用、JSON / schema 输出、session 续接和工具白名单
- 默认限制 `--always-approve` / `--yolo`，并要求调用方 Agent 复核结果
- 包含 Grok Build CLI 安装、登录、Skill / Rules 目录和命令参考

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
design/
  SKILL.md
  agents/openai.yaml
  references/
    interaction.md
    design-direction.md
    quality.md
    animation.md
    anthropic-frontend-design-LICENSE.txt
dev/
  SKILL.md
  agents/openai.yaml
  references/
    superpowers-lite.md
    stack.md
    design-and-research.md
    documentation.md
    backend-engineering.md
    backend-architecture.md
    backend-quality.md
    database-engineering.md
qa/
  SKILL.md
  agents/openai.yaml
clarify/
  SKILL.md
  agents/openai.yaml
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
grok-build-cli/
  SKILL.md
  agents/openai.yaml
  references/
    grok-build-cli-reference.md
  scripts/
    grok-build-cli-status.sh
adapters/
  contract.md
  adapters.yaml
evals/
  routing/
    fixtures.yaml
    runner.mjs
    prompt.md
  behavior/
    fixtures.yaml
    runner.mjs
  e2e/
    smoke.mjs
  results/
    README.md
scripts/
  skills-doctor.sh
  check-routing-policy.mjs
  test-install-safety.sh
  sync-adapters.mjs
bin/
  skills.mjs
package.json
package-lock.json
CHANGELOG.md
LICENSE
README.md
README.en.md
install.sh
uninstall.sh
```


## Dev 集成方向

`dev` 不是完整 Superpowers 的安装包。它是一个默认触发的薄调度器：

- 从 Superpowers 吸收轻量工程纪律：澄清、设计、计划、TDD、系统化调试、review gate、完成前验证和 evidence over claims。
- 从 Matt Pocock 的 Skills 吸收更硬的工程规则：red-capable 调试反馈环、tracer-bullet TDD、deep module / seam / interface 架构词汇。
- UI 交互方向、视觉方向、前端质量与动效方法论由独立的 `design` Skill 提供：产品型 UI 先定义用户任务、对象/动作、主流程、状态转换、反馈控制与恢复，再让视觉层强化交互层级；视觉重塑继续使用完整的 Anthropic `frontend-design` 工作流，并按需使用从 emilkowalski/skills 蒸馏的动画方法论。`dev` 在做有意义的 UI 或交互实现时按需调用它。上游 Apache-2.0 正文与许可证随 `design` 分发。
- 从资深数据库工程实践吸收数据建模、约束、事务、索引、查询计划、迁移、回填和生产数据库安全。
- 从第一性原理约束后端实现质量：权威、真实效果、有界资源、重试环境、可观测性卫生和能证明不变量的测试。
- 用第一性原理约束方案选择，用对抗式审查反证设计、修复和完成声明。
- 按任务边界懒加载 reference，不把所有检查清单变成每个任务的默认上下文。
- 保留轻量边界：默认不强制 worktree、长 spec、每任务 subagent 或完整 Superpowers 安装。
- 顶层 `qa` 是用户按需选择的独立业务/真实用法检查；`dev` 保留开发者测试和相称的业务风险验证，直接报告证据缺口，不把 `$qa` 变成默认下一阶段。
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

# 只安装 UI 设计 Skill
./install.sh ui --target agents --force

# 只安装默认研发工作流到开放标准目录
./install.sh dev --target agents --force

# 只安装产品判断 / 架构对齐 Skill
./install.sh planning --target agents --force

# 只安装业务/用法 QA Skill
./install.sh qa --target agents --force

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

- `design`：UI 交互方向、视觉方向、前端质量与动效方法论
- `dev`：默认研发工作流，集成 Superpowers Lite，UI 任务按需调用 `design`
- `qa`：先理解业务和真实用法，再用 QA 思维保护，而不是堆测试脚本
- `clarify`：动手前的资深产品判断和架构对齐，不承接持续 PM 运营与交付管理
- `acceptance`：独立验收与 go/no-go 复核
- `kimi-code` / `claude-code` / `codex-cli` / `opencode` / `grok-build-cli`：外部 Agent Adapter
- `workflow`：只安装 `dev`
- `ui`：只安装 `design`
- `planning`：兼容分组名，只安装负责产品判断 / 架构对齐的 `clarify`
- `quality`：安装 `qa` 和 `acceptance`
- `delegation`：安装五个外部 Agent Adapter
- `adapters`：只安装五个 Adapter
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
for skill in design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli; do
  cp -R "$skill" "$HOME/.agents/skills/"
done
```

如果目标工具不扫描 `~/.agents/skills/`，将相同目录复制到对应位置：

```bash
# Claude Code
mkdir -p "$HOME/.claude/skills"
cp -R design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli "$HOME/.claude/skills/"

# Gemini CLI
mkdir -p "$HOME/.gemini/skills"
cp -R design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli "$HOME/.gemini/skills/"

# OpenCode
mkdir -p "$HOME/.config/opencode/skills"
cp -R design clarify dev qa acceptance kimi-code claude-code codex-cli opencode grok-build-cli "$HOME/.config/opencode/skills/"
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
Use $dev to implement a new feature with a brief plan first, then verify it and update docs.
```

```text
Use $qa to first understand the real business and how a user uses it, then protect those journeys. Do not start from test scripts.
```

```text
Use $design to review and improve the animations on this page.
```

```text
Use $design to redesign this multi-step publish flow, including state transitions, cancellation, retry, and recovery before visual polish.
```

```text
Use $clarify to clarify this refactor one question at a time before we implement it.
```

```text
Use $clarify to decide whether we should build this, who it is for, and what the first slice is.
```

```text
Use $clarify to prioritize these product opportunities, explain the key tradeoffs, and propose the cheapest experiment that could change the decision.
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

```text
Use $grok-build-cli to dispatch Grok Build CLI for a scoped repository research task.
```

### Claude Code

Claude Code 会按需发现并加载 Skill。安装后可以自动触发，也可以直接显式调用。

显式调用示例：

```text
/design
```

```text
/dev
```

```text
/qa
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

```text
/grok-build-cli
```

### OpenCode

OpenCode 会按需发现并加载 Skill。只要目录安装正确，就可以通过正常任务描述触发。


## 自动触发建议

- 创建或重塑有意义的 UI，设计或改进用户流程、可用性、状态转换、反馈恢复、AI Native 交互，或实现/审计动画与微交互时使用 `design`；`dev` 在 UI 或交互实现任务中会自动调用它。
- 新需求默认使用 `dev` 的需求交付路径：确定目标和验收标准、选择兼容方案、编码、按风险测试和验收；流程步骤不要求逐轮确认。
- Bug 默认使用 `dev` 的修复路径：审查与复现、定位根因、最小修复、相关回归验证和验收。
- `dev` 先判断任务类型和变更边界，只加载与当前任务相关的 reference；不要因为默认触发就读取所有 reference。
- 专门要求产品分析、要不要做/做什么、目标用户、优先级与取舍、第一期怎么切、成功怎么算、低成本实验，或先拷问/访谈/沉淀领域词汇或 ADR 时使用 `clarify`；它采用资深 PM 判断，但不负责持续 PM 运营，下一步默认是 `$dev` 实施、`$design` 定交互/视觉或 stop。
- 只有用户明确调用 `$qa` / `/qa`，或明确要求业务测试、QA 思维、某条用户旅程/真实用法诊断、保护已命名业务规则时才使用 `qa`。一般的「看一下」「review」不触发；只说「补 e2e / 回归 / 补测试」仍走 `dev`。
- 专门要求“最终验收/独立复核/go-no-go/验收结论”时使用 `acceptance`；它默认不继续实现，并直接判断业务与真实用法证据是否充分。产品缺陷交 `$dev`，目标不清交 `$clarify`；仅在用户明确要求时才把独立业务/用法保护交给 `$qa`。
- 用户明确指定外部 Agent 时才使用具体 Adapter：`kimi-code`、`claude-code`、`codex-cli`、`opencode`、`grok-build-cli`。
- 如果用户没有授权外部委托，不要因为“可能有帮助”就自动调度外部 Agent；先使用 `dev` 完成主流程。

## 路由与行为评估（Evals）

整体流程见 [工作流程与评估](docs/workflow.md)。各类证据分开报告：

| 检查 | 范围 | 命令 |
| --- | --- | --- |
| 静态 | 结构、fixture 加载、安装安全、评估器正反例 | `npm test` |
| 路由代理 | 默认 description；可显式加入 when_to_use | `npm run eval:routing -- --surface description` |
| 回答契约 | 文本输出字段、枚举和约束 | `npm run eval:behavior` |
| 宿主自报 | 已授权 CLI 自报 Skill 选择，不证明实际执行 | `npm run eval:e2e -- --cli <目标>` |
| 真实执行 | 临时项目的实现、只读范围、授权后继续 | `npm run eval:execution -- --prepare` |

首次失败不会被重试覆盖。路由 `--recheck` 只提供诊断；回答评估默认一次，`--attempts 2` 保留首次及后续结果。`--record` 保存 Markdown 和原始回答 JSON。两种 catalog 输入面分别报告，不能当成所有宿主的发现机制。

真实执行需要调用方在已授权 Agent 中执行生成的任务、原样保存回复，再运行 `npm run eval:execution -- --verify <目录>`；文件快照与独立行为检查不依赖 Agent 自述。确认问题、暂时越界及复杂多轮行为需要检查真实运行记录。具体步骤和限制见工作流程文档。

五个适配器共享内容由 `adapters/contract.md` 生成，改动后运行 `npm run adapters:sync`。nightly 仍运行路由和回答代理评估，需要 `ANTHROPIC_API_KEY`；不会自动启动真实执行 Agent。历史评估报告保持原样，不与新口径直接比较。

## 外部 Agent Adapter 协议

当用户明确指定外部 Agent 时，调用方 Agent 必须实际调用目标 Agent，不得自行替代、模拟或伪装目标 Agent 的输出。

推荐交付时明确区分：

1. 目标 Agent 的调用状态和原始结论
2. 调用方 Agent 的复核、纠正和补充风险
3. 最终建议和验证结论

如果目标 Agent、CLI、认证或所需权限不可用，必须明确报告失败，并在替换目标或自行完成前征得用户同意。

安装配置或排障咨询使用相关参考文件和本地检查，本身不授权委派；仅仅加载适配器也不需要询问是否委派。静态评审默认只读；已授权评审所需的验证可使用必要命令和隔离临时产物，但不授权修改被审查源码、操作生产数据或绕过批准。用户明确禁止一切文件写入时保持只读，并说明由此产生的验证缺口。

### 目标 CLI 内部 Skill 路由

外部 CLI 的选择必须显式；但一旦用户在当前请求或此前明确的持续指令中选定了 `kimi-code`、`claude-code`、`codex-cli`、`opencode` 或 `grok-build-cli`，目标 CLI 内部可以根据任务自动使用它能发现的全局/用户级和项目/本地非 Adapter Skill。项目策略只有在用户明确采纳且适用于当前范围时才算授权，发现策略文件本身不算授权。

- 用户明确指定某个 Skill 时，优先尊重用户指定。
- 当全局 Skill 和项目本地 Skill 都匹配时，优先使用项目本地 Skill，因为它通常更贴近当前仓库的约束、命令和领域语义。
- UI 交互设计、视觉方向、可用性、AI Native 交互或动效工作优先使用 `design`。
- 普通实现或 Bug 修复优先让目标 CLI 使用可发现的 `dev`。
- 资深产品判断、需求或架构发现优先使用 `clarify`；持续 roadmap、backlog/sprint 管理、stakeholder 协调与交付跟踪不属于它。
- 用户明确要求独立的业务理解、真实用法诊断或 QA 保护时才使用 `qa`。
- 独立 go/no-go 验收优先使用 `acceptance`。
- 子 CLI 不得自动再调用 `kimi-code`、`claude-code`、`codex-cli`、`opencode`、`grok-build-cli` 等外部 Agent Adapter，除非用户明确授权多 Agent 编排。
- 目标 CLI 的输出应说明实际使用了哪些 Skill；未使用时说明原因。

## 默认行为

`dev` 默认要求：

- 方案、设计说明、交付文档以中文呈现
- 代码、命令、协议名、配置键名保留原文
- 架构设计和流程设计补充轻量图示
- 行为变更优先测试先行，Bug 修复优先根因定位
- 交付前明确验证方式、review 结论和验收结论
- 保持轻量，不默认引入强制 worktree、长篇 spec 或多 Agent 编排
- 需要时按 reference 或 `design` Skill 加载前端设计、后端架构、后端质量和数据库工程检查清单，而不是把外部 Skill 原样变成默认长流程

## 许可证

本仓库自有内容使用 [MIT License](./LICENSE)。`design/references/design-direction.md` 是随仓库分发的第三方 Apache-2.0 内容，其完整许可证位于 [design/references/anthropic-frontend-design-LICENSE.txt](./design/references/anthropic-frontend-design-LICENSE.txt)；`design/references/animation.md` 蒸馏自 MIT 许可的 [emilkowalski/skills](https://github.com/emilkowalski/skills)。

## GPT-6 提示词适配

依据 [GPT-6 Astra 官方提示词指导](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#prompting-best-practices)（2026-09-05 核对），本库优化持续执行、指令冲突、输出详略、授权后的委派和适度验证。模型选择与 CLI 权限参数保持各适配器的原有约定。

仓库规则统一放在 [AGENTS.md](AGENTS.md)，`CLAUDE.md` 引用它；安装 Skill 不会把本仓库规则写入消费项目。独立安装的 Skills 自带相关执行边界：清楚的实施请求直接完成，必要澄清只阻塞依赖该答案的工作，已有授权不重复索取。QA、仅评审请求、外部 Agent 调用和偏好持久化保留各自边界。

`npm test` 与 `npm run doctor` 验证静态约束、适配器同步及安装安全；behavior fixtures 包含简短交付、复用授权、澄清后继续和仅计划场景。文本评估后端使用 Anthropic / Claude，dry-run 只检查场景加载；真实执行结果单独记录宿主、测试范围和限制，不以静态通过代替模型证据。
