# Research: Páginas legales (002-paginas-legales)

**Fecha**: 2026-11-19 · **Plan**: [plan.md](plan.md)

Consulta de documentación hecha el 2026-11-19. Esta funcionalidad NO añade ninguna
dependencia ni versión nueva: usa la pila fijada en la 001 (ADR 0006, 0007, 0008, 0013,
0014). Cada decisión nueva tiene su borrador de ADR (0017 a 0019).

## Tabla de piezas

| Pieza | Versión | Nueva | Fuente / ADR |
|---|---|---|---|
| Eleventy (Markdown con `markdown-it`, incluido en Eleventy 3.x) | 3.1.8 | No | ADR 0006; tabla de versiones de <https://www.11ty.dev/docs/languages/markdown/> (Eleventy 3.x → markdown-it 14.x) |
| `yaml`, `ajv`, `ajv-formats` | 2.9.1, 8.20.0, 3.0.1 | No | ADR 0008 |
| Playwright + axe, `linkinator`, `html-validate`, `node:test` | ADR 0014 | No | ADR 0014 |
| nginx | 1.30.6 | No | ADR 0007 |
| GitHub CLI (`gh`) en el ejecutor de Actions | la del ejecutor | No (preinstalada) | <https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-github-cli-in-workflows> |
| Traefik (proxy de Easypanel) | 3.7.13 según el registro de cambios de Easypanel 2.35.0 | No es nuestra | <https://my.easypanel.io/changelog> |

## R1 · Formato de los textos legales y de los datos del centro

- **Decisión**: cada página legal es un fichero Markdown en `src/legal/` (texto en prosa,
  fácil de editar en el navegador de GitHub). Los datos del centro, del tratamiento y de
  la declaración (situación, fechas, contenido no accesible) están en un único
  `src/legal/datos.yml`, validado con un esquema JSON (`schemas/legal.schema.json`) con
  las mismas librerías del ADR 0008. El Markdown inserta los datos con
  `{{ legal.centro.cif | pendiente }}`; el filtro `pendiente` muestra «Pendiente de
  confirmar» si el valor es `null`. ADR 0017.
