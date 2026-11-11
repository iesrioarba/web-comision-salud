# Research: El reto del mes (001-reto-octubre)

**Fecha**: 2026-11-11 · **Plan**: [plan.md](plan.md)

Consulta de documentación y versiones hecha el 2026-11-11. Cada decisión tiene su ADR en
`docs/decisiones/`; aquí se resume con el formato Decisión / Razón / Alternativas.
Las versiones «latest» se tomaron del registro de npm o de la página de versiones
oficial, y se leyeron las notas buscando cambios incompatibles.

## Tabla de versiones fijadas

| Pieza | Versión | Dónde | Fuente |
|---|---|---|---|
| Pages CMS | 2.1.8 | VPS (panel) | <https://github.com/pages-cms/pages-cms/releases> |
| Node.js | 26.13.0 (Active LTS hasta 2027-10-20; fin 2029-04-30) | Local, Actions, imagen de compilación | <https://github.com/nodejs/release#release-schedule> |
| Imagen de compilación | `node:26.13.0-alpine3.24` | Dockerfile | <https://hub.docker.com/_/node> |
| Imagen de servicio | `nginx:1.30.6-alpine3.24` (nginx estable 1.30.6) | Dockerfile | <https://nginx.org/en/download.html>, <https://hub.docker.com/_/nginx> |
| `@11ty/eleventy` | 3.1.8 | dependencies | <https://registry.npmjs.org/@11ty/eleventy> |
| `yaml` | 2.9.1 | dependencies | <https://registry.npmjs.org/yaml/latest> |
| `ajv` | 8.20.0 | dependencies | <https://registry.npmjs.org/ajv/latest> |
| `ajv-formats` | 3.0.1 | dependencies | <https://registry.npmjs.org/ajv-formats/latest> |
| `html-validate` | 11.21.0 (desde 11.18.0) | devDependencies | <https://registry.npmjs.org/html-validate/latest> |
| `linkinator` | 8.1.0 | devDependencies | <https://registry.npmjs.org/linkinator/latest> |
| `@playwright/test` | 1.65.0 | devDependencies | <https://registry.npmjs.org/@playwright/test/latest> |
| `@axe-core/playwright` | 4.14.0 | devDependencies | <https://registry.npmjs.org/@axe-core/playwright/latest> |
| `@lhci/cli` | 0.16.0 (Lighthouse 13.6.0) | devDependencies | <https://registry.npmjs.org/@lhci/cli/latest> |

Todas se fijan con versión exacta en `package.json` (sin `^`, a diferencia del actual
`"html-validate": "^11.18.0"`) y en `package-lock.json`.

## R1 · Panel de edición (decidido por Michel)

- **Decisión**: Pages CMS 2.1.8 autoalojado en Easypanel con PostgreSQL; GitHub App de la
  organización instalada solo en este repositorio; colaboradores por correo; `.pages.yml`.
  ADR 0005.
- **Razón**: el contenido queda en el repositorio (principio VIII), nadie necesita cuenta
  de GitHub (principio V) y la web pública no depende del panel.
