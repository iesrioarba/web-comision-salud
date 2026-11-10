# Feature Specification: El reto del mes (con el reto de octubre como ejemplo)

**Feature Branch**: `001-reto-octubre`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "Funcionalidad 001-reto-octubre: el reto del mes en la web de la comisión de salud del IES Río Arba. Cada mes del curso (octubre a junio) la comisión propone un tema de salud y tres retos (motriz en la 1.ª semana, de tutoría en la 2.ª y 3.ª, en familia en la última). Se construye con el reto de octubre como ejemplo real y debe servir igual para los demás meses."

## Contexto

Cada mes del curso 2026-2027, de octubre a junio (9 meses), la comisión de salud del IES
Río Arba propone un **tema de salud** y tres **retos**:

| Reto | Cuándo | Quién lo hace |
|---|---|---|
| Reto motriz | 1.ª semana del mes, en el recreo | Lo diseña alumnado de 2.º de Bachillerato; participa todo el centro |
| Reto de tutoría | 2.ª y 3.ª semanas | Cada grupo con su tutor/a |
| Reto en familia | Última semana | El alumnado con su familia, en casa |

Los temas del curso 2026-2027 ya están decididos:

| Mes | Tema |
|---|---|
| Octubre | Gestión del conflicto |
| Noviembre | Igualdad |
| Diciembre | Nutrición |
| Enero | Horas de sueño y pantallas |
| Febrero | Consumo de sustancias (vapeo) |
| Marzo | Convivencia y salud social |
| Abril | Actividad física saludable |
| Mayo | Gestión del estrés |
| Junio | Ecosalud |

Esta funcionalidad pone el reto del mes en la web. Se construye y se prueba con los datos
reales de octubre, pero todo lo que se describe aquí DEBE servir igual para cualquier mes.

### Datos reales de octubre (ejemplo de trabajo)

- **Tema**: Gestión del conflicto.
- **Reto del mes**: «Resolver, no ganar». Comunicación asertiva con Mensajes-Yo en 4 pasos:
  1. ¿Qué ha pasado?
  2. ¿Cómo lo he vivido yo?
  3. ¿Cómo lo ha vivido la otra persona?
  4. ¿Qué podemos hacer ahora?
- **Objetivo**: que el alumnado tome conciencia de sus respuestas automáticas ante el
  conflicto y practique de forma deliberada una herramienta de comunicación asertiva en
  sus relaciones habituales.
- **Reto de tutoría**: dos sesiones de 45-50 minutos separadas por una semana de práctica
  autónoma. En la primera se presenta la herramienta y se entrega la ficha; durante la
  semana, cada alumno/a aplica los 4 pasos a un único desacuerdo real; en la segunda se
  pone en común. El nivel de exigencia se adapta por etapas (1.º y 2.º ESO, 3.º y 4.º
  ESO, Bachillerato y FP).
- **Reto en familia**: una conversación en casa de 15 a 20 minutos sobre un desacuerdo
  cotidiano siguiendo los mismos 4 pasos, con un justificante que se devuelve en papel o
  por la plataforma educativa.
- **Fuentes**: modelo de los Mensajes-Yo de Thomas Gordon y comunicación no violenta de
  Marshall Rosenberg.
- **Reto motriz**: «Banco Chipi Chipi», viernes 9 de octubre de 2026 a las 11:30 (recreo).
  - En qué consiste y lugar: dato pendiente de la comisión. Mientras no lo dé, la web lo
    muestra «por confirmar» (FR-004).
- **Materiales**: guía del tutor/a, ficha del alumnado, carta para las familias,
  justificante para las familias, cartel del reto motriz e infografía de los 4 pasos.
- **Pendiente de la comisión** (contenido, no bloquea la especificación): en qué consiste
  y dónde se hace el reto motriz y, si se quieren mostrar, las fechas concretas de cada
  semana. No se inventan: se piden a la comisión.

## Clarifications

### Session 2026-11-09