- **Razón**: FR-026 (edición en el navegador, sin terminal), FR-022 (un único sitio para
  cada dato; nunca un hueco), principio V/VI (sin dependencias nuevas). Eleventy
  preprocesa el Markdown con Liquid por defecto (`markdownTemplateEngine: "liquid"`,
  <https://www.11ty.dev/docs/config/>); se fija Nunjucks para estos ficheros con
  `templateEngineOverride: njk,md` en los datos del directorio, sin cambiar el valor
  global de la 001 (<https://www.11ty.dev/docs/languages/markdown/>).
- **Alternativas**: (a) todo en YAML y plantillas Nunjucks: estructura garantizada, pero
  la prosa en YAML es incómoda y propensa a errores de sangría en el navegador;
  (b) todo en Markdown, sin YAML: cómodo, pero los datos se repiten (el correo del
  centro sale en dos páginas) y no se puede comprobar automáticamente qué está pendiente
  (FR-023); (c) en `content/` y editable desde el panel: descartado por decisión ya
  tomada (FR-024).

## R2 · «Pendiente de confirmar» y las tres excepciones de FR-023

- **Decisión**: en `datos.yml` un dato desconocido es `null`. El esquema prohíbe la
  cadena vacía y cualquier valor que contenga «pendiente», para que nadie escriba el
  aviso a mano. `scripts/check-legal.js` (`npm run comprobar:legal`) aplica:
  1. Siempre (en «comprobar», bloquea): esquema válido y `accesibilidad.canal_contacto`
     no nulo (excepción 1).
  2. `--panel` (lo ejecuta Michel como requisito de T040 de la 001): responsable y base
     legal no nulos (excepción 2).
  3. `--estreno` (excepción 3): ningún `null` en todo el fichero y
     `declaracion.en_revision: false`. Además se aplica **sola** en «comprobar» cuando
     la página de inicio compilada ya no lleva `noindex` (es decir, en cuanto T050 de la
     001 lo quita): así el estreno no puede publicarse con datos pendientes aunque se
     olvide la orden.
- **Razón**: FR-022, FR-023, SC-005. La excepción 2 no se puede detectar sola (invitar es
  un acto manual en el panel), así que se convierte en comprobación previa obligatoria
  de T040.
- **Alternativas**: comprobar a mano con una lista (no es automático, que es lo pedido);
  detectar el panel en producción por red desde Actions (depende del dominio, H1, y de
  la red; frágil).

## R3 · Registros del servidor (FR-019, SC-007)

- **Hecho comprobado**: `access_log off` «cancels all access_log directives on the
  current level» (<https://nginx.org/en/docs/http/ngx_http_log_module.html>).
  `error_log` no tiene formato configurable en la versión libre (el parámetro `json` es
  de la suscripción comercial) y los mensajes de una petición incluyen `client: <IP>`
  (ejemplo de la documentación); niveles `debug` … `emerg`, y fijar un nivel registra
  ese y los más graves (<https://nginx.org/en/docs/ngx_core_module.html#error_log>).
- **Decisión**: configuración propia `nginx/nginx.conf` (sustituye la de la imagen):
  `access_log off` en `http`; `error_log stderr notice` a nivel `main` (mensajes del
  proceso: arranque, señales; sin petición, sin IP) y `error_log stderr emerg` en `http`
  (los errores de una petición, que llevan IP, no se registran en la práctica);
  `log_not_found off`. Se comprueba arrancando la imagen, haciendo peticiones (también
  404 y fichero inexistente) y buscando IP o líneas de acceso en `docker logs`. ADR 0018.
- **Alternativas**: (a) `error_log` a nivel `crit`/`error` y aceptar la IP: incumple
  FR-019; (b) enviar errores a `syslog` y filtrar la IP en otro contenedor: otra pieza
  que mantener, contra el principio VI; (c) dejar la configuración de la imagen oficial:
  registra cada visita con IP (`access_log … main`).

## R4 · Proxy de Easypanel (caso límite «Proxy compartido del VPS»)

- **Hecho comprobado**: Easypanel pone Traefik delante de los servicios (registro de
  cambios 2.35.0: «Updated Traefik from 3.6.7 to 3.7.13»). En Traefik los registros de
  acceso se activan aparte y, si se activan, por defecto conservan todos los campos
  (`fields.defaultMode: keep`)
  (<https://doc.traefik.io/traefik/reference/install-configuration/observability/logs-and-accesslogs/>).
  Desde Traefik 3.3 se pueden desactivar por router (`observability.accessLogs: false`;
  etiqueta `traefik.http.routers.<router>.observability.accesslogs=false` en 3.6 y 3.8)
  (<https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/routing/observability/>).
- **No comprobado**: si la instalación del centro tiene los registros de acceso activos,
  dónde los guarda y cuánto tiempo, y si Easypanel deja añadir opciones al router de un
  servicio. No hay documentación oficial de Easypanel sobre ello (solo una petición de
  usuarios de 2026 en <https://my.easypanel.io/feedback/post/best-practice-for-enabling-traefik-access-logs-and-mapping-them-to-host-for-fail2ban-integration-or->).
- **Decisión**: tarea MANUAL con quienes gestionan el VPS (antes de T023 de la 001):
  mirar la configuración estática de Traefik (bloque `accessLog`); si está activo,
  pedir, por este orden de preferencia: desactivar los registros de acceso del router
  de esta web; o quitar los campos de cliente (`ClientAddr`, `ClientHost`) del registro;
  o desactivarlos en todo Traefik. Si nada es posible: la página de privacidad dice qué
  se guarda, para qué y cuánto tiempo (FR-021) y Michel revisa la decisión (caso
  límite). ADR 0018.

## R5 · Aviso de la revisión anual (FR-027)

- **Hechos comprobados**:
  - «In a public repository, scheduled workflows are automatically disabled when no
    repository activity has occurred in 60 days»; se reactiva desde la pestaña Actions
    o con `gh workflow enable`
    (<https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow>).
  - Los flujos programados se ejecutan sobre el último commit de la rama por defecto;
    intervalo mínimo 5 minutos. Si se declara un permiso del `GITHUB_TOKEN`, los no
    declarados quedan en `none`; `issues: write` permite trabajar con incidencias
    (<https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax>).
  - `gh` está preinstalado en los ejecutores de GitHub y usa `GH_TOKEN`; la
    documentación trae un ejemplo con `gh issue create`
    (<https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-github-cli-in-workflows>).
  - `::warning::` crea una anotación y no se describe como fallo del paso; el resumen va
    a `$GITHUB_STEP_SUMMARY`
    (<https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions>).
- **Decisión** (ADR 0019): flujo nuevo `.github/workflows/revision-declaracion.yml` con
  `schedule` semanal y `workflow_dispatch`, `permissions: { contents: read, issues: write }`;
  ejecuta `scripts/check-review-date.js` y, si faltan 30 días o menos (o ya venció) y no
  hay una incidencia abierta con la etiqueta `revision-declaracion`, la crea con `gh` y
  la asigna a las cuentas de la variable del repositorio `MANTENEDORES_WEB`. En
  «comprobar» (cada push y PR), un paso con el mismo script emite `::warning::` y escribe
  en el resumen, siempre con código 0.
- **Riesgo de los 60 días y mitigación**: el aviso de cada push no depende del flujo
  programado; el commit mensual de la comisión mantiene la actividad durante el curso;
  el vencimiento se calcula a un año de la última revisión, y la primera revisión
  (estreno, enero de 2027) vencerá en pleno curso; y la guía del cambio incluye
  «comprobar que el flujo programado está activo» en la revisión anual. NO comprobado
  si abrir una incidencia o ejecutar el flujo cuenta como «actividad» (HUECO).
- **Alternativas**: un servicio externo de recordatorios o un calendario (tercero nuevo,
  depende de cuentas personales; FR-027 lo prohíbe); un commit automático periódico
  para mantener viva la actividad (cada commit en `main` despliega y ensucia el
  historial; necesitaría `contents: write`); solo el aviso en cada push (si nadie hace
  push, nadie se entera).

## R6 · Accesibilidad del panel (FR-011a, SC-009)

- **Decisión**: dentro del ensayo T030 de la 001, con el panel en local: (1) automática
  con la misma herramienta que la web (`@axe-core/playwright`, etiquetas `wcag2a`,
  `wcag2aa`, `wcag21a`, `wcag21aa`) mediante una prueba que NO forma parte de
  «comprobar»: `tests/panel/panel-accessibility.spec.js`, ejecutada a mano con
  `PANEL_URL`, en modo visible; la persona entra al panel a mano en la pausa
  (`page.pause()`) y la prueba recorre las pantallas; no guarda la sesión en disco;
  (2) teclado; (3) lector de pantalla (NVDA + Firefox o VoiceOver + Safari). Los fallos
  pasan a `declaracion.contenido_no_accesible` con `ambito: panel`. Se repite en el
  panel del VPS antes del estreno solo si cambia la versión de Pages CMS.
- **Razón**: FR-011a pide «el mismo método»; no añade dependencias.
- **Alternativas**: Lighthouse de Chrome DevTools (incluido en el navegador, pero usa un
  subconjunto de reglas y puntúa, ADR 0014); extensión axe DevTools (otra herramienta
  de terceros en el navegador de quien prueba); comprobarlo en «comprobar» (el panel no
  está en el repositorio ni hay sesión en Actions sin guardar credenciales).
- **No comprobado**: la documentación de Pages CMS no dice nada de su accesibilidad.

## R7 · Enlaces del pie en todas las páginas (FR-002, SC-001)

- **Decisión**: el `footer` de `src/_includes/layouts/base.njk` (creado en T012 de la
  001) lleva una lista con «Declaración de accesibilidad», «Aviso legal» y «Privacidad»,
  con rutas absolutas desde la raíz (`/accesibilidad/`, `/aviso-legal/`, `/privacidad/`)
  para que funcionen en `/404.html`, que nginx sirve en cualquier ruta. Se comprueba:
  `common.spec.js` (todas las páginas de cada proyecto, incluida `/404.html`), una
  prueba que pide una ruta inexistente al servidor local, `linkinator` (enlaces rotos) y
  `comprobar:cabeceras` (la 404 de nginx contiene los tres enlaces).
- **Alternativas**: un `include` aparte para el pie (lo mismo, un fichero más); enlaces
  relativos (se rompen en la 404 servida en `/a/b/c`).
