/**
 * Estado del panel.
 *
 * Todo vive en localStorage del navegador: nada se sube al repositorio ni
 * viaja a ningún servidor. Los datos iniciales son de ejemplo — se reemplazan
 * editando desde la interfaz.
 */

const KEY = 'panel.datos.v1';

/* ─── Datos de ejemplo ────────────────────────────────────────────── */
const SEED = {
  esEjemplo: true,

  finanzas: {
    monedaNota: 'Montos en pesos chilenos',
    movimientos: [
      { id: 'm1', fecha: '2026-07-05', desc: 'Sueldo', cat: 'Ingreso', monto: 1850000 },
      { id: 'm2', fecha: '2026-07-05', desc: 'Arriendo', cat: 'Vivienda', monto: -520000 },
      { id: 'm3', fecha: '2026-07-08', desc: 'Supermercado', cat: 'Alimentación', monto: -186000 },
      { id: 'm4', fecha: '2026-07-10', desc: 'Producción musical (freelance)', cat: 'Ingreso', monto: 340000 },
      { id: 'm5', fecha: '2026-07-11', desc: 'Bencina', cat: 'Transporte', monto: -62000 },
      { id: 'm6', fecha: '2026-07-12', desc: 'Plan móvil e internet', cat: 'Servicios', monto: -48000 },
      { id: 'm7', fecha: '2026-07-14', desc: 'Suscripciones (software)', cat: 'Herramientas', monto: -39000 },
    ],
    presupuestos: [
      { cat: 'Vivienda', tope: 550000 },
      { cat: 'Alimentación', tope: 320000 },
      { cat: 'Transporte', tope: 120000 },
      { cat: 'Servicios', tope: 90000 },
      { cat: 'Herramientas', tope: 60000 },
    ],
    ahorro: { actual: 4200000, meta: 8000000, nombre: 'Fondo de emergencia' },
    // Balance neto de los últimos 6 meses
    historial: [
      { mes: 'Feb', ingresos: 1980000, gastos: 1420000 },
      { mes: 'Mar', ingresos: 2100000, gastos: 1560000 },
      { mes: 'Abr', ingresos: 1900000, gastos: 1380000 },
      { mes: 'May', ingresos: 2340000, gastos: 1610000 },
      { mes: 'Jun', ingresos: 2190000, gastos: 1490000 },
      { mes: 'Jul', ingresos: 2190000, gastos: 855000 },
    ],
    // Resumen de liquidaciones de sueldo. Números de ejemplo: los reales se
    // cargan desde un respaldo, nunca se escriben en este archivo público.
    sueldo: {
      empleador: 'Mi empleador',
      cargo: 'Cargo',
      sueldoBase: 900000,
      liquidoHabitual: 940000,
      prevision: 'AFP (10,58%)',
      salud: 'Fonasa',
      liquidaciones: [
        { mes: 'Ene', iso: '2026-01', haberes: 1120000, descuentos: 180000, liquido: 940000 },
        { mes: 'Feb', iso: '2026-02', haberes: 1120000, descuentos: 180000, liquido: 940000 },
        { mes: 'Mar', iso: '2026-03', haberes: 1160000, descuentos: 185000, liquido: 975000 },
      ],
    },
    // Ahorro: monto por mes del año, ingresado a mano. Ejemplo.
    ahorroBanco: {
      banco: 'Banco',
      tipo: 'Cuenta de Ahorro',
      anio: '2026',
      meses: [
        { mes: 'Ene', monto: 50000 }, { mes: 'Feb', monto: 80000 }, { mes: 'Mar', monto: 120000 },
        { mes: 'Abr', monto: 0 }, { mes: 'May', monto: 0 }, { mes: 'Jun', monto: 0 },
        { mes: 'Jul', monto: 0 }, { mes: 'Ago', monto: 0 }, { mes: 'Sep', monto: 0 },
        { mes: 'Oct', monto: 0 }, { mes: 'Nov', monto: 0 }, { mes: 'Dic', monto: 0 },
      ],
    },
    // Crédito automotriz: cuotas con estado. Ejemplo.
    credito: {
      nombre: 'Mi auto',
      cuotas: [
        { n: 1, fecha: '2026-01-01', monto: 200000, pagada: true },
        { n: 2, fecha: '2026-02-01', monto: 200000, pagada: true },
        { n: 3, fecha: '2026-03-01', monto: 200000, pagada: false },
        { n: 4, fecha: '2026-04-01', monto: 200000, pagada: false },
      ],
    },
    // Egresos clasificados desde las cartolas. Ejemplo; los reales se cargan aparte.
    egresos: [
      { fecha: '2026-06-03', desc: 'COMPRA JUMBO OSORNO', monto: 38900, cat: 'Supermercado' },
      { fecha: '2026-06-05', desc: 'COMPRA SHELL', monto: 25000, cat: 'Transporte' },
      { fecha: '2026-06-08', desc: 'WEB PEDIDOSYA', monto: 12600, cat: 'Restaurantes y delivery' },
      { fecha: '2026-06-10', desc: 'WEB APPLE.COM/BILL', monto: 4490, cat: 'Suscripciones y apps' },
      { fecha: '2026-06-12', desc: 'PAGO LINEA DE CREDITO', monto: 90000, cat: 'Crédito y deuda' },
    ],
  },

  marca: {
    posicionamiento: 'Productor musical y creador de contenido en el sur de Chile.',
    objetivos: [
      { id: 'o1', texto: 'Publicar 3 piezas de contenido por semana', avance: 62 },
      { id: 'o2', texto: 'Llegar a 5.000 seguidores en Instagram', avance: 48 },
      { id: 'o3', texto: 'Lanzar sitio web personal con portafolio', avance: 25 },
      { id: 'o4', texto: 'Grabar 6 episodios de formato largo', avance: 33 },
    ],
    pilares: [
      { nombre: 'Producción musical', peso: 40 },
      { nombre: 'Fe y comunidad', peso: 25 },
      { nombre: 'Emprendimiento', peso: 20 },
      { nombre: 'Vida en el sur', peso: 15 },
    ],
    hitos: [
      { id: 'h1', fecha: '2026-08-02', texto: 'Sesión de fotos para renovar perfil' },
      { id: 'h2', fecha: '2026-08-20', texto: 'Colaboración con artista local' },
      { id: 'h3', fecha: '2026-09-15', texto: 'Lanzamiento del portafolio' },
    ],
  },

  empresa: {
    nombre: 'Mi empresa',
    kpis: { facturacionMes: 3850000, facturacionPrev: 3210000, clientesActivos: 7, margen: 38.5 },
    proyectos: [
      { id: 'p1', nombre: 'Identidad de marca — Cliente A', estado: 'En curso', avance: 70, valor: 1200000 },
      { id: 'p2', nombre: 'Jingle radial — Cliente B', estado: 'En curso', avance: 40, valor: 850000 },
      { id: 'p3', nombre: 'Producción EP — Cliente C', estado: 'Propuesta', avance: 10, valor: 2400000 },
      { id: 'p4', nombre: 'Post producción audio — Cliente D', estado: 'Cerrado', avance: 100, valor: 620000 },
    ],
    ventas: [
      { mes: 'Feb', v: 2450000 }, { mes: 'Mar', v: 2980000 }, { mes: 'Abr', v: 2610000 },
      { mes: 'May', v: 3400000 }, { mes: 'Jun', v: 3210000 }, { mes: 'Jul', v: 3850000 },
    ],
  },

  instagram: {
    usuario: 'munozfuentealba',
    nombre: 'Tu nombre',
    bio: '',
    seguidores: 2400,
    siguiendo: 890,
    publicaciones: 148,
    visitasPerfil: 320,
    periodo: 'Últimos 30 días',
    actualizado: '2026-07-01',
    // Del Panel profesional de Instagram: visualizaciones (antes "impresiones")
    // e interacciones, con su reparto por origen y por tipo de contenido.
    visualizaciones: {
      total: 18500, cuentasAlcanzadas: 9400, pctSeguidores: 62,
      porContenido: [
        { tipo: 'Historias', pct: 71.2 },
        { tipo: 'Reels', pct: 20.4 },
        { tipo: 'Publicaciones', pct: 7.1 },
        { tipo: 'Videos', pct: 1.3 },
      ],
    },
    interacciones: {
      total: 640, cuentas: 380, pctSeguidores: 78,
      porContenido: [
        { tipo: 'Reels', pct: 54 },
        { tipo: 'Historias', pct: 33 },
        { tipo: 'Publicaciones', pct: 13 },
      ],
    },
    // Seguidores activos por franja de 3 h (0,3,6,9,12,15,18,21) para cada día.
    actividad: {
      L: [120, 180, 300, 420, 480, 500, 520, 340],
      M: [130, 200, 320, 440, 500, 520, 540, 360],
      X: [125, 190, 310, 430, 490, 510, 530, 350],
      J: [135, 210, 330, 450, 510, 530, 545, 365],
      V: [140, 220, 340, 460, 520, 540, 560, 380],
      S: [160, 150, 260, 380, 440, 470, 540, 420],
      D: [150, 140, 250, 360, 430, 460, 520, 390],
    },
    // Historial que se va completando; el gráfico y el delta salen de aquí.
    historial: [
      { fecha: '2026-02-01', seguidores: 1960 },
      { fecha: '2026-03-01', seguidores: 2050 },
      { fecha: '2026-04-01', seguidores: 2140 },
      { fecha: '2026-05-01', seguidores: 2225 },
      { fecha: '2026-06-01', seguidores: 2310 },
      { fecha: '2026-07-01', seguidores: 2400 },
    ],
  },

  musica: {
    proyectos: [
      { id: 'mu1', nombre: 'EP — "Sur"', etapa: 'Mezcla', avance: 72, tracks: 5 },
      { id: 'mu2', nombre: 'Single — "Lluvia"', etapa: 'Grabación', avance: 45, tracks: 1 },
      { id: 'mu3', nombre: 'Beat pack vol. 2', etapa: 'Composición', avance: 20, tracks: 12 },
      { id: 'mu4', nombre: 'Cover acústico', etapa: 'Masterizado', avance: 100, tracks: 1 },
    ],
    horasSemana: [
      { d: 'Lun', h: 2 }, { d: 'Mar', h: 3.5 }, { d: 'Mié', h: 1 }, { d: 'Jue', h: 4 },
      { d: 'Vie', h: 2.5 }, { d: 'Sáb', h: 6 }, { d: 'Dom', h: 1.5 },
    ],
    metaHoras: 20,
    ideas: [
      { id: 'id1', texto: 'Loop de guitarra en 6/8 para el puente de "Sur"' },
      { id: 'id2', texto: 'Grabar ambiente de lluvia real como capa de textura' },
      { id: 'id3', texto: 'Probar cadena vocal: SM7B → pre → compresión suave' },
    ],
  },

  iglesia: {
    congregacion: 'Mi congregación',
    agenda: [
      { id: 'ig-a1', fecha: '2026-07-19', titulo: 'Servicio dominical', rol: 'Dirección de alabanza', hora: '11:00' },
      { id: 'ig-a2', fecha: '2026-07-17', titulo: 'Ensayo de banda', rol: 'Teclados', hora: '20:00' },
      { id: 'ig-a3', fecha: '2026-07-22', titulo: 'Reunión de jóvenes', rol: 'Apoyo técnico', hora: '19:30' },
      { id: 'ig-a4', fecha: '2026-08-02', titulo: 'Servicio dominical', rol: 'Dirección de alabanza', hora: '11:00' },
    ],
    repertorio: [
      { id: 'r1', titulo: 'Cuán grande es Él', tono: 'G' },
      { id: 'r2', titulo: 'Océanos', tono: 'D' },
      { id: 'r3', titulo: 'Digno es el Cordero', tono: 'A' },
      { id: 'r4', titulo: 'Al que está sentado', tono: 'E' },
    ],
    servidos: 14,
  },

  familia: {
    eventos: [
      { id: 'f1', fecha: '2026-07-18', titulo: 'Cena familiar', quien: 'Todos' },
      { id: 'f2', fecha: '2026-07-26', titulo: 'Paseo a Puerto Varas', quien: 'Todos' },
      { id: 'f3', fecha: '2026-08-09', titulo: 'Almuerzo con los abuelos', quien: 'Abuelos' },
    ],
    fechas: [
      { id: 'c1', fecha: '2026-08-14', nombre: 'Cumpleaños — Mamá' },
      { id: 'c2', fecha: '2026-09-03', nombre: 'Aniversario' },
      { id: 'c3', fecha: '2026-10-21', nombre: 'Cumpleaños — Papá' },
    ],
    intenciones: [
      { id: 'i1', texto: 'Llamar a los abuelos cada domingo', avance: 75 },
      { id: 'i2', texto: 'Una salida familiar al mes', avance: 50 },
      { id: 'i3', texto: 'Cenar sin pantallas', avance: 40 },
    ],
  },

  trabajo: {
    tareas: [
      { id: 't1', texto: 'Cerrar propuesta del Cliente C', para: 'Radio Crea', prio: 'alta', hecha: false, vence: '2026-07-17' },
      { id: 't2', texto: 'Revisar mezcla del jingle radial', para: 'Radio Crea', prio: 'alta', hecha: false, vence: '2026-07-16' },
      { id: 't3', texto: 'Enviar factura del mes', para: 'Personal', prio: 'media', hecha: false, vence: '2026-07-20' },
      { id: 't4', texto: 'Preparar material de clases', para: 'Colegio Bosquemar', prio: 'baja', hecha: false, vence: '2026-07-30' },
      { id: 't5', texto: 'Coordinar ensayo de alabanza', para: 'Iglesia', prio: 'media', hecha: true, vence: '2026-07-14' },
      { id: 't6', texto: 'Respaldar sesiones del estudio', para: 'Gabriel', prio: 'baja', hecha: true, vence: '2026-07-13' },
    ],
    foco: [
      { d: 'Lun', h: 5 }, { d: 'Mar', h: 6.5 }, { d: 'Mié', h: 4 }, { d: 'Jue', h: 7 },
      { d: 'Vie', h: 5.5 }, { d: 'Sáb', h: 2 }, { d: 'Dom', h: 0 },
    ],
  },

  inventario: {
    items: [
      { id: 'inv1', nombre: 'MacBook Air', categoria: 'Personal', cantidad: 1, estado: 'Bueno', descripcion: 'Notebook principal para trabajo y edición.', nota: '' },
      { id: 'inv2', nombre: 'iPhone 14', categoria: 'Personal', cantidad: 1, estado: 'Bueno', descripcion: 'Teléfono personal, también para grabar en terreno.', nota: '' },
      { id: 'inv3', nombre: 'Cámara Sony A7 III', categoria: 'Audio Visual', cantidad: 1, estado: 'Bueno', descripcion: 'Cámara mirrorless full-frame para fotos y video.', nota: 'Lente 28-70mm' },
      { id: 'inv4', nombre: 'Trípode Manfrotto', categoria: 'Audio Visual', cantidad: 1, estado: 'Usado', descripcion: 'Trípode de video con cabezal fluido.', nota: '' },
      { id: 'inv5', nombre: 'Luz LED Godox', categoria: 'Audio Visual', cantidad: 2, estado: 'Nuevo', descripcion: 'Paneles LED bicolor para iluminación de set.', nota: '' },
      { id: 'inv6', nombre: 'Interfaz Focusrite Scarlett', categoria: 'Estudio', cantidad: 1, estado: 'Bueno', descripcion: 'Interfaz de audio USB de 2 entradas.', nota: '2i2' },
      { id: 'inv7', nombre: 'Micrófono Rode NT1', categoria: 'Estudio', cantidad: 1, estado: 'Bueno', descripcion: 'Micrófono condensador de estudio para voces.', nota: '' },
      { id: 'inv8', nombre: 'Monitores KRK Rokit 5', categoria: 'Estudio', cantidad: 2, estado: 'Bueno', descripcion: 'Par de monitores de estudio para mezcla.', nota: '' },
      { id: 'inv9', nombre: 'Teclado MIDI M-Audio', categoria: 'Estudio', cantidad: 1, estado: 'Usado', descripcion: 'Controlador MIDI para producción musical.', nota: '49 teclas' },
    ],
  },
};

