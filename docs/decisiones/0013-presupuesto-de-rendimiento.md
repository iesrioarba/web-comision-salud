# 0013 · Presupuesto de rendimiento y su comprobación con Lighthouse CI

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
El principio VI obliga a que el plan fije un presupuesto de rendimiento y a que la web lo
cumpla. SC-006 pide que, en un móvil modesto con conexión lenta, el tema y los tres
retos se lean en menos de 3 segundos, y deja al plan fijar las condiciones de la prueba.

## Decisión
**Condiciones de la prueba** («móvil modesto con conexión lenta»): la emulación móvil por
defecto de Lighthouse, con limitación simulada: RTT de 150 ms, 1,6 Mbps de bajada,
750 kbps de subida y CPU 4 veces más lenta, que la documentación describe como «Slow 4G»
en un móvil de gama media
(<https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md>). Mediana de
3 ejecuciones por página.

**Presupuesto** (por página, carga inicial, sin contar los materiales descargables):

| Medida | Límite | Por qué |
|---|---|---|
| Largest Contentful Paint | ≤ 2 500 ms | SC-006 pide < 3 s; se deja margen |
| First Contentful Paint | ≤ 1 800 ms | El texto del reto debe verse pronto |
| Cumulative Layout Shift | ≤ 0,1 | Que el texto no salte al cargar |
| Total Blocking Time | ≤ 200 ms | Móviles lentos |
| Documento HTML | ≤ 30 KB transferidos | Contenido de texto |
| CSS | ≤ 20 KB transferidos | Una hoja propia |
| JavaScript | ≤ 10 KB transferidos (objetivo: 0) | El reto se lee sin JS |
| Fuentes web | 0 por defecto | Las del sistema; si el diseño quiere una, se autoaloja y se revisa este ADR |
| Imágenes en la carga inicial | ≤ 100 KB | Las de más abajo, con carga diferida |
| Total transferido | ≤ 150 KB | Suma con margen |
| Peticiones a terceros | 0 | SC-005 |
| Cada material descargable | ≤ 10 MB (lo comprueba el validador, ADR 0008) | No se descarga si no se pide; límite para el repositorio y el móvil |

**Herramienta**: `@lhci/cli` **0.16.0** (incluye Lighthouse 13.6.0), dependencia de
desarrollo con versión exacta. Usa `staticDistDir` para servir la carpeta generada sin
servidor aparte, y aserciones `maxNumericValue` y `resource-summary:<tipo>:(size|count)`
(<https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md>).
Bloquea «comprobar» si no se cumple.
- Comprobado el 2026-11-11: 0.16.0 es `latest` en npm
  (<https://registry.npmjs.org/@lhci/cli/latest>) y la última en
  <https://github.com/GoogleChrome/lighthouse-ci/releases> (2 de noviembre de 2026).
  Cambios incompatibles leídos: pasa a Lighthouse 13.6.0 y exige Node ≥ 22 (se usa 26).
- Solo se ejecuta en local y en Actions (`lhci collect` + `lhci assert`). NO se usa
  `lhci upload` a servidores de Google ni a ningún otro: los informes se guardan como
  artefacto de Actions.

**Comprobación a mano**, una vez por funcionalidad: la página del reto en un móvil
Android de gama baja real con la red limitada. HUECO: qué móvil (lo decide Michel).

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Lighthouse CI con aserciones** (elegida) | Una dependencia de desarrollo con bastantes subdependencias (Lighthouse, Express…) | Tiempos con algo de variación; se mitiga con limitación simulada y mediana de 3 |
| Script propio que suma bytes de `_site` | Sin dependencias | No mide tiempos: no demuestra SC-006 |
| Solo prueba a mano | Nada que instalar | No es repetible ni bloquea el despliegue (principio VII) |
| PageSpeed Insights (servicio de Google) | Sin instalar nada | Envía la URL a un tercero y exige la web ya publicada: no sirve para bloquear antes de desplegar |

## Consecuencias
- El diseño visual (skill `frontend-design`) debe caber en este presupuesto.
- Si el presupuesto resulta irreal, se cambia este ADR, no la comprobación.
