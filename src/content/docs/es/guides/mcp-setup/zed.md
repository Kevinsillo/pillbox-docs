---
title: Zed
description: Conecta Pillbox a Zed mediante configuración MCP.
sidebar:
  order: 26
  badge:
    text: Borrador
    variant: caution
---

:::caution
Esta página está en construcción. Los pasos de configuración pueden estar incompletos o sujetos a cambios.
:::

Añade la siguiente entrada a `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "pillbox": {
      "command": {
        "path": "node",
        "args": ["/home/tu-usuario/.pillbox/mcp/index.js"]
      }
    }
  }
}
```
