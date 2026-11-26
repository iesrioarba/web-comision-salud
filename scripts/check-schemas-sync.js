// Comprueba que schemas/ y specs/001-reto-octubre/contracts/ tienen los mismos
// esquemas (*.schema.json), idénticos byte a byte. ADR 0008.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUFFIX = '.schema.json';

async function listSchemas(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith(SUFFIX)).map((e) => e.name);
}

async function readOrNull(file) {
  try {
    return await fs.readFile(file);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export async function checkSchemasSync(schemasDir, contractsDir) {
  const names = [...new Set([...(await listSchemas(schemasDir)), ...(await listSchemas(contractsDir))])].sort();
  const mismatches = [];
  for (const name of names) {
    const a = await readOrNull(path.join(schemasDir, name));
    const b = await readOrNull(path.join(contractsDir, name));
    if (a === null || b === null || !a.equals(b)) mismatches.push(name);
  }
  return { mismatches };
}

if (import.meta.main) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const { mismatches } = await checkSchemasSync(
    path.join(root, 'schemas'),
    path.join(root, 'specs', '001-reto-octubre', 'contracts'),
  );
  if (mismatches.length > 0) {
    for (const name of mismatches) console.error(name);
    process.exitCode = 1;
  } else {
    console.log('Esquemas sincronizados');
  }
}