- Q: Cuando termina un mes, ¿su reto, con los materiales, se puede seguir viendo en la web? → A: Sí. Cada reto publicado se puede seguir viendo con sus materiales; en el calendario, cada mes pasado lleva a su reto, y se indica con claridad que ya no es el reto en curso.
- Q: Cuando no hay ningún reto en curso (antes de publicar el del mes, o de julio a septiembre), ¿qué ve el visitante en el lugar del «reto del mes»? → A: Un aviso de «próximo reto» con el mes y su tema (o «por anunciar»), un enlace al último reto publicado y el calendario. La comisión indica cuándo no hay reto en curso.
- Q: El reto de tutoría se adapta por etapas (1.º y 2.º ESO, 3.º y 4.º ESO, Bachillerato y FP). ¿La web tiene que mostrar esa adaptación por separado? → A: No. Hay un solo reto de tutoría; la adaptación por etapas va dentro de la guía del tutor/a y la web solo dice que la hay.
- Q: Además de «1.ª semana», «2.ª y 3.ª semanas» y «última semana», ¿la web tiene que mostrar las fechas concretas de cada reto? → A: La semana siempre; las fechas concretas solo si la comisión las da. Si no las da, no se muestra nada de fechas (no es un dato «por confirmar»).
- Q: ¿Qué hacemos con el marcador del reto motriz «Banco Chipi Chipi» (en qué consiste y dónde se hace)? → A: Se quita el marcador; queda como dato de contenido pendiente de la comisión y la web lo muestra «por confirmar» (FR-004) hasta que lo dé.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver el reto del mes (Priority: P1)

Un alumno o alumna, una familia o un tutor/a entra en la web y ve, en un solo sitio, el
reto del mes: el tema, el objetivo y los tres retos, cada uno con la semana en que se hace.
Del reto motriz ve además la fecha, la hora y el lugar. Así sabe qué toca hacer y cuándo.

**Why this priority**: es la razón de ser de la web; sin esto no hay nada que mostrar.

**Independent Test**: con los datos de octubre cargados, una persona que no conoce el
proyecto entra en la web y, sin ayuda, dice el tema del mes, el nombre de los tres retos,
la semana de cada uno y cuándo y dónde es el reto motriz.

**Acceptance Scenarios**:

1. **Given** el reto de octubre publicado, **When** cualquier visitante abre la web,
   **Then** ve el tema «Gestión del conflicto», el reto «Resolver, no ganar», su objetivo
   y los 4 pasos de los Mensajes-Yo.
2. **Given** el reto de octubre publicado, **When** el visitante mira los tres retos,
   **Then** ve el reto motriz (1.ª semana), el de tutoría (2.ª y 3.ª semanas) y el de
   familia (última semana), cada uno con su semana.
3. **Given** el reto de octubre publicado, **When** el visitante mira el reto motriz,
   **Then** ve su nombre «Banco Chipi Chipi», la fecha (viernes 9 de octubre), la hora
   (11:30) y el lugar.
4. **Given** un dato del reto que la comisión aún no ha dado (por ejemplo, el lugar del
   reto motriz), **When** el visitante lo busca, **Then** ve un aviso claro de que está
   «por confirmar», nunca un hueco vacío ni un dato inventado.
5. **Given** una persona que usa solo el teclado o un lector de pantalla, **When** recorre
   el reto del mes, **Then** llega a toda la información en un orden lógico y entiende
   qué es cada parte.

---

### User Story 2 - Descargar los materiales de cada reto (Priority: P1)

Un tutor/a o una familia descarga los materiales del reto que le toca para usarlos en
pantalla o imprimirlos: la guía del tutor/a, la ficha del alumnado, la carta y el
justificante para las familias, el cartel del reto motriz y la infografía de los 4 pasos.
La infografía también se puede leer como texto en la propia web.

**Why this priority**: sin los materiales, el profesorado y las familias no pueden hacer
los retos; es lo que más se usa después de ver el reto.

**Independent Test**: con los materiales de octubre cargados, un tutor/a encuentra y
descarga la guía y la ficha en menos de un minuto, y una persona con lector de pantalla
lee el contenido completo de la infografía sin abrir ninguna imagen.

**Acceptance Scenarios**:

