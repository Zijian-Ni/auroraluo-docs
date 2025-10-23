(function () {
  function enhance() {
    const path = (vm && vm.route && vm.route.path) ? vm.route.path : '';
    document.querySelectorAll('.markdown-section h1, .markdown-section h2, .markdown-section h3, .markdown-section h4, .markdown-section h5, .markdown-section h6')
      .forEach(h => {
        if (!h.id || h.querySelector('.heading-mdlink')) return;
        const a = document.createElement('a');
        a.className = 'heading-mdlink';
        a.href = `#/${path}?id=${encodeURIComponent(h.id)}`;
        a.title = '复制 Markdown 格式链接';
        a.textContent = '[]()';
        a.addEventListener('click', async (e) => {
          e.preventDefault();
          const url = location.origin + location.pathname + a.getAttribute('href');
          const md = `[${h.textContent.replace(/🔗|\[]\(\)/g,'').trim()}](${url})`;
          try { await navigator.clipboard.writeText(md); a.textContent='✅'; setTimeout(()=>a.textContent='[]()', 700); }
          catch { a.textContent='❌'; setTimeout(()=>a.textContent='[]()', 700); }
        });
        h.appendChild(a);
      });
  }
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => setTimeout(enhance, 0)));
  window.$docsify.plugins = plugins;
})();