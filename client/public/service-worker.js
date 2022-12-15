// This dummy service worker is to hopefully migrate all users stuck on the old service worker URL
// (`/service-worker.js`) to the new URL (`/sw.js`). The old service worker cannot detect the new service worker
// because the URL has changed, so it will stop giving updated app versions and fall behind. This dummy worker
// attempts to remedy that by sending an update to the old service worker telling it to self-destruct, which will
// hopefully cause the new worker to install itself.

// Not sure if this is needed because the old service worker logic should already call `skipWaiting()` for us, but
// we want to take over from the old service worker immediately.
self.addEventListener('install', () => self.skipWaiting());

// When we activate, blow ourselves up. Concurrently, this should trigger a page reload from the old service worker.
// After we unregister we hopefully reregister with the correct service worker URL.
self.addEventListener('activate', () => {
    self.registration.unregister();
});
