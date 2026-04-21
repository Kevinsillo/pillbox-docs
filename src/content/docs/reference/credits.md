---
title: Credits
description: Open-source libraries and packages that power Pillbox.
sidebar:
  order: 39
---

Pillbox is built on top of a set of excellent open-source libraries. This page lists every dependency and its role in the system.

## Rust core

| Crate | Purpose |
|---|---|
| [rusqlite](https://github.com/rusqlite/rusqlite) | SQLite (bundled), FTS5 full-text search |
| [axum](https://github.com/tokio-rs/axum) | HTTP server |
| [tokio](https://tokio.rs) | Async runtime |
| [clap](https://github.com/clap-rs/clap) | CLI argument parsing |
| [inquire](https://github.com/mikaelmello/inquire) | Interactive prompts |
| [indicatif](https://github.com/console-rs/indicatif) | Progress spinners |
| [tabled](https://github.com/zhiburt/tabled) | Terminal tables |
| [owo-colors](https://github.com/jam1garner/owo-colors) | Terminal colors |
| [rust-embed](https://github.com/pyrossh/rust-embed) | Embed WebUI into binary |
| [rust-i18n](https://github.com/longbridgeapp/rust-i18n) | Internationalization (6 languages) |
| [sys-locale](https://github.com/1Password/sys-locale) | Native locale detection (Windows/macOS/Linux) |
| [mdns-sd](https://github.com/keepsimple1/mdns-sd) | mDNS local network discovery |
| [strsim](https://github.com/rapidfuzz/strsim-rs) | Fuzzy string similarity (Jaro-Winkler) |
| [rayon](https://github.com/rayon-rs/rayon) | Data parallelism for fuzzy vocab scanning |
| [serde](https://serde.rs) | Serialization |
| [serde_json](https://github.com/serde-rs/json) | JSON serialization |
| [uuid](https://github.com/uuid-rs/uuid) | UUID v7 generation |
| [dirs](https://github.com/dirs-dev/dirs-rs) | Cross-platform path resolution |
| [reqwest](https://github.com/seanmonstar/reqwest) | HTTP client (MCP/skill downloads) |
| [anyhow](https://github.com/dtolnay/anyhow) | Error handling |
| [thiserror](https://github.com/dtolnay/thiserror) | Typed error enums |

## Web UI

| Package | Purpose |
|---|---|
| [Vue 3](https://vuejs.org) | UI framework (Composition API) |
| [Vite](https://vitejs.dev) | Build tool |
| [Element Plus](https://element-plus.org) | UI component library |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Pinia](https://pinia.vuejs.org) | State management |
| [Vue Router](https://router.vuejs.org) | Client-side routing |
| [vue-i18n](https://vue-i18n.intlify.dev) | Internationalization |
| [unplugin-icons](https://github.com/unplugin/unplugin-icons) | Bundled icon components (Lucide, flag icons) |
| [marked](https://marked.js.org) | Markdown rendering |

## MCP server

| Package | Purpose |
|---|---|
| [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) | MCP protocol |
| [zod](https://zod.dev) | Schema validation |

## History

Pillbox started in April 2026 as a personal tool to give AI coding assistants persistent memory across sessions. It grew from a simple SQLite store to a full CLI, MCP server, and web interface over a few weeks of daily use.

Created and maintained by [Kevin Illanas](https://github.com/Kevinsillo).

## License

PolyForm Noncommercial 1.0.0
