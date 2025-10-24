
---

## 4) `4-memory-persona.md`

```markdown
# 4️⃣ 记忆与画像

> 解释 Persona / Episodic / Semantic / Group / Distilled 的**结构与更新方式**。

## 4.1 Persona（用户画像）
- 包含：昵称、口头禅、好感度、心情、兴趣等。
- 默认：中文昵称与口头禅（如“小可爱”“亲亲”）。
- `describe_current_state`：生成“【小落状态】”段落用于 System Prompt。

## 4.2 Episodic Memory（情景记忆）
- 记录近期对话与事件，形成“最近对话/事件回顾”。

## 4.3 Semantic Memory（语义画像）
- 抽取兴趣/技能/禁忌标签，生成简洁画像摘要（供路由与推荐）。

## 4.4 Group Memory（群画像）
- 记录群事实、热词、Top10 成员榜、活跃时间段，辅助群聊总结。

## 4.5 Distilled Memory（长期蒸馏）
- 每日/每周对对话蒸馏，输出**带标签**的长期记忆。  
- 入口：`memory_distill.py`（已更新 Prompt）。

---

## 4.6 内部字段示意
```json
{
  "persona": { "nickname": "小可爱", "mood": "兴奋", "catchphrase": "亲亲" },
  "episodic": [{ "ts": 1710000000, "event": "完成任务A", "actors": ["小落", "用户"] }],
  "semantic": { "tags": ["MC建造", "红石", "不喜欢PVP"] },
  "group": { "facts": ["本群专注模组服"], "hot_words": ["FTB", "RLCraft"] },
  "distilled": ["- [建造] 用户偏好现代风", "- [禁忌] 避免剧透主线"]
}
