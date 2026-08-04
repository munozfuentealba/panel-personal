/**
 * Service worker del Panel Personal.
 *
 * Estrategia network-first: si hay internet, siempre servimos lo más nuevo (así
 * las actualizaciones se ven de inmediato, sin quedar pegado en una versión
 * vieja); si no hay red, usamos lo último que quedó en caché. Esto permite que
 * la app instalada en el teléfono abra y funcione sin conexión.
 */
const CACHE = 'panel-v1';
const NUCLEO = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(NUCLEO).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        // Guardamos una copia para poder servirla sin conexión más tarde.
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))),
  );
});
