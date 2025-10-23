/* 跨页命中高亮：读取 hash 中 cmdq，定位正文第一处匹配并高亮滚动 */
(function () {
  const HEADER_OFFSET = 96;

  function decodeQueryFromHash() {
    const hash = location.hash || '';
    const m = hash.match(/(?:\?|&)cmdq=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }
  function clearMarks(root){
    root.querySelectorAll('mark.cmdk-hit').forEach(m => m.replaceWith(...m.childNodes));
  }
  function findAndMarkFirst(root, q){
    if (!q) return null;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement.closest('pre,code,script,style')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    q = q.trim();
    while (walker.nextNode()) {
      const t = walker.currentNode;
      const idx = t.nodeValue.toLowerCase().indexOf(q.toLowerCase());
      if (idx >= 0) {
        const mark = document.createElement('mark');
        mark.className = 'cmdk-hit';
        const before = t.nodeValue.slice(0, idx);
        const mid    = t.nodeValue.slice(idx, idx + q.length);
        const after  = t.nodeValue.slice(idx + q.length);
        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        mark.textContent = mid; frag.appendChild(mark);
        if (after) frag.appendChild(document.createTextNode(after));
        t.parentNode.replaceChild(frag, t);
        return mark;
      }
    }
    return null;
  }
  function scrollToEl(el){
    if (!el) return;
    el.scrollIntoView({ block:'start' });
    window.scrollBy(0, -HEADER_OFFSET);
  }

  function run(){
    const sect = document.querySelector('.markdown-section');
    if (!sect) return;
    clearMarks(sect);
    const q = decodeQueryFromHash();
    if (!q) return;
    const hit = findAndMarkFirst(sect, q);
    if (hit) scrollToEl(hit);
  }

  // docsify 渲染后执行
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => setTimeout(run, 0)));
  window.$docsify.plugins = plugins;

  // 也允许命令面板在同页直接触发（不改变 hash）
  document.addEventListener('cmdk:scrollToQuery', e => {
    const sect = document.querySelector('.markdown-section');
    if (!sect) return;
    clearMarks(sect);
    const hit = findAndMarkFirst(sect, (e.detail||{}).q || '');
    if (hit) scrollToEl(hit);
  });
})();
