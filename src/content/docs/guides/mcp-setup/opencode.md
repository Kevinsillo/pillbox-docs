---
title: OpenCode
description: Connect Pillbox to OpenCode via automatic or manual MCP configuration.
sidebar:
  order: 23
---

`pillbox mcp install` configures OpenCode automatically — it writes the `pillbox` entry to `~/.config/opencode/opencode.json`, creating the file if needed and preserving any existing entries. When both Claude Code and OpenCode are installed, the command asks which provider to target; pass `--provider opencode` to skip the prompt.

```bash
pillbox mcp install --provider opencode
```

Restart OpenCode after installing. The `pillbox` MCP server and its tools should now be available. See the [MCP tools reference](/reference/mcp-tools/) for what each tool does.

## Manual configuration

If you prefer to configure manually, add the following to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "pillbox": {
      "type": "local",
      "command": ["node", "/home/you/.pillbox/mcp/index.js"],
      "enabled": true
    }
  }
}
```

OpenCode uses the `mcp` key (not `mcpServers`), and `command` is a string array whose first element is the executable. Use the absolute path to `index.js` — `~` expansion is not guaranteed in all MCP clients.

## Uninstalling

```bash
pillbox mcp uninstall --provider opencode
```

Removes the MCP server directory and the `pillbox` entry from `~/.config/opencode/opencode.json`.
