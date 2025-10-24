
---

## 8）`8-debug-tips.md`

```markdown
# 8. 调试建议

> 一套“自证其能”的调试动作序列，快速定位问题。

## 🧭 快速自检

1. `get_full_prompt_v4()`：查看最终 System Prompt 是否正确拼装  
2. `diag.report()`：看当前 **LLM/Embedding/OCR/TTS** 后端与版本  
3. `scripts/run_ai_tests.py`：单测关键路径（Prompt、RAG、MoE、Vision）

## 🔍 RAG 稳定性建议

- 向量索引：统一维度/度量方式，启用标准化；离线构建并**冷启动加载**  
- Hybrid 配比：BM25:Vector = 60:40 起步，按召回质量再微调  
- 引用策略：只显示 **Top-3** 最关键来源，且能从 UI 追溯

## 🧪 Prompt 变更回归

- 每次修改 **System/Behavior/Runtime** 任一段，都运行最小回归集：  
  - 翻译/计划/总结/拒绝/多轮澄清/安全边界  
- 失败项：统一记录到 `prompt_regression.md`，避免复发

## 🧯 线上告警线

- LLM 超时率 > 2%、RAG 零召回 > 5%、TTS 失败 > 1%：标红并降级  
- 慢调用 Top10：标注模型、token、附件大小与网络段
