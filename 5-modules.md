
---

## 5) `5-modules.md`

```markdown
# 5️⃣ 主要功能模块与提示

> 模块职责 + 典型提示语（片段），便于快速定位问题。

| 模块 | 功能概要 | 典型提示语（片段） |
|---|---|---|
| `intent.py` | LLM 判定意图/槽位/风险 | “请解析用户意图并填充 JSON schema…” |
| `analytics.py` | 群聊热点总结 | “猫娘助手极光小落，生成 3 条热点话题…” |
| `memory_distill.py` | 蒸馏长期记忆 | “输出 `- [标签] 记忆`，忽略一次性细节…” |
| `causal_planner.py` | 结构化计划 | “生成 JSON：summary/steps/checks …” |
| `translator.py` | 翻译/润色/改写 | “请翻译成 {target_lang}，保持语气自然 …” |
| `vision.py` | OCR + VLM 分析 | “识别场景/界面/状态，返回 JSON …” |
| `__init__.py` | 对话主流程 | “拼接【小落状态】【语义画像】…” |

### 使用建议
- **先意图后执行**：任何操作前先跑 `intent.py`，命中风险则拒绝或二次确认。
- **结构化输出**：计划/总结/表格尽量 JSON + Markdown 双轨，便于后续处理。
