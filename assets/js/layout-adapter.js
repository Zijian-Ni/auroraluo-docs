(function () {
  const r = document.documentElement;

  function px(n){ return (typeof n === 'number' ? n : 0) + 'px'; }

  function getSidebarWidth(){
    const sb = document.querySelector('.sidebar');
    if(!sb) return 0;
    // 只在桌面断点采用真实宽度，其余为 0（移动端抽屉式）
    const isDesktop = window.matchMedia('(min-width: 992px)').matches;
    return isDesktop ? Math.round(sb.getBoundingClientRect().width) : 0;
  }

  function getNavHeight(){
    const nav = document.querySelector('.app-nav');
    const progress = document.getElementById('reading-progress');
    const navH = nav ? Math.round(nav.getBoundingClientRect().height) : 56;
    const progressH = progress ? Math.round(progress.getBoundingClientRect().height || 3) : 3;
    return navH + progressH + 10; // 额外留白 10px
  }

  function applyLayoutVars(){
    const sbw = getSidebarWidth();
    r.style.setProperty('--sidebar-width', px(sbw));
    r.style.setProperty('--sidebar-offset', px(sbw));
    r.style.setProperty('--nav-height', px(getNavHeight()));
    r.style.setProperty('--anchor-offset', px(getNavHeight()));
    // 同步顶栏的 margin-left & width，使其与侧栏对齐（桌面）
    const nav = document.querySelector('.app-nav');
    if(nav){
      if(window.matchMedia('(min-width: 1300px)').matches){
        nav.style.marginLeft = px(sbw);
        nav.style.width = `calc(100% - ${px(sbw)})`;
      }else{
        nav.style.marginLeft = '0';
        nav.style.width = '100%';
      }
    }
  }

  // 监听：窗口尺寸变化 / 侧栏开关 / hash 变更（锚点跳转也会重新计算）
  window.addEventListener('resize', applyLayoutVars, {passive:true});
  window.addEventListener('orientationchange', applyLayoutVars, {passive:true});
  window.addEventListener('hashchange', applyLayoutVars, {passive:true});

  // 监听 body class 变化（Docsify 切侧栏时会加/去掉 close）
  const mo = new MutationObserver(applyLayoutVars);
  mo.observe(document.body, { attributes:true, attributeFilter:['class'] });

  // Docsify 渲染完成后再测一次，避免初始高度不准
  document.addEventListener('DOMContentLoaded', applyLayoutVars);
  // 某些主题动画会延迟布局，这里再来一枪
  setTimeout(applyLayoutVars, 250);
})();
