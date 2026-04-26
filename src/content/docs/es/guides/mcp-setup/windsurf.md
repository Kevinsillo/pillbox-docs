---
title: Windsurf
description: Conecta Pillbox a Windsurf mediante configuración MCP.
sidebar:
  order: 25
  badge:
    text: Borrador
    variant: caution
---

:::caution
Esta página está en construcción. Los pasos de configuración pueden estar incompletos o sujetos a cambios.
:::

Añade la siguiente entrada a `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "pillbox": {
      "command": "node",
      "args": ["/home/tu-usuario/.pillbox/mcp/index.js"]
    }
  }
}
```
