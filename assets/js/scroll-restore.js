(function () {
  const KEY = 'aurora:scroll:';
  function key(){ return KEY + ((vm && vm.route && vm.route.path) || ''); }

  window.addEventListener('scroll', () => {
    sessionStorage.setItem(key(), String(window.scrollY || 0));
  }, { passive: true });

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => {
    const val = +sessionStorage.getItem(key()) || 0;
    if (val > 100) setTimeout(() => window.scrollTo(0, val), 0);
  }));
  window.$docsify.plugins = plugins;
})();