---
title: Herramientas MCP
description: Referencia completa de todas las herramientas MCP de Pillbox expuestas a los agentes IA.
sidebar:
  order: 31
---

Todas las herramientas MCP son servidas por el servidor MCP de Pillbox y consumidas por agentes IA (Claude, Cursor, etc.). Las respuestas son texto estructurado plano — no JSON — para que el LLM pueda leerlas directamente sin parsear.

Los errores siguen un formato uniforme: `error: <código>`, `message: <descripción>`, más campos adicionales cuando son relevantes.

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

Devuelve el `id` de la nueva pill.

### `pill_read`

Recupera una pill por ID entero.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la pill |

Devuelve `id`, `prescription`, `created`, `compound`, `title` y `content` completo. Devuelve un error `not_found` si la pill no existe.

### `pill_revise`

Actualiza el título, contenido o compound de una pill.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la pill |
| `title` | string (1–255) | no | Nuevo título |
| `content` | string (1–5000) | no | Nuevo contenido |
| `compound` | string | no | Nuevo compound |

Devuelve `id`, `compound` y `title` actualizado.

### `pill_discard`

Elimina suavemente una pill (el registro se marca como eliminado, no se borra).

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la pill |

Devuelve `id` y timestamp `deleted_at`.

### `pill_search`

Búsqueda de texto completo sobre pills usando coincidencia por prefijo FTS5 y puntuación difusa Jaro-Winkler.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `query` | string | sí | Consulta de búsqueda |
| `bottle_id` | string (UUID v7) | no | Restringir a un bottle específico |
| `compound` | string | no | Filtrar por tipo de compound |
| `limit` | integer | no | Máximo de resultados (por defecto: 20) |

Devuelve las pills encontradas con `id`, `compound`, `title` y un snippet del contenido. Devuelve `No pills found.` cuando la consulta no coincide con nada.

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

Devuelve el `id` de la nueva capsule.

### `capsule_read`

Recupera una capsule por ID entero.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la capsule |

Devuelve `id`, `created`, `compound`, `title` y `content` completo. Devuelve un error `not_found` si la capsule no existe.

### `capsule_revise`

Actualiza el título o contenido de una capsule.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la capsule |
| `title` | string (1–255) | no | Nuevo título |
| `content` | string (1–5000) | no | Nuevo contenido |

Devuelve `id`, `compound` y `title` actualizado.

### `capsule_discard`

Elimina suavemente una capsule.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | integer | sí | ID de la capsule |

Devuelve `id` y timestamp `deleted_at`.

### `capsule_search`

Búsqueda de texto completo sobre capsules.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `query` | string | sí | Consulta de búsqueda |
| `compound` | string | no | Filtrar por tipo de compound |
| `limit` | integer | no | Máximo de resultados (por defecto: 20) |

Devuelve las capsules encontradas con `id`, `compound`, `title` y un snippet del contenido. Devuelve `No capsules found.` cuando la consulta no coincide con nada.

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

Devuelve `id`, `title` y `started_at`. Devuelve un error `prescription_already_open` si el bottle ya tiene una prescription abierta — el error incluye el `id`, `title`, `started_at` y `pill_count` de la prescription existente.

### `prescription_close`

Cierra una prescription abierta (establece `ended_at`).

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string (UUID v7) | sí | ID de la prescription |

Devuelve `id`, `title`, `started_at` y `ended_at`.

### `prescription_read`

Recupera una prescription por ID.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string (UUID v7) | sí | ID de la prescription |

Devuelve `id`, `title`, `started_at` y `ended_at`. Devuelve un error `not_found` si la prescription no existe.

### `prescription_context`

Pills de una prescription concreta con id, compound, título y snippet de 300 chars. Los saltos de línea del contenido se muestran como `\n` para mantener cada pill en una sola línea visual. Usar tras `bottle_context` para profundizar en una sesión de trabajo. Para el contenido completo de una pill individual, usar `pill_read`.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `prescription_id` | string (UUID v7) | sí | Prescription a inspeccionar |
| `limit` | integer | no | Máx. pills a devolver (por defecto: 30) |

Devuelve una respuesta vacía si la prescription no existe.

### `prescription_discard`

Elimina suavemente una prescription y todas sus pills en cascada.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string (UUID v7) | sí | ID de la prescription |

Devuelve un mensaje de confirmación.

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

Devuelve `id`, `name`, `display_name`, `directory` y `scope`.

### `bottle_context`

Índice navegable de las prescriptions de un bottle: id, título, estado, fechas y pill_count. Usar al inicio de sesión para descubrir qué sesiones de trabajo existen. Para ver las pills de una prescription concreta, usar `prescription_context` con su id.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | sí | Bottle a indexar |
| `limit` | integer | no | Máx. prescriptions a devolver (por defecto: 30) |

### `bottle_list`

Lista todos los bottles registrados. Sin parámetros.

Devuelve una entrada por bottle con nombre, scope, id y ruta de la base de datos. `●` significa que la base de datos del bottle es accesible; `○` con `[unlinked]` significa que el archivo de base de datos ya no existe en disco.

### `bottle_vinculate`

Registra una base de datos de bottle local existente en el registro global del usuario que realiza la llamada. Usar cuando un segundo usuario del sistema operativo necesita acceder a un bottle creado por otro usuario en la misma máquina.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `directory` | string | no | Ruta absoluta al directorio que contiene `.pillbox/pillbox.db`. Por defecto, el cwd del proceso pillbox. |

Devuelve `status: "linked"` si tiene éxito o `status: "already_linked"` si el bottle ya estaba registrado. Ambos son condiciones de exit-0. Códigos de error específicos: `db_not_found`, `circular_link`, `no_bottle_in_db`.

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
