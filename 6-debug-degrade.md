# 6️⃣ 调试与降级

> 如何快速判断“当前用的是什么后端/是否降级/为什么降级”，以及**如何提示用户**。

## 6.1 降级优先级
- 文本：Seed → OpenAI → （失败）报错并给出替代方案
- 嵌入：Faiss → HNSW → Naive（并打印 `diag.warn_once`）
- 视觉：Ark → OpenAI
- OCR：RapidOCR → Tesseract
- TTS：Edge → gTTS → 文本

## 6.2 运行时提示（示例）
```text
[diag] 当前向量引擎临时切换：Faiss → HNSW（GPU 占用过高）
[diag] LLM 回退：Seed → OpenAI（API 超时 8s）
