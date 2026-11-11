# 0007 · Compilación y servidor: Node 26 LTS, Dockerfile en dos etapas y nginx 1.30

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
Hoy el `Dockerfile` copia `site/` en `nginx:stable-alpine` y el flujo de Actions usa
Node 22. Con un generador (ADR 0006) hay que decidir dónde se compila la web, con qué
versión de Node y cómo se sirve. Easypanel construye la imagen desde el repositorio
cuando Actions llama al Deployment Trigger (ADR 0001).

Comprobado el 2026-11-11:
- Node 26 «Lithium» es Active LTS desde el 2026-10-28 y tiene soporte hasta el
  2029-04-30; Node 22 termina el 2027-04-30, en mitad del curso
  (<https://github.com/nodejs/release#release-schedule>,
  <https://nodejs.org/en/about/previous-releases>, última 26.13.0).
- nginx estable: 1.30.6 (<https://nginx.org/en/download.html>); imagen
  `nginx:1.30.6-alpine3.24` (<https://hub.docker.com/_/nginx>).
- Imagen de Node: `node:26.13.0-alpine3.24` (<https://hub.docker.com/_/node>).

## Decisión
- **Node 26.13.0** en local, en Actions y en la imagen de compilación. Se fija en
  `package.json` (`engines`) y en un fichero `.nvmrc`.
- **Dockerfile en dos etapas**: la primera (`node:26.13.0-alpine3.24`) ejecuta
  `npm ci --omit=dev`, la validación del contenido (ADR 0008) y la compilación; la
  segunda (`nginx:1.30.6-alpine3.24`) solo copia la carpeta generada y la configuración
  de nginx. Las herramientas de prueba son dependencias de desarrollo y no entran.
- **Configuración propia de nginx** en el repositorio: compresión, caché larga para los
  materiales, páginas de error en español y cabeceras de seguridad. La cabecera
  `Content-Security-Policy` solo permite recursos del propio sitio (`default-src 'self'`),
  lo que impide, también por error de contenido, cargar nada de terceros (FR-022,
  SC-005). Sin cookies.
- Las etiquetas de imagen se fijan con versión completa (no `stable`).

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Compilar dentro del Dockerfile en Easypanel** (elegida) | Cambio pequeño respecto al ADR 0001; mismo mecanismo de despliegue | Easypanel compila el `HEAD` de `main` en el momento del aviso, que podría ser más nuevo que el commit comprobado; se mitiga repitiendo la validación en la compilación |
| Compilar en Actions y publicar una imagen en GitHub Container Registry | Easypanel desplegaría exactamente lo comprobado; la imagen se publica con el `GITHUB_TOKEN` del flujo y como paquete público, sin credenciales personales | Cambia el despliegue del ADR 0001 y añade un registro de imágenes que mantener. No se elige ahora: es la salida prevista (ver «Consecuencias») |
| Compilar en Actions y subir el HTML a una rama de publicación | Sin registro | Ficheros generados en el repositorio y doble historial; confuso para quien llegue |
| Node 24 LTS (en mantenimiento hasta el 2028-04-30) | Más rodado | No es la última LTS; AGENTS.md pide la última estable |

## Consecuencias
- La validación del contenido se ejecuta dos veces (Actions y compilación en el VPS):
  defensa en profundidad si el `HEAD` cambia entre la comprobación y el despliegue.
- HUECO: no está comprobado que Easypanel mantenga el contenedor anterior cuando falla
  la compilación de la imagen. Hay que probarlo en el VPS (tarea de la fase 6, HUECO H16
  del plan) antes de confiar en ello. Si la prueba demuestra que no la conserva, se pasa
  a compilar en Actions y publicar la imagen en GitHub Container Registry, con un ADR
  nuevo.
- El VPS necesita acceso a npm durante la compilación.
- `.github/workflows/despliegue.yml` pasa a Node 26 y a las comprobaciones del ADR 0014.
- Actualizar Node o nginx es una decisión consciente: cambiar la etiqueta, leer notas, ADR.
