// Service worker of the Scorsaire Lecteur: the application keeps working without a network (a stage, a rehearsal room). Network first so that a new version arrives as soon
// as there is a connection, the cache otherwise. INCREMENT CACHE_VERSION with every new publication, or an installed copy keeps showing the old one.
const CACHE_VERSION = 'scorsaire-lecteur-20261029-1305';
const PRECACHE_URLS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('scorsaire-lecteur-') && k !== CACHE_VERSION).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => { const copy = response.clone(); caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy)); return response; })
      .catch(() => caches.match(event.request)),
  );
});
