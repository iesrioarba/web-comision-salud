import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { parse, stringify } from 'yaml';
import { validateContent } from '../../scripts/validate-content.js';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const FIXTURES = path.join(ROOT, 'tests', 'fixtures');
const SCRIPT = path.join(ROOT, 'scripts', 'validate-content.js');

const NOV = 'retos/2026-2027-noviembre.yml';
const DIC = 'retos/2026-2027-diciembre.yml';
const MAT = '/materiales/2026-2027-noviembre';
const TEN_MB = 10_485_760;

// ---------------------------------------------------------------------------
// Ayudas
// ---------------------------------------------------------------------------

// Copia una fixture a una carpeta temporal que se borra al terminar la prueba.
async function copyFixture(t, name) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'validate-content-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  await fs.cp(path.join(FIXTURES, name), dir, { recursive: true });
  return dir;
}

// Lee un YAML de la copia, lo modifica con fn (que cambia el objeto) y lo vuelve a escribir.
async function edit(dir, rel, fn) {
  const file = path.join(dir, rel);
  const data = parse(await fs.readFile(file, 'utf8'));
  await fn(data);
  await fs.writeFile(file, stringify(data, { lineWidth: 0 }));
}

// Crea un fichero pequeño (contenido inventado) dentro de la copia.
async function touch(dir, rel, text = 'contenido de prueba') {
  const file = path.join(dir, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, text);
}

function show(errors) {
  return JSON.stringify(errors, null, 2);
}

function checkGeneral(errors) {
  const seen = new Set();
  for (const e of errors) {
    assert.ok(!e.message.includes('`'), `El mensaje lleva comillas invertidas: ${show(errors)}`);
    const key = `${e.file}|${e.field}`;
    assert.ok(!seen.has(key), `Par file + field repetido: ${show(errors)}`);
    seen.add(key);
  }
}

// Prepara la copia, valida y comprueba que hay exactamente un error y que es el esperado.
async function expectOneError(t, { fixture, mutate, file, field, message }) {
  const dir = await copyFixture(t, fixture);
  await mutate(dir);
  const { errors } = await validateContent(dir);
  assert.equal(errors.length, 1, `Se esperaba un solo error y hay: ${show(errors)}`);
  const [error] = errors;
  assert.equal(error.file, file, show(errors));
  assert.equal(error.field, field, show(errors));
  assert.equal(typeof error.message, 'string', show(errors));
  assert.notEqual(error.message.trim(), '', show(errors));
  if (message !== undefined) {
    assert.equal(error.message, message, show(errors));
  }
  checkGeneral(errors);
  return error;
}

// Genera una prueba por cada caso que debe fallar.
function failCases(cases) {
  for (const c of cases) {
    it(c.name, async (t) => {
      const error = await expectOneError(t, { fixture: 'completo', ...c });
      if (c.messageIncludes) {
        assert.ok(error.message.includes(c.messageIncludes), show([error]));
      }
    });
  }
}

// Prepara la copia, valida y comprueba que no hay errores.
async function expectValid(t, { fixture = 'completo', mutate = async () => {} }) {
  const dir = await copyFixture(t, fixture);
  await mutate(dir);
  const { errors } = await validateContent(dir);
  assert.deepEqual(errors, [], show(errors));
}

const long = (n, ch = 'a') => ch.repeat(n);

// Ejecuta scripts/validate-content.js como orden, con CONTENT_DIR dado.
async function runCommand(contentDir) {
  try {
    const { stdout, stderr } = await run(process.execPath, [SCRIPT], {
      cwd: ROOT,
      env: { ...process.env, CONTENT_DIR: contentDir },
    });
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout, stderr: err.stderr };
  }
}

// ---------------------------------------------------------------------------
// Casos válidos
// ---------------------------------------------------------------------------

