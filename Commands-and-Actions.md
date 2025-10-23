# ⌨️ 命令与动作

> 自然语言与指令世界的桥梁。


    ## 模块
    - `commands.py`：命令注册、权限与冷却；
    - `fuzzy_commands.py`：模糊匹配，容错纠正与同义词；
    - `caps_client.py`：外部能力调用（HTTP/本地进程/容器）。

    ## 典型流程
    1. 识别 **intent**（`intent.py`）与槽位；
    2. 查询 **权限/上下文**（`user_memory`, `group_memory`）；
    3. 解析参数 → 指令 → 调度（`task_queue`, `task_scheduler`）。
    