const CACHE_NAME = 'uv-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle /service/* requests
  if (url.pathname.startsWith('/service/')) {
    event.respondWith(
      (async () => {
        try {
          const targetUrl = decodeURIComponent(url.pathname.replace('/service/', ''));
          const response = await fetch(targetUrl, { mode: 'cors' });
          const contentType = response.headers.get('content-type') || '';

          // Clone and return the response
          const cloned = response.clone();
          return cloned;
        } catch (err) {
          return new Response('⚠️ Failed to load content: ' + err, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      })()
    );
  }
});
