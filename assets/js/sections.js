/**
 * Cada sección devuelve un array de nodos que se cuelgan directo de .view
 * (el router los numera para el escalonado de la animación de entrada).
 *
 * `ctx` trae { clima, recargar, irA }.
 */

import { el, icon, clp, num, compact, pct, fecha, relativo, hoyISO, toast } from './utils.js';
import { datos, guardar, uid, exportar, reiniciar, importar, origen, exportarParaRepo } from './store.js';
import * as R from './backup.js';
import { wmoIcono, wmoTexto, CIUDADES } from './weather.js';
import {
  card, metrica, delta, barra, grafico, leyenda, sparkline, donut,
  listaVacia, aviso, encabezado, botonIcono, progresoEditable,
} from './components.js';

/* ─── Helpers de dominio ──────────────────────────────────────────── */

const mesActual = () => new Date().toISOString().slice(0, 7);

function totalesMes(movs, mes = mesActual()) {
  const delMes = movs.filter((m) => m.fecha.startsWith(mes));
  const ingresos = delMes.filter((m) => m.monto > 0).reduce((s, m) => s + m.monto, 0);
  const gastos = delMes.filter((m) => m.monto < 0).reduce((s, m) => s - m.monto, 0);
  return { ingresos, gastos, balance: ingresos - gastos, delMes };
}

const variacion = (act, prev) => (prev ? ((act - prev) / prev) * 100 : 0);

/** Botón de borrar para un elemento de una lista. Guarda y repinta. */
function borrar(contenedor, campo, id, ctx, etiqueta = 'elemento') {
  return botonIcono('i-basura', `Eliminar ${etiqueta}`, () => {
    contenedor[campo] = contenedor[campo].filter((x) => x.id !== id);
    guardar();
    toast('Eliminado.');
    ctx.recargar();
  });
}

/** Guarda y avisa, sin repintar: para deslizadores y campos en vivo. */
const guardarSuave = () => { guardar(); toast('Guardado.'); };

/** Ordena por fecha ascendente y deja solo lo que aún no pasa. */
const proximos = (arr, n = 5) => arr
  .filter((e) => e.fecha >= hoyISO())
  .sort((a, b) => a.fecha.localeCompare(b.fecha))
  .slice(0, n);

/* ══════════════════════════════════════════════════════════════════
   Clima
   ══════════════════════════════════════════════════════════════════ */

function tarjetaClima(c) {
  const hoy = c.dias[0];
  return card(c.ciudad, [
    el('div', { class: 'wx' }, [
      el('div', { class: 'wx__icon' }, [icon(wmoIcono(c.ahora.code))]),
      el('div', {}, [
        el('div', { class: 'wx__temp' }, `${c.ahora.temp}°`),
        el('div', { class: 'wx__desc' }, wmoTexto(c.ahora.code)),
        el('div', { class: 'wx__extra' }, [
          el('span', {}, `Sensación ${c.ahora.sensacion}°`),
          el('span', {}, `Máx ${hoy.max}° · Mín ${hoy.min}°`),
          el('span', {}, `Humedad ${c.ahora.humedad} %`),
          el('span', {}, `Viento ${c.ahora.viento} km/h`),
        ]),
      ]),
    ]),
    el('div', { class: 'wx-days' }, c.dias.map((d, i) => el('div', { class: 'wx-day' }, [
      el('div', { class: `wx-day__name${i === 0 ? ' wx-day__name--hoy' : ''}` },
        i === 0 ? 'Hoy' : fecha(d.fecha, { weekday: 'short' }).replace('.', '')),
      icon(wmoIcono(d.code)),
      el('div', { class: 'wx-day__temps' }, [
        el('span', { class: 'wx-day__max' }, `${d.max}°`),
        el('span', { class: 'wx-day__min' }, `${d.min}°`),
      ]),
      el('div', { class: 'wx-day__rain' }, d.lluvia >= 20 ? `${d.lluvia} %` : ''),
    ]))),
  ]);
}

/** Las tarjetas del clima, o su estado de carga/error. Se reusan en Resumen. */
function climaCards({ clima }) {
  if (clima.cargando) {
    return CIUDADES.map((c) => card(c.nombre, [
      el('div', { class: 'skeleton', style: { height: '68px', marginBottom: '18px' } }),
      el('div', { class: 'skeleton', style: { height: '74px' } }),
    ]));
  }
  if (clima.error) {
    return [aviso([el('div', {}, [
      el('strong', {}, 'No se pudo cargar el clima. '),
      'Revisa tu conexión y vuelve a intentarlo.',
    ])])];
  }
  return clima.datos.map(tarjetaClima);
}

export function seccionClima(ctx) {
  const nodos = [el('div', { class: 'grid grid--2' }, climaCards(ctx))];
  if (ctx.clima.desactualizado) {
    nodos.unshift(aviso([el('div', {}, [
      el('strong', {}, 'Pronóstico guardado. '),
      'No hubo conexión con Open-Meteo, se muestra el último dato descargado.',
    ])]));
  }
  return nodos;
}

/* ══════════════════════════════════════════════════════════════════
   Resumen
   ══════════════════════════════════════════════════════════════════ */

export function resumen(ctx) {
  const f = datos.finanzas;
  const t = totalesMes(f.movimientos);
  const prev = f.historial.at(-2);
  const tareasPend = datos.trabajo.tareas.filter((x) => !x.hecha);
  const ig = datos.instagram;
  const igPrev = ig.historial.at(-2)?.seguidores ?? ig.seguidores;

  const agenda = [
    ...datos.iglesia.agenda.map((e) => ({ ...e, origen: 'Iglesia', sec: 'iglesia' })),
    ...datos.familia.eventos.map((e) => ({ ...e, titulo: e.titulo, origen: 'Familia', sec: 'familia' })),
    ...datos.marca.hitos.map((e) => ({ ...e, titulo: e.texto, origen: 'Marca', sec: 'marca' })),
    ...datos.familia.fechas.map((e) => ({ ...e, titulo: e.nombre, origen: 'Familia', sec: 'familia' })),
  ];

  return [
    // Métricas de un vistazo
    el('div', { class: 'grid' }, [
      card('Balance del mes', [
        metrica(clp(t.balance), `${clp(t.ingresos)} en ingresos`,
          delta(variacion(t.ingresos - t.gastos, prev ? prev.ingresos - prev.gastos : 0))),
      ]),
      card('Seguidores en Instagram', [
        metrica(compact(ig.seguidores), `@${ig.usuario}`, delta(variacion(ig.seguidores, igPrev))),
      ]),
      card('Facturación empresa', [
        metrica(clp(datos.empresa.kpis.facturacionMes), 'Mes en curso',
          delta(variacion(datos.empresa.kpis.facturacionMes, datos.empresa.kpis.facturacionPrev))),
      ]),
      card('Tareas pendientes', [
        metrica(tareasPend.length, `${tareasPend.filter((x) => x.prio === 'alta').length} de prioridad alta`),
      ]),
    ]),

    // Clima
    el('div', { class: 'grid grid--2' }, climaCards(ctx)),

    // Agenda + ahorro
    el('div', { class: 'grid grid--wide' }, [
      card('Próximos días', [
        proximos(agenda, 6).length
          ? el('div', { class: 'list' }, proximos(agenda, 6).map((e) => el('div', { class: 'list__item' }, [
              el('span', { class: 'dot', style: { background: `var(--c-${e.sec})` } }),
              el('div', { class: 'list__main' }, [
                el('div', { class: 'list__title' }, e.titulo),
                el('div', { class: 'list__meta' }, `${e.origen} · ${fecha(e.fecha)}${e.hora ? ` · ${e.hora}` : ''}`),
              ]),
              el('span', { class: 'tag' }, relativo(e.fecha)),
            ])))
          : listaVacia('Sin eventos próximos.'),
      ]),
      card(f.ahorro.nombre, [
        metrica(clp(f.ahorro.actual), `Meta: ${clp(f.ahorro.meta)}`),
        barra('Avance', f.ahorro.actual, f.ahorro.meta),
        el('div', { class: 'list__meta' }, `Faltan ${clp(Math.max(f.ahorro.meta - f.ahorro.actual, 0))}`),
      ]),
    ]),

    datos.esEjemplo
      ? aviso([el('div', {}, [
          el('strong', {}, 'Estás viendo datos de ejemplo. '),
          'Todo lo que edites se guarda solo en este navegador — nada se sube al repositorio ni sale de tu equipo. ',
          'Empieza por Finanzas o Instagram para reemplazarlos con los tuyos.',
        ])])
      : null,
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Finanzas
   ══════════════════════════════════════════════════════════════════ */

/** Tarjeta con el resumen de liquidaciones de sueldo. */
function tarjetaSueldo(s) {
  if (!s || !s.liquidaciones?.length) return null;
  const liq = s.liquidaciones;
  const anio = (liq[0].iso || '').slice(0, 4);
  // Su líquido habitual, no un promedio (enero fue atípico por el bono).
  const liquido = s.liquidoHabitual ?? liq.at(-1).liquido;

  return card(`Mi sueldo${anio ? ` — ${anio}` : ''}`, [
    el('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' } }, [
      el('div', { class: 'metric__value', style: { fontSize: '17px' } }, s.empleador),
      el('span', { class: 'tag' }, s.cargo),
    ]),
    el('div', { class: 'legend', style: { marginTop: '2px' } }, [
      el('span', { class: 'list__meta' }, `Sueldo base ${clp(s.sueldoBase)}`),
      el('span', { class: 'list__meta' }, `Previsión ${s.prevision}`),
      el('span', { class: 'list__meta' }, `Salud ${s.salud}`),
    ]),

    el('div', { style: { margin: '6px 0' } }, [
      metrica(clp(liquido), 'Líquido mensual'),
    ]),

    // Líquido mensual — barra por mes.
    grafico(liq.map((l) => ({ label: l.mes, a: l.liquido })), { formato: clp, escalaAjustada: true }),

    el('div', { class: 'list' }, liq.map((l) => el('div', { class: 'list__item' }, [
      el('div', { class: 'avatar' }, l.mes.slice(0, 3)),
      el('div', { class: 'list__main' }, [
        el('div', { class: 'list__title' }, `${l.mes}${(l.iso || '').slice(0, 4) ? ` ${l.iso.slice(0, 4)}` : ''}`),
        el('div', { class: 'list__meta' }, `Haberes ${clp(l.haberes)} · Descuentos ${clp(l.descuentos)}`),
      ]),
      el('span', { class: 'list__value' }, clp(l.liquido)),
    ]))),
  ]);
}

