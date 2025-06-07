
const CACHE_NAME = 'mia-consent-form-v4';
const RUNTIME_CACHE = 'mia-runtime-v4';

// Resources to cache immediately - updated with correct logo
const STATIC_RESOURCES = [
  '/',
  '/consent-form',
  '/manifest.json',
  '/lovable-uploads/2741077b-1d2b-4fa2-9829-1d43a1a54427.png'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('SW: Static resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('SW: Failed to cache static resources:', error);
      })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - cache first for app resources, network first for external resources
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle app resources with cache-first strategy
  if (url.origin === location.origin) {
    event.respondWith(handleAppResource(request));
    return;
  }

  // Handle external resources with network-first strategy
  event.respondWith(handleExternalResource(request));
});

// Cache-first strategy for app resources
async function handleAppResource(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: App resource failed, trying cache:', request.url);
    
    // Fallback to cache for app routes
    if (request.destination === 'document') {
      return caches.match('/') || new Response('App offline - please restart');
    }
    
    throw error;
  }
}

// Network-first strategy for external resources
async function handleExternalResource(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: External resource failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline placeholder for failed external resources
    return new Response('Resource unavailable offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-forms') {
    event.waitUntil(syncPendingData());
  }
});

// Sync pending data when online
async function syncPendingData() {
  try {
    console.log('SW: Starting background sync');
    
    // Import and execute sync from main app
    const module = await import('/src/utils/indexedDB.js');
    if (module.syncPendingForms) {
      const results = await module.syncPendingForms();
      console.log('SW: Background sync completed:', results);
      
      // Notify clients about sync completion
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            results: results
          });
        });
      });
    }
  } catch (error) {
    console.error('SW: Background sync failed:', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SYNC_NOW') {
    syncPendingData();
  }
});

console.log('SW: Service Worker loaded for offline app');
