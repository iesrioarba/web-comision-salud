import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { loadSite } from '../../src/lib/content.js';
import { formatFileSize } from '../../src/lib/format.js';

// Todo el contenido de las fixtures es inventado (AGENTS.md, privacidad).

const FIXTURES = fileURLToPath(new URL('../fixtures/', import.meta.url));
const fixtureDir = (name) => path.join(FIXTURES, name);
const loadFixture = (name) => loadSite(fixtureDir(name));

const MONTHS = [
  'octubre',
  'noviembre',
  'diciembre',
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
];

const SITE_KEYS = [
  'calendario',
  'curso',
  'enCurso',
  'genially',
  'proximoMes',
  'retos',
  'ultimoPublicado',
];
const CHALLENGE_KEYS = [
  'anio',
  'curso',
  'descripcion',
  'esEnCurso',
  'familia',
  'fuentes',
  'mes',
  'motriz',
  'nombre',
  'objetivo',
  'pasos',
  'tema',
  'tutoria',
  'url',
];
const COMMON_KEYS = [
  'desde',
  'descripcion',
  'fechasTexto',
  'hasta',
  'materiales',
  'nombre',
  'paraQuien',
  'semana',
  'tipo',
];
const MOTRIZ_KEYS = [...COMMON_KEYS, 'autoria', 'fecha', 'fechaTexto', 'hora', 'lugar', 'recreo'].sort();
const TUTORIA_KEYS = [...COMMON_KEYS, 'adaptadoPorEtapas', 'avisoEtapas'].sort();
const FAMILIA_KEYS = [...COMMON_KEYS].sort();
const MATERIAL_KEYS = [
  'archivo',
  'destinatario',
  'destinatarioTexto',
  'entrega',
  'formato',
  'tamano',
  'tipo',
  'titulo',
  'versionTexto',
];
const CALENDAR_KEYS = ['esEnCurso', 'mes', 'tema', 'url'];

const ENTREGA =
  'Se entrega en papel o por la plataforma educativa, no a través de esta web';
const AVISO_ETAPAS =
  'Se adapta por etapas (1.º y 2.º ESO, 3.º y 4.º ESO, Bachillerato y FP): consulta la guía del tutor/a';
const RECREO = 'En el recreo';
const AUTORIA = 'Lo ha diseñado alumnado de 2.º de Bachillerato';

// ---------------------------------------------------------------------------
// Ayudas
// ---------------------------------------------------------------------------

const keysOf = (value) => Object.keys(value ?? {}).sort();

// Igualdad de identidad que no se cumple "por vacío" cuando ambos son undefined.
function assertSame(actual, expected, message) {
  assert.ok(actual !== undefined && actual === expected, message);
}

const readYaml = async (file) => parse(await fs.readFile(file, 'utf8'));

async function copyFixture(t, name) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'content-data-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  await fs.cp(fixtureDir(name), dir, { recursive: true });
  return dir;
}

// Reemplaza un texto del YAML de la copia; comprueba antes que existe.
async function replaceInFile(dir, rel, from, to) {
  const file = path.join(dir, rel);
  const content = await fs.readFile(file, 'utf8');
  assert.ok(content.includes(from), `La fixture ya no contiene: ${from}`);
  await fs.writeFile(file, content.replace(from, to));
}

