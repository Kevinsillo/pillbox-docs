---
draft: true
title: Cursor
description: Añade memoria persistente para agentes IA a Cursor con el servidor MCP de Pillbox — guía de configuración MCP paso a paso.
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
