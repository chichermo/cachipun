const CACHE_NAME = "cachupin-pwa-v4";
const OFFLINE_URL = "/demo/offline.html";

const CORE_ASSETS = [
  "/demo/",
  "/demo/index.html",
  "/demo/manifest.webmanifest",
  "/demo/offline.html",
  "/demo/sw.js",
  "/demo/assets/icon-192.svg",
  "/demo/assets/icon-512.svg",
  "/demo/assets/icons/ball.svg",
  "/demo/assets/icons/cloud.svg",
  "/demo/assets/icons/chip.svg",
  "/demo/assets/icons/bolt.svg",
  "/demo/assets/icons/coin.svg",
  "/demo/assets/icons/trophy.svg",
  "/demo/assets/banners/bonus.svg",
  "/demo/assets/banners/cashout.svg",
  "/demo/assets/banners/live.svg",
  "/demo/assets/logos/liga-primera.svg",
  "/demo/assets/logos/liga-champions.svg",
  "/demo/assets/logos/liga-nba.svg",
  "/demo/assets/logos/liga-atp.svg",
  "/demo/assets/logos/team-colo-colo.svg",
  "/demo/assets/logos/team-la-u.svg",
  "/demo/assets/logos/team-psg.svg",
  "/demo/assets/logos/team-milan.svg",
  "/demo/assets/logos/team-lakers.svg",
  "/demo/assets/logos/team-heat.svg",
  "/demo/assets/logos/team-alcaraz.svg",
  "/demo/assets/logos/team-medvedev.svg",
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
