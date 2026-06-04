# Agent Delegation Skills

这是一个面向多 Agent 编码工作流的可移植 Skill 集合。

它提供研发工作流和外部 Agent 委托协议，让 Codex、Claude Code、OpenCode 及其他支持终端命令的调用方 Agent，可以将任务显式委托给 Kimi Code、Claude Code CLI 或 Codex CLI，并对结果进行复核、整合和交付。

核心原则：

- 用户指定谁，就实际调用谁。
- 不能调用时明确失败，不静默替换。
- 不模拟、不伪装、不编造目标 Agent 的输出。
- 外部 Agent 的结果必须可审计、可复核、可验证。

English version: [README.en.md](./README.en.md)

## 仓库内容

当前包含 5 个主 Skill：

### `agent-delegation`

这是外部 Agent 委托的总入口 Skill，重点包括：

- 定义显式委托优先级：用户指定优先，项目策略其次，自动路由必须获得授权
- 禁止伪调用、静默 fallback 和未授权的外部 Agent 调度
- 统一目标 Agent 输出、调用方复核、调用证据和最终交付的结构
- 约束权限、凭证、失败处理、单跳委托和同 Agent 子进程调用
- 提供轻量 doctor 脚本检查 Skill 结构、旧路径、脚本权限和目标 CLI 可用性

### `dev-workflow`

这是一个面向全栈研发工作流的轻量 Skill，重点包括：

- 先澄清、先出轻量方案，再执行
- 非简单任务先做方案对比并给出推荐
- 前端设计、UI 设计、交互设计、状态所有权、可访问性和性能排查路径
- 后端技术调研、架构设计、容量估算、API/事件合同、迁移、失败模式和中间件选型
- 基于 Python、Node、Go 的实现落地
- 行为变更优先按 RED-GREEN-REFACTOR 做测试先行
- Bug 修复先复现、定位根因，再最小化修复
- 交付前做 diff review、验证测试、中文交付、精简文档补充
- 架构和流程设计配套图示，优先 Mermaid

触发建议：普通编码、修 Bug、重构、调试、测试、review、文档、UI 设计、后端调研和架构任务应默认触发 `dev-workflow`，不需要用户显式写 `$dev-workflow`。只有用户明确要求 Kimi / Claude Code / Codex CLI 等外部 Agent 时，才走 `agent-delegation` 或对应 Adapter。

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

## 兼容性

这个仓库同时兼容以下运行时：

- `Codex`
- `Claude Code`
- `OpenCode`

兼容方式如下：

- `Codex` 使用 `agent-delegation/SKILL.md`
- `Codex` 使用 `dev-workflow/SKILL.md`
- `Codex` 使用 `kimi-code/SKILL.md`
- `Codex` 使用 `claude-code/SKILL.md`
- `Codex` 使用 `codex-cli/SKILL.md`
- `Claude Code` 使用 `agent-delegation/SKILL.md`
- `Claude Code` 使用 `dev-workflow/SKILL.md`
- `Claude Code` 使用 `kimi-code/SKILL.md`
- `Claude Code` 使用 `claude-code/SKILL.md`
- `Claude Code` 使用 `codex-cli/SKILL.md`
- `OpenCode` 使用 `agent-delegation/SKILL.md`
- `OpenCode` 使用 `dev-workflow/SKILL.md`
- `OpenCode` 使用 `kimi-code/SKILL.md`
- `OpenCode` 使用 `claude-code/SKILL.md`
- `OpenCode` 使用 `codex-cli/SKILL.md`

说明：

- `agents/openai.yaml` 主要给 Codex 提供更好的 UI 展示元数据。
- `SKILL.md` 和 `references/` 是三种运行时共享的主体内容。
- `Claude Code` 和 `OpenCode` 都支持 `SKILL.md` 目录式 Skills。

## 目录结构

```text
agent-delegation/
  SKILL.md
  agents/openai.yaml
  references/
    routing-policy.md
    output-contract.md
    safety-policy.md
    invocation-evidence.md
    platform-compatibility.md
  scripts/
    agent-delegation-doctor.sh
dev-workflow/
  SKILL.md
  agents/openai.yaml
  references/
    stack.md
    design-and-research.md
    documentation.md
    frontend-quality.md
    backend-architecture.md
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
LICENSE
README.md
README.en.md
```


## Comet 吸收方向