async function expectedSize(dir, archivo) {
  const file = path.join(dir, 'materiales', archivo.replace(/^\/materiales\//, ''));
  return formatFileSize((await fs.stat(file)).size);
}

function expectedCalendar(withUrl = {}, current = null, themes = {}) {
  return MONTHS.map((mes) => ({
    mes,
    tema: mes in themes ? themes[mes] : `Tema de prueba de ${mes}`,
    url: withUrl[mes] ?? null,
    esEnCurso: mes === current,
  }));
}

const calendarOf = (site) => site.calendario?.map((m) => ({ ...m }));

// ---------------------------------------------------------------------------
// completo
// ---------------------------------------------------------------------------

describe('loadSite · completo', () => {
  const dir = fixtureDir('completo');
  const NOV_URL = '/retos/2026-2027/noviembre/';

  it('la fixture tiene noviembre publicado y diciembre en borrador', async () => {
    assert.equal((await readYaml(path.join(dir, 'retos/2026-2027-noviembre.yml'))).estado, 'publicado');
    assert.equal((await readYaml(path.join(dir, 'retos/2026-2027-diciembre.yml'))).estado, 'borrador');
  });

  it('devuelve exactamente las claves del sitio', async () => {
    assert.deepStrictEqual(keysOf(await loadFixture('completo')), SITE_KEYS);
  });

  it('curso y genially salen de curso.yml y sitio.yml', async () => {
    const site = await loadFixture('completo');
    assert.equal(site.curso, '2026-2027');
    assert.deepStrictEqual(site.genially, {
      nombre: 'Genially de prueba inventado',
      url: 'https://example.org/genially-de-prueba',
    });
  });

  it('retos solo tiene noviembre (el borrador de diciembre no aparece)', async () => {
    const site = await loadFixture('completo');
    assert.deepStrictEqual(site.retos?.map((r) => r.mes), ['noviembre']);
  });

  it('el borrador no aparece en ninguna parte del resultado', async () => {
    const text = JSON.stringify(await loadFixture('completo'));
    assert.ok(text.includes('Reto de prueba inventado'));
    assert.ok(!text.includes('Borrador de prueba inventado'));
    assert.ok(!text.includes('Motriz pendiente de prueba'));
  });

  it('el reto tiene exactamente las claves previstas', async () => {
    const site = await loadFixture('completo');
    assert.deepStrictEqual(keysOf(site.retos?.[0]), CHALLENGE_KEYS);
  });

  it('el reto tiene anio, tema, url y esEnCurso', async () => {
    const reto = (await loadFixture('completo')).retos?.[0];
    assert.equal(reto?.curso, '2026-2027');
    assert.equal(reto?.mes, 'noviembre');
    assert.equal(reto?.anio, 2026);
    assert.equal(reto?.tema, 'Tema de prueba de noviembre');
    assert.equal(reto?.url, NOV_URL);
    assert.equal(reto?.esEnCurso, true);
  });

  it('el reto no expone estado ni ruta del fichero', async () => {
    const reto = (await loadFixture('completo')).retos?.[0];
    assert.ok(reto, 'hay reto');
    assert.ok(!('estado' in reto));
  });

  it('enCurso es el mismo objeto que retos[0]', async () => {
    const site = await loadFixture('completo');
    assertSame(site.enCurso, site.retos?.[0]);
  });

  it('ultimoPublicado es el mismo objeto que retos[0]', async () => {
    const site = await loadFixture('completo');
    assertSame(site.ultimoPublicado, site.retos?.[0]);
  });

  it('proximoMes es null', async () => {
    assert.equal((await loadFixture('completo')).proximoMes, null);
  });

  it('el calendario tiene 9 meses en orden con las claves previstas', async () => {
    const site = await loadFixture('completo');
    assert.deepStrictEqual(site.calendario?.map((m) => m.mes), MONTHS);
    assert.deepStrictEqual(
      [...new Set((site.calendario ?? []).map((m) => keysOf(m).join()))],
      [CALENDAR_KEYS.join()],
    );
  });

  it('el calendario solo tiene url y esEnCurso en noviembre, y sin url de diciembre', async () => {
    const site = await loadFixture('completo');
    assert.deepStrictEqual(calendarOf(site), expectedCalendar({ noviembre: NOV_URL }, 'noviembre'));
  });

  it('el reto tiene objetivo, descripción en párrafos, pasos y fuentes', async () => {
    const reto = (await loadFixture('completo')).retos?.[0];
    assert.equal(
      reto?.objetivo,
      'Objetivo de prueba inventado: comprobar que la web muestra todos los campos de un reto completo.',
    );
    assert.equal(reto?.nombre, 'Reto de prueba inventado');
    assert.deepStrictEqual(reto?.descripcion, ['Descripción de prueba inventada del reto completo.']);
    assert.deepStrictEqual(reto?.pasos, [
      'Primer paso de prueba',
      'Segundo paso de prueba',
      'Tercer paso de prueba',
    ]);
    assert.deepStrictEqual(reto?.fuentes, [
      { titulo: 'Fuente de prueba inventada uno', url: 'https://example.org/fuente-uno' },
      { titulo: 'Fuente de prueba inventada dos', url: 'https://example.org/fuente-dos' },
    ]);
  });

  describe('motriz', () => {
    it('tiene exactamente las claves previstas', async () => {
      const reto = (await loadFixture('completo')).retos?.[0];
      assert.deepStrictEqual(keysOf(reto?.motriz), MOTRIZ_KEYS);
    });

    it('tiene los textos fijos y el nombre', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.motriz;
      assert.equal(m?.tipo, 'motriz');
      assert.equal(m?.nombre, 'Reto motriz de prueba');
      assert.equal(m?.semana, '1.ª semana');
      assert.equal(m?.paraQuien, 'Todo el centro');
      assert.equal(m?.recreo, RECREO);
      assert.equal(m?.autoria, AUTORIA);
    });

    it('tiene fecha, hora y lugar', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.motriz;
      assert.equal(m?.fecha, '2026-11-13');
      assert.equal(m?.fechaTexto, 'viernes, 13 de noviembre de 2026');
      assert.equal(m?.hora, '11:30');
      assert.equal(m?.lugar, 'Patio de ejemplo');
    });

    it('tiene desde, hasta y fechasTexto', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.motriz;
      assert.equal(m?.desde, '2026-11-09');
      assert.equal(m?.hasta, '2026-11-13');
      assert.equal(
        m?.fechasTexto,
        'del lunes, 9 de noviembre de 2026 al viernes, 13 de noviembre de 2026',
      );
    });

    it('tiene la descripción en párrafos', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.motriz;
      assert.deepStrictEqual(m?.descripcion, ['Actividad motriz de prueba inventada, sin datos reales.']);
    });

    it('el cartel es un material completo', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.motriz;
      const archivo = '/materiales/2026-2027-noviembre/cartel-prueba.png';
      assert.deepStrictEqual(m?.materiales, [
        {
          titulo: 'Cartel de prueba inventado',
          tipo: 'cartel',
          destinatario: 'todo-el-centro',
          destinatarioTexto: 'Todo el centro',
          archivo,
          formato: 'Imagen PNG',
          tamano: await expectedSize(dir, archivo),
          entrega: null,
          versionTexto: null,
        },
      ]);
    });
  });

  describe('tutoría', () => {
    it('tiene exactamente las claves previstas', async () => {
      const reto = (await loadFixture('completo')).retos?.[0];
      assert.deepStrictEqual(keysOf(reto?.tutoria), TUTORIA_KEYS);
    });

    it('tiene los textos fijos y el nombre', async () => {
      const t = (await loadFixture('completo')).retos?.[0]?.tutoria;
      assert.equal(t?.tipo, 'tutoria');
      assert.equal(t?.nombre, 'Reto de tutoría de prueba');
      assert.equal(t?.semana, '2.ª y 3.ª semanas');
      assert.equal(t?.paraQuien, 'Cada grupo con su tutor/a');
    });

    it('adaptada por etapas: lo indica y trae el aviso', async () => {
      const t = (await loadFixture('completo')).retos?.[0]?.tutoria;
      assert.equal(t?.adaptadoPorEtapas, true);
      assert.equal(t?.avisoEtapas, AVISO_ETAPAS);
    });

    it('la descripción son 2 párrafos con el HTML sin escapar', async () => {
      const t = (await loadFixture('completo')).retos?.[0]?.tutoria;
      assert.deepStrictEqual(t?.descripcion, [
        'Descripción de prueba inventada de la tutoría.',
        'Prueba de escape: <script>alert(1)</script> y <b>negrita</b> deben verse como texto.',
      ]);
    });

    it('tiene desde, hasta y fechasTexto', async () => {
      const t = (await loadFixture('completo')).retos?.[0]?.tutoria;
      assert.equal(t?.desde, '2026-11-16');
      assert.equal(t?.hasta, '2026-11-27');
      assert.equal(
        t?.fechasTexto,
        'del lunes, 16 de noviembre de 2026 al viernes, 27 de noviembre de 2026',
      );
    });

    it('el documento es un material completo (sin entrega)', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.tutoria?.materiales?.[0];
      const archivo = '/materiales/2026-2027-noviembre/documento-prueba.pdf';
      assert.deepStrictEqual(m, {
        titulo: 'Documento de prueba inventado',
        tipo: 'documento',
        destinatario: 'tutores',
        destinatarioTexto: 'Tutor/a',
        archivo,
        formato: 'PDF',
        tamano: await expectedSize(dir, archivo),
        entrega: null,
        versionTexto: null,
      });
    });

    it('la ficha es un material completo con el texto de entrega', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.tutoria?.materiales?.[1];
      const archivo = '/materiales/2026-2027-noviembre/ficha-prueba.pdf';
      assert.deepStrictEqual(m, {
        titulo: 'Ficha de prueba inventada',
        tipo: 'ficha',
        destinatario: 'alumnado',
        destinatarioTexto: 'Alumnado',
        archivo,
        formato: 'PDF',
        tamano: await expectedSize(dir, archivo),
        entrega: ENTREGA,
        versionTexto: null,
      });
    });

    it('la infografía es un material completo con versión en texto', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.tutoria?.materiales?.[2];
      const archivo = '/materiales/2026-2027-noviembre/infografia-prueba.jpg';
      assert.deepStrictEqual(m, {
        titulo: 'Infografía de prueba inventada',
        tipo: 'infografia',
        destinatario: 'todo-el-centro',
        destinatarioTexto: 'Todo el centro',
        archivo,
        formato: 'Imagen JPG',
        tamano: await expectedSize(dir, archivo),
        entrega: null,
        versionTexto: [
          '1. Primer punto de la infografía de prueba.',
          '2. Segundo punto de la infografía de prueba.',
          '3. Tercer punto de la infografía de prueba.',
        ],
      });
    });

    it('tiene 3 materiales con exactamente las claves previstas', async () => {
      const materiales = (await loadFixture('completo')).retos?.[0]?.tutoria?.materiales;
      assert.equal(materiales?.length, 3);
      for (const m of materiales ?? []) {
        assert.deepStrictEqual(keysOf(m), MATERIAL_KEYS);
      }
    });
  });

  describe('familia', () => {
    it('tiene exactamente las claves previstas', async () => {
      const reto = (await loadFixture('completo')).retos?.[0];
      assert.deepStrictEqual(keysOf(reto?.familia), FAMILIA_KEYS);
    });

    it('tiene los textos fijos y el nombre', async () => {
      const f = (await loadFixture('completo')).retos?.[0]?.familia;
      assert.equal(f?.tipo, 'familia');
      assert.equal(f?.nombre, 'Reto en familia de prueba');
      assert.equal(f?.semana, 'Última semana');
      assert.equal(f?.paraQuien, 'El alumnado con su familia, en casa');
    });

    it('el justificante es un material completo con el texto de entrega', async () => {
      const m = (await loadFixture('completo')).retos?.[0]?.familia?.materiales?.[0];
      const archivo = '/materiales/2026-2027-noviembre/justificante-prueba.pdf';
      assert.deepStrictEqual(m, {
        titulo: 'Justificante de prueba inventado',
        tipo: 'justificante',
        destinatario: 'familias',
        destinatarioTexto: 'Familias',
        archivo,
        formato: 'PDF',
        tamano: await expectedSize(dir, archivo),
        entrega: ENTREGA,
        versionTexto: null,
      });
    });
  });
});

