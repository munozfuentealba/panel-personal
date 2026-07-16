/**
 * Respaldo automático en un archivo real del equipo.
 *
 * Usa la File System Access API: el usuario elige un archivo una vez (por
 * ejemplo dentro de iCloud Drive) y desde ahí cada cambio se escribe solo.
 * El navegador guarda el permiso; nosotros guardamos el "handle" en IndexedDB
 * para reconectar al volver.
 *
 * Solo Chrome y Edge la soportan. En Safari o Firefox `soportado` es false y
 * la interfaz cae a exportar/importar manual.
 */

export const soportado = typeof window.showSaveFilePicker === 'function';

const DB = 'panel-respaldo';
const STORE = 'handles';
const KEY = 'archivo';

/* ─── IndexedDB (localStorage no puede guardar un handle) ─────────── */

function conDB(modo, fn) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(STORE, modo);
      const op = fn(tx.objectStore(STORE));
      op.onsuccess = () => resolve(op.result);
      op.onerror = () => reject(op.error);
      tx.oncomplete = () => db.close();
    };
  });
}

const guardarHandle = (h) => conDB('readwrite', (s) => s.put(h, KEY));
const leerHandle = () => conDB('readonly', (s) => s.get(KEY));
export const olvidarHandle = () => conDB('readwrite', (s) => s.delete(KEY));

/* ─── Permisos ────────────────────────────────────────────────────── */

/** `pedir: true` solo dentro de un gesto del usuario (click); si no, falla. */
async function tienePermiso(handle, pedir = false) {
  const opts = { mode: 'readwrite' };
  if ((await handle.queryPermission(opts)) === 'granted') return true;
  if (!pedir) return false;
  return (await handle.requestPermission(opts)) === 'granted';
}

/* ─── Conectar / reconectar ───────────────────────────────────────── */

/** Crea (o elige) el archivo de respaldo. Requiere un click del usuario. */
export async function conectarNuevo() {
  const handle = await window.showSaveFilePicker({
    suggestedName: 'panel-personal.json',
    types: [{ description: 'Respaldo del panel', accept: { 'application/json': ['.json'] } }],
  });
  await guardarHandle(handle);
  return handle;
}

/** Abre un respaldo que ya existe (para recuperar en otro equipo). */
export async function abrirExistente() {
  const [handle] = await window.showOpenFilePicker({
    types: [{ description: 'Respaldo del panel', accept: { 'application/json': ['.json'] } }],
    multiple: false,
  });
  if (!(await tienePermiso(handle, true))) throw new Error('Permiso denegado');
  await guardarHandle(handle);
  return handle;
}

/**
 * Recupera el archivo ya vinculado.
 * `pedir` solo debe ir en true desde un click.
 * Devuelve { handle, listo } — listo=false significa "hay archivo, falta permiso".
 */
export async function reconectar({ pedir = false } = {}) {
  if (!soportado) return { handle: null, listo: false };
  let handle;
  try { handle = await leerHandle(); } catch { return { handle: null, listo: false }; }
  if (!handle) return { handle: null, listo: false };
  return { handle, listo: await tienePermiso(handle, pedir) };
}

/* ─── Lectura / escritura ─────────────────────────────────────────── */

export async function escribir(handle, datos) {
  const w = await handle.createWritable();
  await w.write(JSON.stringify(datos, null, 2));
  await w.close();
}

export async function leer(handle) {
  const file = await handle.getFile();
  const texto = await file.text();
  if (!texto.trim()) return null; // archivo recién creado
  return JSON.parse(texto);
}

/* ─── Autoguardado ────────────────────────────────────────────────── */

/**
 * Estado observable para la interfaz.
 * `activo`   → escribiendo en cada cambio.
 * `pendiente`→ hay archivo vinculado pero falta permiso (requiere un click).
 */
export const estado = {
  soportado,
  activo: false,
  pendiente: false,
  nombre: null,
  ultimo: null,
  error: null,
};

const cambios = new Set();
export const alCambiarEstado = (fn) => { cambios.add(fn); return () => cambios.delete(fn); };
const notificar = () => cambios.forEach((fn) => fn(estado));

let handleActual = null;
let timer = null;
let ultimosDatos = null;

/** Escribe como mucho una vez por segundo, para no pelear con cada tecla. */
function programarEscritura(datos) {
  ultimosDatos = datos;
  if (!handleActual || !estado.activo) return;
  clearTimeout(timer);
  timer = setTimeout(async () => {
    try {
      await escribir(handleActual, ultimosDatos);
      estado.ultimo = new Date();
      estado.error = null;
    } catch (e) {
      // Típico: el usuario movió o borró el archivo, o revocó el permiso.
      estado.error = e.message;
      estado.activo = false;
      estado.pendiente = true;
    }
    notificar();
  }, 800);
}

/** Vincula un handle ya autorizado y empieza a replicar cada cambio. */
export function activar(handle, datos) {
  handleActual = handle;
  estado.activo = true;
  estado.pendiente = false;
  estado.error = null;
  estado.nombre = handle.name;
  notificar();
  if (datos) programarEscritura(datos); // primera copia inmediata
}

export function desactivar() {
  handleActual = null;
  Object.assign(estado, { activo: false, pendiente: false, nombre: null, ultimo: null, error: null });
  notificar();
}

/**
 * Al arrancar: si hay un archivo vinculado y el permiso sigue vigente,
 * reanuda el autoguardado solo. Si el permiso caducó, deja `pendiente` para
 * que la interfaz ofrezca reconectar con un click.
 */
export async function iniciarRespaldo(store) {
  store.alGuardar(programarEscritura);
  if (!soportado) return;
  const { handle, listo } = await reconectar();
  if (!handle) return;
  if (listo) activar(handle);
  else {
    handleActual = handle;
    estado.pendiente = true;
    estado.nombre = handle.name;
    notificar();
  }
}

/** Reanuda tras un click del usuario (el permiso exige gesto). */
export async function reanudar(datos) {
  const { handle, listo } = await reconectar({ pedir: true });
  if (handle && listo) { activar(handle, datos); return true; }
  return false;
}
