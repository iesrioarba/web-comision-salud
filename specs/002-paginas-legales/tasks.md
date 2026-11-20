---

description: "Lista de tareas de 002-paginas-legales (declaración de accesibilidad, aviso legal y privacidad)"
---

# Tasks: Páginas legales (declaración de accesibilidad, aviso legal y privacidad)

**Input**: Design documents from `/specs/002-paginas-legales/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: sí. Constitución (principio VII), ADR 0014 y AGENTS.md («primero la prueba o
la comprobación; luego el código»). Las pruebas se escriben primero y DEBEN fallar antes
de implementar, dentro de la misma rama (ver «Ramas y commits»).

**Organization**: por historia de usuario y prioridad: común (setup y fundacional) →
US1 declaración (P1) → US2 privacidad (P1) → US3 aviso legal (P2) → US4 mantenimiento
(P2) → cierre antes de integrar → actualizaciones ligadas a la 001 (después de integrar).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: la rama de esa tarea (o de su grupo) se puede hacer en paralelo con otras
  ramas: ficheros distintos y sin dependencias pendientes. En un grupo, el [P] va solo en
  la primera tarea y vale para la rama entera.
- **[Story]**: historia de usuario (US1…US4).
- **[MANUAL · Michel]**: lleva cuentas, secretos o gestiones con terceros (centro,
  dirección, DPD, quienes gestionan el VPS). NO la hace el implementador. Ningún dato
  personal ni secreto se escribe en el repositorio, en `tasks.md`, en los registros ni en
  los mensajes; las personas se nombran por su cargo.
- **(comprobación manual)**: la hace una persona; no lleva secretos.
- Referencias a la 001 con el prefijo «001-» (p. ej. 001-T030 es T030 de
  `specs/001-reto-octubre/tasks.md`).

Cada tarea indica: **Rama**, **Depende de**, **Ficheros**, **Hecho cuando** y
**Comprobación**. Al terminar cada rama, además: `npm run comprobar` en verde, `ESTADO.md`
actualizado y las tareas marcadas aquí (AGENTS.md, «Cómo se trabaja una tarea»).

**Revisión independiente antes de integrar (principio VII, FR-024)**: al cierre de cada
rama, Michel revisa el diff y lo anota en la PR. Además, el subagente `revisor` revisa
las PR que tocan `.github/workflows/` (grupos T006 y T019) y las que tocan los textos
legales o sus datos (grupos T009, T013, T015 y las ramas T028, T029 y T031). Sus
hallazgos se corrigen en la misma rama antes de integrar. Las PR que cambian el
contenido de un texto legal llevan además el visto bueno de la dirección anotado (T017,
FR-024a).

## Ramas y commits

- Ramas con tres cifras: `tarea/002-TNNN-descripcion`.
- **Pruebas e implementación en la misma rama y la misma PR**: primer commit con las
  pruebas, comprobadas en rojo en local; después, la implementación; la PR se abre con
  todo en verde. El implementador no hace commits: deja las pruebas en rojo, Michel las
  confirma y hace ese commit; luego sigue la implementación (AGENTS.md).

  | Grupo | Rama | Revisor |
  |---|---|---|
  | T006 + T007 + T008 | `tarea/002-T006-datos-legales` | sí (workflows) |
  | T009 + T010 + T011 | `tarea/002-T009-declaracion` | sí (texto legal) |
  | T013 + T014 | `tarea/002-T013-privacidad` | sí (texto legal) |
  | T015 + T016 | `tarea/002-T015-aviso-legal` | sí (texto legal) |
  | T019 + T020 + T021 | `tarea/002-T019-aviso-revision` | sí (workflows) |

  Ramas propias (sin grupo): `tarea/002-T005-fixture-legal`,
  `tarea/002-T012-prueba-panel`, `tarea/002-T022-guia`,
  `tarea/002-T028-datos-tratamiento`, `tarea/002-T029-resultado-panel` y
  `tarea/002-T031-estreno-legal` (estas tres últimas, primer commit con la prueba en
  rojo y después los datos).
- Las ramas `tarea/…` no lanzan Actions al hacer push (el flujo solo escucha `push` a
  `main` y `pull_request`); la PR se comprueba con el último commit.
- Rama de ensayo `ensayo/revision-declaracion` (T023): de usar y tirar, se borra al
  acabar (AGENTS.md).

## Path Conventions

Proyecto único en la raíz (plan.md, «Source Code»): `src/legal/` (lo que edita el
mantenedor o su suplente), `schemas/legal.schema.json`, `scripts/check-legal.js`,
`scripts/check-review-date.js`, `tests/unit/`, `tests/e2e/`, `tests/panel/`,
`tests/fixtures/legal-pendientes/`, `.github/workflows/`, `docs/guia-paginas-legales.md`.

Convenciones:
- `LEGAL_DATA_FILE`: fichero de datos legales (por defecto `src/legal/datos.yml`);
  `build:fixtures` lo fija a `<fixture>/legal.yml` si la carpeta lo trae.
- Datos inventados y evidentes en pruebas y fixtures: `accesibilidad@example.org`, CIF
  `X00000000`, «Calle Inventada 1, 00000 Ejemplo».
- Rutas `/accesibilidad/`, `/aviso-legal/`, `/privacidad/`; títulos y `h2` exactamente los
  de `contracts/paginas-legales.md`.
- Mientras la 001 no haga el estreno, `noindex` sigue en todas las páginas (ADR 0016);
  las páginas legales lo heredan de `base.njk`.

---

## Phase 1: Setup (gestiones previas)

**Purpose**: datos y comprobaciones que dependen de terceros y bloquean la integración.
Se pueden empezar ya, en paralelo con todo lo demás.

- [ ] T001 [P] [MANUAL · Michel] Obtener de la dirección el canal de contacto de accesibilidad del centro (HUECO H1) y los datos del centro ya disponibles (H2); sin ficheros del repositorio
  - **Rama**: no aplica · **Depende de**: —
  - **Pasos**: pedir a la dirección un canal del centro, no personal (correo institucional genérico o página del centro; caso límite «Canal de contacto de una persona»), para `accesibilidad.canal_contacto` (`tipo`: `correo` o `web`); preguntar qué datos de H2 se conocen ya (CIF, dirección postal, correo del centro, unidad que tramita las reclamaciones de accesibilidad).
  - **Hecho cuando**: el canal está confirmado por escrito por la dirección (por cargo) y se sabe qué datos de H2 hay y cuáles quedan `null`.
  - **Comprobación**: anotación en ESTADO.md (la redacta la sesión principal) con el canal y la lista de datos de H2 «conocido / pendiente», sin nombres de personas. **Bloquea la integración del grupo T006** (ADR 0017: sin canal, «comprobar» falla).

- [ ] T002 [P] [MANUAL · Michel] Comprobar con quienes gestionan el VPS los registros de acceso del proxy (Traefik) de Easypanel (ADR 0018, HUECO H6); sin ficheros del repositorio
  - **Rama**: no aplica · **Depende de**: —
  - **Pasos** (plan, «2. FR-019»):
    1. Ver si Traefik tiene `accessLog` activo, dónde escribe y cuánto conserva.
    2. Si está activo, por orden de preferencia: desactivarlo para el router de esta web (`observability.accessLogs: false`, Traefik ≥ 3.3); o quitar los campos de cliente (`ClientAddr`, `ClientHost`); o desactivarlo en todo Traefik.
    3. Tras unas visitas, mirar también los registros del contenedor de la web en Easypanel.
    4. Si no se puede desactivar: anotar qué se guarda, para qué y cuánto tiempo, para que T014 lo diga en `/privacidad/` (FR-021), y Michel revisa la decisión (caso límite «Proxy compartido del VPS»).
  - **Hecho cuando**: el resultado está escrito, sin IP ni datos, como «Actualización» del ADR 0018 (la redacta la sesión principal).
  - **Comprobación**: la actualización del ADR dice «registros de acceso: desactivados / sin campos de cliente / activos (qué, para qué, cuánto)». **Bloquea la integración del grupo T013** (el texto de privacidad debe ser verdad) y 001-T023.

- [ ] T003 [P] [MANUAL · Michel] Suplente nombrado por el centro y su cuenta de GitHub en el equipo `comision-salud` (FR-025, HUECO H4); sin ficheros del repositorio
  - **Rama**: no aplica · **Depende de**: —
  - **Pasos**: pedir a la dirección que nombre un suplente distinto de quien mantiene la web; anotar solo su cargo o función; que la persona tenga cuenta propia de GitHub (sin cuentas compartidas) y añadirla al equipo `comision-salud` (Write: crea ramas y PR).
  - **Hecho cuando**: hay suplente nombrado por cargo y su cuenta está en el equipo.
  - **Comprobación**: la página del equipo lista la cuenta (descrita sin nombre); el cargo queda anotado en ESTADO.md para T022.

- [ ] T004 [MANUAL · Michel] Crear la etiqueta `revision-declaracion` y la variable del repositorio `MANTENEDORES_WEB` (ADR 0019); sin ficheros del repositorio
  - **Rama**: no aplica · **Depende de**: T003
  - **Pasos**: en el repositorio, crear la etiqueta `revision-declaracion`; en «Settings → Secrets and variables → Actions → Variables», crear `MANTENEDORES_WEB` con las cuentas de GitHub de quien mantiene la web y del suplente, separadas por comas (formato que acepta `gh issue create --assignee`).
  - **Hecho cuando**: la etiqueta y la variable existen con esos nombres.
  - **Comprobación**: `gh label list` muestra `revision-declaracion`; `gh variable list` muestra `MANTENEDORES_WEB` (el valor no se copia en ningún sitio). Se prueba de verdad en T023.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: datos legales validados, filtro «Pendiente de confirmar», `comprobar:legal`
y su paso en «comprobar».

**Requisito de la 001**: empieza tras integrar 001-T012 (`base.njk`, `format.js`,
`eleventy.config.js`) y la rama 001-T013+T014 (`common.spec.js`, `playwright.config.js`,
`comprobar`, flujo).

**⚠️ CRITICAL**: ninguna historia empieza hasta integrar el grupo T006.

- [ ] T005 [P] Crear la fixture `tests/fixtures/legal-pendientes/` (contenido de la 001 + `legal.yml` inventado)
  - **Rama**: `tarea/002-T005-fixture-legal` · **Depende de**: 001-T013+T014 integrada
  - **Objetivo**: plan, «1.»; quickstart A6. Copia de `tests/fixtures/sin-reto-ni-anuncio/` (la de la 001 sin materiales, para no duplicar ficheros) más `legal.yml` con la forma de `contracts/legal.schema.json`: todo `null` donde el modelo lo permite (`cif`, `direccion_postal`, `correo`, `web`, `unidad_reclamaciones`, `responsable`, `base_legal`, `encargados`, `panel_comprobado`), `canal_contacto: { tipo: correo, valor: accesibilidad@example.org }`, constantes del modelo («IES Río Arba», «Departamento de Educación del Gobierno de Aragón», 20, 5, `protecciondatossecd@aragon.es`, `lugar` del ADR 0010), `situacion: parcialmente-conforme`, `en_revision: true`, fechas inventadas pasadas y 2 entradas inventadas en `contenido_no_accesible` (una `ambito: web` con `alternativa` y otra sin ella).
  - **Hecho cuando**: la carpeta existe, el contenido de la 001 sigue siendo válido y ningún dato es real.
  - **Comprobación**: `CONTENT_DIR=tests/fixtures/legal-pendientes npm run comprobar:contenido` → «Contenido correcto» (si el validador de la 001 rechaza `legal.yml` por fichero desconocido: PARAR y avisar); `grep -ri '@' tests/fixtures/legal-pendientes` solo devuelve `example.org` y el correo constante del DPD. La validez de `legal.yml` frente al esquema se prueba en T006.

- [ ] T006 [P] Escribir las pruebas unitarias de `check-legal` y de los filtros nuevos en `tests/unit/check-legal.test.js` y `tests/unit/format.test.js` (en rojo)
  - **Rama**: `tarea/002-T006-datos-legales` (grupo T006 + T007 + T008; primer commit) · **Depende de**: T005
  - **Interfaz que fijan las pruebas**: `checkLegal(data, { mode, today, homeHtml })` de `scripts/check-legal.js`, con `mode` `base`, `panel` o `estreno`, devuelve `{ errors: [{ field, message }], modeApplied }`; como orden, lee `LEGAL_DATA_FILE` (por defecto `src/legal/datos.yml`), admite `--panel` y `--estreno`, imprime los errores en español y sale con 1, o «Datos legales correctos (<modo>)» y 0.
  - **Casos** (data-model.md, «Reglas por momento» y entidades; copias temporales de `tests/fixtures/legal-pendientes/legal.yml`, sin ficheros nuevos en el repositorio):
    - Válido: `legal-pendientes/legal.yml` en modo `base`.
    - Esquema (DEBEN fallar, con fichero, campo y qué corregir): `canal_contacto: null` («no puede estar pendiente», FR-023 excepción 1); un texto `""` o solo espacios; un texto que contiene «pendiente» o «PENDIENTE» («escribe null, no “pendiente”»); `cif` que no cumple `^[A-Z0-9]{9}$`; `web` sin `^https://`; `canal_contacto.tipo: correo` con valor que no es email y `tipo: web` sin `https://`; `plazo_respuesta_dias_habiles` distinto de 20; `plazo_contenido_panel_dias_lectivos` distinto de 5; `situacion` fuera de `totalmente-conforme`, `parcialmente-conforme`, `no-conforme`; `grupo` fuera de `falta-de-conformidad`, `carga-desproporcionada`, `fuera-de-ambito`; `ambito` fuera de `web`, `panel`; `contenido` > 200, `motivo` > 400; `encargados` como lista vacía o con un elemento > 200; `dpd_correo` distinto de `protecciondatossecd@aragon.es`.
    - Entre campos: `fecha_preparacion` > `fecha_ultima_revision`; `fecha_ultima_revision` posterior a `today` (inyectada); fecha imposible `2026-02-30`.
    - Modo `panel`: falla con `responsable` o `base_legal` en `null` (excepción 2); pasa con los dos rellenos.
    - Modo `estreno`: falla con cualquier `null` (nombra cada campo), con `en_revision: true` o con `panel_comprobado: null`; pasa con todo relleno.
    - Detección del estreno: con `homeHtml` sin `<meta name="robots" content="noindex">`, el modo `base` aplica las reglas de `estreno` y `modeApplied` es `estreno`; con `noindex`, no; si no hay `homeHtml` (no se ha compilado), se aplica el modo pedido y el mensaje lo dice.
    - Filtros en `format.test.js`: `pendiente(null)` → «Pendiente de confirmar»; `pendiente("X")` → «X»; `dateNoWeekday("2026-11-19")` → «19 de noviembre de 2026».
  - **Hecho cuando**: las pruebas existen y fallan porque `scripts/check-legal.js` y los filtros no existen.
  - **Comprobación**: `node --test tests/unit/check-legal.test.js tests/unit/format.test.js` falla por módulo o función inexistente, en local, antes del primer commit.

