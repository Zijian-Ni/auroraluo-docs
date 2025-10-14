# 🔊 语音与声音偏好 · Voice & TTS

## 1. 本地 TTS（edge-tts + ffmpeg）
- 文字 → `edge_tts` 合成 MP3 → `ffmpeg` 转 AMR；
- `split_long_text()` 300 字分段合成；
- `get_voice_cache_path()` 按（声线+内容）缓存。

## 2. 声音偏好设置
- DB 版：`get_user_voice_setting / set_user_voice_mode / set_user_voice_style`；
- JSON 版：`voice_settings.py` 中 `load/save/get/set`；
- 推荐默认声线：`zh-CN-XiaoxiaoNeural`。

## 3. 使用建议
- 朗读模式：更口语化、短句输出；
- 长文先要点提炼；
- 群内大段语音慎用，避免打扰。
