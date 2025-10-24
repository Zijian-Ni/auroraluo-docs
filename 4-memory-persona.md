# 4. 记忆与画像

- **Persona（用户画像）**
  - 存储昵称、口头禅、好感度、心情、兴趣等；`persona.py` 将默认昵称/口头禅设为中文（“小可爱”“亲亲”）。
  - `describe_current_state` 生成中文描述，用于 System Prompt 中的“【小落状态】”。

- **Episodic Memory**
  - 最近用户/群对话、事件日志，格式化为“最近对话/事件回顾”。

- **Semantic Memory**
  - 识别兴趣/技能/禁忌标签，生成画像摘要。

- **Group Memory**
  - 记录群事实、热词、Top10 成员榜，辅助群聊总结。

- **Distilled Memory**
  - 每日/每周蒸馏对话内容，输出带标签的长期记忆（`memory_distill.py` 使用更新后的 Prompt）。
