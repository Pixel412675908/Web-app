const CACHE_NAME = 'portal46-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://i.postimg.cc/gJzFByk5/file-0000000098b8720e9deb64f615033168.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna o cache se existir, caso contrário busca na rede
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        // Opcional: Adicionar novos recursos ao cache dinamicamente se necessário
        return networkResponse;
      });
    }).catch(() => {
      // Fallback para offline se falhar rede e não estiver no cache
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});