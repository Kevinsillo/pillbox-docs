---
title: MCP tools
description: Complete reference for all Pillbox MCP tools exposed to AI agents.
sidebar:
  order: 31
---

All MCP tools are served by the Pillbox MCP server and consumed by AI agents (Claude, Cursor, etc.). Responses are plain structured text — not JSON — so the LLM can read them directly without parsing.

Successful responses are tool-specific text (see each tool below). Errors follow a uniform format:

```
error: <code>
message: <human-readable description>
<field>: <value>     ← additional fields when relevant
```

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
| `compound` | string | yes | Category — see [pill compounds](#pill_compounds) |
| `author_name` | string | no | Author name — see [author identity](/guides/author-identity/) |
| `author_email` | string | no | Author email — see [author identity](/guides/author-identity/) |

```
Pill created
id: 42
```

### `pill_read`

Retrieves a pill by integer ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |

```
# Title [compound]
id: 42 | prescription: 019d... | created: 2026-04-22

Full content of the pill...
```

Returns a `not_found` error if the pill does not exist.

### `pill_revise`

Updates a pill's title, content, or compound.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |
| `title` | string (1–255) | no | New title |
| `content` | string (1–5000) | no | New content |
| `compound` | string | no | New compound |

```
Pill updated
id: 42
compound: decision
title: Updated title
```

### `pill_discard`

Soft-deletes a pill (the record is marked deleted, not removed).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Pill ID |

```
Pill discarded
id: 42
deleted_at: 2026-04-22 21:00:00
```

### `pill_search`

Full-text search over pills using FTS5 prefix matching and Jaro-Winkler fuzzy scoring.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Search query |
| `bottle_id` | string (UUID v7) | no | Restrict to a specific bottle |
| `compound` | string | no | Filter by compound type |
| `limit` | integer | no | Max results (default: 20) |

```
Found 3 pills

[decision] Title of result (id: 5, rx: 019db730...)
Snippet with the matching ...text... highlighted

[bugfix] Another result (id: 8, rx: 019db730...)
Snippet with the matching ...text... highlighted
```

Returns `No pills found.` when the query matches nothing.

### `pill_compounds`

Lists all valid compound types for pills. No parameters.

```
decision
  Architectural or implementation decision
  <prompt hint with formatting instructions>

bugfix
  Bug found and fixed
  <prompt hint>
```

| id | Description |
|---|---|
| `decision` | Architectural or implementation decision |
| `architecture` | System design or structural observation |
| `bugfix` | Bug found and fixed |
| `specification` | Behavioral specs and contracts per domain |
| `discovery` | Non-obvious finding or gotcha |
| `learning` | Concept learned during the session |
| `feedback` | User preference or correction |
| `prescription_summary` | End-of-session summary |
| `task` | Implementation task list or free-form entry |

---

## Capsule tools

Capsules are global memory entries — conventions, workflows, and environment context shared across all projects.

### `capsule_store`

Creates a new capsule in the global database.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string (1–255) | yes | Short descriptive title |
| `content` | string (1–5000) | yes | Full content of the capsule |
| `compound` | string | yes | Category — see [capsule compounds](#capsule_compounds) |

```
Capsule created
id: 7
```

### `capsule_read`

Retrieves a capsule by integer ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |

```
# Title [convention]
id: 7 | created: 2026-04-22

Full content of the capsule...
```

Returns a `not_found` error if the capsule does not exist.

### `capsule_revise`

Updates a capsule's title or content.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |
| `title` | string (1–255) | no | New title |
| `content` | string (1–5000) | no | New content |

```
Capsule updated
id: 7
compound: convention
title: Updated title
```

### `capsule_discard`

Soft-deletes a capsule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | yes | Capsule ID |

```
Capsule discarded
id: 7
deleted_at: 2026-04-22 21:00:00
```

### `capsule_search`

Full-text search over capsules.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Search query |
| `compound` | string | no | Filter by compound type |
| `limit` | integer | no | Max results (default: 20) |

```
Found 2 capsules

[convention] Title (id: 3)
Snippet with the matching ...text... highlighted

[feedback] Another title (id: 7)
Snippet with the matching ...text... highlighted
```

Returns `No capsules found.` when the query matches nothing.

### `capsule_compounds`

Lists all valid compound types for capsules. No parameters.

```
convention
  Coding or project convention
  <prompt hint>

workflow
  Step-by-step process or procedure
  <prompt hint>
```

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
| `author_name` | string | no | Author name — see [author identity](/guides/author-identity/) |
| `author_email` | string | no | Author email — see [author identity](/guides/author-identity/) |

```
Prescription opened
id: 019db730-46ad-7a71-aa30-cf4111989cad
title: Refactor auth middleware
started_at: 2026-04-22 21:54:47
```

Returns a `prescription_already_open` error if the bottle already has an open prescription. The error includes the existing prescription's `id`, `title`, `started_at`, and `pill_count` — use that `id` directly instead of opening a new one.

### `prescription_close`

Closes an open prescription (sets `ended_at`).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

```
Prescription closed
id: 019db730-46ad-7a71-aa30-cf4111989cad
title: Refactor auth middleware
started_at: 2026-04-22 21:54:47
ended_at: 2026-04-22 23:10:00
```

### `prescription_read`

Retrieves a prescription by ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

```
id: 019db730-46ad-7a71-aa30-cf4111989cad
title: Refactor auth middleware
started_at: 2026-04-22 21:54:47
ended_at: 2026-04-22 23:10:00
```

Returns a `not_found` error if the prescription does not exist.

### `prescription_context`

Pills of a specific prescription with id, compound, title, and a 300-char snippet. Newlines in pill content are rendered as `\n` to keep each pill on a single visual line. Use after `bottle_context` to drill into a specific work session. For the full content of an individual pill, use `pill_read`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `prescription_id` | string (UUID v7) | yes | Prescription to inspect |
| `limit` | integer | no | Max pills to return (default: 30) |

```
[closed] Implement auth JWT
id: 019df503-bde1-7ff0-bb28-fa65ecf61846  started: 2026-05-03 → 2026-05-03

  #42 [decision] Use stateless JWT with refresh tokens
  chosen: stateless JWT\nrefresh stored in SQLite\nwhy: avoids server-side session state…

  #41 [bugfix] Race condition in dedup
  BEGIN IMMEDIATE prevents race conditions in concurrent writes

---
pills: 2
```

Returns an empty response if the prescription does not exist.

### `prescription_discard`

Soft-deletes a prescription and all its pills in cascade.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID v7) | yes | Prescription ID |

```
Prescription discarded.
```

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

```
Bottle created
id: 019db257-47b6-7473-a8b7-77c66bae09c6
name: my-project
display_name: My Project
directory: /home/user/my-project
scope: local
```

### `bottle_context`

Navigable index of a bottle's prescriptions: id, title, status, dates, and pill count. Use at session start to discover what work sessions exist. To drill into a specific prescription's pills, use `prescription_context` with its id.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bottle_id` | string (UUID v7) | yes | Bottle to index |
| `limit` | integer | no | Max prescriptions to return (default: 30) |

```
[open]  2026-05-04  12 pills  Implement auth JWT
id: 019df503-bde1-7ff0-bb28-fa65ecf61846

[closed] 2026-05-01 → 2026-05-01  3 pills  Fix FTS5 triggers
id: 019de307-68db-7c91-9ee0-6de72efe647b

---
prescriptions: 2
```

### `bottle_list`

Lists all registered bottles. No parameters.

```
Bottles (2)

● My Project [local] 019db257-47b6-7473-a8b7-77c66bae09c6
  /home/user/my-project

○ Old Project [global] 019da000-0000-7000-0000-000000000000 [unlinked]
  /home/user/old-project
```

`●` means the bottle's database is accessible. `○` with `[unlinked]` means the database file no longer exists on disk.

### `bottle_vinculate`

Registers an existing local bottle database into the calling user's global registry. Use this when a second OS user needs to access a bottle created by another user on the same machine.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `directory` | string | no | Absolute path to the directory containing `.pillbox/pillbox.db`. Defaults to the process cwd. |

Returns `status: "linked"` on success or `status: "already_linked"` if the bottle was already registered. Both are exit-0 conditions.

```json
{ "status": "linked", "name": "my-project", "slug": "my-project", "db_path": "/home/bob/my-project/.pillbox/pillbox.db" }
```

Error codes specific to this tool: `db_not_found`, `circular_link`, `no_bottle_in_db`.

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
