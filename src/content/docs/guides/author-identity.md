---
title: Author identity
description: How Pillbox resolves the name and email of the human user behind the agent, and how to configure them manually.
sidebar:
  order: 23
---

Every pill and prescription records who created it. Pillbox resolves this identity automatically — in most cases you do not need to configure anything.

## How resolution works

When an agent calls `pill_store` or `prescription_open`, it resolves the author name and email in three steps, in order:

**Step 1 — git config**

Reads `git config user.name` and `git config user.email` from the current repository. If the project has git configured with your data, Pillbox uses it directly.

**Step 2 — identity.json**

If git returns no value (for example, in a directory without a repository or with git unconfigured), it reads `~/.pillbox/identity.json`. If the file exists and contains the `name` and `email` fields, it uses them.

**Step 3 — asks the user**

If neither of the previous steps returns a value, the agent asks you directly for your name and email. Once you respond, it saves the data to `~/.pillbox/identity.json` so it will not ask again in future sessions.

## The identity.json file

The file lives at `~/.pillbox/identity.json` and has this structure:

```json
{
  "name": "Your name",
  "email": "you@email.com"
}
```

You can create or edit it manually at any time. Pillbox will read it on the next invocation.

:::tip
If you use multiple machines or contexts with different identities, step 1 (git config) takes priority — configure git per repository with `git config user.name` and `git config user.email` to override the global file.
:::

## When the identity is used

The author identity is attached to:

- Every **pill** created with `pill_store`
- Every **prescription** opened with `prescription_open`

**Capsules** also accept `author_name` and `author_email` in `capsule_store`, with the same resolution logic.
