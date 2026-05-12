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

### `pillbox serve`

Muestra el estado del servicio si está instalado. Si no está instalado, muestra un aviso con el comando para instalarlo.

### `pillbox serve install [--port N]`

Registra el servidor HTTP como servicio del sistema y habilita el arranque automático al iniciar el equipo. Puerto por defecto: 4242.

```bash
pillbox serve install
pillbox serve install --port 8080
```

También añade `pillbox.local` al fichero hosts del sistema para acceder por nombre en lugar de `localhost`. Requiere permisos de escritura en el fichero hosts (sudo en Linux/macOS, administrador en Windows); si no los tiene, el servicio se instala igualmente y el acceso queda disponible en `http://localhost:<puerto>`.

### `pillbox serve uninstall`

Elimina el servicio del sistema y la entrada `pillbox.local` del fichero hosts.

### `pillbox serve start`

Arranca el servicio. El servicio debe estar instalado previamente con `pillbox serve install`.

### `pillbox serve stop`

Detiene el servicio.

### `pillbox serve status`

Muestra si el servidor está corriendo y la URL de acceso.

## Comandos bottle

### `pillbox bottle init`

Asistente interactivo para inicializar un bottle en el directorio actual.

1. Pide un nombre para mostrar (por defecto: nombre del directorio)
2. Pide el alcance: `local` o `global`
3. Crea la base de datos y ejecuta las migraciones
4. Si es local y está en un repositorio git: ofrece añadir `.pillbox/` al `.gitignore`

### `pillbox bottle status`

Estado del bottle en el directorio actual.

### `pillbox bottle list [-l N]`

Lista todos los bottles registrados en la base de datos global. Por defecto: 20.

```bash
pillbox bottle list
pillbox bottle list -l 50
```

### `pillbox bottle migrate <global|local>`

Mueve las prescripciones y pills de un bottle entre las bases de datos local y global. Pide confirmación y actualiza el scope del bottle automáticamente.

**`global`:** mueve el bottle del directorio actual a la base de datos global y elimina el archivo de base de datos local (`.pillbox/pillbox.db`).

**`local`:** muestra un listado interactivo de bottles globales; mueve el seleccionado a la base de datos local y lo elimina del global. Falla si el directorio ya tiene un bottle local.

```bash
pillbox bottle migrate global    # local → global (elimina el archivo de BD local)
pillbox bottle migrate local     # global → local (elimina el bottle del global)
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

### `pillbox bottle vinculate [directorio]`

Registra una base de datos local existente en el registro global del usuario actual. Útil cuando un segundo usuario del sistema necesita acceder a un bottle creado por otro usuario en la misma máquina — por ejemplo, cuando dos usuarios comparten un directorio de proyecto.

`directorio` es opcional y usa el directorio de trabajo actual por defecto.

```bash
pillbox bottle vinculate                           # vincula el bottle del directorio actual
pillbox bottle vinculate /home/alice/mi-proyecto   # vincula el bottle en la ruta indicada
```

El comando lee el bottle de `<directorio>/.pillbox/pillbox.db` y lo añade a `~/.pillbox/pillbox.db`. La operación es idempotente — ejecutarla dos veces reporta "ya vinculado" sin error.

Condiciones de error:

- `.pillbox/pillbox.db` no encontrado en la ruta resuelta — sale con código 1
- La ruta resuelta es la propia base de datos global (enlace circular) — sale con código 1
- La base de datos local no contiene ningún bottle — sale con código 1

## Comandos prescription

### `pillbox prescription open "<título>"`

Abre una nueva prescription (sesión de trabajo) para el bottle actual.

```bash
pillbox prescription open "Implementar login OAuth"
```

Falla si ya hay una prescription abierta — ciérrala primero con `pillbox prescription close`.

### `pillbox prescription list [-l N]`

Lista las prescriptions más recientes del bottle actual. Por defecto: 10.

```bash
pillbox prescription list
pillbox prescription list -l 25
```

### `pillbox prescription show <id> [-l N]`

Muestra el detalle completo de una prescription y todas sus pills. Acepta el ID completo o un prefijo corto. Por defecto muestra 20 pills; usa `-l` para cambiar el límite.

```bash
pillbox prescription show abc123
pillbox prescription show abc123 -l 50
```

### `pillbox prescription close`

Cierra la prescription abierta del bottle actual.

## Comandos pill

### `pillbox pill show <id>`

Muestra el detalle completo de una pill por su ID numérico. Funciona aunque la pill esté archivada.

```bash
pillbox pill show 42
```

## Comandos capsule

### `pillbox capsule list [-l N]`

Lista las capsules globales — activas primero, archivadas (soft-deleted) en una sección separada al final. Por defecto: 50.

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
