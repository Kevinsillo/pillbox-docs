---
title: API HTTP
description: Referencia de la API HTTP para integraciones avanzadas con el servidor Pillbox.
sidebar:
  order: 32
---

El servidor HTTP de Pillbox expone una API REST para la interfaz web e integraciones personalizadas. Inicia el servidor con `pillbox serve start` (puerto por defecto: 4242).

**URL base**: `http://localhost:4242/api`

Todas las respuestas usan un sobre JSON uniforme:

```json
{ "ok": true, "data": { ... } }
{ "ok": false, "error": "not_found", "message": "..." }
```

---

## Bottles

### `GET /bottles`

Devuelve todos los bottles registrados en el registro global.

**Respuesta**: array de objetos `Bottle`.

### `POST /bottles`

Registra un nuevo bottle y lo añade al registro global.

**Cuerpo de la petición**:

```json
{
  "name": "mi-proyecto",
  "display_name": "Mi Proyecto",
  "directory": "/home/usuario/proyectos/mi-proyecto",
  "scope": "local"
}
```

**Respuesta**: `201 Created` con el objeto `Bottle` creado.

### `GET /bottles/:bottle_id`

Devuelve un bottle por UUID v7.

**Respuesta**: objeto `Bottle` o `404`.

---

## Prescriptions

Las prescriptions están anidadas bajo su bottle.

### `GET /bottles/:bottle_id/prescriptions`

Devuelve el historial de prescriptions para un bottle.

| Query param | Tipo | Descripción |
|---|---|---|
| `limit` | integer | Máximo de resultados (por defecto: 50) |

**Respuesta**: array de objetos `Prescription`.

### `POST /bottles/:bottle_id/prescriptions`

Abre una nueva prescription para un bottle.

**Cuerpo de la petición**:

```json
{
  "title": "Implementar login OAuth"
}
```

**Respuesta**: `201 Created` con el objeto `Prescription`.
**Error**: `409 Conflict` con la prescription actualmente abierta si ya existe una.

### `GET /bottles/:bottle_id/prescriptions/:rx_id`

Devuelve una prescription por UUID v7.

**Respuesta**: objeto `Prescription` o `404`.

### `PATCH /bottles/:bottle_id/prescriptions/:rx_id`

Cierra una prescription abierta (establece `ended_at` a ahora).

**Respuesta**: objeto `Prescription` actualizado o `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id`

Descarta una prescription (soft delete). La prescription y sus pills quedan archivadas con `deleted_at` establecido.

**Respuesta**: `{ "discarded": true }` o `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id/purge`

Elimina permanentemente una prescription y todos sus datos relacionados: entradas de dispense_log, pill_links y todas sus pills.

:::danger
El purge no se puede deshacer. La prescription y todas sus pills desaparecen de la base de datos.
:::

**Respuesta**: `{ "purged": true }` o `404`.

---

## Pills

Las pills están anidadas bajo su prescription, que está anidada bajo su bottle.

### `GET /bottles/:bottle_id/prescriptions/:rx_id/pills`

Devuelve todas las pills vinculadas a una prescription.

**Respuesta**: array de objetos `Pill` o `404` si la prescription no existe.

### `POST /bottles/:bottle_id/prescriptions/:rx_id/pills`

Crea una nueva pill.

**Cuerpo de la petición**:

```json
{
  "title": "Migrado a autenticación JWT",
  "content": "Reemplazado express-session con jsonwebtoken...",
  "compound": "decision",
  "dispenser": "claude-sonnet-4-6"
}
```

**Respuesta**: `201 Created` con el objeto `Pill`.

### `GET /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id`

Devuelve una pill por ID entero.

**Respuesta**: objeto `Pill` o `404`.

### `PATCH /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id`

Actualiza el título, contenido o compound de una pill. Todos los campos son opcionales.

**Cuerpo de la petición**:

```json
{
  "title": "Título actualizado",
  "content": "Contenido actualizado",
  "compound": "architecture"
}
```

**Respuesta**: objeto `Pill` actualizado o `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id`

