# 0008 · Formato del contenido y validación en la compilación

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
FR-014 exige que una edición con datos obligatorios vacíos o mal escritos no llegue a la
web, y el principio V, que una edición no rompa el diseño. Pages CMS valida campos
obligatorios y patrones (`required`, `pattern`,
<https://pagescms.org/docs/configuration/content/fields/>), pero no reglas entre campos
(«si es infografía, necesita versión en texto»), no comprueba que un fichero exista ni
que un reto marcado como «en curso» esté publicado. Además, cualquiera con permiso de
escritura puede hacer un commit sin pasar por el panel. Hace falta una segunda barrera
en «comprobar».

## Decisión
- **Formato**: YAML de datos puros (formato `yaml` de Pages CMS), sin Markdown ni HTML.
  - `content/curso.yml`: curso, calendario de 9 meses y reto en curso.
  - `content/sitio.yml`: enlace al Genially.
  - `content/retos/<curso>-<mes>.yml`: un fichero por reto del mes.
  - `content/materiales/<curso>-<mes>/`: ficheros descargables.
  Los textos largos son campos de texto plano; los párrafos se separan con líneas en
  blanco y la plantilla los convierte en `<p>`. Así nadie puede meter HTML que rompa el
  diseño o la accesibilidad.
- **Contrato**: un JSON Schema (draft 2020-12) por tipo de fichero, en `schemas/`, copia
  de `specs/001-reto-octubre/contracts/`.
- **Validador**: `ajv` 8.20.0 y `ajv-formats` 3.0.1 (formato `date` en modo completo,
  que rechaza fechas imposibles), más reglas entre campos en un script propio
  `scripts/validate-content.js`, que también comprueba que cada material existe, su
  extensión y su tamaño máximo.
  - Comprobado el 2026-11-11: `ajv` 8.20.0 es `latest` en npm
    (<https://registry.npmjs.org/ajv/latest>) y «Latest» en GitHub; notas 8.18 a 8.20
    leídas: sin cambios marcados como incompatibles (8.20 retira Node 16 y 21; 8.18
    corrige un ReDoS en `pattern`). `ajv-formats` 3.0.1 es `latest`
    (<https://registry.npmjs.org/ajv-formats/latest>).
  - Para leer YAML (Eleventy no lo hace solo), `yaml` **2.9.1**, sin dependencias
    propias, que es la que usa el ejemplo oficial de Eleventy
    (<https://www.11ty.dev/docs/data-custom/>). Comprobado el 2026-11-11: `latest` en
    npm (<https://registry.npmjs.org/yaml/latest>); notas 2.8 y 2.9 sin cambios
    incompatibles; la 3.0 está en prelanzamiento y no se usa
    (<https://github.com/eemeli/yaml/releases>).
  - Son dependencias de compilación (`dependencies`) con versión exacta.
- **Cuándo se ejecuta**: como primer paso de `npm run build` (en Actions y en la
  compilación del Dockerfile, ADR 0007). Si falla, la compilación se detiene con un
  mensaje en español que dice el fichero, el campo y qué corregir.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **JSON Schema + ajv + script** (elegida) | 3 dependencias pequeñas (`yaml`, sin subdependencias; `ajv`, con 4; `ajv-formats`); el esquema es un estándar legible y sirve de contrato | Hay que mantener a la par `.pages.yml` y el esquema; lo vigila una prueba |
| Script de validación sin dependencias | Cero dependencias | Reinventar la validación de tipos y fechas; más código propio, peor documentado |
| `eleventyDataSchema` de Eleventy con Zod (<https://www.11ty.dev/docs/data-validate/>) | Integrado en la compilación | Añade Zod; la validación queda repartida en plantillas y no se puede ejecutar sola antes de compilar |
| Markdown con front matter | Habitual en webs estáticas | El cuerpo en Markdown admite HTML y estructuras libres: más fácil romper el diseño |
| Confiar solo en Pages CMS | Nada que mantener | No cubre reglas entre campos ni commits fuera del panel; incumple FR-014 |

## Consecuencias
- Un reto mal formado hace fallar «comprobar» y no se despliega; la web sigue como estaba.
- El tamaño y el formato de cada material los calcula la compilación a partir del fichero
  real (FR-008): nadie los escribe a mano y no pueden quedar desfasados.
- Hay que avisar a quien publicó cuando falla (ADR 0012).