/** Tarjeta con el saldo de la cuenta corriente y su evolución. */
function tarjetaCuenta(c) {
  if (!c || !c.saldos?.length) return null;
  const vals = c.saldos.map((s) => s.saldo);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const minP = c.saldos.find((s) => s.saldo === min);
  const maxP = c.saldos.find((s) => s.saldo === max);

  return card(`Cuenta corriente · ${c.banco}`, [
    el('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px' } }, [
      el('div', { class: 'metric__value' }, clp(c.saldoActual)),
      c.numero ? el('span', { class: 'tag' }, `N° ${c.numero}`) : null,
    ]),
    el('div', { class: 'metric__label' }, `Saldo al ${fecha(c.fechaSaldo, { day: 'numeric', month: 'long', year: 'numeric' })}`),

    sparkline(vals),

    el('div', { class: 'legend', style: { marginTop: '6px' } }, [
      el('span', { class: 'list__meta' }, `Mínimo ${clp(min)}${minP ? ` · ${fecha(minP.fecha)}` : ''}`),
      el('span', { class: 'list__meta' }, `Máximo ${clp(max)}${maxP ? ` · ${fecha(maxP.fecha)}` : ''}`),
      el('span', { class: 'list__meta' }, `${c.saldos.length} cierres de cartola`),
    ]),
  ]);
}

const COLOR_CAT = {
  'Supermercado': '#10b981',
  'Restaurantes y delivery': '#f59e0b',
  'Transporte': '#3b82f6',
  'Suscripciones y apps': '#8b5cf6',
  'Servicios y cuentas': '#14b8a6',
  'Crédito y deuda': '#f43f5e',
  'Comisiones': '#64748b',
  'Efectivo': '#a16207',
  'Transferencias': '#ec4899',
  'Compras varias': '#94a3b8',
};
const colorCat = (c) => COLOR_CAT[c] || 'var(--accent)';
const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Bloque interactivo "En qué gasto mi dinero": selector de mes, dona por
 * categoría y lista buscable de egresos. Maneja su propio estado y solo
 * repinta su subárbol al cambiar mes o búsqueda.
 */
function bloqueGastos(egresos) {
  if (!egresos?.length) {
    return card('En qué gasto mi dinero', [
      listaVacia('Aún no hay egresos cargados desde tus cartolas.'),
    ]);
  }

  const meses = [...new Set(egresos.map((e) => e.fecha.slice(0, 7)))].sort();
  let mesSel = 'todos';
  let q = '';

  const cont = el('div', { class: 'card__body' });

  const filtrarMes = () => (mesSel === 'todos' ? egresos : egresos.filter((e) => e.fecha.startsWith(mesSel)));

  const pintar = () => {
    const delMes = filtrarMes();
    const total = delMes.reduce((s, e) => s + e.monto, 0);

    // Totales por categoría (para la dona y la leyenda)
    const porCat = {};
    for (const e of delMes) porCat[e.cat] = (porCat[e.cat] || 0) + e.monto;
    const cats = Object.entries(porCat).sort((a, b) => b[1] - a[1]);
    const segmentos = cats.map(([label, value]) => ({ label, value, color: colorCat(label) }));

    // Lista filtrada por búsqueda
    const term = q.trim().toLowerCase();
    const lista = delMes
      .filter((e) => !term || e.desc.toLowerCase().includes(term) || e.cat.toLowerCase().includes(term))
      .sort((a, b) => b.monto - a.monto);

    cont.replaceChildren(
      // Selector de mes
      el('div', { class: 'meses' }, [
        el('button', {
          class: `mes-btn${mesSel === 'todos' ? ' is-active' : ''}`,
          onclick: () => { mesSel = 'todos'; pintar(); },
        }, 'Todos'),
        ...meses.map((m) => el('button', {
          class: `mes-btn${mesSel === m ? ' is-active' : ''}`,
          onclick: () => { mesSel = m; pintar(); },
        }, `${MESES_CORTO[+m.slice(5, 7) - 1]} ${m.slice(0, 4)}`)),
      ]),

      // Encabezado del total
      el('div', { style: { marginTop: '4px' } }, [
        el('div', { class: 'metric__value', style: { fontSize: '26px' } }, clp(total)),
        el('div', { class: 'metric__label' },
          `${lista.length} de ${delMes.length} egresos · ${mesSel === 'todos' ? 'todo el período' : `${MESES_CORTO[+mesSel.slice(5, 7) - 1]} ${mesSel.slice(0, 4)}`}`),
      ]),

      // Dona + leyenda
      total > 0
        ? el('div', { class: 'gastos' }, [
            donut(segmentos),
            el('div', { class: 'gastos__leg' }, cats.map(([c, v]) => el('div', { class: 'gastos__row' }, [
              el('span', { class: 'gastos__sw', style: { background: colorCat(c) } }),
              el('span', { class: 'gastos__name' }, c),
              el('b', {}, clp(v)),
              el('span', {}, `${Math.round((v / total) * 100)} %`),
            ]))),
          ])
        : listaVacia('Sin egresos este mes.'),

      // Búsqueda
      el('input', {
        class: 'input',
        type: 'search',
        placeholder: 'Buscar egreso (ej: shell, jumbo, uber)…',
        value: q,
        style: { marginTop: '4px' },
        oninput: (e) => {
          q = e.target.value;
          // Repinto solo la lista para no perder el foco del buscador.
          pintarLista(lista, e.target);
        },
      }),

      // Lista de egresos
      listaHost,
    );
    pintarLista(lista);
  };

  const listaHost = el('div', { class: 'list' });

  function pintarLista(lista, inputFocuseado) {
    // Recalcular por si viene de un oninput con término nuevo
    if (inputFocuseado) {
      const term = inputFocuseado.value.trim().toLowerCase();
      lista = filtrarMes()
        .filter((e) => !term || e.desc.toLowerCase().includes(term) || e.cat.toLowerCase().includes(term))
        .sort((a, b) => b.monto - a.monto);
    }
    listaHost.replaceChildren(
      ...(lista.length
        ? lista.slice(0, 200).map((e) => el('div', { class: 'list__item' }, [
            el('span', { class: 'dot', style: { background: colorCat(e.cat) } }),
            el('div', { class: 'list__main' }, [
              el('div', { class: 'list__title' }, e.desc),
              el('div', { class: 'list__meta' }, `${e.cat} · ${fecha(e.fecha)}`),
            ]),
            el('span', { class: 'list__value' }, clp(e.monto)),
          ]))
        : [listaVacia('Ningún egreso coincide con la búsqueda.')]),
    );
  }

  pintar();
  return card('En qué gasto mi dinero', [cont]);
}