- **Alternativas**: Payload, WordPress, panel propio, Directus, Decap/Sveltia (ADR 0005).
- **Comprobado**: variables de entorno, incluido SMTP
  (<https://pagescms.org/docs/development/environment-variables/>); instalación
  autoalojada con `npm run db:migrate`, `npm run build`, `npm run start` y proxy con HTTPS
  (<https://pagescms.org/docs/guides/installing/self-host/>); colaboradores sin cuenta de
  GitHub, que no pueden tocar `.pages.yml` y cuyos commits firma la app
  (<https://pagescms.org/docs/configuration/collaborators/>); `required` y `pattern` con
  mensaje propio (<https://pagescms.org/docs/configuration/content/fields/>).
- **No comprobado**: cómo guarda Pages CMS un campo opcional vacío (`""`, `null` o
  ausente). Por eso los esquemas aceptan los tres como «vacío». Tampoco: si una lista se
  puede fijar a 9 elementos, si la carpeta de un campo `file` admite variables, ni la
  sintaxis exacta de listas en 2.1.8. Se comprueba en la fase 6 con el panel real.

## R2 · Generador de sitio estático

- **Decisión**: Eleventy 3.1.8 con Nunjucks (escape automático). ADR 0006.
- **Razón**: pocas dependencias, sin JS en el navegador por defecto, mismo Node que ya
  usa el proyecto, plantillas legibles para quien llegue después.
- **Alternativas**: Astro 7.4.10 (más dependencias, telemetría por defecto, versiones
  mayores frecuentes), Hugo 0.169.0 (sin validación, otra cadena de herramientas), HTML a
  mano (no puede convertir datos en páginas).

## R3 · Formato y validación del contenido

- **Decisión**: YAML de datos puros en `content/`, JSON Schema 2020-12 en `schemas/`
  validado con `ajv` + `ajv-formats` y reglas entre campos en
  `scripts/validate-content.js`; primer paso de `npm run build`. ADR 0008.
- **Razón**: FR-014 (nada mal formado llega a la web) con defensa en profundidad: panel →
  «comprobar» en Actions → compilación en el VPS.
- **Alternativas**: script sin dependencias, `eleventyDataSchema` con Zod, Markdown con
  front matter, solo el panel.
- **Comprobado en esta fase**: los tres esquemas de `contracts/` compilan en modo estricto
  con el `ajv` que ya hay en `node_modules` (dependencia de `html-validate`) y aceptan o
  rechazan como se espera el ejemplo de octubre y 6 variantes mal formadas.
- **A tener en cuenta**: los mensajes de `ajv` salen en inglés y repetidos por los
  `anyOf`; el script DEBE traducirlos a un mensaje en español por campo («En
  `motriz.hora`: escribe la hora así: 11:30»).

## R4 · Borradores

- **Decisión**: campo `estado` (`borrador`/`publicado`) en el repositorio público.
  ADR 0011.
- **Razón**: no cambia el ADR 0001 ni el despliegue; quien no tiene cuenta de GitHub puede
  publicar y despublicar.
- **Alternativas**: repositorio privado (Easypanel necesitaría token o clave SSH de
  despliegue, <https://easypanel.io/docs/code-sources/git-ssh>), rama de borradores,
  repositorio privado de contenido.
- **Riesgo aceptado (a confirmar)**: los borradores se ven en GitHub.

## R5 · Aviso de fallo a quien publica

- **Decisión**: correo al buzón de la comisión desde Actions con `curl` por el SMTP del
  centro cuando «comprobar» falla en `main` con un commit de contenido hecho por la app
  del panel; si falla un cambio de código, se avisa a quien mantiene la web. ADR 0012.
- **Razón**: la comisión no tiene cuenta de GitHub; `curl` ya está en el ejecutor (sin
  dependencias).
- **Alternativas**: solo notificaciones de GitHub, acción de terceros, API de correo
  externa, página de estado.
- **No comprobado**: que Pages CMS muestre el estado de flujos lanzados por `push` (su
  documentación de Actions no lo dice, <https://pagescms.org/docs/configuration/actions/>).

## R6 · Correo del panel

- **Decisión**: `EMAIL_PROVIDER=smtp` con SMTP del centro. ADR 0009.
- **Alternativas**: Resend (tercero nuevo), sin correo.

## R7 · Datos de quienes editan

- **Decisión**: solo correo y sesión, en el PostgreSQL del VPS; commits firmados por la
  app; plantillas de commit sin `{userName}` ni `{userEmail}`. ADR 0010.

## R8 · Compilación, servidor y Node

- **Decisión**: Node 26.13.0; Dockerfile en dos etapas que valida y compila; nginx 1.30.6
  con configuración propia (CSP `default-src 'self'`, compresión, caché de materiales,
  404 en español). ADR 0007.
- **Razón**: Node 22, el que usa hoy Actions, deja de tener soporte el 2027-04-30, en
  mitad del curso. Repetir la validación en el Dockerfile protege del caso en que
  Easypanel compile un `HEAD` más nuevo que el comprobado.
- **Comprobado**: GitHub Actions sí lanza flujos con los `push` hechos con un token de
  instalación de GitHub App (solo el `GITHUB_TOKEN` no los lanza,
  <https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow>):
  cada guardado del panel ejecutará «comprobar».
- **No comprobado**: que Easypanel mantenga el contenedor anterior si la compilación
  falla.

## R9 · Presupuesto de rendimiento

- **Decisión**: Lighthouse móvil por defecto (Slow 4G simulado, CPU ×4) con LCP ≤ 2,5 s,
  FCP ≤ 1,8 s, CLS ≤ 0,1, TBT ≤ 200 ms y ≤ 150 KB en total; `@lhci/cli` 0.16.0 sin subir
  informes a ningún servidor. ADR 0013.
- **Comprobado**: ajustes de limitación por defecto
  (<https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md>);
  aserciones `resource-summary` y `staticDistDir`
  (<https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md>).

## R10 · Pruebas

- **Decisión**: `node:test` (validador), `html-validate` (HTML), `linkinator` (enlaces
  internos), Playwright + axe (escenarios, WCAG 2.1 AA, cookies y terceros, foco),
  Lighthouse CI (rendimiento); con contenido real y con contenido inventado de
  `tests/fixtures/`. ADR 0014.
- **Alternativas**: pa11y-ci, solo Lighthouse, lychee, enlaces con Playwright.

## R11 · Protección de `main` y panel

- **Hallazgo**: ESTADO.md prevé exigir pull request en `main` en la fase 6, pero Pages CMS
  escribe directamente en `main`. GitHub permite añadir una GitHub App como excepción
  (bypass) de un ruleset
  (<https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository>).
- **Decisión** (confirmada por Michel): ruleset con pull request obligatorio para
  personas y la app de Pages CMS como excepción. «comprobar» sigue siendo obligatorio
  antes de desplegar porque lo impone el flujo (`needs: comprobar`), no la regla de rama.
- **Controles** (ADR 0005):
  - La GitHub App NO DEBE tener el permiso «Workflows». Se comprueba al crearla en la
    fase 6.
  - «comprobar» DEBE fallar si un commit hecho por la app modifica algo fuera de
    `content/` y `.pages.yml`.