describe('casos válidos', () => {
  for (const name of ['completo', 'sin-reto-en-curso', 'sin-reto-ni-anuncio', 'pendientes']) {
    it(`la fixture «${name}» no da errores`, async () => {
      const { errors } = await validateContent(path.join(FIXTURES, name));
      assert.deepEqual(errors, [], show(errors));
    });
  }

  it('los tres esquemas compilan con Ajv2020 en modo estricto y ajv-formats', async () => {
    for (const name of ['curso', 'reto', 'sitio']) {
      const schema = JSON.parse(await fs.readFile(path.join(ROOT, 'schemas', `${name}.schema.json`), 'utf8'));
      const ajv = new Ajv2020({ strict: true, allErrors: true });
      addFormats(ajv);
      assert.doesNotThrow(() => ajv.compile(schema), `No compila ${name}.schema.json`);
    }
  });

  for (const [nombre, aplicar] of [
    ['vacío con ""', (m) => { m.lugar = ''; }],
    ['vacío con null', (m) => { m.lugar = null; }],
    ['vacío por ausencia', (m) => { delete m.lugar; }],
  ]) {
    it(`un campo opcional ${nombre} no da errores`, async (t) => {
      await expectValid(t, {
        mutate: (dir) => edit(dir, NOV, (r) => aplicar(r.motriz)),
      });
    });
  }

  it('el campo opcional pasos vacío con "", null o ausente no da errores', async (t) => {
    for (const aplicar of [(r) => { r.pasos = ''; }, (r) => { r.pasos = null; }, (r) => { delete r.pasos; }]) {
      await expectValid(t, { mutate: (dir) => edit(dir, NOV, aplicar) });
    }
  });

  it('un borrador sin fuentes no falla (ADR 0011)', async (t) => {
    await expectValid(t, {
      mutate: async (dir) => {
        await edit(dir, 'curso.yml', (c) => { c.en_curso = ''; });
        await edit(dir, NOV, (r) => {
          r.estado = 'borrador';
          delete r.fuentes;
        });
      },
    });
  });

  it('un borrador con fuentes null o vacías no falla (ADR 0011)', async (t) => {
    for (const valor of [null, '', []]) {
      await expectValid(t, {
        mutate: async (dir) => {
          await edit(dir, 'curso.yml', (c) => { c.en_curso = ''; });
          await edit(dir, NOV, (r) => {
            r.estado = 'borrador';
            r.fuentes = valor;
          });
        },
      });
    }
  });
});

// ---------------------------------------------------------------------------
// curso.yml: curso
// ---------------------------------------------------------------------------

describe('curso', () => {
  const base = { fixture: 'sin-reto-ni-anuncio', file: 'curso.yml', field: 'curso' };

  it('el segundo año no es el primero más uno', async (t) => {
    await expectOneError(t, {
      ...base,
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.curso = '2026-2028'; }),
    });
  });

  it('el curso con mal formato da «Escribe el curso así: 2026-2027»', async (t) => {
    await expectOneError(t, {
      ...base,
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.curso = '2026-27'; }),
      message: 'Escribe el curso así: 2026-2027',
    });
  });
});

// ---------------------------------------------------------------------------
// curso.yml: meses
// ---------------------------------------------------------------------------

describe('meses', () => {
  const base = { fixture: 'sin-reto-ni-anuncio', file: 'curso.yml' };

  it('solo ocho meses', async (t) => {
    await expectOneError(t, {
      ...base,
      field: 'meses',
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.meses.pop(); }),
    });
  });

  it('diez meses', async (t) => {
    await expectOneError(t, {
      ...base,
      field: 'meses',
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.meses.push({ mes: 'junio', tema: '' }); }),
    });
  });

  it('los meses no van en el orden de octubre a junio', async (t) => {
    await expectOneError(t, {
      ...base,
      field: 'meses',
      mutate: (dir) =>
        edit(dir, 'curso.yml', (c) => {
          [c.meses[0], c.meses[1]] = [c.meses[1], c.meses[0]];
        }),
    });
  });

  it('un mes repetido (octubre en lugar de junio)', async (t) => {
    await expectOneError(t, {
      ...base,
      field: 'meses',
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.meses[8].mes = 'octubre'; }),
    });
  });

  it('un tema de más de 80 caracteres', async (t) => {
    await expectOneError(t, {
      ...base,
      field: 'meses[3].tema',
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.meses[3].tema = long(81); }),
    });
  });
});

// ---------------------------------------------------------------------------
// curso.yml: en_curso
// ---------------------------------------------------------------------------

