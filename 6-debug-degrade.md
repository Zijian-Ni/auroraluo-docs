# 6. 调试与降级

- `diag.warn_once` 负责打印中文友好提示（向量/嵌入/LLM/ TTS 降级）。
- `prompt_pack` 中于运行时提醒“当前向量引擎临时切换…”等语句。
- `debug` 命令或输入包含 `debug` 时，回复尾部附 `{好感度:…, backend:…}`。
