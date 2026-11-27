// Busca espacios no separables (U+00A0 y U+202F) escritos como carácter literal
// o como escape. Se generan con String.fromCodePoint (AGENTS.md, «Comprobaciones»).
// Este fichero no puede contener los escapes como texto: los patrones se
// construyen por partes.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.json', '.njk', '.html', '.css', '.yml', '.yaml', '.md', '.txt']);

const NBSP = String.fromCodePoint(0x00a0);
const NNBSP = String.fromCodePoint(0x202f);
const BACKSLASH = '\\\\'; // barra invertida ya escapada para RegExp

const PATTERN = new RegExp(
  `${NBSP}|${NNBSP}|${BACKSLASH}(?:u00a0|u202f|u\\{0*(?:a0|202f)\\}|xa0)`,
  'gi',
);

function describe(match) {
  if (match === NBSP) return 'U+00A0';
  if (match === NNBSP) return 'U+202F';
  return match;
}

async function listFiles(target) {
  const stat = await fs.stat(target);
  if (stat.isFile()) return TEXT_EXTENSIONS.has(path.extname(target)) ? [target] : [];
  const files = [];
  const entries = await fs.readdir(target, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(full)));
    else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

export async function findInvisibleChars(paths) {
  const files = new Set();
  for (const target of paths) {
    for (const file of await listFiles(target)) files.add(file);
  }
  const found = [];
  for (const file of [...files].sort()) {
    const lines = (await fs.readFile(file, 'utf8')).split('\n');
    lines.forEach((text, index) => {
      for (const match of text.matchAll(PATTERN)) {
        found.push({ file, line: index + 1, column: match.index + 1, found: describe(match[0]) });
      }
    });
  }
  return found;
}

if (import.meta.main) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const targets = ['src', 'scripts', 'tests', 'eleventy.config.js'].map((p) => path.join(root, p));
  const results = await findInvisibleChars(targets);
  if (results.length > 0) {
    for (const r of results) console.error(`${path.relative(root, r.file)}:${r.line}:${r.column} ${r.found}`);
    console.error('Usa String.fromCodePoint(0x00a0) o String.fromCodePoint(0x202f)');
    process.exitCode = 1;
  } else {
    console.log('Sin caracteres invisibles');
  }
}
