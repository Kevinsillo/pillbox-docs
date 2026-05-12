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

### `pillbox serve`

Shows the service status if installed. If not installed, displays a hint with the install command.

### `pillbox serve install [--port N]`

Registers the HTTP server as a system service and enables autostart on boot. Default port: 4242.

```bash
pillbox serve install
pillbox serve install --port 8080
```

Also adds `pillbox.local` to the system hosts file for named access instead of `localhost`. Requires write permission on the hosts file (sudo on Linux/macOS, Administrator on Windows); if unavailable, the service installs anyway and the UI remains accessible at `http://localhost:<port>`.

### `pillbox serve uninstall`

Removes the system service and the `pillbox.local` entry from the hosts file.

### `pillbox serve start`

Starts the service. The service must be installed first with `pillbox serve install`.

### `pillbox serve stop`

Stops the service.

### `pillbox serve status`

Shows whether the server is running and the access URL.

## Bottle commands

### `pillbox bottle init`

Interactive wizard to initialize a bottle in the current directory.

1. Prompts for a display name (default: directory name)
2. Prompts for scope: `local` or `global`
3. Creates the database and runs migrations
4. If local and in a git repo: offers to add `.pillbox/` to `.gitignore`

### `pillbox bottle status`

Status of the bottle in the current directory.

### `pillbox bottle list [-l N]`

Lists all bottles registered in the global database. Default: 20.

```bash
pillbox bottle list
pillbox bottle list -l 50
```

### `pillbox bottle migrate <global|local>`

Moves a bottle's prescriptions and pills between the local and global databases. Requires confirmation and updates the bottle's scope automatically.

**`global`:** moves the current directory's bottle to the global database, then deletes the local database file (`.pillbox/pillbox.db`).

**`local`:** shows an interactive list of global bottles; moves the selected one to the local database, then removes it from the global database. Fails if the current directory already has a local bottle.

```bash
pillbox bottle migrate global    # local → global (deletes local DB file)
pillbox bottle migrate local     # global → local (removes bottle from global DB)
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

### `pillbox bottle vinculate [directory]`

Registers an existing local bottle database into the calling user's global registry. Use this when a second OS user needs access to a bottle created by another user on the same machine — for example, when two users share a project directory.

`directory` is optional and defaults to the current working directory.

```bash
pillbox bottle vinculate                        # links bottle in cwd
pillbox bottle vinculate /home/alice/my-project # links bottle at explicit path
```

The command reads the bottle from `<directory>/.pillbox/pillbox.db` and adds it to `~/.pillbox/pillbox.db`. The operation is idempotent — running it twice reports "already linked" without error.

Error conditions:

- `.pillbox/pillbox.db` not found at the resolved path — exits 1
- The resolved path is the global database itself (circular link) — exits 1
- The local database contains no bottle — exits 1

## Prescription commands

### `pillbox prescription open "<title>"`

Opens a new prescription (work session) for the current bottle.

```bash
pillbox prescription open "Implement OAuth login"
```

Fails if there is already an open prescription — close it first with `pillbox prescription close`.

### `pillbox prescription list [-l N]`

Lists the most recent prescriptions for the current bottle. Default: 10.

```bash
pillbox prescription list
pillbox prescription list -l 25
```

### `pillbox prescription show <id> [-l N]`

Shows the full detail of a prescription and all its pills. Accepts a full ID or a short prefix. Default: 20 pills shown; use `-l` to change the limit.

```bash
pillbox prescription show abc123
pillbox prescription show abc123 -l 50
```

### `pillbox prescription close`

Closes the open prescription for the current bottle.

## Pill commands

### `pillbox pill show <id>`

Shows the full detail of a pill by its integer ID. Works even if the pill is archived.

```bash
pillbox pill show 42
```

## Capsule commands

### `pillbox capsule list [-l N]`

Lists global capsules — active ones first, archived (soft-deleted) ones in a separate section at the end. Default: 50.

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
