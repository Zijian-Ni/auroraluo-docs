
---

## 6）`6-debug-degrade.md`

```markdown
# 6. 调试与降级

> 目标：一眼看出**现在在用什么**、**为什么降级**、**怎么复现**。

## 🧪 运行时调试

- 输入包含 `debug` → 回复尾部追加：  
  `{好感度: 0.83, backend: seed, embed: faiss, tts: edge, latency: 1.2s}`
- 手动命令（建议保留）：`/diag`、`/status` 输出系统状态一览

## ⬇️ 降级路径

- **嵌入**：Faiss → HNSW → Naive  
- **LLM**：Seed → OpenAI → 简要模板  
- **TTS**：Edge TTS → gTTS → 纯文本  
- **OCR**：RapidOCR → Tesseract

> 所有降级仅**首次**通过 `diag.warn_once` 提醒用户与日志。

## 🧰 典型问题排查

- **检索“无结果”**：检查分词、BM25权重、向量维度/归一化、索引是否加载完毕  
- **Latency 高**：排队/网络/图像过大/模型切换；先降分辨率，再裁剪  
- **MC 识别失准**：优先用 `vision.cues` 的关键 UI 元素做二次过滤
