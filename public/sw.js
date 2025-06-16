const CACHE_NAME = 'mia-consent-cache-v1';
const urlsToCache = [
  '/mia-consent-offline-form-50/',
  '/mia-consent-offline-form-50/index.html',
  '/mia-consent-offline-form-50/assets/index.css',
  '/mia-consent-offline-form-50/assets/index.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
