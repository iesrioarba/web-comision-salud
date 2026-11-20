# Feature Specification: Páginas legales (declaración de accesibilidad, aviso legal y privacidad)

**Feature Branch**: `002-paginas-legales`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Páginas legales de la web de la Comisión de Salud del IES Río Arba: declaración de accesibilidad, aviso legal e información de privacidad. Son obligatorias antes de que la web nueva se despliegue (ver tarea T023 de specs/001-reto-octubre/tasks.md y ADR 0016)."

## Contexto

La web de la Comisión de Salud es la web de un centro público. La constitución del
proyecto (principio I) y el RD 1112/2018 exigen una **declaración de accesibilidad**
publicada y al día, con un medio de contacto. El principio II y el RGPD exigen informar
de cualquier tratamiento de datos personales; la web solo trata el correo de quienes
editan desde el panel (ADR 0010). Además, la web necesita un **aviso legal** que diga
quién es su titular.

Decisiones ya tomadas que condicionan esta funcionalidad:

- Las tres páginas DEBEN estar integradas antes de que se despliegue la web nueva de la
  funcionalidad 001 (tarea T023 de `specs/001-reto-octubre/tasks.md`).
- Hasta el estreno, la web se publica sin anunciar (ADR 0016). En el estreno (tarea
  T050 de la 001) la declaración se actualiza con el resultado de las comprobaciones a
  mano (tarea T047 de la 001).
- La declaración puede publicarse al principio como «parcialmente conforme, en
  revisión», con fecha.
- La web pública no tiene formularios, cookies, analítica, fotos ni vídeos (el panel
  solo usa una cookie técnica de sesión, FR-020).

## Clarifications

### Session 2026-11-19

- Q: ¿Las páginas legales las edita la comisión desde el panel o solo quien mantiene la web? → A: Solo quien mantiene la web, con rama, PR y revisión. Además, DEBE haber un mantenedor suplente nombrado y una guía del cambio.
- Q: ¿Se puede integrar y desplegar (T023) con datos legales pendientes? → A: Sí, mostrados como «Pendiente de confirmar», salvo el canal de contacto de accesibilidad (obligatorio desde la primera publicación) y el responsable y la base legal del tratamiento (obligatorios antes de dar acceso a nadie al panel, T040 de la 001). En el estreno no queda ningún dato pendiente.
- Q: ¿El servidor de la web pública debe guardar registros de las visitas (IP, página, hora)? → A: No. Sin registros de visitas; solo se guardan los errores del servidor, sin IP. La página de privacidad dice que no se guarda nada que identifique a quien visita.
- Q: ¿Quién da el visto bueno al contenido de las páginas legales antes de publicarlas o cambiarlas? → A: La dirección del centro, anotado en la PR, antes de la primera publicación y de cada cambio de contenido. La parte de privacidad de quienes editan se consulta además con el DPD.
- Q: ¿La declaración de accesibilidad cubre solo la web pública o también el panel? → A: Las dos. Se comprueba la accesibilidad del panel y se declaran sus fallos, con una alternativa para quien edita y no puede usarlo.
- Q: ¿Cómo se asegura la revisión anual de la declaración? → A: Un aviso automático en el repositorio (una incidencia que se abre sola) un mes antes de cumplirse el año desde la última revisión, para quien mantiene la web y su suplente; además, en cada push una comprobación avisa, sin bloquear, si la revisión vence en menos de un mes o ya ha vencido.
- Q: ¿En cuántos días como máximo se publica el contenido que envía quien no puede usar el panel? → A: 5 días lectivos.

### Session 2026-11-20 (tras /speckit-analyze)

- Q: ¿La consulta al DPD bloquea publicar la página de privacidad? → A: No. El DPD se consulta antes de publicar el responsable, la base legal y los encargados; hasta entonces figuran como «Pendiente de confirmar» (FR-022, FR-024a).
- Q: ¿Qué es «en cada push» para el aviso de revisión sin bloqueo? → A: En cada PR y en cada push a main (FR-027).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar la declaración de accesibilidad y comunicar un problema (Priority: P1)

