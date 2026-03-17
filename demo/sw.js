const CACHE_NAME = "cachupin-pwa-v2";
const OFFLINE_URL = "/demo/offline.html";

const CORE_ASSETS = [
  "/demo/",
  "/demo/index.html",
  "/demo/manifest.webmanifest",
  "/demo/offline.html",
  "/demo/sw.js",
  "/demo/assets/icon-192.svg",
  "/demo/assets/icon-512.svg",
  "/demo/legal/terminos.html",
  "/demo/legal/privacidad.html",
  "/demo/legal/reglamento-apuestas.html",
  "/demo/legal/kyc-aml.html",
  "/demo/legal/juego-responsable.html",
  "/demo/legal/uso-prohibido.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }
  const url = new URL(event.request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});
