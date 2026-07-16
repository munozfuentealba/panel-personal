/* Arranque: tema, navegación, router y clima. */

import { el, icon, escalonar, animarEntrada } from './utils.js';
import { obtenerClima, wmoIcono } from './weather.js';
import * as S from './sections.js';

/* ─── Mapa de secciones ───────────────────────────────────────────── */

const SECCIONES = [
  { id: 'resumen',    nombre: 'Resumen',            icono: 'i-resumen',   grupo: 'Panel',   sub: 'Todo lo importante de un vistazo',            render: S.resumen,    color: 'var(--accent)' },
  { id: 'clima',      nombre: 'Clima',              icono: 'i-sol-nube',  grupo: 'Panel',   sub: 'Osorno y Puerto Montt · pronóstico a 7 días',  render: S.seccionClima, color: '#0ea5e9' },

  { id: 'finanzas',   nombre: 'Finanzas Personales', icono: 'i-finanzas',  grupo: 'Áreas',  sub: 'Ingresos, gastos, presupuestos y ahorro',      render: S.finanzas,   color: 'var(--c-finanzas)' },
  { id: 'marca',      nombre: 'Marca Personal',      icono: 'i-marca',     grupo: 'Áreas',  sub: 'Objetivos, pilares de contenido e hitos',      render: S.marca,      color: 'var(--c-marca)' },
  { id: 'empresa',    nombre: 'Empresa',             icono: 'i-empresa',   grupo: 'Áreas',  sub: 'Facturación, pipeline y proyectos',           render: S.empresa,    color: 'var(--c-empresa)' },
  { id: 'instagram',  nombre: 'Red Social',          icono: 'i-instagram', grupo: 'Áreas',  sub: 'Instagram @munozfuentealba · seguimiento',    render: S.instagram,  color: 'var(--c-instagram)' },
  { id: 'musica',     nombre: 'Producción Musical',  icono: 'i-musica',    grupo: 'Áreas',  sub: 'Proyectos, horas de estudio e ideas',         render: S.musica,     color: 'var(--c-musica)' },
  { id: 'iglesia',    nombre: 'Iglesia',             icono: 'i-iglesia',   grupo: 'Áreas',  sub: 'Compromisos, servicio y repertorio',          render: S.iglesia,    color: 'var(--c-iglesia)' },
  { id: 'familia',    nombre: 'Familia',             icono: 'i-familia',   grupo: 'Áreas',  sub: 'Planes, fechas importantes e intenciones',    render: S.familia,    color: 'var(--c-familia)' },
  { id: 'trabajo',    nombre: 'Trabajo',             icono: 'i-trabajo',   grupo: 'Áreas',  sub: 'Tareas, prioridades y horas de foco',         render: S.trabajo,    color: 'var(--c-trabajo)' },

  { id: 'ajustes',    nombre: 'Ajustes',             icono: 'i-resumen',   grupo: 'Sistema', sub: 'Copia de seguridad y restablecer',           render: S.ajustes,    color: 'var(--text-3)' },
];

const porId = (id) => SECCIONES.find((s) => s.id === id) ?? SECCIONES[0];

/* ─── Estado ──────────────────────────────────────────────────────── */

const dom = {
  nav: document.getElementById('nav'),
  view: document.getElementById('view'),
  titulo: document.getElementById('viewTitle'),
  subtitulo: document.getElementById('viewSubtitle'),
  cajaTitulo: document.querySelector('.topbar__title'),
  sidebar: document.getElementById('sidebar'),
  scrim: document.getElementById('scrim'),
  topWeather: document.getElementById('topWeather'),
};

let clima = { datos: [], error: null, cargando: true };
let actual = null;
let indicador;

/* ─── Tema ────────────────────────────────────────────────────────── */

