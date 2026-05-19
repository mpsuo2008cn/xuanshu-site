const CACHE_NAME = 'wanlianli-v66';
const ASSETS = [
  'index.html',
  'bg-main.png',
  'bg-detail.png',
  'bg-splash.png',
  'logo.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'assets/lunar.js',
  'liuyao/index.html',
  'liuyao/style.css',
  'liuyao/app.js',
  'liuyao/lunar.js',
  'bazi/index.html',
  'bazi/style.css',
  'bazi/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      // 优先返回缓存，同时后台更新
      const fetchPromise = fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});
