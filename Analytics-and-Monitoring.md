# 📈 分析与监控

> 运行数据闭环：追踪、评估、指标。


    ## 模块
    - `analytics.py`：埋点通道；
    - `metrics.py`：关键指标（响应时延/成功率/用户留存等）；
    - `audit.py`：审计留痕（关键动作/异常/风控）；
    - `logging_setup.py`：统一日志格式；
    - `policy_metrics.py`：策略命中/召回。

    ## 示例
    ```python
    from auroraai.metrics import counter, timer
    with timer("kb.index.latency"):
        build_index()
    counter("mc.alert.accepted").inc()
    ```
    