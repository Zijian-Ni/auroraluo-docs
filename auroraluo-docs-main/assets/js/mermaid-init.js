(function () {
  function render() {
    if (!window.mermaid) return;
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    const blocks = Array.from(document.querySelectorAll('pre code.language-mermaid'));
    blocks.forEach((code, i) => {
      const container = document.createElement('div');
      container.className = 'mermaid';
      container.textContent = code.textContent;
      const pre = code.parentElement;
      pre.parentElement.replaceChild(container, pre);
    });
    try { mermaid.run(); } catch (e) { console.warn('Mermaid error', e); }
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) { hook.doneEach(function () { setTimeout(render, 0); }); });
  window.$docsify.plugins = plugins;
})();
