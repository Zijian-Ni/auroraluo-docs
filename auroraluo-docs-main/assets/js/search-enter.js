(function () {
  function bind() {
    const input = document.querySelector('.search input');
    if (!input || input._enterBound) return;
    input._enterBound = true;
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const first = document.querySelector('.results-panel a');
      if (first) {
        e.preventDefault();
        first.click();
      }
    });
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => setTimeout(bind, 0)));
  window.$docsify.plugins = plugins;
})();
