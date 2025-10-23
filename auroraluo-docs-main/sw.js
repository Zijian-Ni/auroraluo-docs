const CACHE_NAME = 'aurora-wiki-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './_sidebar.md',
  './_navbar.md',
  './assets/css/custom.css',
  './assets/css/addons.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // 只缓存 GET
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(res => {
      const fetchPromise = fetch(req).then(networkRes => {
        // 动态缓存
        const copy = networkRes.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return networkRes;
      }).catch(() => res || Promise.reject('offline'));
      return res || fetchPromise;
    })
  );
});
