(function () {
  function enhance() {
    const imgs = Array.from(document.querySelectorAll('.markdown-section img'));
    if (!imgs.length) return;

    imgs.forEach(img => {
      img.loading = 'lazy';
      img.style.filter = 'blur(4px)';
      img.style.transition = 'filter .25s ease';
      img.addEventListener('load', () => { img.style.filter = 'blur(0)'; }, { once: true });
    });
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) {
    hook.doneEach(function () { setTimeout(enhance, 0); });
  });
  window.$docsify.plugins = plugins;
})();
