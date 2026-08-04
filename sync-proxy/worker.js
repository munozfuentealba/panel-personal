/**
 * Sincronizador del Panel Personal — Cloudflare Worker + KV.
 *
 * Guarda TODO el estado del panel en un almacén KV bajo una sola clave, para
 * que todos tus dispositivos compartan los mismos datos:
 *   - GET  → devuelve el estado guardado (204 si aún no hay nada).
 *   - PUT  → reemplaza el estado guardado con el cuerpo (JSON).
 *
 * Protegido con un token secreto (encabezado Authorization: Bearer <token>).
 * El token vive como SECRETO del Worker y, en el sitio, se pega en Ajustes
 * (queda solo en tu navegador, nunca en el repositorio público).
 *
 * Bindings necesarios (ver README):
 *   - KV namespace enlazado como  PANEL
 *   - Secret                       SYNC_TOKEN
 */
const CLAVE = 'estado';

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (!env.PANEL) return json({ error: 'Falta enlazar el KV como PANEL' }, 500, cors);
    if (!env.SYNC_TOKEN) return json({ error: 'Falta configurar SYNC_TOKEN' }, 500, cors);

    // Autenticación por token.
    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (token !== env.SYNC_TOKEN) return json({ error: 'No autorizado' }, 401, cors);

    if (request.method === 'GET') {
      const guardado = await env.PANEL.get(CLAVE);
      if (guardado == null) return new Response(null, { status: 204, headers: cors });
      return new Response(guardado, { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    if (request.method === 'PUT') {
      const body = await request.text();
      try { JSON.parse(body); } catch { return json({ error: 'JSON inválido' }, 400, cors); }
      await env.PANEL.put(CLAVE, body);
      return json({ ok: true }, 200, cors);
    }

    return json({ error: 'Método no permitido' }, 405, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