Una persona con discapacidad, o cualquier visitante, quiere saber hasta qué punto la web
es accesible, qué partes no lo son y por qué, y cómo pedir ayuda: comunicar un problema
de accesibilidad, pedir un contenido en un formato accesible o presentar una queja. Desde
cualquier página llega a la declaración, la entiende y encuentra el canal de contacto
del centro.

**Why this priority**: es una obligación legal (RD 1112/2018) y de la constitución
(principio I), y sin ella no se puede desplegar la web nueva (T023 de la 001).

**Independent Test**: desde la página de inicio y desde la página de un reto, una
persona que usa solo el teclado o un lector de pantalla llega a la declaración, dice en
qué situación de cumplimiento está la web, nombra un contenido no accesible y encuentra
cómo contactar con el centro, sin ayuda.

**Acceptance Scenarios**:

1. **Given** cualquier página de la web, **When** la persona busca la declaración de
   accesibilidad, **Then** la encuentra en el pie de la página con un enlace de nombre
   claro y llega a ella en un paso.
2. **Given** la declaración, **When** la persona la lee, **Then** encuentra, en este
   orden y con encabezados, los apartados del modelo europeo: compromiso y alcance,
   situación de cumplimiento, contenido no accesible, preparación de la declaración,
   observaciones y datos de contacto, y procedimiento de aplicación.
3. **Given** la situación de cumplimiento antes del estreno, **When** la persona la lee,
   **Then** ve «parcialmente conforme» con el RD 1112/2018, que la declaración está en
   revisión y la fecha de esa situación.
4. **Given** el apartado de contenido no accesible, **When** la persona lo lee, **Then**
   ve cada contenido no accesible conocido (por ejemplo, materiales en PDF aún no
   revisados y el Genially, contenido de terceros solo enlazado) con el motivo y, si la
   hay, la alternativa.
5. **Given** el apartado de contacto, **When** la persona quiere comunicar un problema,
   pedir información accesible o presentar una queja, **Then** encuentra un canal del
   centro (no personal) y sabe qué pasa después: plazo de respuesta de veinte días
   hábiles y qué hacer si no hay respuesta o no es satisfactoria.
6. **Given** el procedimiento de aplicación, **When** la persona no ha recibido
   respuesta en veinte días hábiles o no está de acuerdo con ella, **Then** sabe ante
   qué unidad puede reclamar y cómo.

---

### User Story 2 - Saber qué datos se tratan (información de privacidad) (Priority: P1)

Una familia o un alumno o alumna quiere saber si la web guarda algo sobre quien la
visita. Una persona de la comisión que va a recibir acceso al panel quiere saber qué
dato suyo se guarda, quién es responsable, para qué, dónde, cuánto tiempo y qué derechos
tiene.

**Why this priority**: es obligación del RGPD para el tratamiento del correo de quienes
editan (ADR 0010) y del principio II; también bloquea el despliegue de la web nueva.

**Independent Test**: una persona que no conoce el proyecto lee la información de
privacidad y responde sin ayuda: «¿la web usa cookies?», «¿qué dato se guarda de quienes
editan?», «¿a quién escribo para ejercer mis derechos?» y «¿dónde reclamo?».

**Acceptance Scenarios**:

1. **Given** cualquier página de la web, **When** la persona busca la privacidad,
   **Then** la encuentra en el pie con un enlace de nombre claro.
2. **Given** la parte para visitantes, **When** la persona la lee, **Then** sabe que la
   web no tiene formularios, cookies ni analítica, que no carga servicios de terceros
   y que el servidor no guarda registros de visitas ni nada que identifique a quien la
   visita (solo errores del servidor, sin dirección IP).
