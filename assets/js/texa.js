/**
 * Texa — la app de inglés de Diego, adaptada a web como una sección del panel.
 *
 * Port de la app móvil (Expo/React Native) a un layout WEB: barra de navegación
 * azul fija arriba (marca + pestañas), ancho amplio y contenido en varias
 * columnas. Mantiene la identidad (crema cálido + azul, marca "T"). El estado
 * que cambia el usuario (vocabulario, chat, nivel, racha) se guarda en
 * localStorage `texa.estado`.
 */

import { el } from './utils.js';
import { CURRICULO, TODAS_LECCIONES, tieneContenido } from './texa-curriculo.js';
import { DICCIONARIO, buscarSignificado } from './texa-diccionario.js';

/* ─── Datos semilla (los mismos de la app) ──────────────────────────── */

const SEED = {
  stats: { racha: 4, vocabulario: 27, hoyMin: 12 },
  nivel: 'A1',
  aprendido: {},   // { [leccionId]: true }
  words: [
    { en: 'to brush up on', es: 'repasar / perfeccionar algo', stage: 'nueva' },
    { en: 'overwhelmed', es: 'abrumado', stage: 'nueva' },
    { en: 'to figure out', es: 'entender / resolver', stage: 'aprendiendo' },
    { en: 'blunt', es: 'directo, sin rodeos', stage: 'aprendiendo' },
    { en: 'shortcoming', es: 'defecto, carencia', stage: 'aprendiendo' },
    { en: 'to slip one’s mind', es: 'olvidarse de algo', stage: 'nueva' },
    { en: 'thorough', es: 'minucioso, exhaustivo', stage: 'dominada' },
    { en: 'to get the hang of', es: 'agarrarle la mano a algo', stage: 'dominada' },
  ],
  chat: [{ from: 'ai', text: 'Hi Diego! What did you get up to this weekend?', tip: null }],
};

const STAGE_LABEL = { nueva: 'Nueva', aprendiendo: 'Aprendiendo', dominada: 'Dominada' };
const PROMPTS = {
  'es-en': { source: 'Se me pasó completamente avisarte.', suggested: 'It completely slipped my mind to let you know.' },
  'en-es': { source: 'I could really use a second pair of eyes on this.', suggested: 'Me vendría bien que alguien más lo revise.' },
};
const FEEDBACK = [
  { tone: 'nuance', text: '“Slipped my mind” suena más natural acá que una traducción literal de “se me pasó”.' },
  { tone: 'ok', text: 'Tiempo verbal y orden de palabras: correcto.' },
  { tone: 'nuance', text: 'El registro coincide con el original — casual pero cuidado.' },
];
const AI_REPLIES = [
  { text: 'Nice! What made that your favorite part?', tip: 'Tip: para acciones terminadas en el pasado usá el pasado simple — “I went”, no “I go”.' },
  { text: 'That sounds fun. Do you usually do that on weekends?', tip: null },
  { text: 'Got it. How did that make you feel?', tip: null },
];

// Burbujas de sinónimos por nivel (decoración animada de Inicio).
const SINONIMOS = [
  { w: 'need', lvl: 'A1', c: 'blue' },
  { w: 'require', lvl: 'B1', c: 'yellow' },
  { w: 'necessitate', lvl: 'C1', c: 'red' },
  { w: 'get', lvl: 'A1', c: 'blue' },
  { w: 'obtain', lvl: 'B1', c: 'yellow' },
  { w: 'acquire', lvl: 'C1', c: 'green' },
  { w: 'big', lvl: 'A1', c: 'blue' },
  { w: 'huge', lvl: 'B1', c: 'yellow' },
  { w: 'colossal', lvl: 'C1', c: 'red' },
];

// Saludos que rotan en el hero (toque de "idiomas").
const SALUDOS = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Hallo', 'Olá', 'こんにちは'];

