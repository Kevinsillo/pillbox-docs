---
title: CLI reference
description: All Pillbox CLI commands — serve, bottle, prescription, MCP, skill, and language.
sidebar:
  order: 30
---

The `pillbox` CLI is designed for human operators and setup tasks. The agent interacts with Pillbox via the MCP server, not the CLI.

## `pillbox status`

Shows global status: binary path, global and local databases, active bottle, HTTP server, MCP server, and skill.

## Serve commands

### `pillbox serve start [--port N]`

Starts the HTTP server as a background process. Default port: 4242.

```bash
pillbox serve start
pillbox serve start --port 8080
```

The web UI is available at `http://localhost:<port>`.

### `pillbox serve stop`

Stops the background server.

### `pillbox serve status`

Shows whether the server is running and on which port.

## Bottle commands

### `pillbox bottle init`

Interactive wizard to initialize a bottle in the current directory.

1. Prompts for a display name (default: directory name)
2. Prompts for scope: `local` or `global`
3. Creates the database and runs migrations
4. If local and in a git repo: offers to add `.pillbox/` to `.gitignore`

### `pillbox bottle status`

Status of the bottle in the current directory.

### `pillbox bottle list`

Lists all bottles registered in the global database.

### `pillbox bottle migrate [--reverse] [--capsules]`

Migrates a bottle between the local and global databases using upsert by `sync_id`.

```bash
pillbox bottle migrate              # local → global
pillbox bottle migrate --reverse    # global → local
```

### `pillbox bottle delete <slug>`

Removes a bottle from the global registry. Requires typing the slug to confirm — the operation cannot be undone.

```bash
pillbox bottle delete my-project
```

The command shows the bottle's name, slug, and database path before prompting for confirmation.

### `pillbox bottle repair <slug>`

Updates the database path of an unlinked bottle — one whose `.pillbox/pillbox.db` file no longer exists at the registered location (for example, after moving a project to a new directory).

```bash
pillbox bottle repair my-project
```

Prompts for the new absolute path to the `pillbox.db` file. The path must exist and be a file; if it does not, the command exits with an error and makes no changes.

## Prescription commands

### `pillbox prescription open "<title>"`

Opens a new prescription (work session) for the current bottle.

```bash
pillbox prescription open "Implement OAuth login"
```

Fails if there is already an open prescription — close it first with `pillbox prescription close`.

### `pillbox prescription list [-l N]`

Lists the most recent prescriptions for the current bottle.

```bash
pillbox prescription list
pillbox prescription list -l 25
```

### `pillbox prescription close`

Closes the open prescription for the current bottle.

## Pills commands

### `pillbox pills list`

Lists all pills in the current bottle, ordered by creation date (newest first).

## Capsule commands

### `pillbox capsule list [-l N]`

Lists global capsules — active ones first, archived (soft-deleted) ones in a separate section at the end.

```bash
pillbox capsule list
pillbox capsule list -l 100
```

### `pillbox capsule show <id>`

Shows the full detail of a capsule by integer ID, including if it is archived.

```bash
pillbox capsule show 7
```

## MCP commands

### `pillbox mcp install`

Downloads the MCP server from the latest GitHub release and installs it to `~/.pillbox/mcp/`. Requires Node.js ≥ 18. Automatically registers the entry in `~/.claude.json`.

### `pillbox mcp uninstall`

Removes the MCP server directory and its entry from `~/.claude.json`.

## Skill commands

### `pillbox skill install`

Downloads the Claude Code skill from the latest GitHub release and installs it to `~/.claude/skills/pillbox/`.

### `pillbox skill uninstall`

Removes the skill directory.

## Language commands

### `pillbox lang`

Shows the current language and available options.

```
Current language: English (en)

es    Español
en    English  ● active
de    Deutsch
it    Italiano
pt    Português
fr    Français
```

### `pillbox lang set <code>`

Sets the CLI language. Persisted to `~/.pillbox/lang`.

```bash
pillbox lang set en
pillbox lang set de
```

Supported codes: `es`, `en`, `de`, `it`, `pt`, `fr`.

Language detection order: `~/.pillbox/lang` → `PILLBOX_LANG` env var → system locale → fallback `es`.

## `pillbox uninstall`

Interactive removal of Pillbox components. Prompts before each step: MCP server, skill, global database, binary.

## Environment variables

| Variable | Description |
|---|---|
| `PILLBOX_LANG` | Override language detection (e.g. `PILLBOX_LANG=en`) |
| `PILLBOX_VERSION` | Version to install (used by `install.sh`) |
| `PILLBOX_INSTALL_DIR` | Install directory for the binary |
| `RUST_LOG` | Log level for the server (e.g. `RUST_LOG=info pillbox serve start`) |
