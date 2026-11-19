# 0018 · Registros del servidor sin datos de quien visita (nginx y proxy)

- Fecha: 2026-11-19
- Estado: aceptada

## Contexto
FR-019 de `specs/002-paginas-legales/spec.md`: el servidor de la web pública no guarda
registros de visitas (ni IP, ni página, ni hora) y solo puede guardar errores sin IP;
incluye el proxy de Easypanel que está delante (caso límite «Proxy compartido del VPS»).
La imagen oficial de nginx registra cada visita (`access_log … main`). En nginx,
`access_log off` anula los registros de acceso del nivel
(<https://nginx.org/en/docs/http/ngx_http_log_module.html>); `error_log` no permite
cambiar el formato en la versión libre y sus mensajes de petición llevan `client: <IP>`
(<https://nginx.org/en/docs/ngx_core_module.html#error_log>). Easypanel usa Traefik 3.7
(<https://my.easypanel.io/changelog>); Traefik puede registrar accesos con todos los
campos y, desde 3.3, desactivarlos por router
(<https://doc.traefik.io/traefik/reference/install-configuration/observability/logs-and-accesslogs/>,
<https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/routing/observability/>).

## Decisión
- nginx usa una configuración principal propia, `nginx/nginx.conf`, que sustituye la de
  la imagen: `access_log off` en `http`; `error_log stderr notice` a nivel principal
  (mensajes del proceso, sin petición) y `error_log stderr emerg` en `http` (los errores
  de petición, que llevan IP, no se registran); `log_not_found off`.
- `comprobar:cabeceras` (T022 de la 001) arranca la imagen, hace peticiones (también 404)
  y falla si `docker logs` contiene una IP o una línea de acceso.
- Proxy de Easypanel: tarea MANUAL con quienes gestionan el VPS antes de desplegar la web
  nueva: mirar si Traefik registra accesos; si lo hace, por orden de preferencia,
  desactivarlos para el router de esta web, quitar los campos de cliente o desactivarlos
  en todo Traefik. Si no se puede, la página de privacidad dice qué se guarda, para qué y
  cuánto tiempo (FR-021) y Michel revisa esta decisión.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Sin acceso y errores solo `emerg`** (elegida) | Dos líneas de configuración y una prueba | Se pierden los detalles de los errores de petición; se depuran reproduciéndolos en local |
| Errores a nivel `error` o `crit` | Ninguno | Guardan la IP: incumple FR-019 |
| Errores a `syslog` y un filtro que borre la IP | Otro contenedor y su configuración | Una pieza más que mantener (principio VI) |
| Dejar la configuración de la imagen | Ninguno | Registra cada visita con IP |

## Consecuencias
- La página de privacidad puede decir «no se guarda nada que te identifique» solo si la
  tarea del proxy lo confirma; hasta entonces es un requisito previo de T023 de la 001.
- Diagnosticar fallos en producción será más difícil: se aceptan a cambio de no guardar
  datos de visitantes.
- Cambiar la imagen de nginx exige revisar que `nginx/nginx.conf` sigue siendo válido.
