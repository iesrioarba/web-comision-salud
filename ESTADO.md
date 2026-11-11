# ESTADO · Web de la Comisión de Salud (IES Río Arba)
Actualizado: 2026-11-11

## Fase actual
5 · Tareas · 001-reto-octubre

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

## Pendiente en fase 0
- Instalar OpenCode y conectarlo a Copilot Pro como plan B (sin usarlo)

## Preguntas abiertas
- Cuenta webmasteriesrioarba: sin uso. Proponer a la dirección borrarla (o protegerla si se quiere reservar el nombre)
- Confirmar en hPanel en qué centro de datos de Hostinger está el VPS (debe estar en la UE o Reino Unido; lo necesita la información de privacidad).
- Avisar a quienes gestionan el VPS: el panel de Easypanel se usa por HTTP (IP:3000) y conviene ponerle dominio con HTTPS. Comprobar también si la URL del Deployment Trigger empieza por http://.
- Dominio definitivo
- Huecos del plan: sección HUECOS de specs/001-reto-octubre/plan.md
- Crear la cuenta del centro para enviar correo y preguntar si el Workspace permite contraseñas de aplicación
- Preguntar a la comisión si quiere publicar fotos de los retos (sería una funcionalidad nueva, con autorizaciones y sin nombres)

## Próximo paso
/speckit-tasks con el subagente planificador y después /speckit-analyze.
