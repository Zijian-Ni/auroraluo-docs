
---

## 8) `8-debug-tips.md`

```markdown
# 8️⃣ 调试建议

> 一组“最常用”的定位套路，覆盖 Prompt、RAG、模型、插件四个层面。

## 8.1 快速查看 Prompt
- 调用 `get_full_prompt_v4()`，确认 System Prompt 是否**含有**：  
  1) 角色 & 语气；2) 输出格式；3) 安全与拒绝模板；4) 调试提示；5) 动态 Persona Summary。

## 8.2 环境检测
- `diag.report()` 打印：文本模型、向量后端、数据库类型、公网入口、视觉优先级等。

## 8.3 单元测试（建议）
```bash
python scripts/run_ai_tests.py
# 检查：prompt 拼装 / RAG / MoE / vision / 降级
