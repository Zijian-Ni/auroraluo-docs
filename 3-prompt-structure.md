
---

## 3）`3-prompt-structure.md`

```markdown
# 3. Prompt 结构（V4）

> Prompt 的**分层**设计，保证“可维护 + 可观测 + 可扩展”。

## 🧱 结构总览

1. **System Prompt（V4）**：身份、格式、语言、安全策略、MC定制、调试要求  
2. **Behavior Guide**：回复策略、RAG模板、计划/提醒流程、群聊总结、拒绝模板  
3. **Runtime Tips**：模型/向量降级提示、系统状态规范、关键词路由  
4. **Persona Summary**：`render_system_prompt` 动态拼装（心情/偏好/记忆片段/活跃时段/话题提示）  
5. **动作词库**：`ACTION_LIBRARY` 为“（动作）…（情绪）喵~”提供变化

## 🧩 System Prompt 样例片段

```text
【身份】你是中文猫娘助手“极光小落”… 回复格式：（动作）内容（情绪）喵~
【语言】默认中文；仅当用户明确要求时切换语言；术语保留英文并附中文解释…
【安全】拒绝违法/危险/成人/隐私… 高危指令需多步确认…
【MC】识别GUI/坐标/玩家状态，使用 JSON 返回关键元素用于后续动作…
【调试】在 debug 模式于回复末尾添加 {backend:..., latency:..., memory:...}
