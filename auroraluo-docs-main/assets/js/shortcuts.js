(function () {
  // 弹窗
  const mask = document.createElement('div'); mask.className = 'kbd-help-mask';
  const box  = document.createElement('div'); box.className  = 'kbd-help';
  box.innerHTML = `
    <h3>键盘快捷键</h3>
    <table>
      <tr><td><kbd>?</kbd></td><td>打开/关闭本帮助</td></tr>
      <tr><td><kbd>/</kbd></td><td>聚焦搜索</td></tr>
      <tr><td><kbd>T</kbd></td><td>切换深浅色</td></tr>
      <tr><td><kbd>N</kbd></td><td>下一页</td></tr>
      <tr><td><kbd>P</kbd></td><td>上一页</td></tr>
      <tr><td><kbd>G</kbd> <kbd>H</kbd></td><td>返回首页</td></tr>
      <tr><td><kbd>G</kbd> <kbd>T</kbd></td><td>滚动到顶部</td></tr>
    </table>
    <button class="close">关闭</button>
  `;
  document.body.append(mask, box);
  function show(b) { mask.style.display = b ? 'block' : 'none'; box.style.display = b ? 'block' : 'none'; }
  box.querySelector('.close').onclick = () => show(false);
  mask.onclick = () => show(false);

  let gPressed = false;

  function focusSearch() {
    const inp = document.querySelector('.search input') || document.querySelector('input[type="search"]');
    if (inp) { inp.focus(); inp.select(); }
  }
  function nextPrev(isNext) {
    const sel = isNext ? '.pagination-item-next a' : '.pagination-item-prev a';
    const a = document.querySelector(sel);
    if (a) a.click();
  }

  document.addEventListener('keydown', (e) => {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;

    if (e.key === '?') { show(box.style.display !== 'block'); e.preventDefault(); return; }
    if (e.key === '/') { focusSearch(); e.preventDefault(); return; }
    if (e.key.toLowerCase() === 't') { document.getElementById('theme-switch-btn')?.click(); return; }
    if (e.key.toLowerCase() === 'n') { nextPrev(true); return; }
    if (e.key.toLowerCase() === 'p') { nextPrev(false); return; }
    if (e.key.toLowerCase() === 'g') { gPressed = true; return; }
    if (gPressed && e.key.toLowerCase() === 'h') { location.hash = '#/README'; gPressed = false; return; }
    if (gPressed && e.key.toLowerCase() === 't') { window.scrollTo({ top: 0, behavior: 'smooth' }); gPressed = false; return; }
  });
  document.addEventListener('keyup', (e) => { if (e.key.toLowerCase() === 'g') gPressed = false; });
})();