- [ ] T007 Implementar el esquema, los filtros, la carga de datos y `scripts/check-legal.js` en `schemas/legal.schema.json`, `src/lib/format.js`, `eleventy.config.js`, `src/legal/legal.11tydata.js`, `src/legal/datos.yml` y `package.json`
  - **Rama**: `tarea/002-T006-datos-legales` (después del primer commit) · **Depende de**: T006
  - **Ficheros y reglas**:
    - `schemas/legal.schema.json`: copia idéntica de `specs/002-paginas-legales/contracts/legal.schema.json`.
    - `src/lib/format.js`: filtros `pendiente` y `dateNoWeekday` (solo `Intl`); registrados en `eleventy.config.js` sin cambiar nada más.
    - `src/legal/legal.11tydata.js`: lee `process.env.LEGAL_DATA_FILE || 'src/legal/datos.yml'` con `yaml`, lo valida con `checkLegal` en modo `base` (si hay errores, la compilación falla con el mensaje en español) y expone `legal`, `layout` (el de `base.njk`) y `templateEngineOverride: "njk,md"` (research R1). No cambia el `markdownTemplateEngine` global.
    - `src/legal/datos.yml`: datos reales confirmados en T001 (canal de contacto) y el resto `null` si no se conocen (FR-022, nunca inventados); `situacion: parcialmente-conforme`, `en_revision: true`, `panel_comprobado: null`; `fecha_preparacion`, `fecha_situacion` y `fecha_ultima_revision` = la fecha de integración que fije Michel (H10); `contenido_no_accesible` con las dos entradas de la situación real (FR-011; no es una regla de número mínimo, T031 las actualiza): «Materiales PDF aún sin revisar» (`falta-de-conformidad`, `web`, alternativa: pedirlos en formato accesible por el canal; caso límite) y «Genially “El Arbalquimista de la salud”» (`fuera-de-ambito`, `web`, contenido de terceros solo enlazado).
    - `package.json`: `comprobar:legal` (`node scripts/check-legal.js`); `build:fixtures` pasa `LEGAL_DATA_FILE=<fixture>/legal.yml` si existe.
  - **Hecho cuando**: las pruebas de T006 pasan y `npm run build` y `npm run build:fixtures` compilan.
  - **Comprobación**: `node --test tests/unit/` en verde; `diff specs/002-paginas-legales/contracts/legal.schema.json schemas/legal.schema.json` sin diferencias; `npm run comprobar:legal` → 0; `npm run comprobar:legal -- --panel` → ≠ 0 (quickstart A1, A2); con una copia temporal de `datos.yml` con `canal_contacto: null`, `LEGAL_DATA_FILE=<temporal> npm run build` falla con el mensaje en español.

