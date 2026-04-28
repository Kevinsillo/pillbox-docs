---
title: Referencia CLI
description: Todos los comandos CLI de Pillbox — serve, bottle, prescription, MCP, skill e idioma.
sidebar:
  order: 30
---

El CLI de `pillbox` está diseñado para operadores humanos y tareas de configuración. El agente interactúa con Pillbox mediante el servidor MCP, no el CLI.

## `pillbox status`

Muestra el estado global: ruta del binario, bases de datos global y local, bottle activo, servidor HTTP, servidor MCP y skill.

## Comandos serve

### `pillbox serve start [--port N]`

Inicia el servidor HTTP como proceso en segundo plano. Puerto por defecto: 4242.

```bash
pillbox serve start
pillbox serve start --port 8080
```

La interfaz web está disponible en `http://localhost:<puerto>`.

### `pillbox serve stop`

Detiene el servidor en segundo plano.

### `pillbox serve status`

Muestra si el servidor está corriendo y en qué puerto.

## Comandos bottle

### `pillbox bottle init`

Asistente interactivo para inicializar un bottle en el directorio actual.

1. Pide un nombre para mostrar (por defecto: nombre del directorio)
2. Pide el alcance: `local` o `global`
3. Crea la base de datos y ejecuta las migraciones
4. Si es local y está en un repositorio git: ofrece añadir `.pillbox/` al `.gitignore`

### `pillbox bottle status`

Estado del bottle en el directorio actual.

### `pillbox bottle list`

Lista todos los bottles registrados en la base de datos global.

### `pillbox bottle migrate [--reverse] [--capsules]`

Migra un bottle entre las bases de datos local y global usando upsert por `sync_id`.

```bash
pillbox bottle migrate              # local → global
pillbox bottle migrate --reverse    # global → local
```

### `pillbox bottle delete <slug>`

Elimina un bottle del registro global. Requiere escribir el slug para confirmar — la operación no se puede deshacer.

```bash
pillbox bottle delete mi-proyecto
```

El comando muestra el nombre, slug y ruta de la base de datos del bottle antes de pedir confirmación.

### `pillbox bottle repair <slug>`

Actualiza la ruta de la base de datos de un bottle desvinculado — uno cuyo archivo `.pillbox/pillbox.db` ya no existe en la ubicación registrada (por ejemplo, después de mover un proyecto a un nuevo directorio).

```bash
pillbox bottle repair mi-proyecto
```

Pide la nueva ruta absoluta al archivo `pillbox.db`. La ruta debe existir y ser un archivo; si no existe, el comando termina con error sin hacer cambios.

## Comandos prescription

### `pillbox prescription open "<título>"`

Abre una nueva prescription (sesión de trabajo) para el bottle actual.

```bash
pillbox prescription open "Implementar login OAuth"
```

Falla si ya hay una prescription abierta — ciérrala primero con `pillbox prescription close`.

### `pillbox prescription list [-l N]`

Lista las prescriptions más recientes del bottle actual.

```bash
pillbox prescription list
pillbox prescription list -l 25
```

### `pillbox prescription close`

Cierra la prescription abierta del bottle actual.

## Comandos pills

### `pillbox pills list`

Lista todas las pills del bottle actual, ordenadas por fecha de creación (más recientes primero).

## Comandos capsule

### `pillbox capsule list [-l N]`

Lista las capsules globales — activas primero, archivadas (soft-deleted) en una sección separada al final.

```bash
pillbox capsule list
pillbox capsule list -l 100
```

### `pillbox capsule show <id>`

Muestra el detalle completo de una capsule por ID numérico, incluyendo si está archivada.

```bash
pillbox capsule show 7
```

## Comandos MCP

### `pillbox mcp install`

Descarga el servidor MCP desde la última release de GitHub y lo instala en `~/.pillbox/mcp/`. Requiere Node.js ≥ 18. Registra automáticamente la entrada en `~/.claude.json`.

### `pillbox mcp uninstall`

Elimina el directorio del servidor MCP y su entrada de `~/.claude.json`.

## Comandos skill

### `pillbox skill install`

Descarga la skill de Claude Code desde la última release de GitHub y la instala en `~/.claude/skills/pillbox/`.

### `pillbox skill uninstall`

Elimina el directorio de la skill.

## Comandos de idioma

### `pillbox lang`

Muestra el idioma actual y las opciones disponibles.

```
Current language: Español (es)

es    Español  ● activo
en    English
de    Deutsch
it    Italiano
pt    Português
fr    Français
```

### `pillbox lang set <código>`

Establece el idioma del CLI. Se guarda en `~/.pillbox/lang`.

```bash
pillbox lang set es
pillbox lang set en
```

Códigos soportados: `es`, `en`, `de`, `it`, `pt`, `fr`.

Orden de detección del idioma: `~/.pillbox/lang` → variable de entorno `PILLBOX_LANG` → idioma del sistema → fallback `es`.

## `pillbox uninstall`

Eliminación interactiva de los componentes de Pillbox. Pregunta antes de cada paso: servidor MCP, skill, base de datos global, binario.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PILLBOX_LANG` | Sobreescribe la detección de idioma (ej. `PILLBOX_LANG=en`) |
| `PILLBOX_VERSION` | Versión a instalar (usada por `install.sh`) |
| `PILLBOX_INSTALL_DIR` | Directorio de instalación del binario |
| `RUST_LOG` | Nivel de log del servidor (ej. `RUST_LOG=info pillbox serve start`) |
