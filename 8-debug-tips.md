# 8. 调试建议

- **快速查看 Prompt**：`get_full_prompt_v4()` 返回最新系统 Prompt 文本，用于验证生成内容。
- **环境检测**：`diag.report()` 输出当前模型、嵌入后端、数据库类型、公网入口启用情况。
- **单元测试**：`python scripts/run_ai_tests.py` 自动检查 prompt 拼装、RAG、MoE、vision 等关键路径。

---

📘 **参考**
如需了解具体语句或模板，请参阅：`docs/Aurora-Prompt-Pack.md`。