function temaInicial() {
  const guardado = localStorage.getItem('panel.tema');
  if (guardado) return guardado;
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function aplicarTema(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('panel.tema', t);
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', t === 'dark' ? '#0d0f14' : '#f4f5f8');
  const label = document.querySelector('.theme-toggle__label');
  if (label) label.textContent = t === 'dark' ? 'Modo oscuro' : 'Modo claro';
}

function initTema() {
  aplicarTema(temaInicial());
  document.getElementById('themeToggle').addEventListener('click', () => {
    aplicarTema(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  // Si el usuario nunca eligió, seguimos al sistema.
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('panel.tema')) aplicarTema(e.matches ? 'light' : 'dark');
  });
}

/* ─── Navegación ──────────────────────────────────────────────────── */

function construirNav() {
  indicador = el('span', { class: 'nav__indicator' });
  dom.nav.append(indicador);

  let grupoPrev = null;
  for (const s of SECCIONES) {
    if (s.grupo !== grupoPrev) {
      dom.nav.append(el('div', { class: 'nav__group' }, s.grupo));
      grupoPrev = s.grupo;
    }
    dom.nav.append(el('a', {
      class: 'nav__item',
      href: `#/${s.id}`,
      dataset: { sec: s.id },
      style: { '--sec': s.color },
    }, [icon(s.icono), el('span', {}, s.nombre)]));
  }
}

function marcarActivo(id) {
  const items = dom.nav.querySelectorAll('.nav__item');
  items.forEach((n) => n.classList.toggle('is-active', n.dataset.sec === id));

  const activo = dom.nav.querySelector('.nav__item.is-active');
  if (!activo) return;
  // El indicador se desliza al item activo: transición sobre transform.
  indicador.style.setProperty('--sec', porId(id).color);
  indicador.style.transform =
    `translateY(${activo.offsetTop + (activo.offsetHeight - 20) / 2}px) scaleY(1)`;
  requestAnimationFrame(() => indicador.classList.add('is-ready'));
}

function cerrarMenu() {
  dom.sidebar.classList.remove('is-open');
  dom.scrim.classList.remove('is-visible');
  setTimeout(() => { dom.scrim.hidden = true; }, 280);
}

function abrirMenu() {
  dom.scrim.hidden = false;
  requestAnimationFrame(() => {
    dom.sidebar.classList.add('is-open');
    dom.scrim.classList.add('is-visible');
  });
}

/* ─── Clima en la barra superior ──────────────────────────────────── */

function pintarClimaTop() {
  dom.topWeather.replaceChildren();
  if (clima.error || !clima.datos.length) return;
  clima.datos.forEach((c, i) => {
    dom.topWeather.append(el('a', {
      class: 'wx-chip',
      href: '#/clima',
      style: { animationDelay: `${i * 80}ms` },
      title: `${c.ciudad}: ${wmoTextoCorto(c)}`,
    }, [
      icon(wmoIcono(c.ahora.code)),
      el('strong', {}, `${c.ahora.temp}°`),
      el('span', {}, c.ciudad),
    ]));
  });
}

const wmoTextoCorto = (c) => `${c.ahora.temp}° · máx ${c.dias[0].max}° / mín ${c.dias[0].min}°`;

/* ─── Router ──────────────────────────────────────────────────────── */

const ctx = {
  get clima() { return clima; },
  recargar: () => pintar(actual, { animar: false }),
  irA: (id) => { location.hash = `#/${id}`; },
};

function pintar(sec, { animar = true } = {}) {
  const nodos = sec.render(ctx);
  dom.view.replaceChildren(...nodos.filter(Boolean));
  dom.view.style.setProperty('--sec', sec.color);
  escalonar(dom.view);

  if (animar) {
    dom.view.classList.remove('is-entering');
    void dom.view.offsetWidth; // reinicia la animación
    dom.view.classList.add('is-entering');
  }
  // Barras y gráficos crecen desde 0 una vez montados.
  animarEntrada(dom.view);
}

async function navegar() {
  const id = location.hash.replace(/^#\/?/, '') || 'resumen';
  const sec = porId(id);
  if (actual?.id === sec.id) return;

  const primera = actual === null;
  actual = sec;
  marcarActivo(sec.id);
  cerrarMenu();

  const cambiarCabecera = () => {
    dom.titulo.textContent = sec.nombre;
    dom.subtitulo.textContent = sec.sub;
    document.title = `${sec.nombre} — Panel Personal`;
    dom.cajaTitulo.classList.remove('is-swapping');
  };

  if (primera) {
    cambiarCabecera();
    pintar(sec);
    return;
  }

  // Transición: la vista actual sale, la nueva entra escalonada.
  dom.cajaTitulo.classList.add('is-swapping');
  dom.view.classList.remove('is-entering');
  dom.view.classList.add('is-leaving');

  await new Promise((r) => setTimeout(r, 180));

  dom.view.classList.remove('is-leaving');
  cambiarCabecera();
  pintar(sec);
  dom.view.scrollIntoView({ block: 'start' });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ─── Inicio ──────────────────────────────────────────────────────── */

async function init() {
  initTema();
  construirNav();

  document.getElementById('navOpen').addEventListener('click', abrirMenu);
  document.getElementById('navClose').addEventListener('click', cerrarMenu);
  dom.scrim.addEventListener('click', cerrarMenu);
  addEventListener('hashchange', navegar);
  addEventListener('resize', () => actual && marcarActivo(actual.id));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarMenu();
  });

  // Pintamos de inmediato con el clima pendiente; al llegar, refrescamos.
  navegar();

  try {
    const r = await obtenerClima();
    clima = r;
  } catch (e) {
    clima = { datos: [], error: e.message };
    console.warn('Clima no disponible:', e);
  }
  pintarClimaTop();
  if (actual?.id === 'clima' || actual?.id === 'resumen') pintar(actual, { animar: false });

  // Refresca el clima al volver a la pestaña si el caché ya venció.
  document.addEventListener('visibilitychange', async () => {
    if (document.hidden) return;
    try {
      const r = await obtenerClima();
      clima = r;
      pintarClimaTop();
      if (actual?.id === 'clima' || actual?.id === 'resumen') pintar(actual, { animar: false });
    } catch {}
  });
}

init();
