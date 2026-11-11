# Contrato: configuración del panel (`.pages.yml`)

**Versión de Pages CMS**: 2.1.8 (ADR 0005). Documentación de referencia:
<https://pagescms.org/docs/configuration/>.

Este contrato fija **qué** ve y puede hacer la comisión en el panel. La sintaxis exacta
de `.pages.yml` la escribe el implementador contra la documentación de la versión fijada;
lo que no se ha podido comprobar en la documentación está marcado como «comprobar».

## Reglas

1. Todo el texto del panel (etiquetas, descripciones, mensajes de `pattern`) en español,
   claro y sin jerga.
2. Cada campo de [data-model.md](../data-model.md) aparece con la misma clave, el mismo
   carácter obligatorio y, si tiene patrón, el mismo patrón que el esquema JSON. Una
   prueba de coherencia compara `.pages.yml` con `schemas/*.schema.json` (claves,
   obligatorios y valores de los `select`).
3. Los campos *derivados* y *fijos* del modelo NO aparecen en el panel.
4. No hay campos de texto enriquecido (`rich-text`) ni de código: solo `string`, `text`,
   `date`, `select`, `boolean`, `file`, `object`, `reference` y listas. Así no se puede
   meter HTML (principio V).
5. Commits: `settings.commit.identity: app`. Las plantillas de mensaje siguen los commits
   convencionales en español y **no** usan `{userName}` ni `{userEmail}` (ADR 0010):
   - crear: `docs(contenido): crea {path}`
   - actualizar: `docs(contenido): actualiza {path}`
   - borrar: `docs(contenido): borra {path}`
   - renombrar: `docs(contenido): renombra {oldPath} a {newPath}`
6. Medios: una sola fuente `materiales` con `input: content/materiales`,
   `output: /materiales`, `extensions: [pdf, png, jpg, jpeg]`, `rename: safe`
   (<https://pagescms.org/docs/configuration/media/>).

## Entradas de contenido

| Entrada | Tipo Pages CMS | Ruta | Formato | Operaciones |
|---|---|---|---|---|
| «Curso y calendario» | `file` | `content/curso.yml` | `yaml` | Editar |
| «Retos del mes» | `collection` | `content/retos` | `yaml` | Crear, editar (sin borrar: se despublica con `estado`) — comprobar la clave de operaciones en <https://pagescms.org/docs/configuration/content/operations/> |
| «Enlace al Genially» | `file` | `content/sitio.yml` | `yaml` | Editar |

### «Retos del mes»

- Nombre de fichero: plantilla `{fields.curso}-{fields.mes}.yml` con el campo de nombre
  oculto (`field: false`, <https://pagescms.org/docs/configuration/content/filename/>).
- Vista de lista: muestra `mes`, `curso`, `nombre` y `estado`.
- Campos, en este orden y agrupados como en la web:
  1. `estado` (select, obligatorio, por defecto `borrador`). Etiquetas: «Borrador: no se
     ve en la web» / «Publicado». Descripción: «Marca Publicado solo cuando la comisión
     haya revisado todo el contenido, también lo hecho con IA. Ojo: los borradores se
     ven en el repositorio público de GitHub.»
  2. `curso` (string, obligatorio, patrón `^[0-9]{4}-[0-9]{4}$`, por defecto `2026-2027`,
     mensaje «Escribe el curso así: 2026-2027»).
  3. `mes` (select con los 9 meses).
  4. `nombre`, `objetivo`, `descripcion` (obligatorios; `text` para los largos, con
     `maxlength` del modelo y descripción «Separa los párrafos con una línea en blanco»).
  5. `pasos` (lista de `string`, máx. 10).
  6. `fuentes` (lista de `object` con `titulo` y `url`; descripción: «Obligatorio al
     menos una fuente oficial o científica para publicar»; `url` con patrón `^https://`
     y mensaje «La dirección debe empezar por https://»).
  7. `motriz` (`object`): `nombre`, `descripcion`, `fecha` (date, formato `yyyy-MM-dd`,
     `default: ""`), `hora` (string, patrón `^([01][0-9]|2[0-3]):[0-5][0-9]$`, mensaje
     «Escribe la hora así: 11:30»), `lugar`, `desde`, `hasta`, `materiales`.
     Descripción del objeto: «Si aún no sabes un dato, déjalo vacío: la web mostrará
     “Por confirmar”.»
  8. `tutoria` (`object`): `nombre`, `descripcion`, `adaptado_por_etapas` (boolean),
     `desde`, `hasta`, `materiales`.
  9. `familia` (`object`): `nombre`, `descripcion`, `desde`, `hasta`, `materiales`.
- `materiales` (lista de `object`, máx. 10): `titulo`, `tipo` (select), `destinatario`
  (select), `archivo` (file, fuente `materiales`, carpeta `content/materiales/{curso}-{mes}`
  si la versión lo permite — comprobar), `version_texto` (text; descripción
  «Obligatorio si es una infografía: copia aquí todo su texto, en el mismo orden»).

### «Curso y calendario»

- `curso` (string, patrón como arriba).
- `meses`: lista de 9 `object` con `mes` (`readonly`) y `tema` (string, descripción
  «Déjalo vacío si aún no se ha anunciado»). Comprobar si la lista se puede fijar a 9
  elementos sin añadir ni quitar.
- `en_curso` (`reference` a la colección de retos, `value: "{path}"`,
  `label: "{mes} {curso}: {nombre}"`; descripción «Déjalo vacío si ahora no hay reto en
  curso»).
- `proximo_mes` (select con los 9 meses; descripción «Solo si no hay reto en curso»).

### «Enlace al Genially»

- `genially.nombre` (string, obligatorio) y `genially.url` (string, obligatorio,
  patrón `^https://`).

## Lo que no se hace en el panel

- Editar `.pages.yml`, plantillas, estilos o código.
- Gestionar personas colaboradoras (solo quien administra el panel).
- Acciones (`actions`) de Pages CMS: no se usan en esta funcionalidad.

## Comprobación

- Automática: prueba de coherencia `.pages.yml` ↔ esquemas (ADR 0014).
- Manual: escenarios 6 a 9 de [quickstart.md](../quickstart.md).
