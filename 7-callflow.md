# 7. 调用流程摘要（简化）

1. **接收消息**：`__init__.py` 解析命令或普通文本。
2. **建模上下文**：
   - 获取 persona、画像摘要、MoE 决策；
   - 汇总 RAG 检索结果、因果图节点、历史对话、视觉摘要等。
3. **生成 Prompt**：调用 `render_system_prompt` + 上下文段落，形成最终 LLM 输入。
4. **模型调用**：`provider.call_llm` 按优先级调度 Seed → OpenAI → fallback。
5. **回复输出**：确保格式符合猫娘规范，并在必要场景给出引用或澄清。