1. **Given** el reto de octubre publicado, **When** un tutor/a mira el reto de tutoría,
   **Then** encuentra junto a él la guía del tutor/a y la ficha del alumnado para descargar.
2. **Given** el reto de octubre publicado, **When** una familia mira el reto en familia,
   **Then** encuentra la carta y el justificante para las familias para descargar.
3. **Given** el reto de octubre publicado, **When** alguien mira el reto motriz,
   **Then** encuentra el cartel del reto motriz para descargar.
4. **Given** cada material, **When** el visitante lo ve en la lista, **Then** sabe antes
   de descargarlo qué es, para quién es, en qué formato está y cuánto ocupa.
5. **Given** la infografía de los 4 pasos, **When** el visitante la consulta, **Then**
   tiene en la web el mismo contenido en texto, completo y en el mismo orden.
6. **Given** la ficha del alumnado y el justificante, **When** el visitante los ve,
   **Then** queda claro que se rellenan y entregan en papel o por la plataforma
   educativa, no a través de la web.

---

### User Story 3 - Publicar o cambiar el reto del mes sin tocar código (Priority: P2)

Una persona de la comisión, sin conocimientos de programación, publica el reto de un mes
nuevo o corrige el del mes en curso (textos, fechas, lugar y materiales) sin tocar código
y sin poder romper el diseño de la web.

**Why this priority**: la web se actualiza cada mes; si publicar depende de alguien que
programa, se abandona. Va después de P1 porque el primer mes puede cargarse con ayuda.

**Independent Test**: una persona de la comisión que no programa, con la guía de
mantenimiento delante, publica un reto de prueba de un mes inventado (con un material) y
corrige la hora del reto motriz, sin ayuda y sin tocar código.

**Acceptance Scenarios**:

1. **Given** una persona de la comisión, **When** rellena los datos de un mes (tema,
   objetivo, tres retos, datos del motriz y materiales), **Then** el reto aparece en la
   web con el mismo aspecto que el de octubre.
2. **Given** un reto publicado, **When** la persona cambia un dato (por ejemplo, la hora
   o el lugar del reto motriz) o sustituye un material, **Then** la web muestra el cambio
   y la web solo muestra el dato o material nuevo.
3. **Given** una edición con un dato obligatorio vacío o mal escrito (por ejemplo, una
   fecha imposible), **When** la persona intenta publicarla, **Then** se le avisa con un
   mensaje claro y la web pública sigue como estaba.
4. **Given** cualquier edición de contenidos, **When** se publica, **Then** el diseño y la
   accesibilidad de la web no se rompen.
5. **Given** una persona que no es de la comisión, **When** intenta publicar o cambiar
   contenidos, **Then** no puede.

---

### User Story 4 - Ver el calendario del curso (Priority: P2)

Cualquier visitante ve el calendario del curso con los 9 meses (octubre a junio) y el
tema de cada mes, para saber qué viene y qué ya ha pasado.

**Why this priority**: da contexto y ayuda a planificar a tutores/as y familias, pero el
reto del mes funciona sin él.

**Independent Test**: un visitante abre el calendario y dice el tema de octubre y el de
cualquier otro mes que se le pregunte.

**Acceptance Scenarios**:

1. **Given** el calendario, **When** un visitante lo abre, **Then** ve los 9 meses de
   octubre a junio en orden, cada uno con su tema.
2. **Given** un mes cuyo tema aún no se ha anunciado (en cursos futuros o si la comisión
   cambia un tema), **When** aparece en el calendario, **Then** se indica «por anunciar»,
   sin inventar un tema.
3. **Given** el mes del reto en curso, **When** aparece en el calendario, **Then** se
   distingue de los demás de una forma que no depende solo del color, y lleva al reto.
4. **Given** un mes ya pasado con reto publicado, **When** el visitante lo pulsa en el
   calendario, **Then** llega a ese reto con sus materiales y ve claramente que no es el
   reto en curso.

---

### User Story 5 - Ir al Genially «El Arbalquimista de la salud» (Priority: P3)

Un alumno o alumna encuentra un enlace al Genially «El Arbalquimista de la salud», que se
abre fuera de la web.

