// Comprueba los enlaces internos de _site y de cada _site-fixtures/<nombre>
// con linkinator. Los enlaces externos se omiten (linkinator.config.json).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LinkChecker } from 'linkinator';

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function listOutputs(root) {
  const outputs = [];
  if (await exists(path.join(root, '_site'))) outputs.push('_site');
  const fixturesDir = path.join(root, '_site-fixtures');
  if (await exists(fixturesDir)) {
    const entries = await fs.readdir(fixturesDir, { withFileTypes: true });
    for (const e of entries.filter((d) => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      outputs.push(path.join('_site-fixtures', e.name));
    }
  }
  return outputs;
}

if (import.meta.main) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const config = JSON.parse(await fs.readFile(path.join(root, 'linkinator.config.json'), 'utf8'));
  const outputs = await listOutputs(root);
  if (outputs.length === 0) {
    console.error('No hay carpetas generadas: ejecuta primero npm run build y npm run build:fixtures');
    process.exit(1);
  }
  let broken = 0;
  for (const dir of outputs) {
    const serverRoot = path.join(root, dir);
    const linksToSkip = [...(config.skip ?? [])];
    // Sin index.html en la raíz, el enlace «/» saldría roto.
    if (!(await exists(path.join(serverRoot, 'index.html')))) {
      linksToSkip.push('^http://127\\.0\\.0\\.1:\\d+/$');
    }
    const result = await new LinkChecker().check({
      path: '**/*.html',
      serverRoot,
      recurse: config.recurse,
      linksToSkip,
    });
    const bad = result.links.filter((l) => l.state === 'BROKEN');
    for (const link of bad) {
      console.error(`${dir}: ${link.status ?? ''} ${link.url} (desde ${link.parent ?? 'inicio'})`);
    }
    console.log(`${dir}: ${result.links.length} enlaces, ${bad.length} rotos`);
    broken += bad.length;
  }
  if (broken > 0) process.exitCode = 1;
}
