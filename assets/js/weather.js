/**
 * Clima para Osorno y Puerto Montt vía Open-Meteo.
 *
 * Open-Meteo es abierta y no necesita API key — importante, porque este
 * repositorio es público y una clave quedaría expuesta en el código.
 */

export const CIUDADES = [
  { id: 'osorno', nombre: 'Osorno', lat: -40.5742, lon: -73.1349 },
  { id: 'puerto-montt', nombre: 'Puerto Montt', lat: -41.4693, lon: -72.9424 },
];

const CACHE_KEY = 'panel.clima.v1';
const CACHE_MS = 30 * 60 * 1000; // 30 minutos

/* Códigos WMO → icono del sprite + descripción en español */
const WMO = {
  0:  ['i-sol', 'Despejado'],
  1:  ['i-sol-nube', 'Mayormente despejado'],
  2:  ['i-sol-nube', 'Parcialmente nublado'],
  3:  ['i-nube', 'Nublado'],
  45: ['i-niebla', 'Niebla'],
  48: ['i-niebla', 'Niebla con escarcha'],
  51: ['i-lluvia', 'Llovizna débil'],
  53: ['i-lluvia', 'Llovizna'],
  55: ['i-lluvia', 'Llovizna intensa'],
  56: ['i-lluvia', 'Llovizna helada'],
  57: ['i-lluvia', 'Llovizna helada intensa'],
  61: ['i-lluvia', 'Lluvia débil'],
  63: ['i-lluvia', 'Lluvia'],
  65: ['i-lluvia', 'Lluvia intensa'],
  66: ['i-lluvia', 'Lluvia helada'],
  67: ['i-lluvia', 'Lluvia helada intensa'],
  71: ['i-nieve', 'Nevada débil'],
  73: ['i-nieve', 'Nevada'],
  75: ['i-nieve', 'Nevada intensa'],
  77: ['i-nieve', 'Granos de nieve'],
  80: ['i-lluvia', 'Chubascos débiles'],
  81: ['i-lluvia', 'Chubascos'],
  82: ['i-lluvia', 'Chubascos fuertes'],
  85: ['i-nieve', 'Chubascos de nieve'],
  86: ['i-nieve', 'Chubascos de nieve fuertes'],
  95: ['i-tormenta', 'Tormenta eléctrica'],
  96: ['i-tormenta', 'Tormenta con granizo'],
  99: ['i-tormenta', 'Tormenta con granizo fuerte'],
};

export const wmoIcono = (c) => (WMO[c] ?? ['i-nube'])[0];
export const wmoTexto = (c) => (WMO[c] ?? [, 'Sin dato'])[1];

function url({ lat, lon }) {
  const p = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    timezone: 'America/Santiago',
    forecast_days: '7',
  });
  return `https://api.open-meteo.com/v1/forecast?${p}`;
}

async function pedir(ciudad) {
  const r = await fetch(url(ciudad), { signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`Open-Meteo respondió ${r.status}`);
  const d = await r.json();
  return {
    ciudad: ciudad.nombre,
    id: ciudad.id,
    ahora: {
      temp: Math.round(d.current.temperature_2m),
      sensacion: Math.round(d.current.apparent_temperature),
      humedad: d.current.relative_humidity_2m,
      viento: Math.round(d.current.wind_speed_10m),
      code: d.current.weather_code,
    },
    dias: d.daily.time.map((fecha, i) => ({
      fecha,
      code: d.daily.weather_code[i],
      max: Math.round(d.daily.temperature_2m_max[i]),
      min: Math.round(d.daily.temperature_2m_min[i]),
      lluvia: d.daily.precipitation_probability_max[i] ?? 0,
      amanecer: d.daily.sunrise[i],
      atardecer: d.daily.sunset[i],
    })),
  };
}

/**
 * Devuelve el pronóstico de ambas ciudades.
 * Sirve caché de hasta 30 min; si la red falla, cae al último dato conocido
 * (marcado como `desactualizado`) antes que dejar la sección vacía.
 */
export async function obtenerClima({ forzar = false } = {}) {
  const cache = leerCache();
  if (!forzar && cache && Date.now() - cache.ts < CACHE_MS) {
    return { datos: cache.datos, ts: cache.ts, desactualizado: false };
  }
  try {
    const datos = await Promise.all(CIUDADES.map(pedir));
    const ts = Date.now();
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts, datos })); } catch {}
    return { datos, ts, desactualizado: false };
  } catch (e) {
    if (cache) return { datos: cache.datos, ts: cache.ts, desactualizado: true, error: e.message };
    throw e;
  }
}

function leerCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
