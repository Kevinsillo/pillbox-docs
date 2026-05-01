---
title: Identidad del autor
description: Cómo Pillbox resuelve el nombre y email del usuario humano detrás del agente, y cómo configurarlos manualmente.
sidebar:
  order: 23
---

Cada pill y prescription guarda quién la creó. Pillbox resuelve esta identidad automáticamente — en la mayoría de los casos no necesitas configurar nada.

## Cómo funciona la resolución

Cuando un agente llama a `pill_store` o `prescription_open`, resuelve el nombre y email del autor en tres pasos, en orden:

**Paso 1 — git config**

Lee `git config user.name` y `git config user.email` del repositorio actual. Si el proyecto tiene git configurado con tus datos, Pillbox los usa directamente.

**Paso 2 — identity.json**

Si git no devuelve ningún valor (por ejemplo, en un directorio sin repositorio o con git no configurado), lee `~/.pillbox/identity.json`. Si el fichero existe y contiene los campos `name` y `email`, los usa.

**Paso 3 — pregunta al usuario**

Si ninguno de los dos pasos anteriores devuelve un valor, el agente te pregunta directamente por tu nombre y email. Una vez que respondes, guarda los datos en `~/.pillbox/identity.json` para que no vuelva a preguntar en futuras sesiones.

## El fichero identity.json

El fichero vive en `~/.pillbox/identity.json` y tiene esta estructura:

```json
{
  "name": "Tu nombre",
  "email": "tu@email.com"
}
```

Puedes crearlo o editarlo manualmente en cualquier momento. Pillbox lo leerá en la próxima invocación.

:::tip
Si usas varios equipos o contextos con identidades diferentes, el paso 1 (git config) tiene prioridad — configura git por repositorio con `git config user.name` y `git config user.email` para sobreescribir el fichero global.
:::

## Cuándo se usa la identidad

La identidad del autor se adjunta a:

- Cada **pill** creada con `pill_store`
- Cada **prescription** abierta con `prescription_open`

Las **capsules** también aceptan `author_name` y `author_email` en `capsule_store`, con la misma lógica de resolución.
