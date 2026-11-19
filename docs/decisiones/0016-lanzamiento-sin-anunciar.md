# 0016 · Lanzamiento sin anunciar hasta el estreno

- Fecha: 2026-11-19
- Estado: propuesta (borrador del planificador; la decisión es de Michel, pendiente de su visto bueno sobre este texto)

## Contexto
Cada integración en `main` que pasa «comprobar» se despliega en el VPS (ADR 0001). En
cuanto se integre el Dockerfile nuevo (tarea T023 de `specs/001-reto-octubre/tasks.md`),
la web de la funcionalidad 001 queda publicada en el dominio del VPS, meses antes del
estreno previsto para enero de 2027. Hasta entonces la web lleva contenido incompleto o
inventado: la URL del Genially es de ejemplo (`example.org`, HUECO H6 del plan), faltan
los materiales reales de octubre (H8) y algunos datos del reto motriz (H7).

El principio I exige una declaración de accesibilidad publicada; por eso la funcionalidad
002 (declaración de accesibilidad, aviso legal e información de privacidad) se integra
en `main` antes que T023 (hallazgo C2 de `/speckit-analyze`). Lo que falta resolver es
cómo evitar que la web se difunda o se indexe antes de estar completa.

## Decisión
- Hasta el estreno, todas las páginas llevan `<meta name="robots" content="noindex">`
  (T012) y nginx envía la cabecera `X-Robots-Tag: noindex` en todas las respuestas,
  también en los materiales (T023). `npm run comprobar` lo comprueba (`comprobar:cabeceras`
  y la compilación).
- La dirección de la web no se anuncia ni se enlaza desde ningún sitio del centro hasta
  el estreno.
- El estreno es la tarea T050: con la lista previa a producción completa y la 002
  publicada y al día, se quitan el `noindex` y la cabecera, y se comprueba que ya no
  están en el HTML ni en las respuestas.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Publicar sin anunciar, con `noindex` y `X-Robots-Tag`** (elegida) | Una línea en la plantilla y otra en nginx; el despliegue de cada tarea se prueba en el VPS real | Quien tenga la URL puede ver la web (ver «Consecuencias») |
| Desactivar «desplegar» hasta el estreno | Cambiar el flujo y volver a activarlo | No se prueba el despliegue real durante la fase 6; la prueba de H16 (T024) y el panel (US3) necesitan la web desplegada |
| Proteger la web con contraseña (autenticación básica en nginx) | Un secreto más que gestionar y repartir | Contraseña compartida (choca con «sin cuentas compartidas»); estorba las pruebas con personas (T049) |
| Desplegar a un servicio de ensayo y dejar producción con el hola mundo | Un segundo servicio en Easypanel | Cambia el ADR 0001; dos destinos que mantener coherentes |

## Consecuencias
- Riesgo residual que se acepta: `noindex` y `X-Robots-Tag` solo piden a los buscadores
  que no indexen; NO impiden el acceso a quien conozca la URL ni a buscadores que no los
  respeten. Hasta el estreno, cualquiera con la dirección verá contenido incompleto o
  inventado (la URL de ejemplo del Genially, materiales «Disponible próximamente»,
  datos «Por confirmar»). Se acepta porque es contenido público por naturaleza, sin
  datos personales ni de salud (principio II), y el contenido inventado es evidente
  (`example.org`).
- La declaración de accesibilidad (002) ya está publicada durante ese periodo. Puede
  decir «parcialmente conforme, en revisión», con fecha, y se actualiza en el estreno con
  el resultado de las comprobaciones a mano (T047).
- Si se olvida quitar el `noindex`, la web no aparecerá en buscadores: T050 lo comprueba
  de forma explícita y `comprobar:cabeceras` cambia para exigir que ya no se envía.
- Este ADR deja de aplicarse en el estreno; se marca entonces como sustituido o cumplido.
