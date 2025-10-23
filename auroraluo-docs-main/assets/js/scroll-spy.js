(function () {
  const HEADER_OFFSET = 90;

  function run() {
    const sect = document.querySelector('.markdown-section');
    if (!sect) return;

    const heads = Array.from(sect.querySelectorAll('h2, h3, h4'));
    if (!heads.length) return;

    const links = Array.from(document.querySelectorAll('.sidebar-nav a'));
    function hrefForId(id) {
      const path = (vm && vm.route && vm.route.path) ? vm.route.path : '';
      return `#/${path}?id=${id}`;
    }
    const map = new Map();
    heads.forEach(h => {
      const href = hrefForId(h.id);
      const link = links.find(a => a.getAttribute('href') === href);
      if (link) map.set(h, link);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        const link = map.get(ent.target);
        if (!link) return;
        if (ent.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: `-${HEADER_OFFSET + 10}px 0px -70% 0px`, threshold: 0.01 });

    heads.forEach(h => io.observe(h));
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(function (hook) { hook.doneEach(function () { setTimeout(run, 0); }); });
  window.$docsify.plugins = plugins;
})();
