# 0001 · Repositorio y despliegue

- Fecha: 2026-11-05
- Estado: aceptada

## Contexto
La web debe sobrevivir a la marcha de quien la programa. Otros profesores del centro
quieren usar GitHub para sus propios proyectos. Se aloja en una VPS con Easypanel.

## Decisión
- Un único repositorio público, `web-comision-salud`, en la organización GitHub
  `iesrioarba`. Sin copias: es la única fuente de verdad. Se fija en el perfil
  personal del desarrollador.
- La organización es del IES Río Arba (GitHub Customer Agreement, firmado con
  autorización escrita de la dirección). La administran cuentas personales, con un
  mínimo de dos propietarios. Nunca se comparten inicios de sesión; el buzón
  webmaster solo es el correo de contacto.
- Un equipo por proyecto (`comision-salud` con rol Write en este repositorio),
  permisos base «No permission» y solo los propietarios crean repositorios.
- Despliegue: GitHub Actions valida y, si pasa, llama al «Deployment Trigger» de
  Easypanel. El Auto Deploy de Easypanel queda desactivado.
- El hola mundo (HTML estático con nginx) es provisional y no condiciona la
  tecnología, que se decide en la fase 4.

## Consecuencias
- Todo lo que se sube es público: nunca datos personales ni secretos.
- Nunca se despliega código que no pase las comprobaciones.
- El relevo del webmaster se hace añadiendo a la persona nueva como propietaria y
  quitando a la anterior, sin pasar contraseñas.
