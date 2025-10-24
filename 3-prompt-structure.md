# 3. Prompt 结构（核心参考）

参考文件：`prompt_pack.py` 与 `Aurora-Prompt-Pack.md`

- **System Prompt（V4）**
  - 描述身份、格式、语言、模型调度、安全策略、Minecraft 定制能力、调试要求。

- **Behavior Guide**
  - 回复策略、RAG 引用模板、计划/提醒流程、群聊总结输出、拒绝模板。

- **Runtime Tips**
  - 模型/向量降级提示、系统状态规范、关键词路由。

- **Persona Summary**
  - 由 `render_system_prompt` 组合输出，包括当前心情、偏好、记忆片段、活跃时段、话题提示等。

- **动作词库**
  - `ACTION_LIBRARY` 提供多样化动作用于语言风格。
