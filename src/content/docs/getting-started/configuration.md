---
title: Initial configuration
description: How Pillbox identifies the human user behind the agent before saving the first pill.
sidebar:
  order: 4
---

Before saving the first pill or prescription, Pillbox needs to know who you are. This identity is attached to every memory entry as the author, making it possible to know which agent saved what, in which session, and who they were working with.

## Author identity

When an agent calls `pill_store` or `prescription_open`, it resolves your identity in three steps:

1. Reads `git config user.name` and `git config user.email` from the current repository.
2. If there is no git configuration, reads `~/.pillbox/identity.json`.
3. If the file does not exist either, asks you directly and saves your answer to `~/.pillbox/identity.json` for future sessions.

In most cases you do not need to do anything — if you have git configured with a name and email, Pillbox will use them automatically.

See the [author identity guide](/guides/author-identity/) for the file format and how to configure it manually.
