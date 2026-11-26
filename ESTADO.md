# ESTADO · Web de la Comisión de Salud (IES Río Arba)
Actualizado: 2026-11-26

## Fase actual
001: fase 6 (implementación), rama T013+T014 · 002: fase 6 pendiente (empieza al integrar la rama T013+T014)

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
- 2026-11-26 · Claude Code en auto mode, activado al abrir la sesión con --permission-mode auto; el repositorio sigue en modo manual por defecto. Las reglas deny siguen bloqueando (.env, MCP). La integración de los PR la hace Michel.
- 2026-11-26 · Las tareas se ejecutan con la skill de proyecto /tarea (.claude/skills/tarea/): ciclo completo (interfaz, pruebas en rojo con doble vacío, implementación, PR) sin paradas salvo en sus PUERTAS; admite tareas sueltas y notas. El mentor revisa en el PR y Michel integra. Las tareas de contenido de la comisión y las MANUAL se hacen aparte.
- 2026-11-26 · Lenguaje del dominio (AGENTS.md): propiedades de datos en español y camelCase (enCurso, calendario, paraQuien); funciones y nombres técnicos en inglés (loadSite).
- 2026-11-26 · Capa de datos (loadSite): da los textos fijos y los valores ya formateados (sufijo Texto); «Por confirmar» y «Por anunciar» los ponen las plantillas. No valida: npm run build ejecuta primero el validador.
- 2026-11-26 · Escape: Eleventy 3 usa las opciones por defecto de Nunjucks (autoescape activado); | safe solo con content en el layout.

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
- 2026-11-26 · Skill /tarea y regla del lenguaje del dominio en AGENTS.md (PR #17); /tarea admite tareas sueltas y notas (PR #20).
- 2026-11-26 · 001-T007 + T010: loadSite y src/_data/site.js, 71 pruebas; primera pareja hecha con /tarea; 173/173 en local (PR #18).
- 2026-11-26 · 001-T011: contenido real de partida de octubre, copiado de los ejemplos; comprobar:contenido en verde (PR #19).
- 2026-11-26 · 001-T012: esqueleto de Eleventy (base.njk con noindex y salto al contenido, 404, CSS funcional); build = validador + Eleventy (PR #21).

## Pendiente en fase 0
- Instalar OpenCode y conectarlo a Copilot Pro como plan B (sin usarlo)

## Preguntas abiertas
- Cuenta webmasteriesrioarba: sin uso. Proponer a la dirección borrarla (o protegerla si se quiere reservar el nombre)
- Avisar a quienes gestionan el VPS: el panel de Easypanel se usa por HTTP (IP:3000) y conviene ponerle dominio con HTTPS. Comprobar también si la URL del Deployment Trigger empieza por http://.
- Dominio definitivo
- Huecos del plan: sección HUECOS de specs/001-reto-octubre/plan.md
- Crear la cuenta del centro solo para enviar correo, con verificación en dos pasos y contraseña de aplicación (será una tarea MANUAL de tasks.md).
- Dependabot para actualizar las acciones fijadas por SHA: ¿se añade como tarea? (propuesta sin decidir)
- Caracteres invisibles: regla en AGENTS.md y comprobación automática, en la rama T013+T014 (nota 3).
- 002 añade dateNoWeekday y pendiente a src/lib/format.js: son funciones, así que por la regla del lenguaje del dominio van en inglés. Renombrar pendiente al empezar 002.
- Cambio de curso: al pasar curso.yml a 2027-2028, los retos de 2026-2027 pierden su tema (sale de curso.yml) y su calendario. Decidir antes de junio de 2027.
- Auto mode: regla ask para gh pr merge (el push lo necesita /tarea).
- Pedir a la comisión: descripción y lugar del Banco Chipi Chipi, texto completo de la infografía de octubre y URL real del Genially.
- Antes de T016 y T017: h1 de los retos sin tema (propuesta: «Reto de octubre de 2026», sin dos puntos); cambia paginas-web.md.
- T016: reunir todos los textos fijos (capa de datos y plantillas) en un módulo y alinear el apartado «Fijo» de data-model.md; usar los valores *Texto de la capa de datos y quitar los filtros de eleventy.config.js que no se usen.
- T048: revisar con la comisión los textos provisionales de cabecera y pie (H12) y si la cabecera lleva el nombre del proyecto.
- /tarea se saltó una PUERTA en T012 (textos visibles de cabecera y pie): revisar la redacción de esa puerta.
- Para la fase 7: M7 detectado por /allOf/1/then/; mensaje de format siempre de fecha; mayúsculas en nombres de archivo en macOS; enlaces simbólicos en materiales/; reto.curso sin comprobar años consecutivos ni curso futuro; error de tema que oculta el de orden de meses; error de fichero entero impreso «curso.yml · : …»; .gitkeep publicado en /materiales/.

## Próximo paso
Rama T013+T014 con /tarea (comprobaciones completas en local y en Actions). Después, T015 a T017 (portada y página del reto): primera demo en local para la comisión.
