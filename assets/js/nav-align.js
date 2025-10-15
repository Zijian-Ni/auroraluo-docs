/* 动态让 app-nav.no-badge 从 Sidebar 右边缘开始对齐（全设备适配） */
(function () {
  const HEADER_SELECTOR = '.app-nav.no-badge';
  const SIDEBAR_SELECTOR = '#sidebar, .sidebar'; // 兼容不同主题
  const VAR_NAME = '--sidebar-offset';
  const SAFE_MIN = 0;       // 最小偏移
  const SAFE_MAX = 720;     // 安全上限（防崩布局，可按你站点调大/调小）
  const MOBILE_BP = 768;    // 小屏阈值：<= 该宽度通常 sidebar 抽屉化/隐藏

  let ro; // ResizeObserver
  let ticking = false;

  function px(n) { return `${Math.round(n)}px`; }

  function sidebarVisible(sb) {
    if (!sb) return false;
    const style = getComputedStyle(sb);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return false;

    // 如果 Sidebar 抽屉隐藏，很多主题会把它移出视口或加 transform
    // 用矩形范围判断 + 宽度判断
    const rect = sb.getBoundingClientRect();
    const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(0, rect.left));
    const isInViewport = visibleWidth > 24 && rect.right > 0; // 至少有一部分可见
    return isInViewport;
  }

  function computeOffset() {
    // 小屏直接置 0（常见是抽屉型 sidebar，需要顶栏从最左开始）
    if (window.innerWidth <= MOBILE_BP) return 0;

    const sb = document.querySelector(SIDEBAR_SELECTOR);
    if (!sb || !sidebarVisible(sb)) return 0;

    const rect = sb.getBoundingClientRect();
    // 右边缘相对视口左侧的像素就是我们要的偏移
    // 如果 Sidebar 有阴影/边框，想留一点缝隙可 +1~2px
    let offset = Math.max(SAFE_MIN, Math.min(rect.right, SAFE_MAX));
    // 还可结合文档左 padding/margin（如果你的内容有整体内边距）
    return offset;
  }

  function applyOffset() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const offset = computeOffset();
      document.documentElement.style.setProperty(VAR_NAME, px(offset));
      ticking = false;
    });
  }

  function initObserver() {
    try {
      const sb = document.querySelector(SIDEBAR_SELECTOR);
      if (sb && 'ResizeObserver' in window) {
        ro = new ResizeObserver(applyOffset);
        ro.observe(sb);
      }
    } catch {}
  }

  // 绑定关键事件：窗口尺寸、滚动（有些主题会在滚动时改变 sidebar 定位）、hash 变更（docsify 切页）
  window.addEventListener('resize', applyOffset, { passive: true });
  window.addEventListener('scroll', applyOffset, { passive: true });
  window.addEventListener('hashchange', () => setTimeout(applyOffset, 0));

  // docsify 渲染完成后再对齐一次（跨页进入）
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => setTimeout(applyOffset, 0)));
  window.$docsify.plugins = plugins;

  // 初始执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initObserver(); applyOffset(); });
  } else {
    initObserver(); applyOffset();
  }
})();