describe('en_curso', () => {
  const base = { fixture: 'sin-reto-en-curso', file: 'curso.yml', field: 'en_curso' };

  it('el fichero apuntado no existe', async (t) => {
    await expectOneError(t, {
      ...base,
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.en_curso = 'content/retos/2026-2027-enero.yml'; }),
    });
  });

  it('el reto apuntado es de otro curso', async (t) => {
    await expectOneError(t, {
      ...base,
      mutate: async (dir) => {
        await fs.copyFile(path.join(dir, NOV), path.join(dir, 'retos/2025-2026-noviembre.yml'));
        await edit(dir, 'retos/2025-2026-noviembre.yml', (r) => {
          r.curso = '2025-2026';
          r.motriz.fecha = '';
        });
        await edit(dir, 'curso.yml', (c) => { c.en_curso = 'content/retos/2025-2026-noviembre.yml'; });
      },
    });
  });

  it('el reto apuntado está en borrador (ADR 0011)', async (t) => {
    await expectOneError(t, {
      ...base,
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.en_curso = 'content/retos/2026-2027-diciembre.yml'; }),
    });
  });

  it('en_curso con el prefijo content/ se resuelve contra la carpeta de contenido', async (t) => {
    await expectValid(t, {
      fixture: 'sin-reto-en-curso',
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.en_curso = 'content/retos/2026-2027-noviembre.yml'; }),
    });
  });
});

// ---------------------------------------------------------------------------
// Reto del mes
// ---------------------------------------------------------------------------

describe('reto', () => {
  const retoCase = (name, field, fn, extra = {}) => ({
    name,
    file: NOV,
    field,
    mutate: (dir) => edit(dir, NOV, fn),
    ...extra,
  });

  failCases([
    {
      name: 'un mes repetido en el mismo curso (el error va en el segundo fichero por unidades de código y nombra el primero)',
      file: NOV,
      field: 'mes',
      messageIncludes: '2026-2027-diciembre.yml',
      mutate: (dir) => edit(dir, DIC, (r) => { r.mes = 'noviembre'; }),
    },
    retoCase('un reto publicado sin objetivo', 'objetivo', (r) => { delete r.objetivo; }),
    retoCase('un estado fuera de borrador y publicado', 'estado', (r) => { r.estado = 'revisando'; }),
    retoCase('un nombre de más de 80 caracteres', 'nombre', (r) => { r.nombre = long(81); }),
    retoCase('un objetivo de más de 600 caracteres', 'objetivo', (r) => { r.objetivo = long(601); }),
    retoCase('una descripción de más de 1 500 caracteres', 'descripcion', (r) => { r.descripcion = long(1501); }),
    retoCase('más de 10 pasos', 'pasos', (r) => { r.pasos = Array.from({ length: 11 }, (_, i) => `Paso de prueba ${i + 1}`); }),
    retoCase('un paso de más de 200 caracteres', 'pasos[1]', (r) => { r.pasos[1] = long(201); }),
    retoCase('un reto publicado sin fuentes', 'fuentes', (r) => { delete r.fuentes; }),
    retoCase('un reto publicado con la lista de fuentes vacía', 'fuentes', (r) => { r.fuentes = []; }),
    retoCase('una fuente con título de más de 200 caracteres', 'fuentes[0].titulo', (r) => { r.fuentes[0].titulo = long(201); }),
    retoCase('una fuente con dirección sin https://', 'fuentes[0].url', (r) => { r.fuentes[0].url = 'http://example.org/fuente-uno'; }, {
      message: 'La dirección debe empezar por https://',
    }),
    retoCase('una fuente con dirección de más de 300 caracteres', 'fuentes[1].url', (r) => { r.fuentes[1].url = `https://example.org/${long(300)}`; }),
    {
      name: 'un reto publicado con el tema de su mes vacío en curso.yml',
      file: 'curso.yml',
      field: 'meses[1].tema',
      messageIncludes: '2026-2027-noviembre.yml',
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.meses[1].tema = ''; }),
    },
    {
      name: 'un fichero de reto con YAML ilegible',
      file: DIC,
      field: '',
      mutate: (dir) => fs.writeFile(path.join(dir, DIC), 'curso: [\n  mes: "sin cerrar\n'),
    },
  ]);
});

// ---------------------------------------------------------------------------
// Retos (motriz, tutoría y familia)
// ---------------------------------------------------------------------------