export function finanzas(ctx) {
  const f = datos.finanzas;
  const t = totalesMes(f.movimientos);
  const prev = f.historial.at(-2) ?? { ingresos: 0, gastos: 0 };

  const porCat = {};
  for (const m of t.delMes.filter((x) => x.monto < 0)) {
    porCat[m.cat] = (porCat[m.cat] || 0) + Math.abs(m.monto);
  }

  const form = el('form', { class: 'card__body', onsubmit: (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const monto = Math.abs(Number(d.monto));
    if (!d.desc.trim() || !monto) return toast('Completa la descripción y el monto.');
    f.movimientos.push({
      id: uid(),
      fecha: d.fecha || hoyISO(),
      desc: d.desc.trim(),
      cat: d.tipo === 'ingreso' ? 'Ingreso' : (d.cat.trim() || 'Otros'),
      monto: d.tipo === 'ingreso' ? monto : -monto,
    });
    guardar();
    toast('Movimiento agregado.');
    ctx.recargar();
  } }, [
    el('div', { class: 'form-grid' }, [
      el('div', { class: 'field' }, [
        el('label', { for: 'fx-desc' }, 'Descripción'),
        el('input', { class: 'input', id: 'fx-desc', name: 'desc', placeholder: 'Supermercado', required: true }),
      ]),
      el('div', { class: 'field' }, [
        el('label', { for: 'fx-monto' }, 'Monto'),
        el('input', { class: 'input', id: 'fx-monto', name: 'monto', type: 'number', min: '0', step: '1', placeholder: '25000', required: true }),
      ]),
      el('div', { class: 'field' }, [
        el('label', { for: 'fx-tipo' }, 'Tipo'),
        el('select', { class: 'input', id: 'fx-tipo', name: 'tipo' }, [
          el('option', { value: 'gasto' }, 'Gasto'),
          el('option', { value: 'ingreso' }, 'Ingreso'),
        ]),
      ]),
      el('div', { class: 'field' }, [
        el('label', { for: 'fx-cat' }, 'Categoría'),
        el('input', { class: 'input', id: 'fx-cat', name: 'cat', placeholder: 'Alimentación', list: 'fx-cats' }),
      ]),
      el('div', { class: 'field' }, [
        el('label', { for: 'fx-fecha' }, 'Fecha'),
        el('input', { class: 'input', id: 'fx-fecha', name: 'fecha', type: 'date', value: hoyISO() }),
      ]),
    ]),
    el('datalist', { id: 'fx-cats' }, f.presupuestos.map((p) => el('option', { value: p.cat }))),
    el('div', {}, [el('button', { class: 'btn btn--primary', type: 'submit' }, [icon('i-mas'), 'Agregar movimiento'])]),
  ]);

  return [
    encabezado('i-finanzas', 'Finanzas personales',
      `Movimientos del mes en curso. ${f.monedaNota}. Los datos se guardan solo en este navegador.`),

    el('div', { class: 'grid' }, [
      // Sin movimientos este mes no hay comparación válida: no mostramos delta.
      card('Ingresos del mes', [metrica(clp(t.ingresos), t.delMes.length ? 'Este mes' : 'Sin registrar aún',
        t.delMes.length ? delta(variacion(t.ingresos, prev.ingresos)) : null)]),
      card('Gastos del mes', [metrica(clp(t.gastos), t.delMes.length ? 'Este mes' : 'Sin registrar aún',
        t.delMes.length ? delta(variacion(t.gastos, prev.gastos), { invertir: true }) : null)]),
      card('Balance', [metrica(clp(t.balance), t.balance >= 0 ? 'A favor' : 'En rojo')]),
      card('Tasa de ahorro', [metrica(t.ingresos ? pct((t.balance / t.ingresos) * 100, 0) : '—', 'Del ingreso mensual')]),
    ]),

    el('div', { class: 'grid grid--2' }, [
      tarjetaSueldo(f.sueldo),
      tarjetaCuenta(f.cuenta),
    ].filter(Boolean)),

    bloqueGastos(f.egresos),

    el('div', { class: 'grid grid--wide' }, [
      card('Ingresos vs. gastos — últimos 6 meses', [
        grafico(f.historial.map((h) => ({ label: h.mes, a: h.ingresos, b: h.gastos })), { formato: clp }),
        leyenda([['Ingresos', false], ['Gastos', true]]),
      ]),
      card('Presupuestos del mes', [
        f.presupuestos.length
          ? el('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
              f.presupuestos.map((p) => el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' } }, [
                el('div', { style: { flex: '1', minWidth: '0' } }, [
                  barra(p.cat, porCat[p.cat] || 0, p.tope, `${clp(porCat[p.cat] || 0)} / ${clp(p.tope)}`),
                ]),
                el('input', {
                  class: 'input', type: 'number', min: '0', step: '1000', value: p.tope,
                  style: { width: '110px', flex: 'none' },
                  'aria-label': `Tope de ${p.cat}`,
                  onchange: (e) => {
                    p.tope = Math.max(Number(e.target.value) || 0, 0);
                    guardar(); toast('Presupuesto actualizado.'); ctx.recargar();
                  },
                }),
                botonIcono('i-basura', 'Eliminar presupuesto', () => {
                  f.presupuestos = f.presupuestos.filter((x) => x !== p);
                  guardar(); toast('Eliminado.'); ctx.recargar();
                }),
              ])))
          : listaVacia('Sin presupuestos definidos.'),
        el('details', { style: { marginTop: '4px' } }, [
          el('summary', { style: { cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)', padding: '4px 0' } },
            'Agregar categoría'),
          formSimple(ctx, [
            { name: 'cat', label: 'Categoría', placeholder: 'Salud', required: true },
            { name: 'tope', label: 'Tope mensual', type: 'number', value: 100000 },
          ], (d) => { f.presupuestos.push({ cat: d.cat, tope: Number(d.tope) || 0 }); }),
        ]),
      ]),
    ]),

    card('Meta de ahorro', [
      el('form', { class: 'form-grid', onsubmit: (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        f.ahorro.nombre = d.nombre.trim() || f.ahorro.nombre;
        f.ahorro.actual = Number(d.actual) || 0;
        f.ahorro.meta = Number(d.meta) || 0;
        guardar(); toast('Meta actualizada.'); ctx.recargar();
      } }, [
        el('div', { class: 'field' }, [
          el('label', { for: 'ah-nombre' }, 'Nombre'),
          el('input', { class: 'input', id: 'ah-nombre', name: 'nombre', value: f.ahorro.nombre }),
        ]),
        el('div', { class: 'field' }, [
          el('label', { for: 'ah-actual' }, 'Ahorrado'),
          el('input', { class: 'input', id: 'ah-actual', name: 'actual', type: 'number', min: '0', value: f.ahorro.actual }),
        ]),
        el('div', { class: 'field' }, [
          el('label', { for: 'ah-meta' }, 'Meta'),
          el('input', { class: 'input', id: 'ah-meta', name: 'meta', type: 'number', min: '0', value: f.ahorro.meta }),
        ]),
        el('div', { class: 'field', style: { justifyContent: 'flex-end' } }, [
          el('button', { class: 'btn btn--primary', type: 'submit' }, [icon('i-check'), 'Guardar meta']),
        ]),
      ]),
      barra(f.ahorro.nombre, f.ahorro.actual, f.ahorro.meta,
        `${clp(f.ahorro.actual)} / ${clp(f.ahorro.meta)}`),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card(`Movimientos de ${fecha(hoyISO(), { month: 'long' })}`, [
        t.delMes.length
          ? el('div', { class: 'list' }, [...t.delMes].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((m) =>
              el('div', { class: 'list__item' }, [
                el('div', { class: 'avatar' }, m.cat.slice(0, 2).toUpperCase()),
                el('div', { class: 'list__main' }, [
                  el('div', { class: 'list__title' }, m.desc),
                  el('div', { class: 'list__meta' }, `${m.cat} · ${fecha(m.fecha)}`),
                ]),
                el('span', { class: 'list__value', style: { color: m.monto > 0 ? 'var(--c-finanzas)' : 'inherit' } },
                  `${m.monto > 0 ? '+' : '−'}${clp(Math.abs(m.monto))}`),
                botonIcono('i-basura', 'Eliminar movimiento', () => {
                  f.movimientos = f.movimientos.filter((x) => x.id !== m.id);
                  guardar();
                  toast('Movimiento eliminado.');
                  ctx.recargar();
                }),
              ])))
          : listaVacia('Sin movimientos este mes. Agrega el primero con el formulario.'),
      ]),
      card('Agregar movimiento', [form]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Marca personal
   ══════════════════════════════════════════════════════════════════ */

export function marca(ctx) {
  const m = datos.marca;
  const avanceProm = m.objetivos.reduce((s, o) => s + o.avance, 0) / (m.objetivos.length || 1);

  return [
    encabezado('i-marca', 'Marca personal', m.posicionamiento),

    el('div', { class: 'grid' }, [
      card('Avance general', [metrica(pct(avanceProm, 0), 'Promedio de objetivos')]),
      card('Objetivos activos', [metrica(m.objetivos.length, 'En seguimiento')]),
      card('Alcance mensual', [metrica(compact(datos.instagram.alcanceMes), 'Cuentas alcanzadas')]),
      card('Próximo hito', [
        proximos(m.hitos, 1).length
          ? metrica(relativo(proximos(m.hitos, 1)[0].fecha), proximos(m.hitos, 1)[0].texto)
          : metrica('—', 'Sin hitos programados'),
      ]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Objetivos', [
        m.objetivos.length
          ? el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
              m.objetivos.map((o) => el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' } }, [
                el('div', { style: { flex: '1', minWidth: '0' } }, [
                  progresoEditable(o.texto, o, 'avance', { alSoltar: guardarSuave }),
                ]),
                borrar(m, 'objetivos', o.id, ctx, 'objetivo'),
              ])))
          : listaVacia('Sin objetivos. Agrega el primero abajo.'),
        el('details', { style: { marginTop: '8px' } }, [
          el('summary', { style: { cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)', padding: '4px 0' } },
            'Agregar objetivo'),
          formSimple(ctx, [
            { name: 'texto', label: 'Objetivo', placeholder: 'Publicar 3 piezas por semana', required: true },
            { name: 'avance', label: 'Avance inicial (%)', type: 'number', value: 0 },
          ], (d) => { m.objetivos.push({ id: uid(), texto: d.texto, avance: Math.min(Number(d.avance) || 0, 100) }); }),
        ]),
      ]),
      card('Pilares de contenido', [
        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          m.pilares.map((p) => el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' } }, [
            el('div', { style: { flex: '1', minWidth: '0' } }, [
              progresoEditable(p.nombre, p, 'peso', { alSoltar: guardarSuave }),
            ]),
            botonIcono('i-basura', 'Eliminar pilar', () => {
              m.pilares = m.pilares.filter((x) => x !== p);
              guardar(); toast('Eliminado.'); ctx.recargar();
            }),
          ]))),
        el('details', { style: { marginTop: '8px' } }, [
          el('summary', { style: { cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)', padding: '4px 0' } },
            'Agregar pilar'),
          formSimple(ctx, [
            { name: 'nombre', label: 'Pilar', placeholder: 'Producción musical', required: true },
            { name: 'peso', label: 'Peso (%)', type: 'number', value: 20 },
          ], (d) => { m.pilares.push({ nombre: d.nombre, peso: Math.min(Number(d.peso) || 0, 100) }); }),
        ]),
      ]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Hitos', [
        m.hitos.length
          ? el('div', { class: 'list' }, [...m.hitos].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((h) =>
              el('div', { class: 'list__item' }, [
                el('span', { class: 'dot' }),
                el('div', { class: 'list__main' }, [
                  el('div', { class: 'list__title' }, h.texto),
                  el('div', { class: 'list__meta' }, fecha(h.fecha, { day: 'numeric', month: 'long', year: 'numeric' })),
                ]),
                el('span', { class: 'tag tag--accent' }, relativo(h.fecha)),
                botonIcono('i-basura', 'Eliminar hito', () => {
                  m.hitos = m.hitos.filter((x) => x.id !== h.id);
                  guardar(); ctx.recargar();
                }),
              ])))
          : listaVacia('Sin hitos.'),
      ]),
      card('Nuevo hito', [
        formSimple(ctx, [
          { name: 'texto', label: 'Hito', placeholder: 'Lanzar el portafolio', required: true },
          { name: 'fecha', label: 'Fecha', type: 'date', value: hoyISO() },
        ], (d) => { m.hitos.push({ id: uid(), texto: d.texto, fecha: d.fecha }); }),
      ]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Empresa
   ══════════════════════════════════════════════════════════════════ */

export function empresa(ctx) {
  const e = datos.empresa;
  const activos = e.proyectos.filter((p) => p.estado === 'En curso');
  const pipeline = e.proyectos.filter((p) => p.estado !== 'Cerrado').reduce((s, p) => s + p.valor, 0);
  const tono = { 'En curso': 'tag--info', 'Propuesta': 'tag--warn', 'Cerrado': 'tag--ok' };

  return [
    encabezado('i-empresa', e.nombre, 'Facturación, proyectos y cartera de clientes.'),

    el('div', { class: 'grid' }, [
      card('Facturación del mes', [
        metrica(clp(e.kpis.facturacionMes), 'Mes en curso',
          delta(variacion(e.kpis.facturacionMes, e.kpis.facturacionPrev))),
      ]),
      card('Pipeline', [metrica(clp(pipeline), `${e.proyectos.length - activos.length} por cerrar`)]),
      card('Clientes activos', [metrica(e.kpis.clientesActivos, 'Con proyecto vigente')]),
      card('Margen', [metrica(pct(e.kpis.margen), 'Sobre facturación')]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Ventas — últimos 6 meses', [
        grafico(e.ventas.map((v) => ({ label: v.mes, a: v.v })), { formato: clp }),
      ]),
      card('Tendencia', [
        metrica(clp(e.ventas.at(-1).v), 'Último mes'),
        sparkline(e.ventas.map((v) => v.v)),
        el('div', { class: 'list__meta' },
          `Promedio 6 meses: ${clp(e.ventas.reduce((s, v) => s + v.v, 0) / e.ventas.length)}`),
      ]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Proyectos', [
        e.proyectos.length
          ? el('div', { class: 'list' }, e.proyectos.map((p) => el('div', { class: 'list__item' }, [
              el('div', { class: 'avatar' }, p.nombre.slice(0, 2).toUpperCase()),
              el('div', { class: 'list__main' }, [
                el('div', { class: 'list__title' }, p.nombre),
                progresoEditable(`${clp(p.valor)}`, p, 'avance', { alSoltar: guardarSuave }),
              ]),
              el('select', {
                class: 'input',
                style: { width: 'auto', flex: 'none' },
                'aria-label': `Estado de ${p.nombre}`,
                onchange: (ev) => { p.estado = ev.target.value; guardar(); toast('Estado actualizado.'); ctx.recargar(); },
              }, ['En curso', 'Propuesta', 'Cerrado'].map((o) =>
                el('option', { value: o, selected: o === p.estado }, o))),
              borrar(e, 'proyectos', p.id, ctx, 'proyecto'),
            ])))
          : listaVacia('Sin proyectos. Agrega el primero al lado.'),
      ]),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } }, [
        card('Nuevo proyecto', [
          formSimple(ctx, [
            { name: 'nombre', label: 'Proyecto', placeholder: 'Jingle radial — Cliente B', required: true },
            { name: 'valor', label: 'Valor', type: 'number', value: 0 },
            { name: 'estado', label: 'Estado', tipo: 'select', opciones: ['En curso', 'Propuesta', 'Cerrado'], value: 'Propuesta' },
            { name: 'avance', label: 'Avance (%)', type: 'number', value: 0 },
          ], (d) => {
            e.proyectos.push({
              id: uid(), nombre: d.nombre, estado: d.estado,
              valor: Number(d.valor) || 0,
              avance: Math.min(Number(d.avance) || 0, 100),
            });
          }),
        ]),
        card('Cifras del mes', [
          el('form', { class: 'form-grid', onsubmit: (ev) => {
            ev.preventDefault();
            const d = Object.fromEntries(new FormData(ev.target));
            e.nombre = d.nombre.trim() || e.nombre;
            e.kpis.facturacionMes = Number(d.facturacion) || 0;
            e.kpis.clientesActivos = Number(d.clientes) || 0;
            e.kpis.margen = Number(d.margen) || 0;
            guardar(); toast('Cifras actualizadas.'); ctx.recargar();
          } }, [
            campo('emp-nombre', 'nombre', 'Nombre de la empresa', e.nombre, 'text'),
            campo('emp-fact', 'facturacion', 'Facturación del mes', e.kpis.facturacionMes, 'number'),
            campo('emp-cli', 'clientes', 'Clientes activos', e.kpis.clientesActivos, 'number'),
            campo('emp-margen', 'margen', 'Margen (%)', e.kpis.margen, 'number'),
            el('div', { class: 'field', style: { gridColumn: '1 / -1' } }, [
              el('button', { class: 'btn btn--primary', type: 'submit' }, [icon('i-check'), 'Guardar cifras']),
            ]),
          ]),
        ]),
      ]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Instagram
   ══════════════════════════════════════════════════════════════════ */

export function instagram(ctx) {
  const ig = datos.instagram;
  const prev = ig.historial.at(-2)?.seguidores ?? ig.seguidores;
  const posts = ig.publicacionesRecientes;

  // Engagement = interacciones promedio por publicación sobre seguidores.
  const interacciones = posts.map((p) => p.likes + p.comentarios + p.guardados);
  const promInter = interacciones.reduce((s, v) => s + v, 0) / (posts.length || 1);
  const tasa = ig.seguidores ? (promInter / ig.seguidores) * 100 : 0;

  const porTipo = {};
  for (const p of posts) {
    porTipo[p.tipo] ??= { n: 0, inter: 0 };
    porTipo[p.tipo].n++;
    porTipo[p.tipo].inter += p.likes + p.comentarios + p.guardados;
  }
  const mejorTipo = Object.entries(porTipo).sort((a, b) => b[1].inter / b[1].n - a[1].inter / a[1].n)[0];

  // Una medición por día: si ya registré hoy, la reemplazo.
  const registrarHoy = () => {
    const hoy = hoyISO();
    const i = ig.historial.findIndex((h) => h.fecha === hoy);
    const punto = { fecha: hoy, seguidores: ig.seguidores };
    if (i >= 0) ig.historial[i] = punto; else ig.historial.push(punto);
    guardar();
  };

  // ── Actualización rápida: los dos números que cambian seguido ──────
  const pista = el('div', { class: 'list__meta' }, `Última medición: ${num(prev)} seguidores`);
  const inSeg = el('input', {
    class: 'input', type: 'number', min: '0', inputmode: 'numeric', value: ig.seguidores,
    'aria-label': 'Seguidores',
    onfocus: (e) => e.target.select(),
    oninput: (e) => {
      const d = (Number(e.target.value) || 0) - prev;
      pista.textContent = d === 0
        ? `Sin cambios respecto de la última medición (${num(prev)})`
        : `${d > 0 ? '+' : '−'}${num(Math.abs(d))} desde la última medición`;
    },
  });
  const inAlc = el('input', {
    class: 'input', type: 'number', min: '0', inputmode: 'numeric', value: ig.alcanceMes,
    'aria-label': 'Alcance del mes',
    onfocus: (e) => e.target.select(),
  });
  const rapida = el('form', {
    style: { display: 'flex', flexDirection: 'column', gap: '12px' },
    onsubmit: (e) => {
      e.preventDefault();
      ig.seguidores = Number(inSeg.value) || 0;
      ig.alcanceMes = Number(inAlc.value) || 0;
      registrarHoy();
      toast('Registrado. El gráfico se actualizó.');
      ctx.recargar();
    },
  }, [
    el('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' } }, [
      el('div', { class: 'field', style: { flex: '1', minWidth: '130px' } }, [
        el('label', {}, 'Seguidores'), inSeg,
      ]),
      el('div', { class: 'field', style: { flex: '1', minWidth: '130px' } }, [
        el('label', {}, 'Alcance del mes'), inAlc,
      ]),
      el('button', { class: 'btn btn--primary', type: 'submit', style: { flex: 'none' } },
        [icon('i-check'), 'Registrar hoy']),
    ]),
    pista,
  ]);

  const perfil = el('form', { class: 'card__body', onsubmit: (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    Object.assign(ig, {
      usuario: d.usuario.trim().replace(/^@/, '') || ig.usuario,
      seguidores: Number(d.seguidores) || 0,
      siguiendo: Number(d.siguiendo) || 0,
      publicaciones: Number(d.publicaciones) || 0,
      alcanceMes: Number(d.alcance) || 0,
    });
    registrarHoy();
    toast('Métricas actualizadas.');
    ctx.recargar();
  } }, [
    el('div', { class: 'form-grid' }, [
      campo('ig-usuario', 'usuario', 'Usuario', ig.usuario, 'text'),
      campo('ig-seguidores', 'seguidores', 'Seguidores', ig.seguidores, 'number'),
      campo('ig-siguiendo', 'siguiendo', 'Siguiendo', ig.siguiendo, 'number'),
      campo('ig-publicaciones', 'publicaciones', 'Publicaciones', ig.publicaciones, 'number'),
      campo('ig-alcance', 'alcance', 'Alcance del mes', ig.alcanceMes, 'number'),
    ]),
    el('div', {}, [el('button', { class: 'btn btn--primary', type: 'submit' }, [icon('i-check'), 'Guardar y registrar hoy'])]),
  ]);

  const ins = ig.insights;

  return [
    encabezado('i-instagram', `Instagram — @${ig.usuario}`,
      [ig.nombre, ig.bio].filter(Boolean).join(' · ') || 'Seguimiento de tu cuenta.'),

    card('Actualización rápida', [
      el('p', { class: 'list__meta', style: { marginBottom: '4px' } },
        'Abre Instagram → Panel profesional, copia estos dos números y presiona Enter. Queda registrada la medición de hoy.'),
      rapida,
    ]),

    el('div', { class: 'grid' }, [
      card('Seguidores', [metrica(num(ig.seguidores),
        ig.historial.length > 1 ? `${ig.seguidores >= prev ? '+' : '−'}${num(Math.abs(ig.seguidores - prev))} desde la medición anterior` : 'Medición actual',
        ig.historial.length > 1 ? delta(variacion(ig.seguidores, prev)) : null)]),
      card('Siguiendo', [metrica(num(ig.siguiendo),
        ig.siguiendo ? `Ratio ${(ig.seguidores / ig.siguiendo).toFixed(2).replace('.', ',')} seg./sig.` : 'Cuentas que sigues')]),
      card('Publicaciones', [metrica(num(ig.publicaciones), 'En tu perfil')]),
      card('Alcance reciente', [metrica(compact(ins?.alcance ?? ig.alcanceMes),
        ins?.periodo || 'Cuentas alcanzadas', ins ? delta(ins.alcanceDelta) : null)]),
    ]),

    // Insights reales del export de Instagram (alcance, impresiones, visitas)
    ins ? card('Alcance y visibilidad', [
      el('div', { class: 'metric__label', style: { marginBottom: '14px' } },
        `Período ${ins.periodo} · desde tu export de Instagram`),
      el('div', { style: { display: 'flex', gap: 'var(--sp-8)', flexWrap: 'wrap' } }, [
        metrica(compact(ins.alcance), 'Cuentas alcanzadas', delta(ins.alcanceDelta)),
        metrica(compact(ins.impresiones), 'Impresiones', delta(ins.impresionesDelta)),
        metrica(compact(ins.visitas), 'Visitas al perfil', delta(ins.visitasDelta)),
      ]),
      el('div', { style: { marginTop: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: '10px' } }, [
        el('div', { class: 'card__title' }, 'De dónde vino el alcance'),
        barra('Seguidores', ins.pctSeguidores, 100, pct(ins.pctSeguidores)),
        barra('No seguidores', 100 - ins.pctSeguidores, 100, pct(100 - ins.pctSeguidores)),
      ]),
    ]) : null,

    aviso([el('div', {}, [
      el('strong', {}, 'De dónde salen estos datos: '),
      'de tu export oficial de Instagram (Configuración → Tu actividad → Descargar tu información). ',
      'Para actualizarlos, vuelve a pedir el export y me lo pasas, o registra las mediciones a mano arriba.',
    ])]),

    el('div', { class: 'grid grid--wide' }, [
      card('Crecimiento de seguidores', [
        ig.historial.length > 1
          ? el('div', {}, [
              grafico(ig.historial.map((h) => ({
                label: fecha(h.fecha, { month: 'short' }).replace('.', ''),
                a: h.seguidores,
              })), { formato: num, escalaAjustada: true }),
              el('div', { class: 'list__meta', style: { marginTop: '10px' } },
                `De ${num(ig.historial[0].seguidores)} a ${num(ig.historial.at(-1).seguidores)} · ${ig.historial.length} mediciones`),
            ])
          : listaVacia('Registra al menos dos mediciones para ver la tendencia.'),
      ]),
      card('Qué funciona mejor', [
        mejorTipo
          ? el('div', { class: 'card__body' }, [
              metrica(mejorTipo[0], `${Math.round(mejorTipo[1].inter / mejorTipo[1].n)} interacciones por publicación en promedio`),
              el('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' } },
                Object.entries(porTipo)
                  .sort((a, b) => b[1].inter / b[1].n - a[1].inter / a[1].n)
                  .map(([tipo, v]) => barra(tipo, v.inter / v.n, mejorTipo[1].inter / mejorTipo[1].n,
                    `${Math.round(v.inter / v.n)} · ${v.n} pub.`))),
            ])
          : listaVacia('Agrega publicaciones para comparar formatos.'),
      ]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Publicaciones recientes', [
        posts.length
          ? el('div', { class: 'list' }, [...posts].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((p) => {
              const inter = p.likes + p.comentarios + p.guardados;
              return el('div', { class: 'list__item' }, [
                el('div', { class: 'avatar' }, p.tipo.slice(0, 2).toUpperCase()),
                el('div', { class: 'list__main' }, [
                  el('div', { class: 'list__title' }, p.tema),
                  el('div', { class: 'list__meta' },
                    `${p.tipo} · ${fecha(p.fecha)} · ${num(p.likes)} me gusta · ${num(p.comentarios)} comentarios · ${num(p.guardados)} guardados`),
                ]),
                el('span', { class: 'list__value' }, num(inter)),
                botonIcono('i-basura', 'Eliminar publicación', () => {
                  ig.publicacionesRecientes = ig.publicacionesRecientes.filter((x) => x.id !== p.id);
                  guardar(); ctx.recargar();
                }),
              ]);
            }))
          : listaVacia('Sin publicaciones registradas.'),
      ]),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } }, [
        card('Métricas del perfil', [perfil]),
        card('Registrar publicación', [
          formSimple(ctx, [
            { name: 'tema', label: 'Tema', placeholder: 'Detrás de la mezcla', required: true },
            { name: 'tipo', label: 'Formato', tipo: 'select', opciones: ['Reel', 'Carrusel', 'Foto', 'Historia'] },
            { name: 'likes', label: 'Me gusta', type: 'number', value: 0 },
            { name: 'comentarios', label: 'Comentarios', type: 'number', value: 0 },
            { name: 'guardados', label: 'Guardados', type: 'number', value: 0 },
            { name: 'fecha', label: 'Fecha', type: 'date', value: hoyISO() },
          ], (d) => {
            ig.publicacionesRecientes.push({
              id: uid(), fecha: d.fecha, tipo: d.tipo, tema: d.tema,
              likes: Number(d.likes) || 0,
              comentarios: Number(d.comentarios) || 0,
              guardados: Number(d.guardados) || 0,
            });
          }),
        ]),
      ]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Producción musical
   ══════════════════════════════════════════════════════════════════ */

