const CACHE = 'dohnmi-v1';
const ASSETS = [
  '/Card-pio-dohnmi/',
  '/Card-pio-dohnmi/index.html',
  '/Card-pio-dohnmi/manifest.json',
  '/Card-pio-dohnmi/icon-192.png',
  '/Card-pio-dohnmi/icon-512.png',
];

// Install — cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', e => {
  // Skip non-GET and Supabase requests (always need live data)
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;
  if (e.request.url.includes('api.anthropic.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Return cached, update in background
        fetch(e.request).then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE).then(c => c.put(e.request, res));
          }
        }).catch(() => {});
        return cached;
      }
      // Not in cache — fetch from network
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/Card-pio-dohnmi/'));
    })
  );
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "DOHN'MI", {
      body: data.body || 'Novidade no Império!',
      icon: '/Card-pio-dohnmi/icon-192.png',
      badge: '/Card-pio-dohnmi/icon-192.png',
      data: { url: data.url || '/Card-pio-dohnmi/' },
      vibrate: [200, 100, 200],
      tag: 'dohnmi-notif'
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});
