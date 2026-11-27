# AGENTS.md · Web de la Comisión de Salud · IES Río Arba

Instrucciones para cualquier agente de IA que trabaje en este repositorio.
Es la única fuente de instrucciones: no se crea CLAUDE.md (ADR 0002).

## Qué es este proyecto
Web del proyecto de innovación de salud del IES Río Arba (Tauste, Aragón), curso 2026-2027.
Público: alumnado de ESO, Bachillerato y FP, familias y profesorado de un centro público.
Quien actualiza los contenidos cada mes es profesorado sin conocimientos de programación.

## Antes de hacer nada
1. Lee `ESTADO.md`: fase actual, decisiones y tareas pendientes.
2. Lee la constitución (`.specify/memory/constitution.md`), los documentos de la
   funcionalidad en curso (`specs/NNN-nombre/`) y las decisiones en `docs/decisiones/`.
3. Si lo que te piden no encaja con la fase actual o contradice un documento, para y dilo.

## Método: fases con puerta, con GitHub Spec Kit (ADR 0004)
| Fase | Cómo | Resultado |
|---|---|---|
| 1 Principios (una vez) | `/speckit-constitution` | `.specify/memory/constitution.md` |
| 2 Especificación | `/speckit-specify` | `specs/NNN-nombre/spec.md` |
| 3 Aclaraciones | `/speckit-clarify` | `spec.md` completada |
| 4 Plan técnico | `/speckit-plan` (subagente `planificador`) + ADR | `specs/NNN-nombre/plan.md` |
| 5 Tareas | `/speckit-tasks` (subagente `planificador`) y `/speckit-analyze` | `specs/NNN-nombre/tasks.md` |
| 6 Implementación | Subagente `implementador`, una tarea cada vez. NO se usa `/speckit-implement` | Código y pruebas |
| 7 Revisión | Subagente `revisor` y `/speckit-converge` | Informe y tareas pendientes |
| 8 Despliegue y traspaso | A mano | Producción y guía de mantenimiento |

- Las fases 2 a 7 se repiten por funcionalidad (`001-…`, `002-…`). La primera es el reto de octubre.
- La funcionalidad activa de Spec Kit está en `.specify/feature.json`, que es local
  (Spec Kit lo excluye de git). `/speckit-specify` lo fija al crear una funcionalidad.
  En un clon nuevo, o para cambiar de funcionalidad, se edita ese fichero o se define
  la variable `SPECIFY_FEATURE_DIRECTORY=specs/NNN-nombre`.

- No se avanza de fase sin el visto bueno explícito de Michel.
- En las fases 1 a 3 no se elige tecnología ni se escribe código.
- Cada decisión técnica se registra como ADR en `docs/decisiones/NNNN-titulo.md`
  (Contexto, Decisión, Consecuencias).

## Papeles
- **Coordinador: la sesión principal.** Habla con Michel, lleva las fases y su puerta,
  y hace las fases 1 a 3 en diálogo con él. Decide cuándo delegar y revisa lo que
  devuelven los subagentes antes de darlo por bueno.
- **Subagentes** (`.claude/agents/`), solo cuando Michel lo pida de forma explícita:
  - `planificador` (Opus): fases 4 y 5, a partir de documentos ya aprobados.
  - `implementador` (Sonnet): una tarea de `tasks.md` cada vez.
  - `revisor` (Opus, solo lectura): revisa frente a la tarea, el plan y estas reglas.
- Quien escribe algo no es quien lo revisa.

## Reglas que nada puede romper

### Privacidad (RGPD)
- La web no recoge datos personales salvo decisión expresa y documentada en un ADR.
- Datos de salud: categoría especial. Ninguna funcionalidad los trata. Si una tarea
  parece necesitarlos, para y pregunta.
- Nada de analítica, fuentes, vídeos ni widgets de terceros que pongan cookies o
  rastreen sin consentimiento. Los vídeos se cargan solo cuando la persona pulsa.
- Nunca escribas datos reales de alumnado ni del personal en el código, en los
  ejemplos, en las pruebas ni en los commits. Usa datos inventados y evidentes.

### Accesibilidad (WCAG 2.1 AA, RD 1112/2018)
- HTML semántico primero; ARIA solo cuando el HTML no basta.
- Todo se usa con teclado, con foco visible, y funciona con lector de pantalla.
- Contraste AA, textos alternativos útiles, subtítulos en los vídeos, idioma `es`.
- Una tarea con interfaz no está hecha sin pasar la comprobación automática y sin
  describir cómo se ha comprobado con teclado.

### Secretos
- Ninguna clave, token, contraseña ni URL secreta en el repositorio, en los logs ni
  en los mensajes. Van en variables de entorno o en los secretos de GitHub.
- No leas ni muestres ficheros `.env`.

### Mantenibilidad
- Lo sencillo y estándar antes que lo novedoso. Si quien edita no es técnico, eso manda.
- Nada de dependencias nuevas sin justificarlas en el plan o en un ADR.
- Al añadir una herramienta o dependencia: última versión estable (nunca beta o rc),
  leer sus notas de versión buscando cambios incompatibles, fijarla y registrarla
  en un ADR.

