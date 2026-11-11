# 0009 · Correo del panel: SMTP del centro

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
Pages CMS envía por correo las invitaciones y los enlaces de acceso de las personas
colaboradoras. Admite dos proveedores: `resend` o `smtp` (`EMAIL_PROVIDER`, `EMAIL_FROM`,
`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`;
<https://pagescms.org/docs/development/environment-variables/>, consultado el 2026-11-11).
El principio II y AGENTS.md prohíben servicios de terceros sin ADR; el correo de quien
edita es un dato personal (ADR 0010).

## Decisión
- `EMAIL_PROVIDER=smtp` con un **servidor SMTP del centro** (o de la administración
  educativa que el centro ya use), y un remitente del centro en `EMAIL_FROM`.
- Las credenciales SMTP solo en variables de entorno del servicio en Easypanel; nunca en
  el repositorio ni en los registros.
- El correo del centro es Google Workspace. Opción preferida: una cuenta del centro
  dedicada solo a enviar, con `smtp.gmail.com` (587 con STARTTLS o 465 con SSL) y una
  contraseña de aplicación. Si el centro no permite contraseñas de aplicación, se usa el
  SMTP relay de Workspace (`smtp-relay.gmail.com`)
  (<https://knowledge.workspace.google.com/admin/gmail/send-email-from-a-printer-scanner-or-app?hl=es>,
  consultado el 2026-11-11).
- El SMTP relay autorizado por IP no sirve para los avisos que se envían desde GitHub
  Actions (ADR 0012), porque sus ejecutores no tienen IP fija. Por eso la opción elegida
  es la cuenta del centro con contraseña de aplicación.
- Mientras no exista esa cuenta, el panel no se pone en marcha para la comisión.
  HUECO: crear la cuenta remitente y decidir quién la administra (centro).

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **SMTP del centro** (elegida) | Sin coste ni contrato nuevo; los correos no salen a un tercero distinto del que el centro ya usa | Depende de que el centro tenga una cuenta que permita SMTP autenticado; puede pedir contraseña de aplicación |
| Resend (soportado por Pages CMS) | Fácil de configurar | Tercero nuevo que trata correos del profesorado; requiere contrato de encargo y su propio ADR; cuenta a nombre de alguien |
| Sin correo: el administrador da de alta y pasa el enlace a mano | Ningún proveedor | No está documentado que Pages CMS lo permita sin correo; frágil y dependiente de una persona |

## Consecuencias
- Si el SMTP del centro exige una cuenta personal, se incumpliría el principio VIII: la
  cuenta remitente DEBE ser un buzón del centro, no de una persona.
- El mismo SMTP sirve para los avisos de fallo (ADR 0012).
- Riesgo: si el centro no permite contraseñas de aplicación, los avisos desde Actions no
  podrán salir por el relay. En ese caso, los fallos de contenido se avisan como los de
  código, a quien mantiene la web, que avisa a la comisión, y se revisan este ADR y el 0012.
