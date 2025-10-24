
---

## 7) `7-callflow.md`

```markdown
# 7️⃣ 调用流程摘要

> 从“收到消息”到“最终回复”的最小闭环；可直接对照日志排查问题。

```mermaid
flowchart TD
    A[收到消息] --> B{命令 / 普通文本?}
    B -- 命令 --> C[命令解析器]
    B -- 普通文本 --> D[意图识别 intent.py]
    D --> E[构建上下文: Persona/画像/MoE/历史/RAG/视觉摘要]
    E --> F[render_system_prompt + 拼装各段]
    F --> G{模型可用?}
    G -- Seed 正常 --> H[调用 Seed]
    G -- 超时/异常 --> I[回退 OpenAI]
    H --> J[生成回复]
    I --> J[生成回复]
    J --> K[格式校验: 猫娘样式/引用/拒绝模板]
    K --> L[输出到聊天]
