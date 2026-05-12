---
title: Herramientas MCP
description: Referencia completa de todas las herramientas MCP de Pillbox expuestas a los agentes IA.
sidebar:
  order: 31
---

Todas las herramientas MCP son servidas por el servidor MCP de Pillbox y consumidas por agentes IA (Claude, Cursor, etc.). Las respuestas son texto estructurado plano — no JSON — para que el LLM pueda leerlas directamente sin parsear.

Las respuestas exitosas son texto específico de cada herramienta (ver cada herramienta más abajo). Los errores siguen un formato uniforme:

```
error: <código>
message: <descripción legible por humanos>
<campo>: <valor>     ← campos adicionales cuando son relevantes
```

Las pills y prescriptions pertenecen a un **bottle** (base de datos local del proyecto). Las capsules se almacenan en la **base de datos global** (`~/.pillbox/pillbox.db`).

---

## Herramientas de pills

Las pills son entradas de memoria estructuradas vinculadas a una prescription (sesión de trabajo) dentro de un bottle.

### `pill_store`

Crea una nueva pill.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `prescription_id` | string (UUID v7) | sí | Prescription abierta a la que adjuntar esta pill |
| `title` | string (1–255) | sí | Título descriptivo corto |
| `content` | string (1–5000) | sí | Contenido completo de la pill |
| `compound` | string | sí | Categoría — texto libre |
| `author_name` | string | no | Nombre del autor — ver [identidad del autor](/es/guides/author-identity/) |
| `author_email` | string | no | Email del autor — ver [identidad del autor](/es/guides/author-identity/) |

```
Pill created
id: 42
```

### `pill_read`

Recupera una pill por ID entero.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la pill |

```
# Título [compound]
id: 42 | prescription: 019d... | created: 2026-04-22

Contenido completo de la pill...
```

Devuelve un error `not_found` si la pill no existe.

### `pill_revise`

Actualiza el título, contenido o compound de una pill.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la pill |
| `title` | string (1–255) | no | Nuevo título |
| `content` | string (1–5000) | no | Nuevo contenido |
| `compound` | string | no | Nuevo compound |

```
Pill updated
id: 42
compound: decision
title: Título actualizado
```

### `pill_discard`

Elimina suavemente una pill (el registro se marca como eliminado, no se borra).

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la pill |

```
Pill discarded
id: 42
deleted_at: 2026-04-22 21:00:00
```

### `pill_search`

Búsqueda de texto completo sobre pills usando coincidencia por prefijo FTS5 y puntuación difusa Jaro-Winkler.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `query` | string | sí | Consulta de búsqueda |
| `bottle_id` | string (UUID v7) | no | Restringir a un bottle específico |
| `compound` | string | no | Filtrar por tipo de compound |
| `limit` | integer | no | Máximo de resultados (por defecto: 20) |

```
Found 3 pills

[decision] Título del resultado (id: 5, rx: 019db730...)
Fragmento con el ...texto... coincidente resaltado

[bugfix] Otro resultado (id: 8, rx: 019db730...)
Fragmento con el ...texto... coincidente resaltado
```

Devuelve `No pills found.` cuando la consulta no coincide con nada.

---

## Herramientas de capsules

Las capsules son entradas de memoria global — convenciones, flujos de trabajo y contexto de entorno compartidos entre todos los proyectos.

### `capsule_store`

Crea una nueva capsule en la base de datos global.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `title` | string (1–255) | sí | Título descriptivo corto |
| `content` | string (1–5000) | sí | Contenido completo de la capsule |
| `compound` | string | sí | Categoría — texto libre |

```
Capsule created
id: 7
```

### `capsule_read`

Recupera una capsule por ID entero.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la capsule |

```
# Título [convention]
id: 7 | created: 2026-04-22

Contenido completo de la capsule...
```

Devuelve un error `not_found` si la capsule no existe.

### `capsule_revise`

Actualiza el título o contenido de una capsule.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la capsule |
| `title` | string (1–255) | no | Nuevo título |
| `content` | string (1–5000) | no | Nuevo contenido |

```
Capsule updated
id: 7
compound: convention
title: Título actualizado
```

### `capsule_discard`

Elimina suavemente una capsule.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la capsule |

```
Capsule discarded
id: 7
deleted_at: 2026-04-22 21:00:00
```

### `capsule_search`

Búsqueda de texto completo sobre capsules.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `query` | string | sí | Consulta de búsqueda |
| `compound` | string | no | Filtrar por tipo de compound |
| `limit` | integer | no | Máximo de resultados (por defecto: 20) |

```
Found 2 capsules

[convention] Título (id: 3)
Fragmento con el ...texto... coincidente resaltado

[feedback] Otro título (id: 7)
Fragmento con el ...texto... coincidente resaltado
```

Devuelve `No capsules found.` cuando la consulta no coincide con nada.

---

## Herramientas de prescriptions

Una **prescription** es una sesión de trabajo abierta dentro de un bottle. Las pills deben estar vinculadas a una prescription. Solo puede haber una prescription abierta por bottle a la vez.

### `prescription_open`

Abre una nueva prescription para un bottle.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | sí | Bottle en el que abrir la prescription |
| `title` | string (1–255) | sí | Título descriptivo para la sesión |
| `author_name` | string | no | Nombre del autor — ver [identidad del autor](/es/guides/author-identity/) |
| `author_email` | string | no | Email del autor — ver [identidad del autor](/es/guides/author-identity/) |