3. **Given** la parte para quienes editan, **When** la persona la lee, **Then**
   encuentra: responsable del tratamiento, contacto del Delegado de Protección de Datos
   (protecciondatossecd@aragon.es), finalidad (dar acceso para publicar), base legal,
   dato que se guarda (solo el correo), dónde se guarda (servidor del centro en la Unión
   Europea), encargados del tratamiento, conservación (mientras la persona sea editora),
   sus derechos y cómo ejercerlos, y la posibilidad de reclamar ante la Agencia
   Española de Protección de Datos.
4. **Given** la información de privacidad, **When** se compara con lo que la web y el
   panel hacen de verdad, **Then** no hay ninguna contradicción (por ejemplo, no dice
   «no se guarda nada» si el servidor guarda registros de visitas).

---

### User Story 3 - Saber quién es el titular de la web (aviso legal) (Priority: P2)

Cualquier visitante quiere saber quién está detrás de la web, cómo contactar con el
centro y si responde de los sitios externos a los que enlaza (por ejemplo, el Genially).

**Why this priority**: es necesario antes del despliegue, pero tiene menos efectos para
las personas que la accesibilidad y la privacidad.

**Independent Test**: desde cualquier página, una persona encuentra el aviso legal y dice
quién es el titular, cómo contactar con el centro y qué pasa con los enlaces externos.

**Acceptance Scenarios**:

1. **Given** cualquier página de la web, **When** la persona busca el aviso legal,
   **Then** lo encuentra en el pie con un enlace de nombre claro.
2. **Given** el aviso legal, **When** la persona lo lee, **Then** encuentra: titular (IES
   Río Arba, centro público del Departamento de Educación del Gobierno de Aragón), CIF
   del centro, dirección postal, correo de contacto del centro y finalidad de la web.
3. **Given** el aviso legal, **When** la persona lee sobre los enlaces externos,
   **Then** queda claro que los sitios externos enlazados no dependen del centro.

---

### User Story 4 - Mantener las páginas al día (Priority: P2)

Quien mantiene la web actualiza la declaración en el estreno con el resultado de las
comprobaciones a mano, la revisa como mínimo una vez al año y corrige cualquier dato
legal que cambie (por ejemplo, el canal de contacto o los encargados del tratamiento),
sin romper el diseño ni la accesibilidad de la web.

**Why this priority**: una declaración desfasada incumple el principio I («publicada y
al día»), pero el primer contenido se publica antes y esto se usa después.

**Independent Test**: siguiendo solo la guía del cambio, quien mantiene la web o su
suplente cambia la situación de cumplimiento y la fecha de la última revisión de la declaración,
y la web muestra los datos nuevos.

**Acceptance Scenarios**:

1. **Given** el estreno, **When** se termina la comprobación a mano de la 001 (T047),
   **Then** la declaración se actualiza con su resultado (situación de cumplimiento,
   contenido no accesible y fechas) antes del estreno (T050).
2. **Given** una declaración con fecha de última revisión de hace más de un año,
   **When** quien mantiene la web la revisa, **Then** existe un procedimiento escrito
   que dice qué revisar y cómo actualizar la fecha.
   Además, un mes antes de cumplirse el año ya se abrió sola una incidencia en el
   repositorio para quien mantiene la web y su suplente.
3. **Given** cualquier cambio en las páginas legales, **When** se publica, **Then** la
   web sigue pasando las mismas comprobaciones de accesibilidad y no se rompe su diseño.
4. **Given** un cambio en una página legal, **When** se hace, **Then** lo hace quien
   mantiene la web o su suplente, en una rama, con PR y revisión independiente antes de
   integrarlo, con el visto bueno de la dirección del centro anotado en la PR si cambia
   el contenido; la comisión no edita estas páginas desde el panel.
5. **Given** que quien mantiene la web no está disponible, **When** hay que actualizar
   una página legal, **Then** el suplente nombrado puede hacerlo solo con la guía del
   cambio.

---

### Edge Cases

