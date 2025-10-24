# 7. 调用流程摘要

> 从“收到消息”到“输出回复”的关键链路。**有了它，排错不迷路**。

```mermaid
sequenceDiagram
  autonumber
  participant U as 用户/群
  participant G as 入口(__init__)
  participant I as 意图(intent)
  participant M as 记忆/画像
  participant R as 检索(RAG)
  participant P as Prompt拼装
  participant L as 模型调度(provider)
  participant O as 输出/后处理

  U->>G: 文本/图片/命令
  G->>I: 解析意图/槽位/风险
  G->>M: 拉取 persona / episodic / semantic / group
  G->>R: BM25+向量混合检索
  G->>P: render_system_prompt + 上下文拼装
  P->>L: Seed→OpenAI 调用（含降级）
  L->>O: 结构化输出（含引用/计划/提示）
  O->>U: 最终回复 + 下一步建议