// ---------------------------------------------------------------------------
// pendientes
// ---------------------------------------------------------------------------

describe('loadSite · pendientes', () => {
  const dir = fixtureDir('pendientes');

  it('la fixture tiene las tres formas de vacío', async () => {
    const reto = await readYaml(path.join(dir, 'retos/2026-2027-octubre.yml'));
    const m = reto.motriz;
    assert.equal(m.descripcion, '');
    assert.equal(m.fecha, null);
    assert.equal(m.hora, null);
    assert.ok(!('lugar' in m), 'lugar ausente');
    assert.ok(!('desde' in m) && !('hasta' in m));
    assert.equal(reto.tutoria.nombre, '');
    assert.equal(reto.familia.nombre, null);
    assert.ok(!('adaptado_por_etapas' in reto.tutoria));
    assert.equal(reto.fuentes[0].url, '');
    assert.equal(m.materiales[0].archivo, '');
    assert.equal(reto.tutoria.materiales[0].archivo, null);
    assert.ok(!('archivo' in reto.tutoria.materiales[1]));
    assert.ok(!('archivo' in reto.familia.materiales[0]));
  });

  it('un reto, octubre, en curso, y es también el último publicado', async () => {
    const site = await loadFixture('pendientes');
    assert.deepStrictEqual(site.retos?.map((r) => r.mes), ['octubre']);
    assert.equal(site.retos?.[0]?.esEnCurso, true);
    assertSame(site.enCurso, site.retos?.[0]);
    assertSame(site.ultimoPublicado, site.retos?.[0]);
  });

  it('proximoMes es null', async () => {
    assert.equal((await loadFixture('pendientes')).proximoMes, null);
  });

  it('en el calendario, diciembre tiene tema y url null', async () => {
    const site = await loadFixture('pendientes');
    const dic = site.calendario?.find((m) => m.mes === 'diciembre');
    assert.deepStrictEqual(dic, { mes: 'diciembre', tema: null, url: null, esEnCurso: false });
  });

  it('el calendario completo solo marca octubre', async () => {
    const site = await loadFixture('pendientes');
    assert.deepStrictEqual(
      calendarOf(site),
      expectedCalendar({ octubre: '/retos/2026-2027/octubre/' }, 'octubre', { diciembre: null }),
    );
  });

  it('motriz: descripcion, fecha, fechaTexto, hora, lugar, desde, hasta y fechasTexto son null', async () => {
    const m = (await loadFixture('pendientes')).retos?.[0]?.motriz;
    assert.ok(m, 'hay motriz');
    for (const key of ['descripcion', 'fecha', 'fechaTexto', 'hora', 'lugar', 'desde', 'hasta', 'fechasTexto']) {
      assert.equal(m[key], null, key);
    }
  });

  it('motriz conserva sus claves aunque estén vacías', async () => {
    const m = (await loadFixture('pendientes')).retos?.[0]?.motriz;
    assert.deepStrictEqual(keysOf(m), MOTRIZ_KEYS);
  });

  it('tutoría sin nombre usa «Reto de tutoría»', async () => {
    const t = (await loadFixture('pendientes')).retos?.[0]?.tutoria;
    assert.equal(t?.nombre, 'Reto de tutoría');
  });

  it('familia con nombre null usa «Reto en familia»', async () => {
    const f = (await loadFixture('pendientes')).retos?.[0]?.familia;
    assert.equal(f?.nombre, 'Reto en familia');
  });

  it('tutoría sin adaptado_por_etapas: false y sin aviso', async () => {
    const t = (await loadFixture('pendientes')).retos?.[0]?.tutoria;
    assert.equal(t?.adaptadoPorEtapas, false);
    assert.equal(t?.avisoEtapas, null);
  });

  it('los cuatro materiales tienen archivo, formato y tamano null', async () => {
    const reto = (await loadFixture('pendientes')).retos?.[0];
    const materiales = [
      ...(reto?.motriz?.materiales ?? []),
      ...(reto?.tutoria?.materiales ?? []),
      ...(reto?.familia?.materiales ?? []),
    ];
    assert.equal(materiales.length, 4);
    for (const m of materiales) {
      assert.equal(m.archivo, null, `${m.titulo}: archivo`);
      assert.equal(m.formato, null, `${m.titulo}: formato`);
      assert.equal(m.tamano, null, `${m.titulo}: tamano`);
    }
  });

  it('la ficha y el justificante tienen entrega aunque no haya archivo', async () => {
    const reto = (await loadFixture('pendientes')).retos?.[0];
    assert.equal(reto?.tutoria?.materiales?.[0]?.tipo, 'ficha');
    assert.equal(reto?.tutoria?.materiales?.[0]?.entrega, ENTREGA);
    assert.equal(reto?.familia?.materiales?.[0]?.tipo, 'justificante');
    assert.equal(reto?.familia?.materiales?.[0]?.entrega, ENTREGA);
  });

  it('el cartel y el documento no tienen entrega', async () => {
    const reto = (await loadFixture('pendientes')).retos?.[0];
    assert.equal(reto?.motriz?.materiales?.[0]?.entrega, null);
    assert.equal(reto?.tutoria?.materiales?.[1]?.entrega, null);
  });

  it('los materiales sin archivo conservan sus textos', async () => {
    const reto = (await loadFixture('pendientes')).retos?.[0];
    assert.deepStrictEqual(reto?.tutoria?.materiales?.[1], {
      titulo: 'Documento pendiente de prueba',
      tipo: 'documento',
      destinatario: 'tutores',
      destinatarioTexto: 'Tutor/a',
      archivo: null,
      formato: null,
      tamano: null,
      entrega: null,
      versionTexto: null,
    });
  });

  it('la fuente con url vacía tiene url null', async () => {
    const reto = (await loadFixture('pendientes')).retos?.[0];
    assert.deepStrictEqual(reto?.fuentes, [{ titulo: 'Fuente de prueba inventada', url: null }]);
  });
});