```
Prescription opened
id: 019db730
title: Refactor auth middleware
started_at: 2026-04-22 21:54:47
```

Devuelve un error `prescription_already_open` si el bottle ya tiene una prescription abierta. El error incluye el `id`, `title`, `started_at` y `pill_count` de la prescription existente — usa ese `id` directamente en lugar de abrir uno nuevo.

### `prescription_close`

Cierra una prescription abierta (establece `ended_at`).

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string (UUID v7) | sí | ID de la prescription |

```
Prescription closed
id: 019db730
title: Refactor auth middleware
started_at: 2026-04-22 21:54:47
ended_at: 2026-04-22 23:10:00
```

### `prescription_read`

Recupera una prescription por ID.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string (UUID v7) | sí | ID de la prescription |

```
id: 019db730
title: Refactor auth middleware
started_at: 2026-04-22 21:54:47
ended_at: 2026-04-22 23:10:00
```

Devuelve un error `not_found` si la prescription no existe.

### `prescription_context`

Pills de una prescription concreta con id, compound, título y snippet de 300 chars. Los saltos de línea del contenido se muestran como `\n` para mantener cada pill en una sola línea visual. Usar tras `bottle_context` para profundizar en una sesión de trabajo. Para el contenido completo de una pill individual, usar `pill_read`.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `prescription_id` | string (UUID v7) | sí | Prescription a inspeccionar |
| `limit` | integer | no | Máx. pills a devolver (por defecto: 30) |

```
[closed] Implementar auth JWT
id: 019df503  started: 2026-05-03 → 2026-05-03

  #42 [decision] Usar JWT stateless con refresh tokens
  chosen: JWT stateless\nrefresh guardado en SQLite\nwhy: evita estado de sesión en servidor…

  #41 [bugfix] Race condition en dedup
  BEGIN IMMEDIATE previene race conditions en escrituras concurrentes

---
pills: 2
```

Devuelve una respuesta vacía si la prescription no existe.

### `prescription_discard`

Elimina suavemente una prescription y todas sus pills en cascada.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string (UUID v7) | sí | ID de la prescription |

```
Prescription discarded.
```

---

## Herramientas de bottles

Un **bottle** representa un proyecto — contiene una base de datos SQLite local con todas las prescriptions y pills de ese proyecto.

### `bottle_create`

Registra un nuevo bottle.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | string (1–255) | sí | Slug (normalmente el nombre de la carpeta) |
| `display_name` | string (1–255) | sí | Nombre legible por humanos |
| `directory` | string | sí | Ruta absoluta al directorio del proyecto |
| `scope` | `local` \| `global` | sí | Si usar base de datos local o global |

```
Bottle created
id: 019db257
name: mi-proyecto
display_name: Mi Proyecto
directory: /home/usuario/mi-proyecto
scope: local
```

### `bottle_context`

Índice navegable de las prescriptions de un bottle: id, título, estado, fechas y pill_count. Usar al inicio de sesión para descubrir qué sesiones de trabajo existen. Para ver las pills de una prescription concreta, usar `prescription_context` con su id.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | sí | Bottle a indexar |
| `limit` | integer | no | Máx. prescriptions a devolver (por defecto: 30) |

```
[open]  2026-05-04  12 pills  Implementar auth JWT
id: 019df503

[closed] 2026-05-01 → 2026-05-01  3 pills  Fix triggers FTS5
id: 019de307

---
prescriptions: 2
```

### `bottle_list`

Lista todos los bottles registrados. Sin parámetros.

```
Bottles (2)

● Mi Proyecto [local] 019db257
  /home/usuario/mi-proyecto

○ Proyecto Antiguo [global] 019da000 [unlinked]
  /home/usuario/proyecto-antiguo
```

`●` significa que la base de datos del bottle es accesible. `○` con `[unlinked]` significa que el archivo de base de datos ya no existe en disco.

### `bottle_vinculate`

Registra una base de datos de bottle local existente en el registro global del usuario que realiza la llamada. Usar cuando un segundo usuario del sistema operativo necesita acceder a un bottle creado por otro usuario en la misma máquina.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `directory` | string | no | Ruta absoluta al directorio que contiene `.pillbox/pillbox.db`. Por defecto, el cwd del proceso pillbox. |

Devuelve `status: "linked"` si tiene éxito o `status: "already_linked"` si el bottle ya estaba registrado. Ambos son condiciones de exit-0.

```json
{ "status": "linked", "name": "mi-proyecto", "slug": "mi-proyecto", "db_path": "/home/bob/mi-proyecto/.pillbox/pillbox.db" }
```

Códigos de error específicos de esta herramienta: `db_not_found`, `circular_link`, `no_bottle_in_db`.

---

## Códigos de error

| Código | Significado |
|---|---|
| `not_found` | El recurso solicitado no existe |
| `prescription_already_open` | Ya hay una prescription abierta para este bottle |
| `prescription_required` | El `prescription_id` proporcionado no existe o ya está cerrado |
| `validation_error` | Uno o más campos de entrada fallaron la validación |
| `invalid_input` | El input no pudo ser parseado |
| `internal_error` | Error inesperado del servidor |