/* ─── Persistencia ────────────────────────────────────────────────── */

/**
 * Mezcla superficial por sección sobre el ejemplo: si agrego campos nuevos al
 * SEED, los datos ya guardados siguen funcionando sin migración manual.
 */
function fusionar(obj) {
  const base = structuredClone(SEED);
  for (const k of Object.keys(obj)) {
    base[k] = (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k]))
      ? { ...base[k], ...obj[k] }
      : obj[k];
  }
  return base;
}

function leerLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? fusionar(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export const datos = leerLocal() ?? structuredClone(SEED);

/* Suscriptores que replican cada cambio fuera del navegador (respaldo). */
const oyentes = new Set();
export const alGuardar = (fn) => { oyentes.add(fn); return () => oyentes.delete(fn); };

export function guardar() {
  datos.esEjemplo = false;
  datos.actualizado = new Date().toISOString(); // decide quién gana al sincronizar
  try {
    localStorage.setItem(KEY, JSON.stringify(datos));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage', e);
  }
  for (const fn of oyentes) {
    try { fn(datos); } catch (e) { console.warn('Fallo un oyente de guardado', e); }
  }
  empujarSync(); // replica al servicio de sincronización (si está configurado)
}

/* ─── Datos publicados en el repositorio ──────────────────────────── */

/**
 * El panel puede LEER `datos.json` del repositorio (Pages sirve archivos),
 * pero no puede escribirlo: eso exigiría un token con permiso de escritura
 * dentro de una página pública. Publicar es un paso manual — ver Ajustes.
 *
 * Sirve para lo que importa: al borrar el historial o cambiar de equipo, los
 * datos vuelven solos desde el repositorio.
 */
export const origen = { de: 'ejemplo', fecha: null, hayRepo: false, error: null };

/* ─── Sincronización automática entre dispositivos (opcional) ─────────
 * Un pequeño servicio propio (Cloudflare Worker + KV) guarda el estado; la URL
 * y un token secreto se configuran en Ajustes (viven solo en este navegador,
 * NUNCA en el repo público). Al abrir se trae lo último; al guardar se sube.
 */
const SYNC_URL_KEY = 'panel.sync.url';
const SYNC_TOKEN_KEY = 'panel.sync.token';
const syncUrl = () => { try { return localStorage.getItem(SYNC_URL_KEY) || ''; } catch { return ''; } };
const syncToken = () => { try { return localStorage.getItem(SYNC_TOKEN_KEY) || ''; } catch { return ''; } };

export const sync = { estado: syncUrl() ? 'on' : 'off', ultimo: null, error: null };
export const syncConfig = () => ({ url: syncUrl(), token: syncToken() });
export function configurarSync(url, token) {
  try {
    url = (url || '').trim();
    token = (token || '').trim();
    if (url) localStorage.setItem(SYNC_URL_KEY, url); else localStorage.removeItem(SYNC_URL_KEY);
    if (token) localStorage.setItem(SYNC_TOKEN_KEY, token); else localStorage.removeItem(SYNC_TOKEN_KEY);
    sync.estado = url ? 'on' : 'off';
  } catch { /* sin storage */ }
}

/** Trae el estado guardado en el servicio (o null si no hay/está vacío). */
async function traerRemotoSync() {
  const url = syncUrl();
  if (!url) return null;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${syncToken()}` }, cache: 'no-store' });
  if (r.status === 204) return null; // aún no hay nada guardado
  if (!r.ok) throw new Error(`sync ${r.status}`);
  const txt = await r.text();
  return txt ? fusionar(JSON.parse(txt)) : null;
}

/** Sube el estado actual al servicio (con debounce, para no spamear). */
let pushTimer = null;
function empujarSync() {
  const url = syncUrl();
  if (!url) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      const r = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${syncToken()}` },
        body: JSON.stringify(datos),
      });
      if (!r.ok) throw new Error(`sync ${r.status}`);
      sync.estado = 'ok'; sync.ultimo = new Date().toISOString(); sync.error = null;
    } catch (e) {
      sync.estado = 'error'; sync.error = e.message;
    }
  }, 1500);
}

