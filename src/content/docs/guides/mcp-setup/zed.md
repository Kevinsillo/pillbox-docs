---
draft: true
title: Zed
description: Add persistent AI agent memory to Zed with the Pillbox MCP server — step-by-step MCP configuration guide.
sidebar:
  order: 26
  badge:
    text: Draft
    variant: caution
---

:::caution
This page is a work in progress. Configuration steps may be incomplete or subject to change.
:::

Add the following entry to `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "pillbox": {
      "command": {
        "path": "node",
        "args": ["/home/you/.pillbox/mcp/index.js"]
      }
    }
  }
}
```