describe('retos', () => {
  const retoCase = (name, field, fn, extra = {}) => ({
    name,
    file: NOV,
    field,
    mutate: (dir) => edit(dir, NOV, fn),
    ...extra,
  });

  failCases([
    retoCase('el nombre del motriz vacío en un reto publicado', 'motriz.nombre', (r) => { r.motriz.nombre = ''; }),
    retoCase('una descripción de tutoría de más de 1 200 caracteres', 'tutoria.descripcion', (r) => { r.tutoria.descripcion = long(1201); }),
    retoCase('una descripción de familia de más de 1 200 caracteres', 'familia.descripcion', (r) => { r.familia.descripcion = long(1201); }),
    retoCase('solo «desde» sin «hasta»', 'motriz.hasta', (r) => { delete r.motriz.hasta; }),
    retoCase('solo «hasta» sin «desde»', 'familia.desde', (r) => { r.familia.desde = ''; }),
    retoCase('«hasta» anterior a «desde»', 'tutoria.hasta', (r) => {
      r.tutoria.desde = '2026-11-16';
      r.tutoria.hasta = '2026-11-15';
    }),
    retoCase('una fecha imposible como 2026-02-30', 'tutoria.desde', (r) => { r.tutoria.desde = '2026-02-30'; }),
    retoCase('más de 10 materiales', 'familia.materiales', (r) => {
      r.familia.materiales = Array.from({ length: 11 }, () => ({ ...r.familia.materiales[0] }));
    }),
  ]);
});

// ---------------------------------------------------------------------------
// Reto motriz
// ---------------------------------------------------------------------------

describe('motriz', () => {
  const motrizCase = (name, field, fn, extra = {}) => ({
    name,
    file: NOV,
    field,
    mutate: (dir) => edit(dir, NOV, fn),
    ...extra,
  });

  failCases([
    motrizCase('una fecha posterior al fin del curso (1 de julio de 2027)', 'motriz.fecha', (r) => { r.motriz.fecha = '2027-07-01'; }),
    motrizCase('una fecha anterior al inicio del curso (31 de agosto de 2026)', 'motriz.fecha', (r) => { r.motriz.fecha = '2026-08-31'; }),
    motrizCase('una hora 25:00 da «Escribe la hora así: 11:30»', 'motriz.hora', (r) => { r.motriz.hora = '25:00'; }, {
      message: 'Escribe la hora así: 11:30',
    }),
    motrizCase('un lugar de más de 120 caracteres', 'motriz.lugar', (r) => { r.motriz.lugar = long(121); }),
  ]);

  for (const fecha of ['2026-09-01', '2027-06-30']) {
    it(`la fecha ${fecha}, en el límite del curso, es válida`, async (t) => {
      await expectValid(t, { mutate: (dir) => edit(dir, NOV, (r) => { r.motriz.fecha = fecha; }) });
    });
  }
});

// ---------------------------------------------------------------------------
// Material
// ---------------------------------------------------------------------------

