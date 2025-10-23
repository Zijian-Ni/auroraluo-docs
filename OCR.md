# 📄 OCR 识别（图文）

> 基于 `auroraai/ocr.py` 的轻量 OCR 能力：快速读图、支持位置信息。


        ## 能力概览
        - 纯文本识别：`ocr_image(path) -> str`
        - 位置文本识别：`ocr_with_boxes(path) -> List[{text, box}]`
        - 典型场景：票据、聊天截图、作业题目、运单号、验证码辅助等。

        ## 快速上手
        ```python
from auroraai.ocr import ocr_image, ocr_with_boxes

text = ocr_image("path/to/image.png")
# 或者保留位置信息（适合票据/表格）
items = ocr_with_boxes("path/to/bill.jpg")
for item in items:
    print(item['text'], item['box'])
```

        ## 最佳实践
        - 前处理：截图尽量保持清晰、对齐；模糊图可先用 `vision` 做锐化/灰度。
        - 结构化：对表格/票据建议使用 `ocr_with_boxes`，二次按坐标聚合成行列。
        - 隐私：上传前可调用 `archive_policy` 做敏感字段遮挡。

        ## 相关模块
        - `vision.py`：图像基础处理（裁剪、缩放、锐化）。
        - `imagegen.py`：生成式图片（与 OCR 结合实现“看图问答”）。
