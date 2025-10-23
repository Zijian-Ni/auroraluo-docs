(function(){
  var key='aurora_theme';
  function apply(t){ document.documentElement.setAttribute('data-theme', t||'light'); }
  function init(){
    var t=localStorage.getItem(key)||'light'; apply(t);
    if(!document.getElementById('theme-switch-btn')){
      var btn=document.createElement('button'); btn.id='theme-switch-btn'; btn.textContent='🌓'; btn.title='切换主题';
      btn.style.cssText='position:fixed;right:14px;top:14px;padding:6px 10px;border:1px solid rgba(0,0,0,.1);border-radius:8px;background:#fff;z-index:9999';
      document.body.appendChild(btn);
      btn.onclick=function(){ var cur=document.documentElement.getAttribute('data-theme')||'light'; var next=cur==='light'?'dark':'light'; localStorage.setItem(key,next); apply(next); };
    }
  }
  if (document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();