/* Motora production-safe service worker.
 * Caches: app shell, static assets, fonts, logos.
 * Never caches: auth, messages, payments, account pages, fresh listing data.
 */
const VERSION = "motora-v2";
const SHELL = ["/", "/offline.html", "/manifest.webmanifest"];
const NEVER = [/\/api\//, /\/messages/, /\/profile/, /\/admin/, /\/dealer\/dashboard/, /\/checkout/];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

function neverCache(url) {
  return NEVER.some((re) => re.test(url.pathname + url.search));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // pass through CDNs/APIs
  if (neverCache(url)) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html")),
    );
    return;
  }
  const isAsset = /\.(?:png|svg|jpg|jpeg|webp|ico|css|js|woff2?)$/.test(url.pathname);
  if (isAsset || SHELL.includes(url.pathname)) {
    // Cache-first for static assets + shell
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }
  // Network-first for catalogue/search pages with offline fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request).then((hit) => hit || caches.match("/offline.html"))),
  );
});
