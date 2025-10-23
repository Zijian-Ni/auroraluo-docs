(function () {
  let dot = document.getElementById('net-indicator');
  if (!dot) { dot = document.createElement('div'); dot.id = 'net-indicator'; document.body.appendChild(dot); }

  const set = () => dot.classList.toggle('offline', !navigator.onLine);
  window.addEventListener('online', set); window.addEventListener('offline', set); set();
})();