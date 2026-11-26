import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { checkSchemasSync } from '../../scripts/check-schemas-sync.js';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SCHEMAS_DIR = path.join(ROOT, 'schemas');
const CONTRACTS_DIR = path.join(ROOT, 'specs', '001-reto-octubre', 'contracts');
const SCRIPT = path.join(ROOT, 'scripts', 'check-schemas-sync.js');
const NAMES = ['curso.schema.json', 'reto.schema.json', 'sitio.schema.json'];

// Copia las carpetas reales de esquemas a una carpeta temporal que se borra al terminar.
async function copyDirs(t) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'schemas-sync-'));
  t.after(() => fs.rm(base, { recursive: true, force: true }));
  const schemas = path.join(base, 'schemas');
  const contracts = path.join(base, 'contracts');
  await fs.mkdir(schemas);
  await fs.mkdir(contracts);
  for (const name of NAMES) {
    await fs.copyFile(path.join(SCHEMAS_DIR, name), path.join(schemas, name));
    await fs.copyFile(path.join(CONTRACTS_DIR, name), path.join(contracts, name));
  }
  return { schemas, contracts };
}

describe('checkSchemasSync: carpetas reales', () => {
  it('las carpetas reales de esquemas y contratos no tienen diferencias', async () => {
    const { mismatches } = await checkSchemasSync(SCHEMAS_DIR, CONTRACTS_DIR);
    assert.deepEqual(mismatches, []);
  });

  it('una copia temporal sin tocar tampoco tiene diferencias', async (t) => {
    const { schemas, contracts } = await copyDirs(t);
    const { mismatches } = await checkSchemasSync(schemas, contracts);
    assert.deepEqual(mismatches, []);
  });
});

describe('checkSchemasSync: diferencias', () => {
  it('un byte cambiado en un esquema da el nombre de ese fichero', async (t) => {
    const { schemas, contracts } = await copyDirs(t);
    const file = path.join(schemas, 'reto.schema.json');
    const bytes = await fs.readFile(file);
    bytes[bytes.length - 1] = bytes[bytes.length - 1] === 0x20 ? 0x0a : 0x20;
    await fs.writeFile(file, bytes);
    const { mismatches } = await checkSchemasSync(schemas, contracts);
    assert.deepEqual(mismatches, ['reto.schema.json']);
  });

  it('un notas.md y una carpeta ejemplos/ con un .yml no cambian el resultado', async (t) => {
    const { schemas, contracts } = await copyDirs(t);
    await fs.writeFile(path.join(contracts, 'notas.md'), 'Notas de prueba.');
    await fs.mkdir(path.join(contracts, 'ejemplos'));
    await fs.writeFile(path.join(contracts, 'ejemplos', 'ejemplo.yml'), 'campo: valor\n');
    const { mismatches } = await checkSchemasSync(schemas, contracts);
    assert.deepEqual(mismatches, []);
  });

  it('un esquema borrado de schemas da el nombre de ese fichero', async (t) => {
    const { schemas, contracts } = await copyDirs(t);
    await fs.rm(path.join(schemas, 'sitio.schema.json'));
    const { mismatches } = await checkSchemasSync(schemas, contracts);
    assert.deepEqual(mismatches, ['sitio.schema.json']);
  });

  it('un esquema borrado de contratos da el nombre de ese fichero', async (t) => {
    const { schemas, contracts } = await copyDirs(t);
    await fs.rm(path.join(contracts, 'curso.schema.json'));
    const { mismatches } = await checkSchemasSync(schemas, contracts);
    assert.deepEqual(mismatches, ['curso.schema.json']);
  });
});

describe('check-schemas-sync como orden', () => {
  it('con las carpetas reales sale con 0 e imprime «Esquemas sincronizados»', async () => {
    const { stdout } = await run(process.execPath, [SCRIPT], { cwd: ROOT });
    assert.equal(stdout.trim(), 'Esquemas sincronizados');
  });

  // El caso de salida 1 no se prueba como orden: la orden usa siempre las carpetas
  // reales y provocarlo exigiría tocarlas. Se prueba solo mediante la función.
});
