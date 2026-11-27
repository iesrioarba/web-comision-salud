import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { createStaticServer } from '../../scripts/serve-static.js';

const INDEX = '<!doctype html><title>Inicio de prueba</title>';
const SUB_INDEX = '<!doctype html><title>Carpeta de prueba</title>';
const NOT_FOUND = '<!doctype html><title>No encontrada de prueba</title>';
const SECRET = 'texto secreto de prueba';

// Monta la carpeta servida (dentro de base/site) y un fichero fuera de ella (base/secret.txt).
async function setup(t, { with404 = true } = {}) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'serve-static-'));
  t.after(() => fs.rm(base, { recursive: true, force: true }));
  const root = path.join(base, 'site');
  await fs.mkdir(path.join(root, 'carpeta'), { recursive: true });
  await fs.writeFile(path.join(root, 'index.html'), INDEX);
  await fs.writeFile(path.join(root, 'carpeta', 'index.html'), SUB_INDEX);
  if (with404) await fs.writeFile(path.join(root, '404.html'), NOT_FOUND);
  for (const ext of ['css', 'js', 'json', 'svg', 'png', 'jpg', 'jpeg', 'pdf', 'txt', 'xyz']) {
    await fs.writeFile(path.join(root, `f.${ext}`), 'contenido de prueba');
  }
  await fs.writeFile(path.join(base, 'secret.txt'), SECRET);
  // Comprobaciones previas de la fixture.
  await fs.access(path.join(base, 'secret.txt'));
  assert.equal(await fs.readFile(path.join(root, 'index.html'), 'utf8'), INDEX);

  const server = createStaticServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => {
    server.closeAllConnections();
    server.close(resolve);
  }));
  return { port: server.address().port, root };
}

// Peticion con la ruta en crudo, sin que fetch la normalice.
function raw(port, rawPath, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: rawPath, method, agent: false }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () =>
        resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }),
      );
    });
    req.on('error', reject);
    req.end();
  });
}

describe('createStaticServer: rutas', () => {
  it('devuelve un servidor que todavia no escucha', async (t) => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), 'serve-static-'));
    t.after(() => fs.rm(base, { recursive: true, force: true }));
    const server = createStaticServer(base);
    assert.ok(server instanceof http.Server);
    assert.equal(server.listening, false);
  });

  it('/ sirve el index.html de la raiz', async (t) => {
    const { port } = await setup(t);
    const res = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'text/html; charset=utf-8');
    assert.equal(await res.text(), INDEX);
  });

  it('/carpeta/ sirve el index.html de esa carpeta', async (t) => {
    const { port } = await setup(t);
    const res = await fetch(`http://127.0.0.1:${port}/carpeta/`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), SUB_INDEX);
  });

  it('un fichero se sirve con su cuerpo', async (t) => {
    const { port } = await setup(t);
    const res = await fetch(`http://127.0.0.1:${port}/404.html`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), NOT_FOUND);
  });

  it('ignora la cadena de consulta', async (t) => {
    const { port } = await setup(t);
    const res = await fetch(`http://127.0.0.1:${port}/404.html?x=1`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), NOT_FOUND);
  });

  it('/carpeta sin barra final da 301 a /carpeta/', async (t) => {
    const { port } = await setup(t);
    const res = await fetch(`http://127.0.0.1:${port}/carpeta`, { redirect: 'manual' });
    assert.equal(res.status, 301);
    assert.equal(res.headers.get('location'), '/carpeta/');
  });
});

describe('createStaticServer: tipos de contenido', () => {
  const cases = [
    ['f.css', /^text\/css; charset=utf-8$/],
    ['f.js', /^(text|application)\/javascript/],
    ['f.json', /^application\/json/],
    ['f.svg', /^image\/svg\+xml/],
    ['f.png', /^image\/png$/],
    ['f.jpg', /^image\/jpeg$/],
    ['f.jpeg', /^image\/jpeg$/],
    ['f.pdf', /^application\/pdf$/],
    ['f.txt', /^text\/plain/],
    ['f.xyz', /^application\/octet-stream$/],
  ];
  for (const [name, expected] of cases) {
    it(`${name} tiene el tipo esperado`, async (t) => {
      const { port } = await setup(t);
      const res = await fetch(`http://127.0.0.1:${port}/${name}`);
      assert.equal(res.status, 200);
      assert.match(res.headers.get('content-type') ?? '', expected);
      await res.arrayBuffer();
    });
  }
});

describe('createStaticServer: metodos', () => {
  it('HEAD da las mismas cabeceras y no tiene cuerpo', async (t) => {
    const { port } = await setup(t);
    const get = await fetch(`http://127.0.0.1:${port}/`);
    await get.text();
    const res = await fetch(`http://127.0.0.1:${port}/`, { method: 'HEAD' });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), get.headers.get('content-type'));
    assert.equal(await res.text(), '');
  });

  it('POST da 405', async (t) => {
    const { port } = await setup(t);
    const res = await fetch(`http://127.0.0.1:${port}/`, { method: 'POST', body: 'x' });
    assert.equal(res.status, 405);
    await res.text();
  });
});

describe('createStaticServer: seguridad y errores', () => {
  it('/../secret.txt da 404 y no revela el fichero de fuera', async (t) => {
    const { port } = await setup(t);
    const res = await raw(port, '/../secret.txt');
    assert.equal(res.status, 404);
    assert.ok(!res.body.includes(SECRET));
  });

  it('/%2e%2e/secret.txt da 404 y no revela el fichero de fuera', async (t) => {
    const { port } = await setup(t);
    const res = await raw(port, '/%2e%2e/secret.txt');
    assert.equal(res.status, 404);
    assert.ok(!res.body.includes(SECRET));
  });

  it('/carpeta/../../secret.txt da 404', async (t) => {
    const { port } = await setup(t);
    const res = await raw(port, '/carpeta/../../secret.txt');
    assert.equal(res.status, 404);
    assert.ok(!res.body.includes(SECRET));
  });

  it('una ruta mal codificada da 404 y el servidor sigue respondiendo', async (t) => {
    const { port } = await setup(t);
    const bad = await raw(port, '/%E0%A4%A');
    assert.equal(bad.status, 404);
    const next = await raw(port, '/');
    assert.equal(next.status, 200);
    assert.equal(next.body, INDEX);
  });

  it('un fichero inexistente da 404 con el cuerpo de 404.html', async (t) => {
    const { port } = await setup(t);
    const res = await fetch(`http://127.0.0.1:${port}/no-existe.html`);
    assert.equal(res.status, 404);
    assert.equal(res.headers.get('content-type'), 'text/html; charset=utf-8');
    assert.equal(await res.text(), NOT_FOUND);
  });

  it('sin 404.html, un fichero inexistente da 404 en texto plano', async (t) => {
    const { port, root } = await setup(t, { with404: false });
    await assert.rejects(fs.access(path.join(root, '404.html')));
    const res = await fetch(`http://127.0.0.1:${port}/no-existe.html`);
    assert.equal(res.status, 404);
    assert.match(res.headers.get('content-type') ?? '', /^text\/plain/);
    await res.text();
  });
});
