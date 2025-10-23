
(function(){
  function normalize(s){ return (s||'').toLowerCase(); }
  function score(q, text){
    if (!q) return 0; const t = normalize(text), qq = normalize(q);
    if (t===qq) return 100; if (t.startsWith(qq)) return 80; if (t.includes(qq)) return 60;
    let hit=0; qq.split(/[^a-z0-9_]+/).forEach(p=>{ if(p && t.includes(p)) hit+=10; }); return hit;
  }
  function render(results){
    const el = document.getElementById('api-results'); if (!el) return;
    if (!results.length){ el.innerHTML='<div class="api-hit">无结果</div>'; return; }
    el.innerHTML = results.slice(0,200).map(r => {
      const kind = r.kind==='function'?'函数':(r.kind==='class'?'类':'模块');
      const mod = r.kind==='module'? '' : `<small> · ${r.module}</small>`;
      return `<div class="api-hit"><a href="#/${r.path}"><b>${r.label}</b></a>${mod}<div>${kind}</div></div>`;
    }).join('');
  }
  async function loadIndex(){
    try{ const res = await fetch('api/index.json'); return await res.json(); }catch(e){ console.error(e); return []; }
  }
  async function init(){
    const data = await loadIndex(); const input = document.getElementById('api-q'); if(!input) return;
    function run(){
      const q = input.value.trim(); let out=[];
      data.forEach(item => {
        const sm = score(q, item.module) + score(q, item.display);
        if (sm>0) out.push({score:sm, kind:'module', label:item.display, module:item.module, path:item.path});
        (item.functions||[]).forEach(fn=>{ const s=score(q, fn)+score(q, item.module); if(s>0) out.push({score:s, kind:'function', label:fn+'()', module:item.display, path:item.path}); });
        (item.classes||[]).forEach(cls=>{ const s=score(q, cls)+score(q, item.module); if(s>0) out.push({score:s, kind:'class', label:cls, module:item.display, path:item.path}); });
      });
      out.sort((a,b)=>b.score-a.score); render(out);
    }
    input.addEventListener('input', run); run();
  }
  if (window.$docsify){
    window.$docsify.plugins = [].concat(function(hook){ hook.doneEach(function(){ if (location.hash.includes('api/Search')) setTimeout(init,80); }); }, window.$docsify.plugins || []);
  }
  document.addEventListener('DOMContentLoaded', function(){ if (location.hash.includes('api/Search')) init(); });
})();
