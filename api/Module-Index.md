# API 参考 · 模块索引

按文件自动汇总，便于快速定位函数/类。**注意：以下为从源码静态提取的结构，具体语义以实现为准。**

| 模块 | 函数（前若干） | 类（前若干） | 说明（若有） |
|---|---|---|---|
| `ai_painter` | encode_image_to_base64, paint | — | coding:utf-8 |
| `ai_similar` | build_index, query_topk | — | 用手工标点表避免 \p{P} |
| `analytics` | extract_hotwords, extract_links, render_hotwords, render_activity | — |  |
| `archive_policy` | should_archive_to_qa | — | plugins/auroraai/archive_policy.py |
| `at_utils` | extract_at_user_ids | — | plugins/auroraai/at_utils.py |
| `audit` | log, list_recent | — |  |
| `auto_notes` | maybe_capture_note | — |  |
| `autoprompt` | latest_prompt_config | — |  |
| `broadcasts` | start_background_tasks | — |  |
| `cache` | get, set | — |  |
| `caps_client` | — | CapabilitiesManager |  |
| `causal_graph` | — | CausalNode, CausalEdge, CausalMemoryGraph | # -- Mutation ----------------------------------------------------------------- |
| `causal_planner` | — | CausalPlan |  |
| `chunker` | markdown_structure_chunks, smart_chunk | — |  |
| `commands` | — | — | /me show |
| `config` | — | AuroraAISettings | # Database |
| `corpus_seed` | — | — |  |
| `db_utils` | get_pool | — | plugins/auroraai/db_utils.py |
| `diag` | detect_embedder, detect_vector_backend, init, set_llm, warn_once, report | Diag | plugins/auroraai/diag.py |
| `easter_eggs` | lookup_easter_egg | — |  |
| `embedder` | embedding_ok, embedding_model_name, embed_texts | — |  |
| `emotions` | clamp, affection_label, ensure_threads, analyse_emotion_signal, update_emotion_threads, decay_daily_state | — | plugins/auroraai/emotions.py |
| `envelope` | parse_event_to_envelope | Envelope |  |
| `episodic_memory` | record_event, build_episodic_snapshot, format_episodic_context | — |  |
| `evaluation` | load_eval_cases, run_offline_eval | — |  |
| `feature_flags` | init_feature_flags, refresh_caps, list_active_features, is_feature_enabled, enable_feature, disable_feature | FeatureRegistry | # --- configuration -------------------------------------------------- |
| `federated` | aggregate_gradients, record_local_update | — |  |
| `feedback` | hash_msg | — |  |
| `feedback_db` | — | — |  |
| `fuzzy_commands` | rewrite_slash_command | — |  |
| `games` | start_idiom_game, start_guess_game, handle_game_turn, stop_game | IdiomGame, GuessWordGame |  |
| `group_memory` | should_record_fact, record_group_memory, render_group_digest, collect_group_topics | — |  |
| `guardrails` | input_guard, should_ask_clarify, needs_caution, wrap_with_caution | — | plugins/auroraai/guardrails.py |
| `health` | healthcheck | — | # DB |
| `imagegen` | leaderboard | — |  |
| `intent` | classify | IntentResult |  |
| `kb_models` | add_kb | KBItem, KBVersion | naive in-memory store; replace with DB layer in production |
| `kb_review` | list_pending, approve, reject | — |  |
| `kb_versioning` | history, commit, rollback | — | # update live |
| `knowledge_base_utils` | should_index | — | plugins/auroraai/knowledge_base_utils.py |
| `lang` | detect_lang | — |  |
| `link_reader` | read_url | — | # simple extraction |
| `logging_setup` | setup_json_logging | JsonFormatter | plugins/auroraai/logging_setup.py |
| `mc_commands` | — | — |  |
| `mc_services` | init_minecraft_service, get_minecraft_service | CommandContext, MinecraftAIService |  |
| `memory_distill` | — | — |  |
| `memory_layers` | gather_memory_context, register_causal_experience, log_episode | MemoryContext |  |
| `memory_manager` | extract_memory, render_memory, short_memory_summary | — |  |
| `metrics` | add, snapshot | — | # naive: return all |
| `middleware` | — | — |  |
| `model_scheduler` | — | ModelScheduler |  |
| `moe_router` | — | ExpertDecision, MoERouter | # ------------------------------------------------------------------ feedback |
| `multimodal` | fuse_envelope | FusionResult |  |
| `nlp_tools` | translate, polish, summarize | — | # lightweight heuristic |
| `ocr` | ocr_image, ocr_with_boxes | — |  |
| `permissions` | grant, revoke, has_role, require_any | Role | In-memory role map (can be replaced by DB table) |
| `persona` | get_persona, update_after_interaction, set_nickname, set_catchphrase, boost_affection, add_interest | — |  |
| `persona_tags` | update_dynamic_tags | — |  |
| `personalizer` | — | BanditArm, ContextualBandit |  |
| `planner` | — | — |  |
| `policy_metrics` | record_policy_hit, policy_dashboard | — |  |
| `presets` | list_presets, get_preset | — |  |
| `production_scheduler` | — | — |  |
| `profiles` | get_profile, set_profile | Profile |  |
| `profiles_db` | — | — |  |
| `prompt_pack` | detect_keyword_categories, render_system_prompt, get_full_prompt_v3, get_full_prompt_v4 | — | 关键词分类（用于辅助 Prompt 路由，来源：docs/Aurora-Prompt-Pack.md §22） |
| `provider` | — | — |  |
| `public_api_stub` | register_public_routes | — | # from fastapi import APIRouter |
| `rag` | add_document_and_chunk, search_all, format_citations | — |  |
| `rate_limit` | allow_user, allow_group | — | plugins/auroraai/rate_limit.py |
| `rca` | — | — |  |
| `retrieval_ensemble` | colbert_like_scores, ensemble_scores, dictionary_match_scores, hybrid_dense_sparse, tokenize_text | — | # Use hashing as a cheap stand-in for sub-token embedding similarity |
| `review` | — | — |  |
| `semantic_compression` | latest_compression | — |  |
| `semantic_memory` | collect_semantic_tags, update_semantic_memory, render_semantic_summary | — |  |
| `semantic_retriever` | semantic_topk, semantic_search, hybrid_topk, hybrid_search | — | plugins/auroraai/semantic_retriever.py |
| `skills` | calc, unit_convert, try_run_ext_tool | — |  |
| `startup` | setup | — | plugins/auroraai/startup.py |
| `storage` | — | Storage |  |
| `storage_mysql` | — | MySQLStorage, PGStorage | plugins/auroraai/storage_mysql.py |
| `storage_pg` | — | MySQLStorage, PGStorage | plugins/auroraai/storage_mysql.py |
| `structured_reasoning` | — | — |  |
| `summarizer` | summarize_dialogue | — | # naive: keep first N sentences |
| `task_queue` | enqueue, get_task | — |  |
| `task_scheduler` | parse_due_time, schedule_task_notification | — | plugins/auroraai/task_scheduler.py |
| `text_utils` | to_half_width, strip_zero_width, normalize_text, segment_keywords, generalize_question, text_to_pinyin | — | plugins/auroraai/text_utils.py |
| `threads` | new_thread, use_thread, get_active_thread | Thread |  |
| `threads_db` | — | — | # upsert by PK(thread_id, turn) |
| `tool_probing` | — | — |  |
| `tool_reflect` | log_tool_event, tool_reflection, run_with_reflection | — |  |
| `tools_ext` | parse_time_range, gen_table, extract_table, json_validate, json_pretty | — |  |
| `translator` | normalise_language, to_pinyin | — |  |
| `tts_provider` | — | TTSProvider, EdgeProvider, LocalVITSProvider | Default provider: reuse edge-tts based implementation |
| `tts_utils` | to_ssml_safe | — | plugins/auroraai/tts_utils.py |
| `user_memory` | set_recent_at, get_recent_at_record, get_recent_at, clear_recent_at | AtRecord | plugins/auroraai/user_memory.py |
| `user_voice` | — | — | # 默认 2 文字+语音 |
| `vector_index` | — | VectorIndex | # ------------------------------------------------------------------ # |
| `vectorizer_cache` | get_vectorizer | — | plugins/auroraai/vectorizer_cache.py |
| `vision` | analyze_images | — |  |
| `voice_settings` | get_user_voice_setting, set_user_voice_setting | — |  |
| `your_utils` | get_synonyms, text_to_pinyin, is_high_value_short_content, segment_and_generalize_question | — |  |
