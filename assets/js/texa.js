/**
 * Texa — la app de inglés de Diego, adaptada a web como una sección del panel.
 *
 * Port fiel de la app móvil (Expo/React Native) a DOM: mismas 5 pantallas
 * (Inicio, Vocabulario, Traducir, Aprender, Chat), misma identidad visual
 * (crema cálido + acento azul, marca "T"). El estado que cambia el usuario
 * (vocabulario, chat, racha) se guarda en localStorage `texa.estado`.
 */

import { el } from './utils.js';

/* ─── Datos semilla (los mismos de la app) ──────────────────────────── */

const SEED = {
  stats: { racha: 4, vocabulario: 27, hoyMin: 12 },
  nivel: 'B2',
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

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LESSONS = [
  { title: 'Verbos frasales esenciales', detail: '18 tarjetas · 10 min', status: 'hecha' },
  { title: 'Registro formal vs. informal', detail: '14 tarjetas · 8 min', status: 'hecha' },
  { title: 'Modismos cotidianos', detail: '20 tarjetas · 12 min', status: 'actual' },
  { title: 'Conectores de argumentación', detail: '16 tarjetas · 9 min', status: 'bloqueada' },
  { title: 'Falsos amigos frecuentes', detail: '22 tarjetas · 13 min', status: 'bloqueada' },
];

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

/* ─── Marca ──────────────────────────────────────────────────────────── */

function marca(size = 20, onAccent = false) {
  const bg = onAccent ? 'rgba(255,255,255,0.22)' : '#3452D9';
  const stem2 = onAccent ? 'rgba(255,255,255,0.6)' : '#B9C4FF';
  return el('span', {
    class: 'texa__mark', style: { width: `${size}px`, height: `${size}px` },
    html: `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true">
      <rect width="120" height="120" rx="28" fill="${bg}"/>
      <rect x="28" y="30" width="64" height="12" rx="6" fill="#fff"/>
      <rect x="48" y="30" width="10" height="62" rx="5" fill="#fff"/>
      <rect x="62" y="30" width="10" height="62" rx="5" fill="${stem2}"/>
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

function hero({ titulo, subtitulo, saludo, stats }) {
  const contenido = [
    el('div', { class: 'texa__brand' }, [marca(18, true), el('span', {}, 'TEXA')]),
  ];
  if (saludo) {
    contenido.push(el('div', { class: 'texa__greet' }, [
      el('span', { class: 'texa__greet-eyebrow' }, saludo),
      el('h2', { class: 'texa__greet-name' }, titulo),
    ]));
    contenido.push(el('div', { class: 'texa__stats' }, stats.map((s) =>
      el('div', { class: 'texa__stat' }, [
        el('strong', {}, String(s.value)),
        el('span', {}, s.unit),
      ]))));
  } else {
    contenido.push(el('div', { class: 'texa__htitle' }, [
      el('h2', {}, titulo),
      subtitulo ? el('p', {}, subtitulo) : null,
    ]));
  }
  return el('div', { class: `texa__hero${saludo ? ' texa__hero--roomy' : ''}` }, [
    el('span', { class: 'texa__motif', 'aria-hidden': 'true' }),
    el('div', { class: 'texa__hero-in' }, contenido),
  ]);
}

/* ─── Sección ────────────────────────────────────────────────────────── */

export function texa() {
  const CLAVE = 'texa.estado';
  let estado;
  try { estado = JSON.parse(localStorage.getItem(CLAVE)) || structuredClone(SEED); }
  catch { estado = structuredClone(SEED); }
  // Completar campos que falten si venía un guardado viejo.
  estado = Object.assign(structuredClone(SEED), estado);
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch {} };

  let tab = 'inicio';
  const vista = el('div', { class: 'texa__view' });

  /* Pantalla: Inicio */
  const pInicio = () => {
    const acciones = [
      { to: 'vocabulario', eyebrow: 'Vocabulario', title: `${estado.words.filter((w) => w.stage !== 'dominada').length} palabras para repasar hoy`, detail: 'Repaso espaciado de lo que guardaste' },
      { to: 'traducir', eyebrow: 'Traducción', title: 'Frase del día para traducir', detail: '“It slipped my mind completely.”' },
      { to: 'aprender', eyebrow: `Aprender · Nivel ${estado.nivel}`, title: 'Modismos cotidianos', detail: 'Siguiente lección de tu recorrido' },
      { to: 'chat', eyebrow: 'Conversación', title: 'Practicá 10 minutos con la IA', detail: 'Charla libre, corrige sin cortar el flujo' },
    ];
    return el('div', {}, [
      hero({
        titulo: 'Diego', saludo: 'Buen día',
        stats: [
          { value: estado.stats.racha, unit: 'días de racha' },
          { value: estado.stats.vocabulario, unit: 'palabras' },
          { value: estado.stats.hoyMin, unit: 'min hoy' },
        ],
      }),
      el('div', { class: 'texa__body' }, [
        el('div', { class: 'texa__label' }, 'Continuar'),
        el('div', { class: 'texa__actions' }, acciones.map((a) =>
          el('button', { class: 'texa__actioncard', onclick: () => ir(a.to) }, [
            el('div', { class: 'texa__actioncard-main' }, [
              el('span', { class: 'texa__eyebrow' }, a.eyebrow),
              el('span', { class: 'texa__actiontitle' }, a.title),
              el('span', { class: 'texa__muted' }, a.detail),
            ]),
            el('span', { class: 'texa__arrow' }, '→'),
          ]))),
      ]),
    ]);
  };

  /* Pantalla: Vocabulario */
  const pVocabulario = () => {
    let query = '';
    const lista = el('div', { class: 'texa__list' });
    const conteo = el('div', { class: 'texa__label' });
    const pintar = () => {
      const q = query.trim().toLowerCase();
      const filt = estado.words.filter((w) => !q || w.en.toLowerCase().includes(q) || w.es.toLowerCase().includes(q));
      const due = filt.filter((w) => w.stage !== 'dominada').length;
      conteo.textContent = `Para repasar hoy · ${due}`;
      lista.replaceChildren(...(filt.length ? filt.map((w) => el('div', { class: 'texa__wordrow' }, [
        el('div', { class: 'texa__wordtext' }, [
          el('strong', {}, w.en),
          el('span', { class: 'texa__muted' }, w.es),
        ]),
        el('span', { class: `texa__stage texa__stage--${w.stage}` }, STAGE_LABEL[w.stage]),
      ])) : [el('p', { class: 'texa__muted' }, 'No encontramos palabras que coincidan.')]));
    };
    const nueva = el('input', { class: 'texa__input', placeholder: 'Guardar una palabra nueva…', 'aria-label': 'Palabra nueva' });
    const agregar = () => {
      const v = nueva.value.trim();
      if (!v) return;
      estado.words.unshift({ en: v, es: 'Traducción pendiente', stage: 'nueva' });
      estado.stats.vocabulario += 1;
      nueva.value = '';
      guardar();
      pintar();
    };
    nueva.addEventListener('keydown', (e) => { if (e.key === 'Enter') agregar(); });
    pintar();
    return el('div', {}, [
      hero({ titulo: 'Vocabulario', subtitulo: 'Guardá cualquier palabra y te la recordamos cada día hasta que la aprendas.' }),
      el('div', { class: 'texa__body' }, [
        el('div', { class: 'texa__addcard' }, [
          nueva,
          el('button', { class: 'texa__btn', onclick: agregar }, 'Guardar'),
        ]),
        el('input', {
          class: 'texa__search', placeholder: 'Buscar en tu vocabulario', 'aria-label': 'Buscar',
          oninput: (e) => { query = e.target.value; pintar(); },
        }),
        el('div', { class: 'texa__section' }, [conteo, lista]),
      ]),
    ]);
  };

  /* Pantalla: Traducir */
  const pTraducir = () => {
    let dir = 'es-en';
    const cuerpo = el('div', { class: 'texa__section' });
    const pintar = () => {
      const p = PROMPTS[dir];
      const attempt = el('textarea', { class: 'texa__textarea', placeholder: 'Escribí tu traducción acá…', 'aria-label': 'Tu traducción' });
      const feedback = el('div');
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
      cuerpo.replaceChildren(
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
        feedback,
      );
    };
    pintar();
    return el('div', {}, [
      hero({ titulo: 'Traducir', subtitulo: 'Traducís vos, la IA corrige matices y registro — no al revés.' }),
      el('div', { class: 'texa__body' }, [cuerpo]),
    ]);
  };

  /* Pantalla: Aprender */
  const pAprender = () => {
    const niveles = el('div', { class: 'texa__levels' });
    const lista = el('div', { class: 'texa__list' });
    const tituloRec = el('div', { class: 'texa__label' });
    const pintar = () => {
      tituloRec.textContent = `Tu recorrido en nivel ${estado.nivel}`;
      niveles.replaceChildren(...LEVELS.map((lv) =>
        el('button', { class: `texa__level${lv === estado.nivel ? ' is-active' : ''}`, onclick: () => { estado.nivel = lv; guardar(); pintar(); } }, lv)));
      lista.replaceChildren(...LESSONS.map((ls) => {
        const marca = ls.status === 'hecha' ? '✓' : ls.status === 'actual' ? '▶' : '·';
        return el('div', { class: `texa__lesson texa__lesson--${ls.status}` }, [
          el('span', { class: 'texa__marker' }, marca),
          el('div', { class: 'texa__lessontext' }, [
            el('strong', {}, ls.title),
            el('span', { class: 'texa__muted' }, ls.detail),
          ]),
        ]);
      }));
    };
    pintar();
    return el('div', {}, [
      hero({ titulo: 'Aprender', subtitulo: 'Elegí tu nivel y te ubicamos ahí — sin repetir lo que ya sabés.' }),
      el('div', { class: 'texa__body' }, [niveles, el('div', { class: 'texa__section' }, [tituloRec, lista])]),
    ]);
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
    const enviar = () => {
      const v = input.value.trim();
      if (!v) return;
      const reply = AI_REPLIES[replyIndex % AI_REPLIES.length];
      estado.chat.push({ from: 'user', text: v, tip: null });
      estado.chat.push({ from: 'ai', text: reply.text, tip: reply.tip });
      replyIndex += 1;
      input.value = '';
      guardar();
      pintarMensajes();
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') enviar(); });
    const enviarBtn = el('button', { class: 'texa__send', 'aria-label': 'Enviar', onclick: enviar },
      [txIcon('<path d="M12 20V5"/><path d="M6 11l6-6 6 6"/>')]);
    pintarMensajes();
    return el('div', { class: 'texa__chat' }, [
      hero({ titulo: 'Chat con IA', subtitulo: 'Conversación libre en inglés. Corrige sin cortarte el ritmo.' }),
      el('div', { class: 'texa__body texa__chatbody' }, [
        mensajes,
        el('div', { class: 'texa__inputbar' }, [mic, input, enviarBtn]),
      ]),
    ]);
  };

  const PANTALLAS = { inicio: pInicio, vocabulario: pVocabulario, traducir: pTraducir, aprender: pAprender, chat: pChat };

  const barra = el('div', { class: 'texa__tabbar' }, TABS.map((t) =>
    el('button', {
      class: `texa__tab${t.id === tab ? ' is-active' : ''}`, dataset: { tab: t.id },
      'aria-label': t.label, onclick: () => ir(t.id),
    }, [txIcon(t.ic), el('span', {}, t.label)])));

  function marcarTab() {
    barra.querySelectorAll('.texa__tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === tab));
  }
  function ir(t) {
    tab = t;
    vista.replaceChildren(PANTALLAS[tab]());
    marcarTab();
    vista.scrollTop = 0;
  }

  vista.replaceChildren(PANTALLAS[tab]());
  return [el('div', { class: 'texa' }, [vista, barra])];
}
