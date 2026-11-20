# Data Model: Páginas legales (002-paginas-legales)

**Fecha**: 2026-11-19 · **Plan**: [plan.md](plan.md) · Contrato:
[contracts/legal.schema.json](contracts/legal.schema.json)

No hay datos de visitantes ni base de datos. Todo son ficheros del repositorio que
edita quien mantiene la web o su suplente (FR-024), fuera de `content/`.

## Ficheros

| Fichero | Qué contiene | Quién lo edita |
|---|---|---|
| `src/legal/datos.yml` | Datos del centro, contacto de accesibilidad, declaración y tratamiento (entidades de abajo) | Mantenedor o suplente, con PR |
| `src/legal/declaracion-accesibilidad.md` | Texto de la declaración (seis apartados) | Ídem |
| `src/legal/aviso-legal.md` | Texto del aviso legal | Ídem |
| `src/legal/privacidad.md` | Texto de privacidad (dos partes) | Ídem |
| `src/legal/legal.11tydata.js` | Carga y valida `datos.yml` (o `LEGAL_DATA_FILE`), fija `layout` y `templateEngineOverride: njk,md` | Quien programa |

## Regla común: dato pendiente (FR-005, FR-022)

- Un dato que el centro o el DPD no han confirmado vale `null`.
- Prohibido: cadena vacía, solo espacios, o un texto que contenga «pendiente» (sin
  distinguir mayúsculas). El esquema lo rechaza (`pattern` y `not`).
- En la página, el filtro `pendiente` convierte `null` en el texto visible «Pendiente de
  confirmar». Nunca se muestra un hueco.

## Entidad: Centro (`centro`)

| Campo | Tipo | Obligatorio | Puede ser `null` | Reglas |
|---|---|---|---|---|
| `nombre` | texto | sí | no | Constante «IES Río Arba» |
| `dependencia` | texto | sí | no | «Departamento de Educación del Gobierno de Aragón» (FR-016) |
| `cif` | texto | sí | sí | 9 caracteres, `^[A-Z0-9]{9}$` |
| `direccion_postal` | texto | sí | sí | 1 a 200 caracteres |
| `correo` | texto | sí | sí | formato `email`; DEBE ser del centro (revisión humana) |
| `web` | texto | sí | sí | `^https://`; dirección de la web (FR-009; HUECO H1 de la 001) |

## Entidad: Contacto de accesibilidad (`accesibilidad`)

| Campo | Tipo | Obligatorio | `null` | Reglas |
|---|---|---|---|---|
| `canal_contacto` | objeto `{tipo, valor}` | sí | **NO** (FR-023, excepción 1) | `tipo`: `correo` o `web`; `valor`: email o `https://…`; canal del centro, no personal (revisión humana y de la dirección) |
| `unidad_reclamaciones` | objeto `{nombre, contacto}` | sí | sí | FR-014 |
| `plazo_respuesta_dias_habiles` | entero | sí | no | constante 20 (FR-013) |
| `plazo_contenido_panel_dias_lectivos` | entero | sí | no | constante 5 (FR-011a) |

## Entidad: Declaración (`declaracion`)

| Campo | Tipo | Obligatorio | `null` | Reglas |
|---|---|---|---|---|
| `situacion` | enumerado | sí | no | `totalmente-conforme`, `parcialmente-conforme`, `no-conforme` (FR-010) |
| `en_revision` | booleano | sí | no | `true` antes del estreno; `false` exigido por `--estreno` |
| `fecha_situacion` | fecha `AAAA-MM-DD` | sí | no | — |
| `fecha_preparacion` | fecha | sí | no | ≤ `fecha_ultima_revision` |
| `fecha_ultima_revision` | fecha | sí | no | no futura; base del aviso anual (FR-015, FR-027) |
| `panel_comprobado` | fecha o `null` | sí | sí | fecha del ensayo de accesibilidad del panel (SC-009); `null` = aún sin comprobar (`--estreno` lo exige no nulo) |
| `contenido_no_accesible` | lista de Contenido no accesible | sí | no | sin número mínimo: la lista refleja la situación real (hoy, PDF sin revisar y Genially, FR-011) y la revisan la dirección y el subagente revisor |

### Contenido no accesible (elemento de la lista)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `contenido` | texto | sí | 1 a 200 caracteres |
| `grupo` | enumerado | sí | `falta-de-conformidad`, `carga-desproporcionada`, `fuera-de-ambito` (FR-011) |
| `ambito` | enumerado | sí | `web` o `panel` |
| `motivo` | texto | sí | 1 a 400 caracteres |
| `alternativa` | texto | no | si falta, no se muestra nada (no es un dato legal) |

## Entidad: Tratamiento de quienes editan (`tratamiento_editores`)

| Campo | Tipo | Obligatorio | `null` | Reglas |
|---|---|---|---|---|
| `responsable` | texto | sí | sí (no para `--panel`) | FR-020, FR-023 excepción 2 |
| `base_legal` | texto | sí | sí (no para `--panel`) | ídem |
| `dpd_correo` | texto | sí | no | constante `protecciondatossecd@aragon.es` (spec, Assumptions) |
| `encargados` | lista de texto o `null` | sí | sí | cada elemento 1 a 200 caracteres |
| `lugar` | texto | sí | no | «Servidor del centro en la Unión Europea (Fráncfort, Alemania)» (ADR 0010) |

## Entidad: Página legal (front matter de cada `.md`)

| Campo | Reglas |
|---|---|
| `title` | «Declaración de accesibilidad», «Aviso legal» o «Privacidad» |
| `permalink` | `/accesibilidad/`, `/aviso-legal/`, `/privacidad/` |
| `actualizado` | fecha `AAAA-MM-DD` de la última actualización del contenido (FR-006); se muestra como «Última actualización: 19 de noviembre de 2026» |

## Transiciones

```text
Declaración:  parcialmente-conforme + en_revision: true   (primera publicación, antes de T023)
          ──▶ <situación tras T047> + en_revision: false   (estreno, T050; fecha_ultima_revision > fecha de T047)
          ──▶ revisión anual: fecha_ultima_revision = fecha de la revisión (FR-015)

Dato legal:   null («Pendiente de confirmar») ──▶ valor confirmado (con visto bueno de la dirección en la PR)
```

## Reglas por momento (FR-023), aplicadas por `scripts/check-legal.js`

| Momento | Orden | Exige |
|---|---|---|
| Siempre («comprobar») | `npm run comprobar:legal` | esquema; `canal_contacto` no nulo |
| Antes de invitar a nadie al panel (T040 de la 001) | `npm run comprobar:legal -- --panel` | además `responsable` y `base_legal` no nulos |
| Estreno (T050 de la 001); automático si `_site/index.html` no lleva `noindex` | `npm run comprobar:legal -- --estreno` | ningún `null`; `en_revision: false`; `panel_comprobado` no nulo |
