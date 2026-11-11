# 0014 · Estrategia de pruebas: HTML, accesibilidad, enlaces y contenido

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
El principio VII prohíbe publicar sin comprobaciones en verde, y el I exige comprobar la
accesibilidad con herramientas automáticas y a mano. AGENTS.md dice que la fase 4 añade
las comprobaciones de accesibilidad, pruebas y rendimiento. Ya existe `html-validate`
(ADR 0003). Todo debe ejecutarse en local y en Actions sin enviar nada a servicios
externos.

## Decisión
Cada comprobación es un script de npm. «comprobar» los ejecuta todos, en este orden:

| Script | Qué comprueba | Herramienta y versión fijada |
|---|---|---|
| `npm run comprobar:contenido` | Ficheros de `content/` contra los esquemas y reglas (ADR 0008) | `yaml` 2.9.1, `ajv` 8.20.0, `ajv-formats` 3.0.1 |
| `npm test` | Pruebas unitarias del validador y de los filtros de plantilla con contenido inventado | `node:test`, incluido en Node 26: sin dependencia nueva |
| `npm run build` | Compila (incluye la validación) | Eleventy 3.1.8 (ADR 0006) |
| `npm run validar` | HTML válido de `_site/` | `html-validate` **11.21.0** (sube desde 11.18.0) |
| `npm run comprobar:enlaces` | Enlaces internos y materiales sin romper en `_site/` (los externos se omiten) | `linkinator` **8.1.0** |
| `npm run comprobar:web` | Escenarios de aceptación en navegador; accesibilidad automática WCAG 2.1 AA; 0 cookies y 0 peticiones a terceros; orden del foco con teclado | `@playwright/test` **1.65.0** (solo Chromium) y `@axe-core/playwright` **4.14.0** |
| `npm run comprobar:rendimiento` | Presupuesto (ADR 0013) | `@lhci/cli` 0.16.0 |

- axe se ejecuta con las etiquetas `wcag2a`, `wcag2aa`, `wcag21a` y `wcag21aa`
  (<https://github.com/dequelabs/axe-core/blob/develop/doc/API.md>) y cero
  infracciones permitidas.
- Las pruebas de navegador se ejecutan dos veces: con el contenido real de `content/` y
  con contenido inventado de `tests/fixtures/` (mes de prueba, sin reto en curso, datos
  «por confirmar», material que falta), para cubrir los casos límite de la
  especificación sin tocar el contenido real.
- La comprobación a mano con teclado y lector de pantalla sigue siendo obligatoria
  (principio I, SC-004) y se describe en `specs/001-reto-octubre/quickstart.md`.

Versiones comprobadas el 2026-11-11 en el registro de npm (`/latest`) y notas leídas:
- `html-validate` 11.21.0 (<https://registry.npmjs.org/html-validate/latest>), requiere
  Node `^22.22.0 || >= 24.8.0`; cambios 11.18 a 11.21 sin incompatibilidades
  (<https://html-validate.org/changelog/>).
- `linkinator` 8.1.0 (<https://registry.npmjs.org/linkinator/latest>); 8.0.0 exige
  Node ≥ 22, sin más cambios incompatibles
  (<https://github.com/JustinBeckwith/linkinator/releases>). Opciones `--recurse` y
  `--skip` (<https://github.com/JustinBeckwith/linkinator>).
- `@playwright/test` 1.65.0 (<https://registry.npmjs.org/@playwright/test/latest>);
  soporta Node 22, 24 y 26. Cambios incompatibles de 1.64 y 1.65 leídos
  (<https://playwright.dev/docs/release-notes>); afectan a TypeScript, cookies RFC 6265
  y nombres accesibles de texto no renderizado: se tienen en cuenta al escribir las
  pruebas, no hay código previo que migrar.
- `@axe-core/playwright` 4.14.0 (<https://registry.npmjs.org/@axe-core/playwright/latest>),
  arrastra `axe-core` ~4.14.0.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Playwright + axe** (elegida) | Una herramienta para accesibilidad, escenarios y red (cookies, terceros); descarga Chromium en Actions | Dependencia grande; pruebas de navegador más lentas |
| `pa11y-ci` | Solo accesibilidad, configuración sencilla | No cubre escenarios ni red: habría que añadir otra herramienta |
| Solo Lighthouse (incluye auditorías de axe) | Ya está para rendimiento | Subconjunto de reglas y por puntuación, no por infracción; no cubre escenarios |
| `linkinator` (elegida) | Pequeña, levanta su propio servidor local | Hay que excluir bien los enlaces externos para no depender de la red |
| `lychee` | Rápido | Binario de Rust o acción de terceros: otra cadena de herramientas |
| Comprobar enlaces con Playwright | Sin dependencia nueva | Código propio que reescribe un rastreador |
| `node:test` (elegida) | Incluido en Node | Menos cómodo que Jest/Vitest, suficiente para un validador |

## Consecuencias
- Las comprobaciones de la sección «Comprobaciones» de AGENTS.md deben ampliarse con
  estos scripts (lo hace la sesión principal; el planificador no toca AGENTS.md).
- `npm run validar` pasa a validar `_site/` en lugar de `site/`.
- «comprobar» tarda más (Chromium y Lighthouse): unos minutos por publicación.
- Las pruebas no prueban el panel de Pages CMS (es un producto externo); su
  configuración se comprueba contra los esquemas con una prueba de coherencia y a mano
  con el quickstart.
