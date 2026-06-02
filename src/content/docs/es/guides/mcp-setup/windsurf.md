---
draft: true
title: Windsurf
description: Añade memoria persistente para agentes IA a Windsurf con el servidor MCP de Pillbox — guía de configuración MCP paso a paso.
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
