# Data Model: El reto del mes (001-reto-octubre)

**Fecha**: 2026-11-11 · **Plan**: [plan.md](plan.md) · **Contratos**: [contracts/](contracts/)

El contenido son ficheros YAML del repositorio (ADR 0008) que edita Pages CMS (ADR 0005).
Ninguna entidad contiene datos personales. Los ejemplos usan los datos reales de octubre
que da la especificación o datos inventados y evidentes.

## Convenciones

- **Por confirmar** (FR-004): un campo opcional vacío se muestra como «Por confirmar».
  Excepción: las fechas de las semanas (`desde`/`hasta`), que si faltan no se muestran.
- **Por anunciar**: un tema de mes vacío en el calendario.
- **Derivado**: lo calcula la compilación; nadie lo escribe.
- **Fijo**: lo pone la plantilla según el tipo de reto (FR-005: misma estructura todos
  los meses); no se edita.
- Límites de longitud: para que una edición no rompa el diseño (principio V). Son
  propuestas y se ajustarán con el diseño visual.
- Fechas: `AAAA-MM-DD` (formato `date` completo: rechaza fechas imposibles como
  2026-02-30). Hora: `HH:MM` de 00:00 a 23:59. Se muestran en español
  («viernes, 9 de octubre de 2026», «11:30»).
- Valores de mes, en orden: `octubre`, `noviembre`, `diciembre`, `enero`, `febrero`,
  `marzo`, `abril`, `mayo`, `junio`.

## Curso · `content/curso.yml` (un único fichero)

Esquema: [contracts/curso.schema.json](contracts/curso.schema.json)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `curso` | texto | sí | `^\d{4}-\d{4}$`; el segundo año es el primero + 1 (script) |
| `meses` | lista de **Mes del curso** | sí | Exactamente 9, en el orden de octubre a junio, sin repetir (script) |
| `en_curso` | referencia a un **Reto del mes** (ruta del fichero) | no | Vacío = no hay reto en curso (FR-029). Si tiene valor: el fichero existe, es del mismo `curso` y su `estado` es `publicado` (script) |
| `proximo_mes` | mes | no | Solo se usa si `en_curso` está vacío. Si también está vacío, el aviso dice «El próximo reto está por anunciar» |

### Mes del curso (elemento de `meses`)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `mes` | mes | sí | Fijo en el panel (solo lectura) |
| `tema` | texto | no | ≤ 80 caracteres. Vacío → «Por anunciar» (FR-018) |
| *Reto publicado* | derivado | — | Enlace al reto si existe un Reto del mes `publicado` con ese `curso` y `mes` (FR-019) |
| *Situación* | derivado | — | `en curso` si es el mes del reto en `en_curso`; si no, `no en curso` |

## Reto del mes · `content/retos/<curso>-<mes>.yml` (uno por mes)

Esquema: [contracts/reto.schema.json](contracts/reto.schema.json). El nombre del fichero
lo genera el panel: `{curso}-{mes}.yml` (p. ej. `2026-2027-octubre.yml`).

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `curso` | texto | sí | Igual que `curso` de `curso.yml` |
| `mes` | mes | sí | Único por `curso` (script) |
| `estado` | `borrador` \| `publicado` | sí | Por defecto `borrador` (ADR 0011) |
| `nombre` | texto | sí | ≤ 80. Ej.: «Resolver, no ganar» |
| `objetivo` | texto largo | sí | ≤ 600 |
| `descripcion` | texto largo | sí | ≤ 1 500; párrafos separados por línea en blanco |
| `pasos` | lista de texto | no | 0 a 10 elementos, cada uno ≤ 200; se muestran como lista numerada en orden (FR-006) |
| `fuentes` | lista de **Fuente** | sí si `publicado` | ≥ 1 si `publicado` (principio IV, FR-016) |
| `motriz` | **Reto motriz** | sí | |
| `tutoria` | **Reto de tutoría** | sí | |
| `familia` | **Reto en familia** | sí | |
| *Tema* | derivado | — | El `tema` del mes en `curso.yml`. Si está vacío y el reto es `publicado` → error (script) |
| *URL* | derivado | — | `/retos/<curso>/<mes>/` |

Reglas de borrador (ADR 0011): un `borrador` pasa el esquema básico (tipos, formatos,
longitudes) pero no se le exigen `fuentes`; no genera página ni aparece en el calendario.

### Fuente

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `titulo` | texto | sí | ≤ 200. Ej.: «Modelo de los Mensajes-Yo (Thomas Gordon)» |
| `url` | texto | no | `^https://` ; ≤ 300. Se muestra como enlace externo con aviso |