export function musica(ctx) {
  const m = datos.musica;
  const horas = m.horasSemana.reduce((s, d) => s + d.h, 0);
  const activos = m.proyectos.filter((p) => p.avance < 100);
  const tonoEtapa = { 'Masterizado': 'tag--ok', 'Mezcla': 'tag--info', 'Grabación': 'tag--warn', 'Composición': '' };

  return [
    encabezado('i-musica', 'Producción musical', 'Proyectos en curso, horas de estudio e ideas sueltas.'),

    el('div', { class: 'grid' }, [
      card('Horas esta semana', [metrica(`${horas.toString().replace('.', ',')} h`, `Meta: ${m.metaHoras} h`,
        delta(variacion(horas, m.metaHoras)))]),
      card('Proyectos activos', [metrica(activos.length, `${m.proyectos.length} en total`)]),
      card('Tracks en curso', [metrica(activos.reduce((s, p) => s + p.tracks, 0), 'Entre todos los proyectos')]),
      card('Avance promedio', [metrica(pct(activos.reduce((s, p) => s + p.avance, 0) / (activos.length || 1), 0), 'De los proyectos activos')]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Horas de estudio por día', [
        grafico(m.horasSemana.map((d) => ({ label: d.d, a: d.h })), { formato: (h) => `${h} h` }),
        barra('Meta semanal', horas, m.metaHoras, `${horas} / ${m.metaHoras} h`),
      ]),
      card('Proyectos', [
        m.proyectos.length
          ? el('div', { class: 'list' }, m.proyectos.map((p) => el('div', { class: 'list__item' }, [
              el('div', { class: 'list__main' }, [
                el('div', { class: 'list__title' }, p.nombre),
                progresoEditable(`${p.tracks} ${p.tracks === 1 ? 'track' : 'tracks'}`, p, 'avance',
                  { alSoltar: guardarSuave }),
              ]),
              el('select', {
                class: 'input',
                style: { width: 'auto', flex: 'none' },
                'aria-label': `Etapa de ${p.nombre}`,
                onchange: (ev) => { p.etapa = ev.target.value; guardar(); toast('Etapa actualizada.'); ctx.recargar(); },
              }, ['Composición', 'Grabación', 'Mezcla', 'Masterizado'].map((o) =>
                el('option', { value: o, selected: o === p.etapa }, o))),
              borrar(m, 'proyectos', p.id, ctx, 'proyecto'),
            ])))
          : listaVacia('Sin proyectos.'),
        el('details', { style: { marginTop: '8px' } }, [
          el('summary', { style: { cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)', padding: '4px 0' } },
            'Agregar proyecto'),
          formSimple(ctx, [
            { name: 'nombre', label: 'Proyecto', placeholder: 'EP — "Sur"', required: true },
            { name: 'etapa', label: 'Etapa', tipo: 'select', opciones: ['Composición', 'Grabación', 'Mezcla', 'Masterizado'], value: 'Composición' },
            { name: 'tracks', label: 'Tracks', type: 'number', value: 1 },
            { name: 'avance', label: 'Avance (%)', type: 'number', value: 0 },
          ], (d) => {
            m.proyectos.push({
              id: uid(), nombre: d.nombre, etapa: d.etapa,
              tracks: Number(d.tracks) || 1,
              avance: Math.min(Number(d.avance) || 0, 100),
            });
          }),
        ]),
      ]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Ideas', [
        m.ideas.length
          ? el('div', { class: 'list' }, m.ideas.map((i) => el('div', { class: 'list__item' }, [
              el('span', { class: 'dot' }),
              el('div', { class: 'list__main' }, [el('div', { class: 'list__title' }, i.texto)]),
              botonIcono('i-basura', 'Eliminar idea', () => {
                m.ideas = m.ideas.filter((x) => x.id !== i.id);
                guardar(); ctx.recargar();
              }),
            ])))
          : listaVacia('Sin ideas anotadas.'),
      ]),
      card('Anotar idea', [
        formSimple(ctx, [
          { name: 'texto', label: 'Idea', tipo: 'textarea', placeholder: 'Loop de guitarra en 6/8…', required: true },
        ], (d) => { m.ideas.push({ id: uid(), texto: d.texto }); }, 'Anotar'),
      ]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Iglesia
   ══════════════════════════════════════════════════════════════════ */

export function iglesia(ctx) {
  const i = datos.iglesia;
  const prox = proximos(i.agenda, 6);

  return [
    encabezado('i-iglesia', i.congregacion, 'Compromisos, servicio y repertorio.'),

    el('div', { class: 'grid' }, [
      card('Próximo compromiso', [
        prox.length ? metrica(relativo(prox[0].fecha), `${prox[0].titulo} · ${prox[0].hora}`) : metrica('—', 'Nada agendado'),
      ]),
      card('Compromisos del mes', [
        metrica(i.agenda.filter((e) => e.fecha.startsWith(mesActual())).length, fecha(hoyISO(), { month: 'long' })),
      ]),
      card('Veces servidas', [metrica(i.servidos, 'En lo que va del año')]),
      card('Repertorio', [metrica(i.repertorio.length, 'Canciones preparadas')]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Agenda', [
        prox.length
          ? el('div', { class: 'list' }, prox.map((e) => el('div', { class: 'list__item' }, [
              el('div', { class: 'avatar' }, fecha(e.fecha, { day: 'numeric' })),
              el('div', { class: 'list__main' }, [
                el('div', { class: 'list__title' }, e.titulo),
                el('div', { class: 'list__meta' }, `${e.rol} · ${fecha(e.fecha, { weekday: 'long', day: 'numeric', month: 'long' })} · ${e.hora}`),
              ]),
              el('span', { class: 'tag tag--accent' }, relativo(e.fecha)),
              botonIcono('i-basura', 'Eliminar compromiso', () => {
                i.agenda = i.agenda.filter((x) => x.id !== e.id);
                guardar(); ctx.recargar();
              }),
            ])))
          : listaVacia('Sin compromisos próximos.'),
      ]),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } }, [
        card('Agendar', [
          formSimple(ctx, [
            { name: 'titulo', label: 'Compromiso', placeholder: 'Ensayo de banda', required: true },
            { name: 'rol', label: 'Rol', placeholder: 'Teclados' },
            { name: 'fecha', label: 'Fecha', type: 'date', value: hoyISO() },
            { name: 'hora', label: 'Hora', type: 'time', value: '11:00' },
          ], (d) => { i.agenda.push({ id: uid(), ...d }); }),
        ]),
        card('Repertorio', [
          i.repertorio.length
            ? el('div', { class: 'list' }, i.repertorio.map((r) => el('div', { class: 'list__item' }, [
                el('span', { class: 'dot' }),
                el('div', { class: 'list__main' }, [el('div', { class: 'list__title' }, r.titulo)]),
                el('span', { class: 'tag' }, `Tono ${r.tono}`),
                borrar(i, 'repertorio', r.id, ctx, 'canción'),
              ])))
            : listaVacia('Sin canciones.'),
          el('details', { style: { marginTop: '8px' } }, [
            el('summary', { style: { cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)', padding: '4px 0' } },
              'Agregar canción'),
            formSimple(ctx, [
              { name: 'titulo', label: 'Canción', placeholder: 'Océanos', required: true },
              { name: 'tono', label: 'Tono', placeholder: 'D' },
            ], (d) => { i.repertorio.push({ id: uid(), titulo: d.titulo, tono: d.tono || '—' }); }),
          ]),
        ]),
      ]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Familia
   ══════════════════════════════════════════════════════════════════ */

export function familia(ctx) {
  const f = datos.familia;
  const agenda = [
    ...f.eventos.map((e) => ({ ...e, tipo: 'Plan' })),
    ...f.fechas.map((e) => ({ ...e, titulo: e.nombre, tipo: 'Fecha' })),
  ];
  const prox = proximos(agenda, 8);

  return [
    encabezado('i-familia', 'Familia', 'Planes, fechas importantes e intenciones.'),

    el('div', { class: 'grid' }, [
      card('Próximo plan', [
        prox.length ? metrica(relativo(prox[0].fecha), prox[0].titulo) : metrica('—', 'Nada agendado'),
      ]),
      card('Planes agendados', [metrica(f.eventos.length, 'En el calendario')]),
      card('Fechas importantes', [metrica(f.fechas.length, 'Cumpleaños y aniversarios')]),
      card('Intenciones', [
        metrica(pct(f.intenciones.reduce((s, i) => s + i.avance, 0) / (f.intenciones.length || 1), 0), 'Avance promedio'),
      ]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Calendario', [
        prox.length
          ? el('div', { class: 'list' }, prox.map((e) => el('div', { class: 'list__item' }, [
              el('div', { class: 'avatar' }, fecha(e.fecha, { day: 'numeric' })),
              el('div', { class: 'list__main' }, [
                el('div', { class: 'list__title' }, e.titulo),
                el('div', { class: 'list__meta' },
                  `${e.tipo}${e.quien ? ` · ${e.quien}` : ''} · ${fecha(e.fecha, { weekday: 'long', day: 'numeric', month: 'long' })}`),
              ]),
              el('span', { class: 'tag tag--accent' }, relativo(e.fecha)),
              // El calendario mezcla planes y fechas: hay que borrar del que corresponda.
              borrar(f, e.tipo === 'Plan' ? 'eventos' : 'fechas', e.id, ctx,
                e.tipo === 'Plan' ? 'plan' : 'fecha'),
            ])))
          : listaVacia('Sin planes próximos.'),
      ]),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } }, [
        card('Agregar plan', [
          formSimple(ctx, [
            { name: 'titulo', label: 'Plan', placeholder: 'Cena familiar', required: true },
            { name: 'quien', label: 'Con quién', placeholder: 'Todos' },
            { name: 'fecha', label: 'Fecha', type: 'date', value: hoyISO() },
          ], (d) => { f.eventos.push({ id: uid(), ...d }); }),
        ]),
        card('Fecha importante', [
          formSimple(ctx, [
            { name: 'nombre', label: 'Fecha', placeholder: 'Cumpleaños — Mamá', required: true },
            { name: 'fecha', label: 'Día', type: 'date', value: hoyISO() },
          ], (d) => { f.fechas.push({ id: uid(), nombre: d.nombre, fecha: d.fecha }); }),
        ]),
      ]),
    ]),

    card('Intenciones', [
      f.intenciones.length
        ? el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
            f.intenciones.map((i) => el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' } }, [
              el('div', { style: { flex: '1', minWidth: '0' } }, [
                progresoEditable(i.texto, i, 'avance', { alSoltar: guardarSuave }),
              ]),
              borrar(f, 'intenciones', i.id, ctx, 'intención'),
            ])))
        : listaVacia('Sin intenciones.'),
      el('details', { style: { marginTop: '8px' } }, [
        el('summary', { style: { cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)', padding: '4px 0' } },
          'Agregar intención'),
        formSimple(ctx, [
          { name: 'texto', label: 'Intención', placeholder: 'Una salida familiar al mes', required: true },
          { name: 'avance', label: 'Avance (%)', type: 'number', value: 0 },
        ], (d) => { f.intenciones.push({ id: uid(), texto: d.texto, avance: Math.min(Number(d.avance) || 0, 100) }); }),
      ]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Trabajo
   ══════════════════════════════════════════════════════════════════ */

export function trabajo(ctx) {
  const t = datos.trabajo;
  const pend = t.tareas.filter((x) => !x.hecha);
  const hechas = t.tareas.filter((x) => x.hecha);
  const vencidas = pend.filter((x) => x.vence < hoyISO());
  const horas = t.foco.reduce((s, d) => s + d.h, 0);
  const tonoPrio = { alta: 'tag--warn', media: 'tag--info', baja: '' };

  const fila = (x) => el('div', { class: 'list__item' }, [
    el('button', {
      class: 'icon-btn',
      style: {
        width: '24px', height: '24px', borderRadius: '7px', flex: 'none',
        border: `1.5px solid ${x.hecha ? 'var(--c-trabajo)' : 'var(--border-strong)'}`,
        background: x.hecha ? 'var(--c-trabajo)' : 'transparent',
        color: x.hecha ? '#fff' : 'transparent',
      },
      'aria-label': x.hecha ? `Marcar como pendiente: ${x.texto}` : `Marcar como hecha: ${x.texto}`,
      onclick: () => { x.hecha = !x.hecha; guardar(); ctx.recargar(); },
    }, [icon('i-check', 'icon')]),
    el('div', { class: 'list__main' }, [
      el('div', {
        class: 'list__title',
        style: x.hecha ? { textDecoration: 'line-through', color: 'var(--text-3)' } : {},
      }, x.texto),
      el('div', { class: 'list__meta' }, `Vence ${relativo(x.vence)} · ${fecha(x.vence)}`),
    ]),
    !x.hecha && x.vence < hoyISO() ? el('span', { class: 'delta delta--down' }, 'Atrasada') : null,
    el('span', { class: `tag ${tonoPrio[x.prio]}` }, x.prio),
    botonIcono('i-basura', 'Eliminar tarea', () => {
      t.tareas = t.tareas.filter((y) => y.id !== x.id);
      guardar(); ctx.recargar();
    }),
  ]);

  return [
    encabezado('i-trabajo', 'Trabajo', 'Tareas, prioridades y horas de foco.'),

    el('div', { class: 'grid' }, [
      card('Pendientes', [metrica(pend.length, `${pend.filter((x) => x.prio === 'alta').length} de prioridad alta`)]),
      card('Atrasadas', [metrica(vencidas.length, vencidas.length ? 'Requieren atención' : 'Todo al día')]),
      card('Completadas', [metrica(hechas.length, `${t.tareas.length ? Math.round((hechas.length / t.tareas.length) * 100) : 0} % del total`)]),
      card('Horas de foco', [metrica(`${horas.toString().replace('.', ',')} h`, 'Esta semana')]),
    ]),

    el('div', { class: 'grid grid--wide' }, [
      card('Tareas', [
        pend.length ? el('div', { class: 'list' }, pend
          .sort((a, b) => a.vence.localeCompare(b.vence))
          .map(fila)) : listaVacia('Sin pendientes. Buen trabajo.'),
        hechas.length
          ? el('details', { style: { marginTop: '12px' } }, [
              el('summary', {
                style: { cursor: 'pointer', fontSize: '13px', color: 'var(--text-3)', padding: '6px 0' },
              }, `Completadas (${hechas.length})`),
              el('div', { class: 'list' }, hechas.map(fila)),
            ])
          : null,
      ]),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } }, [
        card('Nueva tarea', [
          formSimple(ctx, [
            { name: 'texto', label: 'Tarea', placeholder: 'Enviar la factura del mes', required: true },
            { name: 'prio', label: 'Prioridad', tipo: 'select', opciones: ['alta', 'media', 'baja'], value: 'media' },
            { name: 'vence', label: 'Vence', type: 'date', value: hoyISO() },
          ], (d) => { t.tareas.push({ id: uid(), ...d, hecha: false }); }),
        ]),
        card('Horas de foco por día', [
          grafico(t.foco.map((d) => ({ label: d.d, a: d.h })), { formato: (h) => `${h} h`, alto: 120 }),
        ]),
      ]),
    ]),
  ];
}

/* ══════════════════════════════════════════════════════════════════
   Ajustes
   ══════════════════════════════════════════════════════════════════ */

/** Tarjeta de respaldo automático: refleja el estado real del archivo vinculado. */
function tarjetaRespaldo(ctx) {
  const cuerpo = el('div', { class: 'card__body' });

  const pintar = () => {
    const e = R.estado;
    const hijos = [];

    if (!e.soportado) {
      hijos.push(
        el('p', { style: { fontSize: '13.5px', color: 'var(--text-2)' } },
          'Este navegador no permite escribir en un archivo automáticamente. Funciona en Chrome y Edge; ' +
          'en Safari y Firefox usa la copia manual de más abajo.'),
        el('span', { class: 'tag' }, 'No disponible aquí'),
      );
    } else if (e.activo) {
      hijos.push(
        el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } }, [
          el('span', { class: 'tag tag--ok' }, [icon('i-check'), 'Guardando solo']),
          el('span', { style: { fontSize: '13px', color: 'var(--text-2)' } }, e.nombre),
        ]),
        el('p', { style: { fontSize: '13px', color: 'var(--text-3)' } },
          e.ultimo
            ? `Última escritura: ${e.ultimo.toLocaleTimeString('es-CL')}. Cada cambio se guarda en el archivo.`
            : 'Cada cambio que hagas se escribirá en el archivo.'),
        el('div', {}, [el('button', {
          class: 'btn btn--sm',
          onclick: async () => { await R.olvidarHandle(); R.desactivar(); toast('Respaldo desconectado.'); },
        }, 'Desconectar')]),
      );
    } else if (e.pendiente) {
      hijos.push(
        el('p', { style: { fontSize: '13.5px', color: 'var(--text-2)' } },
          e.error
            ? `Se interrumpió el respaldo: ${e.error}. Vuelve a conectarlo.`
            : `Hay un archivo vinculado (${e.nombre ?? 'respaldo'}), pero el navegador necesita que confirmes el permiso.`),
        el('div', {}, [el('button', {
          class: 'btn btn--primary',
          onclick: async () => {
            if (await R.reanudar(datos)) toast('Respaldo reanudado.');
            else toast('No se otorgó el permiso.');
          },
        }, 'Reconectar respaldo')]),
      );
    } else {
      hijos.push(
        el('p', { style: { fontSize: '13.5px', color: 'var(--text-2)' } },
          'Elige un archivo (por ejemplo dentro de tu iCloud Drive) y cada cambio se guardará ahí solo, ' +
          'además del navegador. Como iCloud sincroniza, tus datos quedan en todos tus equipos.'),
        el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
          el('button', {
            class: 'btn btn--primary',
            onclick: async () => {
              try {
                const h = await R.conectarNuevo();
                R.activar(h, datos);
                toast('Respaldo activado.');
              } catch (err) {
                if (err.name !== 'AbortError') toast('No se pudo conectar el archivo.');
              }
            },
          }, [icon('i-check'), 'Guardar en un archivo']),
          el('button', {
            class: 'btn',
            onclick: async () => {
              try {
                const h = await R.abrirExistente();
                const previo = await R.leer(h);
                if (previo && confirm('¿Cargar los datos de ese archivo? Reemplazará lo que tienes en este navegador.')) {
                  importar(previo);
                  location.reload();
                  return;
                }
                R.activar(h, datos);
                toast('Respaldo activado.');
              } catch (err) {
                if (err.name !== 'AbortError') toast('No se pudo abrir el archivo.');
              }
            },
          }, 'Usar un respaldo existente'),
        ]),
      );
    }
    cuerpo.replaceChildren(...hijos);
  };

  pintar();
  // La tarjeta se redibuja sola cuando cambia el estado del respaldo.
  const off = R.alCambiarEstado(pintar);
  ctx.alSalir?.(off);

  return card('Respaldo automático', [cuerpo]);
}

