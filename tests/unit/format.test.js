import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDate,
  formatTime,
  formatFileType,
  formatFileSize,
  formatWeekRange,
  yearForMonth,
  toParagraphs,
} from '../../src/lib/format.js';

const DIR = '/materiales/2026-2027-noviembre';

// Ejecuta fn con otra zona horaria y restaura la original al terminar.
function withTimeZone(tz, fn) {
  const original = process.env.TZ;
  process.env.TZ = tz;
  try {
    return fn();
  } finally {
    if (original === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = original;
    }
  }
}

const NBSP = String.fromCodePoint(0x00a0);
const NNBSP = String.fromCodePoint(0x202f);

function assertNoSpecialSpaces(text) {
  assert.equal(text.includes(NBSP), false, 'contiene U+00A0');
  assert.equal(text.includes(NNBSP), false, 'contiene U+202F');
}

test('formatDate: fecha larga en español', () => {
  assert.equal(formatDate('2026-10-09'), 'viernes, 9 de octubre de 2026');
});

test('formatDate: no depende de la zona horaria', () => {
  withTimeZone('America/Los_Angeles', () => {
    assert.equal(formatDate('2026-10-09'), 'viernes, 9 de octubre de 2026');
  });
});

test('formatTime: hora tal cual', () => {
  assert.equal(formatTime('11:30'), '11:30');
});

test('formatFileType: PDF', () => {
  assert.equal(formatFileType(`${DIR}/ficha-prueba.pdf`), 'PDF');
});

test('formatFileType: PNG', () => {
  assert.equal(formatFileType(`${DIR}/cartel-prueba.png`), 'Imagen PNG');
});

test('formatFileType: jpg, jpeg y JPG son Imagen JPG', () => {
  assert.equal(formatFileType(`${DIR}/infografia-prueba.jpg`), 'Imagen JPG');
  assert.equal(formatFileType(`${DIR}/infografia-prueba.jpeg`), 'Imagen JPG');
  assert.equal(formatFileType(`${DIR}/infografia-prueba.JPG`), 'Imagen JPG');
});

test('formatFileSize: KB y MB con coma decimal', () => {
  assert.equal(formatFileSize(870400), '850 KB');
  assert.equal(formatFileSize(1258291), '1,2 MB');
});

test('formatWeekRange: rango de semana', () => {
  assert.equal(
    formatWeekRange('2026-10-12', '2026-10-23'),
    'del lunes, 12 de octubre de 2026 al viernes, 23 de octubre de 2026',
  );
});

test('formatWeekRange: no depende de la zona horaria', () => {
  withTimeZone('America/Los_Angeles', () => {
    assert.equal(
      formatWeekRange('2026-10-12', '2026-10-23'),
      'del lunes, 12 de octubre de 2026 al viernes, 23 de octubre de 2026',
    );
  });
});

test('los textos no contienen U+00A0 ni U+202F', () => {
  const results = [
    formatDate('2026-10-09'),
    formatTime('11:30'),
    formatFileType(`${DIR}/ficha-prueba.pdf`),
    formatFileType(`${DIR}/cartel-prueba.png`),
    formatFileSize(870400),
    formatFileSize(1258291),
    formatWeekRange('2026-10-12', '2026-10-23'),
  ];
  for (const text of results) {
    assertNoSpecialSpaces(text);
  }
});

test('yearForMonth: octubre a diciembre son el primer año del curso', () => {
  for (const mes of ['octubre', 'noviembre', 'diciembre']) {
    assert.equal(yearForMonth('2026-2027', mes), 2026, mes);
  }
});

test('yearForMonth: enero a junio son el segundo año del curso', () => {
  for (const mes of ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio']) {
    assert.equal(yearForMonth('2026-2027', mes), 2027, mes);
  }
});

test('toParagraphs: separa por una línea en blanco', () => {
  assert.deepEqual(
    toParagraphs('Primer párrafo.\n\nSegundo párrafo.'),
    ['Primer párrafo.', 'Segundo párrafo.'],
  );
});

test('toParagraphs: varias líneas en blanco y líneas con solo espacios no dan párrafos vacíos', () => {
  const text = 'Uno.\n\n\n\nDos.\n   \nTres.\n  \n\t\n\nCuatro.\n';
  assert.deepEqual(toParagraphs(text), ['Uno.', 'Dos.', 'Tres.', 'Cuatro.']);
});
