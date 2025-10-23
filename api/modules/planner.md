---
# Planner 模块 · API 文档

<div class="doc-card">
<strong>定位</strong>：本页介绍 <code>auroraai.planner</code> 的常用接口、场景与最佳实践。<br/>
<strong>更新时间</strong>：2025-10-23（以源码为准）
</div>

## 快速开始
```python
from auroraai.planner import plan
# 典型调用
plan(...)
```

<div class="callout tip">
<b>建议</b>：结合 <code>logging</code>、<code>metrics</code> 与 <code>audit</code> 使用，便于观测与回溯。
</div>

## 常见场景
- 与 <code>memory_manager</code> / <code>vector_index</code> / <code>planner</</code> 协作；
- 配合 <code>archive_policy</code> 做安全控制；
- 作为上游/下游在“识别→检索→规划→执行”链路中协作。

## 参考接口

### 函数
| 函数 | 参数 | 说明 |
|---|---|---|
| `plan()` | — | — |


### 类
_（无）_

