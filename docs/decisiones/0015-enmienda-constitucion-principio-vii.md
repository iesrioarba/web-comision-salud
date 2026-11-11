# 0015 · Enmienda 1.0.1 de la constitución: alcance de la revisión independiente (principio VII)

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
El principio VII decía: «NO DEBE publicarse nada sin revisión independiente de alguien
que no escribió el código». Con el panel de edición (ADR 0005), la comisión publica
contenido con un commit directo en `main`, sin pull request ni revisión de código.
La «Constitution Check» del plan de 001-reto-octubre lo señaló y pidió confirmar cómo
se interpreta el principio en ese caso.

## Decisión
- Enmienda PARCHE de la constitución, de 1.0.0 a 1.0.1, sin cambiar el sentido del principio.
- La revisión independiente se aplica al código.
- El contenido que la comisión publica desde el panel lo garantizan:
  - la revisión de la comisión (principio IV);
  - las comprobaciones automáticas de «comprobar», que bloquean el despliegue si fallan.

## Consecuencias
- El plan de 001-reto-octubre cumple el principio VII sin condiciones.
- «comprobar» pasa a ser la única barrera automática del contenido: si se debilita,
  se debilita también esta garantía.
- Es un PARCHE porque la regla ya hablaba de quien escribe el código; la enmienda solo
  hace explícito cómo se cubre el contenido.
