---
title: Cursor
description: Connect Pillbox to Cursor via MCP configuration.
sidebar:
  order: 24
  badge:
    text: Draft
    variant: caution
---

:::caution
This page is a work in progress. Configuration steps may be incomplete or subject to change.
:::

Add the following entry to your Cursor MCP config. Use `.cursor/mcp.json` in your project for a local setup, or `~/.cursor/mcp.json` for global.

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
