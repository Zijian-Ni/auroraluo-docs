// 统一规范侧栏内部锚点：把各种形态(#section / #/page#section) 重写为 #/page?id=section
(function () {
  const HEADER_OFFSET = 96;

  function normalizeHref(href, currentHash) {
    if (!href) return href;

    // #/page#section  -> #/page?id=section
    const m2 = href.match(/^#\/([^#?]+)#(.+)$/);
    if (m2) return `#/${m2[1]}?id=${encodeURIComponent(m2[2])}`;

    // 纯 #section -> #/current?id=section
    if (href.startsWith('#') && !href.startsWith('#/')) {
      const id = decodeURIComponent(href.slice(1));
      const m = (currentHash || '').match(/^#\/([^?]+)(?:\?.*)?$/);
      if (m) return `#/${m[1]}?id=${encodeURIComponent(id)}`;
    }
    return href;
  }

  // 点击时拦截（兜底）
  function onClickFix(e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const normalized = normalizeHref(href, location.hash);
    if (normalized && normalized !== href) {
      e.preventDefault();
      location.hash = normalized;
    }
  }

  // 渲染后，把 sidebar 中的 href 直接改成标准形式（右键复制/新标签打开都生效）
  function rewriteSidebarAnchors() {
    const bar = document.querySelector('.sidebar-nav');
    if (!bar) return;
    bar.querySelectorAll('a[href]').forEach(a => {
      const old = a.getAttribute('href');
      const neu = normalizeHref(old, location.hash);
      if (neu && neu !== old) a.setAttribute('href', neu);
    });
  }

  // 进入页面/路由切换后，若 hash 带 ?id=，做一次偏移滚动兜底（避免被顶栏遮挡）
  function fixScrollOffset() {
    const hash = decodeURIComponent(location.hash || '');
    const m = hash.match(/\?id=([^&]+)/);
    if (!m) return;
    const id = m[1];
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: 'start' });
      window.scrollBy(0, -HEADER_OFFSET);
    }
  }

  document.addEventListener('click', onClickFix, true);

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) {
    hook.doneEach(function () {
      setTimeout(() => { rewriteSidebarAnchors(); fixScrollOffset(); }, 0);
    });
  });
  window.$docsify.plugins = plugins;

  window.addEventListener('hashchange', () => setTimeout(fixScrollOffset, 0));
})();