// Íconos vectoriales (line-art). Se usan como decoración y en el saludo.
const IC = {
  libro: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5Z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5Z"/>',
  lapiz: '<path d="M4 20h4L18.5 9.5a2.83 2.83 0 0 0-4-4L4 16v4Z"/><path d="M13.5 6.5l4 4"/>',
  chat: '<path d="M20 11.5a7.5 7 0 0 1-10.9 6.3L4 19l1.2-4A7 7 0 0 1 4.5 11.5a7.5 7 0 0 1 15.5 0Z"/>',
  globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18"/>',
  birrete: '<path d="M12 5 3 9l9 4 9-4-9-4Z"/><path d="M6 11v4c0 1.2 2.7 2.6 6 2.6s6-1.4 6-2.6v-4"/>',
  chispa: '<path d="M12 3l1.7 4.8L18.5 9l-4.8 1.2L12 15l-1.7-4.8L5.5 9l4.8-1.2Z"/>',
  sol: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/>',
  volver: '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
  flecha: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  check2: '<path d="M4.5 12.5l5 5 10-11"/>',
};
const svgIc = (paths, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

// Íconos de idiomas que flotan en el fondo del hero (calienta la sección).
const HERO_ICONS = [
  { i: 'libro', l: '9%', t: '58%' }, { i: 'lapiz', l: '25%', t: '28%' }, { i: 'chat', l: '45%', t: '66%' },
  { i: 'globo', l: '63%', t: '24%' }, { i: 'chispa', l: '80%', t: '60%' }, { i: 'birrete', l: '91%', t: '32%' },
];

// Cinta de palabras/frases que se desliza (movimiento bien visible).
const TICKER = [
  'Hello', 'grammar', 'vocabulary', 'fluency', 'phrasal verbs', 'However,…',
  'nevertheless', 'a piece of cake', 'break the ice', 'Hola → Hello',
  'I’ve been learning', 'once upon a time', 'practice makes perfect', 'small talk',
];

/* ─── Marca e íconos ─────────────────────────────────────────────────── */

function marca(size = 22) {
  return el('span', {
    class: 'texa__mark', style: { width: `${size}px`, height: `${size}px` },
    html: `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true">
      <rect width="120" height="120" rx="28" fill="rgba(255,255,255,0.22)"/>
      <rect x="28" y="30" width="64" height="12" rx="6" fill="#fff"/>
      <rect x="48" y="30" width="10" height="62" rx="5" fill="#fff"/>
      <rect x="62" y="30" width="10" height="62" rx="5" fill="rgba(255,255,255,0.6)"/>
    </svg>`,
  });
}

const txIcon = (paths) => el('span', {
  class: 'texa__tabic',
  html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`,
});

const TABS = [
  { id: 'inicio', label: 'Inicio', ic: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/>' },
  { id: 'vocabulario', label: 'Vocabulario', ic: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5Z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5Z"/>' },
  { id: 'traducir', label: 'Traducir', ic: '<path d="M4 6h9"/><path d="M8.5 6c0 5-2.5 8-5.5 9.5"/><path d="M6 9.5c.2 2.8 3 4.8 6 5.5"/><path d="M13 20l4-9 4 9"/><path d="M14.4 17h5.2"/>' },
  { id: 'aprender', label: 'Aprender', ic: '<path d="M12 5 3 9l9 4 9-4-9-4Z"/><path d="M6 11v4c0 1.2 2.7 2.6 6 2.6s6-1.4 6-2.6v-4"/>' },
  { id: 'chat', label: 'Chat', ic: '<path d="M20 11.5a7.5 7 0 0 1-10.9 6.3L4 19l1.2-4A7 7 0 0 1 4.5 11.5a7.5 7 0 0 1 15.5 0Z"/>' },
];

/* ─── Piezas comunes ─────────────────────────────────────────────────── */

// Encabezado de pantalla (v2): título grande + subtítulo, texto oscuro.
const heroTitulo = (titulo, sub, eyebrow) => [
  eyebrow ? el('span', { class: 'texa__eyebrow' }, eyebrow) : null,
  el('h1', { class: 'texa__ptitle' }, titulo),
  sub ? el('p', { class: 'texa__psub' }, sub) : null,
];

// Normaliza respuestas para comparar (sin tildes de apóstrofo, sin punto final).
const norm = (s) => (s ?? '').toString().trim().toLowerCase()
  .replace(/\s+/g, ' ').replace(/[’´`]/g, "'").replace(/[.!?]+$/, '');

// Convierte **negrita** y *cursiva* en nodos.
const texto = (str) => {
  const out = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(document.createTextNode(str.slice(last, m.index)));
    out.push(m[1] !== undefined ? el('strong', {}, m[1]) : el('em', {}, m[2]));
    last = re.lastIndex;
  }
  if (last < String(str).length) out.push(document.createTextNode(String(str).slice(last)));
  return out;
};

// Bloques de contenido de una lección (diseño variado).
const ICON_OJO = '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>';
const ICON_DATO = '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 2a6 6 0 0 0-3.6 10.8c.5.4.9 1 1 1.7l.1.5h5l.1-.5c.1-.7.5-1.3 1-1.7A6 6 0 0 0 12 2Z"/>';

const callout = (tipo, titulo, iconPath, md) => el('div', { class: `texa__callout texa__callout--${tipo}` }, [
  el('div', { class: 'texa__calhead' }, [txIcon(iconPath), el('strong', {}, titulo)]),
  el('p', {}, texto(md)),
]);

// Confeti de celebración (al aprobar una lección).
const celebrar = () => {
  const cap = el('div', { class: 'texa__confeti', 'aria-hidden': 'true' });
  const cols = ['#4f86e0', '#e7b53f', '#d95757', '#3fa06a', '#7c97ff'];
  for (let i = 0; i < 20; i++) {
    const p = el('span', { class: 'texa__conf' });
    p.style.left = `${42 + Math.random() * 16}%`;
    p.style.top = '48%';
    p.style.background = cols[i % cols.length];
    p.style.setProperty('--dx', `${(Math.random() * 2 - 1) * 240}px`);
    p.style.setProperty('--dy', `${-90 - Math.random() * 200}px`);
    p.style.setProperty('--rot', `${(Math.random() * 2 - 1) * 400}deg`);
    p.style.animationDelay = `${Math.random() * 0.12}s`;
    cap.append(p);
  }
  document.body.append(cap);
  setTimeout(() => cap.remove(), 1300);
};

