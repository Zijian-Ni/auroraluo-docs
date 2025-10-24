/*!
 * Aurora Docsify · Layout Adapter (No Top Navbar)
 * - 动态同步 --sidebar-width / --sidebar-offset
 * - 固定 --anchor-offset=18（无顶栏）
 * - 兼容桌面固定 + 小屏抽屉
 * - 不再引用/操作 .app-nav
 */
(function () {
  // 配置
  const SIDEBAR_SELECTOR = '#sidebar, .sidebar'; // 兼容不同主题
  const MOBILE_BP = 992;       // <992 视为小屏抽屉
  const SAFE_MIN = 0;
  const SAFE_MAX = 720;
  const ANCHOR_OFFSET = 18;    // 无顶栏固定偏移
  const INJECT_MENU_TOGGLE = true; // 是否注入左上角 ☰ 按钮

  const R = document.documentElement;
  let ro; // ResizeObserver
  let ticking = false;

  // 工具
  const px = n => `${Math.round(n || 0)}px`;
  const isMobile = () => window.innerWidth < MOBILE_BP;

  function sidebarEl() {
    return document.querySelector(SIDEBAR_SELECTOR);
  }

  function sidebarVisible(sb) {
    if (!sb) return false;
    const cs = getComputedStyle(sb);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const rect = sb.getBoundingClientRect();
    const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(0, rect.left));
    return visibleWidth > 24 && rect.right > 0; // 至少一部分在视口中
  }

  function measureSidebarWidth() {
    const sb = sidebarEl();
    if (!sb) return 0;
    // 桌面：读取真实宽；小屏：保持变量不被 0 覆盖（由 offset 控制抽屉）
    if (!isMobile()) {
      return Math.round(sb.getBoundingClientRect().width);
    }
    // 小屏下，侧栏宽度用于抽屉宽度显示，可读真实宽；若主题初始 transform 导致 0，则降级用 260
    const w = Math.round(sb.getBoundingClientRect().width);
    return w > 0 ? w : 260;
  }

  function computeSidebarOffset() {
    // 小屏抽屉模式，顶栏为 0 起点，offset 必须是 0
    if (isMobile()) return 0;

    const sb = sidebarEl();
    if (!sb || !sidebarVisible(sb)) return 0;

    const rect = sb.getBoundingClientRect();
    // 右边缘相对视口左侧即为偏移
    return Math.max(SAFE_MIN, Math.min(rect.right, SAFE_MAX));
  }

  function applyVars() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sbw = measureSidebarWidth();
      const offset = computeSidebarOffset();

      R.style.setProperty('--sidebar-width', px(sbw));
      R.style.setProperty('--sidebar-offset', px(offset));
      R.style.setProperty('--anchor-offset', px(ANCHOR_OFFSET)); // 固定 18

      ticking = false;
    });
  }

  function initResizeObserver() {
    const sb = sidebarEl();
    if (sb && 'ResizeObserver' in window) {
      ro = new ResizeObserver(applyVars);
      ro.observe(sb);
    }
  }

  // 监听变化：尺寸、滚动（有些主题滚动时会改变定位）、hash（docsify 切页）
  window.addEventListener('resize', applyVars, { passive: true });
  window.addEventListener('orientationchange', applyVars, { passive: true });
  window.addEventListener('scroll', applyVars, { passive: true });
  window.addEventListener('hashchange', () => setTimeout(applyVars, 0));

  // Docsify 渲染后再算一次（跨页进入/分页）
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => setTimeout(applyVars, 0)));
  window.$docsify.plugins = plugins;

  // 小屏注入 ☰ 按钮（可选）
  function ensureMenuToggle() {
    if (!INJECT_MENU_TOGGLE) return;
    if (document.getElementById('menu-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'menu-toggle';
    btn.textContent = '☰';
    btn.title = '展开/收起菜单';
    // 这里不写内联样式，交给 CSS（custom.css）统一控制显示/隐藏与美化
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      document.body.classList.toggle('close');
      // 展开/收起后重算一次
      setTimeout(applyVars, 0);
    });

    if (isMobile()) {
      document.body.classList.add('close'); // 小屏默认收起
    }
  }

  // 初始执行
  function boot() {
    initResizeObserver();
    ensureMenuToggle();
    applyVars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
