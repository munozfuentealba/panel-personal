/**
 * Service worker del Panel Personal.
 *
 * Estrategia: red primero, SIN usar la caché del navegador (`cache: 'no-store'`),
 * así con internet SIEMPRE se ve la última versión (nada de quedar pegado en una
 * vieja). Sin conexión, se sirve lo último que quedó guardado. Solo intercepta
 * archivos del propio sitio; las APIs externas (sincronización, traductor, chat)
 * pasan directo sin cachearse.
 *
 * Al subir la versión de CACHE, `activate` borra las viejas y toma el control de
 * inmediato (skipWaiting + clients.claim).
 */
const CACHE = 'panel-v2';
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
  // Solo archivos del propio sitio; deja pasar las APIs externas sin tocar.
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    try {
      const fresco = await fetch(req, { cache: 'no-store' }); // siempre lo más nuevo
      caches.open(CACHE).then((c) => c.put(req, fresco.clone())).catch(() => {});
      return fresco;
    } catch {
      const guardado = await caches.match(req);
      return guardado || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
    }
  })());
});