## Cómo se trabaja una tarea (fase 6)
1. Una tarea de `specs/NNN-nombre/tasks.md` cada vez por encargo al implementador.
   Una rama puede agrupar varias tareas (ver «Ramas y commits» en `tasks.md`).
   Ramas cortas: `tarea/NNN-TNNN-descripcion` (tres cifras, como Spec Kit).
2. Primero la prueba o la comprobación que demuestra el criterio de hecho; luego el código.
   Si las pruebas y su implementación van juntas, una sola rama: primer commit con las
   pruebas en rojo, después la implementación.
3. Cambios pequeños. No toques lo que la tarea no pide.
4. Ejecuta las comprobaciones (abajo). Una tarea no está hecha sin ellas en verde.
5. El subagente `implementador` no hace commit ni push: Michel revisa el diff y hace el
   commit convencional, el push y la PR. Commits convencionales: `tipo: descripción en español`
   (`feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`, `ci`).
6. Actualiza `ESTADO.md` y marca la tarea en `tasks.md`.
7. Nunca hagas `git push --force`, no borres ramas remotas ni reescribas historia publicada.
   Las ramas `ensayo/…` son de usar y tirar: se borran al terminar el ensayo.

## Comprobaciones
- Todas, en el orden de Actions: `npm run comprobar`.
- `npm run comprobar:caracteres`: busca U+00A0 y U+202F (literales o como escape) en `src/`, `scripts/`, `tests/` y `eleventy.config.js`.
- `npm run comprobar:esquemas`: comprueba que `schemas/` y los contratos de la funcionalidad son idénticos.
- `npm run comprobar:contenido`: valida el contenido (`CONTENT_DIR`) con los esquemas y las reglas entre campos.
- `npm test`: pruebas unitarias (`node --test tests/unit/`).
- `npm run build`: compila `src/` y `CONTENT_DIR` a `_site/`; `npm run build:fixtures` compila cada fixture a `_site-fixtures/<nombre>/`.
- `npm run validar`: valida el HTML de `_site/` y `_site-fixtures/` con html-validate.
- `npm run comprobar:enlaces`: comprueba los enlaces internos de `_site/` y de cada fixture.
- `npm run comprobar:web`: pruebas en Chromium de cada página (idioma, título, encabezados, regiones, enlace de salto, axe WCAG 2.1 AA, sin cookies, sin peticiones externas, sin `iframe`, `form` ni `script`).
- `npm run comprobar:rendimiento`: Lighthouse CI sobre `_site/` con el presupuesto del ADR 0013; los informes quedan en `.lighthouseci/`.
- Requisito: `npx playwright install chromium` (y Google Chrome para Lighthouse si no está instalado).
- Cada compilación empieza con la salida limpia (`scripts/clean-output.js`).
- Variables: `CONTENT_DIR` (carpeta de contenido, por defecto `content`) y `OUTPUT_DIR` (carpeta de salida de Eleventy, por defecto `_site`; `build:fixtures` la usa para compilar a `_site-fixtures/<nombre>/`; solo admite rutas que empiezan por `_site`).
- U+00A0 y U+202F se generan con `String.fromCodePoint(0x00a0)` y `String.fromCodePoint(0x202f)`, nunca como carácter literal ni como escape `\u` o `\x`, en `src/`, `scripts/`, `tests/` y `eleventy.config.js`; lo comprueba `npm run comprobar:caracteres`.
- Las comprobaciones manuales de teclado, lector de pantalla y móvil están en `specs/001-reto-octubre/quickstart.md` (apartado C).

## Idioma y estilo
- Documentación, textos de la web y mensajes de commit: español. Las plantillas de
  Spec Kit tienen los encabezados en inglés: se mantienen, y el contenido se escribe en español.
- Código (variables, funciones, clases, nombres de fichero de código): inglés.
- Lenguaje del dominio: las propiedades de datos que vienen del dominio usan las palabras de la especificación y del contenido, en español y en camelCase (enCurso, proximoMes, calendario, materiales, paraQuien). Las funciones, las variables internas y los nombres técnicos van en inglés (loadSite, readChallenge).
- Respuestas al usuario: español, directas y breves; di qué has comprobado y qué no.

## Cuándo parar y preguntar
- Falta información o la especificación es ambigua.
- La tarea implica datos personales, de salud, servicios de terceros o costes.
- Una comprobación falla y no sabes por qué.
- Vas a cambiar algo fuera del alcance de la tarea.

## Estructura
- `site/`: lo que se publica (provisional hasta la fase 4).
- `.specify/`: Spec Kit (constitución, plantillas, scripts). No se edita a mano salvo la constitución.
- `.claude/skills/speckit-*`: las órdenes de Spec Kit. `.claude/agents/`: subagentes.
- `specs/NNN-nombre/`: especificación, plan y tareas de cada funcionalidad.
- `docs/decisiones/`: ADR, uno por decisión.
- `.github/workflows/`: validación y despliegue (solo despliega si todo pasa).
- `ESTADO.md`: estado del proyecto.
