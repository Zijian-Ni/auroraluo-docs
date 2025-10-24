# 5. 主要功能模块与提示

> 各模块职责、核心 Prompt 语句、输入输出约定。

| 模块 | 功能 | 核心提示语言 | 输入 | 输出 |
|---|---|---|---|---|
| `intent.py` | LLM 意图/槽位/风险判定 | “解析用户意图并填充 JSON schema…” | 用户文本 | `{intent, slots, risk}` |
| `analytics.py` | 群聊热点/Top10 | “猫娘助手极光小落，生成 3 条热点话题…” | 群消息窗口 | `summary / topics[]` |
| `memory_distill.py` | 蒸馏长期记忆 | “输出 `- [标签] 记忆`，忽略一次性细节…” | 历史对话 | 记忆条目 |
| `causal_planner.py` | 结构化计划 | “生成 JSON：summary/steps/checks…” | 目标/约束 | `plan.json` |
| `translator.py` | 翻译/润色/改写 | “翻译成 {target_lang}，保持自然…” | 文本 + lang | 翻译文本 |
| `vision.py` | OCR + VLM | “识别场景/界面/玩家状态，返回 JSON…” | 图像/截图 | `{summary, labels, cues}` |
| `__init__.py` | 对话主流程 | 拼装“【小落状态】【语义画像】…” | 综合上下文 | 最终回复 |

### 📦 计划 JSON（`causal_planner` 示例）
```json
{
  "summary": "在 Minecraft 搭建自动化刷怪塔",
  "steps": [
    {"id": 1, "text": "收集材料：漏斗×8…", "deps": []},
    {"id": 2, "text": "搭建平台与掉落通道…", "deps": [1]},
    {"id": 3, "text": "加装红石计时…", "deps": [2]}
  ],
  "checks": ["平台光照<7", "漏斗朝向正确"]
}
