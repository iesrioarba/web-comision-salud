# Contrato: páginas públicas de la web

Qué URL existe, qué muestra y en qué orden. **No fija el diseño visual** (colores,
tipografía, disposición): eso se decide después con la skill `frontend-design`, dentro
del presupuesto del ADR 0013. Lo que sí fija es estructura, textos fijos y
accesibilidad, que las pruebas comprueban.

## Reglas comunes a todas las páginas

- `<html lang="es">`, `<meta charset="utf-8">`, `viewport`, `<title>` único con la forma
  «<Página> · Comisión de Salud · IES Río Arba».
- Puntos de referencia: `header`, `nav` (con nombre accesible), `main` (uno), `footer`.
  Enlace «Saltar al contenido» como primer elemento enfocable.
- Encabezados sin saltos de nivel; un solo `h1`.
- Sin cookies, sin peticiones a otros dominios, sin fuentes externas, sin iframes
  (FR-022, FR-024, SC-005). Cabecera CSP `default-src 'self'` (ADR 0007).
- Sin JavaScript necesario para leer o navegar.
- Estilos de impresión: se imprime el contenido; se ocultan navegación y pie (caso
  límite «Impresión»).
- La situación de un reto («Reto en curso» / «No es el reto en curso») se dice siempre con
  texto, no solo con color (FR-019, FR-028).
- Datos vacíos: «Por confirmar» como texto visible (FR-004); nunca un hueco.
- Enlaces externos (fuentes con URL y Genially): el texto visible incluye «(sitio
  externo)»; se abren en la misma pestaña (no `target="_blank"`), así no hace falta
  avisar de una ventana nueva. Ver decisión a confirmar en el plan.

## Rutas

| URL | Qué es | Cuándo existe |
|---|---|---|
| `/` | Inicio | Siempre |
| `/retos/<curso>/<mes>/` | Página de un reto del mes (p. ej. `/retos/2026-2027/octubre/`) | Si el reto está `publicado` |
| `/calendario/` | Calendario del curso | Siempre |
| `/materiales/…` | Ficheros descargables | Si el material tiene `archivo` |
| `/404.html` | Página no encontrada, en español, con enlace al inicio | Siempre |

Los borradores no generan ninguna URL ni enlace (ADR 0011).

## `/` · Inicio

**Si hay reto en curso** (`en_curso` con valor), en este orden:
1. `h1`: «Reto del mes: <mes> · <tema>».
2. El bloque **Reto del mes** completo (abajo), igual que en su página.
3. Enlace «Ver el calendario del curso» a `/calendario/`.
4. Enlace al Genially (abajo).

**Si no hay reto en curso** (FR-029):
1. `h1`: «Próximo reto».
2. Texto: «Próximo reto: <mes> · <tema>» o, si falta el tema, «<mes> · Por anunciar»;
   si falta `proximo_mes`, «El próximo reto está por anunciar».
3. Enlace «Ver el último reto publicado: <mes> · <nombre>» si hay alguno publicado.
4. El calendario completo (mismo bloque que `/calendario/`).
5. Enlace al Genially.

## Bloque «Reto del mes» (en `/` y en `/retos/<curso>/<mes>/`)

En este orden (US1, escenario 5: orden lógico con teclado y lector de pantalla):
1. Situación: «Reto en curso» o «Reto de <mes> de <año>. No es el reto en curso.»
2. Mes y tema; nombre del reto («Resolver, no ganar»).
3. «Objetivo» y su texto. Descripción (párrafos).
4. Pasos, si hay: lista **ordenada** (`ol`) con el texto exacto (FR-006).
5. Los tres retos, cada uno como sección con su encabezado y en este orden:
   - **Reto motriz** · «1.ª semana» (+ fechas si las hay) · Para quién: «Todo el centro»
     · «En el recreo» · «Lo ha diseñado alumnado de 2.º de Bachillerato» · Nombre ·
     Fecha · Hora · Lugar · En qué consiste · Materiales.
   - **Reto de tutoría** · «2.ª y 3.ª semanas» · Para quién: «Cada grupo con su tutor/a»
     · Nombre · En qué consiste · aviso de adaptación por etapas si procede (FR-030) ·
     Materiales.
   - **Reto en familia** · «Última semana» · Para quién: «El alumnado con su familia, en
     casa» · Nombre · En qué consiste · Materiales.
   Los datos de cada reto se presentan como lista de definiciones (`dl`) o equivalente
   semántico, para que el lector de pantalla asocie etiqueta y valor.
6. Fuentes: lista con título y, si hay, enlace externo.

## Material (dentro de cada reto)

Cada material es un elemento de lista con:
- Si tiene `archivo`: enlace cuyo texto incluye título, formato y tamaño, p. ej.
  «Guía del tutor/a (PDF, 850 KB)» (enlace normal: el navegador lo abre y desde ahí se
  guarda o se imprime); y, aparte, «Para: Tutor/a».
- Si no lo tiene: título + «Disponible próximamente», sin enlace.
- Si es `ficha` o `justificante`: «Se entrega en papel o por la plataforma educativa, no a
  través de esta web» (FR-011).
- Si es `infografia`: debajo, la sección «Texto de la infografía» con `version_texto`
  completo y en el mismo orden (FR-010). Está en el HTML, no detrás de un botón con JS.

## `/calendario/`

- `h1`: «Calendario del curso <curso>».
- Lista **ordenada** de 9 elementos, de octubre a junio (FR-018). Cada uno: mes y tema
  (o «Por anunciar»).
- El mes en curso lleva el texto «Reto en curso» y `aria-current="true"` (FR-019).
- Cada mes con reto publicado enlaza a su página; los demás no son enlaces.

## Enlace al Genially

- Texto visible: «<nombre> (sitio externo)», p. ej. «El Arbalquimista de la salud (sitio
  externo)» (FR-021).
- Enlace normal `<a href>`: nada se carga del proveedor hasta pulsarlo (FR-022).

## Comprobación

Escenarios automáticos en `tests/e2e/` y manuales en [quickstart.md](../quickstart.md).
