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
  <https://nodejs.org/en/about/previous-releases>, última 26.13.1).
- nginx estable: 1.30.6 (<https://nginx.org/en/download.html>); imagen
  `nginx:1.30.6-alpine3.24` (<https://hub.docker.com/_/nginx>).
- Imagen de Node: `node:26.13.1-alpine3.24` (<https://hub.docker.com/_/node>).

## Decisión
- **Node 26.13.1** en local, en Actions y en la imagen de compilación. Se fija en
  `package.json` (`engines`) y en un fichero `.nvmrc`.
- **Dockerfile en dos etapas**: la primera (`node:26.13.1-alpine3.24`) ejecuta
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

## Actualización 2026-11-20 (T002 de la 001): acciones de GitHub del flujo
Decisión aceptada. Versiones comprobadas el 2026-11-20 en la página de
versiones de cada acción (última versión estable, sin marcar como prerelease) y notas
leídas buscando cambios incompatibles. Las tres son acciones oficiales de GitHub.
`despliegue.yml` lee la versión de Node de `.nvmrc` (`node-version-file`), de modo que
hay una sola fuente de verdad (26.13.1).

**Regla**: todas las acciones de GitHub del proyecto se fijan por el SHA completo (40
caracteres) del commit, con un comentario con la versión (`# vX.Y.Z`), por ejemplo
`uses: actions/checkout@<sha> # v7.0.1`. El `actions/checkout` lleva
`persist-credentials: false`. Motivo: las etiquetas de una acción no son inmutables en
GitHub (se pueden mover o reescribir, y así ocurre con las de `checkout` y
`upload-artifact`), mientras que un SHA sí lo es; y los trabajos solo leen el código y
no necesitan git autenticado, así que no se deja el token guardado (mínimo privilegio).
SHA comprobados el 2026-11-20 con `gh api repos/actions/<acción>/git/ref/tags/<tag>`
(en los tres casos `object.type` es `commit`):
- `actions/checkout` v7.0.1: `3d3c42e5aac5ba805825da76410c181273ba90b1`.
- `actions/setup-node` v7.1.0: `949feb2413d6458794dcd2491c4babbbce0c15c1`.
- `actions/upload-artifact` v7.0.2: `cf430e030ddbb5b0abf93d22962f4752f3646cd9` (para T014).

Detalle por acción:
- `actions/checkout` **v7.0.1** (<https://github.com/actions/checkout/releases/tag/v7.0.1>,
  publicada el 2026-07-20). Antes: `@v5` (el paso a node24 llegó en v5.0.0, «Update
  actions checkout to use node 24»; el flujo ya lo usaba). Cambios incompatibles de v6 y
  v7: exige runner ≥ 2.327.1 (el de GitHub ya lo cumple); con `persist-credentials`
  las credenciales se guardan en un fichero aparte bajo `$RUNNER_TEMP` y no en
  `.git/config`; v7 se niega a bajar el código de un fork con `pull_request_target` o
  `workflow_run` salvo con `allow-unsafe-pr-checkout: true`. El flujo solo usa
  `push` y `pull_request` y no ejecuta git autenticado en contenedores Docker: no le
  afecta. (<https://github.com/actions/checkout/releases>)
- `actions/setup-node` **v7.1.0** (<https://github.com/actions/setup-node/releases/tag/v7.1.0>,
  publicada el 2026-10-08). Antes: `@v4`. Cambios de v5 a v7: v5 pasa a node24 (runner
  ≥ 2.327.1) y activa la caché automática si `package.json` tiene `packageManager` (el
  flujo ya indica `cache: npm`); v6 limita la caché automática a npm; v7 migra a ESM sin
  cambiar entradas ni salidas y deja de exportar un `NODE_AUTH_TOKEN` vacío (el flujo no
  publica en npm). v7.1.0 añade rutas absolutas en `node-version-file` y valida la versión
  de Node con reintento. Se usa `node-version-file: .nvmrc` (el fichero solo contiene
  `26.13.1`). (<https://github.com/actions/setup-node/releases>)
- `actions/upload-artifact` **v7.0.2** (<https://github.com/actions/upload-artifact/releases/tag/v7.0.2>,
  publicada el 2026-10-07). Decisión N11: se anota ahora y se usará en T014 para los
  informes de Lighthouse; aún no está en el flujo. Cambios incompatibles de v4 a v7: v6
  usa node24 (runner ≥ 2.327.1); v7 migra a ESM y añade la subida directa de un fichero
  sin comprimir (`archive: false`, opcional). Las etiquetas `v3.2.2` y `v3.2.2-node20` son
  retroportes para GHES, marcados como obsoletos en github.com: no se usan.
  (<https://github.com/actions/upload-artifact/releases>)

Las notas completas de `checkout` v6.1.0, v5.1.0 y posteriores solo retroportan
`allow-unsafe-pr-checkout`; no cambian nada para este flujo. Actualizar una acción es una
decisión consciente: cambiar el SHA y su comentario de versión, leer notas y anotarlo aquí.
