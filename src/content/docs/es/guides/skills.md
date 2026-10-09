---
title: Skills, agentes y comandos
description: La skill de agente de Pillbox — instala la skill que guía a tu agente IA para guardar y recuperar memoria persistente automáticamente en cada sesión.
sidebar:
  order: 22
---

El repositorio [pillbox-skills](https://github.com/Kevinsillo/pillbox-skills) contiene las skills, agentes y comandos de barra que extienden tu asistente de IA con soporte para Pillbox y Spec-Driven Development.

## Qué incluye

| Elemento | Tipo | Qué hace |
|---|---|---|
| Skill `pillbox` | Skill | Enseña al agente cómo usar las herramientas MCP de Pillbox correctamente |
| Skill `sdd` | Skill | Orquestador SDD — coordina el ciclo completo de desarrollo guiado por specs |
| Skill `code-quality` | Skill | Listón de calidad para todo el código — arquitectura hexagonal, clean code, KISS, convenciones idiomáticas, sin hacks |
| Agentes `sdd-*` | Agentes | Cinco sub-agentes para configuración del proyecto, exploración, diseño, implementación y verificación |
| Comandos `sdd` | Comandos | `/sdd:new`, `/sdd:continue`, `/sdd:fix`, `/sdd:explore`, `/sdd:init`, `/sdd:status` |

### Skills

La **skill Pillbox** es una guía de uso integrada en el contexto del agente. Le indica cuándo leer contexto, cómo almacenar pills y cuándo abrir o cerrar prescriptions. Sin ella, el agente puede llamar a las herramientas MCP pero no seguirá ningún flujo de trabajo estructurado.

La **skill SDD** es un orquestador. Al invocar un comando `/sdd:*`, la skill lee el estado actual del proyecto desde Pillbox, selecciona la fase apropiada y lanza los sub-agentes correspondientes.

### Agentes

Los sub-agentes SDD son agentes especializados con responsabilidades acotadas. El orquestador les pasa **IDs de pills**, no contenido pegado: cada agente lee de Pillbox lo que necesita, escribe sus propias pills y las revisa en sitio cuando algo cambia.

| Agente | Responsabilidad | Pills (compound) |
|---|---|---|
| `sdd-init` | Detecta el stack del proyecto y guarda la configuración | `config` |
| `sdd-explorer` | Lee el código; devuelve hechos, preguntas abiertas y un nivel sugerido | `discovery` |
| `sdd-designer` | Escribe las specs Given/When/Then (solo si el cambio tiene reglas de comportamiento) y los lotes de tareas: plan de ficheros, criterios de aceptación y comandos de verificación | `specification`, `task` |
| `sdd-implementer` | Escribe el código de un lote, ejecuta los comandos de verificación, registra la evidencia en la pill de tareas y commitea si está autorizado | revisa `task` |
| `sdd-verifier` | Valida el resultado de forma independiente contra specs, tareas y calidad del código — nunca corrige | `feedback` |

El propio orquestador escribe dos pills: `decision` (intención, alcance, restricciones, elecciones y riesgos) y `summary` (el resumen de sesión con el que se cierra la prescription).

Cada agente escribe solo sus propios compounds, pero lee las pills de los demás que necesita — el designer lee las pills `decision` y `discovery`, el implementer lee las pills `task` y `specification`, y así sucesivamente. Las correcciones revisan la pill existente en lugar de añadir una nueva, y cada dominio mantiene una única `specification` vigente: cuando un cambio posterior la reescribe, la pill nueva lleva `Supersedes: #id` y la antigua se descarta al cerrar el ciclo.

La **skill code-quality** es el único listón de calidad del ciclo, en lugar de imitar el código existente. Claude Code la precarga en el designer, el implementer y el verifier; los agentes de OpenCode la cargan ellos mismos. El designer diseña dentro de su arquitectura, el implementer revisa su propio diff contra ella y el verifier reporta como críticos los hacks que ocultan un fallo y como avisos cualquier otro incumplimiento. Si el servidor MCP de Context7 está instalado, los tres lo consultan para obtener documentación actualizada en lugar de adivinar un idiom o una API.

### Cómo transcurre un ciclo

1. El explorer mapea el código y devuelve las preguntas abiertas.
2. El orquestador te pregunta **una sola vez** — preguntas abiertas, preferencias de testing, nivel y política de commits — y escribe la pill `decision`.
3. El designer produce las specs y los lotes de tareas. Ves un plan consolidado antes de que se escriba código.
4. El implementer ejecuta lote tras lote. El ciclo solo se detiene ante una decisión nueva, una comprobación fallida o un bloqueo.
5. El resultado se verifica según el nivel. El orquestador commitea si elegiste commit al cierre, guarda la pill `summary`, descarta las specifications que este cambio ha sustituido y cierra la prescription.

| Nivel | Cuándo | Qué se ejecuta |
|---|---|---|
| `small` | Hasta tres ficheros, entendido, sin reglas de comportamiento nuevas | Decisión con su propia lista corta de tareas, implementer, resumen |
| `standard` | Dos o más pasos con entidad | Explorer, decisión, designer, implementer, resumen |
| `large` | Fases, migraciones, cutover, áreas sensibles | Lo anterior, con una pill de tareas por lote y el verifier independiente |

Los commits siguen siempre la política que elegiste — por lote, al cierre o ninguno — sea cual sea el nivel.

Cada compound tiene un tamaño objetivo por debajo del límite de 5000 caracteres de una pill — por ejemplo 1500 para `discovery`, 3500 para `decision`, 4000 para `specification` y 3000 para `task` al diseñarla, dejando sitio para la evidencia del implementer. El contenido largo se parte por unidad natural (un dominio, un lote), de modo que cada pill sigue siendo buscable por sí sola.

### Comandos

Los comandos de barra son atajos hacia la skill SDD. Los invocas desde el chat; la skill toma el control a partir de ahí.

| Comando | Qué hace |
|---|---|
| `/sdd:new <nombre del cambio>` | Inicia un ciclo: exploración, una ronda de preguntas, decisión y plan de tareas |
| `/sdd:continue [nombre]` | Ejecuta o retoma la implementación lote a lote, y después verifica y cierra |
| `/sdd:status [nombre]` | Muestra la fase actual y las prescriptions abiertas |
| `/sdd:explore <tema>` | Ejecuta una pasada de exploración sin iniciar un ciclo completo |
| `/sdd:fix <descripción del bug>` | Corrección focalizada de un bug acotado — el nivel `small` del ciclo |
| `/sdd:init` | Inicializa Pillbox en un nuevo proyecto |

## Instalación

La skill `pillbox` se instala con el instalador principal de Pillbox:

```bash
pillbox skill install
```

El conjunto completo — skills `pillbox`, `sdd` y `code-quality`, todos los agentes y todos los comandos — se instala ejecutando el instalador de skills directamente:

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/Kevinsillo/pillbox-skills/main/install.sh | bash
```

```powershell
# Windows
irm https://raw.githubusercontent.com/Kevinsillo/pillbox-skills/main/install.ps1 | iex
```

El script detecta los proveedores instalados (Claude Code y OpenCode), pregunta a cuál apuntar y copia los ficheros en las rutas correctas.

:::tip
Volver a ejecutar el instalador sobreescribe los ficheros existentes. Úsalo para actualizar las skills después de obtener una versión más reciente del repositorio.
:::

## Rutas de instalación

| Proveedor | Skills | Agentes | Comandos |
|---|---|---|---|
| Claude Code | `~/.claude/skills/` | `~/.claude/agents/` | `~/.claude/commands/` |
| OpenCode | `~/.config/opencode/skills/` | `~/.config/opencode/agents/` | `~/.config/opencode/commands/` |