/** El más reciente entre varios candidatos; prefiere datos reales al ejemplo. */
function masReciente(cands) {
  const val = cands.filter((c) => c && c.datos);
  if (!val.length) return { datos: structuredClone(SEED), de: 'ejemplo' };
  const reales = val.filter((c) => !c.datos.esEjemplo);
  const pool = reales.length ? reales : val;
  pool.sort((a, b) => (b.datos.actualizado || '').localeCompare(a.datos.actualizado || ''));
  return pool[0];
}

/**
 * Se llama una vez al arrancar, antes de pintar. Muta `datos` en lugar de
 * reasignarlo: las secciones ya importaron esa referencia.
 */
export async function inicializar() {
  const local = leerLocal();
  let repo = null;
  try {
    // no-store: si no, el navegador sirve el JSON viejo tras publicar uno nuevo.
    const r = await fetch(`datos.json?t=${Date.now()}`, { cache: 'no-store' });
    if (r.ok) {
      repo = fusionar(await r.json());
      origen.hayRepo = true;
    }
  } catch (e) {
    origen.error = e.message; // sin conexión, o aún no se ha publicado datos.json
  }

  // Sincronización: lo último del servicio propio (si está configurado).
  let remotoSync = null;
  try {
    remotoSync = await traerRemotoSync();
    if (syncUrl()) sync.estado = 'ok';
  } catch (e) {
    if (syncUrl()) { sync.estado = 'error'; sync.error = e.message; }
  }

  const { datos: elegido, de } = masReciente([
    { datos: local, de: 'local' },
    { datos: repo, de: 'repo' },
    { datos: remotoSync, de: 'sync' },
  ]);
  origen.de = de;
  origen.fecha = elegido.actualizado ?? null;

  for (const k of Object.keys(datos)) delete datos[k];
  Object.assign(datos, elegido);

  // Deja lo elegido en este dispositivo…
  if (de !== 'local') {
    try { localStorage.setItem(KEY, JSON.stringify(datos)); } catch {}
  }
  // …y si lo más nuevo no vino del servicio, súbelo para que el resto se entere.
  if (syncUrl() && de !== 'sync') empujarSync();
}

