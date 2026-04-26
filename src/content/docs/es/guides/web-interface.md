---
title: Interfaz web
description: La interfaz web de Pillbox — una capa de supervisión local para revisar y corregir lo que han guardado tus agentes.
sidebar:
  order: 22
---

La interfaz web de Pillbox es una interfaz local para revisar el conocimiento que han acumulado tus agentes. No es una herramienta de toma de notas — el agente es el escritor principal. La UI es para el humano.

## Iniciar el servidor

```bash
pillbox serve start
```

Inicia el servidor HTTP como proceso en segundo plano en el puerto 4242. Abre `http://localhost:4242` en tu navegador.

```bash
pillbox serve start --port 8080   # puerto personalizado
pillbox serve status               # verificar si está corriendo
pillbox serve stop                 # detener el servidor
```

## Qué puedes hacer

La UI te da acceso de lectura y escritura a todo lo que almacena Pillbox:

- **Bottles** — ver todos los proyectos registrados y su alcance (local/global)
- **Prescriptions** — explorar sesiones de trabajo por proyecto, ver sus pills
- **Pills** — leer el contenido completo de una pill, editar título o contenido, descartar entradas
- **Capsules** — revisar conocimiento personal entre proyectos, corregir o eliminar entradas

## Cuándo usarla

El agente decide qué guardar y cómo redactarlo. La mayor parte del tiempo eso está bien. Pero ocasionalmente encontrarás entradas que son:

- **Redundantes** — el agente guardó la misma decisión dos veces con palabras diferentes
- **Desactualizadas** — una pill describe un enfoque que fue cambiado después
- **Mal clasificadas** — algo guardado como cápsula (global) que debería ser específico del proyecto, o viceversa
- **Incorrectas** — un bugfix que describe la causa raíz equivocada

La UI es donde corriges esas. Edita el contenido, corrige el compound o descarta la entrada por completo.

## Para qué no sirve la UI

La UI no está diseñada como interfaz principal para crear conocimiento. No hay formularios para abrir prescriptions o guardar nuevas pills desde el navegador. Ese flujo de trabajo corresponde al agente — activado mediante las herramientas MCP durante una sesión activa.

:::tip
Si te encuentras editando frecuentemente entradas guardadas por el agente, normalmente es una señal para ajustar la skill o el prompting del agente — no para gestionar la memoria manualmente.
:::