- [ ] T008 Añadir `comprobar:legal` a `npm run comprobar`, a «comprobar» de `.github/workflows/despliegue.yml` y a la sección «Comprobaciones» de `AGENTS.md`
  - **Rama**: `tarea/002-T006-datos-legales` · **Depende de**: T007; para integrar la PR del grupo, T001
  - **Objetivo**: FR-023 automático (plan, «Trazabilidad»); misma secuencia en local y en Actions (001-T013). `comprobar:legal` va justo después de `build:fixtures` (necesita `_site/index.html` para detectar el estreno). En el flujo, paso con nombre «Comprobar páginas legales», en el mismo orden. En `AGENTS.md`, «Comprobaciones»: una línea `npm run comprobar:legal` (y sus variantes `-- --panel` antes de 001-T040 y `-- --estreno` en 001-T050) con qué comprueba (ajuste 10 del plan, sustituye a la propuesta de que lo hiciera la sesión principal).
  - **Hecho cuando**: `npm run comprobar` incluye `comprobar:legal` y falla si `canal_contacto` es `null`; el flujo tiene el paso; `AGENTS.md` tiene la línea.
  - **Comprobación**: `npm run comprobar` con código 0; en local, sin integrar, con `canal_contacto: null`, `npm run comprobar` falla en ese paso; `git diff AGENTS.md` solo cambia «Comprobaciones»; PR del grupo en verde y su registro muestra «Comprobar páginas legales».
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR del grupo (toca `.github/workflows/`).

**Checkpoint**: datos legales validados y bloqueo del canal activo.

---

## Phase 3: User Story 1 - Declaración de accesibilidad y pie (Priority: P1) 🎯 MVP

**Goal**: `/accesibilidad/` con los seis apartados en orden y el canal de contacto, y el
enlace «Declaración de accesibilidad» en el pie de todas las páginas, 404 incluida.

**Independent Test**: desde cualquier página, con teclado, se llega a la declaración y se
encuentra el canal de contacto y el plazo de 20 días hábiles (quickstart B: US1-1 a US1-6).

**Rama del grupo**: `tarea/002-T009-declaracion` (T009 + T010 + T011).

### Tests for User Story 1 ⚠️

- [ ] T009 [P] [US1] Escribir los escenarios de la declaración y del pie en `tests/e2e/legal-pages.spec.js` y `tests/e2e/common.spec.js` (en rojo)
  - **Rama**: `tarea/002-T009-declaracion` (primer commit) · **Depende de**: grupo T006 integrado
  - **Casos**:
    - `common.spec.js`, en CADA página de CADA proyecto (también `/404.html`): dentro del `footer`, un `nav` con nombre accesible «Información legal» con un `ul` cuyo enlace «Declaración de accesibilidad» apunta a `/accesibilidad/` (ruta absoluta); en `/accesibilidad/`, ese enlace lleva `aria-current="page"`. La lista de enlaces esperados es un array que amplían T013 y T015, en el orden del contrato.
    - `legal-pages.spec.js`, proyecto `real`, en `/accesibilidad/`: `title` «Declaración de accesibilidad · Comisión de Salud · IES Río Arba»; un `h1`; párrafo «Última actualización: <fecha larga sin día de la semana>»; los seis `h2` exactamente en el orden del contrato («Compromiso y alcance», «Situación de cumplimiento», «Contenido no accesible», «Preparación de la declaración», «Observaciones y datos de contacto», «Procedimiento de aplicación») (SC-004); «panel de edición» dentro de «Compromiso y alcance» (FR-009); los tres usos del canal: comunicar un problema, pedir información en formato accesible y presentar una queja (FR-013); «parcialmente conforme» y «Esta declaración está en revisión» (US1-3); un `h3` por grupo con entradas; cada entrada de `contenido_no_accesible` de `datos.yml` aparece en `/accesibilidad/` (la prueba lee `datos.yml` y no fija cuántas son); el texto fijo «La accesibilidad del panel de edición aún no se ha comprobado» mientras `panel_comprobado` es `null`; la alternativa del panel con «5 días lectivos»; el canal como enlace `mailto:` o `https://`; «20 días hábiles»; ni `form`, `img`, `video`, `iframe` ni `audio` (FR-007).
    - Proyecto `legal-pendientes`: las dos entradas fijas de `contenido_no_accesible` de la fixture; «Pendiente de confirmar» en la dirección de la web y en la unidad de reclamaciones; ningún `dd` ni `li` vacío; la entrada sin `alternativa` no muestra «Alternativa:».
  - **Hecho cuando**: las pruebas existen y fallan porque no hay pie legal ni página.
  - **Comprobación**: `npm run build && npm run build:fixtures && npx playwright test tests/e2e/legal-pages.spec.js tests/e2e/common.spec.js` falla en esos casos, en local, antes del primer commit.

