---
name: external-cli
description: "只有当前请求或用户此前明确的持续指令选定某个 CLI 时，才派发 Claude Code、Codex CLI、Kimi Code、OpenCode 或 Grok Build。也处理用户要求的这些 CLI 的配置和故障排查。"
when_to_use: "用户明确选择后使用，例如：用 Claude Code、让 Codex CLI、用 Kimi Code、让 OpenCode、用 Grok、grok、$external-cli、$claude-code、$codex-cli、$kimi-code、$opencode、$grok-build-cli。使用指定 CLI 调查、审查或实现。安装、登录、会话或参数问题使用对应参考和本地检查，无需派发。必须实际调用目标，准确报告不可用情况，不静默替换其他 Agent。若调用方本身就是指定 CLI，直接回答，除非用户要求隔离的独立执行。"
argument-hint: "[CLI 与任务]"
---

# 外部 CLI

只有当前请求或用户此前明确的持续指令为当前范围选定了外部编码 CLI，才使用它。发现项目策略文件本身不算授权，除非用户明确采纳。加载本 Skill 不构成委派授权。配置和排障可以只做本地检查，无需派发。

如果调用方本身就是指定 CLI，直接完成普通工作。仅在用户明确要求 CLI 自动化或隔离的独立执行时启动子进程。

## 执行约定

- 实际调用指定 CLI。不得冒充其输出或静默替换其他 Agent。若不可用、无法认证、缺少上下文或会违反权限，报告具体阻塞。未调用就不得声称完成。任务规模本身不会取消用户的明确选择。
- 提供目标、已确定决策、已有授权、负责文件、约束、预期结果和适度验证要求。区分仅审查与实现。要求它完成已授权工作，依据证据解决常规选择；Skill 建议不能覆盖宿主指令或用户范围。
- 已授权并行工作时，分配互不重叠的职责，并告知各 Agent 共用工作区。独立审查由未参与实现者先依据原始目标、标准、版本和原始证据判断。如实说明共享上下文的限制；用检查解决分歧，不以共识代替证据。
- 静态审查保持只读。已授权验证可以在现有沙箱和审批约束内使用必要命令和隔离的临时产物；这不授权修改被审查源码或生产数据。
- 要求返回结果、相关改动或发现、实际命令与结果、重要缺口。解析失败时保留原始输出。发现是供调用方使用的证据，不是扩大范围的授权。调用方检查改动并负责最终交付。
- 除非用户明确要求进一步编排，委派只做一层。要求独立子任务不授权该子任务再次委派。
- 不输出令牌、API 密钥、`auth.json` 或其他凭据。默认不启用跳过审批或 yolo 参数。

## 目标上下文

遵守目标的宿主规则、项目指令，以及用户对 Skill 的选择或禁用要求。普通实现、澄清和测试由目标直接完成。仅在相关且获准时使用可选 Skill 或参考。

## 选择 CLI

只阅读匹配的参考，不加载其他参考。

| 用户指定 | 可执行文件 | 状态检查 | 无头命令（默认） | ACP（仅会话或编辑器集成） | 参考 |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `claude` | `scripts/claude-code-status.sh` | `claude -p` | `npx -y @agentclientprotocol/claude-agent-acp` | `references/claude-code.md` |
| Codex CLI | `codex` | `scripts/codex-cli-status.sh` | `codex exec` | `npx -y @agentclientprotocol/codex-acp` | `references/codex-cli.md` |
| Kimi Code | `kimi` | `scripts/kimi-code-status.sh` | `kimi -p` | `kimi acp` | `references/kimi-code.md` |
| OpenCode | `opencode` | `scripts/opencode-status.sh` | `opencode run` | `opencode acp` | `references/opencode.md` |
| Grok、Grok Build、Grok CLI、`grok` | `grok` | `scripts/grok-build-cli-status.sh` | `grok -p` | `grok agent stdio` | `references/grok-build.md` |

## 起步步骤

1. 从表中确认用户选定的 CLI。
2. 在新环境中，从本 Skill 目录运行对应状态脚本。
3. 缺少可执行文件时，说明官方安装选项；未经批准不安装。
4. 缺少认证时，请用户完成该 CLI 的登录。绝不索取或输出凭据。
5. 从目标仓库目录运行，使项目指令和 Skills 能被发现。

## 派发

默认使用表中的无头命令，执行范围明确的研究、审查或实现。

传入简短提示词，注明模式（`research-only`、`review-only`、`propose-only` 或 `implement`）、工作目录、文件边界、是否允许修改与测试，以及用户对 Skill 的选择或禁用要求。提示词应保持范围明确。

ACP 不是默认方式。仅当用户需要由客户端驱动的会话或编辑器集成，且确有 ACP 客户端驱动服务端时，才使用 ACP 列。不要在一次性 shell 中手写 ACP JSON-RPC。`acpx` 这类工具是 ACP 客户端；没有客户端而直接启动 `kimi acp` 或 `grok agent stdio`，会阻塞在反向权限和文件系统请求上。

要求 CLI 返回：处理模式、检查或修改的文件、执行的命令、证据、假设和未解决风险。仓库证据支持之前，其输出仅作为建议。

对参数有疑问时，使用指定 CLI 的 `--help` 检查；能力会随版本变化。
