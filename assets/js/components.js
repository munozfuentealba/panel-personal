/* Piezas visuales reutilizables entre secciones. */

import { el, icon, compact } from './utils.js';

export function card(titulo, cuerpo, accion = null) {
  const head = titulo || accion
    ? el('div', { class: 'card__head' }, [
        titulo ? el('span', { class: 'card__title' }, titulo) : el('span'),
        accion,
      ])
    : null;
  return el('section', { class: 'card' }, [head, el('div', { class: 'card__body' }, cuerpo)]);
}

export function metrica(valor, etiqueta, delta = null) {
  return el('div', { class: 'metric' }, [
    el('div', { style: { display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' } }, [
      el('div', { class: 'metric__value' }, valor),
      delta,
    ]),
    el('div', { class: 'metric__label' }, etiqueta),
  ]);
}

/** Píldora de variación. `v` en porcentaje; `invertir` para métricas donde subir es malo (gastos). */
export function delta(v, { invertir = false, sufijo = '%' } = {}) {
  const n = Number(v) || 0;
  const bueno = invertir ? n < 0 : n > 0;
  const cls = Math.abs(n) < 0.05 ? 'flat' : bueno ? 'up' : 'down';
  const txt = `${n > 0 ? '+' : ''}${n.toFixed(1).replace('.', ',')}${sufijo}`;
  return el('span', { class: `delta delta--${cls}` }, [
    cls !== 'flat' ? icon(n > 0 ? 'i-arriba' : 'i-abajo') : null,
    txt,
  ]);
}

/** Fila etiqueta + barra de progreso. `valor`/`tope` en unidades reales. */
export function barra(etiqueta, valor, tope, detalle = null) {
  const p = tope > 0 ? Math.min((valor / tope) * 100, 100) : 0;
  const excedido = valor > tope;
  return el('div', { class: 'bar-row' }, [
    el('div', { class: 'bar-row__top' }, [
      el('span', {}, etiqueta),
      el('span', {}, detalle ?? `${Math.round((valor / tope) * 100)} %`),
    ]),
    el('div', { class: 'bar' }, [
      el('div', { class: `bar__fill${excedido ? ' bar__fill--over' : ''}`, style: { width: `${p}%` } }),
    ]),
  ]);
}

/**
 * Gráfico de barras. `series` = [{label, a, b?}] — `b` dibuja una segunda
 * barra tenue al lado (p.ej. ingresos vs gastos).
 *
 * `escalaAjustada` baja el piso del eje hasta cerca del valor mínimo. Sirve
 * cuando los valores son grandes y parecidos (seguidores), donde medir desde
 * cero deja todas las barras iguales.
 */
export function grafico(series, { formato = compact, alto = 150, escalaAjustada = false } = {}) {
  const vals = series.flatMap((s) => (s.b === undefined ? [s.a] : [s.a, s.b]));
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const base = escalaAjustada ? Math.max(min - (max - min) * 0.6, 0) : 0;
  const altura = (v) => `${Math.max(((v - base) / (max - base || 1)) * 100, 2)}%`;

  return el('div', { class: 'chart', style: { height: `${alto}px` } },
    series.map((s, j) => el('div', { class: 'chart__col' }, [
      el('div', { class: 'chart__stack' }, [
        el('div', {
          class: 'chart__bar',
          style: { '--j': j, height: altura(s.a) },
          title: `${s.label}: ${formato(s.a)}`,
        }),
        s.b !== undefined ? el('div', {
          class: 'chart__bar chart__bar--alt',
          style: { '--j': j, height: altura(s.b) },
          title: `${s.label}: ${formato(s.b)}`,
        }) : null,
      ]),
      el('div', { class: 'chart__label' }, s.label),
    ])),
  );
}

export function leyenda(items) {
  return el('div', { class: 'legend' }, items.map(([txt, alt]) =>
    el('div', { class: 'legend__item' }, [
      el('span', { class: `legend__swatch${alt ? ' legend__swatch--alt' : ''}` }),
      txt,
    ]),
  ));
}

/** Línea de tendencia a partir de una lista de números. */
export function sparkline(valores) {
  if (valores.length < 2) return el('div');
  const w = 300, h = 44, pad = 3;
  const min = Math.min(...valores), max = Math.max(...valores);
  const span = max - min || 1;
  const pts = valores.map((v, i) => [
    (i / (valores.length - 1)) * w,
    h - pad - ((v - min) / span) * (h - pad * 2),
  ]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${d} L${w} ${h} L0 ${h} Z`;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'spark');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  for (const [cls, path] of [['spark__area', area], ['', d]]) {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', path);
    if (cls) p.setAttribute('class', cls);
    svg.append(p);
  }
  return svg;
}

export function listaVacia(msg) {
  return el('div', { class: 'empty' }, msg);
}

export function aviso(contenido) {
  return el('div', { class: 'notice' }, contenido);
}

export function encabezado(iconoId, titulo, descripcion) {
  return el('div', { class: 'section-head' }, [
    el('div', { class: 'section-head__icon' }, [icon(iconoId)]),
    el('div', {}, [el('h2', {}, titulo), descripcion ? el('p', {}, descripcion) : null]),
  ]);
}

export function botonIcono(iconoId, titulo, onclick) {
  return el('button', { class: 'btn btn--ghost btn--sm', title: titulo, 'aria-label': titulo, onclick }, [icon(iconoId)]);
}
