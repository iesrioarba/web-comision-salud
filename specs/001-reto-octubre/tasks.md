---

description: "Lista de tareas de 001-reto-octubre (el reto del mes)"
---

# Tasks: El reto del mes (con el reto de octubre como ejemplo)

**Input**: Design documents from `/specs/001-reto-octubre/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

> Borrador del subagente `planificador` (fase 5, 2026-11-19), corregido el mismo día con
> las decisiones de Michel (ramas por grupo, permisos mínimos de la GitHub App,
> lanzamiento sin anunciar y huecos N5 a N13) y, después, con los hallazgos de
> `/speckit-analyze` (C1, H1, M1 a M5, L1 a L3) y sus decisiones. No está aprobado:
> necesita el visto bueno de Michel antes de la fase 6.

**Tests**: sí. La constitución (principio VII), el ADR 0014 y AGENTS.md («primero la
prueba o la comprobación; luego el código») las exigen. Las pruebas se escriben primero y
DEBEN fallar antes de implementar, dentro de la misma rama (ver «Ramas y commits»).

**Organization**: tareas agrupadas por historia de usuario. Orden pedido por Michel:
común (setup y fundacional) → US1 y US2 (P1) con el contenido escrito a mano en
`content/` → diseño visual (BLOQUEADO) → despliegue de la web → panel (US3) → US4, US5 →
cierre.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: la rama de esa tarea (o de su grupo) se puede hacer en paralelo con otras
  ramas: ficheros distintos y sin dependencias pendientes. En un grupo, el [P] va solo en
  la primera tarea y vale para la rama entera; dentro del grupo el orden es secuencial.
- **[Story]**: historia de usuario (US1…US5).
- **[MANUAL · Michel]**: lleva secretos o cuentas. NO la hace el implementador. La tarea
  describe pasos y comprobación; ningún secreto se escribe en el repositorio, en
  `tasks.md`, en los registros ni en los mensajes.
- **[BLOQUEADA]**: no se empieza hasta que se cumpla la condición indicada.
- **(comprobación manual)**: la hace una persona; no lleva secretos.

Cada tarea indica: **Rama**, **Depende de**, **Ficheros**, **Hecho cuando** (criterio
comprobable) y **Comprobación** (la prueba o la orden que lo demuestra). Al terminar cada
rama, además: `npm run validar` y las comprobaciones de AGENTS.md en verde, `ESTADO.md`
actualizado y las tareas marcadas aquí (AGENTS.md, «Cómo se trabaja una tarea»).

**Revisión independiente antes de integrar (principio VII)**: al cierre de cada rama,
Michel revisa el diff y lo anota en la PR. Además, el subagente `revisor` revisa:
- en los puntos de control (MVP y cierre de cada historia), y
- en las PR que tocan `.github/workflows/`, `nginx/`, el control de commits de la app o el
  correo de aviso (T002, rama T013+T014, rama T022+T023, rama T031+T032, rama T033+T034).
Sus hallazgos se corrigen en la misma rama antes de integrar.

## Ramas y commits

- Ramas con tres cifras: `tarea/001-TNNN-descripcion` (decisión N13).
- **Pruebas e implementación van en la misma rama y la misma pull request**: una PR con
  pruebas en rojo no se puede integrar. Grupos con rama común:

  | Grupo | Rama |
  |---|---|
  | T005 + T008 | `tarea/001-T005-formato` |
  | T006 + T009 | `tarea/001-T006-validador` |
  | T007 + T010 | `tarea/001-T007-capa-de-datos` |
  | T013 + T014 | `tarea/001-T013-comprobaciones` |
  | T015 + T016 + T017 | `tarea/001-T015-reto-del-mes` |
  | T018 + T019 | `tarea/001-T018-materiales` |
  | T022 + T023 | `tarea/001-T022-imagen-y-nginx` |
  | T025 + T027 | `tarea/001-T025-pages-yml` |
  | T031 + T032 | `tarea/001-T031-control-commits-app` |
  | T033 + T034 | `tarea/001-T033-correo-aviso` |
  | T042 + T043 + T044 | `tarea/001-T042-calendario` |
  | T045 + T046 | `tarea/001-T045-enlace-genially` |

  Las demás tareas de código tienen su propia rama. El grupo T013 + T014 no es de
  pruebas e implementación: va junto porque T013 cambia `validar` a `_site/**` y, sin
  la compilación que añade T014 a Actions, la PR saldría en rojo (hallazgo H1).
- Dentro de cada rama de grupo de pruebas e implementación: **primer commit** con las
  pruebas, comprobadas en rojo en local; **después**, la implementación; la PR se abre
  con todo en verde.
- **Commits (decisión N12)**: el implementador no hace commits. Michel revisa el diff y
  hace el commit, el push y la PR. «Primer commit» significa que el implementador deja
  las pruebas en rojo listas, Michel las confirma y hace ese commit, y después el
  implementador sigue con la implementación. Ya está recogido en AGENTS.md.
- **Ramas de ensayo** (`ensayo/h16` en T024 y `ensayo/panel` en T030): se borran al
  acabar. Es una excepción a «no borres ramas remotas» que autoriza Michel y que la
  sesión principal escribe en AGENTS.md (hallazgo M2).
- Las ramas `tarea/…` no lanzan Actions al hacer push (el flujo solo escucha `push` a
  `main` y `pull_request`), así que el commit en rojo no se ve en Actions; la PR se
  comprueba con el último commit.

## Path Conventions

Proyecto único en la raíz del repositorio (plan.md, «Project Structure»): `content/` (lo
edita la comisión), `schemas/`, `scripts/`, `src/`, `tests/unit/`, `tests/e2e/`,
`tests/fixtures/`, `nginx/`, `.pages.yml`, `docs/`.

Convenciones confirmadas por Michel (N7 a N9):
- `CONTENT_DIR`: carpeta de contenido (por defecto `content`), ya prevista en el plan.
- `OUTPUT_DIR`: carpeta de salida de Eleventy (por defecto `_site`). Las fixtures se
  compilan a `_site-fixtures/<nombre>/`.
- Fixtures (contenido INVENTADO y evidente): `tests/fixtures/completo/`,
  `tests/fixtures/pendientes/`, `tests/fixtures/sin-reto-en-curso/` y
  `tests/fixtures/sin-reto-ni-anuncio/`, cada una con la misma forma que `content/`.
- Formatos (N8): tamaño en base 1024, KB sin decimales y MB con un decimal y coma
  («850 KB», «1,2 MB»); fechas de las semanas «del <fecha desde> al <fecha hasta>» con el
  formato largo («del lunes, 12 de octubre de 2026 al viernes, 23 de octubre de 2026»);
  `h1` de la página de un reto «Reto de <mes> de <año>: <tema>»; títulos de página
  «Inicio», «Reto de <mes> <curso>», «Calendario del curso <curso>» y «Página no
  encontrada», seguidos de « · Comisión de Salud · IES Río Arba».
- Navegación (N9): `nav` con «Inicio» y «Calendario»; pie mínimo.
- Hasta el estreno (N6, ADR 0016 «Lanzamiento sin anunciar»): todas las páginas llevan
  `<meta name="robots" content="noindex">` (T012) y nginx envía la cabecera
  `X-Robots-Tag: noindex` (T023, hallazgo L3); la dirección no se anuncia; T050 quita
  las dos como último paso.
- Materiales (M7): PNG y JPG solo en materiales de tipo `cartel` o `infografia`; los de
  tipo `documento`, `ficha` y `justificante`, solo PDF. Lo impone el validador; el panel
  no puede restringir la extensión según el tipo (contracts/panel-pages-cms.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Node 26, dependencias fijadas y flujo de Actions al día.

- [x] T001 Fijar Node 26.13.1 y las dependencias del plan en `package.json`, `package-lock.json`, `.nvmrc` y `.gitignore`
  - **Rama**: `tarea/001-T001-node-y-dependencias` · **Depende de**: —
  - **Objetivo**: dejar el proyecto con las versiones exactas de research.md (tabla de versiones) y ADR 0006, 0007, 0008, 0013 y 0014.
  - **Ficheros**: `.nvmrc` (`26.13.1`), `package.json` (`"type": "module"`, `engines.node` con 26.13.1, `dependencies`: `@11ty/eleventy` 3.1.8, `yaml` 2.9.1, `ajv` 8.20.0, `ajv-formats` 3.0.1; `devDependencies`: `html-validate` 11.21.1, `linkinator` 8.1.0, `@playwright/test` 1.65.1, `@axe-core/playwright` 4.14.0, `@lhci/cli` 0.16.1; todas sin `^` ni `~`), `package-lock.json`, `.gitignore` (añade `_site/`, `_site-fixtures/`, `test-results/`, `playwright-report/`, `.lighthouseci/`).
  - **Antes de instalar**: comprobar en el registro de npm que cada versión sigue siendo la última estable (`/latest`). Si alguna ha cambiado desde el 2026-11-11, PARAR y avisar: hay que leer las notas y actualizar su ADR (AGENTS.md, «Mantenibilidad»). No tocar el script `validar` ni `site/` en esta tarea.
  - **Hecho cuando**: `npm ci` termina sin errores con Node 26.13.1 y `package.json` no tiene rangos.
  - **Comprobación**: `node --version` → `v26.13.1`; `npm ci` (código 0); `npm ls --depth=0` muestra las 9 versiones exactas; `grep -E '"[\^~][0-9]' package.json` no devuelve nada; `npm run validar` sigue en verde (aún valida `site/`).

- [x] T002 Pasar el flujo `.github/workflows/despliegue.yml` a Node 26 y fijar las versiones de `actions/checkout`, `actions/setup-node` y `actions/upload-artifact` (H18, N11)
  - **Rama**: `tarea/001-T002-actions-node-26` · **Depende de**: T001
  - **Objetivo**: ADR 0007 («`.github/workflows/despliegue.yml` pasa a Node 26») y decisión N11 (`actions/upload-artifact` es una acción oficial de GitHub; se fija y se anota aquí para usarla en T014).
  - **Ficheros**: `.github/workflows/despliegue.yml` (solo `node-version-file: .nvmrc` en lugar de `node-version: 22`, y la versión de `checkout` y `setup-node`; `upload-artifact` aún no se usa). Propuesta de actualización en `docs/decisiones/0007-compilacion-y-servidor.md` con las versiones de las tres acciones y sus fuentes, que confirma Michel.
  - **Hecho cuando**: las tres acciones tienen su última versión estable comprobada en su página de versiones de GitHub (fuente anotada, notas leídas buscando cambios incompatibles) y el flujo usa Node 26.13.1.
  - **Comprobación**: el flujo «Comprobar y desplegar» de la PR de esta rama sale en verde y su registro muestra `Node.js v26.13.1`; la propuesta de ADR lista las tres versiones con su fuente.
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR (toca `.github/workflows/`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: esquemas, validador, capa de datos, contenido real de partida, esqueleto de
Eleventy y todas las comprobaciones automáticas en local y en Actions.

**⚠️ CRITICAL**: ninguna historia empieza hasta terminar esta fase.

- [ ] T003 [P] Copiar los contratos JSON Schema a `schemas/curso.schema.json`, `schemas/reto.schema.json` y `schemas/sitio.schema.json`
  - **Rama**: `tarea/001-T003-esquemas` · **Depende de**: T001
  - **Objetivo**: ADR 0008 («un JSON Schema por tipo de fichero, en `schemas/`, copia de `specs/001-reto-octubre/contracts/`»).
  - **Hecho cuando**: los tres ficheros son copia idéntica de `specs/001-reto-octubre/contracts/*.schema.json`.
  - **Comprobación**: `diff specs/001-reto-octubre/contracts/reto.schema.json schemas/reto.schema.json` (y los otros dos) sin diferencias. La compilación en modo estricto se prueba en T006.

- [ ] T004 [P] Crear el contenido inventado de pruebas en `tests/fixtures/completo/`, `tests/fixtures/pendientes/`, `tests/fixtures/sin-reto-en-curso/` y `tests/fixtures/sin-reto-ni-anuncio/`
  - **Rama**: `tarea/001-T004-fixtures` · **Depende de**: T001
  - **Objetivo**: cubrir los casos límite de la especificación sin tocar `content/` (ADR 0014). Cada carpeta tiene `curso.yml`, `sitio.yml`, `retos/*.yml` y, si hace falta, `materiales/`. Todo inventado y evidente («Reto de prueba inventado», «Patio de ejemplo», URLs `https://example.org/…`); ningún dato real de personas.
  - **Contenido mínimo**:
    - `completo`: un reto `publicado` y `en_curso` de `noviembre` con todos los campos (pasos, 2 fuentes con `url`, `desde`/`hasta` en los tres retos, motriz con fecha, hora y lugar, `adaptado_por_etapas: true`), un material de cada `tipo` con fichero pequeño (≤ 50 KB, inventados, en `materiales/2026-2027-noviembre/`: PDF para `documento`, `ficha` y `justificante`; PNG para el `cartel` y JPG para la `infografia`, para cubrir la regla M7), una infografía con `version_texto`, un texto con `<script>alert(1)</script>` y `<b>negrita</b>` dentro de una descripción (para la prueba de escape) y un reto `borrador` de `diciembre` incompleto y sin fuentes.
    - `pendientes`: reto `publicado` y `en_curso` con `motriz.descripcion`, `fecha`, `hora` y `lugar` vacíos en las tres formas aceptadas (`""`, `null` y ausente, research R1), `tutoria.nombre` y `familia.nombre` vacíos, materiales sin `archivo`, sin `desde`/`hasta`, y en `curso.yml` el `tema` de un mes SIN reto publicado vacío.
    - `sin-reto-en-curso`: `en_curso` vacío, `proximo_mes: enero`, retos `publicado` de `octubre` y `noviembre` (el último publicado es `noviembre`) y un `borrador`.
    - `sin-reto-ni-anuncio`: `en_curso` y `proximo_mes` vacíos y ningún reto publicado.
  - **Hecho cuando**: existen las cuatro carpetas con ese contenido y siguen los contratos de `specs/001-reto-octubre/contracts/` y `data-model.md`.
  - **Comprobación**: revisión de que no hay datos reales (`grep -ri '@' tests/fixtures` solo devuelve direcciones `example.org`); `du -k tests/fixtures/*/materiales/*/*` ≤ 50 por fichero. La validez se demuestra en el grupo T006 + T009 (las fixtures son los casos válidos).

- [ ] T005 [P] Escribir las pruebas unitarias del formato en español en `tests/unit/format.test.js` (en rojo)
  - **Rama**: `tarea/001-T005-formato` (grupo T005 + T008; primer commit) · **Depende de**: T001
  - **Objetivo**: fijar con `node:test` el comportamiento de `src/lib/format.js` (plan, «Source Code»): `Intl`, sin dependencias.
  - **Casos**: fecha `2026-10-09` → «viernes, 9 de octubre de 2026»; hora `11:30` → «11:30»; formato por extensión: `pdf` → «PDF», `png` → «Imagen PNG», `jpg`/`jpeg`/`JPG` → «Imagen JPG»; tamaño `870400` bytes → «850 KB» y `1258291` → «1,2 MB» (N8); rango de semana `2026-10-12`/`2026-10-23` → «del lunes, 12 de octubre de 2026 al viernes, 23 de octubre de 2026» (N8); año del mes dentro del curso (`2026-2027`: octubre a diciembre → 2026, enero a junio → 2027); texto en párrafos: un texto con líneas en blanco → lista de párrafos sin vacíos.
  - **Hecho cuando**: las pruebas existen y fallan porque `src/lib/format.js` no existe.
  - **Comprobación**: `node --test tests/unit/format.test.js` falla con «Cannot find module» (o equivalente), en local, antes del primer commit.

- [ ] T006 [P] Escribir las pruebas unitarias del validador en `tests/unit/validate-content.test.js` (en rojo)
  - **Rama**: `tarea/001-T006-validador` (grupo T006 + T009; primer commit) · **Depende de**: T003, T004
  - **Objetivo**: FR-014, ADR 0008 y quickstart A2. Interfaz que fijan las pruebas: `validateContent(contentDir)` de `scripts/validate-content.js` devuelve `{ errors: [{ file, field, message }] }`; como orden, imprime los errores y sale con código 1, o imprime «Contenido correcto» y sale con 0.
  - **Casos válidos**: las cuatro fixtures de T004; los tres esquemas compilan con `ajv` en modo estricto; un campo opcional `""`, `null` o ausente cuenta como vacío.
  - **Casos que DEBEN fallar** (cada uno con mensaje en español que dice fichero, campo y qué corregir; se generan copiando una fixture a una carpeta temporal y modificándola, sin añadir ficheros grandes al repositorio):
    - `curso`: no cumple `^\d{4}-\d{4}$` o «el segundo año es el primero + 1» no se cumple.
    - `meses`: no son «exactamente 9, en el orden de octubre a junio, sin repetir»; `tema` > 80.
    - `en_curso`: el fichero no existe, es de otro `curso` o su `estado` no es `publicado` (ADR 0011).
    - Reto: `mes` repetido en el mismo `curso` («único por `curso`»); `estado` fuera de `borrador`/`publicado`; `nombre` > 80; `objetivo` > 600; `descripcion` > 1 500; `pasos` con más de 10 o un paso > 200; `publicado` sin `fuentes` («≥ 1 si `publicado`»); `publicado` con el `tema` de su mes vacío; fuente con `titulo` > 200 o `url` que no empieza por `https://` o > 300.
    - Retos: `motriz.nombre` vacío en un `publicado`; `descripcion` > 1 200; solo uno de `desde`/`hasta` («las dos o ninguna»); `hasta` < `desde`; fecha imposible `2026-02-30`; más de 10 materiales.
    - Motriz: `fecha` fuera del curso («del 1 de septiembre del primer año al 30 de junio del segundo»); `hora` `25:00` (patrón `^([01]\d|2[0-3]):[0-5]\d$`) con el mensaje «Escribe la hora así: 11:30»; `lugar` > 120.
    - Material: `titulo` > 120; `tipo` o `destinatario` fuera de sus valores; `archivo` que no empieza por `/materiales/`, contiene `..`, no existe en `<CONTENT_DIR>/materiales/…`, tiene extensión distinta de `pdf`, `png`, `jpg`, `jpeg` (mayúsculas o minúsculas) o pesa más de 10 MB (el fichero de prueba se crea en la carpeta temporal con `fs.truncate`, no se versiona); infografía sin `version_texto` o con más de 3 000; una `ficha` (y también un `documento` y un `justificante`) con `archivo` `.png`, `.jpg` o `.JPEG` falla con el mensaje «En `<ruta>.archivo`: una ficha solo puede ser PDF. PNG y JPG solo para carteles e infografías.» (con el nombre del tipo que corresponda; M7). Caso válido: un `cartel` en PNG y una `infografia` en JPG pasan.
    - `sitio.yml`: `genially.nombre` vacío o > 80; `genially.url` sin `https://` o > 300.
    - Borrador incompleto sin fuentes: NO falla (ADR 0011).
  - **Hecho cuando**: las pruebas existen y fallan porque el validador no existe.
  - **Comprobación**: `node --test tests/unit/validate-content.test.js` falla por módulo inexistente, en local, antes del primer commit.

- [ ] T007 [P] Escribir las pruebas unitarias de los datos derivados en `tests/unit/content-data.test.js` (en rojo)
  - **Rama**: `tarea/001-T007-capa-de-datos` (grupo T007 + T010; primer commit) · **Depende de**: T004 y, para cerrar la rama, T008
  - **Objetivo**: fijar `loadSite(contentDir)` de `src/lib/content.js` según data-model.md («Derivado», «Fijo», «Relaciones», «Estados»).
  - **Casos**: solo se cargan retos `publicado` (el `borrador` no aparece en ninguna lista); `enCurso` es el reto de `en_curso` o nada; situación «en curso» / «no en curso» por reto; URL `/retos/<curso>/<mes>/`; calendario con 9 meses en orden, `tema` o vacío, y enlace solo si hay reto publicado; «último reto publicado» = el `publicado` cuyo mes va más tarde de octubre a junio (en `sin-reto-en-curso` es `noviembre`; en `sin-reto-ni-anuncio`, ninguno); `proximoMes` y su tema; nombre por defecto «Reto de tutoría» / «Reto en familia» si falta; textos fijos de semana y «Para quién» por tipo; por material: formato y tamaño derivados del fichero real (con `src/lib/format.js`), aviso de entrega si `tipo` es `ficha` o `justificante`, y «sin archivo» si `archivo` está vacío.
  - **Hecho cuando**: las pruebas existen y fallan porque `src/lib/content.js` no existe.
  - **Comprobación**: `node --test tests/unit/content-data.test.js` falla por módulo inexistente, en local, antes del primer commit.

- [ ] T008 Implementar el formato en español en `src/lib/format.js`
  - **Rama**: `tarea/001-T005-formato` (grupo T005 + T008; después del primer commit) · **Depende de**: T005
  - **Hecho cuando**: todas las pruebas de T005 pasan, sin dependencias nuevas (solo `Intl`).
  - **Comprobación**: `node --test tests/unit/format.test.js` en verde; PR del grupo en verde.

- [ ] T009 Implementar el validador en `scripts/validate-content.js` y el script `comprobar:contenido` en `package.json`
  - **Rama**: `tarea/001-T006-validador` (grupo T006 + T009; después del primer commit) · **Depende de**: T006
  - **Objetivo**: ADR 0008. Esquemas con `ajv` + `ajv-formats` (formato `date` completo) y reglas entre campos; traduce los mensajes de `ajv` a uno por campo en español, sin repetirlos por los `anyOf` (research R3). Lee `CONTENT_DIR` (por defecto `content`). Los mensajes de patrón coinciden con los del panel: «Escribe la hora así: 11:30», «Escribe el curso así: 2026-2027», «La dirección debe empezar por https://». La regla M7 (solo PDF salvo `cartel` e `infografia`) está en `schemas/reto.schema.json` (copia de T003) y su mensaje es el de T006.
  - **Hecho cuando**: todas las pruebas de T006 pasan.
  - **Comprobación**: `node --test tests/unit/validate-content.test.js` en verde; `CONTENT_DIR=tests/fixtures/completo npm run comprobar:contenido` sale con 0 y «Contenido correcto»; PR del grupo en verde.

- [ ] T010 Implementar la capa de datos en `src/lib/content.js` y `src/_data/site.js`
  - **Rama**: `tarea/001-T007-capa-de-datos` (grupo T007 + T010; después del primer commit) · **Depende de**: T007, T008
  - **Objetivo**: `src/lib/content.js` exporta `loadSite(contentDir)` (lee YAML con `yaml`, calcula los derivados); `src/_data/site.js` lo llama con `process.env.CONTENT_DIR || 'content'` para Eleventy.
  - **Hecho cuando**: todas las pruebas de T007 pasan.
  - **Comprobación**: `node --test tests/unit/content-data.test.js` en verde; PR del grupo en verde.

- [ ] T011 [P] Escribir a mano el contenido real de partida en `content/curso.yml`, `content/sitio.yml` y `content/retos/2026-2027-octubre.yml`
  - **Rama**: `tarea/001-T011-contenido-octubre` · **Depende de**: T009
  - **Objetivo**: los datos reales de octubre de spec.md, tal como están en `specs/001-reto-octubre/contracts/ejemplos/` (FR-005, FR-006). Lo pendiente de la comisión queda vacío (H7: descripción y lugar del motriz) y los materiales sin `archivo` (H8: no hay ficheros todavía). `content/materiales/2026-2027-octubre/` se crea vacío con un `.gitkeep`. La URL del Genially es la inventada del ejemplo (H6): ver T050.
  - **Hecho cuando**: los tres ficheros coinciden con los ejemplos (se pueden quitar los comentarios de HUECO, nunca los datos) y pasan la validación.
  - **Comprobación**: `npm run comprobar:contenido` sale con 0 y «Contenido correcto»; `diff` con los ejemplos solo muestra comentarios.

- [ ] T012 Montar el esqueleto de Eleventy en `eleventy.config.js`, `src/_includes/layouts/base.njk`, `src/assets/css/main.css`, `src/404.njk` y el script `build` de `package.json`
  - **Rama**: `tarea/001-T012-esqueleto-eleventy` · **Depende de**: T009, T010
  - **Objetivo**: ADR 0006 y contracts/paginas-web.md («Reglas comunes a todas las páginas»).
  - **Ficheros y reglas**:
    - `eleventy.config.js`: entrada `src/`, salida `process.env.OUTPUT_DIR || '_site'`, Nunjucks con escape automático (nunca `safe` con texto de la comisión), copia de `<CONTENT_DIR>/materiales/` a `<salida>/materiales/`, filtros de `src/lib/format.js`.
    - `package.json`: `"build": "node scripts/validate-content.js && eleventy"` (la validación es el primer paso, ADR 0008).
    - `base.njk`: `<html lang="es">`, `<meta charset="utf-8">`, `viewport`, `<meta name="robots" content="noindex">` hasta el estreno (N6, ADR 0016; lo quita T050), `<title>` único con la forma «<Página> · Comisión de Salud · IES Río Arba», `header`, `nav` con nombre accesible y los enlaces «Inicio» y «Calendario» (N9; el de «Calendario» se añade en T043 para no dejar un enlace roto), un `main`, `footer` mínimo, «Saltar al contenido» como primer elemento enfocable, sin JavaScript, sin recursos externos.
    - `main.css`: solo lo funcional (foco visible, clase de texto para lectores de pantalla, estilos de impresión que ocultan `nav` y `footer`). El diseño visual va en T020 y T021.
    - `src/404.njk` → `/404.html`: `h1` «Página no encontrada» y enlace «Volver al inicio».
    - NO se cambia aún el script `validar`, ni `site/`, ni el `Dockerfile` (los cambian T013 y T023).
  - **Hecho cuando**: compila con las fixtures y con `content/`, el HTML generado es válido y todas las páginas llevan el `noindex`.
  - **Comprobación**: `CONTENT_DIR=tests/fixtures/completo npm run build` genera `_site/404.html`; `npx html-validate "_site/**/*.html"` 0 errores; `grep -L '<meta name="robots" content="noindex">' $(find _site -name '*.html')` no devuelve ningún fichero; con una copia de `tests/fixtures/completo` en una carpeta temporal y `hora: "25:00"`, `CONTENT_DIR=<temporal> npm run build` sale con código distinto de 0 y el mensaje en español, sin llegar a Eleventy.

