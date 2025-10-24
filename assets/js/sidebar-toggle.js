// assets/js/sidebar-toggle.js
(function () {
  function ensureToggleBtn() {
    if (document.getElementById('menu-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'menu-toggle';
    btn.textContent = '☰';
    btn.title = '展开/收起菜单';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      document.body.classList.toggle('close');
    });

    // 小屏默认折叠
    if (window.innerWidth < 992) document.body.classList.add('close');
  }

  document.addEventListener('DOMContentLoaded', ensureToggleBtn);
  window.addEventListener('resize', () => {
    if (window.innerWidth < 992) document.body.classList.add('close');
    else document.body.classList.remove('close');
  }, { passive: true });
})();
