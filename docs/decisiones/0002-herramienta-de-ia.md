# 0002 · Herramienta de IA y modelos

- Fecha: 2026-11-06
- Estado: aceptada

## Contexto
Opus 5.5 no está incluido en GitHub Copilot Pro (solo Pro+ y superiores). El plan Max
de Claude del desarrollador no puede usarse en herramientas de terceros como OpenCode,
pero sí incluye Claude Code y claude.ai, con límites compartidos entre ambos.

## Decisión
- Claude Code (plan Max) es la herramienta del proyecto.
- Opus 5.5: especificación, plan y revisión independiente (sesión principal y subagente revisor).
- Sonnet 5.5 o Haiku 5.5: implementación de tareas bien especificadas (subagente implementador).
- AGENTS.md es la única fuente de instrucciones; no se crea CLAUDE.md.
- Plan B si se agota el límite del plan: OpenCode + GitHub Copilot Pro con Haiku 5.5,
  sobre el mismo AGENTS.md y las mismas tareas. Presupuesto adicional de Copilot: 0 $.

## Consecuencias
- Coste adicional: 0 €. El límite lo comparte todo el uso de Claude del desarrollador.
- El proyecto no depende de la herramienta: instrucciones, especificaciones y tareas son
  Markdown estándar en el repositorio.
- Quien continúe sin plan de Claude puede seguir con OpenCode y Copilot.