### Reto (parte común de motriz, tutoría y familia)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `nombre` | texto | motriz: sí; tutoría y familia: no | ≤ 80. Vacío en tutoría/familia → se muestra el nombre del tipo («Reto de tutoría», «Reto en familia»). Ver HUECO en el plan |
| `descripcion` | texto largo | no | ≤ 1 200. Vacío → «Por confirmar» |
| `desde`, `hasta` | fecha | no | Las dos o ninguna; `hasta` ≥ `desde` (script). Vacías → solo se muestra la semana (FR-002, FR-004) |
| `materiales` | lista de **Material** | no | 0 a 10 (FR-007) |
| *Semana* | fijo | — | Motriz: «1.ª semana»; tutoría: «2.ª y 3.ª semanas»; familia: «Última semana» |
| *Para quién* | fijo | — | Motriz: «Todo el centro»; tutoría: «Cada grupo con su tutor/a»; familia: «El alumnado con su familia, en casa» |

### Reto motriz (además de lo común)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `fecha` | fecha | no | Dentro del curso (del 1 de septiembre del primer año al 30 de junio del segundo; script). Vacía → «Por confirmar» |
| `hora` | texto | no | `^([01]\d\|2[0-3]):[0-5]\d$`. Vacía → «Por confirmar» |
| `lugar` | texto | no | ≤ 120. Vacío → «Por confirmar» |
| *Recreo y autoría* | fijo | — | «En el recreo» y «Lo ha diseñado alumnado de 2.º de Bachillerato» (FR-003), sin nombres |

### Reto de tutoría (además de lo común)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `adaptado_por_etapas` | sí/no | no (por defecto no) | Si sí, se muestra: «Se adapta por etapas (1.º y 2.º ESO, 3.º y 4.º ESO, Bachillerato y FP): consulta la guía del tutor/a» (FR-030) |

### Material

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `titulo` | texto | sí | ≤ 120. Ej.: «Guía del tutor/a» |
| `tipo` | `documento` \| `ficha` \| `justificante` \| `cartel` \| `infografia` | sí | |
| `destinatario` | `alumnado` \| `familias` \| `tutores` \| `todo-el-centro` | sí | Se muestra «Alumnado», «Familias», «Tutor/a», «Todo el centro» (FR-008) |
| `archivo` | ruta de fichero | no | Empieza por `/materiales/` (se recomienda la subcarpeta `<curso>-<mes>/`), sin `..`; el fichero existe en `content/materiales/…` (script); extensión `pdf`, `png`, `jpg` o `jpeg` (mayúsculas o minúsculas); ≤ 10 MB (ADR 0013). Vacío → «Disponible próximamente», sin enlace (caso límite «material que falta») |
| `version_texto` | texto largo | sí si `tipo` = `infografia` | ≤ 3 000; párrafos o pasos separados por línea en blanco; se muestra en la web en el mismo orden (FR-010, SC-007) |
| *Formato* | derivado | — | De la extensión: «PDF», «Imagen PNG», «Imagen JPG» |
| *Tamaño* | derivado | — | Del fichero real, en español: «850 KB», «1,2 MB» |
| *Entrega* | fijo | — | Si `tipo` es `ficha` o `justificante`: «Se entrega en papel o por la plataforma educativa, no a través de esta web» (FR-011) |

## Sitio · `content/sitio.yml` (un único fichero)

Esquema: [contracts/sitio.schema.json](contracts/sitio.schema.json)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `genially.nombre` | texto | sí | ≤ 80. «El Arbalquimista de la salud» |
| `genially.url` | texto | sí | `^https://` ; ≤ 300. HUECO: la URL no está en la especificación |

## Relaciones

```text
Curso 1 ──── 9 Mes del curso
Curso 1 ──── 0..1 Reto del mes «en curso» (en_curso)
Mes del curso 1 ──── 0..1 Reto del mes publicado (mismo curso y mes)
Reto del mes 1 ──── 3 Reto (motriz, tutoría, familia)
Reto 1 ──── 0..10 Material
Reto del mes 1 ──── 0..n Fuente
```

## Estados

```text
Reto del mes:   borrador ──(la comisión revisa y cambia estado)──▶ publicado
                publicado ──(despublicar)──▶ borrador
Situación:      derivada de curso.yml → «en curso» o «no en curso» (FR-028)
Inicio de la web: en_curso con valor → muestra ese reto
                  en_curso vacío    → aviso «próximo reto» + último reto publicado + calendario (FR-029)
```

«Último reto publicado» (FR-029): el reto `publicado` del curso cuyo mes va más tarde en
el orden octubre → junio.

## Ejemplo (octubre, datos de la especificación)

Ver `content/retos/2026-2027-octubre.yml` en
[contracts/ejemplos/2026-2027-octubre.yml](contracts/ejemplos/2026-2027-octubre.yml).
