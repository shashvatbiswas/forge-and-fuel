const CACHE_NAME = 'forge-fuel-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/app.js',
  '/src/style.css',
  '/public/manifest.json'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  // Network first, cache fallback strategy for maximum freshness
  evt.respondWith(
    fetch(evt.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(evt.request, resClone);
          });
        }
        return networkRes;
      })
      .catch(() => {
        return caches.match(evt.request).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (evt.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
