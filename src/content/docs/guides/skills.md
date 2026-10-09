---
title: Skills, agents and commands
description: The Pillbox agent skill — install the AI coding assistant skill that guides your agent to save and retrieve persistent memory automatically across sessions.
sidebar:
  order: 22
---

The [pillbox-skills](https://github.com/Kevinsillo/pillbox-skills) repository contains the skills, agents, and slash commands that extend your AI assistant with Pillbox support and Spec-Driven Development.

## What's included

| Item | Type | What it does |
|---|---|---|
| `pillbox` skill | Skill | Teaches the agent how to use Pillbox MCP tools correctly |
| `sdd` skill | Skill | SDD orchestrator — coordinates the full spec-driven development cycle |
| `code-quality` skill | Skill | Quality bar for all code — hexagonal architecture, clean code, KISS, idiomatic conventions, no hacks |
| `sdd-*` agents | Agents | Five sub-agents for project setup, exploration, design, implementation and verification |
| `sdd` commands | Commands | `/sdd:new`, `/sdd:continue`, `/sdd:fix`, `/sdd:explore`, `/sdd:init`, `/sdd:status` |

### Skills

The **Pillbox skill** is a usage guide embedded in the agent's context. It tells the agent when to read context, how to store pills, and when to open or close prescriptions. Without it, the agent can still call MCP tools but will not follow any structured workflow.

The **SDD skill** is an orchestrator. When you invoke an `/sdd:*` command, the skill reads the current project state from Pillbox, selects the appropriate phase, and launches the corresponding sub-agents.

### Agents

SDD sub-agents are specialized agents with narrow responsibilities. The orchestrator hands them **pill IDs**, not pasted content: each agent reads what it needs from Pillbox, writes its own pills and revises them in place when something changes.

| Agent | Responsibility | Pills (compound) |
|---|---|---|
| `sdd-init` | Detects the project stack and saves the project config | `config` |
| `sdd-explorer` | Reads the codebase; returns facts, open questions and a suggested tier | `discovery` |
| `sdd-designer` | Writes Given/When/Then specs (only when the change has behaviour rules) and the task batches: file plan, acceptance criteria and verification commands | `specification`, `task` |
| `sdd-implementer` | Writes the code for one batch, runs the verification commands, records the evidence in the task pill and commits when authorized | revises `task` |
| `sdd-verifier` | Independently validates the result against specs, tasks and code quality — never fixes | `feedback` |

The orchestrator itself writes two pills: `decision` (intent, scope, constraints, choices and risks) and `summary` (the session recap that closes the prescription).

Each agent writes only its own compounds, but reads whatever pills it needs from the others — the designer reads the `decision` and `discovery` pills, the implementer reads the `task` and `specification` pills, and so on. Corrections revise the existing pill instead of adding a new one, and each domain keeps a single current `specification`: when a later change rewrites it, the new pill carries `Supersedes: #id` and the old one is discarded when the cycle closes.

The **code-quality skill** is the single quality bar of the cycle, rather than imitation of the existing code. Claude Code preloads it into the designer, implementer and verifier; OpenCode agents load it themselves. The designer designs within its architecture, the implementer reviews its own diff against it, and the verifier reports hacks that hide a failure as critical and any other breach as a warning. When the Context7 MCP server is installed, the three of them query it for current documentation instead of guessing an idiom or an API.

### How a cycle runs

1. The explorer maps the code and returns the open questions.
2. The orchestrator asks you **once** — open questions, testing preferences, tier and commit policy — and writes the `decision` pill.
3. The designer produces the specs and the task batches. You see one consolidated plan before any code is written.
4. The implementer runs batch after batch. The cycle only stops for a new decision, a failing check or a blocker.
5. The result is verified according to the tier. The orchestrator commits if you chose to commit at close, saves the `summary` pill, discards the specifications this change superseded and closes the prescription.

| Tier | When | What runs |
|---|---|---|
| `small` | Up to three files, understood, no new behaviour rules | Decision with its own short task list, implementer, summary |
| `standard` | Two or more meaningful steps | Explorer, decision, designer, implementer, summary |
| `large` | Phases, migrations, cutover, sensitive areas | Standard, with one task pill per batch and the independent verifier |

Commits always follow the policy you chose — per batch, at close or none — whatever the tier.

Every compound has a soft size target below the 5000-character limit of a pill — for example 1500 for `discovery`, 3500 for `decision`, 4000 for `specification`, and 3000 for `task` at design time, leaving room for the implementer's evidence. Long content is split by natural unit (one domain, one batch), so each pill stays searchable on its own.

### Commands

Slash commands are shortcuts into the SDD skill. You invoke them from the chat; the skill takes over from there.

| Command | What it does |
|---|---|
| `/sdd:new <change name>` | Starts a cycle: exploration, one round of questions, decision and task plan |
| `/sdd:continue [name]` | Runs or resumes the implementation batch by batch, then verifies and closes |
| `/sdd:status [name]` | Shows the current phase and open prescriptions |
| `/sdd:explore <topic>` | Runs an exploration pass without starting a full cycle |
| `/sdd:fix <bug description>` | Focused fix for a bounded bug — the `small` tier of the cycle |
| `/sdd:init` | Initializes Pillbox in a new project |

## Installation

The `pillbox` skill is installed by the main Pillbox installer:

```bash
pillbox skill install
```

The full set — `pillbox`, `sdd` and `code-quality` skills, all agents, and all commands — is installed by running the skills installer directly:

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
| OpenCode | `~/.config/opencode/skills/` | `~/.config/opencode/agents/` | `~/.config/opencode/commands/` |