const bloqueNodo = (b) => {
  switch (b.t) {
    case 'texto':
      return el('p', { class: 'texa__lp' }, texto(b.md));
    case 'estructura':
      return el('div', { class: 'texa__formula' }, b.partes.flatMap((p, i) =>
        (i ? [el('span', { class: 'texa__fplus' }, '+'), el('span', { class: 'texa__fpart' }, p)] : [el('span', { class: 'texa__fpart' }, p)])));
    case 'tabla':
      return el('div', { class: 'texa__tablawrap' }, [el('table', { class: 'texa__tabla' }, [
        b.cols ? el('thead', {}, [el('tr', {}, b.cols.map((c) => el('th', {}, c)))]) : null,
        el('tbody', {}, b.filas.map((f) => el('tr', {}, f.map((c, ci) => el(ci === 0 ? 'th' : 'td', {}, texto(c)))))),
      ])]);
    case 'clave':
      return el('ul', { class: 'texa__clave' }, b.items.map((it) =>
        el('li', {}, [el('span', { class: 'texa__clavedot' }, '✓'), el('span', {}, texto(it))])));
    case 'ojo':
      return callout('ojo', 'Ojo', ICON_OJO, b.md);
    case 'dato':
      return callout('dato', '¿Sabías que…?', ICON_DATO, b.md);
    default:
      return null;
  }
};

/* ─── Sección ────────────────────────────────────────────────────────── */

