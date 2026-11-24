// Formato en español de fechas, horas, archivos y textos (N8).
// Solo usa Intl: sin dependencias.

const NBSP = String.fromCodePoint(0x00a0);
const NNBSP = String.fromCodePoint(0x202f);
const NON_STANDARD_SPACES = new RegExp(`[${NBSP}${NNBSP}]`, 'g');

const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const FIRST_YEAR_MONTHS = ['octubre', 'noviembre', 'diciembre'];

/**
 * Formatea una fecha de calendario 'YYYY-MM-DD' en español largo.
 * Se trata como fecha de calendario (UTC), así que no depende de la zona
 * horaria de la máquina. Si Intl usara U+00A0 o U+202F, se sustituyen por un
 * espacio normal. Ejemplo: '2026-10-09' -> 'viernes, 9 de octubre de 2026'.
 * Una fecha con formato distinto de 'YYYY-MM-DD' o inexistente (p. ej.
 * 2026-02-30) lanza RangeError.
 * @param {string} isoDate Fecha 'YYYY-MM-DD'.
 * @returns {string}
 */
export function formatDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate));
  if (!match) {
    throw new RangeError(`Fecha no válida: ${isoDate}`);
  }
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`Fecha no válida: ${isoDate}`);
  }
  return DATE_FORMAT.format(date).replace(NON_STANDARD_SPACES, ' ');
}

/**
 * Devuelve la hora tal cual viene ('HH:MM'), sin conversiones.
 * Ejemplo: '11:30' -> '11:30'.
 * @param {string} hhmm Hora 'HH:MM'.
 * @returns {string}
 */
export function formatTime(hhmm) {
  return String(hhmm);
}

/**
 * Nombre legible del tipo de archivo según la extensión de la ruta, sin
 * distinguir mayúsculas. pdf -> 'PDF'; png -> 'Imagen PNG'; jpg y jpeg ->
 * 'Imagen JPG'. Extensión desconocida: la extensión en mayúsculas (p. ej.
 * 'DOCX'). Ruta sin extensión: 'Archivo'.
 * @param {string} archivo Ruta del archivo, como en el campo `archivo`.
 * @returns {string}
 */
export function formatFileType(archivo) {
  const name = String(archivo).split('/').pop();
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || dot === name.length - 1) {
    return 'Archivo';
  }
  const extension = name.slice(dot + 1).toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'png':
      return 'Imagen PNG';
    case 'jpg':
    case 'jpeg':
      return 'Imagen JPG';
    default:
      return extension.toUpperCase();
  }
}

/**
 * Tamaño de archivo legible, base 1024. Por debajo de 1 MB (1048576 bytes):
 * KB redondeados a entero, con un mínimo de 1 KB (también para 0 bytes).
 * Desde 1 MB: MB con un decimal siempre y coma decimal ('1,0 MB', '1,2 MB').
 * El texto se construye a mano con un espacio normal (U+0020). Borde: si los
 * KB redondeados llegan a 1024 (p. ej. 1048500 bytes), se muestra en MB
 * ('1,0 MB') para no escribir '1024 KB'. Un valor negativo o no numérico
 * lanza RangeError.
 * @param {number} bytes Tamaño en bytes.
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError(`Tamaño no válido: ${bytes}`);
  }
  const kilobytes = Math.max(1, Math.round(bytes / 1024));
  if (kilobytes < 1024) {
    return `${kilobytes} KB`;
  }
  const megabytes = (bytes / 1048576).toFixed(1).replace('.', ',');
  return `${megabytes} MB`;
}

/**
 * Rango de semana con el mismo formato de fecha que formatDate. Ejemplo:
 * 'del lunes, 12 de octubre de 2026 al viernes, 23 de octubre de 2026'.
 * No comprueba que `desde` sea anterior a `hasta`.
 * @param {string} desde Fecha inicial 'YYYY-MM-DD'.
 * @param {string} hasta Fecha final 'YYYY-MM-DD'.
 * @returns {string}
 */
export function formatWeekRange(desde, hasta) {
  return `del ${formatDate(desde)} al ${formatDate(hasta)}`;
}

/**
 * Año natural de un mes dentro de un curso 'AAAA-AAAA'. Octubre, noviembre y
 * diciembre son el primer año; cualquier otro valor (enero a junio en el
 * esquema) es el segundo. Ejemplo: ('2026-2027', 'enero') -> 2027.
 * @param {string} curso Curso 'AAAA-AAAA'.
 * @param {string} mes Mes del esquema, en minúsculas.
 * @returns {number}
 */
export function yearForMonth(curso, mes) {
  const [firstYear, secondYear] = String(curso).split('-').map(Number);
  return FIRST_YEAR_MONTHS.includes(mes) ? firstYear : secondYear;
}

/**
 * Divide un texto en párrafos separados por una o más líneas en blanco (las
 * líneas con solo espacios o tabuladores cuentan como en blanco). Cada
 * párrafo se recorta y no se devuelven vacíos. Un salto de línea simple dentro
 * de un párrafo se conserva tal cual.
 * @param {string} text Texto con líneas en blanco entre párrafos.
 * @returns {string[]}
 */
export function toParagraphs(text) {
  return String(text)
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== '');
}