**Why this priority**: es un complemento atractivo, pero no hace falta para hacer los retos.

**Independent Test**: un alumno o alumna encuentra el enlace, entiende antes de pulsarlo
que sale de la web del centro y llega al Genially.

**Acceptance Scenarios**:

1. **Given** la web, **When** un alumno o alumna busca el Genially, **Then** encuentra un
   enlace con su nombre «El Arbalquimista de la salud».
2. **Given** el enlace, **When** se lee (también con lector de pantalla), **Then** avisa
   de que lleva a un sitio externo.
3. **Given** cualquier página de la web, **When** se carga, **Then** no carga nada del
   Genially ni de su proveedor hasta que la persona pulsa el enlace.

---

### Edge Cases

- **Dato pendiente**: si la comisión no ha dado un dato (lugar, hora, descripción de un
  reto, tema de un mes), la web muestra «por confirmar» o «por anunciar»; nunca un hueco
  vacío ni un valor inventado.
- **Material que falta**: si un reto aún no tiene un material previsto, la web lo dice
  («disponible próximamente») en lugar de mostrar un enlace roto.
- **Cambio de fecha o lugar del reto motriz** (lluvia, imprevistos): la comisión lo
  cambia y la web muestra solo el dato nuevo.
- **Entre meses y fuera del curso** (julio a septiembre, o antes de publicar el reto de un
  mes): la web no muestra un hueco ni presenta un reto pasado como si estuviera en curso;
  muestra el aviso de «próximo reto», el enlace al último reto publicado y el calendario
  (FR-029).
- **Retos de meses pasados**: siguen consultables con sus materiales, marcados como
  pasados para que nadie los confunda con el reto en curso (FR-028).
- **Conexión lenta o móvil modesto**: el reto del mes se lee antes de que terminen de
  cargar imágenes o materiales; los materiales pesados no se descargan si la persona no
  los pide.
- **Impresión**: al imprimir la página del reto, se imprime el contenido legible, sin
  menús ni elementos que solo sirven en pantalla.
- **Imágenes de menores**: si un material o el cartel incluye fotos de alumnado, solo se
  publican con autorización y sin nombres.

## Requirements *(mandatory)*

### Functional Requirements

**Reto del mes**

- **FR-001**: La web DEBE mostrar el reto del mes en curso con: mes, tema, nombre del
  reto, objetivo y descripción.
- **FR-002**: La web DEBE mostrar los tres retos del mes (motriz, de tutoría y en
  familia), cada uno con su nombre, la semana o semanas en que se hace, para quién es y
  en qué consiste. Si la comisión da las fechas concretas de esas semanas, la web DEBE
  mostrarlas junto a la semana; si no las da, la web DEBE mostrar solo la semana.
- **FR-003**: Del reto motriz, la web DEBE mostrar además la fecha, la hora y el lugar, e
  indicar que se hace en el recreo y que lo ha diseñado alumnado de 2.º de Bachillerato,
  sin nombres de alumnos o alumnas.
- **FR-004**: Cuando un dato aún no se conoce, la web DEBE indicarlo como «por confirmar»
  y NO DEBE mostrar un hueco vacío ni un dato inventado. Se exceptúan las fechas concretas
  de las semanas de cada reto, que son opcionales (FR-002): si faltan, la web NO DEBE mostrar fechas ni
  «por confirmar».
- **FR-005**: La estructura del reto (tema, objetivo, tres retos con su semana, datos del
  motriz y materiales) DEBE ser la misma para los 9 meses del curso; el reto de octubre
  es el primer caso, no un caso especial.
- **FR-006**: Para octubre, la web DEBE mostrar los 4 pasos de los Mensajes-Yo en orden y
  con el texto exacto de la comisión.
- **FR-029**: Cuando la comisión indique que no hay reto en curso, la web DEBE mostrar en
  su lugar un aviso de «próximo reto» con el mes y su tema (o «por anunciar»), un enlace al
  último reto publicado, si lo hay, y el calendario. La comisión DEBE poder indicarlo sin
  tocar código.
