
(function(){
  function buildTOC() {
    var container = document.querySelector('.markdown-section');
    if(!container) return;
    if(document.querySelector('#inline-toc')) return;
    var hs = container.querySelectorAll('h2, h3');
    if(hs.length < 3) return;
    var toc = document.createElement('div');
    toc.id = 'inline-toc';
    toc.className = 'doc-card';
    var html = '<strong>本页导航</strong><ul style="margin:6px 0 0 18px">';
    hs.forEach(function(h){
      if(!h.id){ h.id = h.textContent.trim().toLowerCase().replace(/\s+/g,'-'); }
      var level = h.tagName === 'H2' ? 0 : 1;
      html += '<li style="margin-left:'+ (level*10) +'px"><a href="#'+h.id+'">'+h.textContent+'</a></li>';
    });
    html += '</ul>';
    toc.innerHTML = html;
    var first = container.querySelector('h1');
    (first && first.nextSibling) ? first.parentNode.insertBefore(toc, first.nextSibling) : container.prepend(toc);
  }
  window.addEventListener('hashchange', function(){ setTimeout(buildTOC, 50); });
  if (document.readyState !== 'loading') setTimeout(buildTOC, 150);
  else document.addEventListener('DOMContentLoaded', function(){ setTimeout(buildTOC, 150); });
  if (window.$docsify) window.$docsify.plugins = [].concat(function(hook){
    hook.doneEach(function(){ setTimeout(buildTOC, 120); });
  }, window.$docsify.plugins || []);
})();
