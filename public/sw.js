
const CACHE_NAME = 'mia-consent-form-v2';
const RUNTIME_CACHE = 'mia-runtime-v2';

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/consent-form',
  '/src/main.tsx',
  '/src/index.css',
  'https://emiyxuareujqneuyewzq.supabase.co/storage/v1/object/public/email-assets//logoWeb-ezgif.com-optiwebp.webp'
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

// Fetch event - network first, then cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static resources with cache-first strategy
  if (STATIC_RESOURCES.some(resource => request.url.includes(resource))) {
    event.respondWith(handleStaticResource(request));
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(handleNetworkFirst(request));
});

// Network-first strategy for dynamic content
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache available, return offline page or error
    if (request.destination === 'document') {
      return caches.match('/') || new Response('Offline - Please check your connection');
    }
    
    throw error;
  }
}

// Cache-first strategy for static resources
async function handleStaticResource(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('SW: Failed to fetch static resource:', request.url);
    throw error;
  }
}

// Handle API requests with offline queueing
async function handleApiRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('SW: API request failed, queueing for later sync');
    
    // Queue the request for background sync
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.method !== 'GET' ? await request.text() : null,
      timestamp: Date.now()
    };
    
    // Store in IndexedDB for later sync
    await storeFailedRequest(requestData);
    
    // Return a response indicating the request was queued
    return new Response(JSON.stringify({
      error: 'Offline - Request queued for sync',
      queued: true,
      timestamp: requestData.timestamp
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Store failed requests for background sync
async function storeFailedRequest(requestData) {
  try {
    const db = await openSyncDB();
    const transaction = db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    await store.add(requestData);
  } catch (error) {
    console.error('SW: Failed to store sync request:', error);
  }
}

// Open sync database
function openSyncDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MiaSyncDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sync_queue')) {
        const store = db.createObjectStore('sync_queue', { 
          keyPath: 'timestamp',
          autoIncrement: true 
        });
        store.createIndex('url', 'url', { unique: false });
      }
    };
  });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-forms') {
    event.waitUntil(syncPendingData());
  }
});

// Sync pending data
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

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncPendingData());
  }
});

console.log('SW: Service Worker loaded successfully');
