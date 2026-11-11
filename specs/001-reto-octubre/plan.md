# Implementation Plan: El reto del mes (con el reto de octubre como ejemplo)

**Branch**: `001-reto-octubre` | **Date**: 2026-11-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-reto-octubre/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

> Borrador del subagente `planificador`. Michel ha confirmado las decisiones de la lista
> «Decisiones confirmadas» y los ADR 0005 a 0014 están aceptados; el paso a la fase 5
> (tareas) sigue necesitando su visto bueno explícito.

## Summary

La web muestra el reto del mes (tema, objetivo, pasos, tres retos con su semana, datos
del reto motriz y materiales), un calendario de 9 meses y un enlace externo al Genially,
con «Por confirmar» para los datos pendientes y un aviso de «próximo reto» cuando no hay
reto en curso. La comisión lo publica sin tocar código.

Enfoque técnico:
- **Web pública estática** generada con **Eleventy 3.1.8** a partir de ficheros **YAML**
  del repositorio y servida por **nginx 1.30.6** en el VPS del centro con Easypanel, sin
  JavaScript necesario, sin cookies y con una CSP que solo permite el propio sitio.
- **Panel**: **Pages CMS 2.1.8** autoalojado (decisión de Michel, ADR 0005). Cada
  guardado es un commit en `main` firmado por la GitHub App de la organización.
- **Defensa en profundidad del contenido**: validaciones del panel → validación con
  JSON Schema y reglas propias en «comprobar» → la misma validación en la compilación
  de la imagen en el VPS. Un reto mal formado no llega a la web.
- **Borradores** con el campo `estado`; **aviso de fallos** por correo del centro.
- **Comprobaciones** que bloquean el despliegue: contenido, pruebas unitarias, HTML,
  enlaces, escenarios y accesibilidad en navegador (Playwright + axe) y presupuesto de
  rendimiento (Lighthouse CI).

## Technical Context

**Language/Version**: JavaScript (módulos ES) sobre Node.js 26.13.0 LTS (ADR 0007);
plantillas Nunjucks; HTML y CSS estándar.

**Primary Dependencies**: compilación: `@11ty/eleventy` 3.1.8, `yaml` 2.9.1, `ajv`
8.20.0, `ajv-formats` 3.0.1. Desarrollo: `html-validate` 11.21.0, `linkinator` 8.1.0,
`@playwright/test` 1.65.0, `@axe-core/playwright` 4.14.0, `@lhci/cli` 0.16.0. Fuera del
repositorio: Pages CMS 2.1.8 + PostgreSQL en Easypanel. Versiones exactas y fuentes en
[research.md](research.md).

**Storage**: ficheros del repositorio (`content/*.yml` y `content/materiales/`). La
base de datos PostgreSQL es solo del panel (colaboradores y sesiones), no del contenido.

**Testing**: `node:test` (validador y utilidades), `html-validate`, `linkinator`,
Playwright + axe (escenarios, WCAG 2.1 AA, privacidad de red, foco), Lighthouse CI
(rendimiento); más comprobación manual con teclado, lector de pantalla y móvil real
([quickstart.md](quickstart.md)). ADR 0014.

**Target Platform**: navegadores actuales de móvil y escritorio; servidor: contenedor
`nginx:1.30.6-alpine3.24` en el VPS del centro (Easypanel).

**Project Type**: web estática generada + configuración de un panel de contenido externo.

**Performance Goals**: presupuesto del ADR 0013: LCP ≤ 2,5 s, FCP ≤ 1,8 s, CLS ≤ 0,1,
TBT ≤ 200 ms con Lighthouse móvil por defecto (Slow 4G simulado, CPU ×4); ≤ 150 KB
transferidos en la carga inicial; JS ≤ 10 KB (objetivo 0); 0 fuentes web; 0 peticiones
a terceros. Cumple SC-006 (< 3 s).

**Constraints**: 0 cookies y 0 terceros (FR-022, FR-024, SC-005); WCAG 2.1 AA (FR-023);
textos en español; nada de HTML editable por la comisión (principio V); materiales
≤ 10 MB, en PDF, PNG o JPG; plazo: lista a finales de diciembre de 2026.

