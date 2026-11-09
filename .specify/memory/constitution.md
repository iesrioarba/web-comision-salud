# Constitution · Web de la Comisión de Salud (IES Río Arba)

Las palabras DEBE, NO DEBE, DEBERÍA y PUEDE se usan en sentido normativo: DEBE y NO DEBE
son obligatorios; DEBERÍA admite excepciones justificadas por escrito; PUEDE es opcional.

## Core Principles

### I. Accesible para todo el mundo

- La web DEBE cumplir las WCAG 2.1 nivel AA, como exige el RD 1112/2018.
- El cumplimiento DEBE comprobarse con herramientas automáticas y, además, a mano con
  teclado y con lector de pantalla.
- La web DEBE tener una declaración de accesibilidad publicada y al día, con un medio de
  contacto para comunicar problemas de accesibilidad.

**Justificación**: es una web de un centro público y la ley obliga; además, el alumnado y
las familias con discapacidad tienen el mismo derecho a usarla que cualquier otra persona.

### II. Privacidad por diseño

- Por defecto, la web NO DEBE recoger datos personales.
- La web NO DEBE tratar datos de salud en ningún caso.
- La web NO DEBE usar cookies, analítica ni servicios de terceros que rastreen sin
  consentimiento.
- Los datos del alumnado NO DEBEN tratarse sin una base legal documentada en un ADR 
  y sin consulta previa al DPD del Departamento de Educación.
- Las imágenes de menores NO DEBEN publicarse sin autorización ni acompañadas de nombres.

**Justificación**: el público son en gran parte menores y los datos de salud son categoría
especial del RGPD; el dato que no se recoge no se puede filtrar ni usar mal.

### III. No señalar a nadie

- La participación DEBE mostrarse en positivo y de forma agregada.
- NO DEBE haber clasificaciones ni comparativas que expongan a una persona o a un grupo
  pequeño.

**Justificación**: la salud y los hábitos son temas sensibles a estas edades; exponer a
alguien puede causar vergüenza o acoso y aleja justo a quien más necesita participar.

### IV. Contenido de salud fiable y seguro

- El contenido de salud DEBE basarse en fuentes oficiales o científicas reconocidas y
  DEBE citarlas.
- Todo lo generado con IA (textos e infografías) DEBE revisarlo una persona de la
  comisión antes de publicarse.
- La web educa, no diagnostica: NO DEBE dar consejos médicos personales y DEBE remitir a
  profesionales o recursos cuando proceda.
- Los retos DEBEN ser seguros y adecuados a la edad.
- Los retos NO DEBEN centrarse en el peso, las calorías ni el aspecto físico, ni juzgar
  la alimentación o los recursos de las familias.

**Justificación**: un error en un contenido de salud puede hacer daño real a menores;
centrarse en el cuerpo o en lo que cada familia puede permitirse favorece trastornos y
estigma.

### V. Editable por quien no programa

- El profesorado DEBE poder actualizar los contenidos sin tocar código.
- La forma de editar DEBE impedir que una edición de contenidos rompa el diseño.

**Justificación**: quien mantiene la web cada mes es profesorado sin conocimientos de
programación; si editar es difícil o arriesgado, la web se abandona.

### VI. Sencilla, ligera y para móvil

- La web DEBE funcionar bien en móviles modestos y con conexiones lentas.
- El plan técnico DEBE fijar un presupuesto de rendimiento, y la web DEBE cumplirlo.
- DEBERÍA elegirse lo sencillo y estándar antes que lo novedoso.
- Toda dependencia DEBE justificarse en un ADR y fijarse en la última versión estable.

**Justificación**: buena parte del público entra desde el móvil y no siempre con buena
conexión; cada pieza añadida es algo más que mantener, actualizar y que puede fallar.

### VII. Calidad comprobable

- Toda funcionalidad DEBE tener criterios de aceptación comprobables.
- NO DEBE publicarse nada sin las comprobaciones en verde.
- NO DEBE publicarse nada sin revisión independiente de alguien que no escribió el código.

**Justificación**: sin criterios comprobables no se sabe cuándo algo está hecho, y quien
escribe algo no ve sus propios fallos.

### VIII. Continuidad

- Todo DEBE vivir en el repositorio del centro, en la organización iesrioarba.
- NINGUNA pieza del proyecto (código, alojamiento, despliegue ni accesos) DEBE depender de una cuenta personal.
- Las decisiones técnicas DEBEN quedar registradas como ADR en `docs/decisiones/`.

**Justificación**: las personas cambian de centro y el proyecto debe seguir; quien llegue
después tiene que poder entender por qué se hizo cada cosa.

## Reglas generales

- Los contenidos DEBEN estar en español.
- Los contenidos DEBEN usar un lenguaje claro y cercano, pensado para alumnado de 12 a 20
  años y sus familias.

## Governance

- **Prevalencia**: esta constitución prevalece sobre cualquier otro documento del
  proyecto. Si otro documento la contradice, manda la constitución y el otro documento
  DEBE corregirse.
- **Modificación**: DEBE modificarse mediante rama y pull request. Cuando el cambio
  afecte a un principio, DEBE acompañarse de un ADR en `docs/decisiones/`.
- **Versionado semántico**:
  - MAYOR: quitar o redefinir un principio.
  - MENOR: añadir un principio o ampliar uno existente.
  - PARCHE: aclaraciones y cambios de redacción sin efecto en las reglas.
- **Comprobación del cumplimiento**: DEBE comprobarse en la «Constitution Check» de cada
  plan técnico, en `/speckit-analyze` y en cada revisión del subagente `revisor`.
- **Revisión periódica**: la constitución DEBE revisarse al inicio de cada curso escolar.

**Version**: 1.0.0 | **Ratified**: 2026-11-08 | **Last Amended**: 2026-11-08
