# 0019 · Aviso de la revisión anual de la declaración de accesibilidad

- Fecha: 2026-11-19
- Estado: aceptada

## Contexto
FR-027 de `specs/002-paginas-legales/spec.md`: un mes antes de cumplirse un año desde la
última revisión de la declaración, debe abrirse sola una incidencia para quien mantiene
la web y su suplente, sin servicios de terceros nuevos; y en cada push, un aviso que no
bloquee. En repositorios públicos, GitHub desactiva los flujos programados tras 60 días
sin actividad
(<https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow>).
Si se declara un permiso del `GITHUB_TOKEN`, los demás quedan en `none`
(<https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax>).
`gh` viene instalado en los ejecutores de GitHub
(<https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-github-cli-in-workflows>).

## Decisión
- `scripts/check-review-date.js` lee `declaracion.fecha_ultima_revision` de
  `src/legal/datos.yml` y calcula si la revisión vence en 30 días o menos o ya venció
  (sin dependencias nuevas; la fecha de «hoy» se puede inyectar para las pruebas).
- En «comprobar» (en cada PR y en cada push a main), un paso con nombre «Aviso de revisión de la declaración»
  emite `::warning::` y escribe en el resumen; termina siempre con código 0 (FR-027:
  sin bloquear).
- Flujo nuevo `.github/workflows/revision-declaracion.yml`: `schedule` semanal y
  `workflow_dispatch`; `permissions: { contents: read, issues: write }` y nada más; sin
  acciones de terceros salvo `actions/checkout` y `actions/setup-node` en las versiones
  fijadas por la 001. Si toca avisar y no hay una incidencia abierta con la etiqueta
  `revision-declaracion`, la crea con `gh issue create`, asignada a las cuentas de la
  variable del repositorio `MANTENEDORES_WEB` (fuera de los ficheros del repositorio).
- Mitigación de los 60 días: el aviso de cada push es independiente del flujo
  programado; la guía del cambio incluye comprobar que el flujo está activo; en la
  revisión anual se reactiva si hace falta.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Flujo programado + aviso en cada push** (elegida) | Un flujo pequeño y un script | Se desactiva tras 60 días sin actividad; se mitiga como arriba |
| Commit automático periódico para mantener la actividad | Pocas líneas | Necesita `contents: write`; cada commit en `main` despliega y ensucia el historial |
| Recordatorio en un calendario o servicio externo | Ninguno técnico | Tercero nuevo y cuentas personales (FR-027, principio VIII) |
| Solo el aviso en cada push | El mínimo | Si nadie hace push, nadie se entera |

## Consecuencias
- Hay que crear a mano la etiqueta `revision-declaracion` y la variable
  `MANTENEDORES_WEB` (cuentas de quien mantiene la web y del suplente).
- Si el repositorio pasa más de 60 días sin actividad, la incidencia puede no abrirse;
  el aviso aparecerá en el siguiente push.
- El flujo programado se ejecuta sobre el último commit de `main`: lee la fecha
  publicada, no la de una rama.
