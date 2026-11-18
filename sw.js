// Service worker simples: rede primeiro, cache como reserva (app abre mesmo sem internet)
const CACHE = 'contas-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const ok = u.origin === location.origin || u.hostname === 'www.gstatic.com' || u.hostname === 'cdnjs.cloudflare.com';
  if (!ok) return; // Firestore/Auth passam direto
  e.respondWith(
    fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(r, c)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('/')))
  );
});
