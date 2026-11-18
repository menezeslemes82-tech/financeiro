// Controle de Contas — service worker (network-first)
// Para forçar atualização nos aparelhos, mude o número da versão abaixo ao publicar mudanças no sw.js.
const CACHE = 'contas-v2';
const ARQUIVOS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const guardar = u.origin === location.origin || u.hostname === 'www.gstatic.com' || u.hostname === 'cdnjs.cloudflare.com';
  if (!guardar) return; // Firestore/Auth passam direto, sem cache

  // network-first: tenta a rede; se falhar (offline), usa o cache
  e.respondWith(
    fetch(r)
      .then(res => {
        if (res && res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(r, copia)); }
        return res;
      })
      .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('/') : undefined)))
  );
});