### Implementation for User Story 1

- [ ] T010 [US1] Añadir el `nav` «Información legal» al `footer` de `src/_includes/layouts/base.njk` con el enlace a la declaración
  - **Rama**: `tarea/002-T009-declaracion` · **Depende de**: T009
  - **Objetivo**: contrato, «Pie de TODAS las páginas»; FR-002. `nav` con `aria-label="Información legal"`, `ul`, enlace absoluto y `aria-current="page"` si `page.url` coincide. No toca el resto de `base.njk` (ni el `noindex`).
  - **Hecho cuando**: los casos de `common.spec.js` de T009 pasan.
  - **Comprobación**: `npx playwright test tests/e2e/common.spec.js` en verde.

- [ ] T011 [US1] Escribir la declaración en `src/legal/declaracion-accesibilidad.md`
  - **Rama**: `tarea/002-T009-declaracion` · **Depende de**: T010; para integrar, T017 (visto bueno de la dirección)
  - **Objetivo**: FR-008 a FR-015 y FR-011a, contrato «`/accesibilidad/`». Front matter: `title: Declaración de accesibilidad`, `permalink: /accesibilidad/`, `actualizado: <AAAA-MM-DD>`. Todos los datos con `{{ legal.… | pendiente }}`; la situación y el contenido no accesible se generan desde `datos.yml` (bucle Nunjucks), nunca escritos a mano. Español claro para 12 años con explicación de cada término legal (FR-004). Método: autoevaluación con herramientas automáticas y revisión manual con teclado y lector de pantalla. Los tres usos del canal de FR-013 y el procedimiento de FR-014.
  - **Hecho cuando**: todas las pruebas de T009 pasan y `npm run comprobar` sigue en verde.
  - **Comprobación**: `npx playwright test tests/e2e/legal-pages.spec.js` en verde; `npm run comprobar` con código 0 (axe 0 infracciones, `linkinator` sin enlaces rotos); recorrido con teclado desde `/` hasta el canal descrito en la PR; PR del grupo en verde.
  - **Revisión**: Michel; subagente `revisor` (texto legal, contra el modelo de la Decisión (UE) 2018/1523 y FR-008 a FR-015); visto bueno de la dirección anotado (T017).

