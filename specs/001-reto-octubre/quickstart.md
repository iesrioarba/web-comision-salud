# Quickstart: comprobar que el reto del mes funciona

**Plan**: [plan.md](plan.md) · **Modelo**: [data-model.md](data-model.md) ·
**Contratos**: [contracts/](contracts/)

Guía de validación de punta a punta. No contiene código: dice qué ejecutar y qué debe
salir. Los nombres de los scripts son los del plan (ADR 0014).

## Requisitos

- Node 26.13.0 (`.nvmrc`) y npm.
- `npm ci` y, para las pruebas de navegador, `npx playwright install chromium`.
- Para los escenarios del panel: Pages CMS en marcha en el VPS (HUECO: dominio, SMTP) y
  una persona de prueba invitada con un correo inventado del centro.

## A · Comprobaciones automáticas (local y en «comprobar»)

| # | Orden | Resultado esperado |
|---|---|---|
| A1 | `npm run comprobar:contenido` | Sale con código 0 y «Contenido correcto» con el contenido real |
| A2 | `npm test` | Todas las pruebas del validador en verde, incluidas las que deben fallar (fecha imposible, hora 25:00, infografía sin texto, publicado sin fuentes, `en_curso` apuntando a un borrador, material inexistente o > 10 MB, mes repetido) con su mensaje en español |
| A3 | `npm run build` | Genera `_site/` con `/`, `/calendario/`, `/retos/2026-2027/octubre/` y `/404.html`; ningún borrador genera página |
| A4 | `npm run validar` | 0 errores de `html-validate` en `_site/**/*.html` |
| A5 | `npm run comprobar:enlaces` | 0 enlaces internos rotos; los externos se omiten |
| A6 | `npm run comprobar:web` | Todos los escenarios de `tests/e2e/` en verde, con contenido real y con `tests/fixtures/`; 0 infracciones de axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`); 0 cookies; 0 peticiones fuera de `localhost` |
| A7 | `npm run comprobar:rendimiento` | Todas las aserciones de `lighthouserc` cumplidas (ADR 0013) |
| A8 | `docker build .` | La imagen se construye; si el contenido es inválido, la construcción falla en el paso de validación |

## B · Escenarios de la especificación cubiertos por pruebas automáticas

| Escenario | Qué comprueba la prueba |
|---|---|
| US1-1, US1-2 | En `/` aparecen «Gestión del conflicto», «Resolver, no ganar», el objetivo, los 4 pasos en una `ol` y en orden, y los tres retos con su semana |
| US1-3 | El reto motriz muestra «Banco Chipi Chipi», «viernes, 9 de octubre de 2026», «11:30» |
| US1-4, SC-008 | El lugar del motriz muestra «Por confirmar»; con `tests/fixtures/` ningún dato vacío aparece en blanco; sin `desde`/`hasta` no aparecen fechas de semana |
| US2-1 a US2-4 | Cada material está en su reto y su texto incluye título, formato y tamaño; sin `archivo`, «Disponible próximamente» sin enlace |
| US2-5, SC-007 | La infografía tiene su «Texto de la infografía» con los 4 pasos en orden |
| US2-6 | Ficha y justificante muestran «Se entrega en papel o por la plataforma educativa…» |
| US4-1, US4-2 | `/calendario/` tiene 9 elementos de octubre a junio; un tema vacío (fixture) muestra «Por anunciar» |
| US4-3 | El mes en curso tiene el texto «Reto en curso» y `aria-current` |
| US4-4, FR-028 | Con la fixture «sin reto en curso», `/retos/…/octubre/` dice «No es el reto en curso» |
| FR-029 | Con la fixture «sin reto en curso», `/` muestra «Próximo reto», el enlace al último reto publicado y el calendario |
| US5-1, US5-2 | El enlace al Genially tiene el texto «El Arbalquimista de la salud (sitio externo)» |
| US5-3, SC-005 | Al cargar cualquier página: 0 peticiones a otros dominios y 0 cookies |
| US1-5 (parcial) | Recorrido con Tab: el primer foco es «Saltar al contenido» y el orden sigue el del contrato |
| US3-3, US3-4 | Un fichero de reto mal formado hace fallar `npm run build` (la web anterior no se toca); un texto con `<script>` se muestra escapado |

## C · Comprobaciones a mano (obligatorias, principio I y SC-004)

1. **Teclado**: en `/`, `/calendario/` y `/retos/2026-2027/octubre/`, recorrer todo con Tab
   y Mayús+Tab. Esperado: foco siempre visible, orden lógico, todo alcanzable, nada
   atrapa el foco, «Saltar al contenido» funciona.
2. **Lector de pantalla**: NVDA con Firefox (Windows) o VoiceOver con Safari (macOS/iOS),
   y TalkBack (Android). Esperado: se oyen el tema, el nombre del reto, los tres retos
   con su semana y los datos del motriz; cada material dice qué es, para quién, formato y
   tamaño; «(sitio externo)» se lee en el enlace al Genially; la infografía se lee entera
   como texto.
3. **Móvil modesto** (HUECO: modelo): con la red limitada a «Slow 4G», el tema y los tres
   retos se leen en menos de 3 s (SC-006).
4. **Impresión**: imprimir `/retos/2026-2027/octubre/` a PDF. Esperado: solo el contenido,
   legible, sin menús.
5. **Zoom y reflujo**: al 200 % y a 320 px de ancho, sin desplazamiento horizontal.
6. **Materiales** (FR-009): abrir cada PDF de octubre y comprobar que tiene texto
   seleccionable (no es una imagen escaneada) o una alternativa accesible en la web.

## D · Panel y publicación (fase 6, con el panel desplegado)

Datos inventados: curso `2026-2027`, mes `noviembre` (el modelo solo admite los 9 meses
reales, así que el «mes inventado» de US3 se hace con un hueco real y contenido
inventado), reto «Reto de prueba inventado», lugar «Patio de ejemplo», correo
`persona.prueba@example.org`.

6. **Publicar un reto de prueba** (US3-1, SC-003): una persona de la comisión, solo con
   la guía, crea el reto, sube un PDF de prueba, lo marca `publicado` y lo pone en
   `en_curso`. Esperado: en menos de 30 minutos aparece en la web con el mismo aspecto
   que octubre. Entorno (H15 del plan): Pages CMS lee `.pages.yml` por rama, así que se
   prueba en una rama de pruebas; comprobarlo en la fase 6.
7. **Corregir la hora del motriz** (US3-2): cambiar 11:30 por 12:00. Esperado: tras
   «comprobar» y «desplegar», la web muestra solo 12:00.
8. **Error de edición** (US3-3): intentar guardar la hora «25:00». Esperado: el panel
   muestra «Escribe la hora así: 11:30» y no guarda. Si el error solo lo detecta la
   compilación (p. ej. infografía sin texto), «comprobar» falla, la web no cambia y llega
   el correo del ADR 0012 al buzón de la comisión.
9. **Persona no autorizada** (US3-5): con un correo no invitado, no se puede entrar en el
   panel; sin permiso de escritura en GitHub, no se puede hacer commit.
10. **Borrador** (ADR 0011): un reto en `borrador` no aparece en la web ni en el
    calendario; ponerlo en `en_curso` hace fallar «comprobar».
11. **Historial sin datos personales** (ADR 0010): el commit generado por el panel no
    contiene el nombre ni el correo de quien editó.
12. **Fallo de compilación en el VPS** (ADR 0007): forzar una compilación fallida en
    Easypanel y comprobar si la web anterior sigue servida. Anotar el resultado en el
    ADR 0007.

Al terminar, se borran el reto de prueba y sus materiales.
