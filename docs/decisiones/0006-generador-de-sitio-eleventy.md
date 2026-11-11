# 0006 · Generador de sitio estático: Eleventy 3.1.8

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
La web es estática (ADR 0005) y su contenido son ficheros YAML del repositorio que edita
Pages CMS. Hace falta una herramienta que convierta esos ficheros en HTML con una
plantilla fija, sin JavaScript obligatorio en el navegador (principio VI), sin rastreo
(principio II) y fácil de mantener por alguien que llegue después (principio VIII).
El repositorio ya usa Node y npm (ADR 0003).

## Decisión
- **Eleventy (`@11ty/eleventy`) 3.1.8**, como dependencia de compilación, con versión
  exacta en `package.json` (sin `^`) y en `package-lock.json`.
  - Comprobado el 2026-11-11: etiqueta `latest` de npm
    (<https://registry.npmjs.org/@11ty/eleventy>) y versión marcada «Latest» en
    <https://github.com/11ty/eleventy/releases> (3 de noviembre).
  - Notas leídas de 3.1.5 a 3.1.8: solo mantenimiento y dependencias; 3.1.6 corrige un
    fallo con Node 26; 3.1.7 cambia `nunjucks` y `gray-matter` a bifurcaciones de 11ty
    y 3.1.8 lo revierte para Nunjucks. Ningún cambio marcado como incompatible.
  - La rama 4.0 («Build Awesome») está en alfa: no se usa.
  - Requiere Node ≥ 18 (<https://registry.npmjs.org/@11ty/eleventy/3.1.8>).
- Plantillas **Nunjucks**, que escapan la salida por defecto (`autoescape: true`,
  <https://mozilla.github.io/nunjucks/api.html#configure>; Eleventy usa los valores por
  defecto de Nunjucks, <https://www.11ty.dev/docs/languages/nunjucks/>). Nunca se
  desactiva el escape ni se usa el filtro `safe` con texto de la comisión.
- Sin JavaScript en el navegador para mostrar el reto. Si el diseño necesita alguno,
  debe ser mejora progresiva y caber en el presupuesto (ADR 0013).

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Eleventy 3.1.8** (elegida) | 33 dependencias directas; plantillas simples; mismo Node que ya hay | Nunjucks es antiguo (lo mantiene 11ty con bifurcaciones); la 4.0 llegará y habrá que migrar con ADR |
| **Astro 7.4.10** (<https://registry.npmjs.org/astro/latest>) | Validación de contenido integrada (Zod) | 52 dependencias directas (Vite, Rolldown…), versiones mayores frecuentes, requiere Node ≥ 22.23.4 y tiene telemetría activada por defecto (<https://astro.build/telemetry/>): más que mantener y una exclusión que no se puede olvidar |
| **Hugo 0.169.0** (<https://github.com/gohugoio/hugo/releases/latest>) | Un solo binario, muy rápido | Sin validación de datos; plantillas de Go menos legibles; la 0.169.0 trae cambios de comportamiento en plantillas y `.Params`; otra cadena de herramientas además de Node |
| **HTML escrito a mano** (como el esqueleto) | Cero dependencias | Pages CMS escribe datos, no HTML: sin generador no hay forma de pasar de datos a páginas sin programar algo propio |

## Consecuencias
- Una dependencia de compilación más, fijada, que se actualiza con ADR.
- El diseño visual (plantillas y CSS) se decide aparte con la skill `frontend-design`;
  este ADR solo fija la herramienta.
- La validación del contenido no la da Eleventy: se hace con el ADR 0008.
- Cuando 4.0 sea estable, migrar será una decisión consciente con su propio ADR.
