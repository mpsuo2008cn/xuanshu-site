const CACHE_NAME = 'wanlianli-v141';

const CORE_ASSETS = [
  'index.html',
  'manifest.json',
  'v2-preview/dreamData.js',
  'assets/lunar.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'articles/index.html',
  'articles/style.css',
  'articles/wannianli-yiji.html',
  'articles/jiehun-zeri.html',
  'articles/liuyao-qigua.html',
  'articles/bazi-sizhu.html',
  'articles/huangli-shierjianchu.html',
  'liuyao/index.html',
  'liuyao/style.css',
  'liuyao/app.js',
  'liuyao/lunar.js',
  'bazi/index.html',
  'bazi/style.css',
  'bazi/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});
