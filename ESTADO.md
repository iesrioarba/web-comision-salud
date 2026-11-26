# ESTADO · Web de la Comisión de Salud (IES Río Arba)
Actualizado: 2026-11-26

## Fase actual
001: fase 6 (implementación), rama T007+T010 · 002: fase 6 pendiente (empieza tras 001-T012 y la rama T013+T014)

## Decisiones
- 2026-11-05 · Plazo: lista a finales de diciembre de 2026 para arrancar en enero. Las pruebas se hacen con el reto de octubre.
- 2026-11-05 · Solo español. Se programa desde cero; el esqueleto de IA solo sirve como mapa de contenidos.
- 2026-11-05 · Alojamiento: VPS con Easypanel. Despliegue: Actions valida y llama al Deployment Trigger; Auto Deploy desactivado (ADR 0001).
- 2026-11-05 · Datos personales al mínimo; cada funcionalidad que los trate se decide aparte. Autoevaluación sin datos de salud.
- 2026-11-05 · Aprueba la comisión de salud. Datos del alumnado: consulta al DPD antes del pasaporte.
- 2026-11-05 · Organización iesrioarba a nombre del IES Río Arba (GitHub Customer Agreement), con autorización escrita de la dirección. Creada desde la cuenta personal del webmaster.
- 2026-11-05 · Organización para todos los proyectos del centro: un equipo por proyecto, permisos base «No permission», solo los propietarios crean repositorios. Sin cuentas compartidas.
- 2026-11-05 · Un único repositorio público, iesrioarba/web-comision-salud, sin copias. Remoto por HTTPS.
- 2026-11-05 · main protegida: sin force push ni borrado. En la fase 6 se exigirán pull request y comprobación en verde.
- 2026-11-06 · Herramienta: Claude Code con plan Max. Opus 5.5 para especificar, planificar y revisar; Sonnet/Haiku 5.5 para implementar. Plan B: OpenCode + Copilot Pro. AGENTS.md como única fuente (ADR 0002).
- 2026-11-06 · Código en inglés; documentación, textos de la web y commits en español.
- 2026-11-06 · Validador de HTML: html-validate 11 como dependencia de desarrollo, versión fijada (ADR 0003).
- 2026-11-07 · Desarrollo guiado por especificaciones con GitHub Spec Kit 1.3.2, adaptado: implementación con el subagente implementador, speckit-implement desactivada, trabajo por funcionalidades (ADR 0004).
- 2026-11-07 · Herramientas y dependencias: última versión estable, notas leídas, fijada y con ADR.
- 2026-11-09 · Constitución 1.0.0 ratificada: 8 principios, reglas generales y gobierno (.specify/memory/constitution.md).
- 2026-11-09 · 001-reto-octubre aclarada: los retos pasados siguen consultables; sin reto en curso, aviso de «próximo reto»; un solo reto de tutoría (la adaptación por etapas va en la guía); fechas de las semanas opcionales; el lugar y la descripción del Banco Chipi Chipi quedan como contenido pendiente.
- 2026-11-11 · Continuidad cubierta: la organización iesrioarba tiene otros propietarios además de Michel; el VPS es del centro y lo gestionan otras personas del centro (principio VIII).
- 2026-11-11 · Publicación: web estática + Pages CMS autoalojado en el VPS (ADR 0005). La comisión confía en el criterio de Michel.
- 2026-11-11 · Plan de 001-reto-octubre: Eleventy 3.1.8, Node 26, nginx 1.30.6, contenido en YAML validado, borradores con campo estado, aviso de fallos por correo, presupuesto de rendimiento y pruebas (ADR 0006 a 0014).
- 2026-11-11 · Constitución 1.0.1: el principio VII aclara que la revisión independiente es para el código (ADR 0015).
- 2026-11-19 · Sin fotos de los retos. Si se publican vídeos, será una funcionalidad aparte con su especificación: nunca en el repositorio, enlazados y no incrustados, y con autorización de imagen.
- 2026-11-19 · Ningún material lleva fotos de alumnado (carteles incluidos).
- 2026-11-19 · Lanzamiento sin anunciar hasta el estreno: noindex y X-Robots-Tag (ADR 0016).
- 2026-11-19 · Las páginas legales (002: declaración de accesibilidad, aviso legal y privacidad) se integran antes de desplegar la web nueva (T023).
- 2026-11-19 · El VPS está en Fráncfort (Alemania), dentro de la UE.
- 2026-11-19 · Plan de 002-paginas-legales aprobado (ADR 0017 a 0019).
- 2026-11-24 · Interfaz de src/lib/format.js fijada en T005 y T008 de tasks.md: siete funciones (formatDate, formatTime, formatFileType, formatFileSize, formatWeekRange, yearForMonth, toParagraphs), ESM con exports con nombre. Si una tarea no fija la interfaz, se fija en tasks.md, en su propio commit, antes de escribir las pruebas.
- 2026-11-24 · Fechas como fechas de calendario (UTC): el formato no depende de la zona horaria de la máquina.
- 2026-11-24 · Tamaños de archivo: base 1024; por debajo de 1 MB, KB enteros (mínimo 1 KB); desde 1 MB, MB con un decimal y coma decimal.
- 2026-11-25 · Los PR de tarea se integran con merge commit, no squash, para conservar el commit en rojo.
- 2026-11-25 · Cada PR de tarea marca sus tareas con [x] en tasks.md, en su último commit.
- 2026-11-25 · Interfaz del validador fijada en T006: field en notación JavaScript (meses[3].tema), message solo dice qué corregir, un error por fichero + campo, cada caso negativo da exactamente un error, y los errores entre ficheros van en el que va después según sort().
- 2026-11-25 · Un reto puede ser de un curso anterior al de curso.yml; el tema solo se toma de curso.yml si es del mismo curso (data-model.md corregido). Las reglas entre campos y entre ficheros solo se aplican a valores que ya pasan el esquema.
- 2026-11-26 · Antes de hacer commit de pruebas en rojo, se ejecutan contra un doble vacío: todos los fallos deben ser AssertionError.
- 2026-11-26 · Claude Code en auto mode (antes, modo manual), por ritmo de entrega. Las reglas deny siguen bloqueando (.env, MCP). La integración de los PR la hace Michel.

