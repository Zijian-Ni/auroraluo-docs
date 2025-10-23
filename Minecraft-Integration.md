# ⛏️ Minecraft 一体化助手

> 让机器人在模组服里**真正有用**：懂语境、能执行、可配置。


    ## 模块
    - `mc_commands.py`：命令解析/路由，支持自然语言到指令的映射；
    - `mc_services.py`：服务层封装（背包/传送/经济/日志/安全 Hook）。

    ## 典型场景
    - “帮我把 1 号箱子的木头搬到 2 号箱子并合成栅栏”；
    - “按照基地蓝图自动铺路/照明/围栏”；
    - “巡逻告警 + 二次确认 + 自动截图留证”。

    ## 对接形态
    - 通过 `commands` 与 `planner` 将**自然语言 → 目标 → 可执行计划**；
    - 与**权限系统/黑白名单**联动，保证安全边界。

    ## 示例（伪代码）
    ```python
    from auroraai.mc_commands import parse
    intents = parse("把箱子1的木头搬到箱子2并合成栅栏")
    # -> [{op:"move", src:"chest#1", dst:"chest#2", item:"oak_log"}, {op:"craft", item:"fence"}]
    ```
    