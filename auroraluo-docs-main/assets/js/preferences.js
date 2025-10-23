(function () {
  const { createMask, showToast } = window.AURORA_UI || {};
  const LS_KEY = 'aurora:prefs';

  const defaults = {
    textScale: 100,
    widthMode: 'default',
    codeWrap: false,
    autoDark: false,
    highContrast: false
  };

  function load() {
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem(LS_KEY)) || {}) }; }
    catch { return { ...defaults }; }
  }
  function save(p) { localStorage.setItem(LS_KEY, JSON.stringify(p)); }

  function apply(p) {
    document.body.classList.remove('text-scale-90','text-scale-100','text-scale-110','text-scale-120',
                                   'content-narrow','content-default','content-wide','code-wrap','high-contrast');
    document.body.classList.add(`text-scale-${p.textScale}`);
    document.body.classList.add(`content-${p.widthMode}`);
    if (p.codeWrap) document.body.classList.add('code-wrap');
    if (p.highContrast) document.body.classList.add('high-contrast');

    if (p.autoDark && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const set = () => document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      set(); mq.onchange = set;
    }
  }

  const mask = createMask('prefs-mask');
  const panel = document.createElement('div'); panel.id = 'prefs-panel';
  panel.innerHTML = `
    <h4>偏好设置</h4>
    <div class="row"><span>字体大小</span>
      <div>
        <button data-scale="90">90%</button>
        <button data-scale="100">100%</button>
        <button data-scale="110">110%</button>
        <button data-scale="120">120%</button>
      </div>
    </div>
    <div class="row"><span>内容宽度</span>
      <div>
        <button data-width="narrow">窄</button>
        <button data-width="default">默认</button>
        <button data-width="wide">宽</button>
      </div>
    </div>
    <div class="row"><span>代码换行</span>
      <label><input type="checkbox" id="pref-wrap"> 开启</label>
    </div>
    <div class="row"><span>跟随系统暗色</span>
      <label><input type="checkbox" id="pref-autodark"> 开启</label>
    </div>
    <div class="row"><span>高对比度</span>
      <label><input type="checkbox" id="pref-contrast"> 开启</label>
    </div>
    <div class="small">设置会保存在本地，不影响其他访客。</div>
  `;
  document.body.appendChild(panel);

  function open() { mask.style.display='block'; panel.style.display='block'; }
  function close(){ mask.style.display='none'; panel.style.display='none'; }

  mask.addEventListener('click', close);
  document.getElementById('prefs-btn')?.addEventListener('click', open);

  const state = load(); apply(state);
  panel.querySelectorAll('button[data-scale]').forEach(btn => btn.onclick = () => {
    state.textScale = +btn.dataset.scale; save(state); apply(state);
  });
  panel.querySelectorAll('button[data-width]').forEach(btn => btn.onclick = () => {
    state.widthMode = btn.dataset.width; save(state); apply(state);
  });
  const wrap = panel.querySelector('#pref-wrap');
  const adrk = panel.querySelector('#pref-autodark');
  const cont = panel.querySelector('#pref-contrast');
  wrap.checked = !!state.codeWrap; adrk.checked = !!state.autoDark; cont.checked = !!state.highContrast;
  wrap.onchange = () => { state.codeWrap = wrap.checked; save(state); apply(state); };
  adrk.onchange = () => { state.autoDark = adrk.checked; save(state); apply(state); };
  cont.onchange = () => { state.highContrast = cont.checked; save(state); apply(state); };

  window.$docsify = window.$docsify || {};
  const plugins = window.$docsify.plugins || [];
  plugins.push(hook => hook.doneEach(() => apply(state)));
  window.$docsify.plugins = plugins;
})();