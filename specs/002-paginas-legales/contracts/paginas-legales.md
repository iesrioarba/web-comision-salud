# Contrato: páginas legales, pie y aviso de revisión

Fija rutas, estructura, textos fijos y comportamiento que las pruebas comprueban. No fija
el diseño visual (H13 de la 001). Se aplican todas las «Reglas comunes a todas las
páginas» de `specs/001-reto-octubre/contracts/paginas-web.md` (idioma, `title`, un `h1`,
puntos de referencia, sin cookies ni terceros, sin JavaScript, impresión sin menús).

## Rutas

| URL | Fichero | `title` |
|---|---|---|
| `/accesibilidad/` | `src/legal/declaracion-accesibilidad.md` | «Declaración de accesibilidad · Comisión de Salud · IES Río Arba» |
| `/aviso-legal/` | `src/legal/aviso-legal.md` | «Aviso legal · Comisión de Salud · IES Río Arba» |
| `/privacidad/` | `src/legal/privacidad.md` | «Privacidad · Comisión de Salud · IES Río Arba» |

## Pie de TODAS las páginas (FR-002, SC-001)

- Dentro del `footer` de `base.njk`, un `nav` con nombre accesible «Información legal»
  y una lista (`ul`) con, en este orden: «Declaración de accesibilidad» →
  `/accesibilidad/`, «Aviso legal» → `/aviso-legal/`, «Privacidad» → `/privacidad/`.
- Rutas absolutas desde la raíz (funcionan en `/404.html` servida en cualquier ruta).
- En la página actual, el enlace lleva `aria-current="page"`.
- Al imprimir se oculta (regla común de la 001); las páginas legales se imprimen sin él.

## Estructura común de las tres páginas

1. `h1` con el título.
2. Párrafo «Última actualización: <fecha larga>» (front matter `actualizado`, FR-006).
3. Apartados con `h2` (y `h3` si hace falta), sin saltos de nivel.
4. Ni `form`, ni `img`, ni `video`, ni `iframe`, ni `audio` (FR-007).
5. Todo dato de `datos.yml` que valga `null` se ve como «Pendiente de confirmar».
6. Términos legales obligatorios con explicación sencilla al lado (FR-004), p. ej.
   «base legal (la norma que permite usar el dato)».

## `/accesibilidad/` (FR-008 a FR-015, FR-011a)

`h2` exactamente en este orden (SC-004):
1. «Compromiso y alcance»: IES Río Arba, RD 1112/2018, dirección de la web
   (`centro.web`), qué incluye (reto del mes, calendario y materiales) y que también se
   aplica al panel de edición de la comisión.
2. «Situación de cumplimiento»: «Esta web es <totalmente conforme | parcialmente
   conforme | no conforme> con el RD 1112/2018» según `situacion`; si `en_revision`,
   «Esta declaración está en revisión» y la fecha `fecha_situacion`.
3. «Contenido no accesible»: un `h3` por cada grupo con elementos («Falta de
   conformidad», «Carga desproporcionada», «Fuera del ámbito de la legislación»); en
   cada uno, lista con contenido, motivo y, si hay, «Alternativa: …»; los del panel
   llevan «(panel de edición)». Si `panel_comprobado` es `null`: texto fijo «La
   accesibilidad del panel de edición aún no se ha comprobado» en «Falta de
   conformidad». Siempre: la alternativa del panel («Si editas y no puedes usar el
   panel, envía el contenido por el canal de contacto de accesibilidad; quien mantiene
   la web lo publica en un máximo de 5 días lectivos»).
4. «Preparación de la declaración»: `fecha_preparacion`, método (autoevaluación con
   herramientas automáticas y revisión manual con teclado y lector de pantalla) y
   «Última revisión: <fecha_ultima_revision>».
5. «Observaciones y datos de contacto»: canal (`mailto:` o enlace), para qué sirve (tres
   usos de FR-013) y plazo «20 días hábiles».
6. «Procedimiento de aplicación»: qué hacer si no hay respuesta en 20 días hábiles o no
   es satisfactoria; `unidad_reclamaciones` (nombre y contacto o «Pendiente de
   confirmar»).

## `/aviso-legal/` (FR-016, FR-017)

`h2`: «Quién es el titular» (nombre, dependencia, CIF, dirección, correo), «Para qué es
esta web», «Enlaces a otros sitios» (no dependen del centro; no responde de su
contenido).

## `/privacidad/` (FR-018 a FR-021)

- `h2` «Si visitas la web»: sin formularios, cookies, analítica ni servicios de
  terceros; no se guarda nada que te identifique; el servidor solo guarda errores, sin
  dirección IP. Si la tarea del proxy (ADR 0018) concluye que el proxy guarda algo, aquí
  se dice qué, para qué y cuánto tiempo (FR-021).
- `h2` «Si editas la web desde el panel»: `h3` o lista de definiciones con responsable,
  DPD (`mailto:`), finalidad, base legal, datos (correo y datos técnicos de la sesión),
  cookie técnica de sesión, lugar, encargados, conservación, derechos y cómo ejercerlos,
  reclamación ante la AEPD (enlace «(sitio externo)»).

## Aviso de revisión anual (FR-027, ADR 0019)

- Vencimiento = `fecha_ultima_revision` + 1 año. «Próxima» = faltan 30 días o menos.
- **En cada push y PR** (paso de «comprobar», nunca falla por esto): si está próxima,
  `::warning title=Declaración de accesibilidad::La revisión anual vence el <fecha>`;
  si venció, «La revisión anual venció el <fecha>»; y lo mismo en el resumen del
  trabajo.
- **Programado** (semanal, y a mano): si está próxima o vencida y no hay incidencia
  abierta con la etiqueta `revision-declaracion`, crea una con título «Revisión anual de
  la declaración de accesibilidad (vence el <fecha>)», cuerpo con la lista de la guía del
  cambio y asignada a `vars.MANTENEDORES_WEB`. Nunca crea dos.