- [ ] T012 [P] [US1] Crear la prueba manual de accesibilidad del panel en `tests/panel/panel-accessibility.spec.js` y separarla de «comprobar» en `playwright.config.js`
  - **Rama**: `tarea/002-T012-prueba-panel` · **Depende de**: 001-T013+T014 integrada
  - **Objetivo**: FR-011a, SC-009, research R6. Se ejecuta solo a mano en 001-T030 con `PANEL_URL`; si falta, termina con un mensaje en español. Navegador visible; `page.pause()` para que la persona entre a mano; no guarda la sesión en disco (sin `storageState`). Recorre: inicio de sesión, lista de entradas, edición de un reto, subida de un material, lista de materiales y, si existe, colaboradores (la ruta de cada pantalla se pide en la pausa o se navega a mano: HUECO H8). En cada una, axe con `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Informe solo con pantalla, regla, impacto y número de nodos: sin correos ni textos de la página. En `playwright.config.js`, un proyecto `panel` con `testDir: tests/panel` y sin `webServer`, que los demás proyectos no incluyen y que `comprobar:web` no ejecuta.
  - **Hecho cuando**: la prueba existe y `npm run comprobar` no la ejecuta.
  - **Comprobación**: `npx playwright test --list` sin `--project=panel` no la lista; `npx playwright test --project=panel --list` sí; sin `PANEL_URL`, `npx playwright test --project=panel` termina con el mensaje en español; `npm run comprobar` con código 0. Se usa de verdad en 001-T030.

**Checkpoint (MVP)**: la declaración se publica con canal y desde todas las páginas.

---

## Phase 4: User Story 2 - Información de privacidad (Priority: P1)

**Goal**: `/privacidad/` con las dos partes: visitantes (sin datos) y quienes editan
(tratamiento del ADR 0010), con «Pendiente de confirmar» donde falte.

**Independent Test**: una familia entiende que visitar la web no recoge datos y una
persona de la comisión encuentra responsable, finalidad, derechos y DPD (quickstart B:
US2-1 a US2-4).

**Rama del grupo**: `tarea/002-T013-privacidad` (T013 + T014).

### Tests for User Story 2 ⚠️

- [ ] T013 [P] [US2] Escribir los escenarios de privacidad en `tests/e2e/legal-pages.spec.js` y ampliar el pie en `tests/e2e/common.spec.js` (en rojo)
  - **Rama**: `tarea/002-T013-privacidad` (primer commit) · **Depende de**: grupo T009 integrado
  - **Casos**: `common.spec.js`: el array de enlaces del pie pasa a «Declaración de accesibilidad», «Privacidad» (T015 inserta «Aviso legal» en medio). `/privacidad/`: `title` «Privacidad · Comisión de Salud · IES Río Arba»; un `h1`; «Última actualización»; `h2` «Si visitas la web» y «Si editas la web desde el panel», en ese orden (FR-018); en la primera, sin formularios, cookies, analítica ni terceros y «sin dirección IP»; en la segunda: responsable, DPD como `mailto:protecciondatossecd@aragon.es`, finalidad, base legal, datos (correo y datos técnicos de la sesión), cookie técnica de sesión, lugar («Fráncfort, Alemania»), encargados, conservación, derechos y reclamación ante la AEPD con enlace «(sitio externo)» sin `target`; ni `form`, `img`, `video`, `iframe`. Proyecto `legal-pendientes`: «Pendiente de confirmar» en responsable, base legal y encargados.
  - **Hecho cuando**: las pruebas existen y fallan porque no hay página.
  - **Comprobación**: `npx playwright test tests/e2e/legal-pages.spec.js tests/e2e/common.spec.js` falla en esos casos, en local, antes del primer commit.

### Implementation for User Story 2

- [ ] T014 [US2] Escribir `src/legal/privacidad.md` y añadir «Privacidad» al pie de `src/_includes/layouts/base.njk`
  - **Rama**: `tarea/002-T013-privacidad` · **Depende de**: T013; para integrar, T002 (resultado del proxy) y T017
  - **Objetivo**: FR-018 a FR-021, contrato «`/privacidad/`». Front matter `title: Privacidad`, `permalink: /privacidad/`, `actualizado`. Describe SOLO lo que se hace (FR-021): nginx sin registros de visitas y errores sin IP (ADR 0018); lo que diga T002 del proxy (si guarda algo: qué, para qué y cuánto tiempo). Datos del tratamiento con `{{ legal.tratamiento_editores.… | pendiente }}`; ningún encargado supuesto (H3). «Datos técnicos de la sesión» sin detallar hasta 001-T030 (H9; lo completa T029). Se publica antes de consultar al DPD: responsable, base legal y encargados figuran como «Pendiente de confirmar» hasta T018 y T028 (FR-022, FR-024a).
  - **Hecho cuando**: todas las pruebas de T013 pasan y `npm run comprobar` sigue en verde.
  - **Comprobación**: `npx playwright test tests/e2e/legal-pages.spec.js` en verde; `npm run comprobar` con código 0; recorrido con teclado descrito en la PR; PR del grupo en verde.
  - **Revisión**: Michel; subagente `revisor` (texto legal, FR-018 a FR-021 y ADR 0018); visto bueno de la dirección anotado (T017).

**Checkpoint**: US1 y US2 (las dos P1) funcionan.

---

## Phase 5: User Story 3 - Aviso legal (Priority: P2)

**Goal**: `/aviso-legal/` con el titular, para qué es la web y los enlaces externos.

**Independent Test**: se encuentra el titular y su correo (o «Pendiente de confirmar»)
desde el pie (quickstart B: US3-1 a US3-3).

**Rama del grupo**: `tarea/002-T015-aviso-legal` (T015 + T016).

### Tests for User Story 3 ⚠️

- [ ] T015 [P] [US3] Escribir los escenarios del aviso legal en `tests/e2e/legal-pages.spec.js` y completar el pie en `tests/e2e/common.spec.js` (en rojo)
  - **Rama**: `tarea/002-T015-aviso-legal` (primer commit) · **Depende de**: grupo T013 integrado (comparten `base.njk` y los dos `spec`)
  - **Casos**: pie con los tres enlaces en el orden del contrato: «Declaración de accesibilidad», «Aviso legal», «Privacidad» (SC-001). `/aviso-legal/`: `title` «Aviso legal · Comisión de Salud · IES Río Arba»; un `h1`; «Última actualización»; `h2` «Quién es el titular», «Para qué es esta web», «Enlaces a otros sitios»; titular «IES Río Arba» y «Departamento de Educación del Gobierno de Aragón»; CIF, dirección y correo (FR-016); no se responde de los sitios externos (FR-017); ni `form`, `img`, `video`, `iframe` ni `audio` (FR-007). Proyecto `legal-pendientes`: «Pendiente de confirmar» en CIF, dirección y correo.
  - **Hecho cuando**: las pruebas existen y fallan porque no hay página.
  - **Comprobación**: `npx playwright test tests/e2e/legal-pages.spec.js tests/e2e/common.spec.js` falla en esos casos, en local, antes del primer commit.

### Implementation for User Story 3

- [ ] T016 [US3] Escribir `src/legal/aviso-legal.md` y añadir «Aviso legal» al pie de `src/_includes/layouts/base.njk`
  - **Rama**: `tarea/002-T015-aviso-legal` · **Depende de**: T015; para integrar, T017
  - **Objetivo**: FR-016, FR-017, contrato «`/aviso-legal/`». Front matter `title: Aviso legal`, `permalink: /aviso-legal/`, `actualizado`.
  - **Hecho cuando**: todas las pruebas de T015 pasan y `npm run comprobar` sigue en verde.
  - **Comprobación**: `npx playwright test` en verde; `npm run comprobar` con código 0 (incluido `comprobar:enlaces`: los tres enlaces del pie existen, caso límite «Página legal no encontrada»); recorrido con teclado por el pie descrito en la PR; PR del grupo en verde.
  - **Revisión**: Michel; subagente `revisor` (texto legal); visto bueno de la dirección anotado (T017).

- [ ] T017 [MANUAL · Michel] Visto bueno de la dirección a los textos legales, anotado en cada PR (FR-024a, HUECO H11); sin ficheros del repositorio
  - **Rama**: no aplica (se hace sobre las PR abiertas de los grupos T009, T013 y T015, y de las ramas T028, T029 y T031) · **Depende de**: la PR correspondiente en verde
  - **Pasos**: enviar a la dirección el texto tal como se verá (la página compilada en local o el diff); recoger su visto bueno; anotarlo en la PR como comentario de Michel con el cargo y la fecha, sin nombres ni correos.
  - **Hecho cuando**: cada PR que cambia contenido legal tiene el comentario antes de integrarse.
  - **Comprobación**: el comentario existe en la PR («Visto bueno de la dirección (cargo), AAAA-MM-DD»).

- [ ] T018 [MANUAL · Michel] Consultar al DPD la parte de privacidad de quienes editan (FR-024a, HUECO H3); sin ficheros del repositorio
  - **Rama**: no aplica · **Depende de**: T014 (borrador del texto)
  - **Pasos**: enviar a `protecciondatossecd@aragon.es` (por el canal que use el centro) el texto de «Si editas la web desde el panel» y preguntar: responsable, base legal, encargados (¿proveedor del VPS?, ¿Google por el SMTP del ADR 0009?) y conservación. No suponer ninguno.
  - **Hecho cuando**: hay respuesta escrita del DPD (o de la dirección tras consultarlo) con esos datos.
  - **Comprobación**: anotación en ESTADO.md (sesión principal) con la fecha y los datos, sin nombres de personas. Alimenta T028; **bloquea 001-T040**. No bloquea integrar el grupo T013: hasta T028, esos tres datos figuran como «Pendiente de confirmar» (FR-024a).

---

## Phase 6: User Story 4 - Mantener las páginas al día (Priority: P2)

**Goal**: aviso anual automático, guía del cambio para el mantenedor y el suplente, y
prueba de que el suplente puede hacerlo solo.

**Independent Test**: el suplente, solo con la guía y desde la web de GitHub, cambia la
fecha de la última revisión en una rama y abre una PR en verde (C8, SC-008).

**Rama del grupo**: `tarea/002-T019-aviso-revision` (T019 + T020 + T021).

### Tests for User Story 4 ⚠️

- [ ] T019 [P] [US4] Escribir las pruebas del aviso de revisión en `tests/unit/check-review-date.test.js` (en rojo)
  - **Rama**: `tarea/002-T019-aviso-revision` (primer commit) · **Depende de**: grupo T006 integrado
  - **Interfaz**: `reviewStatus(lastReview, today)` de `scripts/check-review-date.js` devuelve `{ state: 'ok' | 'proxima' | 'vencida', dueDate }`, con vencimiento = `fecha_ultima_revision` + 1 año y «próxima» = faltan 30 días o menos (contrato, «Aviso de revisión anual»). La orden admite `--today AAAA-MM-DD` y `--format actions | issue`.
  - **Casos** (fechas inventadas; quickstart A5): 100 días tras la revisión → `ok`; 334 días → `ok` (faltan 31); 340 días → `proxima`; 400 días → `vencida`; 29 de febrero → vence el 28 de febrero o el 1 de marzo (lo que diga la prueba, documentado); en modo `actions`, `proxima` imprime `::warning title=Declaración de accesibilidad::La revisión anual vence el <fecha larga>` y `vencida` «… venció el <fecha>»; escribe lo mismo en el fichero de `GITHUB_STEP_SUMMARY` si existe; SIEMPRE sale con 0 (FR-027: no bloquea), también si `datos.yml` no se puede leer (entonces avisa); en modo `issue`, imprime título «Revisión anual de la declaración de accesibilidad (vence el <fecha>)» y el cuerpo con la lista de la guía (situación, contenido no accesible, contacto, encargados, flujo programado activo).
  - **Hecho cuando**: las pruebas existen y fallan porque el script no existe.
  - **Comprobación**: `node --test tests/unit/check-review-date.test.js` falla por módulo inexistente, en local, antes del primer commit.

### Implementation for User Story 4

- [ ] T020 [US4] Implementar `scripts/check-review-date.js`, el script `aviso:revision` en `package.json` y el paso «Aviso de revisión de la declaración» en `.github/workflows/despliegue.yml`
  - **Rama**: `tarea/002-T019-aviso-revision` · **Depende de**: T019
  - **Objetivo**: ADR 0019. Sin dependencias nuevas. `aviso:revision` se añade al final de `npm run comprobar` (mismo orden que Actions) y nunca lo hace fallar. En el flujo, paso con ese nombre en «comprobar» (se ejecuta en cada PR y en cada push a `main`, FR-027), con `--format actions`.
  - **Hecho cuando**: las pruebas de T019 pasan; `npm run comprobar` sigue en verde.
  - **Comprobación**: `node --test tests/unit/` en verde; en local, sin integrar, con una copia de `datos.yml` con fecha de hace 400 días, `LEGAL_DATA_FILE=<temporal> npm run aviso:revision` imprime el `::warning` y sale con 0 (quickstart A9).

- [ ] T021 [US4] Crear el flujo programado `.github/workflows/revision-declaracion.yml`
  - **Rama**: `tarea/002-T019-aviso-revision` · **Depende de**: T020
  - **Objetivo**: ADR 0019 y contrato. `on: schedule` semanal (un `cron` fijo, p. ej. lunes a las 07:00 UTC) y `workflow_dispatch`; `permissions: { contents: read, issues: write }` y nada más; solo `actions/checkout` y `actions/setup-node`, las mismas que fije 001-T002, por SHA completo con comentario de versión (`# vX.Y.Z`) y con `persist-credentials: false` en el checkout (regla del ADR 0007) (`node-version-file: .nvmrc`); `npm ci`; `check-review-date.js --format issue`; si toca avisar y `gh issue list --label revision-declaracion --state open` está vacío, `gh issue create` con la etiqueta y `--assignee` desde `vars.MANTENEDORES_WEB`; `GH_TOKEN: ${{ github.token }}`. Los valores de `vars` y `github` que use un paso `run` se pasan por `env:` y se usan como variables de entorno (`$MANTENEDORES_WEB`), nunca con `${{ }}` dentro del script (prevención de inyección de scripts). Nunca crea dos. Sin secretos ni acciones de terceros.
  - **Hecho cuando**: el flujo existe con esos permisos y pasos, y la PR del grupo está en verde.
  - **Comprobación**: revisión del YAML (permisos exactos, sin `pull_request` ni `push`); `gh workflow view revision-declaracion.yml` tras integrar; prueba real en T023.
  - **Revisión**: Michel revisa el diff y el subagente `revisor` revisa la PR del grupo (toca `.github/workflows/`, permisos del `GITHUB_TOKEN`, y que ningún paso `run` use `${{ }}` dentro del script: `vars` y `github` solo por `env:`).