describe('material', () => {
  // tutoria.materiales: [0] documento, [1] ficha, [2] infografía.
  // motriz.materiales[0]: cartel. familia.materiales[0]: justificante.
  const matCase = (name, field, fn, extra = {}) => ({
    name,
    file: NOV,
    field,
    mutate: (dir) => edit(dir, NOV, fn),
    ...extra,
  });
  const archivo = (valor) => (r) => { r.tutoria.materiales[1].archivo = valor; };

  failCases([
    matCase('un título de más de 120 caracteres', 'tutoria.materiales[0].titulo', (r) => { r.tutoria.materiales[0].titulo = long(121); }),
    matCase('un tipo fuera de sus valores', 'tutoria.materiales[0].tipo', (r) => { r.tutoria.materiales[0].tipo = 'video'; }),
    matCase('un destinatario fuera de sus valores', 'tutoria.materiales[0].destinatario', (r) => { r.tutoria.materiales[0].destinatario = 'otros'; }),
    matCase('un archivo que no empieza por /materiales/', 'tutoria.materiales[1].archivo', archivo('/otros/ficha-prueba.pdf')),
    matCase('un archivo que contiene ..', 'tutoria.materiales[1].archivo', archivo(`${MAT}/../ficha-prueba.pdf`)),
    matCase('un archivo que no existe', 'tutoria.materiales[1].archivo', archivo(`${MAT}/no-existe.pdf`)),
    {
      name: 'un archivo con extensión distinta de pdf, png, jpg o jpeg',
      file: NOV,
      field: 'motriz.materiales[0].archivo',
      mutate: async (dir) => {
        await touch(dir, `materiales/2026-2027-noviembre/cartel-prueba.gif`);
        await edit(dir, NOV, (r) => { r.motriz.materiales[0].archivo = `${MAT}/cartel-prueba.gif`; });
      },
    },
    {
      name: 'un archivo de 10 485 761 bytes (un byte por encima del límite)',
      file: NOV,
      field: 'familia.materiales[0].archivo',
      mutate: async (dir) => {
        const rel = 'materiales/2026-2027-noviembre/limite.pdf';
        await touch(dir, rel, '');
        await fs.truncate(path.join(dir, rel), TEN_MB + 1);
        await edit(dir, NOV, (r) => { r.familia.materiales[0].archivo = `${MAT}/limite.pdf`; });
      },
    },
    matCase('una infografía sin version_texto', 'tutoria.materiales[2].version_texto', (r) => { delete r.tutoria.materiales[2].version_texto; }),
    matCase('una infografía con version_texto vacío', 'tutoria.materiales[2].version_texto', (r) => { r.tutoria.materiales[2].version_texto = ''; }),
    matCase('una infografía con version_texto de más de 3 000 caracteres', 'tutoria.materiales[2].version_texto', (r) => { r.tutoria.materiales[2].version_texto = long(3001); }),
  ]);

  it('un archivo de exactamente 10 485 760 bytes pasa', async (t) => {
    await expectValid(t, {
      mutate: async (dir) => {
        const rel = 'materiales/2026-2027-noviembre/limite.pdf';
        await touch(dir, rel, '');
        await fs.truncate(path.join(dir, rel), TEN_MB);
        await edit(dir, NOV, (r) => { r.familia.materiales[0].archivo = `${MAT}/limite.pdf`; });
      },
    });
  });

  describe('M7: PNG y JPG solo para carteles e infografías', () => {
    const SUFIJO = 'solo puede ser PDF. PNG y JPG solo para carteles e infografías.';
    const m7 = [
      { seccion: 'tutoria', i: 1, tipo: 'ficha', ext: 'png', mensaje: `Una ficha ${SUFIJO}` },
      { seccion: 'tutoria', i: 1, tipo: 'ficha', ext: 'jpg', mensaje: `Una ficha ${SUFIJO}` },
      { seccion: 'tutoria', i: 0, tipo: 'documento', ext: 'jpg', mensaje: `Un documento ${SUFIJO}` },
      { seccion: 'tutoria', i: 0, tipo: 'documento', ext: 'png', mensaje: `Un documento ${SUFIJO}` },
      { seccion: 'familia', i: 0, tipo: 'justificante', ext: 'JPEG', mensaje: `Un justificante ${SUFIJO}` },
      { seccion: 'familia', i: 0, tipo: 'justificante', ext: 'png', mensaje: `Un justificante ${SUFIJO}` },
    ];
    failCases(
      m7.map(({ seccion, i, tipo, ext, mensaje }) => ({
        name: `${tipo} con archivo .${ext}`,
        file: NOV,
        field: `${seccion}.materiales[${i}].archivo`,
        message: mensaje,
        mutate: async (dir) => {
          await touch(dir, `materiales/2026-2027-noviembre/${tipo}-prueba.${ext}`);
          await edit(dir, NOV, (r) => { r[seccion].materiales[i].archivo = `${MAT}/${tipo}-prueba.${ext}`; });
        },
      })),
    );

    it('un cartel en PNG y una infografía en JPG pasan', async (t) => {
      await expectValid(t, {
        mutate: async (dir) => {
          await touch(dir, 'materiales/2026-2027-noviembre/cartel-prueba.png');
          await touch(dir, 'materiales/2026-2027-noviembre/infografia-prueba.jpg');
          await edit(dir, NOV, (r) => {
            r.motriz.materiales[0].archivo = `${MAT}/cartel-prueba.png`;
            r.tutoria.materiales[2].archivo = `${MAT}/infografia-prueba.jpg`;
          });
        },
      });
    });

    it('una ficha con archivo .PDF en mayúsculas pasa', async (t) => {
      await expectValid(t, {
        mutate: async (dir) => {
          await fs.copyFile(
            path.join(dir, 'materiales/2026-2027-noviembre/ficha-prueba.pdf'),
            path.join(dir, 'materiales/2026-2027-noviembre/FICHA-MAYUSCULAS.PDF'),
          );
          await edit(dir, NOV, (r) => { r.tutoria.materiales[1].archivo = `${MAT}/FICHA-MAYUSCULAS.PDF`; });
        },
      });
    });

    it('un cartel en .JPG y una infografía en .PNG en mayúsculas pasan', async (t) => {
      await expectValid(t, {
        mutate: async (dir) => {
          await touch(dir, 'materiales/2026-2027-noviembre/cartel-prueba.JPG');
          await touch(dir, 'materiales/2026-2027-noviembre/infografia-prueba.PNG');
          await edit(dir, NOV, (r) => {
            r.motriz.materiales[0].archivo = `${MAT}/cartel-prueba.JPG`;
            r.tutoria.materiales[2].archivo = `${MAT}/infografia-prueba.PNG`;
          });
        },
      });
    });
  });
});

