// Capa de datos: lee el contenido (YAML) y devuelve los datos derivados que
// consumen las plantillas. No valida (lo hace scripts/validate-content.js).
// Solo usa `yaml` y módulos de Node.
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import {
  formatDate,
  formatFileSize,
  formatFileType,
  formatWeekRange,
  toParagraphs,
  yearForMonth,
} from './format.js';

// Orden de los meses del curso (octubre a junio).
const MONTHS = ['octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio'];

// Textos fijos (data-model.md).
const WEEK_TEXT = {
  motriz: '1.ª semana',
  tutoria: '2.ª y 3.ª semanas',
  familia: 'Última semana',
};
const FOR_WHOM_TEXT = {
  motriz: 'Todo el centro',
  tutoria: 'Cada grupo con su tutor/a',
  familia: 'El alumnado con su familia, en casa',
};
const DEFAULT_NAME = {
  tutoria: 'Reto de tutoría',
  familia: 'Reto en familia',
};
const RECREO_TEXT = 'En el recreo';
const AUTORIA_TEXT = 'Lo ha diseñado alumnado de 2.º de Bachillerato';
const STAGES_NOTICE =
  'Se adapta por etapas (1.º y 2.º ESO, 3.º y 4.º ESO, Bachillerato y FP): consulta la guía del tutor/a';
const DELIVERY_TEXT = 'Se entrega en papel o por la plataforma educativa, no a través de esta web';
const RECIPIENT_TEXT = {
  alumnado: 'Alumnado',
  familias: 'Familias',
  tutores: 'Tutor/a',
  'todo-el-centro': 'Todo el centro',
};

// Lee y analiza un fichero YAML (esquema por defecto: las fechas quedan como texto).
async function readYaml(file) {
  return parse(await fs.readFile(file, 'utf8'));
}

// "", null, ausente o solo espacios -> null; si no, el texto tal cual.
function emptyToNull(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
}

// Texto largo -> lista de párrafos, o null si no queda ninguno.
function toParagraphsOrNull(value) {
  const text = emptyToNull(value);
  if (text === null) return null;
  const paragraphs = toParagraphs(text);
  return paragraphs.length > 0 ? paragraphs : null;
}

const toList = (value) => (Array.isArray(value) ? value : []);

