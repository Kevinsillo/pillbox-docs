---
title: Claude Code
description: Connect Pillbox to Claude Code via automatic or manual MCP configuration.
sidebar:
  order: 21
---

`pillbox mcp install` configures Claude Code automatically — it writes the `pillbox` entry to `~/.claude.json`, creating the file if needed and preserving any existing entries.

```bash
pillbox mcp install
```

Restart Claude Code after installing. Run `/mcp` to verify the server is connected:

```
pillbox (connected)
  Tools: prescription_open, prescription_close, prescription_read,
         prescription_discard, bottle_list, pill_take, pill_find,
         pill_context, pill_read, pill_revise, pill_discard,
         capsule_take, capsule_find, capsule_read, capsule_revise,
         capsule_discard, stats
```

## Manual configuration

If you prefer to configure manually, add the following to `~/.claude.json`:

```json
{
  "mcpServers": {
    "pillbox": {
      "command": "node",
      "args": ["/home/you/.pillbox/mcp/index.js"]
    }
  }
}
```

Use the absolute path to `index.js` — `~` expansion is not guaranteed in all MCP clients.

## Uninstalling

```bash
pillbox mcp uninstall
```

Removes the MCP server directory and its entry from `~/.claude.json`.
