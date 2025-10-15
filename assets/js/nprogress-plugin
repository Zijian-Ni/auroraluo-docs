(function () {
  if (!window.NProgress) return;
  NProgress.configure({ showSpinner: false, trickleSpeed: 120 });

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) {
    hook.beforeEach(function (html) { NProgress.start(); return html; });
    hook.doneEach(function () { NProgress.done(); });
  });
  window.$docsify.plugins = plugins;
})();
