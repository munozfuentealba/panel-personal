# Proxy de chat de Texa (gratis, con la clave oculta)

El chat de Texa usa una IA real (Google Gemini). Para que la **clave nunca quede
visible** en el sitio público, no la ponemos en la página: la guardamos en un
pequeño *proxy* gratuito en Cloudflare. El sitio le habla al proxy, y el proxy le
habla a Gemini con la clave en secreto.

Todo esto es **gratis** y se hace una sola vez (~10 minutos).

## Paso 1 — Clave gratis de Gemini
1. Entrá a https://aistudio.google.com/apikey (con tu cuenta de Google).
2. "Create API key" → copiá la clave (empieza con `AIza...`).
   - Es gratis y no pide tarjeta.

## Paso 2 — Crear el Worker en Cloudflare
1. Creá una cuenta gratis en https://dash.cloudflare.com/sign-up
2. En el panel: **Workers & Pages → Create → Create Worker**.
3. Ponele un nombre (ej. `texa-chat`) y **Deploy**.
4. Entrá al Worker → **Edit code**. Borrá todo lo que venga de ejemplo y pegá el
   contenido completo de [`worker.js`](./worker.js). **Deploy** arriba a la derecha.

## Paso 3 — Guardar la clave como secreto
1. En el Worker → **Settings → Variables and Secrets → Add**.
2. Tipo **Secret**. Nombre exactamente: `GEMINI_API_KEY`. Valor: la clave del paso 1.
3. **Save** y **Deploy** de nuevo si lo pide.
   - (Opcional) Podés agregar una variable normal `GEMINI_MODEL` si querés otro
     modelo; por defecto usa `gemini-2.0-flash`.

## Paso 4 — Conectar el proxy en Texa
1. Copiá la URL de tu Worker (algo como `https://texa-chat.TUCUENTA.workers.dev`).
2. Abrí Texa → **Chat**. Arriba a la derecha hay un botón **⚙ IA**.
3. Pegá ahí la URL y **Guardar**. Listo: el chat ya conversa de verdad.
   - La URL se guarda en tu navegador (no en el sitio público).

## ¿Y si falla?
- Si el proxy no está conectado o falla, el chat responde en **modo local**
  (respuestas simples, sin IA) para no quedar roto.
- Errores típicos: la clave mal pegada, o no haber hecho **Deploy** después de
  agregar el secreto.

> Nota: el nivel gratis de Gemini alcanza de sobra para uso personal. La clave
> vive solo en Cloudflare; el sitio público nunca la ve.
