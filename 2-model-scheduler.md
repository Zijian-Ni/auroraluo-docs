# 2️⃣ 多模型调度

> 说明文本/视觉/嵌入/语音的**优先级与回退策略**，并给出诊断与调试方法。

## 2.1 文本模型（LLM）
- **主力**：**Doubao Seed** 系列  
  用途：推理/规划、意图解析、总结、结构化输出。
- **备用**：**OpenAI**（跨语言、多模态补位）  
  触发：Seed 不可用 / 语言要求切换 / 能力缺口。

> ℹ️ **降级提示**：`diag.warn_once` 会打印“已回退至 OpenAI …”。

## 2.2 视觉模型（VLM）
- 由 `AURORA_VISION_PRIORITY` 决定：**Ark Vision** → **OpenAI Vision**。
- 路径：`plugins/auroraai/vision.py`  
  输出：`summary`（摘要）、`labels`（标签）、`cues`（线索）。

## 2.3 嵌入与检索（RAG）
- **向量后端**：优先 **Faiss → HNSW → Naive**。  
- **检索策略**：**BM25 + 向量混合**；拼接引用段并按模板输出。
- **异常/降级**：`diag.warn_once` 会给中文提示。

## 2.4 OCR
- **RapidOCR** 优先；未安装时回退 **Tesseract**。  
- 适用：截图文字、界面文本、游戏 UI 识别等。

## 2.5 语音（TTS / STT）
- **TTS**：Edge TTS → gTTS → 文本缓存；  
- **STT**：转写后询问用户是否需要**结构化摘要**（时间、人物、意图等）。

---

## 2.6 运行时可见的状态提示（示例）
```text
[diag] 向量引擎暂不可用，已临时回落至 HNSW
[diag] 文本模型回退：Seed → OpenAI (原因：timeout)
[diag] 视觉模型优先级：Ark → OpenAI
