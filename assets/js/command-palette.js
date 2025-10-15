(function () {
  const { showToast, createMask } = window.AURORA_UI || {};

  let mask, panel, input, list;
  function ensure() {
    if (panel) return;
    mask = createMask('cmdk-mask');
    panel = document.createElement('div'); panel.id = 'cmdk';
    input = document.createElement('input'); input.placeholder = '搜索页面或本页标题…';
    list = document.createElement('div'); list.className = 'list';
    panel.append(input, list);
    document.body.append(mask, panel);

    mask.addEventListener('click', close);
    input.addEventListener('keydown', keynav);
    input.addEventListener('input', refresh);
  }

  function open() {
    ensure();
    panel.style.display = 'block'; mask.style.display = 'block';
    input.value = ''; refresh(); input.focus();
  }
  function close() { if (!panel) return; panel.style.display = 'none'; mask.style.display = 'none'; }

  function keynav(e) {
    const items = Array.from(list.querySelectorAll('.item'));
    let cur = items.findIndex(x => x.classList.contains('active'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length) { items.forEach(x=>x.classList.remove('active')); items[(cur+1) % items.length].classList.add('active'); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length) { items.forEach(x=>x.classList.remove('active')); items[(cur-1+items.length) % items.length].classList.add('active'); }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const act = items.find(x => x.classList.contains('active')) || items[0];
      if (act) { location.hash = act.dataset.href; close(); }
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function collectEntries() {
    const entries = [];
    document.querySelectorAll('.sidebar-nav a[href^="#/"]').forEach(a => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim();
      if (text) entries.push({ text, href });
    });
    const path = (vm && vm.route && vm.route.path) ? vm.route.path : '';
    document.querySelectorAll('.markdown-section h2, .markdown-section h3, .markdown-section h4').forEach(h => {
      if (!h.id) return;
      entries.push({ text: `[本页] ${h.textContent.trim()}`, href: `#/${path}?id=${encodeURIComponent(h.id)}` });
    });
    const seen = new Set(); return entries.filter(e => { if (seen.has(e.href)) return false; seen.add(e.href); return true; });
  }

  function score(q, s) {
    q = q.toLowerCase(); s = s.toLowerCase();
    if (!q) return 0;
    if (s.includes(q)) return 1000 - s.indexOf(q);
    let qi = 0, run = 0, best = 0;
    for (let i=0;i<s.length && qi<q.length;i++){
      if (s[i]===q[qi]){ qi++; run++; best=Math.max(best,run); } else run=0;
    }
    return qi===q.length ? 100 + best : -1;
  }

  function refresh() {
    const q = input.value.trim();
    const data = collectEntries()
      .map(e => ({ ...e, _score: score(q, e.text) }))
      .filter(e => q ? e._score >= 0 : true)
      .sort((a,b) => b._score - a._score)
      .slice(0, 40);

    list.innerHTML = '';
    data.forEach((e, i) => {
      const item = document.createElement('div');
      item.className = 'item' + (i===0 ? ' active' : '');
      item.dataset.href = e.href;
      item.innerHTML = e.text.replace(/</g,'&lt;');
      item.onclick = () => { location.hash = e.href; close(); };
      list.appendChild(item);
    });
  }

  const btn = document.getElementById('cmdk-open-btn');
  if (btn) btn.addEventListener('click', open);
  document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
  });

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => { if (panel && panel.style.display !== 'none') refresh(); }));
  window.$docsify.plugins = plugins;
})();