- [ ] T022 [P] [US4] Escribir la guía del cambio en `docs/guia-paginas-legales.md`
  - **Rama**: `tarea/002-T022-guia` · **Depende de**: grupos T009, T013, T015 y T019 integrados (describe lo que existe); T003 (cargo del suplente)
  - **Objetivo**: FR-025, FR-026, plan «6.». Lenguaje sencillo, pasos numerados: quién puede cambiar estas páginas (mantenedor y suplente, por cargo; la comisión no, desde el panel tampoco); desde la web de GitHub: abrir el fichero, lápiz «Edit», «Commit changes» → «Create a new branch» → abrir la PR; qué fichero tocar para cada cambio (dato → `src/legal/datos.yml`, escribir `null` si no está confirmado, nunca «pendiente»; texto → el `.md`; no tocar lo que va entre `{{ … }}`); cambiar `actualizado`; visto bueno de la dirección y, para el tratamiento, consulta al DPD, anotados en la PR; cómo ver que la PR está en verde y qué hacer si sale en rojo; revisión anual con su lista (situación, contenido no accesible, contacto, encargados, comprobar que el flujo programado `revision-declaracion` está activo y reactivarlo si GitHub lo desactivó); actualización del estreno (001-T047 → T031); qué hacer con la incidencia anual; cómo cambiar la variable `MANTENEDORES_WEB` («Settings → Secrets and variables → Actions → Variables») cuando cambie el suplente o quien mantiene la web; cómo se publica el contenido de quien no puede usar el panel (5 días lectivos desde que llega al canal, calendario escolar de Aragón, H13).
  - **Hecho cuando**: la guía cubre todos esos puntos sin datos personales.
  - **Comprobación**: revisión del `revisor` contra esta lista; `npm run comprobar` con código 0; prueba real en T024.

- [ ] T023 [US4] [MANUAL · Michel] Probar el flujo anual con una fecha vencida en la rama de ensayo `ensayo/revision-declaracion` (quickstart C7)
  - **Rama**: `ensayo/revision-declaracion` (de usar y tirar) · **Depende de**: T004, T021 integrado (el flujo debe estar en `main` para lanzarlo a mano)
  - **Pasos**: crear la rama desde `main`; poner una `fecha_ultima_revision` inventada de hace 400 días; lanzar el flujo a mano eligiendo esa rama (`gh workflow run revision-declaracion.yml --ref ensayo/revision-declaracion`); comprobar la incidencia; lanzarlo otra vez; cerrar la incidencia de prueba y borrar la rama local y remota.
  - **Hecho cuando**: la primera ejecución crea UNA incidencia con la etiqueta y asignada a las cuentas de `MANTENEDORES_WEB`; la segunda no crea otra.
  - **Comprobación**: `gh issue list --label revision-declaracion --state all` muestra una sola incidencia de la prueba; registro de las dos ejecuciones en verde; resultado en ESTADO.md.

- [ ] T024 [US4] Prueba del suplente solo con la guía (quickstart C8, SC-008) (comprobación manual)
  - **Rama**: la crea el suplente desde la web de GitHub · **Depende de**: T003, T022 integrada
  - **Pasos**: el suplente, sin ayuda y solo con `docs/guia-paginas-legales.md`, cambia en el navegador `fecha_ultima_revision` (o la situación) en una rama nueva y abre la PR. Michel cierra la PR sin integrarla si el cambio era solo de prueba.
  - **Hecho cuando**: la PR del suplente sale en verde sin ayuda.
  - **Comprobación**: enlace a la PR (cerrada) en ESTADO.md y «sí/no» por paso, sin nombres; lo que falle en la guía es una tarea nueva.

**Checkpoint**: las cuatro historias funcionan. La 002 está lista para integrarse antes
de la rama 001-T022+T023.

---

## Phase 7: Polish (antes de la rama 001-T022+T023)

- [ ] T025 Comprobaciones a mano C1, C2 y C3 de `specs/002-paginas-legales/quickstart.md` en las tres páginas y en `/404.html` (comprobación manual)
  - **Depende de**: grupo T015 integrado
  - **Pasos**: C1 teclado (se llega a los tres enlaces del pie y se recorren las páginas; foco visible); C2 NVDA + Firefox o VoiceOver + Safari (navegación por encabezados; se anuncia el `nav` «Información legal»); C3 impresión (legibles, sin menús ni pie).
  - **Hecho cuando**: los tres puntos tienen resultado; lo que falle es una tarea nueva.
  - **Comprobación**: tabla con navegador y lector usados, en ESTADO.md o en la PR de cierre.

- [ ] T026 Revisión de los textos contra el modelo europeo y FR-004 a FR-017 (quickstart C4)
  - **Depende de**: T025
  - **Pasos**: el subagente `revisor` compara las tres páginas compiladas con el modelo de la Decisión de Ejecución (UE) 2018/1523, con FR-008 a FR-017 y con «español claro para 12 años»; Michel confirma.
  - **Hecho cuando**: ningún apartado falta y ningún dato está inventado (SC-004, SC-005).
  - **Comprobación**: informe del `revisor` sin hallazgos abiertos.