- [ ] T013 Crear los scripts de comprobación, sus configuraciones y la prueba común en navegador, y actualizar la sección «Comprobaciones» de `AGENTS.md`
  - **Rama**: `tarea/001-T013-comprobaciones` (grupo T013 + T014; ver «Ramas y commits», hallazgo H1) · **Depende de**: T002, T011, T012
  - **Objetivo**: ADR 0013 y 0014; plan, «Flujo de publicación y despliegue» (`npm run comprobar` = la misma secuencia que Actions). Decisión N10: esta tarea actualiza AGENTS.md.
  - **Ficheros**:
    - `package.json`: `test` (`node --test tests/unit/`), `build:fixtures` (compila cada carpeta de `tests/fixtures/` a `_site-fixtures/<nombre>/` con `CONTENT_DIR` y `OUTPUT_DIR`), `validar` (pasa de `site/**/*.html` a `_site/**/*.html` y `_site-fixtures/**/*.html`), `comprobar:enlaces`, `comprobar:web`, `comprobar:rendimiento` y `comprobar` (en este orden: `comprobar:contenido` → `test` → `build` → `build:fixtures` → `validar` → `comprobar:enlaces` → `comprobar:web` → `comprobar:rendimiento`; T022 añade `comprobar:cabeceras` al final).
    - `linkinator.config.json`: recorre `_site/` y `_site-fixtures/`, solo enlaces internos y materiales; omite los externos.
    - `scripts/serve-static.js`: servidor local mínimo con `node:http`, sin dependencias.
    - `playwright.config.js`: solo Chromium; un proyecto `real` (sirve `_site/`) y uno por fixture (sirve `_site-fixtures/<nombre>/`).
    - `tests/e2e/common.spec.js`: para CADA página HTML generada en cada proyecto: `lang="es"`, `<title>` termina en « · Comisión de Salud · IES Río Arba» y es único, un `h1`, encabezados sin saltos, `header`/`nav` con nombre/`main`/`footer`, primer Tab = «Saltar al contenido» y funciona, axe con `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y 0 infracciones, 0 cookies, 0 peticiones fuera de `localhost`, sin `iframe` ni `form` (FR-011, FR-022), sin `<script>` (objetivo 0 KB de JS, ADR 0013). No comprueba el `noindex` (para que T050 pueda quitarlo sin tocar esta prueba).
    - `lighthouserc.json`: `staticDistDir: "_site"`, `maxAutodiscoverUrls: 0` y `staticDirFileDiscoveryDepth: 3` (las páginas `/retos/<curso>/<mes>/` están a profundidad 3 y el valor por defecto es 2: <https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md>), `numberOfRuns: 3`, emulación móvil por defecto y las aserciones del ADR 0013 tal cual (LCP ≤ 2 500 ms, FCP ≤ 1 800 ms, CLS ≤ 0,1, TBT ≤ 200 ms, documento ≤ 30 KB, CSS ≤ 20 KB, JS ≤ 10 KB, 0 fuentes, imágenes ≤ 100 KB, total ≤ 150 KB, 0 terceros). Sin `lhci upload` a ningún servidor; informes en `.lighthouseci/` (en Actions se guardan como artefacto en T014).
    - `AGENTS.md`, sección «Comprobaciones»: sustituir «(Se añadirán aquí…)» por la lista de órdenes (`npm run comprobar` y cada script, con una línea de qué comprueba), el requisito `npx playwright install chromium`, y que las comprobaciones manuales de teclado, lector de pantalla y móvil están en `specs/001-reto-octubre/quickstart.md` (C). Se añadirá `comprobar:cabeceras` en T023.
  - **Hecho cuando**: `npm run comprobar` termina en verde en local con el esqueleto (solo existe `/404.html` en cada salida). La PR no se abre hasta terminar T014 en la misma rama.
  - **Comprobación**: `npm run comprobar` con código 0; salida de axe con 0 infracciones; Lighthouse cumple las aserciones; `git diff AGENTS.md` solo cambia la sección «Comprobaciones».

- [ ] T014 Ampliar el trabajo «comprobar» de `.github/workflows/despliegue.yml` con toda la secuencia
  - **Rama**: `tarea/001-T013-comprobaciones` (grupo T013 + T014) · **Depende de**: T013
  - **Objetivo**: principio VII y ADR 0014: «desplegar» solo si todo pasa (ya `needs: comprobar`).
  - **Hecho cuando**: «comprobar» ejecuta `npm ci`, `npx playwright install --with-deps chromium` y los mismos pasos que `npm run comprobar`, cada uno como paso con nombre en español, y guarda `.lighthouseci/` como artefacto con `actions/upload-artifact` en la versión fijada en T002 (también si falla). «desplegar» no cambia. El `Dockerfile` sigue copiando `site/` (la web publicada no cambia todavía).
  - **Comprobación**: la PR del grupo T013 + T014 sale en verde en Actions y el artefacto con los informes de Lighthouse aparece en la ejecución; en local, sin integrar, un `content/curso.yml` con `curso: "2026-2028"` hace fallar `npm run comprobar` en el paso de contenido con el mensaje en español (Actions ejecuta los mismos scripts). Aquí no se demuestra en Actions que el contenido roto bloquea el despliegue: eso se demuestra en T041 (D8), con un commit real del panel (hallazgo L7).
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR del grupo (toca `.github/workflows/`).

**Checkpoint**: base lista. Desde aquí, cada historia añade pruebas y plantillas.

---

## Phase 3: User Story 1 - Ver el reto del mes (Priority: P1) 🎯 MVP

**Goal**: en `/` y en `/retos/<curso>/<mes>/` se ve el reto del mes: tema, nombre,
objetivo, descripción, pasos, los tres retos con su semana, los datos del motriz y las
fuentes, con «Por confirmar» donde falte un dato.

**Independent Test**: con `content/` (octubre), una persona que no conoce el proyecto dice
el tema, los tres retos, la semana de cada uno y cuándo y dónde es el motriz (quickstart
B: US1-1 a US1-5).

**Rama del grupo**: `tarea/001-T015-reto-del-mes` (T015 + T016 + T017).

### Tests for User Story 1 ⚠️

- [ ] T015 [P] [US1] Escribir los escenarios del reto del mes en `tests/e2e/challenge-of-the-month.spec.js` (en rojo)
  - **Rama**: `tarea/001-T015-reto-del-mes` (primer commit) · **Depende de**: T013
  - **Casos**:
    - Proyecto `real`, en `/`: `h1` «Reto del mes: octubre · Gestión del conflicto»; «Reto en curso»; «Resolver, no ganar»; el objetivo de spec.md; los 4 pasos en una `ol`, en orden y con el texto exacto (FR-006); secciones «Reto motriz» («1.ª semana»), «Reto de tutoría» («2.ª y 3.ª semanas»), «Reto en familia» («Última semana») en ese orden, con sus «Para quién» fijos; motriz con «Banco Chipi Chipi», «viernes, 9 de octubre de 2026», «11:30», «En el recreo» y «Lo ha diseñado alumnado de 2.º de Bachillerato», y «Por confirmar» en lugar y en qué consiste; tutoría sin nombre propio → «Reto de tutoría» y el aviso de adaptación por etapas de data-model.md (FR-030); fuentes con su título; los datos de cada reto en `dl` (US1-5). La misma información en `/retos/2026-2027/octubre/`, con `h1` «Reto de octubre de 2026: Gestión del conflicto» (N8).
    - Proyecto `pendientes` (SC-008): ningún `dd` vacío; «Por confirmar» en fecha, hora, lugar y descripción del motriz; no aparecen fechas de semana ni «Por confirmar» para ellas (FR-004).
    - Proyecto `completo`: las fechas de las semanas aparecen junto a la semana con el formato «del <fecha desde> al <fecha hasta>» (N8); fuentes con `url` como enlace cuyo texto incluye «(sitio externo)» y sin `target` (decisión 7 del plan); el `borrador` de diciembre no genera página (`/retos/2026-2027/diciembre/` da 404).
  - **Hecho cuando**: las pruebas existen y fallan porque no hay página de inicio ni de reto.
  - **Comprobación**: `npm run build && npm run build:fixtures && npx playwright test tests/e2e/challenge-of-the-month.spec.js` falla en los casos anteriores, en local, antes del primer commit.

### Implementation for User Story 1

- [ ] T016 [US1] Crear los bloques `src/_includes/partials/challenge-of-the-month.njk`, `src/_includes/partials/challenge.njk` y `src/_includes/partials/external-link.njk`
  - **Rama**: `tarea/001-T015-reto-del-mes` · **Depende de**: T015
  - **Objetivo**: el bloque «Reto del mes» de contracts/paginas-web.md, en su orden: situación → mes, tema y nombre → objetivo y descripción (párrafos separados por línea en blanco, cada uno en `<p>`, con escape) → pasos (`ol`) → los tres retos (sección con encabezado, `dl`; semana + fechas si las hay; textos fijos; «Por confirmar») → fuentes (con `external-link.njk` si tienen `url`: texto «<título> (sitio externo)», misma pestaña). Situación: «Reto en curso» o «Reto de <mes> de <año>. No es el reto en curso.» Hueco para la lista de materiales vacío (lo rellena T019).
  - **Hecho cuando**: los bloques existen y no usan `safe` ni HTML de la comisión.
  - **Comprobación**: `grep -rn "| safe" src/_includes` no devuelve nada; las pruebas de T015 se comprueban al terminar T017.

- [ ] T017 [US1] Crear las páginas `src/index.njk` (con reto en curso) y `src/retos.njk` (`/retos/<curso>/<mes>/` de cada reto publicado)
  - **Rama**: `tarea/001-T015-reto-del-mes` · **Depende de**: T016
  - **Objetivo**: FR-001 a FR-006, FR-028 (texto de situación) y FR-030. `index.njk`: si hay `en_curso`, `h1` «Reto del mes: <mes> · <tema>» y el bloque completo. Si no lo hay, de momento solo `h1` «Próximo reto» (se completa en T044). Sin enlace al calendario todavía (lo añade T043). `retos.njk`: paginación de los retos `publicado`, enlace permanente `/retos/<curso>/<mes>/`, `h1` «Reto de <mes> de <año>: <tema>». Títulos de página según N8.
  - **Hecho cuando**: todas las pruebas de T015 pasan y `npm run comprobar` sigue en verde.
  - **Comprobación**: `npx playwright test tests/e2e/challenge-of-the-month.spec.js` en verde; `npm run comprobar` con código 0; recorrido con teclado de `/` descrito en la PR (AGENTS.md: tarea con interfaz); PR del grupo en verde.

**Checkpoint**: US1 funciona y se comprueba sola con `content/` y las fixtures. Revisión
del subagente `revisor` sobre la PR del grupo antes de integrar (cierre de historia).

---

## Phase 4: User Story 2 - Descargar los materiales de cada reto (Priority: P1)

**Goal**: cada reto muestra sus materiales con título, para quién, formato y tamaño; la
infografía tiene su texto en la web; ficha y justificante dicen cómo se entregan.

**Independent Test**: con `tests/fixtures/completo`, un tutor/a encuentra y descarga la
guía y la ficha; la infografía se lee entera como texto (quickstart B: US2-1 a US2-6).

**Rama del grupo**: `tarea/001-T018-materiales` (T018 + T019). Empieza cuando el grupo
de US1 está integrado (T019 modifica `challenge.njk`).

### Tests for User Story 2 ⚠️

- [ ] T018 [P] [US2] Escribir los escenarios de materiales en `tests/e2e/materials.spec.js` (en rojo)
  - **Rama**: `tarea/001-T018-materiales` (primer commit) · **Depende de**: T017
  - **Casos**:
    - Proyecto `completo`: cada material aparece dentro de la sección de su reto (US2-1 a US2-3); con `archivo`, el texto del enlace incluye título, formato y tamaño, p. ej. «<título> (PDF, <n> KB)», y aparte «Para: <destinatario>» con «Alumnado», «Familias», «Tutor/a» o «Todo el centro» (FR-008); el enlace descarga el fichero (respuesta 200); la infografía tiene la sección «Texto de la infografía» con su `version_texto` completo y en el mismo orden, en el HTML (FR-010, SC-007); `ficha` y `justificante` muestran «Se entrega en papel o por la plataforma educativa, no a través de esta web» (FR-011).
    - Proyecto `real` (octubre sin ficheros todavía): los seis materiales de spec.md aparecen con «Disponible próximamente» y sin enlace; la infografía muestra los 4 pasos como texto.
  - **Hecho cuando**: las pruebas existen y fallan porque no hay lista de materiales.
  - **Comprobación**: `npx playwright test tests/e2e/materials.spec.js` falla en esos casos, en local, antes del primer commit.

### Implementation for User Story 2

- [ ] T019 [US2] Crear `src/_includes/partials/material.njk` e integrarlo en `src/_includes/partials/challenge.njk`
  - **Rama**: `tarea/001-T018-materiales` · **Depende de**: T018
  - **Objetivo**: «Material (dentro de cada reto)» de contracts/paginas-web.md: lista (`ul`) de materiales; enlace normal (sin JS, sin `download` obligatorio); sin `archivo` → título + «Disponible próximamente» sin enlace.
  - **Hecho cuando**: todas las pruebas de T018 pasan y `npm run comprobar` sigue en verde (incluido `comprobar:enlaces`: los materiales de `completo` existen).
  - **Comprobación**: `npx playwright test tests/e2e/materials.spec.js` en verde; `npm run comprobar` con código 0; recorrido con teclado de la lista de materiales descrito en la PR; PR del grupo en verde.

**Checkpoint (MVP P1)**: US1 y US2 funcionan con el contenido escrito a mano. Parar:
revisión del subagente `revisor` sobre la PR de US2 (cierre de historia) y sobre el MVP
completo antes de seguir.

---

## Phase 5: Diseño visual (H13) — BLOQUEADA

**Purpose**: aspecto de la web. No cambia estructura, textos ni comportamiento.

**BLOQUEADA hasta que Michel revise e instale la skill `frontend-design`** (plan, H13).
Ninguna otra tarea depende de estas: US3, US4 y US5 pueden avanzar sin ellas, y deberán
seguir en verde cuando se apliquen.

- [ ] T020 [BLOQUEADA] Diseño visual base (colores, tipografía del sistema, disposición) en `src/assets/css/main.css`
  - **Rama**: `tarea/001-T020-diseno-base` · **Depende de**: T019 y el desbloqueo
  - **Límites**: CSS ≤ 20 KB transferidos, 0 fuentes web, 0 imágenes decorativas pesadas (ADR 0013); contraste AA; foco visible; la situación de un reto nunca solo por color (FR-019, FR-028); no se cambian plantillas salvo clases necesarias, ni textos.
  - **Hecho cuando**: `npm run comprobar` en verde (axe 0 infracciones, incluido contraste; Lighthouse dentro del presupuesto).
  - **Comprobación**: `npm run comprobar`; quickstart C1 (teclado) descrito en la PR.

- [ ] T021 [BLOQUEADA] Adaptación a móvil, zoom e impresión en `src/assets/css/main.css`
  - **Rama**: `tarea/001-T021-movil-zoom-impresion` · **Depende de**: T020
  - **Hecho cuando**: a 320 px y al 200 % no hay desplazamiento horizontal; al imprimir `/retos/2026-2027/octubre/` solo sale el contenido, legible y sin menús (caso límite «Impresión»).
  - **Comprobación**: `npm run comprobar`; quickstart C4 y C5 descritos en la PR; prueba en Playwright con ventana de 320 px que comprueba `scrollWidth <= clientWidth` en las páginas (añadida a `tests/e2e/common.spec.js`, escrita primero y en rojo en la misma rama).

---

## Phase 6: Imagen de la web y despliegue en el VPS (transversal)

**Purpose**: Dockerfile en dos etapas, nginx con CSP y sin cookies, y la prueba de H16.
Integrar el grupo T022 + T023 en `main` despliega la web nueva en el VPS (ADR 0001): es
un lanzamiento sin anunciar, con `noindex` hasta el estreno (N6, ADR 0016, T012 y T050).

**Requisito previo (principio I, hallazgo C2)**: la PR del grupo T022 + T023 NO se
integra hasta que la funcionalidad 002 (páginas legales: declaración de accesibilidad,
aviso legal e información de privacidad) esté especificada, implementada e integrada en
`main`, con sus enlaces en el pie de `base.njk`. Así la web nueva nunca está publicada
sin declaración de accesibilidad. La declaración puede publicarse como «parcialmente
conforme, en revisión», con fecha, y se actualiza en el estreno (T050) con el resultado
de las comprobaciones a mano (T047).

**Rama del grupo**: `tarea/001-T022-imagen-y-nginx` (T022 + T023).

- [ ] T022 Escribir la comprobación de cabeceras de la imagen en `scripts/check-headers.js`, el script `comprobar:cabeceras` y su paso al final de `comprobar` en `package.json` (en rojo con la imagen actual)
  - **Rama**: `tarea/001-T022-imagen-y-nginx` (primer commit) · **Depende de**: T014, T019 y, para integrar la PR del grupo, la funcionalidad 002 en `main` (C2)
  - **Objetivo**: plan, flujo («docker build + comprobación de cabeceras (CSP, sin Set-Cookie)»); FR-022, FR-024, SC-005; ADR 0007. `comprobar:cabeceras` forma parte de `npm run comprobar` (último paso), para que la secuencia local y la de Actions coincidan (hallazgo M4). Necesita Docker en local.
  - **Qué hace**: `comprobar:cabeceras` construye la imagen, la arranca en un puerto local, pide `/`, `/calendario/` si existe, `/retos/2026-2027/octubre/`, `/404.html` y una ruta inexistente, y comprueba: `Content-Security-Policy` con `default-src 'self'`; `X-Robots-Tag: noindex` en todas las respuestas mientras no se haya hecho el estreno (L3, ADR 0016; T050 cambia esta comprobación); ninguna respuesta con `Set-Cookie`; ruta inexistente → 404 con la página en español y los tres enlaces legales del pie (`/accesibilidad/`, `/aviso-legal/`, `/privacidad/`; FR-002 de la 002); contenido comprimido si el cliente lo pide; tras las peticiones, `docker logs` del contenedor sin ninguna IP (`\b\d{1,3}(\.\d{1,3}){3}\b`) ni líneas de acceso `GET /` (ADR 0018); al acabar, para y borra el contenedor. Si Docker no está disponible, falla con un mensaje claro en español (no se salta en silencio).
  - **Hecho cuando**: con el `Dockerfile` actual (hola mundo, sin CSP) la orden falla en la CSP.
  - **Comprobación**: `npm run comprobar:cabeceras` sale con código distinto de 0 y dice qué cabecera falta, en local, antes del primer commit.

- [ ] T023 Sustituir el `Dockerfile` por el de dos etapas, crear `nginx/nginx.conf` y `nginx/default.conf`, borrar `site/` y añadir `comprobar:cabeceras` a `.github/workflows/despliegue.yml` y a `AGENTS.md`
  - **Rama**: `tarea/001-T022-imagen-y-nginx` · **Depende de**: T022, la funcionalidad 002 integrada en `main`, con sus enlaces en el pie (C2), y la tarea MANUAL del proxy de la 002 (002-T002, ADR 0018; su resultado puede cambiar el texto de `/privacidad/`): la PR del grupo no se integra antes
  - **Objetivo**: ADR 0007, ADR 0016 y ADR 0018. Etapa 1 `node:26.13.1-alpine3.24`: `npm ci --omit=dev`, validación y compilación (`npm run build`). Etapa 2 `nginx:1.30.6-alpine3.24`: solo la carpeta generada, `nginx/nginx.conf` (sustituye la configuración principal de la imagen: `access_log off` en `http`, `error_log stderr notice` a nivel principal, `error_log stderr emerg` en `http`, `log_not_found off`; ADR 0018) y `nginx/default.conf` (CSP `default-src 'self'`, `X-Robots-Tag: noindex` en todas las respuestas hasta el estreno (L3, ADR 0016), compresión, caché larga para `/materiales/`, `error_page 404 /404.html`, sin cookies). Etiquetas completas, nunca `stable`.
  - **Hecho cuando**: la imagen se construye, `comprobar:cabeceras` pasa, está como paso de «comprobar» en Actions (mismo orden que `npm run comprobar`) y como línea en «Comprobaciones» de AGENTS.md, que dice que necesita Docker en local. En `despliegue.yml`, el job `desplegar` lleva `permissions: {}` y la clave `concurrency` usa un grupo que no mezcla las PR con los despliegues de `main` (p. ej. `group: despliegue-${{ github.ref }}`, o separado por evento); con el grupo único `despliegue` y `cancel-in-progress: false`, una ejecución de PR puede sustituir a un despliegue de `main` pendiente (hallazgo de la revisión de T002).
  - **Comprobación**: `docker build .` correcto; `npm run comprobar` con código 0 (incluye `comprobar:cabeceras`); en local, con `content/curso.yml` estropeado a propósito (sin integrar), `docker build .` falla en el paso de validación con el mensaje en español (quickstart A8); PR del grupo en verde.
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR del grupo (toca `.github/workflows/` y `nginx/`).

- [ ] T024 [MANUAL · Michel] Probar en Easypanel qué pasa cuando falla la compilación (HUECO H16, quickstart D12); resultado en `docs/decisiones/0007-compilacion-y-servidor.md`
  - **Rama**: no aplica (se usa una rama de ensayo `ensayo/h16`, que se borra al acabar: excepción autorizada por Michel a «no borres ramas remotas», recogida en AGENTS.md por la sesión principal, hallazgo M2) · **Depende de**: T023
  - **Pasos**:
    1. En Easypanel, crear un servicio de ensayo aparte de producción (p. ej. `web-ensayo`), con Auto Deploy desactivado, que construya el `Dockerfile` desde la rama `ensayo/h16`.
    2. Desplegar una versión buena y anotar lo que sirve (p. ej. el texto del `h1`).
    3. En `ensayo/h16`, estropear el contenido (p. ej. `hora: "25:00"`) y lanzar el despliegue del servicio de ensayo desde Easypanel.
    4. Ver si el servicio sigue sirviendo la versión buena o queda caído.
    5. Aprovechar para comprobar si la URL del Deployment Trigger de producción empieza por `https://` (pregunta abierta de ESTADO.md), sin copiarla en ningún sitio.
    6. Borrar el servicio de ensayo y la rama remota `ensayo/h16` (excepción M2).
  - **Hecho cuando**: el resultado está anotado como «Actualización» en el ADR 0007 (lo redacta la sesión principal).
  - **Comprobación**: captura o descripción de lo que sirvió el servicio tras el fallo. Si NO conserva la versión anterior: PARAR; se pasa a compilar en Actions y publicar la imagen en GitHub Container Registry con un ADR nuevo (ADR 0007, «Consecuencias»), y hay que replanificar T023.

