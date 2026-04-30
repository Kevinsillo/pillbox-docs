---
title: HTTP API
description: HTTP API reference for advanced integrations with the Pillbox server.
sidebar:
  order: 32
---

The Pillbox HTTP server exposes a REST API for the web UI and custom integrations. Start the server with `pillbox serve start` (default port: 4242).

**Base URL**: `http://localhost:4242/api`

All responses use a uniform JSON envelope:

```json
{ "ok": true, "data": { ... } }
{ "ok": false, "error": "not_found", "message": "..." }
```

---

## Bottles

### `GET /bottles`

Returns all registered bottles from the global registry.

**Response**: array of `Bottle` objects.

### `POST /bottles`

Registers a new bottle and adds it to the global registry.

**Request body**:

```json
{
  "name": "my-project",
  "display_name": "My Project",
  "directory": "/home/user/projects/my-project",
  "scope": "local"
}
```

**Response**: `201 Created` with the created `Bottle` object.

### `GET /bottles/:bottle_id`

Returns a single bottle by UUID v7.

**Response**: `Bottle` object or `404`.

---

## Prescriptions

Prescriptions are nested under their bottle.

### `GET /bottles/:bottle_id/prescriptions`

Returns the prescription history for a bottle.

| Query param | Type | Description |
|---|---|---|
| `limit` | integer | Max results (default: 50) |

**Response**: array of `Prescription` objects.

### `POST /bottles/:bottle_id/prescriptions`

Opens a new prescription for a bottle.

**Request body**:

```json
{
  "title": "Implement OAuth login"
}
```

**Response**: `201 Created` with the `Prescription` object.  
**Error**: `409 Conflict` with the currently open prescription if one already exists.

### `GET /bottles/:bottle_id/prescriptions/:rx_id`

Returns a prescription by UUID v7.

**Response**: `Prescription` object or `404`.

### `PATCH /bottles/:bottle_id/prescriptions/:rx_id`

Closes an open prescription (sets `ended_at` to now).

**Response**: updated `Prescription` object or `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id`

Discards a prescription (soft delete). The prescription and its pills are archived with `deleted_at` set.

**Response**: `{ "discarded": true }` or `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id/purge`

Permanently deletes a prescription and all related data: dispense_log entries, pill_links, and all its pills.

:::danger
Purge cannot be undone. The prescription and all its pills are removed from the database.
:::

**Response**: `{ "purged": true }` or `404`.

---

## Pills

Pills are nested under their prescription, which is nested under their bottle.

### `GET /bottles/:bottle_id/prescriptions/:rx_id/pills`

Returns all pills attached to a prescription.

**Response**: array of `Pill` objects or `404` if the prescription does not exist.

### `POST /bottles/:bottle_id/prescriptions/:rx_id/pills`

Creates a new pill.

**Request body**:

```json
{
  "title": "Switched to JWT auth",
  "content": "Replaced express-session with jsonwebtoken...",
  "compound": "decision"
}
```

**Response**: `201 Created` with the `Pill` object.

### `GET /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id`

Returns a pill by integer ID.

**Response**: `Pill` object or `404`.

### `PATCH /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id`

Updates a pill's title, content, or compound. All fields are optional.

**Request body**:

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "compound": "architecture"
}
```

**Response**: updated `Pill` object or `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id`

Discards a pill (soft delete). The record is archived with `deleted_at` set.

**Response**: archived `Pill` object or `404`.

### `DELETE /bottles/:bottle_id/prescriptions/:rx_id/pills/:pill_id/purge`

Permanently deletes a pill.

:::danger
Purge cannot be undone.
:::

**Response**: `{ "purged": true }` or `404`.

### `GET /pills/search`

Full-text search over pills across all bottles.

| Query param | Type | Description |
|---|---|---|
| `query` | string | Search query (required) |
| `bottle_id` | string (UUID v7) | Restrict to a specific bottle |
| `compound` | string | Filter by compound type |
| `limit` | integer | Max results (default: 20) |

**Response**: array of `SearchResult` objects with `id`, `title`, `snippet`, `rank`, `compound`, `prescription_id`, and `bottle_id`.

---

## Context

### `GET /bottles/:bottle_id/context`

Returns a formatted context summary for a bottle — useful for populating an agent's system prompt.

| Query param | Type | Description |
|---|---|---|
| `prescription_limit` | integer | Max prescriptions to include (default: 5) |
| `pill_limit` | integer | Max pills to include (default: 30) |

**Response**:

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

Capsules use the global database (`~/.pillbox/pillbox.db`) regardless of which bottle is active.

### `POST /capsules`

Creates a new capsule.

**Request body**:

```json
{
  "title": "Git branch naming convention",
  "content": "Always prefix feature branches with feat/...",
  "compound": "convention"
}
```

**Response**: `201 Created` with the `Capsule` object.

### `GET /capsules`

Lists capsules, including archived ones (with `deleted_at` set). Active capsules appear first.

| Query param | Type | Description |
|---|---|---|
| `compound` | string | Filter by compound type |
| `limit` | integer | Max results |

**Response**: array of `Capsule` objects.

### `GET /capsules/:id`

Returns a capsule by integer ID, including if it is archived.

**Response**: `Capsule` object or `404`.

### `PATCH /capsules/:id`

Updates a capsule's title or content.

**Request body**:

```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

**Response**: updated `Capsule` object or `404`.

### `DELETE /capsules/:id`

Discards a capsule (soft delete). The record is archived with `deleted_at` set.

**Response**: archived `Capsule` object or `404`.

### `DELETE /capsules/:id/purge`

Permanently deletes a capsule.

:::danger
Purge cannot be undone.
:::

**Response**: `{ "purged": true }` or `404`.

### `GET /capsules/search`

Full-text search over capsules.

| Query param | Type | Description |
|---|---|---|
| `query` | string | Search query (required) |
| `compound` | string | Filter by compound type |
| `limit` | integer | Max results (default: 20) |

**Response**: array of `SearchResult` objects.

---

## Meta

### `GET /version`

Returns the running server version.

**Response**:

```json
{ "ok": true, "data": { "version": "0.4.0" } }
```

---

## HTTP status codes

| Code | Meaning |
|---|---|
| `200 OK` | Successful read or update |
| `201 Created` | Resource created |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Prescription already open for this bottle |
| `422 Unprocessable Entity` | Validation failed on the request body |
| `500 Internal Server Error` | Unexpected server error |
