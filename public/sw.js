
const CACHE_NAME = 'mia-consent-form-v5';
const RUNTIME_CACHE = 'mia-runtime-v5';

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

// Fetch event - improved cache strategy with better error handling
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

// Improved cache-first strategy for app resources
async function handleAppResource(request) {
  try {
    // Always try cache first for static resources
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // For HTML files, also try to update cache in background
      if (request.destination === 'document') {
        updateCacheInBackground(request);
      }
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      // Don't cache if response is too large or not cacheable
      if (networkResponse.headers.get('content-length') < 50000000) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: App resource failed, trying cache:', request.url);
    
    // Enhanced fallback logic
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to cache for app routes
    if (request.destination === 'document') {
      const indexResponse = await caches.match('/');
      if (indexResponse) {
        return indexResponse;
      }
    }
    
    return new Response('App offline - please check connection and try refreshing', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Background cache update
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('SW: Background cache update failed:', error);
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

// Enhanced message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SYNC_NOW') {
    syncPendingData();
  }
  
  // Handle cache refresh requests
  if (event.data && event.data.type === 'REFRESH_CACHE') {
    refreshCaches();
  }
});

// Cache refresh function
async function refreshCaches() {
  try {
    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    
    // Recreate main cache with static resources
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_RESOURCES);
    
    console.log('SW: Caches refreshed successfully');
    
    // Notify clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'CACHE_REFRESHED'
        });
      });
    });
  } catch (error) {
    console.error('SW: Cache refresh failed:', error);
  }
}

console.log('SW: Service Worker v5 loaded with enhanced cache management');