const REPO = 'munozfuentealba/panel-personal';

/** Publicar en el repositorio: leer es automático, subir es manual (y por qué). */
function tarjetaRepositorio() {
  const o = origen;
  const desde = {
    repo: ['tag--ok', 'Cargado desde el repositorio'],
    local: ['tag--info', 'Usando lo de este navegador'],
    ejemplo: ['tag--warn', 'Datos de ejemplo'],
  }[o.de] ?? ['tag', o.de];

  return card('Datos en el repositorio', [
    el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } }, [
      el('span', { class: `tag ${desde[0]}` }, desde[1]),
      o.fecha ? el('span', { style: { fontSize: '13px', color: 'var(--text-3)' } },
        `Actualizado el ${fecha(o.fecha.slice(0, 10), { day: 'numeric', month: 'long' })}`) : null,
    ]),

    el('p', { style: { fontSize: '13.5px', color: 'var(--text-2)' } },
      o.hayRepo
        ? 'El panel lee estos datos del repositorio al abrirse. Por eso, aunque borres el historial o cambies de equipo, vuelven solos.'
        : 'Aún no has publicado datos.json en el repositorio. Cuando lo hagas, el panel lo cargará solo cada vez que lo abras.'),

    el('p', { style: { fontSize: '13px', color: 'var(--text-3)' } },
      'Para actualizarlo: descarga el archivo y súbelo al repositorio. Una página web no puede escribir en su propio ' +
      'repositorio, así que este paso es manual.'),

    el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
      el('button', {
        class: 'btn btn--primary',
        onclick: () => { exportarParaRepo(); toast('datos.json descargado. Ahora súbelo al repositorio.'); },
      }, [icon('i-abajo'), 'Descargar datos.json']),
      el('a', {
        class: 'btn',
        href: `https://github.com/${REPO}/upload/main`,
        target: '_blank',
        rel: 'noopener',
        style: { textDecoration: 'none' },
      }, 'Abrir GitHub para subirlo'),
    ]),

    el('p', { style: { fontSize: '12.5px', color: 'var(--text-3)' } },
      'Al subirlo, GitHub tarda alrededor de un minuto en publicarlo. Recuerda que el repositorio es público: ' +
      'lo que contenga datos.json queda visible para cualquiera, y el historial de git lo conserva aunque después lo borres.'),
  ]);
}

