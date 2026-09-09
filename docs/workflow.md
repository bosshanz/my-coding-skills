# 按需能力与证据

## 普通工作直接完成

当前 Agent 负责理解目标、实现、验证和交付；无需先进入 `dev` 或 `clarify`。项目命令、领域约束和已有授权优先。用户要求不用 Skill 时，直接工作。

需要具体设计决策时查阅 `design` 中相关资料；业务规则检查、真实旅程诊断或最终验收使用明确请求的 `verify`；记录偏好显式调用 `reflect`。它们不是自动流水线。`verify` 仅评审时只读，要求保护规则时可改测试，修复已授权时继续实施。Skill 切换不重置授权，也不授权外部 CLI、发布或生产操作。

工程资料独立放在 [references/README.md](../references/README.md)，随源码和 npm 包分发，安装 Skill 不会自动安装或加载它们。`skills references` 显示资料位置。按问题查阅，消费项目可以选取适用资料放入自己的文档。

## 安装和升级

安装与卸载均需明确选择 Skill 或分组，无参数只显示帮助；默认目标为 `agents`。`all` 是显式的全量选择。安装器不自动清理历史目录；卸载器保留旧名称用于迁移，见 [迁移说明](../README.md#从旧目录迁移)。

外部 CLI 适配器独立选装。共享调用协议在 `adapters/contract.md`，修改后运行 `npm run adapters:sync`。目标收到原任务、文件范围、现有授权和用户对 Skill 的选择或禁止；普通开发无需在目标中另行选择开发工作流。

## 检查分别证明什么

| 检查 | 证明范围 | 命令 |
| --- | --- | --- |
| 静态检查 | 目录、引用、fixture、安装安全及校验器正反例 | `npm test` |
| 资源检查 | 必需文件、脚本与可选 CLI 状态 | `npm run doctor` |
| 路由代理 | description；extended 模式另含 when_to_use | `npm run eval:routing -- --surface description` |
| 文本回答 | 关键词、正则及范围信号；不证明工具行为 | `npm run eval:behavior` |
| 宿主自报 | 已授权 CLI 声称会选哪个入口 | `npm run eval:e2e -- --cli <目标>` |
| 真实执行 | 临时项目的文件变化和可观察行为 | `npm run eval:execution -- --prepare` |

代理路由不包含所有宿主规则或 invocation policy。dry-run 只检查加载。文本评估的 Claude 结果不是 Codex 结果；自报选中 Skill 也不证明实际加载。首次失败保留，路由 `--recheck` 仅诊断；回答 `--attempts` 保留各次输出。`--record` 保存摘要和原始 JSON。

现有 nightly 仍运行路由与文本代理，需要 `ANTHROPIC_API_KEY`，不自动启动真实执行 Agent。当前任务未授权外部模型时，仅运行静态检查；修改 fixture 不等于该行为已通过模型验证。

## 真实执行夹具

1. 运行 `npm run eval:execution -- --prepare` 创建全新的临时目录。
2. 在已授权的 Agent 中，以独立上下文执行各 `*.task.txt`；只提供任务文件，不提供 verifier、manifest 或预期答案。
3. 原样保存实际最终回复到对应的 `<case>.response.txt`，检查运行记录中的多余确认、越界动作或虚报。
4. 运行 `npm run eval:execution -- --verify <目录>`，结果追加到 `attempts.jsonl`。每次模型尝试重新 prepare，记录宿主、实际可知的模型、版本与全部尝试。

当前三个场景覆盖实现、仅评审、已有授权后的继续，不再复制或强制加载 `dev`；它们是当前宿主直接工作的局部基线，不能证明所有可选 Skill 的效果。宿主已有规则、记忆和全局 Skill 仍可能影响运行，应记录真实环境；“夹具不注入 Skill”不等于完全裸模型。

prepare / verify 不会启动 Agent，也不修改全局安装。临时目录不是安全沙箱。文件快照检测不到写入后撤销等过程行为；继续场景提供单次输入中的已有上下文，不代表完整的多轮实测。历史报告保持原始口径。

判断可选 Skill 是否值得保留，需要同模型、同任务、同环境、同权限和相当预算的有无对照，以及质量、失败、耗时等结果。不要把静态通过或单次通过当成增益证据。比较设计可查阅 [消融资料](../references/ablation.md)，是否实际调用外部模型仍以授权为准。
