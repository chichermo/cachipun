const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const apiData = {
  leagues: [
    { id: "liga-1", name: "Primera División", count: 18, logo: "/demo/assets/logos/liga-primera.svg" },
    { id: "liga-2", name: "Champions League", count: 12, logo: "/demo/assets/logos/liga-champions.svg" },
    { id: "liga-3", name: "NBA", count: 9, logo: "/demo/assets/logos/liga-nba.svg" },
    { id: "liga-4", name: "ATP Tour", count: 7, logo: "/demo/assets/logos/liga-atp.svg" },
  ],
  banners: [
    {
      id: "bn-1",
      title: "Bono de bienvenida",
      subtitle: "+20% en apuestas demo",
      cta: "Activar bono",
      icon: "/demo/assets/icons/bolt.svg",
      image: "/demo/assets/banners/bonus.svg",
    },
    {
      id: "bn-2",
      title: "Cashout rápido",
      subtitle: "Retira ganancias antes del cierre",
      cta: "Ver opciones",
      icon: "/demo/assets/icons/coin.svg",
      image: "/demo/assets/banners/cashout.svg",
    },
    {
      id: "bn-3",
      title: "Ligas en vivo",
      subtitle: "Seguimiento en tiempo real",
      cta: "Explorar",
      icon: "/demo/assets/icons/trophy.svg",
      image: "/demo/assets/banners/live.svg",
    },
  ],
  markets: [
    {
      id: "mkt-1",
      category: "Deportes",
      league: "Primera División",
      title: "Colo-Colo vs La U",
      description: "Resultado final del clásico.",
      source: "ANFP / marcador oficial",
      close_at: "2026-03-20T18:00",
      status: "abierto",
      liquidity: 340000,
      participants: 42,
      confidence: 61,
      icon: "/demo/assets/icons/ball.svg",
      homeLogo: "/demo/assets/logos/team-colo-colo.svg",
      awayLogo: "/demo/assets/logos/team-la-u.svg",
    },
    {
      id: "mkt-2",
      category: "Deportes",
      league: "Champions League",
      title: "PSG vs Milan",
      description: "Resultado final del partido.",
      source: "UEFA / marcador oficial",
      close_at: "2026-03-22T20:00",
      status: "abierto",
      liquidity: 180000,
      participants: 28,
      confidence: 55,
      icon: "/demo/assets/icons/ball.svg",
      homeLogo: "/demo/assets/logos/team-psg.svg",
      awayLogo: "/demo/assets/logos/team-milan.svg",
    },
    {
      id: "mkt-3",
      category: "Clima",
      league: "Chile",
      title: "Lluvia en Santiago el viernes",
      description: "Reporte meteorológico oficial.",
      source: "Dirección Meteorológica de Chile",
      close_at: "2026-03-21T12:00",
      status: "abierto",
      liquidity: 120000,
      participants: 19,
      confidence: 48,
      icon: "/demo/assets/icons/cloud.svg",
    },
    {
      id: "mkt-4",
      category: "Tecnologia",
      league: "Innovación",
      title: "Nueva IA generativa anunciada",
      description: "Comunicado oficial de la marca.",
      source: "Sala de prensa oficial",
      close_at: "2026-03-30T23:00",
      status: "abierto",
      liquidity: 410000,
      participants: 66,
      confidence: 72,
      icon: "/demo/assets/icons/chip.svg",
    },
  ],
  live: [
    {
      id: "live-1",
      matchId: "fx-1",
      title: "Colo-Colo vs La U",
      category: "Deportes",
      minute: 67,
      score: "1-0",
      yesOdd: 1.72,
      noOdd: 2.25,
      homeLogo: "/demo/assets/logos/team-colo-colo.svg",
      awayLogo: "/demo/assets/logos/team-la-u.svg",
    },
    {
      id: "live-2",
      matchId: "fx-3",
      title: "Lakers vs Heat",
      category: "NBA",
      minute: 33,
      score: "54-48",
      yesOdd: 1.58,
      noOdd: 2.45,
      homeLogo: "/demo/assets/logos/team-lakers.svg",
      awayLogo: "/demo/assets/logos/team-heat.svg",
    },
  ],
  fixtures: [
    {
      id: "fx-1",
      league: "Primera División",
      home: "Colo-Colo",
      away: "La U",
      time: "18:30",
      odds: "1.85",
      day: "Hoy",
      homeLogo: "/demo/assets/logos/team-colo-colo.svg",
      awayLogo: "/demo/assets/logos/team-la-u.svg",
    },
    {
      id: "fx-2",
      league: "Champions League",
      home: "PSG",
      away: "Milan",
      time: "20:00",
      odds: "2.05",
      day: "Hoy",
      homeLogo: "/demo/assets/logos/team-psg.svg",
      awayLogo: "/demo/assets/logos/team-milan.svg",
    },
    {
      id: "fx-3",
      league: "NBA",
      home: "Lakers",
      away: "Heat",
      time: "22:15",
      odds: "1.72",
      day: "Mañana",
      homeLogo: "/demo/assets/logos/team-lakers.svg",
      awayLogo: "/demo/assets/logos/team-heat.svg",
    },
    {
      id: "fx-4",
      league: "ATP Tour",
      home: "Alcaraz",
      away: "Medvedev",
      time: "15:40",
      odds: "1.64",
      day: "Fin de semana",
      homeLogo: "/demo/assets/logos/team-alcaraz.svg",
      awayLogo: "/demo/assets/logos/team-medvedev.svg",
    },
  ],
  matches: [
    {
      id: "fx-1",
      possession: [52, 48],
      shots: [11, 7],
      corners: [6, 4],
      fouls: [13, 10],
      odds: { home: 1.85, draw: 3.1, away: 2.2 },
    },
    {
      id: "fx-2",
      possession: [49, 51],
      shots: [9, 8],
      corners: [5, 6],
      fouls: [12, 9],
      odds: { home: 2.05, draw: 3.3, away: 2.0 },
    },
    {
      id: "fx-3",
      possession: [55, 45],
      shots: [18, 14],
      corners: [7, 5],
      fouls: [15, 12],
      odds: { home: 1.72, draw: 3.4, away: 2.4 },
    },
    {
      id: "fx-4",
      possession: [50, 50],
      shots: [12, 11],
      corners: [4, 4],
      fouls: [9, 8],
      odds: { home: 1.64, draw: 2.9, away: 2.5 },
    },
  ],
  news: [
    {
      id: "nw-1",
      title: "Se actualizan cuotas para el clásico",
      time: "Hace 5 min",
    },
    {
      id: "nw-2",
      title: "Mercados de clima con alta participación",
      time: "Hace 22 min",
    },
    {
      id: "nw-3",
      title: "Nuevos eventos de tecnología disponibles",
      time: "Hace 1 h",
    },
  ],
};

