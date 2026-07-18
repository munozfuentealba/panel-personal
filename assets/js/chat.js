/**
 * Asistente del panel — responde sobre tus datos SIN costo.
 *
 * No usa ninguna API ni conexión: calcula las respuestas en el navegador a
 * partir de `datos` (sueldo, ahorro, crédito, gastos, Instagram). Funciona
 * offline y no gasta dinero. Reconoce la pregunta por palabras clave.
 */

import { el, icon, clp } from './utils.js';
import { datos } from './store.js';

let abierto = false;

/* ─── Utilidades de texto ───────────────────────────────────────────── */

// minúsculas y sin tildes, para comparar sin depender de acentos
const norm = (s) => (s || '').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '');

const tiene = (t, ...palabras) => palabras.some((p) => t.includes(p));

const MESES = {
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
  noviembre: '11', diciembre: '12',
};
const NOMBRE_MES = Object.fromEntries(Object.entries(MESES).map(([k, v]) => [v, k]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ─── Respuestas por tema ───────────────────────────────────────────── */

function respSueldo() {
  const s = datos.finanzas?.sueldo;
  if (!s?.liquidaciones?.length) return 'Todavía no tienes liquidaciones cargadas en el panel.';
  const ult = s.liquidaciones[s.liquidaciones.length - 1];
  let r = `Tu sueldo líquido habitual es ${clp(s.liquidoHabitual ?? 0)}`;
  if (s.empleador) r += ` (${s.cargo ? s.cargo + ' en ' : ''}${s.empleador})`;
  r += `.\nLa última liquidación registrada es ${ult.mes}: ${clp(ult.liquido)} líquido`;
  r += ` (haberes ${clp(ult.haberes)}, descuentos ${clp(ult.descuentos)}).`;
  const enero = s.liquidaciones.find((l) => norm(l.mes).includes('enero'));
  if (enero && enero.liquido > (s.liquidoHabitual ?? 0) * 1.2) {
    r += `\nOjo: enero (${clp(enero.liquido)}) fue más alto por un bono extraordinario, no es lo habitual.`;
  }
  return r;
}

function respAhorro() {
  const a = datos.finanzas?.ahorroBanco;
  if (!a?.meses) return 'Aún no tienes configurada la cuenta de ahorro.';
  const con = a.meses.filter((m) => m.monto > 0);
  const total = con.reduce((s, m) => s + m.monto, 0);
  if (!con.length) return `Tu cuenta de ahorro (${a.banco} · ${a.tipo}) aún no tiene montos registrados este año.`;
  const detalle = con.map((m) => `${m.mes} ${clp(m.monto)}`).join(', ');
  return `En tu ${a.tipo} de ${a.banco} llevas registrado ${clp(total)} en ${con.length} ${con.length === 1 ? 'mes' : 'meses'}.\nPor mes: ${detalle}.`;
}

function respCredito() {
  const c = datos.finanzas?.credito;
  if (!c?.cuotas?.length) return 'No tienes un crédito cargado en el panel.';
  const n = c.cuotas.length;
  const pagadas = c.cuotas.filter((x) => x.pagada);
  const pagado = pagadas.reduce((s, x) => s + x.monto, 0);
  const saldo = c.cuotas.filter((x) => !x.pagada).reduce((s, x) => s + x.monto, 0);
  const prox = c.cuotas.filter((x) => !x.pagada).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  let r = `Crédito de tu ${c.nombre}: llevas ${pagadas.length} de ${n} cuotas pagadas (${clp(pagado)} abonado).`;
  r += `\nSaldo pendiente: ${clp(saldo)}.`;
  if (prox) r += `\nLa próxima cuota es la N°${prox.n}, vence el ${prox.fecha} por ${clp(prox.monto)}.`;
  else r += '\n¡El crédito está pagado por completo!';
  return r;
}

function respGastos(t) {
  const eg = datos.finanzas?.egresos;
  if (!eg?.length) return 'Aún no tienes gastos cargados desde tus cartolas.';

  // ¿mencionó un mes?
  let mm = null;
  for (const [nombre, num] of Object.entries(MESES)) if (t.includes(nombre)) { mm = num; break; }

  // ¿mencionó una categoría existente?
  const cats = [...new Set(eg.map((e) => e.cat))];
  const catPedida = cats.find((c) => t.includes(norm(c)));

  let lista = eg;
  let ambito = '';
  if (mm) { lista = lista.filter((e) => e.fecha.slice(5, 7) === mm); ambito = ` en ${cap(NOMBRE_MES[mm])}`; }

  if (catPedida) {
    const sub = lista.filter((e) => e.cat === catPedida);
    const total = sub.reduce((s, e) => s + e.monto, 0);
    if (!sub.length) return `No registras gastos de "${catPedida}"${ambito}.`;
    return `En "${catPedida}"${ambito} llevas ${clp(total)} en ${sub.length} ${sub.length === 1 ? 'movimiento' : 'movimientos'}.`;
  }

  if (!lista.length) return `No hay gastos registrados${ambito}.`;

  const porCat = {};
  let total = 0;
  for (const e of lista) { porCat[e.cat] = (porCat[e.cat] || 0) + e.monto; total += e.monto; }
  const top = Object.entries(porCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  let r = `Gastaste ${clp(total)}${ambito} (${lista.length} movimientos). Lo principal:`;
  r += '\n' + top.map(([k, v], i) => `${i + 1}. ${k}: ${clp(v)}`).join('\n');
  if (!catPedida && !mm) r += '\n\nPuedes preguntar por un mes ("gastos de junio") o una categoría.';
  return r;
}

function respInstagram() {
  const ig = datos.instagram;
  if (!ig?.usuario) return 'No tienes datos de Instagram en el panel.';
  let r = `@${ig.usuario}: ${ig.seguidores} seguidores, ${ig.siguiendo} siguiendo y ${ig.publicaciones} publicaciones.`;
  if (ig.insights) {
    r += `\nEn ${ig.insights.periodo}: alcance ${ig.insights.alcance} (${ig.insights.alcanceDelta}%), ${ig.insights.impresiones} impresiones y ${ig.insights.visitas} visitas al perfil.`;
  }
  return r;
}

function respResumen() {
  const f = datos.finanzas || {};
  const partes = [];
  if (f.sueldo?.liquidoHabitual) partes.push(`💵 Sueldo líquido habitual: ${clp(f.sueldo.liquidoHabitual)}`);
  if (f.credito?.cuotas?.length) {
    const saldo = f.credito.cuotas.filter((x) => !x.pagada).reduce((s, x) => s + x.monto, 0);
    const pag = f.credito.cuotas.filter((x) => x.pagada).length;
    partes.push(`🚗 Crédito auto: ${pag}/${f.credito.cuotas.length} cuotas, saldo ${clp(saldo)}`);
  }
  if (f.egresos?.length) {
    const total = f.egresos.reduce((s, e) => s + e.monto, 0);
    partes.push(`🧾 Gastos registrados: ${clp(total)} (${f.egresos.length} movimientos)`);
  }
  const ahorro = f.ahorroBanco?.meses?.reduce((s, m) => s + (m.monto || 0), 0) || 0;
  if (ahorro > 0) partes.push(`🏦 Ahorro acumulado: ${clp(ahorro)}`);
  if (datos.instagram?.usuario) partes.push(`📸 Instagram: ${datos.instagram.seguidores} seguidores`);
  if (!partes.length) return 'Tu panel todavía no tiene datos cargados.';
  return 'Esto es lo que veo en tu panel:\n' + partes.join('\n');
}

const AYUDA = 'Puedo responder desde los datos de tu panel. Prueba con:\n'
  + '• "¿Cuánto es mi sueldo?"\n'
  + '• "¿Cuánto debo del auto?"\n'
  + '• "¿En qué gasto más?" o "gastos de junio"\n'
  + '• "¿Cuánto llevo ahorrado?"\n'
  + '• "¿Cómo va mi Instagram?"\n'
  + '• "Dame un resumen"';

/* ─── Router de intención ───────────────────────────────────────────── */

function responder(pregunta) {
  const t = norm(pregunta);
  if (!t.trim()) return AYUDA;

  if (tiene(t, 'hola', 'buenas', 'buenos dias', 'buenas tardes', 'que tal', 'hey')) {
    return '¡Hola, Diego! ' + AYUDA;
  }
  if (tiene(t, 'ayuda', 'que puedes', 'que sabes', 'que haces', 'opciones')) return AYUDA;
  if (tiene(t, 'resumen', 'panorama', 'en general', 'como voy', 'como estoy', 'como van mis finanzas')) return respResumen();

  if (tiene(t, 'sueldo', 'salario', 'gano', 'liquido', 'liquidacion', 'remuneracion')) return respSueldo();
  if (tiene(t, 'credito', 'auto', 'cuota', 'tiggo', 'chery', 'debo', 'deuda', 'financiamiento')) return respCredito();
  if (tiene(t, 'ahorro', 'ahorrado', 'guardado', 'ahorra')) return respAhorro();
  if (tiene(t, 'gasto', 'gaste', 'gasté', 'gastando', 'egreso', 'compra', 'en que se me va')) return respGastos(t);
  if (tiene(t, 'instagram', 'seguidor', 'insta', 'red social', 'alcance')) return respInstagram();

  // Si nombró un mes suelto, asumimos que pregunta por gastos de ese mes.
  if (Object.keys(MESES).some((m) => t.includes(m))) return respGastos(t);

  return 'No estoy seguro de haber entendido. ' + AYUDA;
}

/* ─── Interfaz ──────────────────────────────────────────────────────── */

const SUGERENCIAS = ['¿Cuánto es mi sueldo?', '¿Cuánto debo del auto?', '¿En qué gasto más?', 'Dame un resumen'];

export function initChat() {
  const mensajes = el('div', { class: 'chat__msgs' });

  const burbuja = (rol, texto) => el('div', { class: `chat__msg chat__msg--${rol}` }, texto);
  const scrollAbajo = () => { mensajes.scrollTop = mensajes.scrollHeight; };

  const input = el('textarea', {
    class: 'chat__input', rows: 1, placeholder: 'Pregunta sobre tu panel…',
    'aria-label': 'Escribe tu pregunta',
    onkeydown: (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } },
  });
  const btnEnviar = el('button', { class: 'chat__send', 'aria-label': 'Enviar', onclick: () => enviar() }, [icon('i-enviar')]);
  const formConv = el('div', { class: 'chat__form' }, [input, btnEnviar]);

  function enviar(textoDado) {
    const texto = (textoDado ?? input.value).trim();
    if (!texto) return;
    if (!textoDado) input.value = '';
    mensajes.append(burbuja('user', texto));
    scrollAbajo();
    // Pequeña pausa para que la respuesta no aparezca de golpe.
    const pensando = el('div', { class: 'chat__msg chat__msg--bot chat__pensando' }, [
      el('span', { class: 'chat__dot' }), el('span', { class: 'chat__dot' }), el('span', { class: 'chat__dot' }),
    ]);
    mensajes.append(pensando);
    scrollAbajo();
    setTimeout(() => {
      pensando.remove();
      let resp;
      try { resp = responder(texto); }
      catch { resp = 'Uy, algo falló al revisar tus datos. Intenta con otra pregunta.'; }
      mensajes.append(burbuja('bot', resp));
      scrollAbajo();
      input.focus();
    }, 280);
  }

  // Mensaje de bienvenida + chips de sugerencia
  function bienvenida() {
    mensajes.append(burbuja('bot', '¡Hola, Diego! Respondo sobre tu panel — sueldo, ahorro, crédito del auto, en qué gastas y tu Instagram. Todo sale de tus propios datos, sin costo. ¿Qué quieres saber?'));
    mensajes.append(el('div', { class: 'chat__chips' },
      SUGERENCIAS.map((s) => el('button', { class: 'chat__chip', onclick: () => enviar(s) }, s))));
  }
  bienvenida();

  const reiniciar = el('button', { class: 'icon-btn', title: 'Nueva conversación', 'aria-label': 'Nueva conversación', onclick: () => {
    mensajes.replaceChildren();
    bienvenida();
    scrollAbajo();
  } }, [icon('i-refrescar')]);
  const cerrar = el('button', { class: 'icon-btn', 'aria-label': 'Cerrar chat', onclick: () => toggle(false) }, [icon('i-cerrar')]);

  const panel = el('div', { class: 'chat', hidden: true }, [
    el('div', { class: 'chat__head' }, [
      el('span', { class: 'chat__ic' }, [icon('i-chat')]),
      el('div', { class: 'chat__title' }, [
        el('strong', {}, 'Asistente'),
        el('span', {}, 'Pregunta sobre tu panel'),
      ]),
      reiniciar,
      cerrar,
    ]),
    el('div', { class: 'chat__body' }, [mensajes, formConv]),
  ]);

  const launcher = el('button', {
    class: 'chat-launcher', 'aria-label': 'Abrir asistente', onclick: () => toggle(),
  }, [icon('i-chat')]);

  function toggle(v) {
    abierto = v === undefined ? !abierto : v;
    panel.hidden = !abierto;
    launcher.classList.toggle('is-open', abierto);
    if (abierto) { scrollAbajo(); setTimeout(() => input.focus(), 50); }
  }

  document.body.append(panel, launcher);
}
