---
title: Créditos
description: Librerías y paquetes de código abierto que dan vida a Pillbox.
sidebar:
  order: 39
---

Pillbox está construido sobre un conjunto de excelentes librerías de código abierto. Esta página lista todas las dependencias y su rol en el sistema.

## Core Rust

| Crate | Propósito |
|---|---|
| [rusqlite](https://github.com/rusqlite/rusqlite) | SQLite (incluido), búsqueda de texto completo FTS5 |
| [axum](https://github.com/tokio-rs/axum) | Servidor HTTP |
| [tokio](https://tokio.rs) | Runtime asíncrono |
| [clap](https://github.com/clap-rs/clap) | Parseo de argumentos CLI |
| [inquire](https://github.com/mikaelmello/inquire) | Prompts interactivos |
| [indicatif](https://github.com/console-rs/indicatif) | Spinners de progreso |
| [tabled](https://github.com/zhiburt/tabled) | Tablas en terminal |
| [owo-colors](https://github.com/jam1garner/owo-colors) | Colores en terminal |
| [rust-embed](https://github.com/pyrossh/rust-embed) | Embeber WebUI en el binario |
| [rust-i18n](https://github.com/longbridgeapp/rust-i18n) | Internacionalización (6 idiomas) |
| [sys-locale](https://github.com/1Password/sys-locale) | Detección de locale nativo (Windows/macOS/Linux) |
| [mdns-sd](https://github.com/keepsimple1/mdns-sd) | Descubrimiento de red local mDNS |
| [strsim](https://github.com/rapidfuzz/strsim-rs) | Similitud de cadenas difusa (Jaro-Winkler) |
| [rayon](https://github.com/rayon-rs/rayon) | Paralelismo de datos para escaneo de vocabulario difuso |
| [serde](https://serde.rs) | Serialización |
| [serde_json](https://github.com/serde-rs/json) | Serialización JSON |
| [uuid](https://github.com/uuid-rs/uuid) | Generación de UUID v7 |
| [dirs](https://github.com/dirs-dev/dirs-rs) | Resolución de rutas entre plataformas |
| [reqwest](https://github.com/seanmonstar/reqwest) | Cliente HTTP (descargas de MCP/skill) |
| [anyhow](https://github.com/dtolnay/anyhow) | Gestión de errores |
| [thiserror](https://github.com/dtolnay/thiserror) | Enums de error tipados |

## Interfaz web

| Paquete | Propósito |
|---|---|
| [Vue 3](https://vuejs.org) | Framework de UI (Composition API) |
| [Vite](https://vitejs.dev) | Herramienta de construcción |
| [Element Plus](https://element-plus.org) | Librería de componentes UI |
| [Tailwind CSS](https://tailwindcss.com) | Estilos |
| [Pinia](https://pinia.vuejs.org) | Gestión de estado |
| [Vue Router](https://router.vuejs.org) | Enrutamiento del lado del cliente |
| [vue-i18n](https://vue-i18n.intlify.dev) | Internacionalización |
| [unplugin-icons](https://github.com/unplugin/unplugin-icons) | Componentes de iconos empaquetados (Lucide, iconos de banderas) |
| [marked](https://marked.js.org) | Renderizado de Markdown |

## Servidor MCP

| Paquete | Propósito |
|---|---|
| [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) | Protocolo MCP |
| [zod](https://zod.dev) | Validación de esquemas |

## Historia

Pillbox comenzó en abril de 2026 como una herramienta personal para dar a los asistentes de codificación IA memoria persistente entre sesiones. Creció de un simple almacén SQLite a un CLI completo, servidor MCP e interfaz web en pocas semanas de uso diario.

Creado y mantenido por [Kevin Illanas](https://github.com/Kevinsillo).

## Licencia

[PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) — uso no comercial gratuito.
