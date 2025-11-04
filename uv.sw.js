// uv.sw.js — Universal service worker for Skadoosh Browser

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Only intercept /service/... requests
  if (url.pathname.startsWith('/service/')) {
    const targetUrl = decodeURIComponent(url.pathname.replace('/service/', ''));

    e.respondWith(
      fetch(targetUrl, {
        mode: 'cors',
        credentials: 'omit',
        headers: e.request.headers
      }).catch(err => new Response('❌ Failed to fetch URL: ' + targetUrl, { status: 500 }))
    );
    return;
  }

  // Otherwise, default fetch
  e.respondWith(fetch(e.request));
});