- **FR-030**: Cada mes tiene un solo reto de tutoría para todas las etapas. Si se adapta
  por etapas, la web DEBE decirlo en su descripción y remitir a la guía del tutor/a, que
  recoge la adaptación. La web NO DEBE mostrar apartados ni materiales distintos por etapa.

**Materiales**

- **FR-007**: Cada reto DEBE poder tener cero o más materiales descargables, mostrados
  junto al reto al que pertenecen.
- **FR-008**: Cada material DEBE mostrar, antes de descargarlo, su nombre, para quién es
  (alumnado, familias, tutor/a, todo el centro), su formato y su tamaño.
- **FR-009**: Los materiales DEBEN poder descargarse e imprimirse, y DEBEN ser accesibles
  o tener una alternativa accesible.
- **FR-010**: Toda infografía DEBE tener en la web una versión en texto con el mismo
  contenido completo y en el mismo orden.
- **FR-011**: Junto a la ficha del alumnado y al justificante para las familias, la web
  DEBE indicar que se entregan en papel o por la plataforma educativa. La web NO DEBE
  recoger fichas, justificantes ni ningún otro documento o dato.

**Publicación por la comisión**

- **FR-012**: Las personas de la comisión DEBEN poder publicar el reto de un mes y
  cambiar cualquiera de sus datos y materiales sin tocar código.
- **FR-013**: La forma de editar NO DEBE permitir que una edición de contenidos rompa el
  diseño ni la accesibilidad de la web.
- **FR-014**: Antes de publicar, la edición DEBE avisar con un mensaje claro de los datos
  obligatorios vacíos o mal escritos, y una edición con errores NO DEBE llegar a la web.
- **FR-015**: Solo las personas autorizadas de la comisión DEBEN poder publicar o cambiar
  contenidos.
- **FR-016**: Cada reto DEBE poder citar las fuentes oficiales o científicas de su
  contenido de salud, y la web DEBE mostrarlas.
- **FR-017**: DEBE existir una guía de mantenimiento, en lenguaje sencillo, que explique
  a la comisión cómo publicar y cambiar un reto y sus materiales.

**Calendario**

- **FR-018**: La web DEBE mostrar el calendario del curso con los 9 meses de octubre a
  junio en orden, cada uno con su tema o «por anunciar».
- **FR-019**: El calendario DEBE distinguir el mes en curso sin depender solo del color, y
  enlazar con su reto. Cada mes pasado con reto publicado DEBE enlazar también con su reto.
- **FR-028**: Los retos de meses pasados DEBEN seguir consultables en la web con todos sus
  materiales, y DEBEN indicar de forma clara, sin depender solo del color, que no son el
  reto en curso.
- **FR-020**: La comisión DEBE poder añadir o cambiar el tema de cada mes del calendario
  sin tocar código.

**Genially**

- **FR-021**: La web DEBE ofrecer un enlace al Genially «El Arbalquimista de la salud»
  que se abre fuera de la web y avisa, también al lector de pantalla, de que es un sitio
  externo.
- **FR-022**: La web NO DEBE incrustar el Genially ni cargar nada de su proveedor antes de
  que la persona pulse el enlace.

**Transversales (de la constitución)**

- **FR-023**: Todo lo de esta funcionalidad DEBE cumplir las WCAG 2.1 AA: uso completo
  con teclado y foco visible, lector de pantalla, contraste AA, textos alternativos útiles
  e idioma español.
- **FR-024**: Esta funcionalidad NO DEBE recoger datos personales ni de salud de los
  visitantes, ni usar cookies, analítica o servicios de terceros que rastreen.
- **FR-025**: Los textos DEBEN estar en español, con lenguaje claro y cercano para
  alumnado de 12 a 20 años y sus familias.
- **FR-026**: La web DEBE verse y usarse bien en móviles modestos y con conexión lenta.
- **FR-027**: El contenido de salud generado con IA (textos e infografías) DEBE haberlo
  revisado una persona de la comisión antes de publicarse.

### Key Entities *(include if feature involves data)*

- **Curso**: el curso escolar (2026-2027) con sus 9 meses de reto, de octubre a junio.
- **Mes del curso**: un mes con su tema de salud. Puede tener el tema «por anunciar» y
  tener o no un reto publicado. Aparece en el calendario.
