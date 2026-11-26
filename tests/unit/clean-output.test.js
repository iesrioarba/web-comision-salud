import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { cleanOutput } from '../../scripts/clean-output.js';

const MESSAGE_PREFIX =
  'OUTPUT_DIR debe estar dentro del repositorio y empezar por _site (_site o _site-fixtures/<nombre>): ';

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

// Crea una raiz temporal con salidas de ejemplo y una carpeta src que nunca debe borrarse.
async function makeRoot(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'clean-output-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const files = {
    site: path.join(root, '_site', 'sub', 'a.html'),
    fixtures: path.join(root, '_site-fixtures', 'completo', 'b.html'),
    fixturesOther: path.join(root, '_site-fixtures', 'otro', 'c.html'),
    sitex: path.join(root, '_sitex', 'd.html'),
    src: path.join(root, 'src', 'keep.njk'),
    xSite: path.join(root, 'x', '_site', 'e.html'),
    plainSite: path.join(root, 'site', 'f.html'),
  };
  for (const file of Object.values(files)) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, 'contenido de prueba');
  }
  return { root, files };
}

describe('cleanOutput: rutas validas', () => {
  it('_site se borra entera y devuelve la ruta absoluta', async (t) => {
    const { root, files } = await makeRoot(t);
    assert.equal(await exists(files.site), true);
    const result = await cleanOutput('_site', root);
    assert.equal(result, path.join(root, '_site'));
    assert.equal(await exists(path.join(root, '_site')), false);
    assert.equal(await exists(files.fixtures), true);
    assert.equal(await exists(files.src), true);
  });

  it('_site-fixtures se borra entera y devuelve la ruta absoluta', async (t) => {
    const { root, files } = await makeRoot(t);
    const result = await cleanOutput('_site-fixtures', root);
    assert.equal(result, path.join(root, '_site-fixtures'));
    assert.equal(await exists(path.join(root, '_site-fixtures')), false);
    assert.equal(await exists(files.site), true);
  });

  it('_site-fixtures/completo borra solo esa subcarpeta', async (t) => {
    const { root, files } = await makeRoot(t);
    const result = await cleanOutput('_site-fixtures/completo', root);
    assert.equal(result, path.join(root, '_site-fixtures', 'completo'));
    assert.equal(await exists(path.join(root, '_site-fixtures', 'completo')), false);
    assert.equal(await exists(files.fixturesOther), true);
    assert.equal(await exists(files.site), true);
  });

  it('_sitex empieza por _site y se acepta', async (t) => {
    const { root, files } = await makeRoot(t);
    assert.equal(await exists(files.sitex), true);
    const result = await cleanOutput('_sitex', root);
    assert.equal(result, path.join(root, '_sitex'));
    assert.equal(await exists(path.join(root, '_sitex')), false);
    assert.equal(await exists(files.site), true);
  });

  it('una ruta absoluta dentro de root tambien vale', async (t) => {
    const { root, files } = await makeRoot(t);
    const target = path.join(root, '_site');
    const result = await cleanOutput(target, root);
    assert.equal(result, target);
    assert.equal(await exists(files.site), false);
  });

  it('no falla si la carpeta no existe', async (t) => {
    const { root } = await makeRoot(t);
    const result = await cleanOutput('_site-fixtures/no-existe', root);
    assert.equal(result, path.join(root, '_site-fixtures', 'no-existe'));
  });

  it('no falla si root esta vacia', async (t) => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'clean-output-empty-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    const result = await cleanOutput('_site', root);
    assert.equal(result, path.join(root, '_site'));
  });
});

describe('cleanOutput: rutas rechazadas', () => {
  const invalid = ['.', '', '..', 'src', '_site/../src', 'site', 'x/_site'];

  for (const dir of invalid) {
    it(`rechaza ${JSON.stringify(dir)} con el mensaje literal y no borra nada`, async (t) => {
      const { root, files } = await makeRoot(t);
      await assert.rejects(cleanOutput(dir, root), (error) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, MESSAGE_PREFIX + dir);
        return true;
      });
      for (const file of Object.values(files)) {
        assert.equal(await exists(file), true, `${file} debe seguir existiendo`);
      }
    });
  }

  it('rechaza una ruta absoluta fuera de root, aunque se llame _site', async (t) => {
    const { root, files } = await makeRoot(t);
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'clean-output-outside-'));
    t.after(() => fs.rm(outside, { recursive: true, force: true }));
    const outsideFile = path.join(outside, '_site', 'g.html');
    await fs.mkdir(path.dirname(outsideFile), { recursive: true });
    await fs.writeFile(outsideFile, 'contenido de prueba');
    const dir = path.join(outside, '_site');
    await assert.rejects(cleanOutput(dir, root), (error) => {
      assert.equal(error.message, MESSAGE_PREFIX + dir);
      return true;
    });
    assert.equal(await exists(outsideFile), true);
    for (const file of Object.values(files)) {
      assert.equal(await exists(file), true, `${file} debe seguir existiendo`);
    }
  });
});