export function ajustes(ctx) {
  const entrada = el('input', {
    type: 'file', accept: 'application/json,.json',
    style: { display: 'none' },
    onchange: async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const obj = JSON.parse(await f.text());
        if (!confirm('¿Reemplazar los datos de este navegador con los del archivo?')) return;
        importar(obj);
        location.reload();
      } catch (err) {
        toast(err.message || 'El archivo no se pudo leer.');
      }
    },
  });

  return [
    encabezado('i-resumen', 'Ajustes', 'Dónde se guardan tus datos y cómo respaldarlos.'),

    tarjetaRepositorio(),

    el('div', { class: 'grid grid--2' }, [
      tarjetaRespaldo(ctx),
      card('Copia manual', [
        el('p', { style: { fontSize: '13.5px', color: 'var(--text-2)' } },
          'Descarga un archivo con todo lo que has ingresado, o recupera uno que hayas guardado antes.'),
        el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
          el('button', { class: 'btn btn--primary', onclick: () => { exportar(); toast('Copia descargada.'); } }, 'Exportar'),
          el('button', { class: 'btn', onclick: () => entrada.click() }, 'Importar'),
          entrada,
        ]),
      ]),
    ]),

    el('div', { class: 'grid grid--2' }, [
      card('Restablecer', [
        el('p', { style: { fontSize: '13.5px', color: 'var(--text-2)' } },
          'Borra todo lo que ingresaste y vuelve a los datos de ejemplo. Esto no se puede deshacer.'),
        el('div', {}, [el('button', {
          class: 'btn',
          onclick: () => { if (confirm('¿Borrar todos tus datos y volver al ejemplo? Esto no se puede deshacer.')) reiniciar(); },
        }, 'Restablecer al ejemplo')]),
      ]),
    ]),

    aviso([el('div', {}, [
      el('strong', {}, 'Cómo funciona: '),
      'al abrir el panel se cargan los datos publicados en el repositorio; mientras trabajas, cada cambio se guarda ',
      'al instante en este navegador. Cuando quieras dejarlos fijos para cualquier equipo, descarga datos.json y súbelo. ',
      'Un sitio en GitHub Pages puede leer archivos, pero nunca escribir en su propio repositorio: hacerlo exigiría un ',
      'token con permiso sobre tu cuenta dentro de una página que cualquiera puede abrir.',
    ])]),
  ];
}

