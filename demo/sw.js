const CACHE_NAME = "cachupin-pwa-v7";
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
  "/demo/assets/logos/liga-premier.svg",
  "/demo/assets/logos/liga-laliga.svg",
  "/demo/assets/logos/liga-seriea.svg",
  "/demo/assets/logos/liga-bundes.svg",
  "/demo/assets/logos/liga-ligue1.svg",
  "/demo/assets/logos/liga-mls.svg",
  "/demo/assets/logos/liga-nfl.svg",
  "/demo/assets/logos/liga-mlb.svg",
  "/demo/assets/logos/liga-wta.svg",
  "/demo/assets/logos/liga-ufc.svg",
  "/demo/assets/logos/liga-libertadores.svg",
  "/demo/assets/logos/liga-sudamericana.svg",
  "/demo/assets/logos/liga-ligamx.svg",
  "/demo/assets/logos/liga-euroleague.svg",
  "/demo/assets/logos/liga-f1.svg",
  "/demo/assets/logos/liga-lol.svg",
  "/demo/assets/logos/liga-cs2.svg",
  "/demo/assets/logos/liga-sixnations.svg",
  "/demo/assets/logos/liga-nhl.svg",
  "/demo/assets/logos/liga-vnl.svg",
  "/demo/assets/logos/liga-ehf.svg",
  "/demo/assets/logos/liga-boxing.svg",
  "/demo/assets/logos/liga-darts.svg",
  "/demo/assets/logos/liga-motogp.svg",
  "/demo/assets/logos/liga-pga.svg",
  "/demo/assets/logos/liga-ipl.svg",
  "/demo/assets/logos/liga-uci.svg",
  "/demo/assets/logos/liga-champions.svg",
  "/demo/assets/logos/liga-nba.svg",
  "/demo/assets/logos/liga-atp.svg",
  "/demo/assets/logos/team-colo-colo.svg",
  "/demo/assets/logos/team-la-u.svg",
  "/demo/assets/logos/team-uc.svg",
  "/demo/assets/logos/team-palestino.svg",
  "/demo/assets/logos/team-ars.svg",
  "/demo/assets/logos/team-che.svg",
  "/demo/assets/logos/team-rma.svg",
  "/demo/assets/logos/team-bar.svg",
  "/demo/assets/logos/team-juv.svg",
  "/demo/assets/logos/team-int.svg",
  "/demo/assets/logos/team-bay.svg",
  "/demo/assets/logos/team-bvb.svg",
  "/demo/assets/logos/team-lyo.svg",
  "/demo/assets/logos/team-kc.svg",
  "/demo/assets/logos/team-sf.svg",
  "/demo/assets/logos/team-nyy.svg",
  "/demo/assets/logos/team-lad.svg",
  "/demo/assets/logos/team-psg.svg",
  "/demo/assets/logos/team-milan.svg",
  "/demo/assets/logos/team-lakers.svg",
  "/demo/assets/logos/team-heat.svg",
  "/demo/assets/logos/team-alcaraz.svg",
  "/demo/assets/logos/team-medvedev.svg",
  "/demo/assets/logos/team-huachipato.svg",
  "/demo/assets/logos/team-cobresal.svg",
  "/demo/assets/logos/team-everton.svg",
  "/demo/assets/logos/team-union.svg",
  "/demo/assets/logos/team-audax.svg",
  "/demo/assets/logos/team-ohiggins.svg",
  "/demo/assets/logos/team-wanderers.svg",
  "/demo/assets/logos/team-temuco.svg",
  "/demo/assets/logos/team-cobreloa.svg",
  "/demo/assets/logos/team-rangers.svg",
  "/demo/assets/logos/team-mia.svg",
  "/demo/assets/logos/team-lafc.svg",
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
