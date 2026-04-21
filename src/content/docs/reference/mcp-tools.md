---
title: MCP tools
description: Complete reference for all Pillbox MCP tools exposed to AI agents.
sidebar:
  order: 31
---

All MCP tools are exposed by the Pillbox MCP server and consumed by AI agents (Claude, Cursor, etc.). The server responds with a uniform JSON envelope:

```json
{ "ok": true, "data": { ... } }
{ "ok": false, "error": "not_found", "message": "..." }
```

Pills and prescriptions belong to a **bottle** (project-local database). Capsules are stored in the **global database** (`~/.pillbox/pillbox.db`).

---

## Pill tools

Pills are structured memory entries attached to a prescription (work session) inside a bottle.

### `pill_take`

Creates a new pill.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `prescription_id` | string (UUID v7) | yes | Open prescription to attach this pill to |
| `title` | string (1–255) | yes | Short descriptive title |
| `content` | string (1–5000) | yes | Full content of the pill |
| `compound` | string | yes | Category — see [pill compounds](#pill_compounds) |
| `dispenser` | string | no | Tool or agent that created the pill |
| `author_name` | string | no | Author name |
| `author_email` | string | no | Author email |

Returns the created `Pill` object.

### `pill_read`

Retrieves a pill by integer ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |

Returns the `Pill` object or a `not_found` error.

### `pill_revise`

Updates a pill's title, content, or compound.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |
| `title` | string (1–255) | no | New title |
| `content` | string (1–5000) | no | New content |
| `compound` | string | no | New compound |

Returns the updated `Pill` object.

### `pill_discard`

Soft-deletes a pill (the record is marked deleted, not removed).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |

Returns the deleted `Pill` object.

### `pill_search`

Full-text search over pills using FTS5 prefix matching and Jaro-Winkler fuzzy scoring.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Search query |
| `bottle_id` | string (UUID v7) | no | Restrict to a specific bottle |
| `compound` | string | no | Filter by compound type |
| `limit` | integer | no | Max results (default: 20) |

Returns an array of `SearchResult` objects with `id`, `title`, `snippet`, `rank`, `compound`, `prescription_id`, and `bottle_id`.

### `pill_context`

Returns a formatted context string summarising the most recent activity in a bottle — recent prescriptions and pills. Use this at session start to orient the agent.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | yes | Bottle to summarise |
| `prescription_limit` | integer | no | Max prescriptions to include (default: 5) |
| `pill_limit` | integer | no | Max pills to include (default: 30) |

Returns `{ context: string, prescription_count: integer, pill_count: integer }`.

### `pill_compounds`

Lists all valid compound types for pills. No parameters.

Returns an array of `{ id, description, prompt_hint }`:

| id | Description |
|---|---|
| `decision` | Architectural or implementation decision |
| `architecture` | System design or structural observation |
| `bugfix` | Bug found and fixed |
| `pattern` | Repeating pattern or convention |
| `discovery` | Non-obvious finding or gotcha |
| `learning` | Concept learned during the session |
| `feedback` | User preference or correction |
| `prescription_summary` | End-of-session summary |
| `manual` | Free-form note |

---

## Capsule tools

Capsules are global memory entries — conventions, workflows, and environment context shared across all projects.

### `capsule_take`

Creates a new capsule in the global database.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string (1–255) | yes | Short descriptive title |
| `content` | string (1–5000) | yes | Full content of the capsule |
| `compound` | string | yes | Category — see [capsule compounds](#capsule_compounds) |

Returns the created `Capsule` object.

### `capsule_read`

Retrieves a capsule by integer ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |

Returns the `Capsule` object or a `not_found` error.

### `capsule_revise`

Updates a capsule's title or content.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |
| `title` | string (1–255) | no | New title |
| `content` | string (1–5000) | no | New content |

Returns the updated `Capsule` object.

### `capsule_discard`

Soft-deletes a capsule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |

Returns the deleted `Capsule` object.

### `capsule_search`

Full-text search over capsules.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Search query |
| `compound` | string | no | Filter by compound type |
| `limit` | integer | no | Max results (default: 20) |

Returns an array of `SearchResult` objects.

### `capsule_compounds`

Lists all valid compound types for capsules. No parameters.

Returns an array of `{ id, description, prompt_hint }`:

| id | Description |
|---|---|
| `convention` | Coding or project convention |
| `workflow` | Step-by-step process or procedure |
| `environment` | Environment setup or configuration |
| `context` | Background context for a domain |
| `goal` | Project goal or objective |
| `feedback` | User preference or repeated correction |
| `manual` | Free-form note |

---

## Prescription tools

A **prescription** is an open work session inside a bottle. Pills must be attached to a prescription. Only one prescription can be open per bottle at a time.

### `prescription_open`

Opens a new prescription for a bottle.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | yes | Bottle to open the prescription in |
| `title` | string (1–255) | yes | Descriptive title for the session |

Returns the created `Prescription` object. Returns a `prescription_already_open` error if the bottle already has an open prescription.

### `prescription_close`

Closes an open prescription (sets `ended_at`).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

Returns the updated `Prescription` object with `ended_at` populated.

### `prescription_read`

Retrieves a prescription by ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

Returns the `Prescription` object or a `not_found` error.

### `prescription_discard`

Soft-deletes a prescription.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

Returns `{ discarded: true }`.

---

## Bottle tools

A **bottle** represents a project — it holds a local SQLite database with all prescriptions and pills for that project.

### `bottle_create`

Registers a new bottle.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string (1–255) | yes | Slug (usually the folder name) |
| `display_name` | string (1–255) | yes | Human-readable name |
| `directory` | string | yes | Absolute path to the project directory |
| `scope` | `local` \| `global` | yes | Whether to use a local or global database |

Returns the created `Bottle` object.

### `bottle_list`

Lists all registered bottles. No parameters.

Returns an array of `Bottle` objects with `id` (UUID v7), `name`, `display_name`, `directory`, `scope`, `created_at`, and `last_seen_at`.

---

## Error codes

| Code | Meaning |
|---|---|
| `not_found` | The requested resource does not exist |
| `prescription_already_open` | A prescription is already open for this bottle |
| `validation_error` | One or more input fields failed validation |
| `invalid_input` | The input JSON could not be parsed |
| `internal_error` | Unexpected server error |