/** Descarga el archivo con el nombre exacto que espera el repositorio. */
export function exportarParaRepo() {
  const copia = { ...datos, actualizado: datos.actualizado ?? new Date().toISOString() };
  const blob = new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: 'datos.json' });
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Aplica el contenido de un respaldo sobre lo que ya hay.
 *
 * Fusiona por sección sobre los datos actuales, no sobre el ejemplo: así un
 * archivo parcial (p. ej. solo "finanzas" con las liquidaciones) actualiza esa
 * sección y conserva el resto. Un respaldo completo, al traer todas las
 * secciones, las reemplaza igual.
 */
export function importar(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('El archivo no tiene el formato del panel.');
  }
  const esperadas = ['finanzas', 'marca', 'empresa', 'instagram', 'musica', 'iglesia', 'familia', 'trabajo'];
  if (!esperadas.some((k) => k in obj)) {
    throw new Error('El archivo no parece un respaldo del panel.');
  }
  for (const k of Object.keys(obj)) {
    datos[k] = (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k]))
      ? { ...datos[k], ...obj[k] }
      : obj[k];
  }
  datos.esEjemplo = false;
  datos.actualizado = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(datos));
  return datos;
}

export function reiniciar() {
  localStorage.removeItem(KEY);
  location.reload();
}

export function exportar() {
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `panel-personal-${new Date().toISOString().slice(0, 10)}.json`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

export const uid = () => Math.random().toString(36).slice(2, 9);
