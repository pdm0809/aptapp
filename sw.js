// 서비스 종료용 킬스위치 서비스워커.
// 설치 즉시 활성화되어 모든 캐시를 지우고 자기 자신을 해제한 뒤 열려 있는 창을 새로고침한다.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.clients.claim();
      const clients = await self.clients.matchAll({ type: 'window' });
      await self.registration.unregister();
      clients.forEach((c) => {
        try { c.navigate(c.url); } catch (err) {}
      });
    })()
  );
});

// fetch는 가로채지 않는다 (네트워크 기본 동작).
