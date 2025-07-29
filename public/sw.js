// Service Worker for Afrimeet PWA with Background Call Support
const CACHE_NAME = 'afrimeet-v1';
const CALL_CACHE_NAME = 'afrimeet-call-cache';

// Background sync tags
const BACKGROUND_SYNC_TAG = 'background-call-sync';
const CALL_HEARTBEAT_TAG = 'call-heartbeat-sync';

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icon-192x192.png',
        '/icon-512x512.png',
        '/notification.mp3'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== CALL_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync for call maintenance
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === BACKGROUND_SYNC_TAG) {
    event.waitUntil(handleCallBackgroundSync());
  }
  
  if (event.tag === CALL_HEARTBEAT_TAG) {
    event.waitUntil(handleCallHeartbeat());
  }
});

// Handle background call sync
async function handleCallBackgroundSync() {
  try {
    const clients = await self.clients.matchAll();
    const callClient = clients.find(client => 
      client.url.includes('/meeting/') || client.url.includes('call')
    );
    
    if (callClient) {
      // Send message to client to maintain call connection
      callClient.postMessage({
        type: 'MAINTAIN_CALL_CONNECTION',
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

// Handle call heartbeat to keep connection alive
async function handleCallHeartbeat() {
  try {
    const clients = await self.clients.matchAll();
    const callClient = clients.find(client => 
      client.url.includes('/meeting/') || client.url.includes('call')
    );
    
    if (callClient) {
      callClient.postMessage({
        type: 'CALL_HEARTBEAT',
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.error('Call heartbeat error:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification('Afrimeet', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        // Check if app is already open
        const client = clients.find(c => c.url.includes(self.location.origin));
        
        if (client) {
          // Focus existing client
          return client.focus();
        } else {
          // Open new client
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

// Message handling from main app
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'REGISTER_BACKGROUND_SYNC':
        registerBackgroundSync();
        break;
      case 'START_CALL_HEARTBEAT':
        startCallHeartbeat();
        break;
      case 'STOP_CALL_HEARTBEAT':
        stopCallHeartbeat();
        break;
      case 'SHOW_CALL_NOTIFICATION':
        showCallNotification(event.data.payload);
        break;
      case 'HIDE_CALL_NOTIFICATION':
        hideCallNotification();
        break;
    }
  }
});

// Register background sync
async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await self.registration;
      await registration.sync.register(BACKGROUND_SYNC_TAG);
      console.log('Background sync registered');
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  }
}

// Start call heartbeat
let heartbeatInterval;
function startCallHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  
  heartbeatInterval = setInterval(async () => {
    try {
      const registration = await self.registration;
      await registration.sync.register(CALL_HEARTBEAT_TAG);
    } catch (error) {
      console.error('Heartbeat sync error:', error);
    }
  }, 30000); // Every 30 seconds
}

// Stop call heartbeat
function stopCallHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

// Show call notification
async function showCallNotification(callData) {
  const options = {
    body: `Call in progress - ${callData.participants || 0} participants`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      callId: callData.callId,
      type: 'active_call'
    },
    actions: [
      {
        action: 'return_to_call',
        title: 'Return to Call',
        icon: '/icon-192x192.png'
      },
      {
        action: 'end_call',
        title: 'End Call',
        icon: '/icon-192x192.png'
      }
    ],
    requireInteraction: true,
    silent: false,
    tag: 'active_call'
  };

  await self.registration.showNotification('Afrimeet Call Active', options);
}

// Hide call notification
async function hideCallNotification() {
  const notifications = await self.registration.getNotifications();
  notifications.forEach(notification => {
    if (notification.data && notification.data.type === 'active_call') {
      notification.close();
    }
  });
}

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  // Handle API calls for call maintenance
  if (event.request.url.includes('/api/') && event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CALL_CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'call-maintenance') {
      event.waitUntil(handleCallBackgroundSync());
    }
  });
}
