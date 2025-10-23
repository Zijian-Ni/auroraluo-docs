(function () {
  function countMeta() {
    const sect = document.querySelector('.markdown-section');
    if (!sect) return;
    sect.querySelector('.reading-meta')?.remove();
    const text = sect.innerText || '';
    const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const words   = (text.replace(/[\u4e00-\u9fa5]/g,' ').trim().split(/\s+/).filter(Boolean).length);
    const mins = Math.max(1, Math.round((cnChars/300) + (words/200)));
    const meta = document.createElement('div');
    meta.className = 'reading-meta';
    meta.innerHTML = `<span>≈ ${mins} 分钟读完</span><span>中文字符：${cnChars}</span><span>英文词数：${words}</span>`;
    const h1 = sect.querySelector('h1,h2');
    if (h1 && h1.parentNode) h1.parentNode.insertBefore(meta, h1.nextSibling);
    else sect.prepend(meta);
  }
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => setTimeout(countMeta, 0)));
  window.$docsify.plugins = plugins;
})();