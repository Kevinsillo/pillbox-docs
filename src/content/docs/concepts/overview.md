---
title: Overview
description: The four entities that make up the Pillbox data model — bottles, prescriptions, pills, and capsules.
sidebar:
  order: 10
---

Pillbox organizes knowledge around four entities: **bottles**, **prescriptions**, **pills**, and **capsules**. Understanding how they relate to each other is the foundation for using Pillbox effectively.

## Bottles

A **bottle** represents a project. It maps a directory on disk to a Pillbox database.

- `name` — URL-safe slug, auto-generated from the directory name. Immutable.
- `display_name` — human-readable name, chosen during `pillbox bottle init`.
- `scope` — `local` or `global` (see below).

**Scope** determines which database the bottle lives in:

- `local` — `.pillbox/pillbox.db` inside the project directory. Good for project-specific work that shouldn't mix with other projects.
- `global` — `~/.pillbox/pillbox.db`. Good for projects where you want all knowledge accessible in one place, or to share across machines.

### How the active bottle is resolved

The CLI and the web UI resolve the active bottle differently.

**CLI** — the active bottle is the one whose `directory` matches (or is a parent of) the current working directory. This works the same for both scopes: a global-scope bottle still has a `directory`, so `cd`-ing into the project is enough. No explicit selection is needed.

**Web UI** — the active bottle is an explicit selection stored in the browser. This is necessary because the web UI has no notion of a current directory. You can switch between any registered bottle regardless of where it lives on disk.

The practical consequence: if you initialize a bottle with `global` scope, you interact with it from the CLI exactly like a `local` one — just `cd` to the project directory and all commands work as expected.

## Prescriptions

A **prescription** is a work session within a bottle. It has a title that describes what the agent is working on.

Rules:
- There can only be one open prescription per bottle at a time.
- The title must be set when opening — it describes the task before starting.
- Pills cannot be saved without an open prescription.
- Closing a prescription marks it as ended; pills are preserved.
- Discarding a prescription soft-deletes it and all its pills in one transaction.

## Pills

A **pill** is a piece of project-specific knowledge saved within a prescription.

The `compound` field classifies the type of knowledge:

| Compound | Use for |
|---|---|
| `decision` | Architecture, design, or approach decisions with rationale |
| `architecture` | System structure, module layout, data flow |
| `bugfix` | Bug description, root cause, and fix |
| `pattern` | Reusable patterns or conventions found in this project |
| `discovery` | Non-obvious findings about the codebase, dependencies, or environment |
| `learning` | Something that failed and what was learned from it |
| `feedback` | Feedback on agent behavior or approach |
| `prescription_summary` | End-of-session summary (one per prescription, saved on close) |
| `manual` | Anything that doesn't fit the above |

Pills are searchable via FTS5 full-text search across title and content. The search engine supports prefix matching (`hex` finds `hexagonal`) and fuzzy matching using Jaro-Winkler similarity.

## Capsules

A **capsule** is personal, cross-project knowledge. It belongs to the user, not to any project — there is no `bottle_id`.

| Compound | Use for |
|---|---|
| `convention` | Code style, naming, formatting preferences |
| `workflow` | How you like to work: PR process, review style, task breakdown |
| `environment` | Machine setup, installed tools, shell config |
| `context` | Personal context: current role, focus area, constraints |
| `goal` | Long-term objectives, priorities, or targets |
| `feedback` | Feedback on agent behavior that should persist across all projects |
| `manual` | Anything else |

## How they fit together

```
User
└── Capsules (global personal knowledge)

Project directory
└── Bottle (name, display_name, scope, directory)
    └── Prescriptions (work sessions)
        └── Pills (knowledge saved during the session)
```

**Typical agent workflow:**

1. **Session start** — call `pill_context` to retrieve recent prescriptions and pills. Call `capsule_search` with relevant terms to load personal conventions.
2. **During work** — call `pill_store` to save decisions, bugs fixed, discoveries.
3. **Session end** — call `pill_store` with `compound: prescription_summary` to summarize the session, then `prescription_close`.

## Deletions

Pillbox has two levels of deletion: **discard** (soft delete) and **purge** (hard delete).

### Discard

Discarding an entity sets its `deleted_at` field in the database. The record remains but is excluded from all standard queries. Discarded items appear as "archived" in the CLI and web UI, visually distinct from active ones.

Prescriptions apply a cascade: discarding a prescription also discards all its pills in the same transaction.

### Purge

Purging removes the record physically from the database. It is irreversible — no trace remains on disk.

Prescriptions apply a full cascade: a purge deletes the dispense_log entries, pill_links, all pills, and finally the prescription itself, in a single transaction.

### What each entity supports

| Entity | Discard | Purge |
|---|---|---|
| Pills | ✓ | ✓ |
| Capsules | ✓ | ✓ |
| Prescriptions | ✓ cascade | ✓ cascade |
| Bottles | — | ✓ via CLI |

### Which channel exposes what

Discard is available across all three channels: MCP tools (`pill_discard`, `capsule_discard`, `prescription_discard`), HTTP API, and web UI.

Purge is available only via HTTP API and web UI — never via MCP. AI agents can archive entities, but cannot permanently destroy memory.
