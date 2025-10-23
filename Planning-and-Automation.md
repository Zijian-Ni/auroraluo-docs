# 🗺️ 规划与自动化

> 从目标到可执行计划：因果图、分解、调度与回滚。


    ## 模块
    - `planner.py`：高层规划器（任务分解/优先级/依赖）；
    - `task_queue.py`：异步队列；
    - `task_scheduler.py`：调度与重试；
    - `causal_graph.py`：因果依赖建模；
    - `causal_planner.py`：结合因果图的“安全计划”。

    ## 示例
    ```python
    from auroraai.planner import plan
    plan("基于 docs/ 构建 FAQ 并发布到网站")
    # => [切片->索引->抽检->生成->审阅->发布]
    ```

    ## 建议
    - 重要链路加上 **人工确认** 与 **超时熔断**；
    - 任务留痕，配合 `audit` 与 `metrics` 做持续改进。
    