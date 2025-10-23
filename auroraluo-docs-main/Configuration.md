# ⚙ Configuration · 配置与环境（pydantic v2 适配）

> 本页仅描述**配置项与其作用**（不包含本地调试脚本）。请以你部署的 `.env` / 环境变量为准。

---

## 1. 关键环境变量（推荐命名）

为适配 **pydantic v2 + pydantic-settings**，推荐统一采用 **大写下划线** 风格，避免 `extra=forbid` 报错：

```ini
# ── Database（MySQL）
AURORA_DB_HOST=127.0.0.1
AURORA_DB_PORT=3306
AURORA_DB_USER=root
AURORA_DB_PASSWORD=your_password
AURORA_DB_NAME=aurora
AURORA_DB_POOL_MIN=1
AURORA_DB_POOL_MAX=5

# ── AI / Model
OPENAI_API_KEY=sk-xxxx               # 如启用云端模型
AURORA_TEMP=0.7                      # 生成多样性（0~1）

# ── RAG / Vector Retriever（可选）
AURORA_VECT_MAX_FEATURES=5000
AURORA_VECT_NGRAMS=2

# ── Rate Limit（每分钟）
AURORA_RATE_PER_USER_PER_MIN=15
AURORA_RATE_PER_GROUP_PER_MIN=60

# ── Plugins
NONEBOT_PLUGINS=["plugins.auroraai","plugins.aurorabili","plugins.aurorabk"]  # 示例
NONEBOT_PLUGIN_DIRS=[]
```

> 若你的旧变量以小写命名（例如 `aurora_db_host`），建议迁移为上面的**大写**形式，或在 Settings 中显式允许 `extra="ignore"`。

---

## 2. pydantic v2 迁移要点
- **BaseSettings 迁移至 `pydantic-settings`**；使用 `SettingsConfigDict` 设置源与解析规则；
- 默认 **extra=forbid**：多余字段会报错；**统一变量名** 是最稳妥方式；
- 类型显式：端口/开关/数值型变量建议用 int/bool/float 字段，减少隐性转换错误。

---

## 3. 插件相关依赖与提示
| 功能 | 关键依赖 | 说明 |
|---|---|---|
| MySQL 访问 | `mysql-connector-python` | `auroradb/2` 使用 |
| 百科渲染 | `imgkit` + 系统级 `wkhtmltoimage` | `aurorabk` 图片卡片 |
| 菜单图卡 | `pillowmd` | `auroragm` |
| 定时任务 | `nonebot_plugin_apscheduler` | 如需每日播报 |

> Windows 下 `wkhtmltoimage` 需手动安装并加入 PATH；未安装会自动降级为文本模式。

---

## 4. 隐私与合规配置
- **画像导出/清除**：为用户提供自助途径；
- **敏感词/拦截**：不合规请求抑制/改写；
- **日志与审计**：只记录必要元信息，避免包含敏感正文。

---

## 5. 配置变更建议
- 先在测试群试跑，再推广到正式群；
- 模型/策略大改前用“**菜单图卡**”公告，减少困惑；
- 定期回顾：限流阈值、敏感词策略、RAG 命中率。
