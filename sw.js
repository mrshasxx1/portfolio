/* Shaswot Gautam portfolio — service worker.
   Cache-first shell so the site works offline and loads instantly on repeat visits.
   Screenshots: cache-first (they rarely change). API/external: network only. */

const VERSION = 'v7';
const SHELL = [
  '/',
  '/index.html',
  '/case-study-clipkitchen.html',
  '/case-study-chatblinker.html',
  '/case-study-megacalc.html',
  '/case-study-lanceflow.html',
  '/uses.html',
  '/now.html',
  '/changelog.html',
  '/resume.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/resume.pdf',
  '/manifest.json',
  '/og-image.png',
  '/photo.jpg',
  '/shaswot-gautam.vcf',
  '/shots/clipkitchen.png',
  '/shots/chatblinker.png',
  '/shots/megacalc.png',
  '/shots/lanceflow.png',
  '/shots/creatoros.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // never cache FormSubmit, GitHub API, or anything cross-origin
  if (url.origin !== location.origin) return;

  // pages: network-first (fresh content), fall back to cache / offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() =>
          caches.match(event.request)
            .then((hit) => hit || caches.match('/index.html'))
            .then((hit) => hit || caches.match('/offline.html'))
        )
    );
    return;
  }

  // same-origin assets: cache-first, then network (and back-fill the cache)
  event.respondWith(
    caches.match(event.request).then((hit) => {
      if (hit) return hit;
      return fetch(event.request).then((res) => {
        if (res.ok && (url.pathname.startsWith('/shots/') || /\.(css|js|png|jpg|pdf|woff2|webp|vcf|svg)$/.test(url.pathname))) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        }
        return res;
      });
    })
  );
});
