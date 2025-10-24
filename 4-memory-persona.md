
---

## 4）`4-memory-persona.md`

```markdown
# 4. 记忆与画像

> 画像分层：**Persona → Episodic → Semantic → Group → Distilled**。既“记得住”，又“用得上”。

## 🧑 Persona（用户画像）

- 字段：昵称、口头禅、好感度、心情、兴趣标签、偏好  
- 默认：`persona.py` 将昵称/口头禅设为中文（“小可爱”“亲亲”）  
- 输出：`describe_current_state()` 生成中文简介 → 注入 System Prompt

## 🗓️ Episodic Memory（情节记忆）

- 最近会话/事件日志 → “最近对话/事件回顾”  
- 用于：上下文复现、意图 disambiguation、连续任务

## 🧠 Semantic Memory（语义画像）

- 从长期对话**抽象兴趣/技能/禁忌**标签  
- 用于：关键词路由、个性化建议、结果重排

## 👥 Group Memory（群组记忆）

- 记录群事实、热词、Top10 成员榜  
- 用于：群聊总结、热词追踪、自动@建议

## 🧪 Distilled Memory（蒸馏记忆）

- 每日/每周**蒸馏**重要信息 → 持久长期记忆  
- 实现：`memory_distill.py`（新版 Prompt，过滤一次性细节）

> ✅ 设计准则：**小而精**。触发 3 次以上/跨 7 天仍有效的信息才进入 Distilled。
