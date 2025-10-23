(function () {
  function buttons() {
    const bar = document.querySelector('#sidebar-tools');
    if (bar) return; // 已创建
    const sidebar = document.querySelector('#sidebar');
    if (!sidebar) return;

    const tools = document.createElement('div');
    tools.id = 'sidebar-tools';
    const btnExpand  = document.createElement('button'); btnExpand.textContent  = '全部展开';
    const btnCollapse= document.createElement('button'); btnCollapse.textContent= '全部折叠';
    tools.append(btnExpand, btnCollapse);
    sidebar.prepend(tools);

    btnExpand.onclick = () => {
      document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.add('open'));
    };
    btnCollapse.onclick = () => {
      document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('open'));
    };
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) { hook.doneEach(function () { setTimeout(buttons, 0); }); });
  window.$docsify.plugins = plugins;
})();