- **Reto del mes**: lo que la comisión propone para un mes: nombre (p. ej. «Resolver, no
  ganar»), objetivo, descripción, fuentes y sus tres retos.
- **Reto**: uno de los tres del mes. Tipo (motriz, tutoría o familia), nombre, semana o
  semanas, fechas concretas de esas semanas (opcionales), para quién es, en qué consiste y
  sus materiales. El reto motriz tiene además fecha, hora y lugar.
- **Material**: un documento descargable de un reto. Nombre, para quién es, formato,
  tamaño y, si es una infografía, su versión en texto.
- **Enlace externo**: el Genially «El Arbalquimista de la salud», con su nombre y destino.

Ninguna entidad contiene datos personales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En una prueba con al menos 5 personas (alumnado, familias y tutores/as), al
  menos 4 dicen, sin ayuda y en menos de 1 minuto, el tema del mes, qué reto toca cada
  semana y cuándo es el reto motriz.
- **SC-002**: Un tutor/a encuentra y descarga la guía del tutor/a de octubre en menos de
  1 minuto desde que entra en la web.
- **SC-003**: Una persona de la comisión sin conocimientos de programación publica un
  reto de prueba completo en menos de 30 minutos, solo con la guía de mantenimiento y
  sin tocar código.
- **SC-004**: El 100 % de las páginas de esta funcionalidad pasa la comprobación
  automática de accesibilidad sin errores, y se completa a mano todo el recorrido con
  teclado y con lector de pantalla.
- **SC-005**: La web carga 0 cookies y hace 0 peticiones a servicios de terceros hasta
  que la persona pulsa un enlace externo.
- **SC-006**: En un móvil modesto con conexión lenta, el tema y los tres retos del mes se
  pueden leer en menos de 3 segundos. Las condiciones de la prueba (tipo de móvil y de
  conexión) las fija el presupuesto de rendimiento del plan técnico (principio VI).
- **SC-007**: El 100 % de las infografías publicadas tiene su versión en texto.
- **SC-008**: Ningún dato desconocido aparece vacío o inventado: el 100 % se muestra como
  «por confirmar» o «por anunciar» (salvo las fechas opcionales de las semanas, FR-002).

## Assumptions

- La web es pública: cualquiera puede ver el reto, el calendario y los materiales sin
  identificarse. Solo publicar y cambiar contenidos está restringido a la comisión.
- La comisión da todos los textos, fechas, lugares, fuentes y materiales; esta
  especificación no inventa ninguno. Los materiales de octubre ya existen o los preparará
  la comisión.
- «Reto del mes en curso» es el que la comisión marca como actual, o ninguno si la
  comisión indica que no hay reto en curso; no hace falta que la web adivine el mes por la
  fecha.
- El reto de octubre se usa como ejemplo real aunque la web se estrene en enero de 2027;
  octubre ya habrá pasado cuando se publique.
- Los 9 temas del curso 2026-2027 están decididos (ver «Contexto»). El «por anunciar» se
  mantiene como caso general, para cursos futuros o si la comisión cambia un tema.
- Las fechas concretas de las semanas de cada reto las da la comisión si quiere; son
  opcionales y su ausencia no se marca como «por confirmar». «Semana» se refiere a semanas
  lectivas del mes.
- Las personas de la comisión que publican tienen acceso individual (sin cuentas
  compartidas), según la constitución (principio VIII).
- Ese acceso implica unas cuentas con datos mínimos del profesorado que publica. Es una
  excepción a «no recoger datos personales» que se decidirá y documentará en un ADR en la
  fase de plan (principio II).
- El Genially lo mantiene la comisión fuera de esta web; la web solo enlaza a él.
- Los materiales se publican en formatos habituales que se abren en cualquier móvil u
  ordenador sin instalar nada especial.
- Fuera de alcance: pasaporte, ranking por clases, insignias, avisos y envíos
  automáticos, panel de tutores, formularios, vídeos de personas de referencia, panel de
  novedades y cualquier recogida de datos personales.
