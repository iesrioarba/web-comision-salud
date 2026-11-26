import {
  formatDate,
  formatTime,
  formatFileType,
  formatFileSize,
  formatWeekRange,
  yearForMonth,
  toParagraphs,
} from './src/lib/format.js';

// Carpeta del contenido (la misma que usa src/_data/site.js).
const contentDir = process.env.CONTENT_DIR || 'content';

export default function (eleventyConfig) {
  // Escape automático: Eleventy usa las opciones por defecto de Nunjucks
  // (autoescape: true). No se llama a setNunjucksEnvironmentOptions ni a
  // setLibrary porque sustituirían ese objeto. Nunca se usa `| safe` con
  // texto de la comisión; solo con `content` en el layout, que es el HTML
  // de la página ya generado por Eleventy.
  // Fuentes:
  // https://www.11ty.dev/docs/languages/nunjucks/#nunjucks-environment-options
  // https://mozilla.github.io/nunjucks/api.html#configure

  // Materiales descargables y hoja de estilos, tal cual.
  eleventyConfig.addPassthroughCopy({ [`${contentDir}/materiales`]: 'materiales' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/css': 'assets/css' });

  // Funciones de formato de src/lib/format.js, con su mismo nombre.
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('formatTime', formatTime);
  eleventyConfig.addFilter('formatFileType', formatFileType);
  eleventyConfig.addFilter('formatFileSize', formatFileSize);
  eleventyConfig.addFilter('formatWeekRange', formatWeekRange);
  eleventyConfig.addFilter('yearForMonth', yearForMonth);
  eleventyConfig.addFilter('toParagraphs', toParagraphs);
}

export const config = {
  dir: {
    input: 'src',
    output: process.env.OUTPUT_DIR || '_site',
  },
};
