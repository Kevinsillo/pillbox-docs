---
title: Claude Code
description: Añade memoria persistente para agentes IA a Claude Code con el servidor MCP de Pillbox — configuración automática en un comando o manual con JSON.
sidebar:
  order: 21
---

`pillbox mcp install` configura Claude Code automáticamente — escribe la entrada `pillbox` en `~/.claude.json`, creando el archivo si es necesario y preservando las entradas existentes.

```bash
pillbox mcp install
```

Reinicia Claude Code después de instalar. Ejecuta `/mcp` para verificar que el servidor está conectado — deberías ver `pillbox (connected)` con la lista completa de tools. Consulta la [referencia de herramientas MCP](../../../reference/mcp-tools/) para ver qué hace cada una.

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
