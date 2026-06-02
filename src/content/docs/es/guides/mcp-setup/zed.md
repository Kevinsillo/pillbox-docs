---
draft: true
title: Zed
description: Añade memoria persistente para agentes IA a Zed con el servidor MCP de Pillbox — guía de configuración MCP paso a paso.
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
