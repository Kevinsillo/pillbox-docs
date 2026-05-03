---
title: Web interface
description: The Pillbox web UI — a local supervision layer for reviewing and correcting what your agents have saved.
sidebar:
  order: 22
---

The Pillbox web UI is a local interface for reviewing the knowledge your agents have accumulated. It is not a note-taking tool — the agent is the primary writer. The UI is for the human.

## Starting the server

The server runs as a system service (systemd on Linux, launchd on macOS). Install it once, then use `start` and `stop` as needed.

```bash
pillbox serve install        # install the service (first time)
pillbox serve start          # start the server
```

Open `http://pillbox.local:4242` in your browser. If the install did not have permission to modify the hosts file, use `http://localhost:4242` instead.

```bash
pillbox serve install --port 8080   # custom port
pillbox serve status                 # check status
pillbox serve stop                   # stop the server
pillbox serve uninstall              # remove the system service
```

## What you can do

The UI gives you read and write access to everything Pillbox stores:

- **Bottles** — see all registered projects and their scope (local/global)
- **Prescriptions** — browse work sessions by project, see their pills
- **Pills** — read full pill content, edit title or content, discard (archive) or permanently delete (purge) archived entries
- **Capsules** — review personal cross-project knowledge, correct, discard, or permanently delete archived entries

## When to use it

The agent decides what to save and how to phrase it. Most of the time that's fine. But occasionally you'll find entries that are:

- **Redundant** — the agent saved the same decision twice in different words
- **Outdated** — a pill describes an approach that was later changed
- **Poorly scoped** — something saved as a capsule (global) that should be project-specific, or vice versa
- **Wrong** — a bug fix that describes the wrong root cause

The UI is where you fix those. Edit the content, correct the compound, or discard the entry entirely.

## What the UI is not for

The UI is not designed as a primary interface for creating knowledge. There are no forms for opening prescriptions or saving new pills from the browser. That workflow belongs to the agent — triggered through the MCP tools during an active session.

:::tip
If you find yourself frequently editing agent-saved entries, it's usually a signal to tune the skill or the agent's prompting — not to manage memory manually.
:::
