# Sincronización automática del panel (gratis)

Hace que tus datos se sincronicen solos entre el computador y el teléfono. Se
guardan en un pequeño servicio propio en **Cloudflare** (gratis), protegido con
un **token secreto**. Ni la URL ni el token van al repositorio público: se pegan
en **Ajustes** del panel y quedan solo en tu navegador.

Se hace una sola vez (~10 minutos). Necesitás una cuenta gratis de Cloudflare
(la misma del chat sirve).

## Paso 1 — Crear el Worker
1. Entrá a https://dash.cloudflare.com → **Workers & Pages → Create → Create Worker**.
2. Nombre, por ejemplo `panel-sync`. **Deploy**.
3. **Edit code**: borrá el ejemplo y pegá el contenido de
   [`worker.js`](./worker.js). **Deploy**.

## Paso 2 — Crear el almacén KV y enlazarlo
1. En el panel de Cloudflare: **Storage & Databases → KV → Create a namespace**
   (nombre, por ejemplo `panel-kv`).
2. Volvé a tu Worker → **Settings → Bindings → Add → KV namespace**.
3. **Variable name**: exactamente `PANEL`. **KV namespace**: el que creaste. Guardá.

## Paso 3 — Poner el token secreto
1. En el Worker → **Settings → Variables and Secrets → Add**.
2. Tipo **Secret**. Nombre exactamente: `SYNC_TOKEN`.
   Valor: una clave larga inventada por vos (ej. `mi-clave-super-larga-2026-xk93`).
   Guardala aparte: la vas a pegar en el panel. **Deploy** si lo pide.

## Paso 4 — Conectar en el panel (en CADA dispositivo)
1. Copiá la URL del Worker (algo como `https://panel-sync.TUCUENTA.workers.dev`).
2. Abrí el panel → **Ajustes → Sincronización entre dispositivos**.
3. Pegá la **URL** y el **token** (el mismo `SYNC_TOKEN` del paso 3) → **Conectar**.
4. Repetí en el iPhone (en la app instalada). Con eso, ambos comparten los datos.

## Cómo funciona
- Al **abrir** el panel, trae lo último del servicio; si es más nuevo que lo del
  dispositivo, lo usa.
- Al **guardar** cualquier cambio, lo sube automáticamente.
- Si dos dispositivos editan, **gana el guardado más reciente** (para un solo
  usuario alcanza de sobra). Para ver en un dispositivo lo que cambiaste en otro,
  refrescá (recargá la app).

## Notas
- El nivel gratis de Workers + KV alcanza muy holgado para uso personal.
- La URL y el token viven solo en tu navegador (localStorage), no en el repo.
- El respaldo a `datos.json` sigue existiendo como red de seguridad; ya no es
  necesario publicar a mano, pero podés seguir exportando cuando quieras.
