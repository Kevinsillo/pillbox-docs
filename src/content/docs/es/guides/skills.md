---
title: Skills, agentes y comandos
description: El repositorio pillbox-skills — qué incluye, qué hace cada pieza y cómo instalarlo.
sidebar:
  order: 22
---

El repositorio [pillbox-skills](https://github.com/Kevinsillo/pillbox-skills) contiene las skills, agentes y comandos de barra que extienden tu asistente de IA con soporte para Pillbox y Spec-Driven Development.

## Qué incluye

| Elemento | Tipo | Qué hace |
|---|---|---|
| Skill `pillbox` | Skill | Enseña al agente cómo usar las herramientas MCP de Pillbox correctamente |
| Skill `sdd` | Skill | Orquestador SDD — coordina el ciclo completo de desarrollo guiado por specs |
| Agentes `sdd-*` | Agentes | Sub-agentes para exploración, specs, diseño, implementación, verificación y archivado |
| Comandos `sdd` | Comandos | `/sdd:new`, `/sdd:continue`, `/sdd:fix`, `/sdd:explore`, `/sdd:init`, `/sdd:status` |

### Skills

La **skill Pillbox** es una guía de uso integrada en el contexto del agente. Le indica cuándo leer contexto, cómo almacenar pills y cuándo abrir o cerrar prescriptions. Sin ella, el agente puede llamar a las herramientas MCP pero no seguirá ningún flujo de trabajo estructurado.

La **skill SDD** es un orquestador. Al invocar un comando `/sdd:*`, la skill lee el estado actual del proyecto desde Pillbox, selecciona la fase apropiada y lanza los sub-agentes correspondientes.

### Agentes

Los sub-agentes SDD son agentes especializados con responsabilidades acotadas. El orquestador los lanza en secuencia — cada uno lee las pills de la fase anterior y añade las suyas.

| Agente | Responsabilidad |
|---|---|
| `sdd-init` | Detecta el stack del proyecto y guarda la configuración inicial |
| `sdd-explorer` | Lee el código y guarda pills de descubrimiento factual |
| `sdd-proposer` | Redacta la propuesta de cambio con intención, alcance y riesgos |
| `sdd-specifier` | Escribe specs Given/When/Then por dominio afectado |
| `sdd-architect` | Produce el plan de ficheros, flujo de datos y estrategia de cutover |
| `sdd-planner` | Descompone el diseño en una lista de tareas concreta |
| `sdd-implementer` | Escribe el código real y marca las tareas como completadas |
| `sdd-verifier` | Valida la implementación contra las specs — nunca corrige |
| `sdd-archiver` | Guarda el resumen de sesión como cápsula |
| `sdd-committer` | Crea el commit de git para los cambios implementados |

### Comandos

Los comandos de barra son atajos hacia la skill SDD. Los invocas desde el chat; la skill toma el control a partir de ahí.

| Comando | Qué hace |
|---|---|
| `/sdd:new <nombre del cambio>` | Inicia un ciclo SDD completo desde cero |
| `/sdd:continue [nombre]` | Retoma un ciclo en curso |
| `/sdd:status [nombre]` | Muestra la fase actual y las prescriptions abiertas |
| `/sdd:explore <tema>` | Ejecuta una pasada de exploración sin iniciar un ciclo completo |
| `/sdd:fix <descripción del bug>` | Ciclo de corrección focalizado — solo exploración y propuesta |
| `/sdd:init` | Inicializa Pillbox en un nuevo proyecto |

## Instalación

La skill `pillbox` se instala con el instalador principal de Pillbox:

```bash
pillbox skill install
```

El conjunto completo — skill `pillbox`, skill `sdd`, todos los agentes y todos los comandos — se instala ejecutando el instalador de skills directamente:

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/Kevinsillo/pillbox-skills/main/install.sh | bash
```

```powershell
# Windows
irm https://raw.githubusercontent.com/Kevinsillo/pillbox-skills/main/install.ps1 | iex
```

El script detecta los proveedores instalados (Claude Code y OpenCode), pregunta a cuál apuntar y copia los ficheros en las rutas correctas.

:::tip
Volver a ejecutar el instalador sobreescribe los ficheros existentes. Úsalo para actualizar las skills después de obtener una versión más reciente del repositorio.
:::

## Rutas de instalación

| Proveedor | Skills | Agentes | Comandos |
|---|---|---|---|
| Claude Code | `~/.claude/skills/` | `~/.claude/agents/` | `~/.claude/commands/` |
| OpenCode | `~/.config/opencode/skill/` | `~/.config/opencode/agent/` | `~/.config/opencode/command/` |
