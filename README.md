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

这是面向真实开发场景的默认 Skill，围绕“新需求交付”和“Bug 修复”两条完整闭环：

- 新需求：聊天澄清目标与验收标准，确认方案，再实施编码、测试和验收
- Bug 修复：审查问题、稳定复现、定位根因、确认修复方案，再实施最小修复、回归测试和验收
- Superpowers Lite：轻量设计、TDD、系统化调试、review gate 和 evidence-based completion
- Frontend Design：页面目的、审美方向、交互流程、完整状态、可访问性和响应式验收
- 后端架构：API、数据、存储、缓存、消息、迁移、失败模式、可观测性和可靠性
- 交付前对照需求或根因做 diff review，并明确测试、验收和未验证风险

触发建议：新增需求和 Bug 修复都默认触发 `dev-workflow`，不需要用户显式写 `$dev-workflow`。只有用户明确要求 Kimi / Claude Code / Codex CLI 等外部 Agent 参与时，才走 `agent-delegation` 或对应 Adapter。

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
    superpowers-lite.md
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
install.sh
```


## Dev Workflow 集成方向

`dev-workflow` 不是完整 Superpowers 的安装包，也不是单独的前端设计 Skill。它是一个默认触发的集合体：

- 从 Superpowers 吸收轻量工程纪律：澄清、设计、计划、TDD、系统化调试、review gate、完成前验证和 evidence over claims。
- 从 Frontend Design 吸收 UI 质量纪律：先确定审美方向，避免 generic AI UI，覆盖真实状态、交互、可访问性和性能。
- 保留轻量边界：默认不强制 worktree、长 spec、每任务 subagent 或完整 Superpowers 安装。

## Comet 吸收方向

本仓库参考 [Comet](https://github.com/rpamis/comet) 项目的工程化思路，但不照搬其 OpenSpec + Superpowers 五阶段流程。当前只吸收第一阶段能力：

- 用调用证据证明目标 Agent 被真实调用，而不是由调用方模拟。
- 用轻量 doctor 脚本检查 Skill 结构、脚本权限、旧目录残留和目标 CLI 可用性。
- 用平台兼容文档区分已验证运行时和计划支持运行时。
- 保持 `agent-delegation` 轻量；只提供目录复制型 `install.sh`，不引入包管理器、状态机或自动多 Agent 编排。

```bash
agent-delegation/scripts/agent-delegation-doctor.sh
```

## 安装方式

### 方式 A：使用 `install.sh`（推荐）

仓库根目录提供零依赖 Shell 安装器，不需要 Node、npm 或 npm registry。克隆仓库后直接执行：

```bash
git clone <your-repository-url>
cd my-coding-skills
./install.sh all --target codex --force
```

常用示例：

```bash
# 默认：安装全部 Skill 到 Codex
./install.sh

# 只安装默认研发工作流到 Codex
./install.sh dev-workflow --target codex --force

# 安装全部 Skill 到 Claude Code
./install.sh all --target claude --force

# 安装委托协议和三个外部 Agent Adapter 到 OpenCode
./install.sh delegation --target opencode --force

# 同时安装到 Codex、Claude Code、OpenCode
./install.sh all --target all --force

# 安装到自定义目录
./install.sh dev-workflow --dest /tmp/skills --force

# 只预览操作，不写入文件
./install.sh all --target codex --dry-run

# 查看帮助、Skill 和分组
./install.sh --list
```

支持的 Skill / 分组：

- `dev-workflow`：默认研发工作流，集成 Superpowers Lite 和 Frontend Design
- `agent-delegation`：外部 Agent 委托协议
- `kimi-code` / `claude-code` / `codex-cli`：外部 Agent Adapter
- `workflow`：只安装 `dev-workflow`
- `delegation`：安装 `agent-delegation` 和三个 Adapter
- `adapters`：只安装三个 Adapter
- `all`：安装全部 Skill；未指定 Skill 时的默认值

安装器支持：

- `--target codex|claude|opencode|all`
- `--dest <directory>`
- `--force` / `-f`
- `--dry-run`
- `--list`

### 方式 B：手动复制安装

#### 1. 安装到 Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R agent-delegation "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R dev-workflow "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R kimi-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R claude-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R codex-cli "${CODEX_HOME:-$HOME/.codex}/skills/"
```

#### 2. 安装到 Claude Code

```bash
mkdir -p "$HOME/.claude/skills"
cp -R agent-delegation "$HOME/.claude/skills/"
cp -R dev-workflow "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
cp -R claude-code "$HOME/.claude/skills/"
cp -R codex-cli "$HOME/.claude/skills/"
```

#### 3. 安装到 OpenCode

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

- 新需求默认使用 `dev-workflow` 的需求交付路径：聊天确认需求和验收标准、确认方案、编码、测试、验收。
- Bug 默认使用 `dev-workflow` 的修复路径：审查与复现、定位根因、确认方案、最小修复、回归测试、验收。
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
