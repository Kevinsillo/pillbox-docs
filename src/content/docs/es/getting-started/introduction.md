---
title: Introducción
description: Qué es Pillbox, por qué existe y cómo encaja en tu flujo de trabajo con agentes IA.
sidebar:
  order: 1
---

Pillbox es una capa de memoria persistente para agentes de codificación IA. Proporciona a los agentes un lugar estructurado donde guardar decisiones, bugs resueltos, notas de arquitectura y resúmenes de sesión — para que puedan retomar el contexto al inicio de cada sesión en lugar de empezar desde cero.

## El problema

Los agentes IA olvidan todo entre sesiones. Si le pides a un agente que implemente una funcionalidad, cierras la conversación y vuelves al día siguiente, no tiene ningún recuerdo de lo que hizo, qué decisiones tomó ni por qué. Acabas re-explicando el contexto cada vez.

## Cómo lo resuelve Pillbox

Pillbox corre como un binario local. Proporciona un servidor MCP que expone herramientas de memoria a tu agente. El agente llama a estas herramientas durante su trabajo:

- `pill_store` — guarda un fragmento de conocimiento (una decisión, un bug resuelto, una nota de arquitectura)
- `bottle_context` — lista todas las sesiones de trabajo (prescriptions) de un bottle al inicio de sesión
- `prescription_context` — profundiza en una sesión concreta para recuperar sus pills
- `capsule_store` — guarda conocimiento personal entre proyectos (convenciones, preferencias)

Todos los datos se almacenan en una base de datos SQLite local. Nada sale de tu máquina.

## Historia

Pillbox fue directamente inspirado por [Engram](https://github.com/Gentleman-Programming/engram), un plugin de memoria para agentes IA que demostró cómo el conocimiento persistente y estructurado puede cambiar la forma en que los agentes trabajan entre sesiones. Si no lo conoces, merece la pena saberlo.

La decisión de construir algo nuevo en lugar de contribuir a Engram vino de dos lugares. El primero fue técnico: Engram es un plugin de Node.js y Pillbox necesitaba ser un binario standalone — rápido, sin requisitos de runtime, y con un modelo de datos diseñado específicamente para cómo los agentes guardan y recuperan contexto. El segundo fue práctico: el proceso de revisión de PRs de Engram avanza despacio, y las funcionalidades y correcciones más importantes tardaban demasiado en llegar.

Ninguno de estos es una crítica a Engram. Son razones honestas por las que empezar desde cero tuvo más sentido que esperar. Pillbox es una herramienta diferente con un enfoque técnico diferente — si Engram encaja en tu flujo de trabajo, úsalo.

## Construido para el rendimiento

Pillbox fue construido desde cero en Rust — no como un wrapper sobre una solución existente, sino porque el caso de uso lo exigía. Una capa de memoria que los agentes llaman en cada sesión necesita ser rápida, fiable y sin overhead de runtime.

El resultado es un binario único sin dependencias externas, respaldado por SQLite con un esquema diseñado para escalar a miles de sesiones y proyectos. La búsqueda de texto completo FTS5 con matching difuso corre en milisegundos. El servidor MCP es un puente ligero — toda la lógica de persistencia vive en el core de Rust.

## El rol humano

Pillbox está diseñado con el agente como actor principal. El agente abre sesiones, guarda conocimiento y recupera contexto — el humano en su mayor parte no interviene.

La interfaz web existe para un propósito específico: permitirte revisar y corregir lo que han guardado tus agentes. Los agentes ocasionalmente guardan entradas redundantes, incorrectas o mal redactadas. La UI te da una forma de detectarlas y corregirlas sin tocar la CLI. Editar y eliminar son posibles, pero la UI no es una herramienta de gestión de conocimiento — es una capa de supervisión.

## Las cuatro entidades

| Entidad | Qué es |
|---|---|
| **Bottle** | Un proyecto. Mapea un directorio a una base de datos. |
| **Prescription** | Una sesión de trabajo dentro de un bottle. Una abierta a la vez. |
| **Pill** | Un fragmento de conocimiento del proyecto guardado durante una sesión. |
| **Capsule** | Conocimiento personal entre proyectos. Convenciones, preferencias. |

Consulta [Conceptos](/es/concepts/overview/) para el modelo completo.

## Lo que necesitas para configurarlo

1. Instala el binario `pillbox`
2. Inicializa un bottle en tu proyecto (`pillbox bottle init`)
3. Instala el servidor MCP (`pillbox mcp install`)
4. Instala la skill para tu agente (`pillbox skill install`)

La [guía de inicio rápido](/es/getting-started/quick-start/) explica todo esto en menos de cinco minutos.