// ---------------------------------------------------------------------------
// sin-reto-en-curso
// ---------------------------------------------------------------------------

describe('loadSite · sin-reto-en-curso', () => {
  const dir = fixtureDir('sin-reto-en-curso');

  it('la fixture tiene octubre, noviembre y un borrador de diciembre, sin en_curso', async () => {
    const files = (await fs.readdir(path.join(dir, 'retos'))).sort();
    assert.deepStrictEqual(files, [
      '2026-2027-diciembre.yml',
      '2026-2027-noviembre.yml',
      '2026-2027-octubre.yml',
    ]);
    assert.equal((await readYaml(path.join(dir, 'retos', files[0]))).estado, 'borrador');
    assert.equal((await readYaml(path.join(dir, 'retos', files[1]))).estado, 'publicado');
    assert.equal((await readYaml(path.join(dir, 'retos', files[2]))).estado, 'publicado');
    const curso = await readYaml(path.join(dir, 'curso.yml'));
    assert.equal(curso.en_curso, '');
    assert.equal(curso.proximo_mes, 'enero');
  });

  it('retos son octubre y noviembre, en ese orden y sin el borrador', async () => {
    const site = await loadFixture('sin-reto-en-curso');
    assert.deepStrictEqual(site.retos?.map((r) => r.mes), ['octubre', 'noviembre']);
  });

  it('ningún reto es esEnCurso', async () => {
    const site = await loadFixture('sin-reto-en-curso');
    assert.deepStrictEqual(site.retos?.map((r) => r.esEnCurso), [false, false]);
  });

  it('enCurso es null', async () => {
    assert.equal((await loadFixture('sin-reto-en-curso')).enCurso, null);
  });

  it('ultimoPublicado es retos[1] (noviembre)', async () => {
    const site = await loadFixture('sin-reto-en-curso');
    assertSame(site.ultimoPublicado, site.retos?.[1]);
    assert.equal(site.ultimoPublicado?.mes, 'noviembre');
  });

  it('proximoMes es enero con su tema', async () => {
    const site = await loadFixture('sin-reto-en-curso');
    assert.deepStrictEqual(site.proximoMes, { mes: 'enero', tema: 'Tema de prueba de enero' });
  });

  it('el calendario tiene url en octubre y noviembre y ningún esEnCurso', async () => {
    const site = await loadFixture('sin-reto-en-curso');
    assert.deepStrictEqual(
      calendarOf(site),
      expectedCalendar({
        octubre: '/retos/2026-2027/octubre/',
        noviembre: '/retos/2026-2027/noviembre/',
      }),
    );
  });

  it('tutoría y familia usan los nombres por defecto', async () => {
    const reto = (await loadFixture('sin-reto-en-curso')).retos?.[0];
    assert.equal(reto?.tutoria?.nombre, 'Reto de tutoría');
    assert.equal(reto?.familia?.nombre, 'Reto en familia');
  });

  it('pasos y materiales ausentes son listas vacías en los tres retos', async () => {
    const reto = (await loadFixture('sin-reto-en-curso')).retos?.[0];
    assert.deepStrictEqual(reto?.pasos, []);
    assert.deepStrictEqual(reto?.motriz?.materiales, []);
    assert.deepStrictEqual(reto?.tutoria?.materiales, []);
    assert.deepStrictEqual(reto?.familia?.materiales, []);
  });
});

