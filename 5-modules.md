# 5. 主要功能模块与提示

| 模块 | 功能概要 | 核心提示语言 |
| ---- | -------- | ------------ |
| `intent.py` | LLM 判定意图、槽位、风险 | “请解析用户意图并填充 JSON schema…” |
| `analytics.py` | 群聊热点总结 | “猫娘助手极光小落，生成 3 条热点话题…” |
| `memory_distill.py` | 蒸馏长期记忆 | “输出 `- [标签] 记忆`，忽略一次性细节…” |
| `causal_planner.py` | 结构化计划 | “生成 JSON：summary/steps/checks…” |
| `translator.py` | 翻译/润色/改写 | “请翻译成 {target_lang}，保持语气自然…” |
| `vision.py` | OCR + VLM 分析 | “识别场景、界面、玩家状态，返回 JSON…” |
| `__init__.py` | 对话主流程 | Prompt 拼接“【小落状态】【语义画像】…” 等分段 |