async function buildMaterial(contentDir, material) {
  const archivo = emptyToNull(material.archivo);
  let tamano = null;
  if (archivo !== null) {
    const file = path.join(contentDir, 'materiales', archivo.replace(/^\/materiales\//, ''));
    tamano = formatFileSize((await fs.stat(file)).size);
  }
  const needsDelivery = material.tipo === 'ficha' || material.tipo === 'justificante';
  return {
    titulo: material.titulo,
    tipo: material.tipo,
    destinatario: material.destinatario,
    destinatarioTexto: RECIPIENT_TEXT[material.destinatario],
    archivo,
    formato: archivo === null ? null : formatFileType(archivo),
    tamano,
    entrega: needsDelivery ? DELIVERY_TEXT : null,
    versionTexto: toParagraphsOrNull(material.version_texto),
  };
}

// Parte común de motriz, tutoría y familia.
async function buildSection(contentDir, type, raw = {}) {
  const desde = emptyToNull(raw.desde);
  const hasta = emptyToNull(raw.hasta);
  const section = {
    tipo: type,
    nombre: emptyToNull(raw.nombre) ?? DEFAULT_NAME[type] ?? null,
    semana: WEEK_TEXT[type],
    paraQuien: FOR_WHOM_TEXT[type],
    descripcion: toParagraphsOrNull(raw.descripcion),
    desde,
    hasta,
    fechasTexto: desde !== null && hasta !== null ? formatWeekRange(desde, hasta) : null,
    materiales: await Promise.all(toList(raw.materiales).map((m) => buildMaterial(contentDir, m))),
  };
  if (type === 'motriz') {
    const fecha = emptyToNull(raw.fecha);
    Object.assign(section, {
      fecha,
      fechaTexto: fecha === null ? null : formatDate(fecha),
      hora: emptyToNull(raw.hora),
      lugar: emptyToNull(raw.lugar),
      recreo: RECREO_TEXT,
      autoria: AUTORIA_TEXT,
    });
  }
  if (type === 'tutoria') {
    const adaptadoPorEtapas = raw.adaptado_por_etapas === true;
    Object.assign(section, {
      adaptadoPorEtapas,
      avisoEtapas: adaptadoPorEtapas ? STAGES_NOTICE : null,
    });
  }
  return section;
}

async function buildChallenge(contentDir, raw, courseThemes, currentCourse) {
  const sameCourse = raw.curso === currentCourse;
  return {
    curso: raw.curso,
    mes: raw.mes,
    anio: yearForMonth(raw.curso, raw.mes),
    tema: sameCourse ? emptyToNull(courseThemes.get(raw.mes)) : null,
    url: `/retos/${raw.curso}/${raw.mes}/`,
    esEnCurso: false,
    nombre: emptyToNull(raw.nombre),
    objetivo: emptyToNull(raw.objetivo),
    descripcion: toParagraphsOrNull(raw.descripcion),
    pasos: toList(raw.pasos),
    fuentes: toList(raw.fuentes).map((f) => ({
      titulo: f.titulo,
      url: emptyToNull(f.url),
    })),
    motriz: await buildSection(contentDir, 'motriz', raw.motriz),
    tutoria: await buildSection(contentDir, 'tutoria', raw.tutoria),
    familia: await buildSection(contentDir, 'familia', raw.familia),
  };
}

// Nombres de los ficheros .yml de retos/, en orden de sort(); [] si no existe la carpeta.
async function listChallengeFiles(contentDir) {
  try {
    return (await fs.readdir(path.join(contentDir, 'retos'))).filter((n) => n.endsWith('.yml')).sort();
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

/**
 * Lee el contenido de `contentDir` y devuelve los datos del sitio para las
 * plantillas. Da por bueno el contenido (no valida) y no lanza por datos
 * vacíos; si falta el fichero de un material, propaga el error de `fs`.
 * @param {string} contentDir Carpeta con curso.yml, sitio.yml y retos/.
 * @returns {Promise<{
 *   curso: string,
 *   genially: { nombre: string, url: string },
 *   retos: object[],
 *   enCurso: object | null,
 *   proximoMes: { mes: string, tema: string | null } | null,
 *   ultimoPublicado: object | null,
 *   calendario: { mes: string, tema: string | null, url: string | null, esEnCurso: boolean }[],
 * }>}
 */
export async function loadSite(contentDir) {
  const course = await readYaml(path.join(contentDir, 'curso.yml'));
  const sitio = await readYaml(path.join(contentDir, 'sitio.yml'));
  const themes = new Map(toList(course.meses).map((m) => [m.mes, m.tema]));

  // Solo los retos publicados, indexados por la ruta absoluta de su fichero.
  const byFile = new Map();
  for (const name of await listChallengeFiles(contentDir)) {
    const file = path.resolve(contentDir, 'retos', name);
    const raw = await readYaml(file);
    if (raw.estado !== 'publicado') continue;
    byFile.set(file, await buildChallenge(contentDir, raw, themes, course.curso));
  }

  // Orden: curso y, dentro de cada curso, de octubre a junio.
  const retos = [...byFile.values()].sort(
    (a, b) => a.curso.localeCompare(b.curso) || MONTHS.indexOf(a.mes) - MONTHS.indexOf(b.mes),
  );

  // en_curso se resuelve contra contentDir quitando el prefijo `content/`.
  const currentPath = emptyToNull(course.en_curso);
  const enCurso =
    currentPath === null
      ? null
      : (byFile.get(path.resolve(contentDir, currentPath.replace(/^content\//, ''))) ?? null);
  if (enCurso) enCurso.esEnCurso = true;

  const nextMonth = emptyToNull(course.proximo_mes);
  const proximoMes =
    enCurso === null && nextMonth !== null
      ? { mes: nextMonth, tema: emptyToNull(themes.get(nextMonth)) }
      : null;

  // El mes más tardío del curso actual (sale de `retos`, mismos objetos).
  const ultimoPublicado =
    retos
      .filter((r) => r.curso === course.curso)
      .sort((a, b) => MONTHS.indexOf(a.mes) - MONTHS.indexOf(b.mes))
      .at(-1) ?? null;

  const calendario = toList(course.meses).map(({ mes }) => {
    const reto = retos.find((r) => r.curso === course.curso && r.mes === mes);
    return {
      mes,
      tema: emptyToNull(themes.get(mes)),
      url: reto ? reto.url : null,
      esEnCurso: enCurso !== null && enCurso.mes === mes,
    };
  });

  return {
    curso: course.curso,
    genially: { nombre: sitio.genially.nombre, url: sitio.genially.url },
    retos,
    enCurso,
    proximoMes,
    ultimoPublicado,
    calendario,
  };
}
