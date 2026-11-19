# Quickstart: comprobar que las páginas legales funcionan

**Plan**: [plan.md](plan.md) · Contratos: [contracts/](contracts/) · Modelo:
[data-model.md](data-model.md)

## Requisitos

Los de `specs/001-reto-octubre/quickstart.md` (Node 26.13.0, `npm ci`, Chromium de
Playwright, Docker para las cabeceras y los registros). Datos INVENTADOS y evidentes en
las fixtures (p. ej. `accesibilidad@example.org`, CIF `X00000000`).

## A · Automáticas (local y en «comprobar»)

| # | Orden | Resultado esperado |
|---|---|---|
| A1 | `npm run comprobar:legal` | 0 con `src/legal/datos.yml`; ≠ 0 y mensaje en español si `canal_contacto` es `null`, si un valor es `""` o contiene «pendiente» |
| A2 | `npm run comprobar:legal -- --panel` | ≠ 0 mientras `responsable` o `base_legal` sean `null` |
| A3 | `npm run comprobar:legal -- --estreno` | ≠ 0 con cualquier `null`, `en_revision: true` o `panel_comprobado: null` |
| A4 | Compilar sin `noindex` (fixture) y `npm run comprobar:legal` | aplica solo las reglas de estreno |
| A5 | `node --test tests/unit/` | pruebas de `check-legal` y `check-review-date` (fechas inventadas: 400, 340, 334 y 100 días tras la última revisión) en verde |
| A6 | `npm run comprobar:web` | en cada página de cada proyecto, incluida `/404.html`: los tres enlaces del pie; en las legales: un `h1`, «Última actualización», orden de los seis `h2` de la declaración, dos `h2` de privacidad, ni `form`/`img`/`video`/`iframe`, axe 0 infracciones; fixture `legal-pendientes`: «Pendiente de confirmar» visible donde hay `null` |
| A7 | `npm run comprobar:enlaces` | 0 enlaces rotos (caso límite «Página legal no encontrada») |
| A8 | `npm run comprobar:cabeceras` | la 404 de nginx contiene los tres enlaces; tras las peticiones, `docker logs` del contenedor no contiene ninguna IP ni línea de acceso (ADR 0018) |
| A9 | Paso «Aviso de revisión» en una PR con una fecha de prueba vencida (solo en local, sin integrar) | anotación de aviso en la ejecución, trabajo en verde |

## B · Escenarios de la especificación

| Escenario | Cómo |
|---|---|
| US1-1, US2-1, US3-1 | A6 (pie) |
| US1-2, SC-004 | A6 (orden de `h2`) + revisión contra el modelo de la Decisión (UE) 2018/1523 (C4) |
| US1-3 | A6 con `datos.yml` real: «parcialmente conforme» y «en revisión» |
| US1-4, US1-5, US1-6 | A6 (contenido de los apartados) + C4 |
| US2-2, US2-3 | A6 (encabezados y campos) |
| US2-4, SC-007 | C5 y C6 |
| US3-2, US3-3 | A6 |
| US4-1 a US4-5, SC-006, SC-008 | C7 y C8 |

## C · Manuales

| # | Qué | Resultado esperado |
|---|---|---|
| C1 | Teclado en las tres páginas y en la 404 | se llega a los tres enlaces del pie y se recorren las páginas; foco visible |
| C2 | Lector de pantalla (NVDA + Firefox o VoiceOver + Safari) | se navega por encabezados; el `nav` «Información legal» se anuncia |
| C3 | Impresión | se imprimen legibles, sin menús ni pie |
| C4 | Revisión contra el modelo europeo y FR-008 a FR-017 | ningún apartado falta; ningún dato inventado |
| C5 | Web publicada: herramientas del navegador | 0 cookies, 0 peticiones a terceros |
| C6 | Registros en el VPS (con quienes lo gestionan) | `docker logs` del servicio web sin IP; proxy según ADR 0018 |
| C7 | Revisión anual simulada: lanzar a mano el flujo `revision-declaracion` con una fecha vencida en una rama de ensayo | se crea UNA incidencia asignada; una segunda ejecución no crea otra |
| C8 | Suplente (SC-008): solo con `docs/guia-paginas-legales.md`, desde la web de GitHub, cambia `fecha_ultima_revision` en una rama y abre la PR | PR en verde, sin ayuda |
| C9 | Panel (SC-009): `PANEL_URL=http://localhost:3000 npx playwright test tests/panel/ --headed` en el ensayo T030 de la 001, más teclado y lector | tabla de fallos → `contenido_no_accesible` con `ambito: panel` |
| C10 | SC-002 con 3 personas (alumnado de 12 a 14 incluido) | ≥ 2 encuentran el canal en < 1 min desde `/`, sin recoger datos personales |
