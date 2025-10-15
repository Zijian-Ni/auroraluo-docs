(function () {
  function enhance() {
    const origin = location.origin;
    document.querySelectorAll('.markdown-section a[href^="http"]')
      .forEach(a => {
        if (a.href.startsWith(origin)) return;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.classList.add('external');
      });
  }
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) { hook.doneEach(function () { setTimeout(enhance, 0); }); });
  window.$docsify.plugins = plugins;
})();
