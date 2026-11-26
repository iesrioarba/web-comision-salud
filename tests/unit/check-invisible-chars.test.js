import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { findInvisibleChars } from '../../scripts/check-invisible-chars.js';

// Los caracteres y los escapes se construyen sin escribirlos: este fichero
// tambien lo revisa el propio script.
const NBSP = String.fromCodePoint(0x00a0);
const NNBSP = String.fromCodePoint(0x202f);
const BS = String.fromCodePoint(0x5c);

const ESCAPES = [
  BS + 'u00a0',
  BS + 'u00A0',
  BS + 'u{a0}',
  BS + 'u{00a0}',
  BS + 'u202f',
  BS + 'u202F',
  BS + 'u{202f}',
  BS + 'xa0',
  BS + 'xA0',
];

async function makeDir(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'invisible-chars-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  return dir;
}

async function write(dir, name, text) {
  const file = path.join(dir, name);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, text);
  return file;
}

describe('findInvisibleChars: caracteres literales', () => {
  it('U+00A0 se detecta con linea, columna y found', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, 'a.txt', 'ab' + NBSP + 'cd');
    assert.deepEqual(await findInvisibleChars([file]), [
      { file, line: 1, column: 3, found: 'U+00A0' },
    ]);
  });

  it('U+202F se detecta con linea, columna y found', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, 'a.txt', 'abc' + NNBSP + 'd');
    assert.deepEqual(await findInvisibleChars([file]), [
      { file, line: 1, column: 4, found: 'U+202F' },
    ]);
  });

  it('el primer caracter de la linea tiene columna 1', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, 'a.txt', NBSP + 'x');
    const result = await findInvisibleChars([file]);
    assert.equal(result.length, 1);
    assert.equal(result[0].column, 1);
  });

  it('varias lineas: da la linea correcta y cuenta la columna en cada una', async (t) => {
    const dir = await makeDir(t);
    const text = ['limpia', 'abc' + NBSP, 'tambien limpia', '', 'x' + NNBSP + 'y'].join('\n');
    const file = await write(dir, 'a.txt', text);
    assert.deepEqual(await findInvisibleChars([file]), [
      { file, line: 2, column: 4, found: 'U+00A0' },
      { file, line: 5, column: 2, found: 'U+202F' },
    ]);
  });

  it('varios hallazgos en la misma linea salen ordenados por columna', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, 'a.txt', 'a' + NBSP + 'b' + NNBSP + 'c' + NBSP);
    assert.deepEqual(await findInvisibleChars([file]), [
      { file, line: 1, column: 2, found: 'U+00A0' },
      { file, line: 1, column: 4, found: 'U+202F' },
      { file, line: 1, column: 6, found: 'U+00A0' },
    ]);
  });
});

describe('findInvisibleChars: escapes', () => {
  for (const escape of ESCAPES) {
    it(`detecta el escape ${escape.length} caracteres de largo que acaba en ${escape.slice(1)}`, async (t) => {
      const dir = await makeDir(t);
      const file = await write(dir, 'a.js', "const s = 'x" + escape + "y';");
      assert.deepEqual(await findInvisibleChars([file]), [
        { file, line: 1, column: 12, found: escape },
      ]);
    });
  }

  it('un escape y un literal en la misma linea salen por columna', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, 'a.js', 'a' + BS + 'u00a0' + 'b' + NNBSP);
    assert.deepEqual(await findInvisibleChars([file]), [
      { file, line: 1, column: 2, found: BS + 'u00a0' },
      { file, line: 1, column: 8, found: 'U+202F' },
    ]);
  });

  it('la barra invertida sola o con otros caracteres no es hallazgo', async (t) => {
    const dir = await makeDir(t);
    const text = [BS + 'n', BS + 'u0041', BS + 'x41', 'u00a0', 'xa0'].join('\n');
    const file = await write(dir, 'a.js', text);
    assert.deepEqual(await findInvisibleChars([file]), []);
  });
});

describe('findInvisibleChars: recorrido', () => {
  it('un fichero suelto se puede pasar directamente', async (t) => {
    const dir = await makeDir(t);
    await write(dir, 'otro.txt', 'x' + NBSP);
    const file = await write(dir, 'solo.txt', 'x' + NBSP);
    assert.deepEqual(await findInvisibleChars([file]), [
      { file, line: 1, column: 2, found: 'U+00A0' },
    ]);
  });

  it('una carpeta se recorre de forma recursiva', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, path.join('uno', 'dos', 'a.md'), 'x' + NBSP);
    assert.deepEqual(await findInvisibleChars([dir]), [
      { file, line: 1, column: 2, found: 'U+00A0' },
    ]);
  });

  it('lee todas las extensiones de la lista', async (t) => {
    const dir = await makeDir(t);
    const extensions = ['js', 'mjs', 'cjs', 'json', 'njk', 'html', 'css', 'yml', 'yaml', 'md', 'txt'];
    for (const ext of extensions) {
      await write(dir, `f.${ext}`, 'x' + NBSP);
    }
    const result = await findInvisibleChars([dir]);
    assert.deepEqual(
      result.map((r) => path.basename(r.file)).sort(),
      extensions.map((ext) => `f.${ext}`).sort(),
    );
  });

  it('ordena por fichero aunque se pasen en otro orden', async (t) => {
    const dir = await makeDir(t);
    const b = await write(dir, 'b.txt', 'x' + NBSP);
    const a = await write(dir, 'a.txt', 'x' + NNBSP);
    const expected = [
      { file: a, line: 1, column: 2, found: 'U+202F' },
      { file: b, line: 1, column: 2, found: 'U+00A0' },
    ];
    assert.deepEqual(await findInvisibleChars([b, a]), expected);
    assert.deepEqual(await findInvisibleChars([dir]), expected);
  });

  it('dentro de un fichero ordena por linea y columna', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, 'a.txt', ['x' + NNBSP, 'ab' + NBSP + NBSP].join('\n'));
    const result = await findInvisibleChars([file]);
    assert.deepEqual(
      result.map((r) => [r.line, r.column]),
      [
        [1, 2],
        [2, 3],
        [2, 4],
      ],
    );
  });

  it('ignora extensiones fuera de la lista', async (t) => {
    const dir = await makeDir(t);
    const pdf = await write(dir, 'a.pdf', 'x' + NBSP);
    await write(dir, 'b.png', 'x' + NBSP);
    assert.deepEqual(await findInvisibleChars([dir]), []);
    assert.deepEqual(await findInvisibleChars([pdf]), []);
  });

  it('ignora node_modules, tambien anidada', async (t) => {
    const dir = await makeDir(t);
    await write(dir, path.join('node_modules', 'pkg', 'a.js'), 'x' + NBSP);
    await write(dir, path.join('sub', 'node_modules', 'b.js'), 'x' + NBSP);
    const kept = await write(dir, path.join('sub', 'c.js'), 'x' + NBSP);
    assert.deepEqual(await findInvisibleChars([dir]), [
      { file: kept, line: 1, column: 2, found: 'U+00A0' },
    ]);
  });

  it('un fichero limpio devuelve []', async (t) => {
    const dir = await makeDir(t);
    const file = await write(dir, 'a.txt', 'texto normal\ncon dos lineas\n');
    assert.deepEqual(await findInvisibleChars([file]), []);
    assert.deepEqual(await findInvisibleChars([dir]), []);
  });

  it('una carpeta vacia devuelve []', async (t) => {
    const dir = await makeDir(t);
    assert.deepEqual(await findInvisibleChars([dir]), []);
  });
});
