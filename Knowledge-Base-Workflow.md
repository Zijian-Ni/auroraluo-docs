# 📚 知识库工作流（归档·检索·纠错） · Knowledge Base Workflow

## 1. 归档策略
- 过滤：`should_archive_to_qa` 屏蔽指令/短无效/寒暄；
- 分类：FACT/PROCESS/REFERENCE/DEFINITION/FAQ；
- 价值评分：问题质量 + 答案质量；
- 主观/模糊/闲聊：一般不入库。

## 2. 相似性检查
- `is_similar_knowledge_exists` 避免重复；
- 技术：`TfidfVectorizer + cosine_similarity`；
- 归一化：中文转 `pinyin`，去停用词、关键词切分。

## 3. 入库与查询
- 入库：`add_qa()`；
- 查询：`search_knowledge_by_question()`；
- 命令：`知识库|kb|问答|常见问题`。

## 4. 纠错闭环
- 用户：`纠错 <知识ID> <建议> [理由]`；
- 管理：`待审核纠错 -> 纠错详情 -> 审核纠错`；
- 生效：`apply_correction_to_kb()`；
- 表设计：为 `knowledge_base` / `kb_corrections` 建立时间/状态索引。

## 5. 统计与质量
- `知识统计`：类型 & 日期分布；
- `知识质量`：问题/答案质量；
- `淘汰知识`、`改问题`；
- A/B：调整 Top-K/重排阈值对命中率影响。
