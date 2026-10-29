# Codex 子智能体配置

为 Codex 安装一个自定义子智能体角色和一段全局编排规则。与本库的 Skill 相互独立，需要单独安装。

## 安装内容

| 文件 | 安装位置 | 作用 |
| --- | --- | --- |
| `agents/worker.toml` | `$CODEX_HOME/agents/` | `gpt-6.1-terra`，effort `xhigh`：边界明确的代码探索、实现、测试、常规调试和证据核对；关键设计及复杂疑难问题由主智能体负责 |
| `AGENTS.snippet.md` | `$CODEX_HOME/AGENTS.md` | 创建或只替换 `## 全局子智能体编排` 一节，保留其他内容 |

`CODEX_HOME` 未设置时使用 `~/.codex`。角色按职责命名为 `worker`，模型为 GPT-6.1 Terra xhigh；旧调用中的 `luna_worker` 需改为 `worker`。

```sh
node codex/subagents/install.mjs --dry-run   # 只显示将要修改的文件
node codex/subagents/install.mjs             # 安装
node codex/subagents/install.mjs --codex-home /path/to/codex-home
```

安装器的行为：

- 先校验角色 TOML 能解析，且包含 `name`、`description`、`developer_instructions`、`model`、`model_reasoning_effort`。用仓库依赖 `smol-toml` 解析，没有 `node_modules` 时退回 Python 3.11+ 的 `tomllib`。
- 修改前把要覆盖的角色文件、`AGENTS.md` 以及现有 `config.toml` 备份到 `$CODEX_HOME/backups/subagents-<时间戳>/`。
- 不修改 `config.toml`。Codex 会自动发现 `$CODEX_HOME/agents/` 下的角色文件，不需要额外注册，也不会改动主会话的模型或 effort。
- 可重复执行：内容一致时输出 `unchanged`，不写文件也不产生备份。升级时备份并移除旧版 Sol 角色（`sol_worker.toml`、`sol_deep_worker.toml` 及其连字符文件名）和旧 Luna 文件（`luna-worker.toml`、`luna_worker.toml`）（包括该文件的本地修改，可从备份恢复），统一使用 `worker.toml`；不删除其他角色。

## 生效条件

- 使用支持自定义子智能体的 Codex 版本，安装后新开会话。
- 账号能使用 `gpt-6.1-terra`，并支持 `xhigh` effort。
- 主智能体仍要在任务中选择委派，并按名称调用角色；全局规则只授权委派，不保证每个任务都会委派。
- 项目里的 `AGENTS.md` 或同名项目级角色（`.codex/agents/`）可能会覆盖或补充这里的全局设置。

## 验证范围

仓库测试（`npm test`）只验证：TOML 能解析、必填字段和模型取值正确；安装器在临时 `CODEX_HOME` 上的 dry-run、幂等、备份、章节替换，以及不改动 `config.toml`。

测试不会启动 Codex。角色能否被 Codex 实际加载、模型和 effort 是否被接受，要在本机安装后新开会话，调用角色确认。

角色加载成功不证明速度、成本或质量有提升；这些需要在真实任务上对比后再下结论。

## Leader / Worker 分工

主智能体作为 Leader（当前使用 Astra，安装器不固定或改动主模型），负责计划、歧义解释、关键判断及最终验收；GPT-6.1 Terra xhigh 作为 Worker，完整执行有明确边界的探索、实现、测试和修正。按判断需求而非工作量委派，Leader 核对关键差异和原始证据，不默认重做全部工作。

Worker 遇到关键歧义、边界变化或尝试停滞时，交回受阻部分及当前状态、证据、已尝试方法、建议和所需决定，保留成果并继续独立有效的工作。Leader 澄清、调整任务或接手；同一任务优先复用原 Worker，不把未解决的问题原样反复派回。

此分工参考 [Devin Fusion 的 Sidekick 机制](https://cognition.com/blog/devin-fusion)，不实现其运行时模型切换或缓存管理，也不承诺相同成本收益。
