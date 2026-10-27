// Only the static build shell is cached. User records stay in localStorage.
// Asset URLs resolve from the worker scope so the same build works at the
// production root and inside a GitHub Pages pull-request preview directory.
export function createWorker({ version, assets }) {
  return `
const SCOPE = new URL(self.registration.scope);
const PREFIX = 'careconnect-shell:' + SCOPE.pathname + ':';
const CACHE = PREFIX + ${JSON.stringify(version)};
const ASSETS = ${JSON.stringify(assets)}.map((path) => new URL(path, SCOPE).href);
const SHELL = new URL('index.html', SCOPE).href;
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try { await cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))); }
    catch (error) { await caches.delete(CACHE); throw error; }
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'APPLY_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Never store API responses, external resources, or user records.
  if (event.request.mode === 'navigate' && url.pathname.startsWith(SCOPE.pathname)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(SHELL)) || fetch(event.request))());
  } else if (!url.search && ASSETS.includes(url.href)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(url.href)) || fetch(event.request))());
  }
});
`;
}
