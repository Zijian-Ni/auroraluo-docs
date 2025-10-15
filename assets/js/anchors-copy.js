(function () {
  function enhance() {
    document.querySelectorAll('.markdown-section h1, .markdown-section h2, .markdown-section h3, .markdown-section h4, .markdown-section h5, .markdown-section h6')
      .forEach(h => {
        if (!h.id || h.querySelector('.heading-anchor')) return;
        const a = document.createElement('a');
        a.className = 'heading-anchor';
        a.href = `#/${(vm && vm.route && vm.route.path) ? vm.route.path : ''}?id=${encodeURIComponent(h.id)}`;
        a.title = '复制本段链接';
        a.textContent = '🔗';
        a.addEventListener('click', async (e) => {
          e.preventDefault();
          const url = location.origin + location.pathname + a.getAttribute('href');
          try {
            await navigator.clipboard.writeText(url);
            a.textContent = '✅';
            setTimeout(() => (a.textContent = '🔗'), 800);
          } catch {
            a.textContent = '❌';
            setTimeout(() => (a.textContent = '🔗'), 800);
          }
        });
        h.appendChild(a);
      });
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) {
    hook.doneEach(function () { setTimeout(enhance, 0); });
  });
  window.$docsify.plugins = plugins;
})();
