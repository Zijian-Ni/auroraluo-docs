# 🎨 AI 绘图（关键词生图） · Image Generation

- 模块：`ai_painter.py`（`volcengine.visual.VisualService`）
- 接口：`paint(prompts, AccessKey, SecretKey)` → `(code, message, used_time)`  
- 群聊命令：**`画`**（会扣积分）

## 配置建议
- 将 `AccessKey/SecretKey` 改为环境变量（`VISUAL_AK / VISUAL_SK`）；
- 设置超时与失败重试；错误打印应包含请求 ID 便于排错。

## 使用示例
```
@机器人 画 萌猫与星空
@机器人 画 校园秋日午后
```
