/* Utilidades compartidas: creación de nodos, formato y feedback. */

/** Crea un elemento con props y children en una sola llamada. */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') node.innerHTML = v;
    else if (k in node && k !== 'list') node[k] = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

/** <svg><use href="#id"></svg> — los iconos viven en el sprite de index.html */
export function icon(id, cls = 'icon') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${id}`);
  svg.append(use);
  return svg;
}

/* ─── Formato ─────────────────────────────────────────────────────── */

const CLP = new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
});
const NUM = new Intl.NumberFormat('es-CL');

export const clp = (n) => CLP.format(Math.round(Number(n) || 0));
export const num = (n) => NUM.format(Number(n) || 0);

/** 12400 → "12,4 k" · 1250000 → "1,3 M" */
export function compact(n) {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1).replace('.', ',') + ' M';
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1).replace('.', ',') + ' k';
  return NUM.format(v);
}

export const pct = (n, d = 1) => `${(Number(n) || 0).toFixed(d).replace('.', ',')} %`;

export function fecha(iso, opts = { day: 'numeric', month: 'long' }) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-CL', opts);
}

/** "en 3 días" · "hace 2 días" · "hoy" */
export function relativo(iso) {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const d = new Date(iso + 'T00:00:00');
  const dias = Math.round((d - hoy) / 86400000);
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'mañana';
  if (dias === -1) return 'ayer';
  return new Intl.RelativeTimeFormat('es-CL', { numeric: 'auto' }).format(dias, 'day');
}

export const hoyISO = () => new Date().toISOString().slice(0, 10);

/* ─── Feedback ────────────────────────────────────────────────────── */

let toastTimer;
export function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2600);
}

/**
 * Anima valores que dependen de layout (barras, gráficos) en el frame
 * siguiente, para que la transición se vea en lugar de aplicarse de golpe.
 */
export function animarEntrada(root) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.querySelectorAll('[data-w]').forEach((n) => { n.style.width = n.dataset.w; });
    root.querySelectorAll('[data-h]').forEach((n) => { n.style.height = n.dataset.h; });
  }));
}

/** Numera los hijos directos para el escalonado de la animación de entrada. */
export function escalonar(root) {
  [...root.children].forEach((c, i) => c.style.setProperty('--i', i));
}
