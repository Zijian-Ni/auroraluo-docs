(function () {
  function enableLineNumbers() {
    document.querySelectorAll('pre > code').forEach(code => {
      const pre = code.parentElement;
      pre.classList.add('line-numbers');
    });
    if (window.Prism && Prism.plugins && Prism.plugins.lineNumbers) {
      // Prism 会自动处理 line-numbers 类
    }
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) { hook.doneEach(function () { setTimeout(enableLineNumbers, 0); }); });
  window.$docsify.plugins = plugins;
})();
