// Valida el contenido (curso.yml, sitio.yml y retos/*.yml) contra los esquemas de
// schemas/ y aplica las reglas entre campos y entre ficheros. ADR 0008.
// Devuelve { errors: [{ file, field, message }] }. Los mensajes van en español.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';

const MONTHS = ['octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio'];
const SECTIONS = ['motriz', 'tutoria', 'familia'];
const MAX_FILE_BYTES = 10_485_760;
const SCHEMAS_DIR = fileURLToPath(new URL('../schemas/', import.meta.url));

// Patrones del esquema con un mensaje propio (los mismos que usa el panel).
const PATTERN_MESSAGES = new Map([
  ['^([01][0-9]|2[0-3]):[0-5][0-9]$', 'Escribe la hora así: 11:30'],
  ['^[0-9]{4}-[0-9]{4}$', 'Escribe el curso así: 2026-2027'],
  ['^https://[^\\s]+$', 'La dirección debe empezar por https://'],
  ['^content/retos/[0-9]{4}-[0-9]{4}-[a-z]+\\.yml$', 'Elige un reto de la lista, con la ruta tal como la da el panel.'],
]);
const FILE_PATTERN_MESSAGE =
  'La ruta debe empezar por /materiales/, no llevar .. y acabar en .pdf, .png, .jpg o .jpeg.';
const M7_ARTICLES = { ficha: 'Una ficha', documento: 'Un documento', justificante: 'Un justificante' };

// ---------------------------------------------------------------------------
// Esquemas (se compilan una sola vez)
// ---------------------------------------------------------------------------

let validatorsPromise;

function getValidators() {
  validatorsPromise ??= (async () => {
    const ajv = new Ajv2020({ strict: true, allErrors: true });
    addFormats(ajv);
    const validators = {};
    for (const name of ['curso', 'sitio', 'reto']) {
      const schema = JSON.parse(await fs.readFile(path.join(SCHEMAS_DIR, `${name}.schema.json`), 'utf8'));
      validators[name] = ajv.compile(schema);
    }
    return validators;
  })();
  return validatorsPromise;
}

// ---------------------------------------------------------------------------
// Ayudas
// ---------------------------------------------------------------------------

const isEmpty = (v) => v === undefined || v === null || v === '';
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

