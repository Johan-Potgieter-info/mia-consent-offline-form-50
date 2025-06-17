
const CACHE_NAME = 'mia-consent-cache-v2';
const urlsToCache = [
  '/mia-consent-offline-form-50/',
  '/mia-consent-offline-form-50/index.html',
  '/mia-consent-offline-form-50/manifest.json',
  '/mia-consent-offline-form-50/images/icon-192.png',
  '/mia-consent-offline-form-50/images/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/mia-consent-offline-form-50/index.html');
        }
      })
  );
});

// Add Workbox compatibility line but don't use it
self.__WB_MANIFEST;
