# 0011 · Borradores: campo «estado» en un repositorio público

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
Con Pages CMS, cada guardado es un commit en `main` (ADR 0005) y cada commit en `main`
se despliega si pasa «comprobar». Sin más, un reto a medio escribir o sin revisar
(principio IV, FR-027) aparecería en la web. El repositorio es público (ADR 0001).

## Decisión
- Cada reto tiene un campo obligatorio **`estado`** con dos valores: `borrador`
  («Borrador: no se ve en la web») y `publicado`. Por defecto, `borrador`.
- La compilación solo genera páginas, entradas de calendario y enlaces para los retos
  `publicado`. Un borrador no aparece en la web ni en el mapa del sitio.
- La validación (ADR 0008) es más estricta con lo publicado: un reto `publicado` debe
  tener todos sus obligatorios y al menos una fuente (principio IV); un borrador puede
  estar incompleto.
- Si `curso.yml` marca como «en curso» un reto en `borrador`, «comprobar» falla.
- La descripción del campo en el panel recuerda que solo se marca `publicado` cuando la
  comisión ha revisado el contenido, también lo generado con IA (FR-027).
- La guía de mantenimiento avisa: **los borradores se ven en el repositorio público de
  GitHub**; no se escribe en ellos nada que no pueda ser público.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Campo `estado`** (elegida) | Un campo y una condición en la compilación | Los borradores son visibles en GitHub, aunque no en la web |
| Repositorio privado | Borradores invisibles | Cambia el ADR 0001 (repositorio público); Easypanel necesitaría un token de GitHub (que suele ser personal, contra el principio VIII) o una clave de despliegue SSH del repositorio (<https://easypanel.io/docs/code-sources/git-ssh>); se pierde la transparencia de un centro público |
| Rama de borradores | Borradores fuera de `main` | Publicar exigiría fusionar ramas: no lo puede hacer quien no tiene cuenta de GitHub |
| Repositorio privado solo para contenido | Separa código y contenido | Dos repositorios, credenciales entre ellos y más piezas que mantener |

## Consecuencias
- Publicar es cambiar un solo campo; despublicar, también.
- Contenido de salud sin revisar puede quedar a la vista en GitHub (no en la web). Si la
  comisión no lo acepta, se reabre este ADR con la opción de repositorio privado y clave
  de despliegue SSH. Michel lo ha confirmado.
- Este ADR se reabre si algún día se publican fotos o datos de personas.
