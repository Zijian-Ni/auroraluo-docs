(function () {
  let pop;
  function ensure() {
    if (!pop) { pop = document.createElement('div'); pop.className = 'footnote-pop'; document.body.appendChild(pop); }
    return pop;
  }
  function position(el) {
    const r = el.getBoundingClientRect();
    pop.style.left = (r.left + window.scrollX) + 'px';
    pop.style.top  = (r.bottom + window.scrollY + 6) + 'px';
  }
  function bind() {
    const sect = document.querySelector('.markdown-section'); if (!sect) return;
    const refs = sect.querySelectorAll('a[href^="#fn"]'); if (!refs.length) return;
    const notes = {};
    sect.querySelectorAll('li[id^="fn"]').forEach(li => notes['#'+li.id] = li.innerHTML);

    refs.forEach(a => {
      a.addEventListener('mouseenter', () => {
        const html = notes[a.getAttribute('href')]; if (!html) return;
        ensure(); pop.innerHTML = html; position(a); pop.style.display='block';
      });
      a.addEventListener('mouseleave', () => { if (pop) pop.style.display='none'; });
      a.addEventListener('focus', () => { const html = notes[a.getAttribute('href')]; if (html) { ensure(); pop.innerHTML=html; position(a); pop.style.display='block'; }});
      a.addEventListener('blur',  () => { if (pop) pop.style.display='none'; });
    });
  }

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => setTimeout(bind, 0)));
  window.$docsify.plugins = plugins;
})();