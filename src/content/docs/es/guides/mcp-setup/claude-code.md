---
title: Claude Code
description: Conecta Pillbox a Claude Code mediante configuración MCP automática o manual.
sidebar:
  order: 21
---

`pillbox mcp install` configura Claude Code automáticamente — escribe la entrada `pillbox` en `~/.claude.json`, creando el archivo si es necesario y preservando las entradas existentes.

```bash
pillbox mcp install
```

Reinicia Claude Code después de instalar. Ejecuta `/mcp` para verificar que el servidor está conectado:

```
pillbox (connected)
  Tools: prescription_open, prescription_close, prescription_read,
         prescription_discard, bottle_list, pill_take, pill_find,
         pill_context, pill_read, pill_revise, pill_discard,
         capsule_take, capsule_find, capsule_read, capsule_revise,
         capsule_discard, stats
```

## Configuración manual

Si prefieres configurar manualmente, añade lo siguiente a `~/.claude.json`:

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

## Desinstalar

```bash
pillbox mcp uninstall
```

Elimina el directorio del servidor MCP y su entrada de `~/.claude.json`.
