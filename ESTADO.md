# ESTADO · Web de la Comisión de Salud (IES Río Arba)
Actualizado: 2026-11-06

## Fase actual
1 · Principios (constitución)

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

## Hecho
- Inventario de la petición de la comisión.
- Organización iesrioarba creada; equipo comision-salud con Write en el repositorio.
- Segundo propietario de la organización iesrioarba (urgente si aún no está)
- Esqueleto andante: hola mundo validado en Actions y desplegado automáticamente en Easypanel por Trigger.
- 2026-11-06 · Claude Code 2.1.319 instalado y verificado (plan Max, Opus 5.5).
- 2026-11-06 · AGENTS.md con las reglas de la casa y permisos del proyecto en .claude/settings.json (modo manual, .env protegido, MCP bloqueados).
- 2026-11-06 · Validación con versión fijada: package.json + package-lock.json, npm run validar en local y en Actions. Primera tarea hecha con Claude Code (Sonnet 5.5) y revisada.
- 2026-11-06 · Subagentes planificador (Opus), implementador (Sonnet) y revisor (Opus, solo lectura) en .claude/agents/; sección «Papeles» en AGENTS.md.
- 2026-11-06 · Primera revisión independiente hecha; hallazgos corregidos: reglas deny ampliadas, ADR 0003, aclaraciones en el ADR 0002 y correo noreply en los commits.
- 2026-11-07 · Spec Kit instalado en la rama chore/spec-kit y revisado; AGENTS.md y subagentes adaptados.
- 2026-11-08 · Fase 0 cerrada con el visto bueno de Michel.

## Pendiente en fase 0
- Instalar OpenCode y conectarlo a Copilot Pro como plan B (sin usarlo)

## Preguntas abiertas
- Cuenta webmasteriesrioarba: sin uso. Proponer a la dirección borrarla (o protegerla si se quiere reservar el nombre)
- De quién es la VPS y dónde está
- Dominio definitivo
- Panel de Easypanel accesible por HTTP (IP:3000): ponerle dominio con HTTPS
- Quién edita los contenidos y cómo (opciones en la fase 4)

## Próximo paso
Cerrar la fase 0 y empezar la fase 1: constitución con /speckit-constitution.