**Scale/Scope**: 1 curso, 9 meses, ≤ 9 retos por curso, ≤ 30 materiales por mes; 4 tipos
de página (`/`, `/calendario/`, `/retos/<curso>/<mes>/`, `/404.html`); pocas personas
editoras (HUECO: cuántas, pendiente de la reunión con la comisión).

No queda ningún «NEEDS CLARIFICATION» técnico: lo que no se puede resolver con la
documentación está en [HUECOS](#huecos).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Antes de la investigación (fase 0)

| Principio | Qué exige | Situación | Resultado |
|---|---|---|---|
| I. Accesible | WCAG 2.1 AA, comprobación automática y manual, declaración de accesibilidad | La especificación lo pide (FR-023, SC-004). La declaración de accesibilidad **no** está en la especificación 001 | PASA para esta funcionalidad; la declaración queda como HUECO antes de producción |
| II. Privacidad | Sin datos personales, ni de salud, ni cookies ni terceros | FR-024, FR-022. El acceso de la comisión implica datos mínimos de quien edita: la especificación pide un ADR en esta fase | PASA con el ADR 0010 |
| III. No señalar | Nada de clasificaciones | La funcionalidad no muestra participación | PASA (no aplica) |
| IV. Contenido fiable | Fuentes, revisión humana de lo hecho con IA, sin consejos médicos, retos seguros | FR-016, FR-027. La revisión es un acto de la comisión | PASA si publicar exige fuentes y revisión (ver diseño) |
| V. Editable sin programar | Sin tocar código, sin romper el diseño | Panel decidido por Michel (ADR 0005) | PASA |
| VI. Sencilla y ligera | Presupuesto de rendimiento; dependencias con ADR y última estable | Hay que fijarlos en el plan | PASA si el plan los fija (ver diseño) |
| VII. Calidad comprobable | Criterios comprobables; nada sin comprobaciones en verde; revisión independiente del código (constitución 1.0.1, ADR 0015) | Criterios en la especificación; el flujo actual solo valida HTML | PASA si «comprobar» se amplía |
| VIII. Continuidad | Todo en `iesrioarba`, nada de cuentas personales, ADR | GitHub App de la organización, VPS del centro | PASA con condiciones (SMTP y administradores del panel) |

Resultado de la puerta: **PASA**, sin incumplimientos. Se continúa a la fase 0.

### Después del diseño (fase 1)

| Principio | Cómo lo cumple el diseño | Resultado |
|---|---|---|
| I | Contrato de páginas con semántica, orden y textos ([contracts/paginas-web.md](contracts/paginas-web.md)); axe con `wcag2a/2aa/21a/21aa` y 0 infracciones; prueba de foco; comprobación manual con teclado, NVDA/VoiceOver/TalkBack y zoom ([quickstart.md](quickstart.md) C). | PASA. HUECO: declaración de accesibilidad fuera de la especificación |
| II | Sitio estático sin cookies ni JS de terceros; CSP `default-src 'self'` en nginx; prueba de 0 cookies y 0 peticiones externas; Genially como enlace normal; datos de editores solo en el VPS y commits sin nombre ni correo (ADR 0010); SMTP del centro, sin Resend (ADR 0009); la web no recoge fichas ni justificantes (FR-011). Imágenes de menores: no se puede automatizar; la guía de mantenimiento lo recuerda y la comisión lo revisa | PASA |
| III | Sin datos de participación | PASA (no aplica) |
| IV | `fuentes` obligatorias para publicar (esquema); solo se publica con `estado: publicado`, cuya descripción en el panel exige la revisión de la comisión (ADR 0011); textos fijos que remiten a la guía | PASA. El contenido de salud en sí lo revisa la comisión, no una máquina |
| V | Solo campos de texto plano, fechas, listas y selectores; escape automático de Nunjucks; límites de longitud; estructura fija por tipo de reto; la validación rechaza lo mal formado (ADR 0008) | PASA |
| VI | Presupuesto fijado y comprobado en «comprobar» (ADR 0013); sin JS necesario; 3 dependencias de compilación y 4 de desarrollo nuevas, cada una con versión estable comprobada, fijada y ADR (0006, 0008, 0013, 0014) | PASA |
| VII | Cada FR tiene su comprobación ([Trazabilidad](#trazabilidad)); «desplegar» depende de «comprobar» (ya en el flujo); el código lo revisa el subagente `revisor`. Según la constitución 1.0.1 (ADR 0015), la revisión independiente se aplica al código; el contenido del panel lo garantizan la revisión de la comisión (principio IV) y «comprobar», que además falla si un commit de la app toca algo fuera de `content/` y `.pages.yml` (ADR 0005) | PASA |
| VIII | GitHub App de la organización; panel y web en el VPS del centro; secretos en Easypanel y en GitHub; SMTP y buzones DEBEN ser del centro; al menos dos administradores del panel (`ADMIN_EMAILS`); ADR para cada decisión | PASA con condiciones (HUECOS de SMTP y administradores) |
| Reglas generales | Textos fijos y etiquetas del panel en español claro | PASA |

## Project Structure

### Documentation (this feature)

```text
specs/001-reto-octubre/
├── spec.md              # Especificación aclarada (fase 3)
├── plan.md              # Este fichero
├── research.md          # Fase 0: decisiones, versiones y fuentes
├── data-model.md        # Fase 1: entidades, campos y reglas
├── quickstart.md        # Fase 1: cómo comprobarlo de punta a punta
├── contracts/
│   ├── reto.schema.json        # Contrato de content/retos/*.yml
│   ├── curso.schema.json       # Contrato de content/curso.yml
│   ├── sitio.schema.json       # Contrato de content/sitio.yml
│   ├── panel-pages-cms.md      # Qué ve y hace la comisión en el panel (.pages.yml)
│   ├── paginas-web.md          # Rutas, estructura y textos de las páginas públicas
│   └── ejemplos/               # Octubre, curso y sitio como datos de ejemplo
├── checklists/requirements.md
└── tasks.md             # Fase 5 (/speckit-tasks), aún no existe
```

### Source Code (repository root)

```text
.pages.yml                      # Configuración del panel (contracts/panel-pages-cms.md)
.nvmrc                          # 26.13.0
package.json / package-lock.json  # "type": "module", engines, scripts y versiones exactas
eleventy.config.js              # Entrada src/, salida _site/, datos YAML, copia de materiales
Dockerfile                      # 2 etapas: node:26.13.0-alpine3.24 → nginx:1.30.6-alpine3.24
nginx/default.conf              # CSP, compresión, caché de materiales, 404, sin cookies
lighthouserc.json               # Presupuesto (ADR 0013)
playwright.config.js            # Chromium, servidor local, proyectos con contenido real y fixtures
linkinator.config.json          # Solo enlaces internos de _site/

content/                        # LO ÚNICO QUE EDITA LA COMISIÓN (vía panel)
├── curso.yml
├── sitio.yml
├── retos/2026-2027-octubre.yml
└── materiales/2026-2027-octubre/   # Ficheros que dé la comisión

schemas/                        # Copia de contracts/*.schema.json
├── curso.schema.json
├── reto.schema.json
└── sitio.schema.json

scripts/
├── validate-content.js         # Esquemas + reglas entre campos; mensajes en español
└── serve-static.js             # Servidor local mínimo (node:http) para las pruebas

src/
├── _data/                      # Leen content/ (o CONTENT_DIR) y calculan los derivados
├── _includes/
│   ├── layouts/base.njk
│   └── partials/               # reto del mes, reto, material, calendario, enlace externo
├── lib/format.js               # Fechas, horas y tamaños en español (Intl, sin dependencias)
├── assets/css/main.css         # Diseño visual: HUECO (skill frontend-design)
├── index.njk                   # /
├── calendario.njk              # /calendario/
├── retos.njk                   # /retos/<curso>/<mes>/ (paginación de retos publicados)
└── 404.njk

tests/
├── unit/                       # node:test: validador, formato, coherencia .pages.yml ↔ esquemas
├── e2e/                        # Playwright + axe: escenarios de quickstart.md B
└── fixtures/                   # Contenido INVENTADO: sin reto en curso, datos pendientes, inválido

docs/guia-publicar.md           # Guía de mantenimiento para la comisión (FR-017)
.github/workflows/despliegue.yml  # «comprobar» ampliado + aviso por correo; «desplegar» igual
```

`site/` (el «hola mundo») desaparece: lo sustituyen `src/` y la carpeta generada
`_site/`, que se añade a `.gitignore`.

**Structure Decision**: un solo proyecto web estático. Separación estricta entre
`content/` (lo edita la comisión) y todo lo demás (lo edita quien programa), para que una
edición de contenido no pueda tocar plantillas ni estilos (principio V). La ruta del
contenido se puede cambiar con la variable `CONTENT_DIR` para compilar y probar con
`tests/fixtures/` sin tocar el contenido real.

## Flujo de publicación y despliegue

```text
Comisión ─▶ Pages CMS (valida required/pattern) ─▶ commit en main (GitHub App)
   ─▶ Actions «comprobar»:
        si el commit es de la app: falla si toca algo fuera de content/ y .pages.yml (ADR 0005)
        → npm ci → comprobar:contenido → test → build → validar → comprobar:enlaces
        → comprobar:web (Playwright + axe) → comprobar:rendimiento (Lighthouse CI)
        → docker build + comprobación de cabeceras (CSP, sin Set-Cookie)
        └─ si falla en main: commit de contenido de la app → correo al buzón de la
           comisión (SMTP del centro); cambio de código → aviso a quien mantiene la web (ADR 0012)
   ─▶ «desplegar» (solo si «comprobar» pasa): Deployment Trigger de Easypanel
   ─▶ Easypanel: docker build (vuelve a validar y compilar) → nginx sirve _site/
```

- `npm run comprobar` ejecuta en local la misma secuencia que Actions.
- La sección «Comprobaciones» de AGENTS.md debe listar estos scripts. El planificador no
  puede tocar AGENTS.md: lo hace la sesión principal cuando se apruebe el plan.
- Secretos nuevos en GitHub (entorno `produccion`): servidor, puerto, usuario y
  contraseña SMTP, y dirección del buzón de avisos. Ninguno en el repositorio.

## Trazabilidad

| Requisito | Dónde se resuelve | Cómo se comprueba |
|---|---|---|
| FR-001, FR-002, FR-003, FR-005, FR-006 | Modelo (Reto del mes, Reto); bloque «Reto del mes» de paginas-web.md | e2e US1-1 a US1-3 |
| FR-004, SC-008 | Campos opcionales → «Por confirmar»; `desde`/`hasta` sin texto si faltan | e2e con fixture de datos pendientes |
| FR-029 | `curso.en_curso` vacío → aviso en `/` | e2e con fixture sin reto en curso |
| FR-030 | `tutoria.adaptado_por_etapas` | e2e (texto presente) |
| FR-007, FR-008 | Material con formato y tamaño derivados | e2e US2-1 a US2-4; unitaria de formato |
| FR-009 | PDF con texto o alternativa; sin JS | Manual (quickstart C6) |
| FR-010, SC-007 | `version_texto` obligatoria en infografías | Esquema + unitaria + e2e |
| FR-011 | Texto fijo para `ficha` y `justificante`; sin formularios | e2e US2-6; html-validate (sin `form`) |
| FR-012, FR-013, FR-020 | Pages CMS + campos de texto plano + escape | Manual D6, D7; e2e de escape |
| FR-014 | Panel + validador en «comprobar» y en el Dockerfile | Unitarias del validador; manual D8 |
| FR-015 | Colaboradores invitados; permisos de GitHub; app sin permiso «Workflows» y limitada a `content/` y `.pages.yml` (ADR 0005) | Manual D9; permisos de la app al crearla (fase 6); «comprobar» falla con un commit de la app fuera de esas rutas |
| FR-016 | `fuentes` obligatorias para publicar | Esquema + unitaria + e2e |
| FR-017 | `docs/guia-publicar.md` | SC-003 con una persona de la comisión |
| FR-018, FR-019, FR-028 | `/calendario/`, `aria-current`, aviso «No es el reto en curso» | e2e US4 |
| FR-021, FR-022 | Enlace normal con «(sitio externo)»; CSP | e2e US5 |
| FR-023, SC-004 | Contrato de páginas; axe; teclado | e2e axe + manual C1, C2 |
| FR-024, SC-005 | Sin cookies ni terceros; CSP | e2e de red; cabeceras de la imagen |
| FR-025 | Textos fijos en español claro | Revisión del `revisor` y de la comisión |
| FR-026, SC-006 | Presupuesto del ADR 0013 | Lighthouse CI + manual C3 |
| FR-027 | `estado: publicado` = revisado por la comisión | Proceso (guía); no automatizable |
| SC-001, SC-002, SC-003 | — | Pruebas con personas (fase 7) |

## Decisiones aceptadas (ADR)

| ADR | Decisión |
|---|---|
| [0005](../../docs/decisiones/0005-panel-de-edicion-pages-cms.md) | Pages CMS 2.1.8 autoalojado, GitHub App de la organización, colaboradores por correo (decisión de Michel) |
| [0006](../../docs/decisiones/0006-generador-de-sitio-eleventy.md) | Eleventy 3.1.8 con Nunjucks |
| [0007](../../docs/decisiones/0007-compilacion-y-servidor.md) | Node 26.13.0; Dockerfile en dos etapas; nginx 1.30.6 con CSP |
| [0008](../../docs/decisiones/0008-formato-y-validacion-del-contenido.md) | YAML + JSON Schema con `yaml` 2.9.1, `ajv` 8.20.0 y `ajv-formats` 3.0.1 |
| [0009](../../docs/decisiones/0009-correo-del-panel.md) | Correo del panel por SMTP del centro |
| [0010](../../docs/decisiones/0010-datos-de-quienes-editan.md) | Solo el correo de quien edita, en el VPS; nada en los commits |
| [0011](../../docs/decisiones/0011-borradores.md) | Campo `estado` (borrador/publicado) en repositorio público |
| [0012](../../docs/decisiones/0012-aviso-de-fallos-al-publicar.md) | Correo al buzón de la comisión si «comprobar» falla con un commit de contenido de la app; si falla un cambio de código, aviso a quien mantiene la web |
| [0013](../../docs/decisiones/0013-presupuesto-de-rendimiento.md) | Presupuesto de rendimiento con Lighthouse CI 0.16.0 |
| [0014](../../docs/decisiones/0014-estrategia-de-pruebas.md) | html-validate 11.21.0, linkinator 8.1.0, Playwright 1.65.0 + axe 4.14.0, `node:test` |

## Decisiones confirmadas

Confirmadas por Michel el 2026-11-11, tal como estaban propuestas.

1. Principio VII: la revisión independiente se aplica al código; el contenido publicado
   desde el panel lo cubren la revisión de la comisión (principio IV) y las
   comprobaciones automáticas. Recogido en la constitución 1.0.1 (ADR 0015).
2. Ruleset de `main` en la fase 6: pull request obligatorio para personas, con la GitHub
   App de Pages CMS como excepción (research R11), con los controles del ADR 0005.
3. Borradores visibles en el repositorio público de GitHub (ADR 0011).
4. Pasar de Node 22 a Node 26 en Actions y en la imagen (ADR 0007).
5. Textos fijos por tipo de reto («Para quién», semana, «En el recreo», autoría de 2.º de
   Bachillerato): no se editan desde el panel.
6. Nombre de los retos de tutoría y familia opcional, con el nombre del tipo si falta.
7. Enlaces externos en la misma pestaña, con «(sitio externo)» en el texto.
8. Límite de 10 MB por material y formatos PDF, PNG y JPG.
9. Un reto `publicado` de un mes que aún no ha llegado se ve en la web como «No es el
   reto en curso».
10. La guía de mantenimiento vive en `docs/guia-publicar.md` del repositorio público.

## HUECOS

Lo que hacía falta y no está escrito en `specs/` ni en los documentos del proyecto:

| # | Hueco | Quién lo resuelve | Bloquea |
|---|---|---|---|
| H1 | Dominio de la web y del panel (`BASE_URL`, URLs de la GitHub App) | Michel con el centro | Puesta en marcha del panel |
| H2 | El correo del centro es Google Workspace. Opción preferida: una cuenta del centro solo para enviar, con `smtp.gmail.com` (587 STARTTLS o 465 SSL) y contraseña de aplicación; si el centro no permite contraseñas de aplicación, el SMTP relay de Workspace (ADR 0009). Falta crear la cuenta y decidir quién la administra (debe ser del centro) | Centro / dirección | Panel (invitaciones) y avisos |
| H3 | Buzón de la comisión para avisos de fallo | Comisión / centro | ADR 0012 |
| H4 | El VPS es de Hostinger; falta confirmar en hPanel que su centro de datos está en la UE (ya en «Preguntas abiertas» de ESTADO.md) | Quienes gestionan el VPS | ADR 0010 |
| H5 | Quién administra Pages CMS (`ADMIN_EMAILS`, al menos dos personas del centro) y cuántas personas publican | Michel y la comisión | Principio VIII |
| H6 | URL del Genially «El Arbalquimista de la salud» | Comisión | FR-021 (el ejemplo usa una URL inventada) |
| H7 | Descripción y lugar del reto motriz de octubre; fechas de las semanas (ya pendientes en la especificación) | Comisión | Nada: se muestran «Por confirmar» o se omiten |
| H8 | Ficheros de los materiales de octubre, su formato, su tamaño y el texto completo de la infografía | Comisión | US2 con datos reales |
| H9 | ¿Los retos de tutoría y familia tienen nombre propio? FR-002 pide «nombre» pero los datos de octubre solo dan el del motriz | Comisión | Nada (confirmado: opcional; decisión 6) |
| H10 | ¿Se ven los retos publicados de meses futuros? La especificación solo habla de pasados | Michel / comisión | Nada (confirmado: sí, como «no en curso»; decisión 9) |
| H11 | Declaración de accesibilidad (principio I) y, si procede, información de privacidad (ADR 0010): no están en la especificación 001 | Michel (nueva funcionalidad o ampliar la 001) | Producción |
| H12 | Navegación global y qué más contiene la web además del reto (cabecera, pie, otras secciones) | Michel | Diseño |
| H13 | Diseño visual (colores, tipografía, disposición) | Skill `frontend-design`, después | Aspecto, no funcionamiento |
| H14 | Móvil real para la prueba manual de SC-006 | Michel | Quickstart C3 |
| H15 | Entorno de pruebas para el panel: Pages CMS lee `.pages.yml` por rama, así que se prueba en una rama de pruebas (comprobarlo en la fase 6) | Michel / implementación (fase 6) | Quickstart D6 |
| H16 | Comportamiento de Easypanel si falla la compilación; cómo guarda Pages CMS los campos vacíos; si fija listas de 9 elementos y carpetas por reto | Implementación (fase 6), con el VPS y el panel reales | Confianza en la defensa en profundidad |
| H17 | Consulta al DPD sobre los datos de quienes editan (ESTADO.md solo la exige para alumnado) | Michel | ADR 0010 |
| H18 | Versiones de `actions/checkout` y `actions/setup-node` del flujo: no comprobadas en esta fase | Implementación | Nada |

## Notas del flujo de Spec Kit

- `.specify/extensions.yml` no existe: no hay ganchos `before_plan` ni `after_plan`.
- Este flujo de Spec Kit 1.3.2 no ha intentado actualizar ningún fichero de contexto de
  agente; en cualquier caso no se crearía CLAUDE.md (ADR 0002): AGENTS.md es la única
  fuente y su sección «Comprobaciones» la actualiza la sesión principal.
- ESTADO.md sigue diciendo que el modo de publicación está «pendiente de la reunión con
  la comisión»; la decisión de Michel (ADR 0005) debe reflejarse allí (sesión principal).

## Complexity Tracking

No hay incumplimientos de la constitución que justificar. Se anotan dos puntos que
añaden piezas y su razón:

| Pieza | Por qué hace falta | Alternativa más simple descartada porque |
|---|---|---|
| Validación duplicada (Actions y Dockerfile) | Easypanel compila el `HEAD` de `main`, que puede ser más nuevo que el commit comprobado | Construir la imagen en Actions y publicarla en GitHub Container Registry (con el `GITHUB_TOKEN`, sin credenciales personales) cambia el ADR 0001; queda como salida prevista si la prueba de H16 falla (ADR 0007) |
| Playwright + Lighthouse CI en «comprobar» (dependencias grandes y unos minutos por publicación) | Principios I, VI y VII exigen comprobar accesibilidad, rendimiento, cookies y terceros antes de publicar | Un script propio o solo pruebas manuales no demuestran SC-004, SC-005 ni SC-006 ni bloquean el despliegue |
