# 0012 · Aviso a quien publica cuando «comprobar» falla

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
Quien publica es profesorado sin cuenta de GitHub. Si un commit de contenido no pasa
«comprobar», la web sigue como estaba (FR-014), pero la persona no lo ve: el panel
confirma el guardado y la web no cambia. Pages CMS puede lanzar flujos de Actions con
botones (`workflow_dispatch`), pero su documentación no dice que muestre el resultado de
los flujos lanzados por un `push` (<https://pagescms.org/docs/configuration/actions/>).
Las notificaciones de GitHub solo llegan a cuentas de GitHub.

## Decisión
- Si «comprobar» falla en un `push` a `main` **y el commit es de contenido hecho por la
  GitHub App del panel**, un paso final del flujo envía un **correo al buzón de la
  comisión** con: qué ha fallado (el mensaje en español del validador),
  qué fichero y qué hacer («corrige el campo en el panel y vuelve a guardar; la web
  sigue como estaba»). No incluye datos personales.
- Si falla un cambio de código (cualquier commit que no sea de contenido hecho por la
  app), no se avisa a la comisión: se avisa a quien mantiene la web mediante las
  notificaciones estándar de GitHub Actions a quien lanzó el flujo. Quien mantenga la
  web DEBE tener activadas en GitHub las notificaciones de flujos fallidos.
- El correo se envía con `curl` (ya instalado en los ejecutores de GitHub, sin
  dependencias nuevas) por el **SMTP del centro** (ADR 0009). Las credenciales van en
  secretos de GitHub del entorno `produccion`.
- El enlace al registro del fallo en Actions va también en el correo, para quien
  mantenga la web.
- La guía de mantenimiento dice cuánto tarda en verse un cambio (unos minutos) y qué
  hacer si no aparece.
- Las validaciones del panel (`required`, `pattern`) evitan la mayoría de errores antes
  de guardar; este aviso cubre los que solo detecta la compilación.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Correo por SMTP del centro desde Actions** (elegida) | Unas líneas en el flujo; sin dependencias | Depende del HUECO del SMTP; si el correo falla, nadie se entera (se mitiga con la segunda opción) |
| Solo notificaciones de GitHub a quien mantiene la web | Cero trabajo | La comisión no se entera; depende de una persona concreta (principio VIII) |
| Acción de terceros del Marketplace para enviar correo | Configuración cómoda | Código de terceros con acceso a secretos; habría que fijarla por hash y justificarla |
| Un servicio de correo externo (API) | Fiable | Tercero nuevo con datos del buzón; necesita ADR y contrato |
| Página de estado en la propia web | Visible para todos | Si la compilación falla, la web no se actualiza: no puede mostrar su propio fallo |

## Consecuencias
- HUECO: dirección del buzón de la comisión (debe ser un buzón del centro, no personal).
- Quien mantiene la web debería, además, vigilar los fallos de Actions en GitHub.
- Si un día Pages CMS muestra el estado de los flujos, se revisa este ADR.