- **Dato legal pendiente** (CIF, dirección, correo del centro, canal de accesibilidad,
  unidad de reclamaciones, responsable y base legal del tratamiento, encargados): la página NUNCA inventa el dato; muestra «Pendiente de
  confirmar» en su lugar (FR-022). Hay tres excepciones que bloquean (FR-023): sin canal
  de contacto de accesibilidad no se publica la declaración; sin responsable y base
  legal del tratamiento no se da acceso al panel a nadie (T040 de la 001); y el estreno
  (T050 de la 001) no se hace con ningún dato pendiente.
- **Canal de contacto de una persona**: si el único canal disponible es el correo de una
  persona, no se acepta (principio VIII); el canal DEBE ser del centro.
- **Contenido de terceros** (el Genially): se declara como contenido de terceros solo
  enlazado, que el centro no controla, sin prometer su accesibilidad.
- **Materiales PDF sin revisar**: se citan como contenido no accesible hasta que se
  revisen (T047 C6 de la 001), con la alternativa disponible (la versión en texto de las
  infografías, FR-010 de la 001) y el ofrecimiento de pedirlos en formato accesible.
- **Página legal no encontrada**: si un enlace del pie apunta a una página que no
  existe, la comprobación automática de enlaces DEBE fallar y la web no se despliega.
- **Impresión**: las páginas legales se imprimen legibles, sin menús.
- **Declaración caducada**: si la fecha de la última revisión tiene más de un año, se
  considera desfasada y se revisa (User Story 4).
- **Proxy compartido del VPS**: la prohibición de guardar registros de visitas (FR-019)
  se aplica a todo lo que atiende las visitas de la web pública, también al proxy de
  Easypanel que está delante. Si en el plan se comprueba que ese proxy guarda la IP y
  quienes gestionan el VPS no pueden desactivarlo para esta web, la página de privacidad
  DEBE decir qué se guarda, para qué y cuánto tiempo (FR-021), y se revisa esta decisión.

## Requirements *(mandatory)*

### Functional Requirements

**Comunes a las tres páginas**

- **FR-001**: La web DEBE tener tres páginas propias: «Declaración de accesibilidad»,
  «Aviso legal» y «Privacidad».
- **FR-002**: Todas las páginas de la web, incluidas las de la funcionalidad 001 y la
  página de «Página no encontrada», DEBEN tener en el pie un enlace a cada una de las
  tres páginas, con un texto que diga claramente a dónde lleva.
- **FR-003**: Las tres páginas DEBEN cumplir las WCAG 2.1 AA y las mismas reglas que el
  resto de la web: estructura con encabezados, uso completo con teclado, idioma español,
  sin cookies ni recursos de terceros, y legibles al imprimir.
- **FR-004**: Los textos DEBEN estar en español claro, comprensible por alumnado de 12
  años: frases cortas, sin jerga jurídica innecesaria y, cuando se use un término legal
  obligatorio, con una explicación sencilla al lado.
- **FR-005**: Ninguna página DEBE inventar un dato legal. Los datos que aún no se
  conocen se tratan según el caso límite «Dato legal pendiente».
- **FR-006**: Cada página DEBE mostrar la fecha de su última actualización.
- **FR-007**: Las páginas NO DEBEN contener formularios, fotos ni vídeos. El contacto se
  hace por un canal del centro (correo u otro) que la página solo indica o enlaza.

**Declaración de accesibilidad** (modelo de la Decisión de Ejecución (UE) 2018/1523 y
RD 1112/2018)

- **FR-008**: La declaración DEBE tener estos apartados, en este orden: compromiso y
  alcance; situación de cumplimiento; contenido no accesible; preparación de la
  declaración; observaciones y datos de contacto; procedimiento de aplicación.
