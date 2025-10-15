(function () {
  async function loadGlossary() {
    try {
      const res = await fetch('data/glossary.json'); if (!res.ok) throw 0;
      return await res.json();
    } catch { return {}; }
  }
  function walkAndWrap(root, terms) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const keys = Object.keys(terms).filter(k => k && k.length >= 2);
    if (!keys.length) return;

    while (walker.nextNode()) {
      const t = walker.currentNode;
      if (!t.nodeValue || !t.nodeValue.trim()) continue;
      if (t.parentElement.closest('pre,code,a,abbr')) continue;

      for (const k of keys) {
        const re = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\$&')}\\b`, 'i');
        if (re.test(t.nodeValue)) {
          const abbr = document.createElement('abbr');
          abbr.className = 'glossary';
          abbr.title = terms[k];
          const spanBefore = document.createTextNode(t.nodeValue.replace(re, '$`'));
          const spanTerm = document.createElement('span'); spanTerm.textContent = t.nodeValue.match(re)[0];
          const spanAfter = document.createTextNode(t.nodeValue.replace(re, '$\''));
          abbr.appendChild(spanBefore); abbr.appendChild(spanTerm); abbr.appendChild(spanAfter);
          t.parentNode.replaceChild(abbr, t);
          break;
        }
      }
    }
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(async () => {
    const sect = document.querySelector('.markdown-section'); if (!sect) return;
    const dict = await loadGlossary(); walkAndWrap(sect, dict);
  }));
  window.$docsify.plugins = plugins;
})();