// ---------------------------------------------------------------------------
// sin-reto-ni-anuncio
// ---------------------------------------------------------------------------

describe('loadSite · sin-reto-ni-anuncio', () => {
  it('retos es una lista vacía', async () => {
    assert.deepStrictEqual((await loadFixture('sin-reto-ni-anuncio')).retos, []);
  });

  it('enCurso, proximoMes y ultimoPublicado son null', async () => {
    const site = await loadFixture('sin-reto-ni-anuncio');
    assert.equal(site.enCurso, null);
    assert.equal(site.proximoMes, null);
    assert.equal(site.ultimoPublicado, null);
  });

  it('el calendario tiene los 9 meses con tema, sin url ni esEnCurso', async () => {
    const site = await loadFixture('sin-reto-ni-anuncio');
    assert.deepStrictEqual(calendarOf(site), expectedCalendar());
  });

  it('genially y curso salen de los ficheros', async () => {
    const site = await loadFixture('sin-reto-ni-anuncio');
    assert.equal(site.curso, '2026-2027');
    assert.deepStrictEqual(site.genially, {
      nombre: 'Genially de prueba inventado',
      url: 'https://example.org/genially-de-prueba',
    });
  });

  it('tiene exactamente las claves del sitio', async () => {
    assert.deepStrictEqual(keysOf(await loadFixture('sin-reto-ni-anuncio')), SITE_KEYS);
  });
});

