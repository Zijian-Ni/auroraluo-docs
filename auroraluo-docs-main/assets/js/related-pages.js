(function () {
  const LS = 'aurora:related:index';
  const MAX_PAGES = 40;

  function parseSidebarPaths() {
    const paths = [];
    document.querySelectorAll('.sidebar-nav a[href^="#/"]').forEach(a => {
      const href = a.getAttribute('href');
      const m = href.match(/^#\/([^?]+)/);
      if (m) paths.push(m[1]);
    });
    return Array.from(new Set(paths)).slice(0, MAX_PAGES);
  }

  function tokenize(txt) {
    txt = (txt || '').toLowerCase();
    const words = txt.replace(/`[^`]+`/g,' ').split(/[^a-z0-9\u4e00-\u9fa5]+/).filter(Boolean);
    return words;
  }

  function tf(tokens) {
    const m = new Map();
    tokens.forEach(t => m.set(t, (m.get(t)||0)+1));
    const obj = {}; m.forEach((v,k)=> obj[k]=v); return obj;
  }

  function cosine(a, b) {
    let dot=0, na=0, nb=0;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    keys.forEach(k => {
      const va = a[k]||0, vb = b[k]||0;
      dot += va*vb; na += va*va; nb += vb*vb;
    });
    if (!na || !nb) return 0;
    return dot / Math.sqrt(na*nb);
  }

  async function fetchMd(path) {
    const url = path.endsWith('.md') ? path : (path + '.md');
    try {
      const res = await fetch(url); if (!res.ok) throw 0;
      return await res.text();
    } catch { return ''; }
  }

  async function buildIndex(paths) {
    const idx = {};
    for (let i=0;i<paths.length;i++){
      const p = paths[i];
      const md = await fetchMd(p);
      const toks = tokenize(md);
      idx[p] = tf(toks);
      await new Promise(r => setTimeout(r, 5));
    }
    localStorage.setItem(LS, JSON.stringify({ ts: Date.now(), idx }));
    return idx;
  }

  function loadIndex() {
    try {
      const o = JSON.parse(localStorage.getItem(LS) || '{}');
      if (Date.now() - (o.ts||0) > 7*24*3600*1000) return null;
      return o.idx || null;
    } catch { return null; }
  }

  async function ensureIndex(paths) {
    const cached = loadIndex();
    if (cached) return cached;
    return await buildIndex(paths);
  }

  function renderRelated(simList) {
    const sect = document.querySelector('.markdown-section');
    if (!sect || !simList.length) return;
    const box = document.createElement('div');
    box.className = 'annotations-panel';
    box.innerHTML = `<h4>相关推荐</h4>`;
    simList.slice(0,5).forEach(it => {
      const a = document.createElement('a');
      a.href = `#/${it.path}`; a.textContent = `${it.title || it.path}（相似度 ${(it.score*100).toFixed(0)}%）`
      a.style.display = 'block'; a.style.margin = '6px 0';
      box.appendChild(a);
    });
    sect.appendChild(box);
  }

  function currentTokens() {
    const sect = document.querySelector('.markdown-section');
    const txt = sect ? sect.innerText : '';
    return tf(tokenize(txt));
  }

  function pathTitleMap() {
    const map = {};
    document.querySelectorAll('.sidebar-nav a[href^="#/"]').forEach(a => {
      const m = a.getAttribute('href').match(/^#\/([^?]+)/);
      if (m) map[m[1]] = a.textContent.trim();
    });
    return map;
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(async () => {
    const paths = parseSidebarPaths();
    const idx = await ensureIndex(paths);
    const cur = (vm && vm.route && vm.route.path) || '';
    const curVec = currentTokens();
    const titleMap = pathTitleMap();
    const sim = Object.keys(idx)
      .filter(p => p !== cur)
      .map(p => ({ path: p, title: titleMap[p], score: cosine(curVec, idx[p]) }))
      .filter(x => x.score > 0.02)
      .sort((a,b) => b.score - a.score);
    renderRelated(sim);
  }));
  window.$docsify.plugins = plugins;
})();