// ---------------------------------------------------------------------------
// sitio.yml
// ---------------------------------------------------------------------------

describe('sitio', () => {
  const sitioCase = (name, field, fn, extra = {}) => ({
    name,
    file: 'sitio.yml',
    field,
    mutate: (dir) => edit(dir, 'sitio.yml', fn),
    ...extra,
  });

  failCases([
    sitioCase('un nombre de Genially vacío', 'genially.nombre', (s) => { s.genially.nombre = ''; }),
    sitioCase('un nombre de Genially de más de 80 caracteres', 'genially.nombre', (s) => { s.genially.nombre = long(81); }),
    sitioCase('una dirección de Genially sin https://', 'genially.url', (s) => { s.genially.url = 'http://example.org/genially'; }, {
      message: 'La dirección debe empezar por https://',
    }),
    sitioCase('una dirección de Genially de más de 300 caracteres', 'genially.url', (s) => { s.genially.url = `https://example.org/${long(300)}`; }),
  ]);
});

// ---------------------------------------------------------------------------
// borrador
// ---------------------------------------------------------------------------

describe('borrador', () => {
  it('un borrador incompleto y sin fuentes no falla (fixture «completo», diciembre)', async () => {
    const dic = parse(await fs.readFile(path.join(FIXTURES, 'completo', DIC), 'utf8'));
    assert.equal(dic.estado, 'borrador');
    const fuentes = dic.fuentes;
    assert.ok(
      fuentes === undefined || fuentes === null || fuentes === '' || (Array.isArray(fuentes) && fuentes.length === 0),
      'La fixture de diciembre debe estar sin fuentes',
    );
    const { errors } = await validateContent(path.join(FIXTURES, 'completo'));
    assert.deepEqual(errors, [], show(errors));
  });

  it('un borrador no necesita el tema de su mes (ADR 0011)', async (t) => {
    await expectValid(t, {
      mutate: (dir) => edit(dir, 'curso.yml', (c) => { c.meses[2].tema = ''; }),
    });
  });

  it('un borrador con un nombre de más de 80 caracteres sigue fallando (esquema básico)', async (t) => {
    await expectOneError(t, {
      fixture: 'completo',
      file: DIC,
      field: 'nombre',
      mutate: (dir) => edit(dir, DIC, (r) => { r.nombre = long(81); }),
    });
  });
});

// ---------------------------------------------------------------------------
// La orden
// ---------------------------------------------------------------------------

describe('validate-content como orden', () => {
  it('con contenido correcto sale con 0 e imprime «Contenido correcto»', async () => {
    const result = await runCommand('tests/fixtures/completo');
    assert.equal(result.code, 0, result.stderr);
    assert.equal(result.stdout.trim(), 'Contenido correcto');
  });

  it('con errores sale con 1 y escribe «fichero · campo: mensaje» por la salida de error', async (t) => {
    const dir = await copyFixture(t, 'completo');
    await edit(dir, NOV, (r) => { r.nombre = long(81); });
    const result = await runCommand(dir);
    assert.equal(result.code, 1, result.stdout);
    const lines = result.stderr.split('\n').filter((l) => l.trim() !== '');
    assert.equal(lines.length, 1, result.stderr);
    assert.match(lines[0], /^retos\/2026-2027-noviembre\.yml · nombre: \S.*$/);
    assert.ok(!lines[0].includes('`'), lines[0]);
  });
});
