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

const safePath = (urlPath) => {
  const cleaned = decodeURIComponent(urlPath.split("?")[0]);
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
  const filePath = safePath(req.url || "/");
  serveFile(filePath, res);
});

server.listen(port, () => {
  console.log(`Servidor local activo en http://localhost:${port}`);
});