- **FR-009**: «Compromiso y alcance» DEBE decir que el IES Río Arba se compromete a hacer
  accesible la web según el RD 1112/2018 y a qué web se aplica la declaración (su
  dirección y que incluye las páginas del reto del mes, el calendario y los materiales)
  y que también se aplica al panel de edición que usa la comisión.
- **FR-010**: «Situación de cumplimiento» DEBE indicar una de las situaciones del modelo
  («totalmente conforme», «parcialmente conforme» o «no conforme») con el RD 1112/2018.
  Antes del estreno DEBE decir «parcialmente conforme», que está en revisión y su fecha.
- **FR-011**: «Contenido no accesible» DEBE enumerar cada contenido no accesible
  conocido, agrupado según el modelo (falta de conformidad, carga desproporcionada, o
  fuera del ámbito de la legislación), con el motivo y la alternativa accesible si la
  hay. Como mínimo: los materiales en PDF que aún no se hayan revisado y el Genially
  como contenido de terceros solo enlazado.
- **FR-011a**: La accesibilidad del panel DEBE comprobarse con el mismo método que la
  web pública (herramientas automáticas y revisión manual con teclado y lector de
  pantalla), y sus fallos DEBEN figurar en «Contenido no accesible». Como alternativa,
  la declaración DEBE decir que quien edita y no puede usar el panel puede enviar el
  contenido por el canal de contacto de accesibilidad a quien mantiene la web, que lo
  publica en un plazo máximo de 5 días lectivos, indicado en la declaración.
- **FR-012**: «Preparación de la declaración» DEBE indicar la fecha en que se preparó,
  el método (autoevaluación con herramientas automáticas y revisión manual con teclado
  y lector de pantalla) y la fecha de la última revisión.
- **FR-013**: «Observaciones y datos de contacto» DEBE dar un canal del centro, no
  personal, para: comunicar problemas de accesibilidad, pedir información en formato
  accesible y presentar quejas. DEBE indicar el plazo de respuesta (veinte días hábiles).
- **FR-014**: «Procedimiento de aplicación» DEBE explicar qué hacer si no hay respuesta
  en veinte días hábiles o si no es satisfactoria, y qué unidad tramita las
  reclamaciones, con su forma de contacto.
- **FR-015**: La declaración DEBE actualizarse en el estreno con el resultado de las
  comprobaciones a mano de la 001 (T047) y revisarse al menos una vez al año; cada
  revisión cambia la fecha de la última revisión.

**Aviso legal**

- **FR-016**: El aviso legal DEBE indicar: titular (IES Río Arba, centro público del
  Departamento de Educación del Gobierno de Aragón), CIF del centro, dirección postal,
  correo de contacto del centro y finalidad de la web (informar de los retos de salud
  de la Comisión de Salud y ofrecer sus materiales).
- **FR-017**: El aviso legal DEBE decir que los sitios externos a los que enlaza la web
  no dependen del centro y que el centro no responde de su contenido.

**Información de privacidad**

- **FR-018**: La página de privacidad DEBE tener dos partes separadas con su encabezado:
  «Si visitas la web» y «Si editas la web desde el panel».
- **FR-019**: La parte de visitantes se refiere a la web pública (no al panel). DEBE
  decir que la web pública no tiene formularios, cookies, analítica ni servicios de
  terceros que rastreen, y que no se guarda nada que identifique a quien visita. El
  servidor de la web pública NO DEBE guardar registros de visitas (ni dirección IP, ni
  página pedida, ni hora); solo puede guardar registros de errores del servidor, sin
  dirección IP ni otro dato que identifique a quien visita.
  Esto incluye el proxy del VPS que está delante de la web (caso límite «Proxy
  compartido del VPS»).
