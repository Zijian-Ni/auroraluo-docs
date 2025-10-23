(function () {
  function ensureToast() {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    return el;
  }
  function showToast(msg, ms = 1800) {
    const el = ensureToast();
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  function snackbar(msg, actionText, onAction) {
    let bar = document.querySelector('.snackbar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'snackbar';
      document.body.appendChild(bar);
    }
    bar.innerHTML = '';
    const span = document.createElement('span'); span.textContent = msg;
    bar.appendChild(span);
    if (actionText) {
      const btn = document.createElement('button'); btn.textContent = actionText;
      btn.onclick = () => { onAction && onAction(); bar.classList.remove('show'); };
      bar.appendChild(btn);
    }
    bar.classList.add('show');
    return bar;
  }

  function createMask(id) {
    let m = document.getElementById(id);
    if (!m) { m = document.createElement('div'); m.id = id; document.body.appendChild(m); }
    return m;
  }

  window.AURORA_UI = { showToast, snackbar, createMask };
})();