本仓库参考 [Comet](https://github.com/rpamis/comet) 项目的工程化思路，但不照搬其 OpenSpec + Superpowers 五阶段流程。当前只吸收第一阶段能力：

- 用调用证据证明目标 Agent 被真实调用，而不是由调用方模拟。
- 用轻量 doctor 脚本检查 Skill 结构、脚本权限、旧目录残留和目标 CLI 可用性。
- 用平台兼容文档区分已验证运行时和计划支持运行时。
- 保持 `agent-delegation` 轻量，不引入完整 installer、状态机或自动多 Agent 编排。

```bash
agent-delegation/scripts/agent-delegation-doctor.sh
```

## 安装方式

### 1. 安装到 Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R agent-delegation "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R dev-workflow "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R kimi-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R claude-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R codex-cli "${CODEX_HOME:-$HOME/.codex}/skills/"
```

### 2. 安装到 Claude Code

```bash
mkdir -p "$HOME/.claude/skills"
cp -R agent-delegation "$HOME/.claude/skills/"
cp -R dev-workflow "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
cp -R claude-code "$HOME/.claude/skills/"
cp -R codex-cli "$HOME/.claude/skills/"
```

### 3. 安装到 OpenCode

推荐两种方式，任选其一：

方式 A，使用 OpenCode 原生目录：

```bash
mkdir -p "$HOME/.config/opencode/skills"
cp -R agent-delegation "$HOME/.config/opencode/skills/"
cp -R dev-workflow "$HOME/.config/opencode/skills/"
cp -R kimi-code "$HOME/.config/opencode/skills/"
cp -R claude-code "$HOME/.config/opencode/skills/"
cp -R codex-cli "$HOME/.config/opencode/skills/"
```

方式 B，复用 Claude Code 目录：

```bash
mkdir -p "$HOME/.claude/skills"
cp -R agent-delegation "$HOME/.claude/skills/"
cp -R dev-workflow "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
cp -R claude-code "$HOME/.claude/skills/"
cp -R codex-cli "$HOME/.claude/skills/"
```

## 推荐安装策略

如果你希望同时兼容 `Codex`、`Claude Code`、`OpenCode`，建议把仓库保留在任意开发目录，然后按各自运行时建立副本或软链接。

最省维护成本的方式是：

1. `Codex` 安装到 `${CODEX_HOME:-$HOME/.codex}/skills/<skill-name>`
2. `Claude Code` 安装到 `~/.claude/skills/<skill-name>`
3. `OpenCode` 安装到 `~/.config/opencode/skills/<skill-name>`
4. 如果你想让 `OpenCode` 走 Claude 兼容路径，也可以安装到 `~/.claude/skills/<skill-name>`

## 使用方式

### Codex

可以直接显式调用；普通开发任务也应由运行时自动匹配 `dev-workflow`，不需要总是写 `$dev-workflow`：

```text
Use $agent-delegation to ask Kimi Code to review this module, then separately verify its findings.
```

```text
Use $dev-workflow to implement a new feature with a brief plan first, then verify it and update docs.
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

### Claude Code

Claude Code 会按需发现并加载 Skill。安装后可以自动触发，也可以直接显式调用。

显式调用示例：

```text
/agent-delegation
```

```text
/dev-workflow
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

### OpenCode

OpenCode 会按需发现并加载 Skill。只要目录安装正确，就可以通过正常任务描述触发。


## 自动触发建议

- 普通软件研发请求默认使用 `dev-workflow`：实现功能、修 Bug、调试、重构、测试、review、文档、UI/交互设计、后端调研、架构设计和中间件集成。
- 用户明确指定外部 Agent 时才使用 `agent-delegation` 或具体 Adapter：`kimi-code`、`claude-code`、`codex-cli`。
- 如果用户没有授权外部委托，不要因为“可能有帮助”就自动调度外部 Agent；先使用 `dev-workflow` 完成主流程。

## Agent 委托协议

当用户明确指定外部 Agent 时，调用方 Agent 必须实际调用目标 Agent，不得自行替代、模拟或伪装目标 Agent 的输出。

推荐交付时明确区分：

1. 目标 Agent 的调用状态和原始结论
2. 调用方 Agent 的复核、纠正和补充风险
3. 最终建议和验证结论

如果目标 Agent、CLI、认证或所需权限不可用，必须明确报告失败，并在替换目标或自行完成前征得用户同意。

## 默认行为

`dev-workflow` 默认要求：

- 方案、设计说明、交付文档以中文呈现
- 代码、命令、协议名、配置键名保留原文
- 架构设计和流程设计补充轻量图示
- 行为变更优先测试先行，Bug 修复优先根因定位
- 交付前明确验证方式、review 结论和验收结论
- 保持轻量，不默认引入强制 worktree、长篇 spec 或多 Agent 编排
- 需要时按 reference 加载前端质量和后端架构检查清单，而不是把外部 Skill 原样变成默认长流程

## 许可证

本仓库使用 [MIT License](./LICENSE)。