function isRealDate(v) {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function pointerToSegments(pointer) {
  return pointer
    .split('/')
    .slice(1)
    .map((s) => s.replaceAll('~1', '/').replaceAll('~0', '~'));
}

function segmentsToField(segments) {
  let out = '';
  for (const seg of segments) {
    if (/^\d+$/.test(seg)) out += `[${seg}]`;
    else out += out ? `.${seg}` : seg;
  }
  return out;
}

function valueAt(data, segments) {
  let current = data;
  for (const seg of segments) {
    if (current === null || typeof current !== 'object') return undefined;
    current = current[seg];
  }
  return current;
}

// ---------------------------------------------------------------------------
// Traducción de los errores de Ajv (nunca se compara su texto en inglés)
// ---------------------------------------------------------------------------

// Devuelve { field, message, priority } o null si el error se ignora.
function translateError(err, data) {
  const { keyword, params, instancePath, schemaPath } = err;
  if (keyword === 'if' || keyword === 'anyOf') return null;
  // Rama «vacío» de los anyOf de «vacío o valor».
  if (keyword === 'enum' && schemaPath.endsWith('#/$defs/vacio/enum')) return null;

  const segments = pointerToSegments(instancePath);
  const field = (extra) => segmentsToField(extra === undefined ? segments : [...segments, extra]);
  const named = (message, priority = 1, extra) => ({ field: field(extra), message, priority });

  switch (keyword) {
    case 'required':
      return named('Falta este dato, que es obligatorio.', 1, params.missingProperty);
    case 'additionalProperties':
      return named('Este dato no existe en el formato. Bórralo o revisa cómo está escrito.', 1, params.additionalProperty);
    case 'type': {
      if (segments.length === 0) return named('El fichero no tiene el formato esperado.');
      const byType = {
        string: 'Escribe un texto.',
        array: 'Debe ser una lista.',
        object: 'Debe ser un grupo de datos.',
        boolean: 'Elige Sí o No.',
      };
      return named(byType[params.type] ?? 'El valor no tiene el formato esperado.');
    }
    case 'enum':
      return named(`Elige uno de estos valores: ${params.allowedValues.join(', ')}.`);
    case 'maxLength':
      return named(`El texto es demasiado largo: máximo ${params.limit} caracteres.`);
    case 'minLength':
      return named(params.limit <= 1 ? 'No puede quedar vacío.' : `Escribe al menos ${params.limit} caracteres.`);
    case 'format':
      return named('Escribe una fecha que exista, así: 2026-11-16.');
    case 'minItems':
      if (segments.at(-1) === 'meses') return named('Debe haber exactamente 9 meses, de octubre a junio, en ese orden y sin repetir.');
      if (segments.at(-1) === 'fuentes') return named('Añade al menos una fuente.');
      return named(`Añade al menos ${params.limit} elementos.`);
    case 'maxItems':
      if (segments.at(-1) === 'meses') return named('Debe haber exactamente 9 meses, de octubre a junio, en ese orden y sin repetir.');
      return named(`Hay demasiados elementos: el máximo es ${params.limit}.`);
    case 'pattern': {
      if (params.pattern === '\\S') return named('No puede quedar vacío.');
      // Regla M7: la rama «then» del segundo allOf del material.
      if (schemaPath.includes('/allOf/1/then/')) {
        const tipo = valueAt(data, segments.slice(0, -1))?.tipo;
        const who = M7_ARTICLES[tipo] ?? 'Este material';
        return named(`${who} solo puede ser PDF. PNG y JPG solo para carteles e infografías.`, 3);
      }
      if (PATTERN_MESSAGES.has(params.pattern)) return named(PATTERN_MESSAGES.get(params.pattern), 3);
      if (segments.at(-1) === 'archivo') return named(FILE_PATTERN_MESSAGE, 3);
      return named('El texto no tiene el formato esperado.');
    }
    default:
      return named('El valor no es correcto.');
  }
}

// Un error por campo: gana el más específico (mayor prioridad); a igualdad, el primero.
function translateAll(ajvErrors, data) {
  const byField = new Map();
  for (const err of ajvErrors ?? []) {
    const t = translateError(err, data);
    if (!t) continue;
    const previous = byField.get(t.field);
    if (!previous || t.priority > previous.priority) byField.set(t.field, t);
  }
  return [...byField.values()];
}

// ---------------------------------------------------------------------------
// Lectura de ficheros
// ---------------------------------------------------------------------------

// Devuelve { data } o { problem } (mensaje en español si no se puede leer).
async function readYaml(file) {
  let text;
  try {
    text = await fs.readFile(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return { problem: 'Falta el fichero.' };
    return { problem: 'No se puede leer el fichero.' };
  }
  try {
    return { data: parse(text) };
  } catch {
    return { problem: 'El fichero no se puede leer: revisa que el texto tenga el formato correcto.' };
  }
}

async function listRetos(contentDir) {
  try {
    const names = await fs.readdir(path.join(contentDir, 'retos'));
    return names.filter((n) => n.endsWith('.yml')).sort().map((n) => `retos/${n}`);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Validación
// ---------------------------------------------------------------------------

export async function validateContent(contentDir) {
  const validators = await getValidators();
  const errors = [];
  const seen = new Set();
  const schemaFields = new Map(); // file -> campos con error de esquema
  const parsed = new Map(); // file -> datos leídos
  const files = ['curso.yml', 'sitio.yml', ...(await listRetos(contentDir))];

  const add = (file, field, message) => {
    const key = `${file}|${field}`;
    if (seen.has(key)) return;
    seen.add(key);
    errors.push({ file, field, message });
  };
  const hasSchemaError = (file, field) =>
    [...(schemaFields.get(file) ?? [])].some((f) => f === field || f.startsWith(`${field}.`) || f.startsWith(`${field}[`));

  // 1. Lectura y esquema.
  for (const file of files) {
    const kind = file === 'curso.yml' ? 'curso' : file === 'sitio.yml' ? 'sitio' : 'reto';
    const result = await readYaml(path.join(contentDir, file));
    if (result.problem) {
      add(file, '', result.problem);
      continue;
    }
    parsed.set(file, result.data);
    const validate = validators[kind];
    validate(result.data);
    const translated = translateAll(validate.errors, result.data);
    schemaFields.set(file, new Set(translated.map((t) => t.field)));
    for (const t of translated) add(file, t.field, t.message);
  }

  const curso = parsed.get('curso.yml');
  const retoFiles = files.filter((f) => f.startsWith('retos/') && parsed.has(f) && isObject(parsed.get(f)));

  // 2. Reglas de curso.yml.
  if (isObject(curso)) {
    if (!hasSchemaError('curso.yml', 'curso') && typeof curso.curso === 'string') {
      const [first, second] = curso.curso.split('-').map(Number);
      if (second !== first + 1) add('curso.yml', 'curso', 'El segundo año debe ser el primero más uno, por ejemplo 2026-2027.');
    }

    const meses = curso.meses;
    if (
      Array.isArray(meses) &&
      !hasSchemaError('curso.yml', 'meses') &&
      meses.every((m) => isObject(m) && MONTHS.includes(m.mes)) &&
      meses.map((m) => m.mes).join() !== MONTHS.join()
    ) {
      add('curso.yml', 'meses', 'Debe haber exactamente 9 meses, de octubre a junio, en ese orden y sin repetir.');
    }

    if (!isEmpty(curso.en_curso) && !hasSchemaError('curso.yml', 'en_curso') && typeof curso.en_curso === 'string') {
      const relative = curso.en_curso.replace(/^content\//, '');
      const target = path.resolve(contentDir, relative);
      let exists = false;
      try {
        exists = (await fs.stat(target)).isFile();
      } catch {
        exists = false;
      }
      if (!exists) {
        add('curso.yml', 'en_curso', 'El reto indicado no existe. Elige uno de los que hay.');
      } else if (parsed.has(relative) && isObject(parsed.get(relative))) {
        const reto = parsed.get(relative);
        // Solo se comprueban los datos del reto que ya pasan su esquema.
        if (!hasSchemaError(relative, 'curso') && reto.curso !== curso.curso) {
          add('curso.yml', 'en_curso', 'El reto en curso debe ser del mismo curso que el calendario.');
        } else if (!hasSchemaError(relative, 'estado') && reto.estado !== 'publicado') add('curso.yml', 'en_curso', 'El reto en curso debe estar publicado.');
      }
    }
  }

  // 3. Reglas entre ficheros de retos.
  const firstByCursoMes = new Map();
  for (const file of retoFiles) {
    const reto = parsed.get(file);
    if (hasSchemaError(file, 'curso') || hasSchemaError(file, 'mes')) continue;
    if (typeof reto.curso !== 'string' || typeof reto.mes !== 'string') continue;
    const key = `${reto.curso}|${reto.mes}`;
    if (firstByCursoMes.has(key)) {
      add(file, 'mes', `Ya hay otro reto de este mes en este curso: ${firstByCursoMes.get(key)}.`);
    } else {
      firstByCursoMes.set(key, file);
    }
  }

  if (isObject(curso) && Array.isArray(curso.meses)) {
    for (const file of retoFiles) {
      const reto = parsed.get(file);
      if (reto.estado !== 'publicado' || reto.curso !== curso.curso || hasSchemaError(file, 'mes')) continue;
      const index = curso.meses.findIndex((m) => isObject(m) && m.mes === reto.mes);
      if (index === -1) continue;
      const tema = curso.meses[index].tema;
      if (isEmpty(tema) || (typeof tema === 'string' && tema.trim() === '')) {
        add('curso.yml', `meses[${index}].tema`, `Escribe el tema de este mes: el reto ${file} está publicado y lo necesita.`);
      }
    }
  }

  // 4. Reglas dentro de cada reto.
  const materialsRoot = path.resolve(contentDir, 'materiales');
  for (const file of retoFiles) {
    const reto = parsed.get(file);

    for (const section of SECTIONS) {
      const block = reto[section];
      if (!isObject(block)) continue;

      const { desde, hasta } = block;
      const fromOk = isRealDate(desde) && !hasSchemaError(file, `${section}.desde`);
      const toOk = isRealDate(hasta) && !hasSchemaError(file, `${section}.hasta`);
      if (fromOk && isEmpty(hasta)) add(file, `${section}.hasta`, 'Rellena las dos fechas o deja las dos vacías.');
      else if (toOk && isEmpty(desde)) add(file, `${section}.desde`, 'Rellena las dos fechas o deja las dos vacías.');
      else if (fromOk && toOk && hasta < desde) add(file, `${section}.hasta`, 'La fecha final no puede ser anterior a la inicial.');

      if (Array.isArray(block.materiales)) {
        for (const [i, material] of block.materiales.entries()) {
          const field = `${section}.materiales[${i}].archivo`;
          if (!isObject(material) || isEmpty(material.archivo) || typeof material.archivo !== 'string') continue;
          if (hasSchemaError(file, field)) continue;
          await checkMaterialFile(file, field, material.archivo);
        }
      }
    }

    const motriz = reto.motriz;
    if (
      isObject(motriz) &&
      isRealDate(motriz.fecha) &&
      !hasSchemaError(file, 'motriz.fecha') &&
      !hasSchemaError(file, 'curso') &&
      typeof reto.curso === 'string'
    ) {
      const [first, second] = reto.curso.split('-');
      if (motriz.fecha < `${first}-09-01` || motriz.fecha > `${second}-06-30`) {
        add(file, 'motriz.fecha', `La fecha debe estar dentro del curso: del 1 de septiembre de ${first} al 30 de junio de ${second}.`);
      }
    }
  }

  async function checkMaterialFile(file, field, archivo) {
    if (archivo.includes('..')) {
      add(file, field, 'La ruta no puede contener ..');
      return;
    }
    const resolved = path.resolve(materialsRoot, archivo.slice('/materiales/'.length));
    if (!resolved.startsWith(materialsRoot + path.sep)) {
      add(file, field, 'La ruta debe quedarse dentro de la carpeta de materiales.');
      return;
    }
    let stat;
    try {
      stat = await fs.stat(resolved);
    } catch {
      stat = null;
    }
    if (!stat || !stat.isFile()) {
      add(file, field, 'No se encuentra el archivo. Súbelo a la carpeta de materiales o corrige la ruta.');
    } else if (stat.size > MAX_FILE_BYTES) {
      add(file, field, 'El archivo pesa más de 10 MB. Reduce su tamaño.');
    }
  }

  const order = new Map(files.map((f, i) => [f, i]));
  errors.sort((a, b) => order.get(a.file) - order.get(b.file));
  return { errors };
}

// ---------------------------------------------------------------------------
// Orden de terminal
// ---------------------------------------------------------------------------

if (import.meta.main) {
  const { errors } = await validateContent(process.env.CONTENT_DIR || 'content');
  if (errors.length > 0) {
    for (const e of errors) console.error(`${e.file} · ${e.field}: ${e.message}`);
    process.exitCode = 1;
  } else {
    console.log('Contenido correcto');
  }
}
