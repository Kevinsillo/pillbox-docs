---
title: Filosofía de diseño
description: Por qué existe Pillbox, qué problema resuelve y los principios detrás de su modelo de datos.
sidebar:
  order: 11
---

Los agentes IA son apátridas por naturaleza. Cada sesión empieza desde cero — sin memoria de decisiones pasadas, sin contexto sobre por qué las cosas se construyeron como se construyeron, sin consciencia de lo que falló la semana pasada. Pillbox existe para cambiar eso.

## El problema central

Cuando un agente te ayuda a construir algo a lo largo de múltiples sesiones, pierde el contexto cada vez. Puede re-explorar el mismo código, re-descubrir los mismos problemas, proponer enfoques que ya rechazaste, o ignorar limitaciones que se descubrieron con esfuerzo. El conocimiento se crea, se usa una vez y se descarta.

Pillbox es una capa de memoria persistente que da a los agentes acceso a conocimiento estructurado y buscable que se acumula con el tiempo.

## Dos tipos de conocimiento

La decisión de diseño más importante en Pillbox es separar el conocimiento del proyecto del conocimiento personal.

Las **pills** pertenecen a un proyecto. Capturan lo que el agente aprendió mientras trabajaba en un código específico — decisiones tomadas, bugs resueltos, patrones encontrados, elecciones de arquitectura con su justificación. Las pills tienen alcance de bottle y requieren una prescription abierta. Mueren con el proyecto.

Las **capsules** pertenecen al usuario. Capturan preferencias, flujos de trabajo y convenciones que aplican a todos los proyectos — cómo te gustan formateados los commits, cómo prefieres las revisiones de PRs, cómo se ve tu entorno de desarrollo. Las capsules no tienen alcance de proyecto. Un agente que busca capsules al inicio de cualquier sesión encontrará el mismo contexto personal independientemente del proyecto en el que esté trabajando.

Esta separación evita que el conocimiento del proyecto y el personal se contaminen mutuamente.

## La prescription como contrato

Una prescription es más que un contenedor de sesión. Es un compromiso: antes de guardar cualquier conocimiento, el agente debe declarar en qué está trabajando. Este título se convierte en el ancla de todo lo guardado durante esa sesión.

Pueden estar abiertas varias prescriptions en un bottle al mismo tiempo, de modo que flujos de trabajo paralelos — una funcionalidad, un refactor, un hotfix — pueden acumular conocimiento cada uno bajo su propio ancla sin serializarse. La disciplina es la misma: cada pill se atribuye a una prescription, y el agente decide a qué sesión pertenece cada pieza de conocimiento. Cuántas prescriptions permanecen abiertas a la vez es decisión del usuario; Pillbox no impone un foco singular, solo garantiza que nada se guarda sin uno.

## La búsqueda como interfaz principal

Pillbox no es un almacén clave-valor. No hay claves con nombre, rutas jerárquicas ni recuperación por ID como flujo principal. La interfaz principal es la búsqueda.

Todo lo guardado se indexa con búsqueda de texto completo FTS5 en título y contenido. La coincidencia por prefijo y el matching difuso de Jaro-Winkler garantizan que búsquedas de `hex` encuentren `hexagonal`, y `authn` encuentre `authentication`. Cuando una consulta contiene múltiples términos, Pillbox primero ejecuta una búsqueda OR entre todos ellos via FTS5; si eso devuelve cero resultados, reintenta automáticamente con Jaro-Winkler para ampliar la coincidencia. Las prescriptions cerradas siguen siendo completamente buscables — el conocimiento acumulado en sesiones pasadas siempre está disponible para las futuras.

Este diseño significa que el valor de Pillbox crece con el uso. Un bottle con cien pills de veinte sesiones pasadas da a un agente significativamente más contexto que uno recién creado.

## Los compounds dan estructura sin imponerla

Cada pill y capsule tiene un compound — un campo de texto libre que clasifica qué tipo de conocimiento contiene. No hay lista cerrada: cualquier string es válido. Los valores concretos los define el flujo de trabajo activo (por ejemplo, el SDD del proyecto).

Los compounds no se imponen de forma estricta. Un agente que guarda todo con el mismo compound seguirá beneficiándose de la búsqueda. Pero los compounds permiten recuperación dirigida — buscar solo pills de un tipo concreto, o filtrar por `summary` para reconstruir una línea de tiempo de sesiones pasadas. La estructura se rentabiliza a escala.

## Diseñado para agentes, legible por humanos

Las pills y capsules son texto. La interfaz web las hace legibles y eliminables por humanos. El MCP y la API HTTP las hacen escribibles y buscables por agentes.

El flujo de trabajo previsto es asimétrico por diseño: los agentes escriben, los humanos revisan y podan. Un agente no debería pausar para preguntarse si una decisión vale la pena recordar — debería guardar y continuar. Los humanos deciden qué conservar mediante revisiones ocasionales, no controlando cada escritura.

## Cómo usar Pillbox

Pillbox no prescribe un flujo de trabajo específico. El patrón mínimo viable es:

1. Al inicio de una sesión, llama a `bottle_context` y `capsule_search` con términos relevantes para la tarea actual.
2. Durante la sesión, llama a `pill_store` cuando ocurra algo que valga la pena recordar — una decisión no obvia, un bug encontrado y resuelto, una limitación descubierta.
3. Al final de la sesión, guarda un `summary` y llama a `prescription_close`.

Más allá de este mínimo, los equipos construyen sobre Pillbox de diferentes formas. Algunos lo integran en flujos de desarrollo estructurados donde cada decisión de diseño, especificación y tarea de implementación se rastrea como pills. Otros lo usan como un diario ligero que corre junto a cualquier sesión de codificación. Ambos enfoques funcionan — el modelo de datos soporta cualquiera de ellos.

:::tip
Si trabajas con un agente IA en proyectos recurrentes, el hábito de mayor valor es cerrar cada sesión con un `summary`. Las sesiones futuras que llamen a `bottle_context` mostrarán estos resúmenes primero, dando al agente una comprensión inmediata de qué se hizo y por qué.
:::