**Checkpoint (integración de la 002)**: T001, T002, T017 y los grupos o ramas T005,
T006, T009, T012, T013, T015, T019 y T022 integrados en `main`, y T025 y T026 hechos.
Desde aquí se puede integrar la rama 001-T022+T023. T003, T004, T018, T023 y T024 pueden
terminar después, pero antes del estreno.

---

## Phase 8: Actualizaciones ligadas a la 001 (después de integrar la 002)

**Purpose**: completar la declaración y la privacidad con lo que sale de la 001 y dejar
todo listo para el estreno (US4-1).

- [ ] T027 Comprobaciones C5 y C6 en la web publicada (comprobación manual con quienes gestionan el VPS)
  - **Depende de**: 001-T023 integrado y desplegado; T002
  - **Pasos**: C5 herramientas del navegador en `/accesibilidad/`, `/aviso-legal/` y `/privacidad/` publicadas: 0 cookies y 0 peticiones a terceros; C6 tras unas visitas, `docker logs` del servicio web en el VPS sin IP ni líneas de acceso, y el proxy según la actualización del ADR 0018.
  - **Hecho cuando**: C5 y C6 dan el resultado esperado (SC-007); si no, PARAR (la privacidad no sería verdad, FR-021).
  - **Comprobación**: resultado descrito, sin IP, en ESTADO.md.

- [ ] T028 [US4] Rellenar los datos del tratamiento tras la consulta al DPD en `src/legal/datos.yml` (antes de 001-T040)
  - **Rama**: `tarea/002-T028-datos-tratamiento` · **Depende de**: T018
  - **Primer commit (en rojo)**: en `tests/e2e/legal-pages.spec.js`, proyecto `real`: `/privacidad/` ya no contiene «Pendiente de confirmar» en responsable ni en base legal.
  - **Después**: `responsable`, `base_legal` y `encargados` (o `null` si el DPD dice que no hay; cada elemento 1 a 200 caracteres) según T018; si cambia lo que se trata, ajustar `privacidad.md` y su `actualizado` (FR-021).
  - **Hecho cuando**: `npm run comprobar:legal -- --panel` sale con 0 y la prueba pasa.
  - **Comprobación**: salida de `npm run comprobar:legal -- --panel` (quickstart A2); `npm run comprobar` con código 0; PR en verde con el visto bueno de la dirección (T017) y la referencia a la consulta al DPD.
  - **Revisión**: Michel y subagente `revisor` (texto legal).

- [ ] T029 [US4] Añadir a la declaración y a la privacidad el resultado del ensayo de accesibilidad del panel (001-T030) en `src/legal/datos.yml` y `src/legal/privacidad.md`
  - **Rama**: `tarea/002-T029-resultado-panel` · **Depende de**: 001-T030 (tabla de fallos), T012
  - **Primer commit (en rojo)**: en `tests/e2e/legal-pages.spec.js`, proyecto `real`: `/accesibilidad/` ya no contiene «aún no se ha comprobado»; cada fallo de la tabla aparece con «(panel de edición)».
  - **Después**: en `datos.yml`, `panel_comprobado` = fecha del ensayo y una entrada por fallo en `contenido_no_accesible` con `ambito: panel` (sin datos personales); en `privacidad.md`, qué guarda de verdad Pages CMS como «datos técnicos de la sesión» (H9, FR-021); `actualizado` de las páginas que cambien.
  - **Hecho cuando**: la prueba pasa y la declaración refleja la tabla de 001-T030 (SC-009).
  - **Comprobación**: `npx playwright test tests/e2e/legal-pages.spec.js` en verde; `npm run comprobar` con código 0; PR en verde con el visto bueno de la dirección (T017).
  - **Revisión**: Michel y subagente `revisor` (texto legal).

- [ ] T030 Prueba con personas SC-002 (quickstart C10) (comprobación manual, fase 7 del método (revisión)). Es 002-T030, distinta de 001-T030 (ensayo del panel)
  - **Depende de**: 001-T023 desplegado (o en local con `npm run build`), T025
  - **Pasos**: al menos 3 personas (alumnado de 12 a 14 años incluido) buscan desde `/` cómo comunicar un problema de accesibilidad; se mide solo «sí/no» y el tiempo, sin datos personales.
  - **Hecho cuando**: al menos 2 de 3 encuentran el canal en menos de 1 minuto; si no, tarea nueva.
  - **Comprobación**: tabla con resultados agregados, sin nombres.

- [ ] T031 [US4] Actualizar la declaración y los datos legales para el estreno (001-T047 → 001-T050) en `src/legal/datos.yml` y `src/legal/*.md`
  - **Rama**: `tarea/002-T031-estreno-legal` · **Depende de**: 001-T047, T024, T027, T028, T029, 002-T030; datos de H2 y H5 (dominio) confirmados
  - **Primer commit (en rojo)**: en local, `npm run comprobar:legal -- --estreno` falla con la lista de lo pendiente (es la «prueba» de esta tarea; quickstart A3).
  - **Después**: ningún `null` (CIF, dirección, correo y `web` del centro, unidad de reclamaciones…); `situacion` según el resultado de 001-T047; `en_revision: false`; `fecha_situacion` y `fecha_ultima_revision` = fecha de esta actualización, posterior a la de 001-T047 (SC-006); `contenido_no_accesible` al día (PDF revisados en 001-T047 C6 salen de la lista); `actualizado` de cada página que cambie.
  - **Hecho cuando**: `npm run comprobar:legal -- --estreno` sale con 0 y la PR está integrada antes de 001-T050.
  - **Comprobación**: salida de la orden; `npm run comprobar` con código 0; PR en verde con el visto bueno de la dirección (T017).
  - **Revisión**: Michel y subagente `revisor` (texto legal).

---

## Dependencies & Execution Order

### Con la funcionalidad 001

- **Empieza** tras integrar 001-T012 (`base.njk`, `format.js`, `eleventy.config.js`) y
  la rama 001-T013+T014 (`common.spec.js`, `playwright.config.js`, `comprobar`, flujo).
- **Se integra antes** de la rama 001-T022+T023 (ver «Checkpoint (integración de la
  002)»). Esa rama depende además de T002 (proxy) y crea `nginx/nginx.conf` y la parte
  de `check-headers.js` que comprueba la 404 con los tres enlaces y los registros sin IP
  (ADR 0018; ajustes 3 y 4 del plan, ya en el `tasks.md` de la 001).
- 001-T030 usa la prueba de T012. 001-T040 exige T028 integrado y desplegado. 001-T050
  exige T031 integrado y desplegado.

### Phase Dependencies

- **Setup (fase 1)**: T001 a T003 desde ya; T004 tras T003.
- **Foundational (fase 2)**: T005 → grupo T006+T007+T008 (integración: T001).
- **US1 (fase 3)**: grupo T009 tras el grupo T006; T012 en paralelo desde 001-T013+T014.
- **US2 (fase 4)**: grupo T013 tras el grupo T009 (comparten `base.njk`, `common.spec.js` y `legal-pages.spec.js`); integración: T002 y T017.
- **US3 (fase 5)**: grupo T015 tras el grupo T013. T017 sobre cada PR. T018 tras T014.
- **US4 (fase 6)**: grupo T019 tras el grupo T006 (en paralelo con US1 a US3); T022 tras los grupos de US1 a US3 y T019; T023 tras T004 y T021; T024 tras T022.
- **Polish (fase 7)**: T025 → T026.
- **Fase 8**: después de integrar la 002, ligada a la 001 como dice cada tarea; T031 la última.

### User Story Dependencies

