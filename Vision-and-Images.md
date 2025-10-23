# 🖼️ 视觉与图像工具

> 涵盖图像基础处理与生成式绘图，支撑看图理解、可视化与内容生产。


        ## 模块清单
        - `ai_painter.py`：高层绘图助手（海报/流程图/社交卡片模板化生成）。
        - `imagegen.py`：通用图片生成接口（文生图、图生图）。
        - `vision.py`：图像预处理（裁剪、缩放、增强、去噪、锐化等）。
        - `ocr.py`：OCR 识别（与 `Vision` 互补）。

        ## 常见用法
        ```python
        # 1) 先做预处理再识别/生成
        from auroraai.vision import resize, enhance
        from auroraai.ocr import ocr_image
        img = enhance(resize("in.jpg", shorter=1024))
        print(ocr_image(img))

        # 2) 生成社交分享卡片
        from auroraai.ai_painter import make_share_card
        make_share_card(title="今晚八点直播", subtitle="AI Talk 第 12 期", qr="qrcode.png")
        ```

        ## 设计建议
        - 生成图尽量提供**风格/版式/色板**以获得稳定效果；
        - 视觉链路常与 OCR / KB 检索组成“看图问答”闭环。
        