- **FR-020**: La parte de quienes editan DEBE indicar: responsable del tratamiento;
  contacto del Delegado de Protección de Datos (protecciondatossecd@aragon.es);
  finalidad (dar acceso para publicar); base legal; dato que se guarda (solo el correo y
  los datos técnicos de su sesión en el panel, ADR 0010); que el panel usa una cookie
  técnica de sesión, imprescindible para entrar, que no se usa para nada más y no
  necesita consentimiento; dónde (servidor del centro en
  la Unión Europea); encargados del tratamiento; conservación (mientras la persona sea
  editora; se borra cuando deja de serlo); derechos (acceso, rectificación, supresión,
  oposición, limitación y portabilidad) y cómo ejercerlos; y la posibilidad de reclamar
  ante la Agencia Española de Protección de Datos.
- **FR-021**: La información de privacidad DEBE coincidir con lo que la web y el panel
  hacen de verdad. Cualquier cambio en lo que se trata (un dato nuevo, un encargado
  nuevo, otro servidor) DEBE reflejarse en la página antes de aplicarse.

**Datos pendientes**

- **FR-022**: Mientras el centro o el DPD no confirmen un dato legal, la página DEBE
  mostrar «Pendiente de confirmar» en su lugar, nunca un hueco vacío ni un valor
  inventado.
- **FR-023**: Hay datos que no pueden estar pendientes:
  - el canal de contacto de accesibilidad: DEBE estar confirmado antes de la primera
    publicación de la declaración (y, por tanto, antes de T023 de la 001);
  - el responsable y la base legal del tratamiento de los correos de quienes editan:
    DEBEN estar confirmados y publicados antes de dar acceso al panel a ninguna persona
    (T040 de la 001);
  - en el estreno (T050 de la 001), ningún dato legal puede estar pendiente.

**Mantenimiento**

- **FR-024**: Las páginas legales solo las cambia quien mantiene la web o su suplente,
  en una rama, con PR y revisión independiente antes de integrar (principio VII). La
  comisión NO las edita desde el panel.
- **FR-024a**: Antes de la primera publicación y de cada cambio de contenido (no de
  diseño ni de formato), la dirección del centro DEBE dar su visto bueno al texto, y ese
  visto bueno queda anotado en la PR (sin datos personales: por cargo). La parte de
  privacidad de quienes editan se consulta además con el DPD antes de publicar el
  responsable, la base legal y los encargados; hasta entonces figuran como «Pendiente de
  confirmar» (FR-022).
- **FR-025**: DEBE haber un mantenedor suplente nombrado por el centro, distinto de quien
  mantiene la web, que pueda hacer estos cambios. Su nombramiento queda registrado en la
  documentación del proyecto, por su cargo o función en el centro y sin datos personales
  en el repositorio. El suplente tiene una cuenta de GitHub en la organización
  iesrioarba con permiso para proponer cambios (crear ramas y PR), sin cuentas
  compartidas.
- **FR-026**: DEBE existir una guía del cambio, en lenguaje sencillo, que explique a quien
  mantiene la web y a su suplente cómo actualizar cada página legal: qué revisar cada año,
  cómo actualizar la declaración en el estreno con el resultado de las comprobaciones a
  mano, cómo cambiar un dato legal y cómo comprobar que la web sigue en verde. La guía
  DEBE explicar cómo hacerlo desde la web de GitHub, sin terminal: editar el fichero de
  la página legal en el navegador, crear la rama y abrir la PR desde allí.
- **FR-027**: Un mes antes de cumplirse un año desde la fecha de la última revisión de
  la declaración, DEBE abrirse sola una incidencia en el repositorio dirigida a quien
  mantiene la web y a su suplente, sin servicios de terceros nuevos. Además, en cada push
  una comprobación DEBE avisar, sin bloquear el despliegue, en cada PR y en cada push a
  main, si la revisión vence en menos de un mes o ya ha vencido.

### Key Entities

- **Página legal**: una de las tres (declaración de accesibilidad, aviso legal,
  privacidad). Tiene título, apartados con encabezado, fecha de última actualización y
  un enlace en el pie de todas las páginas.
