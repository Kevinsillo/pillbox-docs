---
title: OpenCode
description: Connect Pillbox to OpenCode via MCP configuration.
sidebar:
  order: 23
  badge:
    text: Draft
    variant: caution
---

:::caution
This page is a work in progress. Configuration steps may be incomplete or subject to change.
:::

Add the following entry to your OpenCode MCP config:

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