/* ─── Formularios genéricos ───────────────────────────────────────── */

function campo(id, name, label, value, type = 'text') {
  return el('div', { class: 'field' }, [
    el('label', { for: id }, label),
    el('input', { class: 'input', id, name, type, value, ...(type === 'number' ? { min: '0', step: '1' } : {}) }),
  ]);
}

/**
 * Formulario declarativo: recoge los campos, llama a `alGuardar(datos)`,
 * persiste y re-renderiza la sección.
 */
function formSimple(ctx, campos, alGuardar, textoBoton = 'Agregar') {
  const form = el('form', { class: 'card__body', onsubmit: (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    for (const [k, v] of Object.entries(d)) if (typeof v === 'string') d[k] = v.trim();
    alGuardar(d);
    guardar();
    toast('Guardado.');
    ctx.recargar();
  } }, [
    el('div', { class: 'form-grid' }, campos.map((c) => {
      const id = `f-${c.name}-${uid()}`;
      let control;
      if (c.tipo === 'select') {
        control = el('select', { class: 'input', id, name: c.name },
          c.opciones.map((o) => el('option', { value: o, selected: o === c.value }, o)));
      } else if (c.tipo === 'textarea') {
        control = el('textarea', { class: 'input', id, name: c.name, placeholder: c.placeholder ?? '', required: !!c.required });
      } else {
        control = el('input', {
          class: 'input', id, name: c.name,
          type: c.type ?? 'text',
          value: c.value ?? '',
          placeholder: c.placeholder ?? '',
          required: !!c.required,
          ...(c.type === 'number' ? { min: '0', step: '1' } : {}),
        });
      }
      return el('div', { class: 'field', style: c.tipo === 'textarea' ? { gridColumn: '1 / -1' } : {} }, [
        el('label', { for: id }, c.label),
        control,
      ]);
    })),
    el('div', {}, [el('button', { class: 'btn btn--primary', type: 'submit' }, [icon('i-mas'), textoBoton])]),
  ]);
  return form;
}
