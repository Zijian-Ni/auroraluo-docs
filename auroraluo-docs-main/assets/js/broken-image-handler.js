(function () {
  function svgPlaceholder(text) {
    const t = encodeURIComponent(text || 'image');
    return `data:image/svg+xml;charset=UTF-8,` +
      `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>`+
      `<rect width='100%' height='100%' fill='#f3f3f3'/>`+
      `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='20'>${t}</text>`+
      `</svg>`;
  }
  document.addEventListener('error', (e) => {
    const el = e.target;
    if (el && el.tagName === 'IMG') {
      el.onerror = null;
      el.src = svgPlaceholder(el.alt || '图片不可用');
    }
  }, true);
})();