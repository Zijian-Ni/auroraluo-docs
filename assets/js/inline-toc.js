(function(){
  function slugify(s){ if (window.Docsify && window.Docsify.slugify) return window.Docsify.slugify(s);
    return (s||'').trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5\- ]+/g,'').replace(/\s+/g,'-'); }
  function buildTOC(){
    var container=document.querySelector('.markdown-section'); if(!container) return;
    var old=document.getElementById('inline-toc'); if(old) old.remove();
    var hs=container.querySelectorAll('h2, h3'); if(hs.length<3) return;
    var path=(window.$docsify && $docsify.route && $docsify.route.path) || location.hash.replace(/^#\//,'').split('?')[0];
    var toc=document.createElement('div'); toc.id='inline-toc'; toc.className='doc-card';
    var html='<strong>本页导航</strong><ul style="margin:6px 0 0 18px">';
    hs.forEach(function(h){ var id=h.id||(h.id=slugify(h.textContent||'')); var level=h.tagName==='H2'?0:1;
      html+='<li style="margin-left:'+10*level+'px"><a href=\"#/'+path+'?id='+id+'\">'+h.textContent+'</a></li>'; });
    html+='</ul>'; toc.innerHTML=html;
    var h1=container.querySelector('h1'); if(h1&&h1.nextSibling) h1.parentNode.insertBefore(toc,h1.nextSibling); else container.prepend(toc);
  }
  if (window.$docsify){ window.$docsify.plugins=[].concat(function(hook){ hook.doneEach(function(){ setTimeout(buildTOC,100); }); }, window.$docsify.plugins||[]); }
  window.addEventListener('hashchange', function(){ setTimeout(buildTOC,60); });
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(buildTOC,120); });
})();