const sendJson = (res, payload) => {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
};

const safePath = (urlPath) => {
  const cleaned = decodeURIComponent(urlPath.split("?")[0]);
  if (cleaned === "/favicon.ico") {
    return path.join(rootDir, "demo", "assets", "icon-192.svg");
  }
  if (cleaned === "/") return path.join(rootDir, "index.html");
  if (cleaned === "/demo") return path.join(rootDir, "demo", "index.html");
  if (cleaned === "/demo/") return path.join(rootDir, "demo", "index.html");
  const resolved = path.normalize(path.join(rootDir, cleaned));
  if (!resolved.startsWith(rootDir)) {
    return path.join(rootDir, "index.html");
  }
  return resolved;
};

const serveFile = (filePath, res) => {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 - Archivo no encontrado");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
};

const server = http.createServer((req, res) => {
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Metodo no permitido");
    return;
  }
  if ((req.url || "").startsWith("/api/")) {
    const endpoint = (req.url || "").split("?")[0];
    if (endpoint === "/api/markets") return sendJson(res, apiData.markets);
    if (endpoint === "/api/live") return sendJson(res, apiData.live);
    if (endpoint === "/api/fixtures") return sendJson(res, apiData.fixtures);
    if (endpoint === "/api/banners") return sendJson(res, apiData.banners);
    if (endpoint === "/api/leagues") return sendJson(res, apiData.leagues);
    if (endpoint === "/api/news") return sendJson(res, apiData.news);
    if (endpoint === "/api/matches") return sendJson(res, apiData.matches);
    return sendJson(res, { error: "Not found" });
  }
  const filePath = safePath(req.url || "/");
  serveFile(filePath, res);
});

server.listen(port, () => {
  console.log(`Servidor local activo en http://localhost:${port}`);
});
