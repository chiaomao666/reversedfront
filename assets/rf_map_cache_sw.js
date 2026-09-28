'use strict';

const DEFAULT_CACHE_NAME = 'rf-map-tiles-v1';
let cacheName = DEFAULT_CACHE_NAME;

// Only cache same-origin raster map tiles whose path contains:
//   /tiles/{z}/{x}/{y}.png
function isMapTileRequest(request) {
  if (request.method !== 'GET') return false;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;

  return /(?:^|\/)tiles\/\d+\/\d+\/\d+\.png$/i.test(url.pathname);
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};

  if (data.type === 'RF_MAP_CACHE_CONFIG' && typeof data.cacheName === 'string' && data.cacheName) {
    cacheName = data.cacheName;
    return;
  }

  if (data.type === 'RF_MAP_CACHE_CLEAR') {
    event.waitUntil(caches.delete(cacheName));
  }
});

self.addEventListener('fetch', (event) => {
  if (!isMapTileRequest(event.request)) return;
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response && response.ok) {
    await cache.put(request, response.clone());
  }

  return response;
}
