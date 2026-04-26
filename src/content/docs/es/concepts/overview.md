---
title: Visión general
description: Las cuatro entidades que conforman el modelo de datos de Pillbox — bottles, prescriptions, pills y capsules.
sidebar:
  order: 10
---

Pillbox organiza el conocimiento en torno a cuatro entidades: **bottles**, **prescriptions**, **pills** y **capsules**. Entender cómo se relacionan entre sí es la base para usar Pillbox de forma efectiva.

## Bottles

Un **bottle** representa un proyecto. Mapea un directorio en disco a una base de datos de Pillbox.

- `name` — slug seguro para URLs, generado automáticamente desde el nombre del directorio. Inmutable.
- `display_name` — nombre legible por humanos, elegido durante `pillbox bottle init`.
- `scope` — `local` o `global` (ver más abajo).

El **scope** determina en qué base de datos vive el bottle:

- `local` — `.pillbox/pillbox.db` dentro del directorio del proyecto. Ideal para trabajo específico del proyecto que no debe mezclarse con otros.
- `global` — `~/.pillbox/pillbox.db`. Ideal para proyectos donde quieres que todo el conocimiento sea accesible en un solo lugar, o para compartir entre máquinas.

## Prescriptions

Una **prescription** es una sesión de trabajo dentro de un bottle. Tiene un título que describe en qué está trabajando el agente.

Reglas:
- Solo puede haber una prescription abierta por bottle a la vez.
- El título debe establecerse al abrir — describe la tarea antes de comenzar.
- No se pueden guardar pills sin una prescription abierta.
- Cerrar una prescription la marca como finalizada; las pills se preservan.
- Descartar una prescription la elimina de forma suave junto con todas sus pills en una transacción.

## Pills

Una **pill** es un fragmento de conocimiento específico del proyecto guardado dentro de una prescription.

El campo `compound` clasifica el tipo de conocimiento:

| Compound | Usar para |
|---|---|
| `decision` | Decisiones de arquitectura, diseño o enfoque con justificación |
| `architecture` | Estructura del sistema, organización de módulos, flujo de datos |
| `bugfix` | Descripción del bug, causa raíz y solución |
| `pattern` | Patrones o convenciones reutilizables encontrados en este proyecto |
| `discovery` | Hallazgos no obvios sobre el código, dependencias o entorno |
| `learning` | Algo que falló y lo que se aprendió de ello |
| `feedback` | Retroalimentación sobre el comportamiento o enfoque del agente |
| `prescription_summary` | Resumen de fin de sesión (uno por prescription, guardado al cerrar) |
| `manual` | Cualquier cosa que no encaje en lo anterior |

Las pills son buscables mediante búsqueda de texto completo FTS5 en título y contenido. El motor de búsqueda soporta coincidencia por prefijo (`hex` encuentra `hexagonal`) y matching difuso usando la similitud de Jaro-Winkler.

## Capsules

Una **capsule** es conocimiento personal entre proyectos. Pertenece al usuario, no a ningún proyecto — no tiene `bottle_id`.

| Compound | Usar para |
|---|---|
| `convention` | Estilo de código, nomenclatura, preferencias de formato |
| `workflow` | Cómo te gusta trabajar: proceso de PRs, estilo de revisión, desglose de tareas |
| `environment` | Configuración de máquina, herramientas instaladas, configuración de shell |
| `context` | Contexto personal: rol actual, área de enfoque, limitaciones |
| `goal` | Objetivos a largo plazo, prioridades o metas |
| `feedback` | Retroalimentación sobre el comportamiento del agente que debe persistir entre todos los proyectos |
| `manual` | Cualquier otra cosa |

## Cómo encajan

```
Usuario
└── Capsules (conocimiento personal global)

Directorio del proyecto
└── Bottle (name, display_name, scope, directory)
    └── Prescriptions (sesiones de trabajo)
        └── Pills (conocimiento guardado durante la sesión)
```

**Flujo de trabajo típico del agente:**

1. **Inicio de sesión** — llama a `pill_context` para recuperar prescriptions y pills recientes. Llama a `capsule_search` con términos relevantes para cargar convenciones personales.
2. **Durante el trabajo** — llama a `pill_take` para guardar decisiones, bugs resueltos, descubrimientos.
3. **Fin de sesión** — llama a `pill_take` con `compound: prescription_summary` para resumir la sesión, luego `prescription_close`.

## Eliminaciones suaves

Todas las entidades usan eliminaciones suaves. Nada se elimina permanentemente de la base de datos — los elementos descartados permanecen con `deleted_at` establecido y se excluyen de todas las consultas por defecto.