- **Declaración de accesibilidad**: situación de cumplimiento, lista de contenido no
  accesible (contenido, motivo, grupo del modelo, alternativa), fecha de preparación,
  método, fecha de la última revisión, canal de contacto y procedimiento de aplicación.
- **Dato legal del centro**: CIF, dirección postal, correo de contacto, canal de
  accesibilidad. Puede estar pendiente; nunca se inventa.
- **Tratamiento de datos**: solo el de quienes editan (ADR 0010): responsable, finalidad,
  base legal, dato, lugar, encargados, conservación y derechos.

Ningún dato de visitantes se recoge con esta funcionalidad.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las páginas de la web tiene en el pie los enlaces a las tres
  páginas legales, y el 100 % de esos enlaces funciona.
- **SC-002**: En una prueba con al menos 3 personas (alumnado de 12 a 14 años incluido),
  al menos 2 encuentran, sin ayuda y en menos de 1 minuto desde la página de inicio, el
  canal para comunicar un problema de accesibilidad.
- **SC-003**: Las tres páginas pasan la comprobación automática de accesibilidad sin
  errores y se recorren enteras con teclado y con lector de pantalla.
- **SC-004**: La declaración contiene los seis apartados del modelo europeo, en orden;
  una revisión contra el modelo no encuentra ninguno que falte.
- **SC-005**: El 0 % de los datos legales está inventado: cada dato es un dato
  confirmado por el centro o figura como pendiente; en el estreno, el 100 % está
  confirmado.
- **SC-006**: En el estreno, la fecha de la última revisión de la declaración es
  posterior a la comprobación a mano de la 001 (T047); después, nunca tiene más de un
  año.
- **SC-007**: La información de privacidad no contradice el comportamiento real: la
  revisión de la web publicada encuentra 0 cookies, 0 peticiones a terceros y 0
  registros de visitas en el servidor; los registros de errores no contienen ninguna
  dirección IP.
- **SC-008**: Antes del estreno hay un mantenedor suplente nombrado y, en una prueba,
  actualiza la fecha de la última revisión de la declaración solo con la guía del cambio,
  sin ayuda.
- **SC-009**: Antes del estreno, la accesibilidad del panel se ha comprobado con
  herramientas automáticas, teclado y lector de pantalla, y cada fallo encontrado figura
  en la declaración.

## Assumptions

- Las tres páginas se integran en la misma web y con las mismas reglas y comprobaciones
  que la funcionalidad 001; se especifican aparte porque son obligatorias antes de
  desplegar la web nueva (T023 de la 001).
- El texto sigue el modelo de declaración de la Decisión de Ejecución (UE) 2018/1523 y
  el RD 1112/2018; la redacción concreta se adapta a lenguaje claro sin perder ningún
  apartado obligatorio.
- El plazo de respuesta a comunicaciones y quejas de accesibilidad es de veinte días
  hábiles (RD 1112/2018).
- El contacto del Delegado de Protección de Datos del Departamento de Educación es
  protecciondatossecd@aragon.es (dato dado por Michel).
- El servidor de la web y del panel está en Fráncfort (Alemania), dentro de la UE
  (ESTADO.md, 2026-11-19).
- Los únicos datos personales que trata el proyecto son los de las personas editoras
  del panel (ADR 0010); la web no recoge datos de visitantes (FR-024 de la 001).
- **Datos pendientes** (los da el centro o el DPD; no se inventan): CIF, dirección
  postal y correo de contacto del centro; canal de contacto de accesibilidad; unidad que
  tramita las reclamaciones de accesibilidad de la web de un centro educativo;
  responsable y base legal del tratamiento de los correos de quienes editan (a
  confirmar con el DPD); encargados del tratamiento; quién es el mantenedor suplente (FR-025).
- Fuera de alcance: fotos y vídeos (no hay), formularios, cookies, analítica, banner de
  cookies (no hace falta: la web pública no usa cookies y el panel solo usa una cookie
  técnica de sesión, que no necesita consentimiento) y traducción a otros idiomas.
