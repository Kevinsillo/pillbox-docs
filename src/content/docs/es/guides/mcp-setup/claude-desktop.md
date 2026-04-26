---
title: Claude Desktop
description: Conecta Pillbox a Claude Desktop mediante configuración MCP manual.
sidebar:
  order: 22
  badge:
    text: Borrador
    variant: caution
---

:::caution
Esta página está en construcción. Los pasos de configuración pueden estar incompletos o sujetos a cambios.
:::

Claude Desktop requiere configuración manual. Añade la siguiente entrada a tu archivo de configuración.

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Usa la ruta absoluta a `index.js` — la expansión de `~` no está garantizada en todos los clientes MCP.

Reinicia Claude Desktop después de guardar la configuración.