## Hecho
- Inventario de la petición de la comisión.
- Organización iesrioarba creada; equipo comision-salud con Write en el repositorio.
- Esqueleto andante: hola mundo validado en Actions y desplegado automáticamente en Easypanel por Trigger.
- 2026-11-06 · Claude Code 2.1.319 instalado y verificado (plan Max, Opus 5.5).
- 2026-11-06 · AGENTS.md con las reglas de la casa y permisos del proyecto en .claude/settings.json (modo manual, .env protegido, MCP bloqueados).
- 2026-11-06 · Validación con versión fijada: package.json + package-lock.json, npm run validar en local y en Actions. Primera tarea hecha con Claude Code (Sonnet 5.5) y revisada.
- 2026-11-06 · Subagentes planificador (Opus), implementador (Sonnet) y revisor (Opus, solo lectura) en .claude/agents/; sección «Papeles» en AGENTS.md.
- 2026-11-06 · Primera revisión independiente hecha; hallazgos corregidos: reglas deny ampliadas, ADR 0003, aclaraciones en el ADR 0002 y correo noreply en los commits.
- 2026-11-07 · Spec Kit instalado en la rama chore/spec-kit y revisado; AGENTS.md y subagentes adaptados.
- 2026-11-08 · Fase 0 cerrada con el visto bueno de Michel.
- 2026-11-09 · Fase 1 cerrada: constitución redactada con /speckit-constitution, revisada e integrada por PR.
- 2026-11-09 · Fase 2: especificación de 001-reto-octubre (specs/001-reto-octubre/spec.md).
- 2026-11-09 · Fase 3: /speckit-clarify con 5 preguntas; sin marcadores pendientes.
- 2026-11-09 · Fase 3 cerrada: especificación aclarada aprobada por Michel e integrada en main (PR #3).
- 2026-11-11 · Fase 4: plan de 001-reto-octubre con el subagente planificador, revisado y corregido.
- 2026-11-11 · Fase 4 cerrada: plan técnico de 001-reto-octubre aprobado por Michel e integrado en main (PR #4).
- 2026-11-19 · Fase 5: tareas de 001-reto-octubre (50) revisadas con tres pasadas de /speckit-analyze, sin críticos.
- 2026-11-19 · 002-paginas-legales: especificación y 7 aclaraciones, aprobadas por Michel e integradas en main.
- 2026-11-20 · 002: plan y tareas aprobados e integrados (PR #8).
- 2026-11-20 · 001-T001: Node 26.13.1 y dependencias fijadas; versiones de parche actualizadas en los ADR y planes; npm audit con riesgo aceptado (ADR 0014)
- 2026-11-20 · 001-T001 integrada en main sin PR por error (estaba en main); el diff se revisó antes. Desde hoy, la regla de main exige pull request.
- 2026-11-20 · 001-T002: acciones fijadas por SHA y Node desde .nvmrc (PR #9). La regla de main exige además que pase "comprobar".
- 2026-11-20 · 001-T003: esquemas copiados a schemas/ (PR #10); T006 añadirá comprobar:esquemas.
- 2026-11-21 · 001-T004: fixtures inventadas en tests/fixtures/ (PR #11); .gitattributes trata los PDF como binarios.
- 2026-11-25 · 001-T005 + T008: interfaz fijada en tasks.md, pruebas del formato en rojo y src/lib/format.js; 14/14 en local, también con TZ=America/Los_Angeles (PR #13). Las pruebas unitarias aún no se ejecutan en Actions: entran con T013.
- 2026-11-26 · 001-T006 + T009: interfaz enmendada en tasks.md, 88 pruebas en rojo comprobadas con un doble vacío, validador y check-schemas-sync; 102/102 en local; código revisado por el mentor (PR #15).

## Pendiente en fase 0
- Instalar OpenCode y conectarlo a Copilot Pro como plan B (sin usarlo)

## Preguntas abiertas
- Cuenta webmasteriesrioarba: sin uso. Proponer a la dirección borrarla (o protegerla si se quiere reservar el nombre)
- Avisar a quienes gestionan el VPS: el panel de Easypanel se usa por HTTP (IP:3000) y conviene ponerle dominio con HTTPS. Comprobar también si la URL del Deployment Trigger empieza por http://.
- Dominio definitivo
- Huecos del plan: sección HUECOS de specs/001-reto-octubre/plan.md
- Crear la cuenta del centro solo para enviar correo, con verificación en dos pasos y contraseña de aplicación (será una tarea MANUAL de tasks.md).
- Dependabot para actualizar las acciones fijadas por SHA: ¿se añade como tarea? (propuesta sin decidir)
- Caracteres invisibles: las herramientas de Claude Code escribieron U+00A0 y U+202F tal cual dos veces en T005/T008. Propuesta: regla en AGENTS.md (generarlos con String.fromCodePoint, nunca literales ni escapes \u) y comprobación automática en T013.
- 002 añade dateNoWeekday y pendiente al mismo src/lib/format.js; pendiente choca con «código en inglés». Decidir al empezar 002.
- Cambio de curso: al pasar curso.yml a 2027-2028, los retos de 2026-2027 pierden su tema (sale de curso.yml) y su calendario. Decidir antes de junio de 2027.
- Auto mode: añadir regla ask para git push y gh pr (punto de control humano).
- Para la fase 7 (del PR #15): M7 detectado por /allOf/1/then/; mensaje de format siempre de fecha; mayúsculas en nombres de archivo en macOS; enlaces simbólicos en materiales/; reto.curso sin comprobar años consecutivos ni curso futuro; error de tema que oculta el de orden de meses.
- Error de fichero entero impreso «curso.yml · : …»: arreglarlo en T011.

## Próximo paso
001-T007 (pruebas de la capa de datos, en rojo) en la rama tarea/001-T007-capa-de-datos; después T010. Luego, el camino más corto a una página visible para la comisión.