---

## Phase 7: User Story 3 - Publicar o cambiar el reto del mes sin tocar código (Priority: P2)

**Goal**: la comisión publica y corrige retos desde Pages CMS, sin tocar código y sin
poder romper la web; lo mal formado no llega a la web y se avisa por correo.

**Independent Test**: una persona de la comisión, solo con `docs/guia-publicar.md`,
publica un reto de prueba con un material y corrige la hora del motriz (quickstart D6 y
D7, SC-003).

**Ramas de grupo**: `tarea/001-T025-pages-yml` (T025 + T027),
`tarea/001-T031-control-commits-app` (T031 + T032) y `tarea/001-T033-correo-aviso`
(T033 + T034).

**Permisos de la GitHub App (decisión N2, mínimo privilegio)**: se ensaya SIN
«Administration» con escritura (sin ese permiso o, si hace falta, solo lectura), SIN
«Actions» con escritura (no se usan las acciones de Pages CMS) y SIN «Workflows». Si
Pages CMS necesita «Administration» con escritura: PARAR. Michel decide con un ADR,
porque con ese permiso la app podría cambiar los rulesets de `main`.

### Tests for User Story 3 ⚠️

- [ ] T025 [P] [US3] Escribir la prueba de coherencia entre `.pages.yml` y los esquemas en `tests/unit/pages-config.test.js` (en rojo)
  - **Rama**: `tarea/001-T025-pages-yml` (grupo T025 + T027; primer commit) · **Depende de**: T003
  - **Casos** (contracts/panel-pages-cms.md, «Reglas»): cada campo de `schemas/*.schema.json` aparece con la misma clave, el mismo carácter obligatorio y el mismo patrón; los `select` tienen los mismos valores que los `enum`; los campos derivados y fijos no aparecen; ningún campo `rich-text` ni de código; `commit.identity: app`; plantillas de commit sin `{userName}` ni `{userEmail}` y con los textos del contrato («docs(contenido): crea {path}», etc.); una sola fuente de medios `materiales` con `input: content/materiales`, `output: /materiales` y extensiones `pdf`, `png`, `jpg`, `jpeg`; las tres entradas («Curso y calendario», «Retos del mes», «Enlace al Genially») con sus rutas; ninguna sección `actions` (no se usan las acciones de Pages CMS); la descripción de la lista `materiales` y la del campo `archivo` contienen «No subas fotos de los retos» y dicen que PNG y JPG son solo para carteles e infografías (decisión del 2026-11-19, hallazgos M3 y M6); el campo `archivo` tiene `extensions: [pdf, png, jpg, jpeg]` (M7; la restricción por tipo la prueba T006, no esta prueba).
  - **Hecho cuando**: la prueba existe y falla porque no hay `.pages.yml`.
  - **Comprobación**: `node --test tests/unit/pages-config.test.js` falla, en local, antes del primer commit.