export function texa() {
  const CLAVE = 'texa.estado';
  let estado;
  try { estado = JSON.parse(localStorage.getItem(CLAVE)) || structuredClone(SEED); }
  catch { estado = structuredClone(SEED); }
  estado = Object.assign(structuredClone(SEED), estado);
  if (!estado.aprendido || typeof estado.aprendido !== 'object') estado.aprendido = {};
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch {} };

  /* ─── Progreso de Aprender ─────────────────────────────────────────── */
  const conContenido = (n) => n.lecciones.filter(tieneContenido);
  const completadasDe = (n) => n.lecciones.filter((l) => estado.aprendido[l.id]).length;
  const nivelActual = () => {
    const pend = CURRICULO.find((n) => conContenido(n).length && conContenido(n).some((l) => !estado.aprendido[l.id]));
    if (pend) return pend.id;
    const conAlgo = [...CURRICULO].reverse().find((n) => conContenido(n).length);
    return conAlgo ? conAlgo.id : 'A1';
  };

  let tab = 'inicio';

  /* Pantalla: Inicio */
  const pInicio = () => {
    const acciones = [
      { to: 'vocabulario', ic: 'libro', eyebrow: 'Vocabulario', title: `${estado.words.filter((w) => w.stage !== 'dominada').length} palabras para repasar hoy`, detail: 'Repaso espaciado de lo que guardaste' },
      { to: 'traducir', ic: 'globo', eyebrow: 'Traducción', title: 'Frase del día para traducir', detail: '“It slipped my mind completely.”' },
      { to: 'aprender', ic: 'birrete', eyebrow: `Aprender · Nivel ${nivelActual()}`, title: 'Tu recorrido de gramática', detail: 'Explicación + ejercicios, nivel por nivel' },
      { to: 'chat', ic: 'chat', eyebrow: 'Conversación', title: 'Practicá 10 minutos con la IA', detail: 'Charla libre, corrige sin cortar el flujo' },
    ];
    const stats = [
      { v: nivelActual(), l: 'Tu nivel', to: 'aprender' },
      { v: `${estado.stats.racha}`, l: 'Días de racha' },
      { v: `${estado.stats.vocabulario}`, l: 'Palabras', to: 'vocabulario' },
      { v: `${estado.stats.hoyMin}`, l: 'Minutos hoy' },
    ];
    return {
      landing: true,
      hero: [
        el('div', { class: 'texa__hero2-glow', 'aria-hidden': 'true' }),
        el('div', { class: 'texa__hero2-in' }, [
          el('span', { class: 'texa__eyebrow texa__eyebrow--on' }, 'Buen día, Diego'),
          el('h1', { class: 'texa__hero2-title' }, ['Aprendé inglés ', el('span', { class: 'texa__grad' }, 'a tu ritmo'), '.']),
          el('p', { class: 'texa__hero2-sub' }, `Vas en nivel ${nivelActual()} y llevás una racha de ${estado.stats.racha} días. Vocabulario, traducción, gramática y conversación — todo en un solo lugar.`),
          el('div', { class: 'texa__hero2-cta' }, [
            el('button', { class: 'texa__cta', onclick: () => ir('aprender') }, [
              el('span', {}, 'Seguir aprendiendo'), el('span', { class: 'texa__cta-ic', html: svgIc(IC.flecha) }),
            ]),
            el('button', { class: 'texa__cta texa__cta--ghost', onclick: () => ir('vocabulario') }, 'Repasar vocabulario'),
          ]),
        ]),
        el('div', { class: 'texa__ticker', 'aria-hidden': 'true' }, [
          el('div', { class: 'texa__tickrow' }, [...TICKER, ...TICKER].map((w) => el('span', { class: 'texa__tickitem' }, w))),
        ]),
      ],
      cuerpo: [
        // Sección: tu progreso
        el('section', { class: 'texa__sec' }, [
          el('div', { class: 'texa__statgrid' }, stats.map((s) =>
            el(s.to ? 'button' : 'div', { class: 'texa__statcard', ...(s.to ? { onclick: () => ir(s.to) } : {}) }, [
              el('strong', {}, s.v), el('span', {}, s.l),
            ]))),
        ]),
        // Sección: features
        el('section', { class: 'texa__sec' }, [
          el('div', { class: 'texa__sechead' }, [
            el('span', { class: 'texa__eyebrow' }, 'Continuá donde quedaste'),
            el('h2', { class: 'texa__sectitle' }, 'Todo para tu inglés'),
          ]),
          el('div', { class: 'texa__actions' }, acciones.map((a) =>
            el('button', { class: 'texa__actioncard', onclick: () => ir(a.to) }, [
              el('span', { class: 'texa__actionic', html: svgIc(IC[a.ic]) }),
              el('div', { class: 'texa__actioncard-main' }, [
                el('span', { class: 'texa__eyebrow' }, a.eyebrow),
                el('span', { class: 'texa__actiontitle' }, a.title),
                el('span', { class: 'texa__muted' }, a.detail),
              ]),
              el('span', { class: 'texa__arrow' }, '→'),
            ]))),
        ]),
        // Sección: showcase de sinónimos
        el('section', { class: 'texa__sec texa__showcase' }, [
          el('div', { class: 'texa__sechead texa__sechead--center' }, [
            el('span', { class: 'texa__eyebrow' }, 'Matices'),
            el('h2', { class: 'texa__sectitle' }, 'La misma idea, distintos niveles'),
          ]),
          el('div', { class: 'texa__nube' }, SINONIMOS.map((p, i) =>
            el('span', {
              class: `texa__bub texa__bub--${p.c}`,
              style: { animationDelay: `${(i % 6) * 0.45}s`, animationDuration: `${4 + (i % 3) * 0.7}s` },
            }, [el('span', { class: 'texa__bublvl' }, p.lvl), el('span', {}, p.w)]))),
        ]),
      ],
    };
  };

  /* Pantalla: Vocabulario (mis palabras + diccionario EN-ES con A-Z) */
  const pVocabulario = () => {
    let modo = 'mias';   // 'mias' | 'dic'
    let query = '';
    let letra = 'a';
    const cont = el('div', { class: 'texa__section' });
    const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const existe = (en) => estado.words.some((w) => w.en.toLowerCase() === String(en).trim().toLowerCase());
    const guardarPalabra = (en, es) => {
      en = String(en).trim(); if (!en) return 'vacio';
      if (existe(en)) return 'dup';
      es = String(es || '').trim() || buscarSignificado(en) || 'Traducción pendiente';
      estado.words.unshift({ en, es, stage: 'nueva' });
      estado.stats.vocabulario += 1;
      guardar();
      pintarMinistats();
      return 'ok';
    };

    // ── Vista: mis palabras ──
    const vistaMias = () => {
      const inEn = el('input', { class: 'texa__input', placeholder: 'Palabra en inglés…', 'aria-label': 'Palabra en inglés' });
      const inEs = el('input', { class: 'texa__input', placeholder: 'Significado en español (opcional)', 'aria-label': 'Significado' });
      const aviso = el('span', { class: 'texa__muted texa__addnote' });
      const add = () => {
        const r = guardarPalabra(inEn.value, inEs.value);
        if (r === 'ok') { inEn.value = ''; inEs.value = ''; pintar(); inEn.focus(); }
        else if (r === 'dup') { aviso.textContent = 'Esa palabra ya está en tu vocabulario.'; }
      };
      inEn.addEventListener('keydown', (e) => { if (e.key === 'Enter') inEs.focus(); });
      inEs.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
      inEn.addEventListener('input', () => { aviso.textContent = ''; });
      const q = query.trim().toLowerCase();
      const filt = estado.words.filter((w) => !q || w.en.toLowerCase().includes(q) || w.es.toLowerCase().includes(q));
      const due = filt.filter((w) => w.stage !== 'dominada').length;
      return [
        el('div', { class: 'texa__addcard' }, [
          el('div', { class: 'texa__addfields' }, [inEn, inEs]),
          el('button', { class: 'texa__btn', onclick: add }, [el('span', { class: 'texa__salir-ic', html: svgIc(IC.mas) }), 'Guardar']),
        ]),
        aviso,
        el('input', { class: 'texa__search', placeholder: 'Buscar en tus palabras', value: query, oninput: (e) => { query = e.target.value; pintar(); } }),
        el('div', { class: 'texa__label' }, `Para repasar hoy · ${due}`),
        el('div', { class: 'texa__grid' }, filt.length ? filt.map((w) => el('div', { class: 'texa__wordrow' }, [
          el('div', { class: 'texa__wordtext' }, [el('strong', {}, w.en), el('span', { class: 'texa__muted' }, w.es)]),
          el('span', { class: `texa__stage texa__stage--${w.stage}` }, STAGE_LABEL[w.stage]),
        ])) : [el('p', { class: 'texa__muted' }, 'Todavía no guardás palabras. Agregá una arriba o buscá en el diccionario.')]),
      ];
    };

    // ── Vista: diccionario ──
    const vistaDic = () => {
      const q = query.trim().toLowerCase();
      const entradas = q
        ? DICCIONARIO.filter((d) => d.en.toLowerCase().includes(q) || d.es.toLowerCase().includes(q))
        : DICCIONARIO.filter((d) => d.en[0].toLowerCase() === letra);
      return [
        el('input', { class: 'texa__search', placeholder: 'Buscar en el diccionario (inglés o español)', value: query, oninput: (e) => { query = e.target.value; pintar(); } }),
        el('div', { class: 'texa__abc' }, ABC.map((L) => {
          const hay = DICCIONARIO.some((d) => d.en[0].toLowerCase() === L);
          return el('button', {
            class: `texa__letra${letra === L && !q ? ' is-active' : ''}`, disabled: !hay,
            onclick: () => { letra = L; query = ''; pintar(); },
          }, L.toUpperCase());
        })),
        el('div', { class: 'texa__label' }, q ? `${entradas.length} resultados` : `Palabras con «${letra.toUpperCase()}» · ${entradas.length}`),
        el('div', { class: 'texa__grid' }, entradas.length ? entradas.map((d) => {
          const ya = existe(d.en);
          const btn = el('button', {
            class: `texa__dicadd${ya ? ' is-saved' : ''}`, 'aria-label': 'Guardar en mi vocabulario',
            title: ya ? 'Ya está en tu vocabulario' : 'Guardar en mi vocabulario',
            onclick: (e) => {
              if (existe(d.en)) return;
              guardarPalabra(d.en, d.es);
              e.currentTarget.classList.add('is-saved');
              e.currentTarget.replaceChildren(el('span', { html: svgIc(IC.check2) }));
            },
          }, [el('span', { html: svgIc(ya ? IC.check2 : IC.mas) })]);
          return el('div', { class: 'texa__dicrow' }, [
            el('div', { class: 'texa__wordtext' }, [el('strong', {}, d.en), el('span', { class: 'texa__muted' }, d.es)]),
            btn,
          ]);
        }) : [el('p', { class: 'texa__muted' }, 'Sin resultados. Probá otra búsqueda.')]),
      ];
    };

    function pintar() {
      cont.replaceChildren(
        el('div', { class: 'texa__segmented texa__segmented--v' }, [
          el('button', { class: `texa__segment${modo === 'mias' ? ' is-active' : ''}`, onclick: () => { modo = 'mias'; query = ''; pintar(); } }, 'Mis palabras'),
          el('button', { class: `texa__segment${modo === 'dic' ? ' is-active' : ''}`, onclick: () => { modo = 'dic'; query = ''; pintar(); } }, 'Diccionario'),
        ]),
        ...(modo === 'dic' ? vistaDic() : vistaMias()),
      );
    }
    pintar();

    return {
      hero: heroTitulo('Vocabulario', 'Guardá palabras con su significado, o buscá en el diccionario inglés-español.'),
      cuerpo: [cont],
    };
  };

  /* Pantalla: Traducir */
  const pTraducir = () => {
    let dir = 'es-en';
    const cols = el('div', { class: 'texa__cols' });
    const pintar = () => {
      const p = PROMPTS[dir];
      const attempt = el('textarea', { class: 'texa__textarea', placeholder: 'Escribí tu traducción acá…', 'aria-label': 'Tu traducción' });
      const feedback = el('div', { class: 'texa__feedwrap' }, [
        el('div', { class: 'texa__feedhint' }, [
          el('span', { class: 'texa__eyebrow' }, 'Corrección'),
          el('p', { class: 'texa__muted' }, 'Escribí tu traducción y presioná “Corregir”. Acá aparecen la versión sugerida y las notas de matiz.'),
        ]),
      ]);
      const corregir = el('button', { class: 'texa__btn texa__btn--block', onclick: () => {
        if (!attempt.value.trim()) return;
        feedback.replaceChildren(el('div', { class: 'texa__feedback' }, [
          el('span', { class: 'texa__eyebrow' }, 'Traducción sugerida'),
          el('p', { class: 'texa__suggested' }, p.suggested),
          el('div', { class: 'texa__notes' }, FEEDBACK.map((n) =>
            el('div', { class: 'texa__note' }, [
              el('span', { class: `texa__notedot texa__notedot--${n.tone === 'ok' ? 'ok' : 'warn'}` }),
              el('span', {}, n.text),
            ]))),
        ]));
      } }, 'Corregir');
      cols.replaceChildren(
        el('div', { class: 'texa__col' }, [
          el('div', { class: 'texa__segmented' }, [
            el('button', { class: `texa__segment${dir === 'es-en' ? ' is-active' : ''}`, onclick: () => { dir = 'es-en'; pintar(); } }, 'ES → EN'),
            el('button', { class: `texa__segment${dir === 'en-es' ? ' is-active' : ''}`, onclick: () => { dir = 'en-es'; pintar(); } }, 'EN → ES'),
          ]),
          el('div', { class: 'texa__sourcecard' }, [
            el('span', { class: 'texa__muted' }, dir === 'es-en' ? 'Texto en español' : 'Text in English'),
            el('p', { class: 'texa__source' }, p.source),
          ]),
          el('div', { class: 'texa__section' }, [
            el('span', { class: 'texa__muted' }, 'Tu traducción'),
            attempt,
            corregir,
          ]),
        ]),
        el('div', { class: 'texa__col' }, [feedback]),
      );
    };
    pintar();
    return {
      hero: heroTitulo('Traducir', 'Traducís vos, la IA corrige matices y registro — no al revés.'),
      cuerpo: [cols],
    };
  };

  /* Pantalla: Aprender */
  const pAprender = () => {
    // vista: 'nivel' (por nivel) · 'temario' (índice) · 'leccion'
    let vista = 'nivel';
    let nivelSel = estado.nivel && CURRICULO.some((n) => n.id === estado.nivel) ? estado.nivel : nivelActual();
    let leccionSel = null;
    const cont = el('div', { class: 'texa__section' });

    const irNivel = (id) => { nivelSel = id; estado.nivel = id; guardar(); vista = 'nivel'; pintar(); };
    const abrirLeccion = (l) => { leccionSel = l; nivelSel = l.nivel; vista = 'leccion'; pintar(); cont.scrollIntoView?.({ block: 'nearest' }); };

    // Fila de una lección en una lista
    const filaLeccion = (l, esActual) => {
      const hecho = !!estado.aprendido[l.id];
      const dispo = tieneContenido(l);
      const estadoCls = hecho ? 'hecha' : esActual && dispo ? 'actual' : dispo ? 'dispo' : 'bloqueada';
      const marca = hecho ? '✓' : esActual && dispo ? '▶' : dispo ? '·' : '·';
      return el(dispo ? 'button' : 'div', {
        class: `texa__lesson texa__lesson--${estadoCls}`,
        ...(dispo ? { onclick: () => abrirLeccion(l) } : {}),
      }, [
        el('span', { class: 'texa__marker' }, marca),
        el('div', { class: 'texa__lessontext' }, [
          el('strong', {}, l.titulo),
          el('span', { class: 'texa__muted' }, l.resumen || ''),
        ]),
        el('span', { class: `texa__lstag texa__lstag--${estadoCls}` },
          hecho ? 'Aprendida' : dispo ? 'Empezar' : 'En preparación'),
      ]);
    };

    // Vista "por nivel"
    const vistaNivel = () => {
      const nivel = CURRICULO.find((n) => n.id === nivelSel);
      const dispo = conContenido(nivel).length;
      const hechas = completadasDe(nivel);
      const idxActual = nivel.lecciones.findIndex((l) => tieneContenido(l) && !estado.aprendido[l.id]);
      const totalAutor = TODAS_LECCIONES.filter(tieneContenido).length;
      const totalHechas = TODAS_LECCIONES.filter((l) => estado.aprendido[l.id]).length;
      return [
        // Banner de progreso / "el nivel que vas"
        el('div', { class: 'texa__progreso' }, [
          el('div', {}, [
            el('span', { class: 'texa__eyebrow' }, 'Tu nivel'),
            el('div', { class: 'texa__nivelnow' }, nivelActual()),
          ]),
          el('div', { class: 'texa__progmeta' }, [
            el('div', { class: 'texa__bar' }, [el('div', { class: 'texa__barfill', style: { width: `${totalAutor ? (totalHechas / totalAutor) * 100 : 0}%` } })]),
            el('span', { class: 'texa__muted' }, `${totalHechas} de ${totalAutor} temas con contenido`),
          ]),
          el('button', { class: 'texa__ghostbtn', onclick: () => { vista = 'temario'; pintar(); } }, 'Ver temario completo'),
        ]),
        // Selector de nivel
        el('div', { class: 'texa__levels' }, CURRICULO.map((n) =>
          el('button', { class: `texa__level${n.id === nivelSel ? ' is-active' : ''}`, onclick: () => irNivel(n.id) }, n.nombre))),
        // Lista del nivel
        el('div', { class: 'texa__section' }, [
          el('div', { class: 'texa__nivelhead' }, [
            el('div', { class: 'texa__label' }, nivel.etiqueta),
            el('span', { class: 'texa__muted' }, dispo ? `${hechas}/${dispo} completadas` : 'En preparación'),
          ]),
          el('div', { class: 'texa__grid' }, nivel.lecciones.map((l, i) => filaLeccion(l, i === idxActual))),
        ]),
      ];
    };

    // Vista "temario completo" (índice de todos los temas)
    const vistaTemario = () => [
      el('div', { class: 'texa__nivelhead' }, [
        el('button', { class: 'texa__back', onclick: () => { vista = 'nivel'; pintar(); } }, ['← Volver']),
        el('div', { class: 'texa__label' }, `Temario completo · tu nivel: ${nivelActual()}`),
      ]),
      ...CURRICULO.map((n) => {
        const dispo = conContenido(n).length;
        return el('div', { class: 'texa__temanivel' }, [
          el('div', { class: 'texa__nivelhead' }, [
            el('div', { class: `texa__label${n.id === nivelActual() ? ' texa__label--now' : ''}` }, n.etiqueta),
            el('span', { class: 'texa__muted' }, dispo ? `${completadasDe(n)}/${dispo}` : 'pronto'),
          ]),
          el('div', { class: 'texa__grid' }, n.lecciones.map((l) => filaLeccion(l, false))),
        ]);
      }),
    ];

    // Vista de una lección: explicación + ejemplos + ejercicios
    const vistaLeccion = () => {
      const l = leccionSel;
      let aciertos = 0;
      const resumenAc = el('span', { class: 'texa__muted' });
      const pintarAc = () => { resumenAc.textContent = `Aciertos: ${aciertos}/${l.ejercicios.length}`; };
      pintarAc();

      const nodoEjercicio = (ej, i) => {
        let contestado = false;
        const fb = el('div', { class: 'texa__exfb' });
        const preg = el('div', { class: 'texa__exq' }, [el('span', { class: 'texa__exn' }, `${i + 1}`), ...texto(ej.pregunta)]);
        let control;
        const acertar = (ok) => { if (!contestado) { contestado = true; if (ok) aciertos++; pintarAc(); } };
        if (ej.tipo === 'opcion') {
          control = el('div', { class: 'texa__exopts' }, ej.opciones.map((o) =>
            el('button', { class: 'texa__exopt', onclick: (e) => {
              if (contestado) return;
              const ok = norm(o) === norm(ej.correcta);
              e.currentTarget.classList.add(ok ? 'is-ok' : 'is-bad');
              if (!ok) control.querySelectorAll('.texa__exopt').forEach((b) => { if (norm(b.textContent) === norm(ej.correcta)) b.classList.add('is-ok'); });
              fb.textContent = ok ? '¡Correcto!' : `Correcto: ${ej.correcta}`;
              fb.className = `texa__exfb ${ok ? 'is-ok' : 'is-bad'}`;
              acertar(ok);
            } }, o)));
        } else {
          const inp = el('input', { class: 'texa__exinput', placeholder: 'Tu respuesta…', 'aria-label': 'Respuesta' });
          const comprobar = () => {
            if (contestado) return;
            const acc = [].concat(ej.respuesta).map(norm);
            const ok = acc.includes(norm(inp.value));
            inp.classList.add(ok ? 'is-ok' : 'is-bad');
            inp.disabled = true;
            fb.textContent = ok ? '¡Correcto!' : `Correcto: ${[].concat(ej.respuesta)[0]}`;
            fb.className = `texa__exfb ${ok ? 'is-ok' : 'is-bad'}`;
            acertar(ok);
          };
          inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') comprobar(); });
          control = el('div', { class: 'texa__exrow' }, [inp, el('button', { class: 'texa__btn', onclick: comprobar }, 'Comprobar')]);
        }
        return el('div', { class: 'texa__ex' }, [preg, control, fb]);
      };

      const hecho = !!estado.aprendido[l.id];
      const btnDone = el('button', { class: 'texa__btn texa__btn--block', onclick: () => {
        const primera = !estado.aprendido[l.id];
        estado.aprendido[l.id] = true; guardar();
        if (primera) celebrar();
        vista = 'nivel'; pintar();
      } }, hecho ? 'Repasada ✓ · volver' : 'Marcar como aprendida');

      return [
        el('div', { class: 'texa__nivelhead' }, [
          el('button', { class: 'texa__back', onclick: () => { vista = 'nivel'; pintar(); } }, [`← ${l.nivel}`]),
          hecho ? el('span', { class: 'texa__lstag texa__lstag--hecha' }, 'Aprendida') : null,
        ]),
        el('div', { class: 'texa__leccion' }, [
          el('h3', { class: 'texa__lecciontit' }, l.titulo),
          // Contenido en bloques (por qué, estructura, tabla, claves, ojo, dato)
          el('div', { class: 'texa__contenido' }, l.contenido.map(bloqueNodo).filter(Boolean)),
          // Ejemplos
          el('div', { class: 'texa__section' }, [
            el('div', { class: 'texa__label' }, 'Ejemplos'),
            el('div', { class: 'texa__ejemplos' }, l.ejemplos.map((e) =>
              el('div', { class: 'texa__ejemplo' }, [
                el('span', { class: 'texa__ejen' }, e.en),
                el('span', { class: 'texa__ejes' }, e.es),
              ]))),
          ]),
          // Ejercicios
          el('div', { class: 'texa__section' }, [
            el('div', { class: 'texa__nivelhead' }, [el('div', { class: 'texa__label' }, 'Ejercicios'), resumenAc]),
            ...l.ejercicios.map(nodoEjercicio),
          ]),
          btnDone,
        ]),
      ];
    };

    function pintar() {
      const nodos = vista === 'leccion' ? vistaLeccion() : vista === 'temario' ? vistaTemario() : vistaNivel();
      cont.replaceChildren(...nodos.filter(Boolean));
    }
    pintar();

    return {
      hero: heroTitulo('Aprender', 'Gramática de inglés desde cero: explicación, ejemplos y ejercicios, nivel por nivel.'),
      cuerpo: [cont],
    };
  };

  /* Pantalla: Chat */
  const pChat = () => {
    let replyIndex = 0;
    let listening = false;
    const mensajes = el('div', { class: 'texa__messages' });
    const pintarMensajes = () => {
      mensajes.replaceChildren(...estado.chat.map((m) =>
        el('div', { class: `texa__bubblerow texa__bubblerow--${m.from}` }, [
          el('div', { class: `texa__bubble texa__bubble--${m.from}` }, m.text),
          m.tip ? el('span', { class: 'texa__tip' }, m.tip) : null,
        ])));
      mensajes.scrollTop = mensajes.scrollHeight;
    };
    const input = el('input', { class: 'texa__chatinput', placeholder: 'Escribí o hablá en inglés…', 'aria-label': 'Mensaje' });
    const mic = el('button', { class: 'texa__mic', 'aria-label': 'Micrófono', onclick: () => {
      listening = !listening;
      mic.classList.toggle('is-on', listening);
      input.placeholder = listening ? 'Escuchando…' : 'Escribí o hablá en inglés…';
    } }, [txIcon('<path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>')]);
    let escribiendo = false;
    const enviar = () => {
      const v = input.value.trim();
      if (!v || escribiendo) return;
      const reply = AI_REPLIES[replyIndex % AI_REPLIES.length];
      replyIndex += 1;
      estado.chat.push({ from: 'user', text: v, tip: null });
      input.value = '';
      guardar();
      pintarMensajes();
      // Indicador "escribiendo…" antes de la respuesta
      escribiendo = true;
      const typing = el('div', { class: 'texa__bubblerow texa__bubblerow--ai' }, [
        el('div', { class: 'texa__bubble texa__bubble--ai texa__typing' }, [
          el('span', { class: 'texa__tdot' }), el('span', { class: 'texa__tdot' }), el('span', { class: 'texa__tdot' }),
        ]),
      ]);
      mensajes.append(typing);
      mensajes.scrollTop = mensajes.scrollHeight;
      setTimeout(() => {
        escribiendo = false;
        estado.chat.push({ from: 'ai', text: reply.text, tip: reply.tip });
        guardar();
        pintarMensajes();
      }, 850);
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') enviar(); });
    const enviarBtn = el('button', { class: 'texa__send', 'aria-label': 'Enviar', onclick: enviar },
      [txIcon('<path d="M12 20V5"/><path d="M6 11l6-6 6 6"/>')]);
    pintarMensajes();
    return {
      hero: heroTitulo('Chat con IA', 'Conversación libre en inglés. Corrige sin cortarte el ritmo.'),
      cuerpo: [
        el('div', { class: 'texa__chatwrap' }, [
          mensajes,
          el('div', { class: 'texa__inputbar' }, [mic, input, enviarBtn]),
        ]),
      ],
      chat: true,
    };
  };

  const PANTALLAS = { inicio: pInicio, vocabulario: pVocabulario, traducir: pTraducir, aprender: pAprender, chat: pChat };

  /* Barra de navegación superior (v2, fondo claro y fija) */
  const tabs = TABS.map((t) => el('button', {
    class: `texa__tab${t.id === tab ? ' is-active' : ''}`, dataset: { tab: t.id },
    'aria-label': t.label, onclick: () => ir(t.id),
  }, [txIcon(t.ic), el('span', {}, t.label)]));
  const ministats = el('div', { class: 'texa__ministats' });
  const nav = el('header', { class: 'texa__nav' }, [
    el('div', { class: 'texa__navleft' }, [
      el('button', {
        class: 'texa__salir', title: 'Volver al panel', 'aria-label': 'Volver al panel',
        onclick: () => { location.hash = '#/resumen'; },
      }, [el('span', { class: 'texa__salir-ic', html: svgIc(IC.volver) }), el('span', {}, 'Panel')]),
      el('div', { class: 'texa__brand' }, [marca(22), el('span', {}, 'TEXA')]),
    ]),
    el('nav', { class: 'texa__tabs', 'aria-label': 'Secciones de Texa' }, tabs),
    ministats,
  ]);
  const vista = el('div', { class: 'texa__view' });

  // Revelado al hacer scroll (vibra de página web)
  let io = null;
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: 0.06, rootMargin: '0px 0px -5% 0px' });
  }
  function observarReveal() {
    const nodos = vista.querySelectorAll('.reveal:not(.is-in)');
    if (!io) { nodos.forEach((n) => n.classList.add('is-in')); return; }
    nodos.forEach((n) => io.observe(n));
  }

  function pintarMinistats() {
    const s = estado.stats;
    ministats.replaceChildren(...[
      [s.racha, 'racha'], [s.vocabulario, 'palabras'], [s.hoyMin, 'min'],
    ].map(([v, l]) => el('div', { class: 'texa__ministat' }, [
      el('strong', {}, String(v)), el('span', {}, l),
    ])));
  }

  function marcarTab() {
    nav.querySelectorAll('.texa__tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === tab));
  }
  function ir(t) {
    tab = t;
    const s = PANTALLAS[t]();
    const header = el(s.landing ? 'section' : 'header', { class: `${s.landing ? 'texa__hero2' : 'texa__phead'} reveal` }, s.hero.filter(Boolean));
    const cuerpo = s.cuerpo.filter(Boolean);
    cuerpo.forEach((n) => n.classList && n.classList.add('reveal'));
    const body = s.landing ? cuerpo : [el('div', { class: 'texa__body' }, cuerpo)];
    vista.replaceChildren(el('div', { class: `texa__page${s.chat ? ' texa__page--chat' : ''}` }, [header, ...body]));
    marcarTab();
    pintarMinistats();
    requestAnimationFrame(observarReveal);
    window.scrollTo({ top: 0 });
  }

  ir(tab);
  return [el('div', { class: 'texa' }, [nav, vista])];
}
