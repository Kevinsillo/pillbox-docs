---
title: Design philosophy
description: Why Pillbox exists, what problem it solves, and the principles behind its data model.
sidebar:
  order: 11
---

AI agents are stateless by nature. Each session starts from scratch — no memory of past decisions, no context about why things were built the way they were, no awareness of what failed last week. Pillbox exists to change that.

## The core problem

When an agent helps you build something across multiple sessions, it loses context every time. It may re-explore the same code, re-discover the same gotchas, propose approaches you already rejected, or miss constraints that were discovered through hard experience. The knowledge is created, used once, and discarded.

Pillbox is a persistent memory layer that gives agents access to structured, searchable knowledge that accumulates over time.

## Two kinds of knowledge

The most important design decision in Pillbox is separating project knowledge from personal knowledge.

**Pills** belong to a project. They capture what the agent learned while working in a specific codebase — decisions made, bugs fixed, patterns found, architecture choices with their rationale. Pills are scoped to a bottle and require an open prescription. They die with the project.

**Capsules** belong to the user. They capture preferences, workflows, and conventions that apply across every project — how you like commits formatted, how you prefer PRs reviewed, what your development environment looks like. Capsules have no project scope. An agent searching capsules at the start of any session will find the same personal context regardless of which project it's working on.

This separation keeps project knowledge and personal knowledge from polluting each other.

## The prescription as a contract

A prescription is more than a session container. It is a commitment: before saving any knowledge, the agent must declare what it is working on. This title becomes the anchor for everything saved during that session.

Multiple prescriptions can be open in a bottle at the same time, so parallel streams of work — a feature, a refactor, a hotfix — can each accumulate knowledge under their own anchor without serializing. The discipline stays the same: every pill is attributed to a prescription, and the agent decides which session a piece of knowledge belongs to. How many prescriptions stay open at once is the user's choice; Pillbox does not impose a singular focus, it just makes sure nothing is saved without one.

## Search as the primary interface

Pillbox is not a key-value store. There are no named keys, no hierarchical paths, no retrieval by ID as the primary flow. The primary interface is search.

Everything saved is indexed with FTS5 full-text search across title and content. Prefix matching and Jaro-Winkler fuzzy matching ensure that searches for `hex` find `hexagonal`, and `authn` finds `authentication`. When a query contains multiple terms, Pillbox first runs an OR search across all of them via FTS5; if that yields zero results, it automatically retries using Jaro-Winkler to broaden the match. Closed prescriptions remain fully searchable — the knowledge accumulated in past sessions is always available to future ones.

This design means that the value of Pillbox grows with use. A bottle with a hundred pills from twenty past sessions gives an agent significantly more context than a fresh one.

## Compounds give structure without enforcing it

Every pill and capsule has a compound — a free-text string that classifies what kind of knowledge it contains. Pillbox does not define or validate any specific compound values. The agent, or the skill it runs with, decides what compounds to use and what they mean.

This flexibility is intentional. An agent that saves everything with a single compound will still benefit from full-text search. But meaningful compounds enable targeted retrieval — filtering by type, reconstructing a timeline of past sessions, or scoping a search to a specific category of knowledge. The structure pays off at scale, and it belongs to the workflow layer, not to Pillbox itself.

## Designed for agents, readable by humans

Pills and capsules are text. The web interface makes them readable and deletable by humans. The MCP and HTTP API make them writable and searchable by agents.

The intended workflow is asymmetric by design: agents write, humans review and prune. An agent should not pause to ask whether a decision is worth remembering — it should save and move on. Humans decide what to keep through occasional review, not by gatekeeping every write.

## How to use Pillbox

Pillbox does not prescribe a specific workflow. The minimum viable pattern is:

1. At the start of a session, call `bottle_context` and `capsule_search` with terms relevant to the current task.
2. During the session, call `pill_store` when something worth remembering happens — a non-obvious decision, a bug found and fixed, a constraint discovered.
3. At the end of the session, save a session summary pill and call `prescription_close`.

Beyond this minimum, teams build on Pillbox in different ways. Some integrate it into structured development workflows where every design decision, spec, and implementation task is tracked as pills. Others use it as a lightweight journal that runs alongside any coding session. Both approaches work — the data model supports either.

:::tip
If you work with an AI agent on recurring projects, the single highest-value habit is closing every session with a summary pill. Future sessions that call `bottle_context` will surface these summaries first, giving the agent an immediate understanding of what was done and why.
:::
