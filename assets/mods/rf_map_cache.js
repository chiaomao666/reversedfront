(() => {
  'use strict';

  const SW_URL = './rf_map_cache_sw.js';
  const CACHE_VERSION = 'rf-map-tiles-v1';

  if (!('serviceWorker' in navigator)) {
    console.warn('[RF Map Cache] Service Worker is not supported in this browser.');
    return;
  }

  // Only register from a real HTTP(S) page. Service Workers do not work from file://.
  if (location.protocol !== 'http:' && location.protocol !== 'https:') {
    console.warn('[RF Map Cache] Disabled because the page is not served over HTTP(S).');
    return;
  }

  navigator.serviceWorker.register(SW_URL, { scope: './' })
    .then((registration) => {
      console.log('[RF Map Cache] Service Worker registered:', registration.scope);

      // Ask the worker to use the same cache version as this loader.
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'RF_MAP_CACHE_CONFIG',
          cacheName: CACHE_VERSION
        });
      }

      return navigator.serviceWorker.ready;
    })
    .then(() => {
      console.log('[RF Map Cache] Ready. Previously downloaded map tiles can be reused.');
    })
    .catch((error) => {
      console.error('[RF Map Cache] Registration failed:', error);
    });
})();
