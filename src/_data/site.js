// Datos del sitio para las plantillas: quedan en `site` (nombre del fichero).
import { loadSite } from '../lib/content.js';

export default function () {
  return loadSite(process.env.CONTENT_DIR || 'content');
}
