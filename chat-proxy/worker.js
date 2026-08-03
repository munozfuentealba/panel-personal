/**
 * Proxy de chat para Texa — Cloudflare Worker.
 *
 * Guarda tu API key de Google Gemini como SECRETO del Worker (nunca en el sitio
 * público). El sitio le envía el historial de la conversación y el Worker llama
 * a Gemini con la personalidad de tutor de inglés, devolviendo { reply, tip }.
 *
 * Variables de entorno (Settings → Variables and Secrets del Worker):
 *   GEMINI_API_KEY  (secreto, obligatorio)  → tu clave de https://aistudio.google.com/apikey
 *   GEMINI_MODEL    (opcional)              → por defecto "gemini-2.0-flash"
 *   ALLOW_ORIGIN    (opcional)              → por defecto "*" (podés poner tu dominio)
 */

const SYSTEM_PROMPT = `You are Texa, a warm and encouraging English conversation partner for Diego, a Spanish-speaking learner from Chile.

Core rules:
- ALWAYS respond directly and specifically to what the student JUST said. Follow the thread of the conversation naturally — never ignore their message or loop back to an old topic.
- Reply in ENGLISH, casual and friendly, 1 to 3 short sentences.
- Keep the conversation flowing: react to what they said, then ask ONE natural follow-up question.
- If the student's message has a clear English mistake, add ONE short correction written in SPANISH. If there is no real mistake, leave it empty.
- Never be a grammar robot: prioritize a real, fluent conversation over corrections.

Output format: return ONLY a raw JSON object, no markdown, no code fences:
{"reply": "<your English reply>", "tip": "<one short correction in Spanish, or an empty string>"}`;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);
    if (!env.GEMINI_API_KEY) return json({ error: 'Falta configurar GEMINI_API_KEY' }, 500, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400, cors); }

    // Historial: [{ from: 'user' | 'ai', text }]. Nos quedamos con los últimos 20.
    const historial = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    const contents = historial
      .filter((m) => m && typeof m.text === 'string' && m.text.trim())
      .map((m) => ({ role: m.from === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
    // Gemini exige que la conversación empiece con un turno 'user'.
    while (contents.length && contents[0].role === 'model') contents.shift();
    if (!contents.length) return json({ error: 'Sin mensajes' }, 400, cors);

    const model = env.GEMINI_MODEL || 'gemini-2.0-flash';
    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.85, maxOutputTokens: 300, responseMimeType: 'application/json' },
    };

    let data;
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      );
      if (!r.ok) {
        const detalle = (await r.text()).slice(0, 300);
        return json({ error: 'Error del modelo', detalle }, 502, cors);
      }
      data = await r.json();
    } catch (e) {
      return json({ error: 'No se pudo contactar al modelo', detalle: String(e) }, 502, cors);
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let reply = '';
    let tip = '';
    try {
      const parsed = JSON.parse(raw);
      reply = (parsed.reply || '').toString().trim();
      tip = (parsed.tip || '').toString().trim();
    } catch {
      reply = raw.trim(); // si el modelo no devolvió JSON, usamos el texto tal cual
    }
    if (!reply) reply = "Sorry, I didn't catch that — could you say it another way?";
    return json({ reply, tip }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