- [ ] T026 [P] [US3] Escribir las pruebas de regresión de contenido mal formado y de escape en `tests/unit/build-rejects-invalid.test.js` y `tests/e2e/escaping.spec.js`
  - **Rama**: `tarea/001-T026-pruebas-rechazo-y-escape` · **Depende de**: T013, T017
  - **Casos**: US3-3: `npm run build` con una copia temporal inválida de `tests/fixtures/completo` (fecha imposible, infografía sin texto, `publicado` sin fuentes) sale con código distinto de 0, con mensaje en español, y no crea ni modifica la carpeta de salida indicada. US3-4 / FR-013: en el proyecto `completo`, el texto `<script>alert(1)</script>` y `<b>negrita</b>` se ven como texto literal y no existe ningún `<script>` ni `<b>` generado a partir de ellos.
  - **Hecho cuando**: las pruebas pasan (protegen algo ya construido en T009, T012 y T016). Es una rama propia: no hay implementación que añadir.
  - **Comprobación**: `node --test tests/unit/build-rejects-invalid.test.js` y `npx playwright test tests/e2e/escaping.spec.js` en verde; para demostrar que la prueba sirve, quitar temporalmente el escape (sin integrar) y ver que falla.

### Implementation for User Story 3

- [ ] T027 [US3] Escribir la configuración del panel en `.pages.yml`
  - **Rama**: `tarea/001-T025-pages-yml` (grupo T025 + T027; después del primer commit) · **Depende de**: T025
  - **Objetivo**: contracts/panel-pages-cms.md, con Pages CMS 2.1.8 (<https://pagescms.org/docs/configuration/>). Todo en español claro; descripciones de los campos tal cual en el contrato (p. ej. la de `estado`: «Marca Publicado solo cuando la comisión haya revisado todo el contenido, también lo hecho con IA. Ojo: los borradores se ven en el repositorio público de GitHub.»). Además (M3, M6, M7), las descripciones de la lista `materiales` y del campo `archivo` son las del contrato («No subas fotos de personas: los carteles e infografías llevan texto, iconos o ilustraciones…»; ficha, justificante y documento solo PDF; cartel e infografía PDF, PNG o JPG), y `archivo` lleva `extensions: [pdf, png, jpg, jpeg]`. La restricción por tipo NO se puede poner en el panel (la opción `extensions` es fija por campo, <https://pagescms.org/docs/configuration/fields/file/>): la impone el validador (T006, T009). Lo marcado «comprobar» en el contrato (clave de operaciones, carpeta por reto en `file`, lista fija de 9) se escribe según la documentación y se confirma en T030.
  - **Hecho cuando**: la prueba de T025 pasa.
  - **Comprobación**: `node --test tests/unit/pages-config.test.js` en verde; `npm run comprobar` con código 0; PR del grupo en verde.

- [ ] T028 [P] [US3] [MANUAL · Michel] Crear la cuenta del centro solo para enviar correo, con verificación en dos pasos y contraseña de aplicación (ADR 0009; sin ficheros del repositorio)
  - **Rama**: no aplica · **Depende de**: — (puede hacerse ya)
  - **Pasos**: pedir a quien administra el Google Workspace del centro una cuenta del centro (no personal) dedicada a enviar; activar la verificación en dos pasos; generar una contraseña de aplicación; guardarla solo donde el centro guarde sus credenciales (nunca en el repositorio, en mensajes ni en `tasks.md`); dejar anotado (ESTADO.md, sin la contraseña) qué cuenta es y quién la administra (HUECO N14).
  - **Hecho cuando**: la cuenta existe, es del centro y tiene contraseña de aplicación.
  - **Comprobación**: desde el Mac, un correo de prueba enviado por `smtp.gmail.com` (587 con STARTTLS o 465 con SSL) con esa cuenta llega a un buzón del centro; la contraseña se introduce sin quedar en el historial del terminal.

- [ ] T029 [P] [US3] [MANUAL · Michel] Crear una GitHub App de ensayo de la organización, con permisos mínimos, para el panel en local (sin ficheros del repositorio)
  - **Rama**: no aplica · **Depende de**: —
  - **Pasos**:
    1. Crear en `iesrioarba` una app de ensayo (p. ej. «…-ensayo») con base `http://localhost:3000`. El asistente de Pages CMS (`npm run setup:github-app` con `--owner-type org --org iesrioarba`, <https://pagescms.org/docs/guides/installing/github-app/>) la crea con los permisos de su documentación, que incluyen «Administration» y «Actions» con escritura: después de crearla, o creándola a mano, dejar los permisos así:
       - Contents: lectura y escritura. Metadata: lectura. Checks y Commit statuses: lectura. Email addresses (cuenta): lectura.
       - Administration: ninguno (si el ensayo demuestra que hace falta, solo lectura).
       - Actions: ninguno o solo lectura. Workflows: ninguno.
    2. Instalarla SOLO en `iesrioarba/web-comision-salud`.
    3. Las claves quedan solo en el `.env.local` de la copia de Pages CMS del Mac, fuera de este repositorio. Se borra al terminar T030.
  - **Hecho cuando**: la app existe, instalada solo en este repositorio, sin «Workflows», sin «Administration» con escritura y sin «Actions» con escritura.
  - **Comprobación**: página de permisos de la app en la organización (descrita, sin claves), con los permisos de la lista.

- [ ] T030 [US3] [MANUAL · Michel] Ensayar Pages CMS 2.1.8 en local en el Mac con Docker antes de montarlo en el VPS (H15, H16 del panel y permisos mínimos); resultado en `docs/decisiones/0005-panel-de-edicion-pages-cms.md`
  - **Rama**: rama de ensayo `ensayo/panel` del repositorio de la web (se borra al acabar: excepción autorizada por Michel a «no borres ramas remotas», recogida en AGENTS.md por la sesión principal, hallazgo M2) · **Depende de**: T027, T028, T029 y la tarea de la 002 que crea `tests/panel/panel-accessibility.spec.js` (002-T012)
  - **Pasos**:
    1. PostgreSQL 16 en Docker, como dice la guía local (<https://pagescms.org/docs/guides/installing/>).
    2. Pages CMS en la etiqueta 2.1.8, en una carpeta fuera de este repositorio, con `.env.local` (base de datos, `BETTER_AUTH_SECRET`, `CRYPTO_KEY`, claves de la app de T029, `EMAIL_PROVIDER=smtp` y SMTP de la cuenta de T028). `npm run db:migrate`, `npm run build`, `npm run start`.
    3. Probar también a construir y arrancar Pages CMS dentro de un contenedor: la guía de autoalojamiento no trae imagen ni Dockerfile oficial (HUECO N1); anotar qué funciona para Easypanel.
    4. **Permisos mínimos (N2)**: con la app de T029 (sin «Administration» con escritura y sin «Actions» con escritura), anotar qué funciona y qué no en cada punto del paso 5 y cualquier error de permisos. Si algo exige «Administration» con escritura: PARAR y no seguir con T036; Michel decide con un ADR. Si algo exige «Administration» o «Actions» de lectura, anotarlo y probar con ese permiso de lectura.
    5. Abrir el panel sobre `ensayo/panel` y comprobar: que lee `.pages.yml` de esa rama (H15); que las tres entradas y sus etiquetas salen en español; que «25:00» en la hora muestra «Escribe la hora así: 11:30» y no guarda (D8); cómo guarda un campo opcional vacío (`""`, `null` o ausente); si la lista de 9 meses se puede fijar; si la carpeta del campo `file` admite variables; la clave de operaciones; que el commit lo firma la app, con el mensaje del contrato y sin nombre ni correo de quien edita (D11); y el autor exacto (nombre y correo) de los commits de la app, para la variable `PANEL_APP_AUTOR` (HUECO N3).
    6. Invitar como colaboradora una dirección de prueba del centro (no `example.org`, que no recibe correo: HUECO N4) y entrar con ella.
    7. **Accesibilidad del panel (FR-011a y SC-009 de la 002, research R6 de la 002)**: ejecutar `PANEL_URL=http://localhost:3000 npx playwright test --project=panel --headed` (`tests/panel/panel-accessibility.spec.js`), entrar a mano en la pausa y recorrer inicio de sesión, lista de entradas, edición de un reto, subida de un material, lista de materiales y colaboradores; después, recorrer las mismas pantallas con teclado y con lector de pantalla (NVDA + Firefox o VoiceOver + Safari). Anotar los fallos sin datos personales (pantalla, regla o problema, impacto). Anotar también qué guarda Pages CMS como «datos técnicos de la sesión» (H9 de la 002).
    8. Si algo obliga a cambiar `.pages.yml`, los esquemas o el validador: nueva tarea, no se arregla aquí.
    9. Borrar la app de ensayo, la base de datos y la rama remota `ensayo/panel` (excepción M2).
  - **Hecho cuando**: cada punto de los pasos 4 y 5 tiene resultado escrito, con la lista final de permisos necesarios (lo redacta la sesión principal como «Actualización» del ADR 0005, y en ESTADO.md); y existe la tabla de fallos de accesibilidad del paso 7, que alimenta una PR de la 002 (002-T029: declaración y `panel_comprobado`).
  - **Comprobación**: lista de resultados con «sí/no» y observaciones, incluida la lista de permisos con los que funciona; ningún secreto en ella.

- [ ] T031 [US3] Escribir las pruebas del control de commits de la app en `tests/unit/panel-commits.test.js` (en rojo)
  - **Rama**: `tarea/001-T031-control-commits-app` (grupo T031 + T032; primer commit) · **Depende de**: T030
  - **Objetivo**: ADR 0005: «“comprobar” DEBE fallar si un commit hecho por la app modifica algo fuera de `content/` y `.pages.yml`». Las pruebas crean un repositorio git temporal con commits de autores inventados.
  - **Casos**: commit de la app que toca solo `content/…` o `.pages.yml` → bien; commit de la app que toca `src/`, `.github/workflows/…`, `package.json` o `contentx/…` → falla y nombra el fichero; commit de una persona que toca `src/` → no le afecta; varios commits en un mismo `push` (rango `before..after`) → se revisan todos; el autor de la app se reconoce con el valor de la variable del repositorio `PANEL_APP_AUTOR` (N5; valor obtenido en T030 y creado en T035).
  - **Hecho cuando**: las pruebas existen y fallan porque `scripts/check-panel-commits.js` no existe.
  - **Comprobación**: `node --test tests/unit/panel-commits.test.js` falla por módulo inexistente, en local, antes del primer commit.

- [ ] T032 [US3] Implementar `scripts/check-panel-commits.js` y añadirlo como primer paso de «comprobar» en `.github/workflows/despliegue.yml`
  - **Rama**: `tarea/001-T031-control-commits-app` (grupo T031 + T032; después del primer commit) · **Depende de**: T031
  - **Objetivo**: solo en `push` a `main`; recorre `github.event.before..github.event.after` (el `checkout` necesita el historial suficiente); lee `vars.PANEL_APP_AUTOR`; falla con un mensaje claro. Exporta también la función que dice si un commit es «de contenido hecho por la app», para T034.
  - **Hecho cuando**: las pruebas de T031 pasan y el paso está en el flujo.
  - **Comprobación**: `node --test tests/unit/panel-commits.test.js` en verde; PR del grupo en verde.
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR del grupo (control de commits de la app y `.github/workflows/`).

- [ ] T033 [US3] Escribir las pruebas del correo de aviso de fallos en `tests/unit/failure-email.test.js` (en rojo)
  - **Rama**: `tarea/001-T033-correo-aviso` (grupo T033 + T034; primer commit) · **Depende de**: T009 y, para cerrar la rama, T032
  - **Objetivo**: ADR 0012. Se prueba la composición del mensaje, sin enviar nada: asunto y cuerpo en español; incluyen el mensaje del validador (qué falló y en qué fichero), «corrige el campo en el panel y vuelve a guardar; la web sigue como estaba» y el enlace al registro de Actions; si el fallo no es del validador (p. ej. accesibilidad), un texto general; ningún nombre ni correo de quien editó; cabeceras de correo bien formadas (UTF-8).
  - **Hecho cuando**: las pruebas existen y fallan porque `scripts/compose-failure-email.js` no existe.
  - **Comprobación**: `node --test tests/unit/failure-email.test.js` falla por módulo inexistente, en local, antes del primer commit.

- [ ] T034 [US3] Implementar `scripts/compose-failure-email.js` y el trabajo de aviso en `.github/workflows/despliegue.yml`
  - **Rama**: `tarea/001-T033-correo-aviso` (grupo T033 + T034; después del primer commit) · **Depende de**: T032, T033
  - **Objetivo**: ADR 0012. Un trabajo nuevo que se ejecuta si «comprobar» falla en un `push` a `main` y el commit es de contenido hecho por la app (función de T032); usa el entorno `produccion`; compone el mensaje con el script y lo envía con `curl` por SMTP con los secretos `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` y `AVISO_BUZON_COMISION` (N5), sin acciones de terceros ni dependencias. La salida del validador pasa de «comprobar» al aviso como salida del trabajo, sin acciones nuevas. Ningún secreto en el flujo ni en el registro. Si falla un cambio de código, no se avisa a la comisión.
  - **Hecho cuando**: las pruebas de T033 pasan y el flujo tiene el trabajo con esas condiciones.
  - **Comprobación**: `node --test tests/unit/failure-email.test.js` en verde; PR del grupo en verde (el aviso no se ejecuta en pull request); el envío real se prueba en T041 (D8).
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR del grupo (correo de aviso, secretos y `.github/workflows/`).

- [ ] T035 [US3] [MANUAL · Michel] Crear los secretos y la variable de GitHub para el aviso de fallos y el control de commits (sin ficheros del repositorio)
  - **Rama**: no aplica · **Depende de**: T028, T030 y HUECO H3 (buzón de la comisión)
  - **Pasos**: en el entorno `produccion` del repositorio, crear los secretos `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` (contraseña de aplicación de T028) y `AVISO_BUZON_COMISION` (buzón del centro, no personal) (N5). Crear la variable del repositorio `PANEL_APP_AUTOR` con el autor de los commits de la app (dato de T030; se revisa tras T036 si la app definitiva firma con otro autor). Activar en la cuenta de GitHub de quien mantiene la web las notificaciones de flujos fallidos (ADR 0012).
  - **Hecho cuando**: secretos y variable existen con esos nombres.
  - **Comprobación**: la página de secretos del entorno lista los nombres (nunca los valores); prueba real en T041 (D8).

- [ ] T036 [US3] [MANUAL · Michel] Crear la GitHub App definitiva de la organización para Pages CMS con los permisos que salieron del ensayo, SIN «Workflows» (sin ficheros del repositorio)
  - **Rama**: no aplica · **Depende de**: T030 (lista de permisos; si pidió «Administration» con escritura, antes el ADR de Michel) y HUECO H1 (dominio del panel)
  - **Pasos**: crear la app en `iesrioarba` con base `https://<dominio del panel>` y exactamente los permisos de la lista de T030 (sin «Workflows», sin «Actions» con escritura y sin «Administration» con escritura salvo ADR); instalarla SOLO en `iesrioarba/web-comision-salud`; anotar su nombre corto (`GITHUB_APP_NAME`) en ESTADO.md; comprobar si el autor de sus commits coincide con `PANEL_APP_AUTOR` y, si no, actualizar la variable; las claves (id, cliente, secreto, clave privada, secreto del webhook) van solo a Easypanel en T037, nunca al repositorio ni a los mensajes.
  - **Hecho cuando**: la app existe, es de la organización, está instalada solo en este repositorio y sus permisos son los de T030.
  - **Comprobación**: página de permisos e instalación de la app (descrita, sin claves), comparada con la lista de T030.

- [ ] T037 [US3] [MANUAL · Michel] Montar Pages CMS y PostgreSQL en Easypanel con sus variables y secretos (sin ficheros del repositorio)
  - **Rama**: no aplica · **Depende de**: T030 (forma de empaquetarlo, HUECO N1), T028, T036, HUECOS H1 y H5
  - **Pasos**: servicio PostgreSQL y servicio Pages CMS en la etiqueta 2.1.8; variables de entorno solo en Easypanel: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CRYPTO_KEY`, `GITHUB_APP_ID`, `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_WEBHOOK_SECRET`, `GITHUB_APP_NAME`, `BASE_URL` (https), `ADMIN_EMAILS` (al menos dos personas del centro, H5), `EMAIL_PROVIDER=smtp`, `EMAIL_FROM` (la cuenta de T028), `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` (<https://pagescms.org/docs/development/environment-variables/>); `npm run db:migrate`; HTTPS delante (ADR 0005).
  - **Hecho cuando**: el panel abre por `https://<dominio>` y un administrador entra y ve las tres entradas de `.pages.yml` de `main`.
  - **Comprobación**: descripción de lo que se ve al entrar; ningún valor de variable en ella.

- [ ] T038 [US3] [MANUAL · Michel] Configurar el ruleset de `main`: pull request obligatorio para personas, «comprobar» obligatorio y la app de Pages CMS como excepción (research R11; sin ficheros del repositorio)
  - **Rama**: no aplica · **Depende de**: T036
  - **Pasos**: ruleset sobre `main` que exige pull request y la comprobación «comprobar» en verde, mantiene sin force push ni borrado (ESTADO.md) y pone la app de T036 en la lista de excepciones (bypass).
  - **Hecho cuando**: el ruleset está activo con esa excepción.
  - **Comprobación**: un `push` directo a `main` desde una cuenta personal se rechaza; un guardado desde el panel llega a `main` (se ve en T041).

- [ ] T039 [US3] Escribir la guía de mantenimiento para la comisión en `docs/guia-publicar.md`
  - **Rama**: `tarea/001-T039-guia-publicar` · **Depende de**: T027, T030 (lo que de verdad hace el panel)
  - **Objetivo**: FR-017, decisión 10 del plan. Lenguaje sencillo, sin jerga, con pasos numerados: entrar al panel; crear el reto de un mes; rellenar cada campo (qué poner y qué pasa si se deja vacío: «Por confirmar»); subir materiales (PDF, PNG o JPG, ≤ 10 MB) y escribir el texto de la infografía; no se suben fotos de personas: ningún material, carteles incluidos, lleva fotos de alumnado; los carteles e infografías llevan texto, iconos o ilustraciones, y PNG y JPG son solo para ellos (decisiones del 2026-11-19, M3 y L10); poner `Publicado` solo tras revisar todo, también lo hecho con IA (FR-027, principio IV) y citar al menos una fuente; marcar el reto en curso o dejarlo vacío y elegir el próximo mes (FR-029); cambiar un tema del calendario (FR-020); corregir o despublicar; cuánto tarda en verse (unos minutos) y qué hacer si llega el correo de fallo (ADR 0012); aviso de que los borradores se ven en GitHub (ADR 0011); si algún día se quieren fotos o vídeos, será una funcionalidad aparte con su especificación (principio II); quién da de alta y de baja a las personas editoras (ADR 0010); las páginas legales (accesibilidad, aviso legal y privacidad) no se editan desde el panel: un cambio se pide a quien mantiene la web o a su suplente (FR-024 de la 002). Sin capturas con datos reales de personas.
  - **Hecho cuando**: la guía cubre todos esos puntos y una persona que no programa puede seguirla.
  - **Comprobación**: revisión del `revisor` contra esta lista; prueba con una persona de la comisión en T049 (SC-003).

- [ ] T040 [US3] [MANUAL · Michel] Invitar a las personas de la comisión al panel (ADR 0010; sin ficheros del repositorio)
  - **Rama**: no aplica · **Depende de**: T032, T034, T035, T037, T038, HUECO H5 (no se invita a nadie hasta que el control de commits, el aviso por correo y el ruleset estén activos; hallazgo M1) y la 002 integrada y desplegada con `npm run comprobar:legal -- --panel` en verde (responsable y base legal confirmados tras consultar al DPD: FR-023 y FR-024a de la 002, 002-T028) y la página `/privacidad/` publicada
  - **Pasos**: invitar por correo, preferiblemente institucional, solo a las personas de la lista de H5; ningún correo se escribe en el repositorio.
  - **Hecho cuando**: cada persona invitada ha recibido la invitación y entra.
  - **Comprobación**: antes de invitar, la salida de `npm run comprobar:legal -- --panel` en verde y `curl -s https://<dominio>/privacidad/` con el responsable visible (sin «Pendiente de confirmar» en él); después, cada persona confirma que entra; un correo no invitado no puede entrar (D9).

- [ ] T041 [US3] Recorrer los escenarios D6 a D11 de `specs/001-reto-octubre/quickstart.md` con el panel real (comprobación manual)
  - **Rama**: no aplica · **Depende de**: T032, T034, T035, T038, T039, T040
  - **Pasos**: con datos inventados (curso `2026-2027`, mes `noviembre`, «Reto de prueba inventado», «Patio de ejemplo») y una cuenta de prueba del centro: D6 publicar con la guía; D7 cambiar 11:30 por 12:00 y ver solo 12:00; D8 hora «25:00» (el panel no guarda) y una infografía sin texto (falla «comprobar», la web no cambia y llega el correo al buzón de la comisión); D9 persona no invitada; D10 borrador; D11 historial sin datos personales. Al acabar, borrar el reto de prueba y sus materiales.
  - **Hecho cuando**: los seis escenarios dan el resultado esperado del quickstart.
  - **Comprobación**: tabla de resultados en la PR de cierre o en ESTADO.md, sin datos personales.

**Checkpoint**: la comisión puede publicar sola; lo mal formado no llega a la web.
Revisión del subagente `revisor` al cierre de US3 (configuración del panel, controles y
guía) antes de dar la historia por terminada.

---

## Phase 8: User Story 4 - Ver el calendario del curso (Priority: P2)

**Goal**: `/calendario/` con los 9 meses y su tema; mes en curso marcado sin depender del
color; retos pasados consultables y marcados; aviso de «próximo reto» en `/` cuando no hay
reto en curso.

**Independent Test**: un visitante abre el calendario y dice el tema de octubre y de
cualquier otro mes (quickstart B: US4-1 a US4-4, FR-029).

**Rama del grupo**: `tarea/001-T042-calendario` (T042 + T043 + T044).

### Tests for User Story 4 ⚠️

- [ ] T042 [P] [US4] Escribir los escenarios del calendario y del «próximo reto» en `tests/e2e/calendar.spec.js` (en rojo)
  - **Rama**: `tarea/001-T042-calendario` (primer commit) · **Depende de**: T017
  - **Casos**: proyecto `real`: `h1` «Calendario del curso 2026-2027»; `ol` con 9 elementos de octubre a junio con los temas de spec.md; octubre con el texto «Reto en curso» y `aria-current="true"` y enlace a `/retos/2026-2027/octubre/`; meses sin reto publicado sin enlace; `/` tiene el enlace «Ver el calendario del curso»; el `nav` tiene el enlace «Calendario» (N9). Proyecto `pendientes`: el mes con tema vacío muestra «Por anunciar». Proyecto `sin-reto-en-curso`: `/retos/2026-2027/octubre/` dice «No es el reto en curso» (FR-028); en el calendario ningún mes tiene `aria-current`; `/` muestra `h1` «Próximo reto», «Próximo reto: enero · <tema>», «Ver el último reto publicado: noviembre · <nombre>» y el calendario completo. Proyecto `sin-reto-ni-anuncio`: `/` dice «El próximo reto está por anunciar» y no tiene enlace al último reto.
  - **Hecho cuando**: las pruebas existen y fallan porque no hay calendario.
  - **Comprobación**: `npx playwright test tests/e2e/calendar.spec.js` falla en esos casos, en local, antes del primer commit.

### Implementation for User Story 4

- [ ] T043 [US4] Crear `src/_includes/partials/calendar.njk` y `src/calendario.njk`, y añadir el enlace «Ver el calendario del curso» en `src/index.njk` y «Calendario» en el `nav` de `src/_includes/layouts/base.njk`
  - **Rama**: `tarea/001-T042-calendario` · **Depende de**: T042
  - **Objetivo**: contracts/paginas-web.md, «`/calendario/`»; FR-018, FR-019, FR-020 (el tema sale de `curso.yml`).
  - **Hecho cuando**: pasan los casos de T042 del proyecto `real` y `pendientes`.
  - **Comprobación**: `npx playwright test tests/e2e/calendar.spec.js --project=real --project=pendientes` en verde; recorrido con teclado del calendario descrito en la PR.

- [ ] T044 [US4] Completar `src/index.njk` para cuando no hay reto en curso (FR-029)
  - **Rama**: `tarea/001-T042-calendario` · **Depende de**: T043
  - **Objetivo**: «Si no hay reto en curso» de contracts/paginas-web.md, en su orden, reutilizando `calendar.njk`.
  - **Hecho cuando**: pasan todos los casos de T042 y `npm run comprobar` sigue en verde.
  - **Comprobación**: `npx playwright test tests/e2e/calendar.spec.js` en verde; `npm run comprobar` con código 0; PR del grupo en verde.

**Checkpoint**: US4 funciona y no rompe US1 ni US2. Revisión del subagente `revisor`
sobre la PR del grupo antes de integrar (cierre de historia).

---

## Phase 9: User Story 5 - Ir al Genially «El Arbalquimista de la salud» (Priority: P3)

**Goal**: enlace normal al Genially que avisa de que es un sitio externo y no carga nada
antes de pulsarlo.

**Independent Test**: un alumno o alumna encuentra el enlace, entiende que sale de la web
y llega al Genially (quickstart B: US5-1 a US5-3).

**Rama del grupo**: `tarea/001-T045-enlace-genially` (T045 + T046). Empieza cuando el
grupo de US4 está integrado (comparte `src/index.njk`).

### Tests for User Story 5 ⚠️

- [ ] T045 [US5] Escribir los escenarios del enlace al Genially en `tests/e2e/genially.spec.js` (en rojo)
  - **Rama**: `tarea/001-T045-enlace-genially` (primer commit) · **Depende de**: T044
  - **Casos**: en `/` (proyecto `real` y `sin-reto-en-curso`), un enlace con el texto «El Arbalquimista de la salud (sitio externo)» (nombre accesible igual), `href` = `genially.url` de `sitio.yml`, sin `target`; ningún `iframe`; al cargar, 0 peticiones a su dominio (ya lo vigila `common.spec.js`).
  - **Hecho cuando**: las pruebas existen y fallan porque no hay enlace.
  - **Comprobación**: `npx playwright test tests/e2e/genially.spec.js` falla, en local, antes del primer commit.

### Implementation for User Story 5

- [ ] T046 [US5] Añadir el enlace al Genially en `src/index.njk` (con y sin reto en curso) usando `src/_includes/partials/external-link.njk`
  - **Rama**: `tarea/001-T045-enlace-genially` · **Depende de**: T045
  - **Hecho cuando**: pasan los casos de T045 y `npm run comprobar` sigue en verde.
  - **Comprobación**: `npx playwright test tests/e2e/genially.spec.js` en verde; `npm run comprobar` con código 0; con lector de pantalla se oye «(sitio externo)» (anotado en la PR); PR del grupo en verde.

**Checkpoint**: US5 funciona. Revisión del subagente `revisor` sobre la PR del grupo
antes de integrar (cierre de historia).

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: comprobaciones a mano, pruebas con personas y estreno.

- [ ] T047 Comprobaciones a mano C1 a C6 de `specs/001-reto-octubre/quickstart.md` (comprobación manual; resultados en la PR de cierre o en ESTADO.md)
  - **Depende de**: T046 (y T021 si el diseño ya está aplicado; si no, repetir tras T021)
  - **Pasos**: C1 teclado en `/`, `/calendario/`, `/retos/2026-2027/octubre/`, `/accesibilidad/`, `/aviso-legal/` y `/privacidad/`; C2 NVDA + Firefox o VoiceOver + Safari, y TalkBack, en esas mismas páginas; C3 móvil modesto con «Slow 4G» (HUECO H14: modelo); C4 impresión, también de las tres páginas legales (su resultado actualiza la declaración en 002-T031); C5 zoom 200 % y 320 px; C6 cada PDF de octubre con texto seleccionable o alternativa (FR-009; necesita los materiales reales, H8).
  - **Hecho cuando**: los seis puntos tienen resultado; lo que falle se convierte en tarea nueva.
  - **Comprobación**: tabla de resultados con navegador, lector y dispositivo usados.

- [ ] T048 Revisar los textos fijos de las plantillas con la comisión (FR-025) y el proceso de revisión del contenido (FR-027) en `src/` y `docs/guia-publicar.md` (comprobación manual)
  - **Depende de**: T046, T039
  - **Hecho cuando**: la comisión confirma que los textos fijos («Por confirmar», «Disponible próximamente», semanas, «Para quién», avisos de entrega y de etapas, «Próximo reto», «No es el reto en curso») son claros para alumnado de 12 a 20 años y familias; los cambios que pida son tareas nuevas.
  - **Comprobación**: lista de textos revisados con «de acuerdo» o el cambio pedido.

- [ ] T049 Pruebas con personas SC-001, SC-002 y SC-003 (comprobación manual, fase 7)
  - **Depende de**: T041, T047
  - **Pasos**: SC-001 con al menos 5 personas (alumnado, familias y tutores/as), sin recoger datos personales (solo «sí/no» y tiempo); SC-002 un tutor/a descarga la guía en < 1 minuto (necesita el fichero real, H8); SC-003 una persona de la comisión publica un reto de prueba completo en < 30 minutos solo con la guía.
  - **Hecho cuando**: los tres criterios tienen resultado medido.
  - **Comprobación**: tabla con resultados agregados, sin nombres.

- [ ] T050 Estreno: lista previa a producción (decisión de Michel) y, como último paso, quitar el `noindex` de `src/_includes/layouts/base.njk` y la cabecera `X-Robots-Tag` de `nginx/default.conf`
  - **Rama**: `tarea/001-T050-estreno` (solo para el último paso) · **Depende de**: T047, T049 y la funcionalidad 002 (páginas legales) integrada en `main`, publicada y al día
  - **Pasos**:
    1. **Requisito que no admite excepción (principio I, hallazgos C1 y C2)**: la funcionalidad 002 (declaración de accesibilidad con medio de contacto, aviso legal e información de privacidad, que recoge también el tratamiento del ADR 0010) está integrada en `main`, publicada y al día. Ya lo estaba desde antes de T023; en el estreno, la declaración (que pudo publicarse como «parcialmente conforme, en revisión», con fecha) se actualiza con el resultado de las comprobaciones a mano de T047 y con la fecha nueva. Resuelve H11. NO se puede aceptar como pendiente: sin ella no hay estreno.
    2. **Datos legales completos (FR-023, FR-015, SC-006, SC-009, SC-002 y SC-008 de la 002)**: `npm run comprobar:legal -- --estreno` en verde (ningún dato pendiente, `en_revision: false`); `fecha_ultima_revision` posterior a la fecha de T047; `panel_comprobado` con fecha; SC-002 (002-T030) y SC-008 (002-T024) hechos; y la tarea del proxy (002-T002) cerrada. Lo deja listo 002-T031.
    3. Resto de la lista, resuelto o aceptado por escrito en ESTADO.md: URL real del Genially en `content/sitio.yml` (H6; hoy `example.org`); materiales reales de octubre (H8); descripción y lugar del motriz (H7) o «Por confirmar» aceptado; qué reto queda en `en_curso` al estrenar (en enero, octubre ya no es el reto en curso); consulta al DPD (H17); dominio (H1); al menos dos administradores del panel (H5).
    4. Solo con los puntos 1 a 3 completos y el visto bueno de Michel: quitar `<meta name="robots" content="noindex">` de `base.njk` y `X-Robots-Tag: noindex` de `nginx/default.conf`, y cambiar `scripts/check-headers.js` para que compruebe que la cabecera ya NO se envía (N6, L3, ADR 0016). A partir de aquí la dirección se puede anunciar; la sesión principal marca el ADR 0016 como cumplido.
  - **Hecho cuando**: la 002 está publicada y al día (declaración actualizada con T047), la lista está completa y la web publicada ya no lleva `noindex` ni en el HTML ni en las cabeceras.
  - **Comprobación**: las páginas de la 002 responden 200 en el dominio publicado y la fecha de la declaración es posterior a T047; `npm run comprobar:legal -- --estreno` con código 0; `grep -r "example.org" content/` no devuelve nada; `npm run build && grep -rl 'name="robots"' _site` no devuelve nada; `npm run comprobar` con código 0 (incluye `comprobar:cabeceras` sin `X-Robots-Tag`); tras el despliegue, `curl -s https://<dominio>/ | grep -c 'name="robots"'` → 0 y `curl -sI https://<dominio>/ | grep -ci 'x-robots-tag'` → 0.
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR (toca `nginx/`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (fase 1)**: T001 → T002.
- **Foundational (fase 2)**: depende de T001; bloquea todas las historias. Orden por ramas:
  `T003`, `T004` y la rama T005+T008 → ramas T006+T009 y T007+T010 (esta última, tras
  T008) → `T011` (tras T009) → `T012` → rama T013+T014 (tras T002, T011 y T012; una sola
  PR, hallazgo H1).
- **US1 (fase 3)**: rama T015+T016+T017, tras la fase 2.
- **US2 (fase 4)**: rama T018+T019, tras integrar la rama de US1.
- **Diseño (fase 5)**: BLOQUEADA; cuando se desbloquee, tras la rama de US2.
- **Funcionalidad 002 (páginas legales)**: fuera de este `tasks.md` (su propio ciclo en `specs/002-paginas-legales/tasks.md`). Empieza tras T012 (pie en `base.njk`, filtros) y tras la rama T013+T014 (`common.spec.js`, `comprobar`, flujo), y DEBE estar integrada en `main`, con sus enlaces en el pie, antes de integrar la rama T022+T023 (hallazgo C2).
- **Despliegue (fase 6)**: rama T022+T023 tras la rama T013+T014, la de US2, la 002 integrada y la tarea manual del proxy de la 002 (002-T002) (se despliega el MVP, con `noindex` en el HTML y `X-Robots-Tag`, ADR 0016); después T024.
- **US3 (fase 7)**: rama T025+T027 y T026 desde la base; T028 y T029 en cualquier momento; T030 tras T027, T028, T029 y la tarea de la 002 que crea `tests/panel/` (002-T012); ramas T031+T032 y luego T033+T034 tras T030; T035 a T039 como indica cada tarea; T040 (invitaciones) solo tras T032, T034, T035, T037 y T038 (hallazgo M1); T041 al final. El panel en el VPS (T037 en adelante) depende de la fase 6 y, por tanto, también de la 002.
- **US4 (fase 8)**: rama T042+T043+T044, tras integrar la rama de US1.
- **US5 (fase 9)**: rama T045+T046, tras integrar la rama de US4.
- **Cierre (fase 10)**: depende de todo lo anterior; T050 (estreno) exige además que la 002 siga publicada y al día, con la declaración actualizada con el resultado de T047 (hallazgos C1 y C2), y es el último paso.

### User Story Dependencies

- **US1 (P1)**: solo la base.
- **US2 (P1)**: la base y la rama de US1 (`challenge.njk`).
- **US3 (P2)**: la base para `.pages.yml` y pruebas; la fase 6 para el panel en el VPS. Independiente de US4 y US5.
- **US4 (P2)**: la base y la rama de US1 (`src/index.njk`).
- **US5 (P3)**: la rama de US4 (`src/index.njk` con las dos variantes).

### Ficheros compartidos (impiden el paralelo entre ramas)

- `package.json`: T001, T009, T012, rama T013+T014, funcionalidad 002 (`comprobar:legal`, `build:fixtures` y `aviso:revision`), rama T022+T023.
- `.github/workflows/despliegue.yml`: T002, rama T013+T014, funcionalidad 002 (pasos «Comprobar páginas legales» y «Aviso de revisión de la declaración»), rama T022+T023, rama T031+T032, rama T033+T034.
- `tests/e2e/common.spec.js`: rama T013+T014 → funcionalidad 002 (enlaces legales del pie) → T021.
- `src/index.njk`: T017 → T043/T044 → T046.
- `src/_includes/layouts/base.njk` (y su pie): T012 → funcionalidad 002 (enlaces legales en el pie) → T043 (enlace «Calendario» en el `nav`) → T050. Si la 002 y la rama de US4 se trabajan a la vez, se integran una detrás de otra.
- `schemas/reto.schema.json`: copia del contrato en T003; si el contrato cambia después (como con M7), hay que volver a copiarlo.
- `nginx/default.conf`, `nginx/nginx.conf` y `scripts/check-headers.js`: rama T022+T023 → T050.
- `src/_includes/partials/challenge.njk`: T016 → T019.
- `AGENTS.md`: rama T013+T014 → funcionalidad 002 (línea de `comprobar:legal`) → rama T022+T023.

### Within Each Group (rama)

- Primer commit (lo hace Michel): las pruebas, comprobadas en rojo en local (en el grupo T013+T014 no hay commit en rojo: va junto para que la PR salga en verde).
- Después: la implementación, en la misma rama.
- Antes de integrar, revisión independiente (principio VII): Michel revisa el diff y lo anota en la PR; el subagente `revisor` revisa además en los puntos de control (MVP y cierre de cada historia) y en las PR que tocan `.github/workflows/`, `nginx/`, el control de commits de la app o el correo de aviso.
- La PR se abre con todo en verde; Michel hace commit, push y PR, e integra tras la revisión.

### Parallel Opportunities (entre ramas)

- Fase 2: `T003`, `T004` y la rama T005+T008 a la vez; después las ramas T006+T009 y T007+T010 (esta, cuando T008 esté integrada); `T011` en paralelo con la rama T007+T010.
- Tras la fase 2: la rama de US1 (T015…) en paralelo con la rama T025+T027 (`.pages.yml`).
- Tras integrar la rama de US1: en paralelo la rama de US2 (T018…), la rama de US4 (T042…) y `T026`.
- Tareas manuales sin ficheros, en paralelo con el código desde ya: `T028` y `T029`.

---

## Parallel Example: después de integrar la rama de US1

```bash
# Tres ramas a la vez, sin ficheros en común:
Rama: "tarea/001-T018-materiales"   # T018 (pruebas en rojo) → T019
Rama: "tarea/001-T042-calendario"   # T042 (pruebas en rojo) → T043 → T044
Rama: "tarea/001-T026-pruebas-rechazo-y-escape"   # T026

# En la fase 2, a la vez:
Rama: "tarea/001-T003-esquemas"
Rama: "tarea/001-T004-fixtures"
Rama: "tarea/001-T005-formato"      # T005 (pruebas en rojo) → T008
```

---

## Implementation Strategy

### MVP First (US1 + US2, las dos P1)

1. Fase 1 y fase 2 (base, validador, contenido de octubre escrito a mano, comprobaciones), con las ramas de grupo T005+T008, T006+T009, T007+T010 y T013+T014.
2. Rama de US1 (T015+T016+T017) y después la de US2 (T018+T019), cada una con su revisión del `revisor` antes de integrar.
3. **Parar y comprobar**: `npm run comprobar` en verde, revisión del `revisor` sobre el MVP, recorrido con teclado.
4. Funcionalidad 002 (páginas legales) especificada, implementada e integrada en `main`, con sus enlaces en el pie; la declaración puede decir «parcialmente conforme, en revisión», con fecha.
5. Fase 6: rama T022+T023 (lanzamiento sin anunciar, ADR 0016, con `noindex` y `X-Robots-Tag`; desde aquí `npm run comprobar` necesita Docker) y la prueba de H16 (T024) antes de confiar en el despliegue.

### Incremental Delivery

1. Base → US1 → US2 (MVP, contenido a mano).
2. Funcionalidad 002 integrada → despliegue de la web nueva sin anunciar (fase 6).
3. Diseño visual cuando se desbloquee (no frena lo demás).
4. US3: `.pages.yml`, ensayo del panel en el Mac con permisos mínimos (ADR 0005, actualización del 2026-11-19), controles y aviso, y después el panel en el VPS.
5. US4 → US5 → cierre (comprobaciones a mano y pruebas con personas).
6. Estreno (T050): declaración de la 002 actualizada con T047; se quitan el `noindex` y el `X-Robots-Tag` (ADR 0016).

---

## Trazabilidad FR/SC → tareas

| Requisito | Tareas |
|---|---|
| FR-001 | T015, T016, T017 |
| FR-002 | T005, T008, T015, T016 |
| FR-003 | T015, T016 |
| FR-004 | T004, T007, T010, T015, T016 |
| FR-005 | T004, T011, T015, T016, T017 |
| FR-006 | T011, T015, T016 |
| FR-007 | T018, T019 |
| FR-008 | T005, T008, T018, T019 |
| FR-009 | T019, T047 (C6) |
| FR-010 | T006, T009, T018, T019 |
| FR-011 | T013, T018, T019 |
| FR-012 | T027, T030, T037, T039, T041 |
| FR-013 | T013, T025, T026, T027 |
| FR-014 | T006, T009, T012, T014, T023, T026, T033, T034, T041 |
| FR-015 | T029, T030, T031, T032, T036, T038, T040, T041 |
| FR-016 | T006, T009, T015, T016 |
| FR-017 | T039, T049 |
| FR-018 | T042, T043 |
| FR-019 | T042, T043 |
| FR-020 | T027, T039, T041, T043 |
| FR-021 | T045, T046 |
| FR-022 | T013, T022, T023, T045 |
| FR-023 | T013, T017, T019, T020, T021, T047 |
| FR-024 | T013, T022, T023 |
| FR-025 | T048 |
| FR-026 | T013, T021, T047 |
| FR-027 | T027, T039, T048 |
| FR-028 | T016, T017, T042 |
| FR-029 | T007, T042, T044 |
| FR-030 | T015, T016 |
| SC-001 | T049 |
| SC-002 | T049 |
| SC-003 | T039, T041, T049 |
| SC-004 | T013, T047 |
| SC-005 | T013, T022, T023 |
| SC-006 | T013, T047 |
| SC-007 | T006, T018 |
| SC-008 | T015, T042 |

Casos límite de la especificación: dato pendiente (T015, T042), material que falta
(T018), cambio de fecha o lugar (T041, D7), entre meses (T042, T044), retos pasados
(T042), conexión lenta (T013, T047), impresión (T012, T021, T047), imágenes de menores
(T039; no automatizable).

---

## HUECOS nuevos (no escritos en `specs/` ni en los ADR)

| # | Hueco | Estado | Afecta a |
|---|---|---|---|
| N1 | La guía de autoalojamiento de Pages CMS describe `npm install`, `db:migrate`, `build` y `start`, sin imagen ni Dockerfile oficial (<https://pagescms.org/docs/guides/installing/self-host/>; el repositorio no tiene Dockerfile en la raíz). Cómo se empaqueta en Easypanel, y en el ensayo «con Docker», no está decidido | Abierto (se estudia en T030) | T030, T037 |
| N2 | Permisos que pide la GitHub App según la documentación: Administration y Actions con escritura, entre otros (<https://pagescms.org/docs/guides/installing/github-app/>); el ADR 0005 solo prohíbe «Workflows» | **Resuelto** (Michel, 2026-11-19): mínimo privilegio; se ensaya sin «Administration» ni «Actions» con escritura (T029, T030); T036 usa los permisos del ensayo. **Condición de parada**: si hace falta «Administration» con escritura, PARAR y ADR de Michel. Registrado en el ADR 0005 («Actualización 2026-11-19») | T029, T030, T036, T038 |
| N3 | Cómo reconoce «comprobar» un commit de la app (nombre/correo del autor): se obtiene en T030 y se guarda en `PANEL_APP_AUTOR` | Abierto (dato de T030) | T031, T032, T034, T035 |
| N4 | El quickstart D usa `persona.prueba@example.org`, que no puede recibir la invitación: hace falta un buzón de pruebas del centro | Abierto | T030, T041 |
| N5 | Nombres de los secretos del aviso | **Resuelto**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `AVISO_BUZON_COMISION`; variable `PANEL_APP_AUTOR` | T031–T035 |
| N6 | Cada integración en `main` despliega en el VPS (ADR 0001), antes de resolver H6 y H11 | **Resuelto**: lanzamiento sin anunciar con `noindex` en el HTML (T012) y `X-Robots-Tag: noindex` en nginx (T023) hasta el estreno (T050); la dirección no se anuncia. Registrado en el ADR 0016 «Lanzamiento sin anunciar» (borrador, pendiente del visto bueno de Michel) | T012, T022, T023, T050 |
| N7 | `OUTPUT_DIR` y compilación de las fixtures a `_site-fixtures/` | **Resuelto**: como se proponía | T012, T013 |
| N8 | Formatos de fechas de semana, tamaños, `h1` y títulos | **Resuelto**: los de «Path Conventions» | T005, T015, T017 |
| N9 | Navegación y pie (H12) | **Resuelto** para esta funcionalidad: `nav` con «Inicio» y «Calendario» y pie mínimo | T012, T043 |
| N10 | Quién actualiza «Comprobaciones» de AGENTS.md | **Resuelto**: la tarea que crea los scripts (T013, y T023 para `comprobar:cabeceras`) | T013, T023 |
| N11 | `actions/upload-artifact` para los informes de Lighthouse | **Resuelto**: acción oficial de GitHub; se fija y anota en T002 y se usa en T014 | T002, T014 |
| N12 | Quién hace los commits de las ramas `tarea/…` | **Resuelto**: el implementador no hace commits; Michel revisa el diff y hace commit, push y PR (ya está en AGENTS.md) | Todas las de código |
| N13 | Ramas `TNN` (AGENTS.md) frente a `T001` (Spec Kit) | **Resuelto**: tres cifras, `tarea/001-T005-…` (ya está en AGENTS.md, que admite agrupar varias tareas en una rama) | Todas |
| N14 | Quién administra la cuenta de envío y su contraseña de aplicación (ADR 0009 lo deja al centro) | Abierto | T028 |
| N15 | H11: declaración de accesibilidad (principio I), aviso legal e información de privacidad (ADR 0010) no están en la especificación 001 | **Resuelto** (Michel): van en la funcionalidad nueva 002 (páginas legales), que se especifica e implementa antes y DEBE estar integrada en `main`, con sus enlaces en el pie, antes de integrar la rama T022+T023 (hallazgo C2); en el estreno DEBE seguir publicada y al día, con la declaración actualizada con T047 (hallazgo C1). La declaración puede publicarse antes como «parcialmente conforme, en revisión», con fecha. No se acepta como pendiente | T022, T023, T050 |
| N17 | M7: PNG y JPG en cualquier tipo de material | **Resuelto** (Michel): PNG y JPG solo en `cartel` e `infografia`; el resto, solo PDF. En `contracts/reto.schema.json`, `contracts/panel-pages-cms.md`, T004, T006, T009 y T027. El panel no puede imponerlo por tipo; lo impone el validador | T004, T006, T009, T025, T027 |
| N16 | Borrar las ramas remotas de ensayo choca con «no borres ramas remotas» de AGENTS.md | **Resuelto** (Michel): se borran al acabar; excepción que escribe la sesión principal en AGENTS.md (hallazgo M2) | T024, T030 |

## Notes

- `.specify/extensions.yml` no existe: no hay ganchos `before_tasks` ni `after_tasks`.
- Corregido con los hallazgos de `/speckit-analyze`; siguiente paso previsto: visto bueno de Michel (y, si lo pide, otra pasada de `/speckit-analyze`).
- El implementador no hace commits: Michel revisa el diff y hace commit, push y PR de cada rama (N12, ya en AGENTS.md).
- Las tareas [MANUAL · Michel] no las ejecuta el implementador; la sesión principal recoge sus resultados en ESTADO.md y en los ADR.
- Ninguna tarea trata datos personales de visitantes ni datos de salud. Los únicos datos personales son los correos de quienes editan, en el VPS (ADR 0010).
