---
draft: true
title: Cursor
description: Conecta Pillbox a Cursor mediante configuración MCP.
sidebar:
  order: 24
  badge:
    text: Borrador
    variant: caution
---

:::caution
Esta página está en construcción. Los pasos de configuración pueden estar incompletos o sujetos a cambios.
:::

Añade la siguiente entrada a tu configuración MCP de Cursor. Usa `.cursor/mcp.json` en tu proyecto para una configuración local, o `~/.cursor/mcp.json` para configuración global.

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
