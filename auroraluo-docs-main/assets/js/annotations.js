(function () {
  const STORAGE = 'aurora:ann:';
  const bubble = document.createElement('div');
  bubble.className = 'annotation-bubble';
  bubble.textContent = '添加标注';
  document.body.appendChild(bubble);

  let lastSel = null;

  function getKey(){ return STORAGE + ((vm && vm.route && vm.route.path) || ''); }
  function load(){ try { return JSON.parse(localStorage.getItem(getKey())) || []; } catch { return []; } }
  function save(arr){ localStorage.setItem(getKey(), JSON.stringify(arr)); }

  function getSelectionRect() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const r = sel.getRangeAt(0).getBoundingClientRect();
    return r;
  }

  function showBubbleAt(rect) {
    bubble.style.left = (rect.left + rect.width/2 + window.scrollX) + 'px';
    bubble.style.top  = (rect.top + window.scrollY) + 'px';
    bubble.style.display = 'block';
  }
  function hideBubble(){ bubble.style.display = 'none'; }

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { hideBubble(); return; }
    const anc = sel.anchorNode;
    const sect = document.querySelector('.markdown-section');
    if (!sect || !anc || !sect.contains(anc)) { hideBubble(); return; }
    const rect = getSelectionRect();
    if (rect && rect.width && rect.height) { lastSel = sel.toString(); showBubbleAt(rect); }
    else hideBubble();
  });

  bubble.addEventListener('click', () => {
    const text = (lastSel || '').trim();
    if (!text || text.length < 2) return hideBubble();
    const note = prompt('为该高亮添加备注（可留空）：') || '';
    const data = load();
    data.push({ text, note, ts: Date.now() });
    save(data);
    hideBubble();
    renderHighlights();
    renderPanel();
  });

  function safeWrap(node, term) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    let done = false;
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    while (walker.nextNode() && !done) {
      const t = walker.currentNode;
      if (!t.nodeValue || t.nodeValue.trim().length === 0) continue;
      const parentPre = t.parentElement.closest('pre,code');
      if (parentPre) continue;
      const m = re.exec(t.nodeValue);
      if (m) {
        const span = document.createElement('span'); span.className = 'annotation-highlight';
        const before = t.nodeValue.slice(0, m.index);
        const mid    = t.nodeValue.slice(m.index, m.index + term.length);
        const after  = t.nodeValue.slice(m.index + term.length);
        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        span.textContent = mid;
        frag.appendChild(span);
        if (after) frag.appendChild(document.createTextNode(after));
        t.parentNode.replaceChild(frag, t);
        done = true;
      }
    }
  }

  function renderHighlights() {
    const sect = document.querySelector('.markdown-section');
    if (!sect) return;
    const arr = load();
    arr.forEach(a => safeWrap(sect, a.text));
  }

  function renderPanel() {
    const sect = document.querySelector('.markdown-section');
    if (!sect) return;
    sect.querySelector('.annotations-panel')?.remove();
    const arr = load();
    if (!arr.length) return;

    const box = document.createElement('div'); box.className = 'annotations-panel';
    box.innerHTML = `<h4>本页标注</h4>`;
    arr.forEach((a, i) => {
      const div = document.createElement('div'); div.className = 'note';
      const dt = new Date(a.ts);
      div.innerHTML = `<div class="meta">${dt.toLocaleString()}</div>
                       <div class="txt">“${a.text.replace(/</g,'&lt;')}”</div>
                       ${a.note ? `<div class="meta">备注：${a.note.replace(/</g,'&lt;')}</div>` : ''}
                       <button data-i="${i}">删除</button>`;
      div.querySelector('button').onclick = () => {
        const arr2 = load(); arr2.splice(i,1); save(arr2); renderPanel(); location.reload();
      };
      box.appendChild(div);
    });
    sect.appendChild(box);
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => { setTimeout(() => { renderHighlights(); renderPanel(); }, 0); }));
  window.$docsify.plugins = plugins;
})();