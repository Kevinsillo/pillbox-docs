---
title: MCP tools
description: Complete reference for all Pillbox MCP tools exposed to AI agents.
sidebar:
  order: 31
---

All MCP tools are served by the Pillbox MCP server and consumed by AI agents (Claude, Cursor, etc.). Responses are plain structured text — not JSON — so the LLM can read them directly without parsing.

Errors follow a uniform format: `error: <code>`, `message: <description>`, plus additional fields when relevant.

Pills and prescriptions belong to a **bottle** (project-local database). Capsules are stored in the **global database** (`~/.pillbox/pillbox.db`).

---

## Pill tools

Pills are structured memory entries attached to a prescription (work session) inside a bottle.

### `pill_store`

Creates a new pill.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `prescription_id` | string (UUID v7) | yes | Open prescription to attach this pill to |
| `title` | string (1–255) | yes | Short descriptive title |
| `content` | string (1–5000) | yes | Full content of the pill |
| `compound` | string | yes | Category — free-text string |
| `author_name` | string | no | Author name — see [author identity](/guides/author-identity/) |
| `author_email` | string | no | Author email — see [author identity](/guides/author-identity/) |

Returns the `id` of the new pill.

### `pill_read`

Retrieves a pill by integer ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |

Returns `id`, `prescription`, `created`, `compound`, `title`, and full `content`. Returns a `not_found` error if the pill does not exist.

### `pill_revise`

Updates a pill's title, content, or compound.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |
| `title` | string (1–255) | no | New title |
| `content` | string (1–5000) | no | New content |
| `compound` | string | no | New compound |

Returns `id`, `compound`, and updated `title`.

### `pill_discard`

Soft-deletes a pill (the record is marked deleted, not removed).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |

Returns `id` and `deleted_at` timestamp.

### `pill_search`

Full-text search over pills using FTS5 prefix matching and Jaro-Winkler fuzzy scoring.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Search query |
| `bottle_id` | string (UUID v7) | no | Restrict to a specific bottle |
| `compound` | string | no | Filter by compound type |
| `limit` | integer | no | Max results (default: 20) |

Returns matched pills with `id`, `compound`, `title`, and a content snippet. Returns `No pills found.` when the query matches nothing.

---

## Capsule tools

Capsules are global memory entries — conventions, workflows, and environment context shared across all projects.

### `capsule_store`

Creates a new capsule in the global database.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string (1–255) | yes | Short descriptive title |
| `content` | string (1–5000) | yes | Full content of the capsule |
| `compound` | string | yes | Category — free-text string |

Returns the `id` of the new capsule.

### `capsule_read`

Retrieves a capsule by integer ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |

Returns `id`, `created`, `compound`, `title`, and full `content`. Returns a `not_found` error if the capsule does not exist.

### `capsule_revise`

Updates a capsule's title or content.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |
| `title` | string (1–255) | no | New title |
| `content` | string (1–5000) | no | New content |

Returns `id`, `compound`, and updated `title`.

### `capsule_discard`

Soft-deletes a capsule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |

Returns `id` and `deleted_at` timestamp.

### `capsule_search`

Full-text search over capsules.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Search query |
| `compound` | string | no | Filter by compound type |
| `limit` | integer | no | Max results (default: 20) |

Returns matched capsules with `id`, `compound`, `title`, and a content snippet. Returns `No capsules found.` when the query matches nothing.

---

## Prescription tools

A **prescription** is an open work session inside a bottle. Pills must be attached to a prescription. Only one prescription can be open per bottle at a time.

### `prescription_open`

Opens a new prescription for a bottle.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | yes | Bottle to open the prescription in |
| `title` | string (1–255) | yes | Descriptive title for the session |
| `author_name` | string | no | Author name — see [author identity](/guides/author-identity/) |
| `author_email` | string | no | Author email — see [author identity](/guides/author-identity/) |

Returns `id`, `title`, and `started_at`. Returns a `prescription_already_open` error if the bottle already has an open prescription — the error includes the existing prescription's `id`, `title`, `started_at`, and `pill_count`.

### `prescription_close`

Closes an open prescription (sets `ended_at`).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

Returns `id`, `title`, `started_at`, and `ended_at`.

### `prescription_read`

Retrieves a prescription by ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

Returns `id`, `title`, `started_at`, and `ended_at`. Returns a `not_found` error if the prescription does not exist.

### `prescription_context`

Pills of a specific prescription with id, compound, title, and a 300-char snippet. Newlines in pill content are rendered as `\n` to keep each pill on a single visual line. Use after `bottle_context` to drill into a specific work session. For the full content of an individual pill, use `pill_read`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `prescription_id` | string (UUID v7) | yes | Prescription to inspect |
| `limit` | integer | no | Max pills to return (default: 30) |

Returns an empty response if the prescription does not exist.

### `prescription_discard`

Soft-deletes a prescription and all its pills in cascade.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

Returns a confirmation message.

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

Returns `id`, `name`, `display_name`, `directory`, and `scope`.

### `bottle_context`

Navigable index of a bottle's prescriptions: id, title, status, dates, and pill count. Use at session start to discover what work sessions exist. To drill into a specific prescription's pills, use `prescription_context` with its id.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | yes | Bottle to index |
| `limit` | integer | no | Max prescriptions to return (default: 30) |

### `bottle_list`

Lists all registered bottles. No parameters.

Returns one entry per bottle with name, scope, id, and database path. `●` means the bottle's database is accessible; `○` with `[unlinked]` means the database file no longer exists on disk.

### `bottle_vinculate`

Registers an existing local bottle database into the calling user's global registry. Use this when a second OS user needs to access a bottle created by another user on the same machine.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `directory` | string | no | Absolute path to the directory containing `.pillbox/pillbox.db`. Defaults to the process cwd. |

Returns `status: "linked"` on success or `status: "already_linked"` if the bottle was already registered. Both are exit-0 conditions. Error codes specific to this tool: `db_not_found`, `circular_link`, `no_bottle_in_db`.

---

## Error codes

| Code | Meaning |
|---|---|
| `not_found` | The requested resource does not exist |
| `prescription_already_open` | A prescription is already open for this bottle |
| `prescription_required` | The provided `prescription_id` does not exist or is already closed |
| `validation_error` | One or more input fields failed validation |
| `invalid_input` | The input could not be parsed |
| `internal_error` | Unexpected server error |