- **US1 (P1)**: la base. **US2 (P1)** y **US3 (P2)**: la base y el pie de la anterior (orden por ficheros compartidos, no por lógica). **US4 (P2)**: la base para el aviso; las tres páginas para la guía.

### Ficheros compartidos (impiden el paralelo entre ramas)

- `src/_includes/layouts/base.njk`: 001-T012 → grupo T009 → grupo T013 → grupo T015 → 001-T043 → 001-T050. Si la rama 001-T042 (US4 de la 001) va a la vez, se integran una detrás de otra.
- `tests/e2e/common.spec.js` y `tests/e2e/legal-pages.spec.js`: grupo T009 → grupo T013 → grupo T015 → T028 → T029.
- `package.json`: 001-T013+T014 → grupo T006 → grupo T019 → 001-T022+T023.
- `.github/workflows/despliegue.yml`: 001-T013+T014 → grupo T006 → grupo T019 → 001-T022+T023 → 001-T031+T032 → 001-T033+T034.
- `src/legal/datos.yml`: grupo T006 → T028 → T029 → T031.
- `playwright.config.js`: 001-T013 → T012.
- `src/lib/format.js` y `eleventy.config.js`: 001-T012 → grupo T006.
- `AGENTS.md` («Comprobaciones»): 001-T013+T014 → grupo T006 → 001-T022+T023.

### Parallel Opportunities

- Desde ya: T001, T002, T003 (manuales).
- Tras 001-T013+T014: T005 y T012.
- Tras el grupo T006: el grupo T009 y el grupo T019 a la vez.

---

## Parallel Example

```bash
# Tras integrar el grupo T006, dos ramas a la vez, sin ficheros en común:
Rama: "tarea/002-T009-declaracion"      # T009 (pruebas en rojo) → T010 → T011
Rama: "tarea/002-T019-aviso-revision"   # T019 (pruebas en rojo) → T020 → T021
# (T020 y el grupo T006 tocan package.json y despliegue.yml: T019 empieza con T006 ya integrado)
```

---

## Implementation Strategy

### MVP First (US1)

1. Gestiones T001 y T002 desde ya (bloquean la integración).
2. T005 y el grupo T006 (datos, filtro, `comprobar:legal`).
3. Grupo T009 (declaración y pie) con visto bueno de la dirección: la web ya tendría declaración.
4. **Parar y comprobar**: `npm run comprobar` en verde y recorrido con teclado.

### Incremental Delivery

1. Base → US1 (declaración) → US2 (privacidad) → US3 (aviso legal), una rama detrás de otra.
2. US4 en paralelo: aviso anual (grupo T019) y, al final, la guía (T022).
3. Cierre T025 y T026 → la 002 está integrada → la 001 puede integrar T022+T023.
4. Después, con la 001: T028 antes de 001-T040, T029 tras 001-T030, T031 antes de 001-T050.

---

## Trazabilidad FR/SC → tareas

| Requisito | Tareas |
|---|---|
| FR-001 | T009, T011, T013, T014, T015, T016 |
| FR-002, SC-001 | T009, T010, T013, T014, T015, T016; 001-T022 (404 de nginx) |
| FR-003, SC-003 | T011, T014, T016 (axe en `comprobar`), T025 |
| FR-004 | T011, T014, T016, T026 |
| FR-005, FR-022, SC-005 | T005, T006, T007, T009, T013, T015, T026 |
| FR-006 | T006, T009, T013, T015 |
| FR-007 | T009, T013, T015 |
| FR-008 a FR-014, SC-004 | T007, T009, T011, T026 |
| FR-011a, SC-009 | T012, T029; 001-T030 |
| FR-015, SC-006 | T031; 001-T047, 001-T050 |
| FR-016, FR-017 | T015, T016 |
| FR-018 a FR-020 | T013, T014, T018, T028 |
| FR-019, SC-007 | T002, T014, T027; 001-T022, 001-T023 |
| FR-021 | T002, T014, T028, T029 |
| FR-023 | T001, T006, T007, T008, T028, T031 |
| FR-024, FR-024a | T017, T018 y la revisión de cada PR |
| FR-025, SC-008 | T003, T022, T024 |
| FR-026 | T022, T024 |
| FR-027 | T004, T019, T020, T021, T023 |
| SC-002 | 002-T030 |

Casos límite: dato pendiente (T006, T009, T013, T015), canal personal (T001, T017),
contenido de terceros (T007), PDF sin revisar (T007, T031), página no encontrada (T016,
`comprobar:enlaces`), impresión (T025), declaración caducada (T019–T023), proxy
compartido (T002, T027).

---

## HUECOS nuevos (no escritos en `specs/` ni en los ADR)

| # | Hueco | Propuesta en este borrador | Afecta a |
|---|---|---|---|
| P1 | El plan dice «contenido de la 001» para la fixture `legal-pendientes` sin decir cuál | Copia de `sin-reto-ni-anuncio` (sin materiales) | T005 |
| P2 | No se sabe si el validador de la 001 (T009 de la 001) acepta un `legal.yml` en la carpeta de contenido | Comprobarlo en T005; si lo rechaza, PARAR | T005 |
| P3 | data-model.md pide «al menos 2 entradas antes del estreno» en `contenido_no_accesible`, pero el esquema permite 0 y no dice qué orden lo comprueba | Resuelto: sin número mínimo. En el proyecto real, T009 comprueba que cada entrada de `datos.yml` aparece en `/accesibilidad/`; las dos entradas fijas solo en la fixture `legal-pendientes`. Los datos iniciales llevan las dos de la situación real y T031 las actualiza | T007, T009 |
| P4 | Qué hace `comprobar:legal` si `_site/index.html` no existe (para detectar el estreno) | Aplica el modo pedido y lo dice; en `comprobar` va tras `build:fixtures` | T006, T008 |
| P5 | Nombre del script local del aviso anual y si entra en `npm run comprobar` | `aviso:revision`, al final de `comprobar`, siempre con 0 | T020 |
| P6 | Nombre del filtro de fecha sin día de la semana («19 de noviembre de 2026») | `dateNoWeekday` en `src/lib/format.js` | T006, T007 |
| P7 | FR-024a pide consultar al DPD «antes de publicar» la parte de quienes editan; no está claro si vale publicarla antes con «Pendiente de confirmar» | Resuelto (FR-024a precisado el 2026-11-20): se publica con «Pendiente de confirmar» (T014) y la consulta (T018) bloquea T028 y 001-T040, no la integración | T014, T018 |
| P8 | Si la PR de prueba del suplente (C8) se integra o se cierra | Se cierra sin integrar si era solo de prueba | T024 |
| P9 | Formato de `MANTENEDORES_WEB` (lista de cuentas) | Cuentas separadas por comas | T004, T021 |
| P10 | 29 de febrero + 1 año | Lo fija la prueba de T019 y se documenta en el script | T019 |
| P11 | Pantallas del panel y sus rutas para la prueba manual (H8 del plan) | La persona navega a mano en la pausa | T012 |

Siguen abiertos los HUECOS H1 a H11 del plan (H1 → T001, H3 → T018, H4 → T003, H6 →
T002, H8/H9 → T029 y 001-T030, H10 → T007, H11 → T017).

## Notes

- `.specify/extensions.yml` no existe: no hay ganchos `before_tasks` ni `after_tasks`.
- El implementador no hace commits: Michel revisa el diff y hace commit, push y PR.
- Las tareas [MANUAL · Michel] no las ejecuta el implementador; la sesión principal recoge
  sus resultados en ESTADO.md y en los ADR.
- Ninguna tarea trata datos de visitantes ni de salud.
