---
title: Skills, agents and commands
description: The pillbox-skills repository — what's included, what each piece does, and how to install it.
sidebar:
  order: 22
---

The [pillbox-skills](https://github.com/Kevinsillo/pillbox-skills) repository contains the skills, agents, and slash commands that extend your AI assistant with Pillbox support and Spec-Driven Development.

## What's included

| Item | Type | What it does |
|---|---|---|
| `pillbox` skill | Skill | Teaches the agent how to use Pillbox MCP tools correctly |
| `sdd` skill | Skill | SDD orchestrator — coordinates the full spec-driven development cycle |
| `sdd-*` agents | Agents | Sub-agents for exploration, specs, design, implementation, verification, and archiving |
| `sdd` commands | Commands | `/sdd:new`, `/sdd:continue`, `/sdd:fix`, `/sdd:explore`, `/sdd:init`, `/sdd:status` |

### Skills

The **Pillbox skill** is a usage guide embedded in the agent's context. It tells the agent when to read context, how to store pills, and when to open or close prescriptions. Without it, the agent can still call MCP tools but will not follow any structured workflow.

The **SDD skill** is an orchestrator. When you invoke an `/sdd:*` command, the skill reads the current project state from Pillbox, selects the appropriate phase, and launches the corresponding sub-agents.

### Agents

SDD sub-agents are specialized Claude agents with narrow responsibilities. The orchestrator launches them in sequence — each one reads the pills from the previous phase and adds its own.

| Agent | Responsibility |
|---|---|
| `sdd-init` | Detects the project stack and saves the initial config |
| `sdd-explorer` | Reads the codebase and saves factual discovery pills |
| `sdd-proposer` | Drafts the change proposal with intent, scope, and risks |
| `sdd-specifier` | Writes Given/When/Then specs per affected domain |
| `sdd-architect` | Produces the file plan, data flow, and cutover strategy |
| `sdd-planner` | Breaks the design into a concrete task checklist |
| `sdd-implementer` | Writes the actual code and marks tasks complete |
| `sdd-verifier` | Validates the implementation against specs — never fixes |
| `sdd-archiver` | Saves the session summary as a capsule |
| `sdd-committer` | Creates the git commit for the implemented changes |

### Commands

Slash commands are shortcuts into the SDD skill. You invoke them from the chat; the skill takes over from there.

| Command | What it does |
|---|---|
| `/sdd:new <change name>` | Starts a full SDD cycle from scratch |
| `/sdd:continue [name]` | Resumes an in-progress cycle |
| `/sdd:status [name]` | Shows the current phase and open prescriptions |
| `/sdd:explore <topic>` | Runs an exploration pass without starting a full cycle |
| `/sdd:fix <bug description>` | Focused fix cycle — exploration and proposal only |
| `/sdd:init` | Initializes Pillbox in a new project |

## Installation

The `pillbox` skill is installed by the main Pillbox installer:

```bash
pillbox skill install
```

The full set — `pillbox` skill, `sdd` skill, all agents, and all commands — is installed by running the skills installer directly:

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/Kevinsillo/pillbox-skills/main/install.sh | bash
```

```powershell
# Windows
irm https://raw.githubusercontent.com/Kevinsillo/pillbox-skills/main/install.ps1 | iex
```

The script detects installed providers (Claude Code and OpenCode), asks which to target, then copies the files to the correct locations.

:::tip
Re-running the installer overwrites existing files. Use it to update skills after pulling a newer version of the repository.
:::

## Install paths

| Provider | Skills | Agents | Commands |
|---|---|---|---|
| Claude Code | `~/.claude/skills/` | `~/.claude/agents/` | `~/.claude/commands/` |
| OpenCode | `~/.config/opencode/skill/` | `~/.config/opencode/agent/` | `~/.config/opencode/command/` |
