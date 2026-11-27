// Servidor estático mínimo para las pruebas en navegador y la comprobación de
// enlaces. Imita a nginx en lo necesario: index.html por carpeta, redirección
// 301 de carpetas sin barra final y 404.html para lo que no existe.
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

async function statOrNull(file) {
  try {
    return await fs.stat(file);
  } catch {
    return null;
  }
}

export function createStaticServer(root) {
  const base = path.resolve(root);

  async function respond(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : 'Método no permitido');
      return;
    }
    const send = (status, type, body, extra = {}) => {
      res.writeHead(status, { 'Content-Type': type, 'Content-Length': body.length, ...extra });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    const notFound = async () => {
      try {
        send(404, TYPES['.html'], await fs.readFile(path.join(base, '404.html')));
      } catch {
        send(404, TYPES['.txt'], Buffer.from('No encontrado'));
      }
    };

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      return notFound();
    }
    if (pathname.includes('\0')) return notFound();
    let file = path.join(base, pathname);
    if (file !== base && !file.startsWith(base + path.sep)) return notFound();

    let stat = await statOrNull(file);
    if (stat?.isDirectory()) {
      if (!pathname.endsWith('/')) {
        const location = `${pathname}/`;
        res.writeHead(301, { Location: location, 'Content-Length': 0 });
        res.end();
        return;
      }
      file = path.join(file, 'index.html');
      stat = await statOrNull(file);
    }
    if (!stat?.isFile()) return notFound();
    const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
    send(200, type, await fs.readFile(file));
  }

  return http.createServer((req, res) => {
    respond(req, res).catch(() => {
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end();
    });
  });
}

if (import.meta.main) {
  const [folder, port] = process.argv.slice(2);
  createStaticServer(path.resolve(folder)).listen(Number(port), '127.0.0.1');
}
