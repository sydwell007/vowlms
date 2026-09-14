const CACHE_NAME = "vowlms-shell-v3";
const OFFLINE_URL = "/offline";
const CORE_ASSETS = ["/", "/offline", "/academies", "/courses", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/dashboard/") ||
    url.pathname.startsWith("/lesson/") ||
    url.pathname.startsWith("/assessment/") ||
    url.pathname.startsWith("/profile") ||
    url.pathname.startsWith("/certificates") ||
    url.pathname.startsWith("/results/") ||
    // Individual course detail pages carry live pricing, unlock/enrollment
    // state, and the payment forms themselves (CSP form-action included) —
    // never safe to serve a stale cached copy of. The bare /courses
    // catalogue listing (no trailing slug) is unaffected and stays
    // cacheable as part of the offline app shell.
    url.pathname.startsWith("/courses/")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match(OFFLINE_URL);
        return Response.error();
      }),
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "vowlms-progress-sync") {
    // Future: replay saved lesson progress, assessment attempts, and VR scores.
  }
});
