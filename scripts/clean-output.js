// Borra la carpeta de salida de Eleventy antes de compilar, porque Eleventy
// no la vacía. Solo admite rutas dentro del repositorio que empiecen por _site.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function cleanOutput(dir, root) {
  const target = path.resolve(root, dir);
  const relative = path.relative(root, target);
  const firstSegment = relative.split(path.sep)[0];
  const inside =
    relative !== '' &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative) &&
    firstSegment.startsWith('_site');
  if (!inside) {
    throw new Error(
      `OUTPUT_DIR debe estar dentro del repositorio y empezar por _site (_site o _site-fixtures/<nombre>): ${dir}`,
    );
  }
  await fs.rm(target, { recursive: true, force: true });
  return target;
}

if (import.meta.main) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  try {
    await cleanOutput(process.env.OUTPUT_DIR || '_site', root);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
