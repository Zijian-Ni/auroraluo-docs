
(function(){
  function slugify(s){
    if (window.Docsify && window.Docsify.slugify) return window.Docsify.slugify(s);
    return (s||'').trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5\- ]+/g,'').replace(/\s+/g,'-');
  }
  function fixAnchorHref(a, currentPath){
    var href=a.getAttribute('href')||'';
    if(/^#\/.+#.+/.test(href)){
      var parts=href.split('#');
      return parts[0]+'?id='+slugify(parts.slice(1).join('#'));
    }
    if(/^#\w|^#[\u4e00-\u9fa5]/.test(href)){
      return '#'+currentPath+'?id='+slugify(href.slice(1));
    }
    return href;
  }
  function run(){
    var currentPath=(window.$docsify&&$docsify.router&&$docsify.router.getFile()) || (location.hash.replace(/^#\//,'').split('?')[0]||'/');
    document.querySelectorAll('.sidebar-nav a').forEach(function(a){
      var fixed=fixAnchorHref(a, currentPath);
      if(fixed!==a.getAttribute('href')) a.setAttribute('href',fixed);
    });
    document.querySelectorAll('.markdown-section a[href^="#"]').forEach(function(a){
      var fixed=fixAnchorHref(a, currentPath);
      if(fixed!==a.getAttribute('href')) a.setAttribute('href',fixed);
    });
  }
  if (window.$docsify){
    window.$docsify.plugins=[].concat(function(hook){ hook.doneEach(function(){ setTimeout(run,80); }); }, window.$docsify.plugins||[]);
  }
  window.addEventListener('hashchange', function(){ setTimeout(run,60); });
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(run,120); });
})();
