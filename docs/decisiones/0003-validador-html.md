# 0003 · Validador de HTML

- Fecha: 2026-11-06
- Estado: aceptada

## Contexto
AGENTS.md exige validar el HTML y no admite dependencias nuevas sin justificarlas.
La validación debe poder ejecutarse en local y en la integración continua, sin
enviar ficheros a servicios externos.

## Decisión
- `html-validate` 11 como dependencia de desarrollo.
- La versión exacta queda fijada en `package-lock.json`.
- Se ejecuta con `npm run validar`, tanto en local como en GitHub Actions.
- No se publica en la web: solo se usa para comprobar el código.
- Alternativa descartada: el validador web del W3C, porque envía los ficheros a un
  servidor externo y depende de la red en la integración continua.

## Consecuencias
- La validación es reproducible: la misma versión en local y en Actions.
- Actualizar el validador es una decisión consciente: se cambia el lockfile en un commit.
- Añade una dependencia de desarrollo que hay que mantener al día.
