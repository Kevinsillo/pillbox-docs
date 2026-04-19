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

Returns all registered bottles, merging local and global databases and deduplicating by directory.

**Response**: array of `Bottle` objects.

### `POST /bottles`

Registers a new bottle.

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

### `GET /bottles/:id`

Returns a single bottle by integer ID.

**Response**: `Bottle` object or `404`.

### `GET /bottles/:id/prescriptions`

Returns the prescription history for a bottle.

| Query param | Type | Description |
|---|---|---|
| `limit` | integer | Max results (default: 50) |

**Response**: array of `Prescription` objects.

---

## Prescriptions

### `POST /prescriptions`

Opens a new prescription for a bottle.

**Request body**:

```json
{
  "bottle_id": 1,
  "title": "Implement OAuth login"
}
```

**Response**: `201 Created` with the `Prescription` object.  
**Error**: `409 Conflict` with the currently open prescription if one already exists.

### `GET /prescriptions/:id`

Returns a prescription by UUID v7 ID.

**Response**: `Prescription` object or `404`.

### `PATCH /prescriptions/:id`

Closes an open prescription (sets `ended_at` to now).

**Response**: updated `Prescription` object or `404`.

### `DELETE /prescriptions/:id`

Soft-deletes a prescription.

**Response**: `{ "discarded": true }` or `404`.

### `GET /prescriptions/:id/pills`

Returns all pills attached to a prescription.

**Response**: array of `Pill` objects or `404` if the prescription does not exist.

---

## Pills

### `POST /pills`

Creates a new pill.

**Request body**:

```json
{
  "prescription_id": "01HXYZ...",
  "title": "Switched to JWT auth",
  "content": "Replaced express-session with jsonwebtoken...",
  "compound": "decision",
  "dispenser": "claude-sonnet-4-6"
}
```

**Response**: `201 Created` with the `Pill` object.

### `GET /pills/:id`

Returns a pill by integer ID.

**Response**: `Pill` object or `404`.

### `PATCH /pills/:id`

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

### `DELETE /pills/:id`

Soft-deletes a pill.

**Response**: deleted `Pill` object or `404`.

### `GET /pills/search`

Full-text search over pills.

| Query param | Type | Description |
|---|---|---|
| `query` | string | Search query (required) |
| `bottle_id` | integer | Restrict to a specific bottle |
| `compound` | string | Filter by compound type |
| `limit` | integer | Max results (default: 20) |

**Response**: array of `SearchResult` objects with `id`, `title`, `snippet`, `rank`, `compound`, `prescription_id`, and `bottle_id`.

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

Lists capsules.

| Query param | Type | Description |
|---|---|---|
| `compound` | string | Filter by compound type |
| `limit` | integer | Max results |

**Response**: array of `Capsule` objects.

### `GET /capsules/:id`

Returns a capsule by integer ID.

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

Soft-deletes a capsule.

**Response**: deleted `Capsule` object or `404`.

### `GET /capsules/search`

Full-text search over capsules.

| Query param | Type | Description |
|---|---|---|
| `query` | string | Search query (required) |
| `compound` | string | Filter by compound type |
| `limit` | integer | Max results (default: 20) |

**Response**: array of `SearchResult` objects.

---

## Context

### `GET /context`

Returns a formatted context summary for a bottle — useful for populating an agent's system prompt.

| Query param | Type | Description |
|---|---|---|
| `bottle_id` | integer | Bottle to summarise (required) |
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
