/* Command Palette - Advanced: 模糊拼音 + 全文索引 + 跨页高亮跳转 */
(function () {
  const { createMask } = window.AURORA_UI || {};
  const INDEX_KEY = 'aurora:cmdk:index:v2';
  const INDEX_TTL = 7 * 24 * 3600 * 1000; // 7天缓存
  const MAX_PAGES = 80; // 最大索引页数，避免过重

  /* ---------------- 工具 ---------------- */
  function getCurrentPath() {
    const m = (location.hash || '').match(/^#\/([^?]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }
  function hrefForHeading(id) {
    const path = getCurrentPath();
    return `#/${path}?id=${encodeURIComponent(id)}`;
  }
  function navigate(href) {
    if (!href) return;
    if (href === location.hash) {
      // 同 hash：手动滚动锚点或触发高亮
      const mId = href.match(/\bid=([^&]+)/);
      const mQ  = href.match(/\bcmdq=([^&]+)/);
      if (mId) {
        const el = document.getElementById(decodeURIComponent(mId[1]));
        if (el) { el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -96); }
      } else if (mQ) {
        const q = decodeURIComponent(mQ[1]); // 交给高亮脚本
        document.dispatchEvent(new CustomEvent('cmdk:scrollToQuery', { detail: { q } }));
      }
      return;
    }
    location.hash = href;
  }
  function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

  /* ---------------- 拼音支持（可选 TinyPinyin） ---------------- */
  // 轻量 fallback：仅把 A-Za-z0-9 和中文分开，中文返回原字（用于首字母近似）
  function simplePinyin(s) {
    // 若存在 TinyPinyin，则用它（全拼更准确）
    if (window.TinyPinyin && TinyPinyin.isSupported()) {
      return TinyPinyin.convertToPinyin(s, ' ', true).toLowerCase();
    }
    // fallback：中文 => 自身；其他 => 直接
    return (s || '').split('').map(ch => /[\u4e00-\u9fa5]/.test(ch) ? ch : ch.toLowerCase()).join(' ');
  }
  function pinyinInitials(s) {
    if (window.TinyPinyin && TinyPinyin.isSupported()) {
      // 取每个音节首字母
      const py = TinyPinyin.convertToPinyin(s, ' ', true).toLowerCase().split(/\s+/).filter(Boolean);
      return py.map(x => x[0]).join('');
    }
    // fallback：中文原字，其他取首字母
    return (s || '').split('').map(ch => /[\u4e00-\u9fa5]/.test(ch) ? ch : ch[0]?.toLowerCase() || '').join('');
  }

  /* ---------------- 模糊评分 ---------------- */
  function fuzzyScore(q, s) {
    q = (q||'').toLowerCase(); s = (s||'').toLowerCase();
    if (!q) return 0;
    if (s.includes(q)) return 1000 - s.indexOf(q);
    let qi=0, run=0, best=0;
    for (let i=0;i<s.length && qi<q.length;i++) {
      if (s[i]===q[qi]) { qi++; run++; if (run>best) best=run; } else run=0;
    }
    return qi===q.length ? 100 + best : -1;
  }
  function anyScore(q, text) {
    const a = [
      fuzzyScore(q, text),
      fuzzyScore(pinyinInitials(q), pinyinInitials(text)),
      fuzzyScore(simplePinyin(q), simplePinyin(text)),
    ];
    return Math.max(...a);
  }

  /* ---------------- 数据收集 ---------------- */
  function sidebarPaths() {
    const ps = [];
    document.querySelectorAll('.sidebar-nav a[href^="#/"]').forEach(a=>{
      const m = a.getAttribute('href').match(/^#\/([^?]+)/);
      if (m) ps.push(m[1]);
    });
    return Array.from(new Set(ps)).slice(0, MAX_PAGES);
  }

  async function fetchMd(path) {
    const url = path.endsWith('.md') ? path : (path + '.md');
    try {
      const res = await fetch(url);
      if (!res.ok) throw 0;
      return await res.text();
    } catch { return ''; }
  }

  function splitSections(md) {
    // 简单把正文切分成若干段落，附上最近的标题文本
    const lines = (md||'').split(/\r?\n/);
    const secs = [];
    let curTitle = '';
    let buf = [];
    for (const line of lines) {
      const m = line.match(/^(#{1,6})\s+(.+)/);
      if (m) {
        if (buf.length) secs.push({ title: curTitle, content: buf.join('\n') });
        curTitle = m[2].trim();
        buf = [];
      } else {
        buf.push(line);
      }
    }
    if (buf.length) secs.push({ title: curTitle, content: buf.join('\n') });
    return secs;
  }

  async function buildIndex(paths) {
    const idx = [];
    for (let i=0;i<paths.length;i++) {
      const path = paths[i];
      const md = await fetchMd(path);
      const secs = splitSections(md);
      // 每个 section 生成一个条目（用于精确跳转/高亮）
      secs.forEach((s, j) => {
        const text = `${s.title}\n${s.content}`.replace(/[`*#>\[\]\(\)!_>-]/g,' ');
        idx.push({
          path,
          section: j,
          title: s.title || path,
          preview: s.content.slice(0,180).replace(/\s+/g,' '),
          text
        });
      });
      await new Promise(r => setTimeout(r, 2));
    }
    localStorage.setItem(INDEX_KEY, JSON.stringify({ ts: Date.now(), idx }));
    return idx;
  }
  function loadIndex() {
    try {
      const o = JSON.parse(localStorage.getItem(INDEX_KEY)||'{}');
      if (!o.idx) return null;
      if (Date.now() - (o.ts||0) > INDEX_TTL) return null;
      return o.idx;
    } catch { return null; }
  }
  async function ensureIndex() {
    const cached = loadIndex();
    if (cached) return cached;
    return await buildIndex(sidebarPaths());
  }

  /* ---------------- Palette UI ---------------- */
  let mask, panel, input, list, empty, loadingEl;
  function ensureUI() {
    if (panel) return;
    mask = createMask('cmdk-mask');
    panel = document.createElement('div'); panel.id = 'cmdk';
    input = document.createElement('input'); input.placeholder = '搜索页面/标题/正文…（支持中文 & 拼音，↑↓ 选择，Enter 跳转）';
    list  = document.createElement('div'); list.className = 'list';
    empty = document.createElement('div');  empty.style.padding='10px 14px'; empty.style.opacity='.7';
    loadingEl = document.createElement('div'); loadingEl.style.padding='10px 14px'; loadingEl.textContent='正在准备全文索引…';

    panel.append(input, list);
    document.body.append(mask, panel);

    mask.addEventListener('click', close);
    input.addEventListener('keydown', keynav);
    input.addEventListener('input', debounce(refresh, 60));
  }
  function open(){ ensureUI(); panel.style.display='block'; mask.style.display='block'; input.value=''; renderPlaceholder(); input.focus(); warmup(); }
  function close(){ if (!panel) return; panel.style.display='none'; mask.style.display='none'; }

  async function warmup(){
    // 预取索引（异步），首次打开显示 "准备全文索引"
    if (loadIndex()) return;
    list.innerHTML=''; list.appendChild(loadingEl);
    await ensureIndex();
    refresh();
  }

  function keynav(e){
    const items = Array.from(list.querySelectorAll('.item'));
    let cur = items.findIndex(x=>x.classList.contains('active'));
    if (e.key==='ArrowDown'){ e.preventDefault(); if(items.length){ items.forEach(x=>x.classList.remove('active')); items[(cur+1+items.length)%items.length].classList.add('active'); } }
    else if (e.key==='ArrowUp'){ e.preventDefault(); if(items.length){ items.forEach(x=>x.classList.remove('active')); items[(cur-1+items.length)%items.length].classList.add('active'); } }
    else if (e.key==='Enter'){ e.preventDefault(); const act = items.find(x=>x.classList.contains('active')) || items[0]; if (act){ navigate(act.dataset.href); close(); } }
    else if (e.key==='Escape'){ close(); }
  }

  function collectCurrentHeadings(){
    const arr=[];
    document.querySelectorAll('.markdown-section h2, .markdown-section h3, .markdown-section h4').forEach(h=>{
      if (!h.id) return;
      arr.push({ text:`本页：${h.textContent.trim()}`, href: hrefForHeading(h.id) });
    });
    return arr;
  }

  function renderPlaceholder(){
    list.innerHTML='';
    empty.textContent = '输入关键词开始搜索（支持：标题/正文、中文、拼音全拼/首字母）';
    list.appendChild(empty);
  }

  async function searchAll(q){
    const res = [];
    const qLower = q.toLowerCase();

    // 1) 侧栏页面标题
    document.querySelectorAll('.sidebar-nav a[href^="#/"]').forEach(a=>{
      const href = a.getAttribute('href');
      const text = a.textContent.trim().replace(/\s+/g,' ');
      const s = anyScore(q, text);
      if (s>=0) res.push({ text, href, score: s+50 }); // 页面名稍微加权
    });

    // 2) 当前页标题
    collectCurrentHeadings().forEach(h=>{
      const s = anyScore(q, h.text);
      if (s>=0) res.push({ text: h.text, href: h.href, score: s+40 });
    });

    // 3) 全文索引（跨页面，正文）
    const idx = await ensureIndex();
    idx.forEach(row=>{
      const s = anyScore(q, `${row.title} ${row.text}`);
      if (s>=0){
        // 用 cmdq 传给目标页做高亮 & 自动滚动
        const href = `#/${row.path}?cmdq=${encodeURIComponent(q)}`;
        res.push({
          text: `${row.title || row.path}  ·  ${row.preview.replace(/\s+/g,' ')}`,
          href, score: s
        });
      }
    });

    res.sort((a,b)=> b.score - a.score);
    return res.slice(0, 80);
  }

  async function refresh(){
    const q = input.value.trim();
    if (!q){ renderPlaceholder(); return; }

    list.innerHTML='';
    const results = await searchAll(q);
    if (!results.length){
      empty.textContent = `没有匹配 “${q}” 的结果`;
      list.appendChild(empty);
      return;
    }

    results.forEach((e,i)=>{
      const item = document.createElement('div');
      item.className = 'item' + (i===0 ? ' active' : '');
      item.dataset.href = e.href;
      item.innerHTML = e.text.replace(/</g,'&lt;');
      item.onclick = () => { navigate(e.href); close(); };
      list.appendChild(item);
    });
  }

  document.getElementById('cmdk-open-btn')?.addEventListener('click', open);
  document.addEventListener('keydown', (e)=>{ const mod=e.ctrlKey||e.metaKey; if(mod && e.key.toLowerCase()==='k'){ e.preventDefault(); open(); }});

  // docsify 渲染后，若面板开着则刷新本页标题候选
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => { if (panel && panel.style.display!=='none') refresh(); }));
  window.$docsify.plugins = plugins;
})();
