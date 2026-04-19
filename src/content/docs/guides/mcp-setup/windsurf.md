---
title: Windsurf
description: Connect Pillbox to Windsurf via MCP configuration.
sidebar:
  order: 25
  badge:
    text: Draft
    variant: caution
---

:::caution
This page is a work in progress. Configuration steps may be incomplete or subject to change.
:::

Add the following entry to `~/.codeium/windsurf/mcp_config.json`:

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
