# 🧠 记忆系统

> 结合语义记忆、情景记忆与群体记忆，支持可控的长期人格与行为。


    ## 模块组成
    - `semantic_memory.py`：概念/事实沉淀（向量化、可检索）。
    - `episodic_memory.py`：对话/事件痕迹（带时间线）。
    - `group_memory.py`：群记忆（在群聊/频道层面存储共识与偏好）。
    - `user_memory.py`：用户画像与偏好记录。
    - `memory_layers.py`：多层记忆融合策略。
    - `memory_manager.py`：统一读写与淘汰策略。
    - `memory_distill.py`：记忆蒸馏与提纯。
    - `auto_notes.py`：自动做笔记（会议/直播/讨论要点）。

    ## 读写示例
    ```python
    from auroraai.memory_manager import remember, recall

    remember(kind="fact", text="小明喜欢任天堂和赛车游戏", scope="user:1001")
    notes = recall(query="喜欢的游戏厂商", scope="user:1001", top_k=5)
    ```

    ## 策略建议
    - 定期蒸馏，减少噪声与重复；
    - 对**敏感或过期**内容采用 `archive_policy`；
    - 与“人格/心情/好感度”联动，影响回复风格与决策阈值。
    