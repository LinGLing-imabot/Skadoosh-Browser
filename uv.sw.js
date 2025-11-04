// uv.sw.js
const CACHE_NAME = 'uv-cache-v1';
const ORIGIN = self.location.origin;

// Helper: encode URL for UV proxy
function encodeUrl(url) {
  try {
    // Use the same encoding as Ultraviolet
    return '/service/' + btoa(url);
  } catch(e) {
    return url;
  }
}

self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Only intercept GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ignore requests from same origin that are not UV proxied
  if (url.origin === ORIGIN && !url.pathname.startsWith('/service/')) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        // Clone response for caching
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
        return res;
      })
      .catch(() => {
        // Return cached version if available
        return caches.match(req).then(cached => {
          if (cached) return cached;
          // Optional: fallback to blank page
          return new Response('<h1>Offline / Resource unavailable</h1>', {
            headers: { 'Content-Type': 'text/html' }
          });
        });
      })
  );
});
