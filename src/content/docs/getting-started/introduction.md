---
title: Introduction
description: What Pillbox is, why it exists, and how it fits into your AI agent workflow.
sidebar:
  order: 1
---

Pillbox is a persistent memory layer for AI coding agents. It gives agents a structured place to save decisions, bugs fixed, architecture notes, and session summaries — so they can pick up context at the start of every session instead of starting blind.

## The problem

AI agents forget everything between sessions. If you ask an agent to implement a feature, close the conversation, and come back the next day, it has no memory of what it did, what decisions it made, or why. You end up re-explaining context every time.

## How Pillbox solves it

Pillbox runs as a local binary. It provides an MCP server that exposes memory tools to your agent. The agent calls these tools during its work:

- `pill_store` — saves a piece of knowledge (a decision, a bug fix, an architecture note)
- `bottle_context` — lists all work sessions (prescriptions) for a bottle at session start
- `prescription_context` — drills into a specific session to retrieve its pills
- `capsule_store` — saves personal, cross-project knowledge (conventions, preferences)

All data is stored in a local SQLite database. Nothing leaves your machine.

## Background

Pillbox was directly inspired by [Engram](https://github.com/Gentleman-Programming/engram), a memory plugin for AI agents that demonstrated how persistent, structured knowledge could change the way agents work across sessions. If you haven't looked at it, it's worth knowing about.

The decision to build something new rather than contribute to Engram came from two places. The first was technical: Engram is a Node.js plugin and Pillbox needed to be a standalone binary — fast, with no runtime requirement, and with a data model designed specifically around how agents save and retrieve context. The second was practical: Engram's PR review process moves slowly, and the features and fixes that mattered most were taking too long to land.

Neither of these is a criticism of Engram. They are honest reasons why starting from scratch made more sense than waiting. Pillbox is a different tool with a different technical approach — if Engram fits your workflow, use it.

## Built for performance

Pillbox was built from scratch in Rust — not as a wrapper around an existing solution, but because the use case demanded it. A memory layer that agents call on every session needs to be fast, reliable, and have no runtime overhead.

The result is a single binary with no external dependencies, backed by SQLite with a schema designed to scale across thousands of sessions and projects. FTS5 full-text search with fuzzy matching runs in milliseconds. The MCP server is a thin bridge — all persistence logic lives in the Rust core.

## The human role

Pillbox is designed around the agent as the primary actor. The agent opens sessions, saves knowledge, and retrieves context — the human mostly stays out of the way.

The web UI exists for a specific purpose: letting you review and correct what your agents have saved. Agents occasionally save redundant, wrong, or poorly-worded entries. The UI gives you a way to spot those and fix them without touching the CLI. Editing and deleting are possible, but the UI is not a knowledge management tool — it's a supervision layer.

## The four entities

| Entity | What it is |
|---|---|
| **Bottle** | A project. Maps a directory to a database. |
| **Prescription** | A work session within a bottle. Multiple can be open simultaneously. |
| **Pill** | A piece of project knowledge saved during a session. |
| **Capsule** | Personal, cross-project knowledge. Conventions, preferences. |

See [Concepts](../../concepts/overview/) for the full model.

## What you need to set it up

1. Install the `pillbox` binary
2. Initialize a bottle in your project (`pillbox bottle init`)
3. Install the MCP server (`pillbox mcp install`)
4. Install the skill for your agent (`pillbox skill install`)

The quick start walks through all of this in under five minutes.
