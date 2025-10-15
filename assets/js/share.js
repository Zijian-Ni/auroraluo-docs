(function () {
  const { showToast } = window.AURORA_UI || {};
  function doShare() {
    const url = location.href;
    const title = document.title;
    if (navigator.share) {
      navigator.share({ title, url }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(url).then(()=> showToast('已复制链接')).catch(()=> showToast('复制失败'));
    }
  }
  document.getElementById('share-btn')?.addEventListener('click', doShare);
})();