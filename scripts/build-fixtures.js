// Compila cada carpeta de tests/fixtures/ a _site-fixtures/<nombre>/ para que
// las comprobaciones (validar, enlaces, navegador) también cubran sus páginas.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanOutput } from './clean-output.js';

export async function listFixtures(root) {
  const entries = await fs.readdir(path.join(root, 'tests', 'fixtures'), { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
}

if (import.meta.main) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  await cleanOutput('_site-fixtures', root);
  for (const name of await listFixtures(root)) {
    console.log(`Compilando la fixture ${name}`);
    const result = spawnSync('npm', ['run', 'build'], {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        CONTENT_DIR: `tests/fixtures/${name}`,
        OUTPUT_DIR: `_site-fixtures/${name}`,
      },
    });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}
