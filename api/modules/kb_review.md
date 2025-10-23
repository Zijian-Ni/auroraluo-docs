---
# Kb Review 模块 · API 文档

<div class="doc-card">
<strong>定位</strong>：本页介绍 <code>auroraai.kb_review</code> 的常用接口、场景与最佳实践。<br/>
<strong>更新时间</strong>：2025-10-23（以源码为准）
</div>

## 快速开始
```python
from auroraai.kb_review import sample_check, accept, reject
# 典型调用
sample_check(...)
```

<div class="callout tip">
<b>建议</b>：结合 <code>logging</code>、<code>metrics</code> 与 <code>audit</code> 使用，便于观测与回溯。
</div>

## 常见场景
- 与 <code>memory_manager</code> / <code>vector_index</code> / <code>planner</code> 协作；
- 配合 <code>archive_policy</code> 做安全控制；
- 作为上游/下游在“识别→检索→规划→执行”链路中协作。

## 参考接口

### 函数
| 函数 | 参数 | 说明 |
|---|---|---|
| `sample_check()` | — | — |
| `accept()` | — | — |
| `reject()` | — | — |


### 类
_（无）_


## 组合示例
```python
from auroraai import memory_manager, vector_index, planner
from auroraai.kb_review import sample_check, accept, reject

goal = "示例目标"
steps = planner.plan(goal)
for s in steps:
    # 调用 Kb Review 的关键方法 …
    pass
```

## 错误处理与边界
- 对外部依赖/长耗时逻辑增加超时与重试；
- 对输入做长度/格式校验；
- 对敏感动作做权限确认（<code>commands</code>、<code>policy_metrics</code>）。
