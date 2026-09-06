---
title: Configuración inicial
description: Cómo Pillbox identifica al usuario humano detrás del agente antes de guardar la primera pill.
sidebar:
  order: 4
---

Antes de guardar la primera pill o prescription, Pillbox necesita saber quién eres. Esta identidad se adjunta a cada entrada de memoria como autor, lo que permite saber qué agente guardó qué, en qué sesión y con quién trabajaba.

## Identidad del autor

Cuando un agente llama a `pill_store` o `prescription_open`, resuelve tu identidad en tres pasos:

1. Lee `git config user.name` y `git config user.email` del repositorio actual.
2. Si no hay configuración de git, lee `~/.pillbox/identity.json`.
3. Si el fichero tampoco existe, te pregunta directamente y guarda tu respuesta en `~/.pillbox/identity.json` para futuras sesiones.

En la mayoría de los casos no necesitas hacer nada — si tienes git configurado con nombre y email, Pillbox los usará automáticamente.

Consulta la [guía de identidad del autor](../../guides/author-identity/) para ver el formato del fichero y cómo configurarla manualmente.
