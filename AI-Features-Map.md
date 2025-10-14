# 🧠 AI 功能全览（基于源码扫描） · AI Features Map

> 本页基于 `/auroraai` 目录源码（zip 内）梳理出**全部 AI 相关功能**，并给出**使用建议**与**可配置点**。

---

## 1. 对话生成 · Chat Generation
- 入口：`auroraai/__init__.py`
- 关键函数：`ai_generate_answer(content, history)`  
- 默认后端：**火山方舟 Ark** · `OpenAI` SDK 兼容调用（`base_url=https://ark.cn-beijing.volces.com/api/v3`，`model=doubao-1-5-thinking-pro-250415`）  
- 历史注入：角色人格 + 多轮上下文组装为 `messages = history + [{'role':'user','content':content}]`  
- 配置建议：
  - 使用环境变量 `ARK_API_KEY`（避免把密钥写在代码里）；
  - 提供 `temperature/top_p` 以便调参。

---

## 2. 人格/情绪/好感度 · Persona & Mood & Favor
- 猫娘人格、好感度（-100~100）、心情（日更）；
- 变量：`user_favor[user_id]`、`current_mood`、`user_tags[user_id]`、`user_event_summaries[user_id]`；
- 函数：`mood_daily_refresh()`、`mood_update(delta)`、`get_group_nickname()`；
- 行为规则：动作括号“（摇尾巴）”+语言+附加信息格式输出；可 `debug` 查看好感度。

---

## 3. 知识库 · Knowledge Base
- 归档过滤：`text_utils.should_archive_to_qa()`；
- 相似性：`ai_similar.KnowledgeSimilarityChecker`（`TfidfVectorizer + cosine_similarity`）；
- 入库/查询：`add_qa()`、`search_knowledge_by_question()`；
- 纠错闭环：`纠错 / 待审核纠错 / 纠错详情 / 审核纠错`；
- 统计：`知识统计 / 知识质量`；淘汰与改写：`淘汰知识 / 改问题`。

---

## 4. 语音与声音偏好 · TTS / Voice
- 本地 TTS：`edge_tts` → MP3 → `ffmpeg` 转 AMR（分段与缓存）；
- 声音偏好：DB 版 `user_voice.py` 与 JSON 版 `voice_settings.py`；
- 建议统一缓存路径变量，设置缓存保留周期。

---

## 5. AI 绘图 · Image Generation
- 模块：`ai_painter.py`（`volcengine.visual.VisualService`）
- 接口：`paint(prompts, AccessKey, SecretKey)`；
- 群聊命令：**`画`**（扣积分 + base64 图片）。
