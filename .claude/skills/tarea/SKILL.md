---
name: tarea
description: Ejecuta de principio a fin una pareja de tareas de tasks.md (pruebas en rojo e implementación) y abre el PR sin integrarlo. Solo se lanza a mano con /tarea.
disable-model-invocation: true
argument-hint: "<funcionalidad> <tarea de pruebas> <tarea de implementación>, por ejemplo: 001 T007 T010"
---

# Ciclo completo de una tarea: $ARGUMENTS

Trabajas sin pararte, salvo en las PUERTAS del final. Lo demás lo decides tú y lo dejas escrito en el PR.

## 0. Preparar
- git switch main y git pull --ff-only. Si el árbol no está limpio: PUERTA.
- Lee AGENTS.md, .specify/memory/constitution.md, ESTADO.md (decisiones), las dos tareas en specs/<funcionalidad>-*/tasks.md y todo lo que citen (data-model.md, contratos, ADR, research.md).
- Crea la rama que indica el campo «Rama» de la tarea. Si ya existe con commits: PUERTA.

## 1. Interfaz
- Si la tarea de pruebas no fija la interfaz (módulo, firma, síncrona o asíncrona, forma exacta de lo que devuelve, mensajes, qué hace y qué deja a otros), redacta la enmienda de tasks.md con el subagente planificador. Debe ser coherente con los contratos, con data-model.md y con la regla «Lenguaje del dominio» de AGENTS.md.
- Commit propio: docs(tareas): fija la interfaz de ... en Txxx y Tyyy

## 2. Pruebas en rojo (subagente implementador)
- Escribe solo los ficheros de pruebas de la tarea. Cada caso que debe fallar rompe una sola cosa. Carpetas temporales con fs.mkdtemp y t.after. Rutas a partir de import.meta.url. Valores límite donde haya límites numéricos.
- Si una prueba depende de cómo es una fixture, compruébalo con un assert previo.
- Lo que la tarea no fija y no cambia lo que ve el usuario: decídelo y apúntalo para la sección DECIDIR del PR.
- Comprobación con doble vacío: crea módulos provisionales con la interfaz que no hacen nada y ejecuta las pruebas. Todo fallo debe ser AssertionError; si sale otro tipo de error, corrige la prueba. Borra los dobles y comprueba que las pruebas fallan por ERR_MODULE_NOT_FOUND.
- Sin U+00A0 ni U+202F (LC_ALL=C grep -nE $'\xc2\xa0|\xe2\x80\xaf').
- Commit: test(<ámbito>): ... en rojo

## 3. Implementación (subagente implementador)
- Implementa hasta que pasen todas las pruebas de node --test tests/unit/ y las comprobaciones de la sección «Comprobaciones» de AGENTS.md. No toques pruebas, fixtures, esquemas ni contratos.
- Commits: feat(<ámbito>): ... y, como último commit, docs(tareas): Txxx y Tyyy hechas (marca las dos con [x] en tasks.md, y solo eso).

## 4. PR
- git push -u origin <rama> y gh pr create contra main.
- Cuerpo del PR: «Qué hace»; «Comprobado en local» (órdenes y su salida resumida); «DECIDIR» (tabla: caso, elección, alternativa, por qué); «Notas para la fase 7».
- gh pr checks --watch hasta que termine «comprobar». NO integres el PR.
- Termina con la URL del PR, el resumen de las pruebas y la lista DECIDIR.

## PUERTAS: para, explica el caso concreto y espera
- Habría que cambiar spec.md, plan.md, data-model.md, contratos, esquemas, ADR, la constitución o AGENTS.md.
- Hace falta una dependencia nueva o cambiar una versión.
- Una prueba que no es de esta tarea parece incorrecta.
- Las comprobaciones siguen en rojo después de tres intentos.
- La tarea es [MANUAL] o [BLOQUEADA], o depende de una tarea sin hacer.
- Una decisión que cambia lo que ve o lee el usuario (textos visibles, accesibilidad, privacidad) y no está en la especificación.
- Cualquier operación sobre main distinta de pull. Y nunca, en ninguna rama: push --force, borrar ramas remotas ni integrar un PR.
