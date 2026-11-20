# Implementation Plan: Páginas legales (declaración de accesibilidad, aviso legal y privacidad)

**Branch**: `002-paginas-legales` | **Date**: 2026-11-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-paginas-legales/spec.md`

## Summary

Tres páginas nuevas (`/accesibilidad/`, `/aviso-legal/`, `/privacidad/`) en la misma web
estática de la 001, enlazadas desde el pie de todas las páginas (también la 404), con
«Pendiente de confirmar» para los datos legales que falten y tres excepciones que
bloquean de forma automática. Además: nginx sin registros de visitas y sin IP en los
errores, comprobación del proxy de Easypanel con quienes gestionan el VPS, aviso anual
de revisión (incidencia programada + aviso sin bloqueo en cada push), comprobación de
accesibilidad del panel dentro del ensayo T030 de la 001 y una guía del cambio para
editar desde la web de GitHub.

Decisiones ya tomadas que este plan NO reabre: misma pila que la 001 (ADR 0006, 0007,
0008, 0013, 0014, 0016) y páginas fuera de `content/` y de `.pages.yml`, protegidas por el
control de commits de la app (ADR 0005), editables en el navegador (FR-026).

## Technical Context

**Language/Version**: la de la 001: JavaScript (ES) sobre Node.js 26.13.1; Nunjucks;
Markdown (con `markdown-it`, incluido en Eleventy 3.x); YAML; HTML y CSS.

**Primary Dependencies**: ninguna nueva. Eleventy 3.1.8, `yaml` 2.9.1, `ajv` 8.20.0,
`ajv-formats` 3.0.1; pruebas con lo del ADR 0014. En Actions, `gh` preinstalado en el
ejecutor. Ver [research.md](research.md).

**Storage**: ficheros del repositorio en `src/legal/` (tres `.md` y `datos.yml`).

**Testing**: `node:test` (`check-legal`, `check-review-date`), Playwright + axe
(`common.spec.js` ampliado y `legal-pages.spec.js`), `linkinator`, `html-validate`,
`comprobar:cabeceras` (404 con enlaces y registros sin IP); `tests/panel/` solo a mano;
comprobaciones manuales en [quickstart.md](quickstart.md).

**Target Platform**: la de la 001 (navegadores actuales; nginx 1.30.6 en Easypanel).

**Project Type**: páginas estáticas dentro de la web de la 001 + un flujo de GitHub
Actions programado.

**Performance Goals**: el presupuesto del ADR 0013 se aplica igual (páginas de texto;
Lighthouse CI las recorre al estar en `_site/` a profundidad ≤ 3).

**Constraints**: WCAG 2.1 AA; 0 cookies, 0 terceros, 0 formularios, fotos o vídeos;
español claro para 12 años (FR-004); nada de datos personales en el repositorio
(FR-025: suplente por cargo); los permisos mínimos del `GITHUB_TOKEN`.

**Scale/Scope**: 3 páginas, 1 fichero de datos, 2 scripts, 1 flujo nuevo, 1 paso nuevo en
«comprobar», 1 guía, ajustes en `base.njk`, `common.spec.js`, nginx y `check-headers.js`
de la 001.

Ningún «NEEDS CLARIFICATION» técnico: lo que depende de terceros o del centro está en
[HUECOS](#huecos).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Antes de la investigación (fase 0)

| Principio | Qué exige | Situación | Resultado |
|---|---|---|---|
| I. Accesible | Declaración publicada y al día con contacto; WCAG 2.1 AA; comprobación automática y manual | Es el objeto de la funcionalidad (FR-008 a FR-015, FR-011a, FR-027) | PASA |
| II. Privacidad | Sin datos personales por defecto, sin cookies ni terceros | FR-019 a FR-021; el único tratamiento es el del ADR 0010 | PASA si nginx y el proxy no registran visitas (diseño y tarea manual) |
| III. No señalar | Sin clasificaciones | No muestra participación | PASA (no aplica) |
| IV. Contenido fiable | Fuentes y revisión humana del contenido de salud | No hay contenido de salud; el texto legal lo revisa la dirección (FR-024a) | PASA (no aplica a salud) |
| V. Editable sin programar | El profesorado edita sin código; no rompe el diseño | Decisión tomada: las legales las edita el mantenedor, no la comisión; FR-026 pide edición en el navegador | PASA si el formato es editable en el navegador y la compilación detecta lo roto |
| VI. Sencilla y ligera | Presupuesto; dependencias con ADR | Sin dependencias nuevas | PASA |
| VII. Calidad comprobable | Criterios comprobables; comprobaciones en verde; revisión independiente del código | FR-024 (rama, PR, revisión); SC-001 a SC-009 | PASA si cada FR tiene comprobación (ver Trazabilidad) |
| VIII. Continuidad | Todo en `iesrioarba`; nada personal; ADR | Suplente (FR-025), aviso sin terceros (FR-027), canal del centro | PASA con condiciones (HUECOS de suplente y canal) |
| Reglas generales | Español claro | FR-004 | PASA |

Resultado de la puerta: **PASA**. Se continúa a la fase 0.

### Después del diseño (fase 1)

| Principio | Cómo lo cumple el diseño | Resultado |
|---|---|---|
| I | Contrato de páginas con los seis apartados en orden ([contracts/paginas-legales.md](contracts/paginas-legales.md)); enlaces en el pie de todas las páginas, 404 incluida; axe 0 infracciones; teclado y lector (quickstart C1, C2); panel comprobado con el mismo método (R6) y sus fallos en la declaración; aviso anual (ADR 0019) | PASA |
| II | Sin formularios, cookies ni terceros (pruebas de la 001 aplicadas a las nuevas páginas); nginx sin registros de acceso y errores sin IP, comprobado en `docker logs` (ADR 0018); proxy verificado a mano; la privacidad describe solo lo que se hace (FR-021) | PASA con condición: resultado de la tarea del proxy |
| III | — | PASA (no aplica) |
| IV | Sin contenido de salud; visto bueno de la dirección y consulta al DPD anotados en la PR | PASA |
| V | Markdown + un YAML de datos, editables en el navegador; el esquema y la compilación rechazan lo roto; guía del cambio (ADR 0017) | PASA |
| VI | 0 dependencias nuevas; páginas de texto dentro del presupuesto del ADR 0013 | PASA |
| VII | Cada FR con su comprobación ([Trazabilidad](#trazabilidad)); FR-023 automático (`comprobar:legal`); revisión independiente por PR (FR-024) | PASA |
| VIII | Suplente por cargo y con su cuenta; `GITHUB_TOKEN` del flujo, sin cuentas personales; asignación por variable del repositorio; ADR 0017 a 0019 | PASA con condiciones (HUECOS H3, H4) |
| Reglas generales | Textos en español claro con explicación de los términos legales; los revisa la dirección | PASA |

## Project Structure

### Documentation (this feature)

```text
specs/002-paginas-legales/
├── spec.md                 # Especificación aclarada (fase 3)
├── plan.md                 # Este fichero
├── research.md             # Fase 0: decisiones y fuentes
├── data-model.md           # Fase 1: datos legales y reglas por momento
├── quickstart.md           # Fase 1: cómo comprobarlo
├── contracts/
│   ├── legal.schema.json   # Contrato de src/legal/datos.yml
│   └── paginas-legales.md  # Rutas, pie, estructura y aviso anual
├── checklists/requirements.md
└── tasks.md                # Fase 5 (no se crea aquí)
```

### Source Code (repository root)

```text
src/legal/                          # LO QUE EDITA el mantenedor o el suplente (FR-024, FR-026)
├── datos.yml                       # Datos del centro, contacto, declaración, tratamiento
├── declaracion-accesibilidad.md    # /accesibilidad/
├── aviso-legal.md                  # /aviso-legal/
├── privacidad.md                   # /privacidad/
└── legal.11tydata.js               # Carga y valida datos.yml (o LEGAL_DATA_FILE); njk,md
src/_includes/layouts/base.njk      # (001) pie con «Información legal» (FR-002)
src/lib/format.js                   # (001) filtro `pendiente` y fecha larga
schemas/legal.schema.json           # Copia de contracts/legal.schema.json
scripts/check-legal.js              # comprobar:legal [--panel | --estreno]
scripts/check-review-date.js        # Aviso anual (FR-027)
tests/unit/check-legal.test.js
tests/unit/check-review-date.test.js
tests/e2e/common.spec.js            # (001) + tres enlaces del pie en todas las páginas
tests/e2e/legal-pages.spec.js       # Estructura y «Pendiente de confirmar»
tests/fixtures/legal-pendientes/    # Contenido de la 001 + legal.yml INVENTADO con null
tests/panel/panel-accessibility.spec.js  # Solo a mano, en T030 de la 001 (R6)
nginx/nginx.conf                    # (en la rama de T023 de la 001) sin registros (ADR 0018)
scripts/check-headers.js            # (001, T022) + 404 con enlaces y registros sin IP
.github/workflows/despliegue.yml    # (001) + comprobar:legal y «Aviso de revisión»
.github/workflows/revision-declaracion.yml  # Programado, issues: write (ADR 0019)
docs/guia-paginas-legales.md        # Guía del cambio (FR-026) y suplente por cargo (FR-025)
```

**Structure Decision**: las páginas legales viven en `src/legal/`, fuera de `content/`
(FR-024): el panel no las ve y el control de commits de la app las protege. Los datos en
un solo YAML para que FR-022 y FR-023 sean comprobables. Lo que toca nginx y
`check-headers.js` no existe aún en `main` (lo crean T022 y T023 de la 001): se hace en
esa rama como ajuste de la 001 (ver «Ajustes propuestos»), porque la 002 debe integrarse
ANTES de T023.

## Diseño por punto pedido

### 1. Textos legales, datos del centro y «Pendiente de confirmar» (ADR 0017)

- Markdown por página + `datos.yml` validado; `null` → «Pendiente de confirmar» con el
  filtro `pendiente`; el esquema prohíbe vacío y «pendiente» escrito a mano (FR-022).
- FR-023 con `scripts/check-legal.js` (tabla en [data-model.md](data-model.md)):
  canal obligatorio siempre (bloquea «comprobar»); `--panel` como requisito de T040;
  `--estreno` explícito en T050 y automático en cuanto `_site/index.html` no lleva
  `noindex`.
- Las fixtures de la 001 siguen igual; se añade `tests/fixtures/legal-pendientes/` con
  un `legal.yml` inventado (todo `null` salvo el canal: `accesibilidad@example.org`).
  `build:fixtures` usa `LEGAL_DATA_FILE` si la carpeta trae `legal.yml`.
- Fecha de cada página en el front matter (`actualizado`); fechas de la declaración en
  `datos.yml`.

### 2. FR-019: nginx y proxy (ADR 0018)

- `nginx/nginx.conf` propio: `access_log off`; `error_log stderr notice` en `main` y
  `stderr emerg` en `http`; `log_not_found off`.
- `comprobar:cabeceras`: tras las peticiones, `docker logs` sin IP (`\b\d{1,3}(\.\d{1,3}){3}\b`
  salvo la de la propia orden de arranque si la hubiera) ni líneas `GET /`.
- **Tarea MANUAL (quienes gestionan el VPS, coordinada por Michel)**, antes de T023:
  1. Ver si Traefik de Easypanel tiene `accessLog` activo, dónde escribe y cuánto
     conserva. 2. Si está activo: desactivarlo para el router de esta web
     (`observability.accessLogs: false`, Traefik ≥ 3.3), o quitar los campos de cliente,
     o desactivarlo en todo Traefik. 3. Comprobar también los registros del contenedor
     de la web en Easypanel tras unas visitas. 4. Resultado por escrito (sin IP ni
     datos) como «Actualización» del ADR 0018. Si no se puede desactivar: la privacidad
     lo explica (FR-021) y Michel revisa la decisión.

### 3. FR-027: aviso anual (ADR 0019)

- `check-review-date.js` (fecha inyectable); paso no bloqueante en «comprobar»; flujo
  `revision-declaracion.yml` semanal + manual, `contents: read` e `issues: write`,
  incidencia única con etiqueta `revision-declaracion`, asignada a `vars.MANTENEDORES_WEB`.
- Tareas MANUALES: crear la etiqueta y la variable; comprobar una vez (quickstart C7)
  con una fecha vencida en una rama de ensayo lanzando el flujo a mano.
  Nota: `workflow_dispatch` desde otra rama ejecuta el flujo de esa rama; el `schedule`
  solo usa `main`.
- 60 días: mitigado (research R5); queda HUECO si la actividad del propio flujo cuenta.

### 4. Accesibilidad del panel en el ensayo T030 de la 001 (FR-011a, SC-009)

- `tests/panel/panel-accessibility.spec.js` (fuera de `comprobar`; `testDir` propio o
  proyecto `panel` sin servidor web): con `PANEL_URL`, abre el panel en modo visible,
  pausa para que la persona entre a mano (sin guardar la sesión en disco) y pasa axe
  (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) en: inicio de sesión, lista de entradas,
  edición de un reto, subida de un material, lista de materiales y, si es administradora,
  colaboradores. Informe solo con reglas y pantallas, sin correos.
- Después, teclado y lector de pantalla en las mismas pantallas.
- Los fallos → `declaracion.contenido_no_accesible` (`ambito: panel`) y
  `panel_comprobado` con la fecha, en una PR de la 002 con visto bueno de la dirección.
- Hasta entonces la declaración dice que el panel aún no se ha comprobado (no se omite).

### 5. Enlaces del pie en todas las páginas, 404 incluida (FR-002, SC-001)

- `nav` «Información legal» en el `footer` de `base.njk` con rutas absolutas;
  `aria-current="page"` en la página actual.
- Comprobación: `common.spec.js` en todas las páginas de todos los proyectos;
  `linkinator`; `comprobar:cabeceras` pide una ruta inexistente a nginx y busca los tres
  enlaces en la respuesta 404.

### 6. Mantenimiento (FR-024 a FR-026)

- `docs/guia-paginas-legales.md`: desde la web de GitHub (lápiz «Edit», «Commit changes»
  → «Create a new branch» → PR), qué fichero tocar para cada cambio, no tocar
  `{{ … }}`, revisión anual (lista: situación, contenido no accesible, contacto,
  encargados, flujo programado activo), actualización del estreno, visto bueno de la
  dirección y consulta al DPD anotados en la PR, y cómo ver que la PR está en verde.
- El suplente se registra en la guía por su cargo (FR-025); su cuenta, en el equipo
  `comision-salud` (Write, ya existe: puede crear ramas y PR).

## Trazabilidad

| Requisito | Dónde | Cómo se comprueba |
|---|---|---|
| FR-001 | `src/legal/*.md` | e2e `legal-pages` |
| FR-002, SC-001 | `base.njk` | `common.spec.js`, linkinator, cabeceras (404) |
| FR-003, SC-003 | Reglas comunes de la 001 | axe, html-validate, sin cookies/terceros; manual C1–C3 |
| FR-004 | Textos | Revisión del `revisor` y de la dirección (FR-024a) |
| FR-005, FR-022, SC-005 | `datos.yml` + filtro + esquema | unitarias + e2e con `legal-pendientes`; C4 |
| FR-006 | front matter `actualizado` | e2e |
| FR-007 | Contrato | e2e (sin `form`/`img`/`video`/`iframe`) |
| FR-008 a FR-014, SC-004 | `declaracion-accesibilidad.md` | e2e (orden de `h2`) + C4 |
| FR-011a, SC-009 | `tests/panel/` en T030; `ambito: panel` | C9; `--estreno` exige `panel_comprobado` |
| FR-015, SC-006 | `fecha_ultima_revision` | `--estreno`; aviso anual; T050 compara con T047 |
| FR-016, FR-017 | `aviso-legal.md` | e2e + C4 |
| FR-018 a FR-020 | `privacidad.md` | e2e + C4 |
| FR-019, SC-007 | `nginx/nginx.conf`; tarea del proxy | cabeceras (`docker logs`); C5, C6 |
| FR-021 | Proceso | Revisión en cada PR que cambie lo que se trata; C4 |
| FR-023 | `check-legal.js` | unitarias; «comprobar»; T040 y T050 |
| FR-024, FR-024a | Fuera de `content/`; PR | control de commits (ADR 0005); PR con visto bueno anotado |
| FR-025, SC-008 | Guía + cuenta | C8 |
| FR-026 | `docs/guia-paginas-legales.md` | C8 |
| FR-027 | ADR 0019 | unitarias; C7; anotación en una PR |
| SC-002 | — | C10 (fase 7) |

## Ajustes propuestos para `specs/001-reto-octubre/tasks.md`

NO se ha tocado ese fichero. Propuestas para que Michel decida:

1. **T040** (invitar al panel): añadir a «Depende de» la 002 integrada y desplegada con
   `npm run comprobar:legal -- --panel` en verde (responsable y base legal confirmados
   tras consultar al DPD, FR-023 y FR-024a) y la página `/privacidad/` publicada; en
   «Comprobación», la salida de esa orden y `curl -s https://<dominio>/privacidad/`
   con el responsable visible.
2. **T030** (ensayo del panel): nuevo paso «Accesibilidad del panel» (research R6):
   ejecutar `tests/panel/panel-accessibility.spec.js` con `PANEL_URL`, recorrer las
   mismas pantallas con teclado y con lector de pantalla y anotar los fallos sin datos
   personales; depende de la tarea de la 002 que crea esa prueba. «Hecho cuando»
   incluye la tabla de fallos, que alimenta una PR de la 002 (declaración y
   `panel_comprobado`).
3. **T022** (comprobación de cabeceras): añadir la 404 con los tres enlaces legales y la
   comprobación de `docker logs` sin IP ni líneas de acceso (ADR 0018).
4. **T023** (Dockerfile y nginx): crear también `nginx/nginx.conf` (ADR 0018) y copiarlo
   en la imagen; añadir a «Depende de» la tarea MANUAL del proxy de la 002 (su resultado
   puede cambiar el texto de `/privacidad/`).
5. **T013 / T014**: sin cambios en su rama; la 002 amplía después `common.spec.js`,
   `package.json` (`comprobar:legal`) y `despliegue.yml`. Añadir esos ficheros a
   «Ficheros compartidos» con la 002 en medio.
6. **T047**: incluir `/accesibilidad/`, `/aviso-legal/` y `/privacidad/` en C1, C2 y C4
   (teclado, lector e impresión), porque su resultado actualiza la declaración.
7. **T050**: añadir a los pasos `npm run comprobar:legal -- --estreno` en verde,
   `fecha_ultima_revision` posterior a la fecha de T047, `panel_comprobado` con fecha
   (SC-009), SC-002 y SC-008 hechos, y la tarea del proxy cerrada.
8. **«Dependencies & Execution Order»**: la 002 depende de T012 (pie en `base.njk`, filtros)
   y de la rama T013 + T014 (`common.spec.js`, `comprobar`, flujo); la rama T022 + T023
   depende además de la tarea manual del proxy; T030 depende de la tarea de la 002 que
   crea `tests/panel/`.
9. **T039** (guía de la comisión): una línea que diga que las páginas legales no se
   editan desde el panel y a quién pedir un cambio.
10. **AGENTS.md**, «Comprobaciones»: la tarea de la 002 que crea `comprobar:legal` añade
    su línea (como hizo N10 en la 001); lo escribe la sesión principal o la tarea.

## Decisiones confirmadas

1. Formato Markdown + `datos.yml` en `src/legal/` (ADR 0017).
2. Canal de accesibilidad obligatorio ya para integrar la 002 (no solo para T023): más
   estricto pero más simple; consecuencia: sin canal no se integra la 002 (ADR 0017).
3. Estreno detectado por la ausencia de `noindex` para aplicar `--estreno` solo.
4. nginx con errores solo `emerg` (se pierden detalles de errores) (ADR 0018).
5. Flujo programado semanal + aviso no bloqueante; asignación por la variable
   `MANTENEDORES_WEB` con cuentas de GitHub (ADR 0019).
6. Prueba del panel como fichero del repositorio que solo se ejecuta a mano
   (`tests/panel/`), y declaración del panel como «aún no comprobado» hasta T030.
7. Rutas `/accesibilidad/`, `/aviso-legal/`, `/privacidad/` y la guía en
   `docs/guia-paginas-legales.md`, donde se nombra al suplente por su cargo.

## HUECOS

| # | Hueco | Quién lo resuelve | Bloquea |
|---|---|---|---|
| H1 | Canal de contacto de accesibilidad del centro (no personal) | Centro / dirección | Integrar la 002 y, por tanto, T023 de la 001 |
| H2 | CIF, dirección postal y correo del centro; unidad que tramita las reclamaciones de accesibilidad de un centro educativo de Aragón | Centro | Nada hasta el estreno («Pendiente de confirmar») |
| H3 | Responsable y base legal del tratamiento; lista de encargados (¿proveedor del VPS? ¿Google por el SMTP del ADR 0009?): NO se ha supuesto ninguno | DPD / centro | T040 de la 001 |
| H4 | Suplente nombrado (cargo) y cuentas de GitHub para `MANTENEDORES_WEB` | Centro / Michel | FR-025, SC-008, flujo anual |
| H5 | Dirección de la web (`centro.web`, FR-009): depende del dominio (H1 de la 001) | Michel | Estreno |
| H6 | Estado real de los registros de acceso de Traefik en Easypanel, su conservación y si Easypanel deja opciones por router: sin documentación oficial | Quienes gestionan el VPS | T023 de la 001 |
| H7 | Si la actividad del propio flujo o abrir incidencias cuenta como «actividad» para la regla de 60 días: no documentado | Comprobación en uso | Fiabilidad del aviso anual |
| H8 | Accesibilidad de Pages CMS 2.1.8: sin información; y cómo se entra en el panel local para la pausa de Playwright | T030 de la 001 | SC-009 |
| H9 | Qué guarda Pages CMS como «datos técnicos de la sesión» (p. ej. si guarda IP o navegador): no comprobado; la privacidad debe decirlo (FR-020, FR-021) | T030 de la 001 | Texto de `/privacidad/` |
| H10 | Fecha de preparación de la declaración y fecha de su primera situación: se fijan al integrar | Michel | Nada |
| H11 | Cómo se anota el visto bueno de la dirección en la PR sin datos personales (¿comentario de Michel citando el cargo y la fecha?) | Michel / dirección | FR-024a |
| H12 | La spec cita «ESTADO.md, 2026-11-19» para Fráncfort, pero ESTADO.md no lo recoge; sí el ADR 0010 y el H4 del plan de la 001 | Sesión principal | Resuelto: ESTADO.md recoge ya «El VPS está en Fráncfort (Alemania), dentro de la UE» (2026-11-19) |
| H13 | Quién recibe por el canal de accesibilidad el contenido de quien no puede usar el panel y cómo se cuentan los 5 días lectivos (calendario escolar) | Centro / Michel | Resuelto: los 5 días lectivos se cuentan desde que el contenido llega al canal de accesibilidad, según el calendario escolar de Aragón; quien lo recibe por el canal lo pasa a quien mantiene la web |

## Notas del flujo de Spec Kit

- `.specify/extensions.yml` no existe: sin ganchos `before_plan` ni `after_plan`.
- `setup-plan.sh` copió la plantilla con `SPECIFY_FEATURE_DIRECTORY=specs/002-paginas-legales`.
- No se crea CLAUDE.md (ADR 0002).

## Complexity Tracking

Sin incumplimientos de la constitución. Piezas añadidas:

| Pieza | Por qué hace falta | Alternativa más simple descartada porque |
|---|---|---|
| Flujo programado nuevo con `issues: write` | FR-027 pide una incidencia automática | Solo el aviso en push no avisa si nadie hace push |
| `nginx/nginx.conf` propio | FR-019: la de la imagen registra visitas con IP | Ajustar solo `default.conf` deja el `error_log` principal y su formato con IP |
| `tests/panel/` fuera de «comprobar» | FR-011a: mismo método que la web | Lighthouse del navegador es un subconjunto (ADR 0014) |
