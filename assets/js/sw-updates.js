(function () {
  const { snackbar } = window.AURORA_UI || {};
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.getRegistration().then(reg => {
    if (!reg) return;
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw && nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          const bar = snackbar('站点有新版本', '刷新');
          const refresh = () => location.reload();
          bar.querySelector('button').onclick = refresh;
        }
      });
    });
  });
})();