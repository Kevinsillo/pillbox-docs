---
draft: true
title: Claude Desktop
description: Connect Pillbox to Claude Desktop via manual MCP configuration.
sidebar:
  order: 22
  badge:
    text: Draft
    variant: caution
---

:::caution
This page is a work in progress. Configuration steps may be incomplete or subject to change.
:::

Claude Desktop requires manual configuration. Add the following entry to your config file.

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Restart Claude Desktop after saving the config.
