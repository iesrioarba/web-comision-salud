# 0017 · Páginas legales: formato, datos pendientes y comprobación de FR-023

- Fecha: 2026-11-19
- Estado: aceptada

## Contexto
La funcionalidad 002 (`specs/002-paginas-legales/spec.md`) añade la declaración de
accesibilidad, el aviso legal y la información de privacidad. Ya está decidido que usan
la pila de la 001 (Eleventy, nginx, mismas comprobaciones) y que NO se editan desde el
panel: las cambia quien mantiene la web o su suplente con rama y PR, también desde la
web de GitHub (FR-024, FR-026). Muchos datos legales aún no se conocen y deben verse como
«Pendiente de confirmar» (FR-022), con tres excepciones que bloquean (FR-023): canal de
accesibilidad antes de publicar; responsable y base legal antes de dar acceso al panel;
nada pendiente en el estreno.

## Decisión
- Los textos van en Markdown, un fichero por página, en `src/legal/`
  (`declaracion-accesibilidad.md`, `aviso-legal.md`, `privacidad.md`), con front matter
  (`title`, `permalink`, `actualizado`). Rutas `/accesibilidad/`, `/aviso-legal/`,
  `/privacidad/`.
- Los datos del centro, del tratamiento y de la declaración van en un único
  `src/legal/datos.yml`, validado con `schemas/legal.schema.json` (`yaml` y `ajv`, ya
  fijadas en el ADR 0008; Markdown con el `markdown-it` incluido en Eleventy 3). Sin
  dependencias nuevas.
- Un dato desconocido vale `null`; el filtro `pendiente` lo muestra como «Pendiente de
  confirmar». El esquema prohíbe la cadena vacía y escribir «pendiente» a mano.
- `scripts/check-legal.js` (`npm run comprobar:legal`): en «comprobar», esquema y canal
  de accesibilidad obligatorio (bloquea); `--panel`, requisito previo de T040 de la 001;
  `--estreno`, ningún dato pendiente, que además se aplica solo cuando la web compilada
  ya no lleva `noindex` (ADR 0016).
- Los ficheros quedan fuera de `content/` y de `.pages.yml`, así que el control de
  commits de la app (ADR 0005) impide que el panel los cambie.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Markdown + un YAML de datos** (elegida) | Dos tipos de fichero; la guía explica cuál tocar | Se puede romper una variable `{{ … }}` al editar; lo detectan la compilación y las pruebas |
| Todo en YAML con plantillas Nunjucks | Estructura garantizada | Prosa larga en YAML, difícil de editar en el navegador; errores de sangría |
| Todo en Markdown, sin YAML | Lo más simple de editar | Datos repetidos; FR-023 no se puede comprobar de forma automática |
| En `content/` y editable desde el panel | Edición cómoda para la comisión | Contradice FR-024 (decisión tomada) |

## Consecuencias
- Integrar la 002 exige conocer ya el canal de contacto de accesibilidad: sin él,
  «comprobar» falla y la 002 no se integra, y por tanto T023 de la 001 tampoco (FR-023).
- Invitar a alguien al panel exige `npm run comprobar:legal -- --panel` en verde y la
  página de privacidad publicada.
- El estreno no puede publicarse con datos pendientes aunque se olvide la orden.
- Si un día se quiere que la comisión edite estas páginas, hace falta otra
  especificación y otro ADR.