Descarta una pill (soft delete). El registro queda archivado con `deleted_at` establecido.

**Respuesta**: objeto `Pill` archivado o `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id/purge`

Elimina permanentemente una pill.

:::danger
El purge no se puede deshacer.
:::

**Respuesta**: `{ "purged": true }` o `404`.

### `GET /pills/search`

Búsqueda de texto completo sobre pills de todos los bottles.

| Query param | Tipo | Descripción |
|---|---|---|
| `query` | string | Consulta de búsqueda (requerido) |
| `bottle_id` | string (UUID v7) | Restringir a un bottle específico |
| `compound` | string | Filtrar por tipo de compound |
| `limit` | integer | Máximo de resultados (por defecto: 20) |

**Respuesta**: array de objetos `SearchResult` con `id`, `title`, `snippet`, `rank`, `compound`, `prescription_id` y `bottle_id`.

---

## Contexto

### `GET /bottles/:bottle_id/context`

Devuelve un resumen de contexto formateado para un bottle — útil para poblar el system prompt de un agente.

| Query param | Tipo | Descripción |
|---|---|---|
| `prescription_limit` | integer | Máx. prescriptions a incluir (por defecto: 5) |
| `pill_limit` | integer | Máx. pills a incluir (por defecto: 30) |

**Respuesta**:

```json
{
  "ok": true,
  "data": {
    "context": "...",
    "prescription_count": 12,
    "pill_count": 87
  }
}
```

---

## Capsules

Las capsules usan la base de datos global (`~/.pillbox/pillbox.db`) independientemente de qué bottle esté activo.

### `POST /capsules`

Crea una nueva capsule.

**Cuerpo de la petición**:

```json
{
  "title": "Convención de nombres de ramas Git",
  "content": "Siempre añadir prefijo feat/ a las ramas de funcionalidad...",
  "compound": "convention"
}
```

**Respuesta**: `201 Created` con el objeto `Capsule`.

### `GET /capsules`

Lista capsules, incluyendo las archivadas (con `deleted_at` establecido). Las activas aparecen primero.

| Query param | Tipo | Descripción |
|---|---|---|
| `compound` | string | Filtrar por tipo de compound |
| `limit` | integer | Máximo de resultados |

**Respuesta**: array de objetos `Capsule`.

### `GET /capsules/:id`

Devuelve una capsule por ID entero, incluyendo si está archivada.

**Respuesta**: objeto `Capsule` o `404`.

### `PATCH /capsules/:id`

Actualiza el título o contenido de una capsule.

**Cuerpo de la petición**:

```json
{
  "title": "Título actualizado",
  "content": "Contenido actualizado"
}
```

**Respuesta**: objeto `Capsule` actualizado o `404`.

### `DELETE /capsules/:id`

Descarta una capsule (soft delete). El registro queda archivado con `deleted_at` establecido.

**Respuesta**: objeto `Capsule` archivado o `404`.

### `DELETE /capsules/:id/purge`

Elimina permanentemente una capsule.

:::danger
El purge no se puede deshacer.
:::

**Respuesta**: `{ "purged": true }` o `404`.

### `GET /capsules/search`

Búsqueda de texto completo sobre capsules.

| Query param | Tipo | Descripción |
|---|---|---|
| `query` | string | Consulta de búsqueda (requerido) |
| `compound` | string | Filtrar por tipo de compound |
| `limit` | integer | Máximo de resultados (por defecto: 20) |

**Respuesta**: array de objetos `SearchResult`.

---

## Meta

### `GET /version`

Devuelve la versión del servidor en ejecución.

**Respuesta**:

```json
{ "ok": true, "data": { "version": "0.4.0" } }
```

---

## Códigos de estado HTTP

| Código | Significado |
|---|---|
| `200 OK` | Lectura o actualización exitosa |
| `201 Created` | Recurso creado |
| `404 Not Found` | El recurso no existe |
| `409 Conflict` | Ya hay una prescription abierta para este bottle |
| `422 Unprocessable Entity` | Falló la validación del cuerpo de la petición |
| `500 Internal Server Error` | Error inesperado del servidor |
