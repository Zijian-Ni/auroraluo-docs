# 📚 知识库 · API/模型

> 面向多源材料的构建、校对、版本化与回滚。


    ## 模块组成
    - `kb_models.py`：切片模型、分块策略与元信息。
    - `kb_review.py`：质检与人工抽检流程。
    - `kb_versioning.py`：版本化、差异对比、回滚与标签。
    - `knowledge_base_utils.py`：导入导出、索引重建、批量更新。

    ## 工作示例
    ```python
    from auroraai.kb_models import Chunker, KBItem
    from auroraai.kb_versioning import commit, diff, rollback

    items = Chunker("docs/").run()
    commit("init-import", items)

    # 发现异常后快速回滚
    rollback(tag="init-import")
    ```

    ## 最佳实践
    - 先“分块-去噪-抽检”，再入库；
    - 重大变更**务必打标签**，保留回滚锚点；
    - 与向量索引/检索（`embedder`, `vector_index`）联动。
    