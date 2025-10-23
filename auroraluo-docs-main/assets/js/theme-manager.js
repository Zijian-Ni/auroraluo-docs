(function () {
  const THEME_KEY = 'aurora:theme';         // 'light' | 'dark'
  const PREFS_KEY = 'aurora:prefs';         // 里边可能有 autoDark:true/false
  const root = document.documentElement;
  const btn  = document.getElementById('theme-switch-btn');

  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; }
    catch { return {}; }
  }
  function savePrefs(p) { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    localStorage.setItem(THEME_KEY, mode);
    if (btn) btn.title = `切换明/暗（当前：${mode === 'dark' ? '深色' : '浅色'}）`;
  }

  function applyOnLoad() {
    const prefs = loadPrefs();
    if (prefs.autoDark && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const sync = () => setTheme(mq.matches ? 'dark' : 'light');
      sync();
      mq.onchange = sync;
      return;
    }
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(saved);
  }

  function toggleManual() {
    // 如果开启了“跟随系统”，用户手动点按钮则关闭自动，进入手动模式
    const prefs = loadPrefs();
    if (prefs.autoDark) { prefs.autoDark = false; savePrefs(prefs); }

    const cur = (root.getAttribute('data-theme') || 'light').toLowerCase();
    setTheme(cur === 'dark' ? 'light' : 'dark');
  }

  if (btn) btn.addEventListener('click', toggleManual);
  applyOnLoad();
})();
