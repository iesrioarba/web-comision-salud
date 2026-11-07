# 0004 · GitHub Spec Kit para el desarrollo guiado por especificaciones

- Fecha: 2026-11-07
- Estado: aceptada

## Contexto
El proyecto sigue un método por fases con puerta (principios, especificación,
aclaraciones, plan, tareas, implementación, revisión). Había que decidir si llevar
esas fases a mano, con skills propias, o con una herramienta estándar.

## Decisión
- Se usa GitHub Spec Kit 1.3.2 (`specify-cli`, instalado con uv y versión fijada),
  integrado con Claude Code (`specify init . --integration claude`, scripts `sh`).
- Correspondencia de fases: constitución (`/speckit-constitution`), especificación
  (`/speckit-specify`), aclaraciones (`/speckit-clarify`), plan (`/speckit-plan`),
  tareas (`/speckit-tasks`) y comprobación de coherencia (`/speckit-analyze`).
- La implementación NO usa `/speckit-implement`: cada tarea la hace el subagente
  `implementador`, una cada vez, y la revisa el subagente `revisor`.
  Tras implementar, `/speckit-converge` comprueba lo que falta.
- El subagente `planificador` precarga las skills `speckit-plan` y `speckit-tasks`.
- Se trabaja por funcionalidades (`specs/NNN-nombre/`); la primera, el reto de octubre.
- Las plantillas se mantienen en inglés (actualizaciones más sencillas); el contenido
  de los documentos se escribe en español.
- Se mantienen AGENTS.md (única fuente de instrucciones), los ADR y ESTADO.md.
- Alternativa descartada: skills propias escritas a mano. Se entenderían línea a línea,
  pero reinventan plantillas y comprobaciones ya probadas y no enseñan la herramienta
  estándar del sector.

## Consecuencias
- Unos 30 ficheros de Spec Kit en `.specify/` y `.claude/skills/speckit-*`, que no se
  editan a mano (salvo la constitución). Antes de usar cada orden se lee su skill.
- Cada orden carga muchas instrucciones: no compensa para cambios de pocas líneas,
  que se hacen directamente.
- `specs/principios.md` pasa a ser `.specify/memory/constitution.md`.
- Actualizar Spec Kit es una decisión consciente: nueva versión, notas, ADR.
