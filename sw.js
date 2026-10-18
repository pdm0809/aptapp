const CACHE = 'aptapp-v36';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const SHELL_URLS = SHELL.map((p) => new URL(p, self.registration.scope).href);

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  url.search = ''; url.hash = '';
  // 앱 셸만 cache-first, 나머지(Supabase API 등)는 SW가 관여하지 않고 네트워크로 직행
  if (!SHELL_URLS.includes(url.href)) return;
  e.respondWith(caches.match(url.href).then((hit) => hit || fetch(req)));
});
