(function () {
  const HEADER_OFFSET = 90;

  function buildTOC() {
    // 清理旧的
    document.getElementById('toc-float')?.remove();

    // 收集 h2/h3
    const heads = Array.from(document.querySelectorAll('.markdown-section h2, .markdown-section h3'));
    if (!heads.length) return;

    const wrap = document.createElement('div');
    wrap.id = 'toc-float';
    const title = document.createElement('h4');
    title.textContent = '本页目录';
    wrap.appendChild(title);

    const ul = document.createElement('ul');
    heads.forEach(h => {
      if (!h.id) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = h.textContent.replace(/#$/, '').trim();
      a.href = `#${h.id}`;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ block: 'start' });
        window.scrollBy(0, -HEADER_OFFSET);
        history.replaceState(null, '', location.pathname + location.search + `#/${(vm && vm.route && vm.route.path) ? vm.route.path : ''}?id=${encodeURIComponent(h.id)}`);
      });
      if (h.tagName === 'H3') a.style.paddingLeft = '18px';
      li.appendChild(a);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    document.body.appendChild(wrap);

    // Scroll-Spy：高亮当前
    const links = ul.querySelectorAll('a');
    const map = new Map();
    heads.forEach((h, i) => map.set(h, links[i]));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        const link = map.get(ent.target);
        if (!link) return;
        if (ent.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: `-${HEADER_OFFSET + 10}px 0px -65% 0px`, threshold: 0.01 });

    heads.forEach(h => io.observe(h));
  }

  // docsify hook
  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) {
    hook.doneEach(function () {
      setTimeout(buildTOC, 0);
    });
  });
  window.$docsify.plugins = plugins;
})();
