# 0010 · Datos personales de quienes editan

- Fecha: 2026-11-11
- Estado: aceptada

## Contexto
La especificación (`specs/001-reto-octubre/spec.md`, «Assumptions») prevé que el acceso
individual de la comisión implica datos mínimos del profesorado que publica, y pide
decidirlo en un ADR en la fase de plan (principio II). Con Pages CMS (ADR 0005), cada
persona colaboradora se guarda en la base de datos del panel, no en `.pages.yml`
(<https://pagescms.org/docs/configuration/collaborators/>).

## Decisión
- Datos que se tratan: el **correo** de cada persona editora (preferiblemente su correo
  institucional) y los datos técnicos de su sesión en el panel. Nada más: ni nombre
  completo obligatorio, ni teléfono, ni datos del alumnado, ni datos de salud.
- Dónde: solo en la base de datos PostgreSQL del panel, en el VPS del centro.
  El VPS es de Hostinger. HUECO: confirmar en hPanel que su centro de datos está en la
  UE (pregunta abierta en ESTADO.md).
- Para qué: invitar, identificar y dar permiso de edición. No se usan para otra cosa.
- Historial público: los commits los firma la GitHub App (`commit.identity: app`) y las
  plantillas de mensaje de commit de `.pages.yml` NO DEBEN usar `{userName}` ni
  `{userEmail}` (<https://pagescms.org/docs/configuration/settings/>). Así ningún dato
  de quien edita aparece en el repositorio público.
- Conservación: cuando una persona deja la comisión, se le retira el acceso y se borra
  como colaboradora en el panel. La guía de mantenimiento lo explica.
- La web pública no recoge ningún dato de los visitantes (FR-024): este ADR solo cubre
  el panel.

## Alternativas consideradas
| Opción | Coste | Riesgo |
|---|---|---|
| **Correo individual en el panel del centro** (elegida) | Mínimo dato posible para un acceso individual | Hay que dar de baja a quien se va |
| Una cuenta compartida de la comisión | Ningún dato individual | Prohibido por el principio VIII y por ESTADO.md («sin cuentas compartidas»); no hay trazabilidad |
| Cuentas de GitHub individuales | Sin base de datos propia | Exige cuenta en un tercero a cada docente; descartado en el ADR 0005 |

## Consecuencias
- La base legal y la información a las personas editoras deben revisarse con quien el
  centro designe. HUECO: Michel decide si se consulta al DPD (ESTADO.md solo lo exige
  para datos del alumnado).
- La información de privacidad de la web debe mencionar este tratamiento si se publica
  una página de privacidad. HUECO: esa página no está en la especificación 001.
