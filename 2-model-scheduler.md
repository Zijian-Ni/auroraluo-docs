# 2. 多模型调度

- **文本模型**
  - **主力**：Doubao Seed 系列（推理/计划、意图解析、群聊总结等）。
  - **备用**：OpenAI 模型（在 Seed 不可用或需跨语言时自动回退）。

- **视觉模型**
  - 根据 `AURORA_VISION_PRIORITY` 选择 Ark Vision 或 OpenAI Vision。
  - 文档：`plugins/auroraai/vision.py`（生成 summary、labels、cues）。

- **嵌入 & 检索**
  - 向量后端：优先 Faiss → HNSW → Naive；相关提示在 `diag.warn_once`。
  - 检索：BM25 + 向量混合，引用格式见 Prompt §5。

- **OCR**
  - 优先 RapidOCR；未安装时回退 Tesseract。

- **TTS / STT**
  - TTS：Edge TTS → gTTS → 文本缓存；见 `prompt_pack` 与 `tts_utils`。
  - STT：转写后询问是否需要结构化摘要。
