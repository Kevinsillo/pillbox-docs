---
title: OpenCode
description: Añade memoria persistente para agentes IA a OpenCode con el servidor MCP de Pillbox — configuración automática en un comando o manual.
sidebar:
  order: 23
---

`pillbox mcp install` configura OpenCode automáticamente — escribe la entrada `pillbox` en `~/.config/opencode/opencode.json`, creando el archivo si es necesario y preservando las entradas existentes. Cuando Claude Code y OpenCode están ambos instalados, el comando pregunta a qué proveedor apuntar; pasa `--provider opencode` para omitir la pregunta.

```bash
pillbox mcp install --provider opencode
```

Reinicia OpenCode después de instalar. El servidor MCP `pillbox` y sus herramientas deberían estar disponibles. Consulta la [referencia de herramientas MCP](../../../reference/mcp-tools/) para ver qué hace cada una.

## Configuración manual

Si prefieres configurar manualmente, añade lo siguiente a `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "pillbox": {
      "type": "local",
      "command": ["node", "/home/tu-usuario/.pillbox/mcp/index.js"],
      "enabled": true
    }
  }
}
```

OpenCode usa la clave `mcp` (no `mcpServers`), y `command` es un array de strings cuyo primer elemento es el ejecutable. Usa la ruta absoluta a `index.js` — la expansión de `~` no está garantizada en todos los clientes MCP.

## Desinstalar

```bash
pillbox mcp uninstall --provider opencode
```

Elimina el directorio del servidor MCP y la entrada `pillbox` de `~/.config/opencode/opencode.json`.