// ---------------------------------------------------------------------------
// Copias temporales (valores límite)
// ---------------------------------------------------------------------------

describe('loadSite · copias temporales', () => {
  describe('reto de un curso anterior', () => {
    async function prepare(t) {
      const dir = await copyFixture(t, 'sin-reto-en-curso');
      const from = 'retos/2026-2027-octubre.yml';
      await replaceInFile(dir, from, 'curso: "2026-2027"', 'curso: "2025-2026"');
      await replaceInFile(dir, from, 'mes: octubre', 'mes: mayo');
      await fs.rename(path.join(dir, from), path.join(dir, 'retos/2025-2026-mayo.yml'));
      return dir;
    }

    it('va el primero de retos, antes que noviembre', async (t) => {
      const site = await loadSite(await prepare(t));
      assert.deepStrictEqual(
        site.retos?.map((r) => [r.curso, r.mes]),
        [['2025-2026', 'mayo'], ['2026-2027', 'noviembre']],
      );
    });

    it('tiene tema null, anio 2026, url propia y esEnCurso false', async (t) => {
      const mayo = (await loadSite(await prepare(t))).retos?.[0];
      assert.equal(mayo?.tema, null);
      assert.equal(mayo?.anio, 2026);
      assert.equal(mayo?.url, '/retos/2025-2026/mayo/');
      assert.equal(mayo?.esEnCurso, false);
    });

    it('ultimoPublicado sigue siendo noviembre de 2026-2027', async (t) => {
      const site = await loadSite(await prepare(t));
      assertSame(site.ultimoPublicado, site.retos?.[1]);
      assert.equal(site.ultimoPublicado?.mes, 'noviembre');
      assert.equal(site.ultimoPublicado?.curso, '2026-2027');
    });

    it('el mayo del calendario sigue con url null', async (t) => {
      const site = await loadSite(await prepare(t));
      const mayo = site.calendario?.find((m) => m.mes === 'mayo');
      assert.deepStrictEqual(mayo, { mes: 'mayo', tema: 'Tema de prueba de mayo', url: null, esEnCurso: false });
    });
  });

  describe('próximo mes sin tema', () => {
    async function prepare(t) {
      const dir = await copyFixture(t, 'sin-reto-en-curso');
      await replaceInFile(dir, 'curso.yml', 'proximo_mes: enero', 'proximo_mes: diciembre');
      await replaceInFile(
        dir,
        'curso.yml',
        'tema: "Tema de prueba de diciembre"',
        'tema: "   "',
      );
      return dir;
    }

    it('proximoMes tiene tema null', async (t) => {
      const site = await loadSite(await prepare(t));
      assert.deepStrictEqual(site.proximoMes, { mes: 'diciembre', tema: null });
    });

    it('el diciembre del calendario tiene tema null', async (t) => {
      const site = await loadSite(await prepare(t));
      const dic = site.calendario?.find((m) => m.mes === 'diciembre');
      assert.deepStrictEqual(dic, { mes: 'diciembre', tema: null, url: null, esEnCurso: false });
    });
  });

  it('próximo mes con reto en curso: proximoMes es null', async (t) => {
    const dir = await copyFixture(t, 'completo');
    await replaceInFile(dir, 'curso.yml', 'proximo_mes: ""', 'proximo_mes: enero');
    const site = await loadSite(dir);
    assert.ok(site.enCurso, 'hay reto en curso');
    assert.equal(site.proximoMes, null);
  });

  it('tamaño real: 1 258 291 bytes se muestran como «1,2 MB»', async (t) => {
    const dir = await copyFixture(t, 'completo');
    const archivo = path.join(dir, 'materiales/2026-2027-noviembre/ficha-prueba.pdf');
    await fs.truncate(archivo, 1_258_291);
    assert.equal((await fs.stat(archivo)).size, 1_258_291);
    const site = await loadSite(dir);
    const ficha = site.retos?.[0]?.tutoria?.materiales?.[1];
    assert.equal(ficha?.titulo, 'Ficha de prueba inventada');
    assert.equal(ficha?.tamano, '1,2 MB');
  });

  it('sin carpeta retos/: retos es [] y no lanza', async (t) => {
    const dir = await copyFixture(t, 'sin-reto-ni-anuncio');
    await fs.rm(path.join(dir, 'retos'), { recursive: true, force: true });
    await assert.rejects(fs.stat(path.join(dir, 'retos')), { code: 'ENOENT' });
    const site = await loadSite(dir);
    assert.deepStrictEqual(site.retos, []);
  });
});

// ---------------------------------------------------------------------------
// src/_data/site.js
// ---------------------------------------------------------------------------

describe('src/_data/site.js', () => {
  it('lee CONTENT_DIR y devuelve el sitio', async (t) => {
    const previous = process.env.CONTENT_DIR;
    t.after(() => {
      if (previous === undefined) {
        delete process.env.CONTENT_DIR;
      } else {
        process.env.CONTENT_DIR = previous;
      }
    });
    process.env.CONTENT_DIR = fixtureDir('completo');
    const { default: siteData } = await import('../../src/_data/site.js');
    const site = await siteData();
    assert.equal(site.curso, '2026-2027');
    assert.equal(site.enCurso?.mes, 'noviembre');
  });
});
