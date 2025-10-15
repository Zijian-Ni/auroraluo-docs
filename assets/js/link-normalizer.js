// 规范化侧栏内部锚点：统一为 #/page?id=section
(function () {
  function normalizeHref(href, current) {
    if (!href) return href;
    // 只锚点（#section）
    if (href.startsWith('#') && !href.startsWith('#/')) {
      const id = decodeURIComponent(href.slice(1));
      const m = (current || '').match(/^#\/([^?]+)(?:\?.*)?$/);
      if (m) return `#/${m[1]}?id=${encodeURIComponent(id)}`;
    }
    // #/page#section -> #/page?id=section
    const m2 = href.match(/^#\/([^#?]+)#(.+)$/);
    if (m2) return `#/${m2[1]}?id=${encodeURIComponent(m2[2])}`;
    return href;
  }

  function install() {
    const sidebar = document.querySelector('.sidebar-nav') || document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.addEventListener('click', function (e) {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      const normalized = normalizeHref(href, location.hash);
      if (normalized && normalized !== href) {
        e.preventDefault();
        location.hash = normalized;
      }
    }, true);
  }

  if (document.readyState !== 'loading') install();
  else document.addEventListener('DOMContentLoaded', install);
})();
