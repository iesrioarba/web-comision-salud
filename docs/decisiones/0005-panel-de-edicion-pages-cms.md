# 0005 · Panel de edición: Pages CMS autoalojado

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
El principio V exige que el profesorado actualice los contenidos sin tocar código y sin
poder romper el diseño (FR-012 a FR-015 de `specs/001-reto-octubre/spec.md`). Quien publica
es profesorado de la comisión sin conocimientos de programación y, en general, sin cuenta
de GitHub. La web pública ya es estática y la sirve nginx en el VPS del centro con
Easypanel (ADR 0001). El principio VIII exige que nada dependa de una cuenta personal.

## Decisión
1. La web pública sigue siendo estática: se genera en la compilación y la sirve nginx en
   el VPS del centro, como el esqueleto actual.
2. El panel de edición es **Pages CMS 2.1.8** (última versión marcada «Latest» en
   <https://github.com/pages-cms/pages-cms/releases>, consultada el 2026-11-11),
   autoalojado en el VPS con Easypanel, con PostgreSQL solo para el estado del panel
   (colaboradores, sesiones y caché). Se instala por etiqueta de versión, no por rama.
3. La GitHub App pertenece a la organización `iesrioarba` y se instala solo en este
   repositorio. Sus claves (`GITHUB_APP_*`, `BETTER_AUTH_SECRET`, `CRYPTO_KEY`,
   `DATABASE_URL`, `SMTP_*`) viven solo en las variables de entorno del servicio en
   Easypanel, nunca en el repositorio.
4. Las personas de la comisión entran como **colaboradoras invitadas por correo**, sin
   cuenta de GitHub. Según la documentación, no pueden editar `.pages.yml` ni gestionar
   colaboradores (<https://pagescms.org/docs/configuration/collaborators/>).
5. La configuración del panel está en `.pages.yml`, en la raíz del repositorio.
6. El contenido son ficheros del repositorio. Cada publicación es un commit en `main`
   hecho por la GitHub App, que pasa por el trabajo «comprobar» antes de «desplegar».
   Los commits los firma la app (`commit.identity: app`, el valor por defecto), así que
   el nombre y el correo de quien edita no quedan en el historial público
   (<https://pagescms.org/docs/configuration/settings/>).
7. Plan de salida: si nadie puede mantener el panel autoalojado, se pasa a la versión
   alojada de Pages CMS con el mismo `.pages.yml`. La web pública no depende del panel:
   si el panel cae, la web sigue funcionando y se puede publicar con un commit normal.

## Alternativas consideradas
- **Payload CMS**: panel completo y potente, pero añade una aplicación con base de datos
  como fuente del contenido; la web dejaría de ser solo ficheros del repositorio y el
  mantenimiento (actualizaciones mayores, copias de seguridad del contenido) recae en
  alguien técnico. Descartada por mantenimiento y continuidad.
- **WordPress**: conocido por el profesorado, pero es una aplicación dinámica expuesta a
  internet con PHP, base de datos y complementos que actualizar; superficie de ataque y
  peso altos para una web de pocos contenidos. Va contra el principio VI.
- **Panel propio**: control total, pero hay que programarlo, asegurarlo y mantenerlo;
  incompatible con el plazo (finales de diciembre de 2026) y con la continuidad.
- **Directus**: igual que Payload, el contenido viviría en una base de datos y no en el
  repositorio; más piezas que mantener.
- **Decap CMS / Sveltia CMS**: también guardan en el repositorio, pero con el backend de
  GitHub las personas editoras necesitan cuenta de GitHub (o un token personal), y
  hace falta un intermediario OAuth. Choca con «sin cuenta de GitHub» y con el
  principio VIII. No se ha vuelto a comprobar su documentación en esta fase.

## Consecuencias y riesgos
- El contenido queda versionado en Git: cada cambio se puede ver y deshacer.
- Hay una pieza más en el VPS (Pages CMS + PostgreSQL) que actualizar. Las notas de
  2.1.x piden migraciones de base de datos al actualizar (`npm run db:migrate`).
  Actualizar es una decisión consciente con su ADR.
- El panel trata datos personales mínimos de quien edita (correo y sesión): se regula
  en el ADR 0010.
- El panel necesita un dominio propio con HTTPS (`BASE_URL`, retrollamada y webhook de la
  GitHub App deben apuntar a la misma URL). HUECO: dominio.
- Los avisos de invitación y acceso se envían por correo: ver ADR 0009.
- **Protección de `main`**: ESTADO.md prevé exigir pull request en la fase 6. La GitHub
  App de Pages CMS escribe directamente en `main`, así que la regla deberá incluirla en
  la lista de excepciones (bypass) del ruleset, cosa que GitHub permite
  (<https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository>).
  Confirmado por Michel (research R11).
- **Controles sobre la GitHub App** (porque escribe en `main` sin pull request):
  - La app NO DEBE tener el permiso «Workflows». Se comprueba al crearla en la fase 6.
  - «comprobar» DEBE fallar si un commit hecho por la app modifica algo fuera de
    `content/` y `.pages.yml`.
- **Versión alojada como salida**: guardaría los correos de las personas editoras en
  un servicio de terceros. Antes de usarla hace falta un ADR nuevo (principio II).
- Copias de seguridad: el contenido está en GitHub; la base de datos del panel solo
  guarda estado reconstruible (se vuelve a invitar a las personas colaboradoras).
