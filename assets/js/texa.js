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

// Título del hero (texto blanco sobre el azul), como en la app.
const heroTitulo = (titulo, sub) => [
  el('h2', {}, titulo),
  sub ? el('p', {}, sub) : null,
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
      { to: 'vocabulario', eyebrow: 'Vocabulario', title: `${estado.words.filter((w) => w.stage !== 'dominada').length} palabras para repasar hoy`, detail: 'Repaso espaciado de lo que guardaste' },
      { to: 'traducir', eyebrow: 'Traducción', title: 'Frase del día para traducir', detail: '“It slipped my mind completely.”' },
      { to: 'aprender', eyebrow: `Aprender · Nivel ${nivelActual()}`, title: 'Tu recorrido de gramática', detail: 'Explicación + ejercicios, nivel por nivel' },
      { to: 'chat', eyebrow: 'Conversación', title: 'Practicá 10 minutos con la IA', detail: 'Charla libre, corrige sin cortar el flujo' },
    ];
    const stats = [
      { value: estado.stats.racha, unit: 'días de racha' },
      { value: estado.stats.vocabulario, unit: 'palabras guardadas' },
      { value: estado.stats.hoyMin, unit: 'minutos hoy' },
    ];
    return {
      hero: [
        el('div', { class: 'texa__greet' }, [
          el('span', { class: 'texa__greeteyebrow' }, 'Buen día'),
          el('h2', {}, 'Diego'),
        ]),
        el('div', { class: 'texa__hstats' }, stats.map((s) =>
          el('div', { class: 'texa__hstat' }, [
            el('strong', {}, String(s.value)),
            el('span', {}, s.unit),
          ]))),
      ],
      cuerpo: [
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
      ],
    };
  };

  /* Pantalla: Vocabulario */
  const pVocabulario = () => {
    let query = '';
    const lista = el('div', { class: 'texa__grid' });
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
    return {
      hero: heroTitulo('Vocabulario', 'Guardá cualquier palabra y te la recordamos cada día hasta que la aprendas.'),
      cuerpo: [
        el('div', { class: 'texa__toolbar' }, [
          el('div', { class: 'texa__addcard' }, [
            nueva,
            el('button', { class: 'texa__btn', onclick: agregar }, 'Guardar'),
          ]),
          el('input', {
            class: 'texa__search', placeholder: 'Buscar en tu vocabulario', 'aria-label': 'Buscar',
            oninput: (e) => { query = e.target.value; pintar(); },
          }),
        ]),
        el('div', { class: 'texa__section' }, [conteo, lista]),
      ],
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
        estado.aprendido[l.id] = true; guardar();
        vista = 'nivel'; pintar();
      } }, hecho ? 'Repasada ✓ · volver' : 'Marcar como aprendida');

      return [
        el('div', { class: 'texa__nivelhead' }, [
          el('button', { class: 'texa__back', onclick: () => { vista = 'nivel'; pintar(); } }, [`← ${l.nivel}`]),
          hecho ? el('span', { class: 'texa__lstag texa__lstag--hecha' }, 'Aprendida') : null,
        ]),
        el('div', { class: 'texa__leccion' }, [
          el('h3', { class: 'texa__lecciontit' }, l.titulo),
          // Explicación
          el('div', { class: 'texa__explica' }, l.explicacion.map((p) => el('p', {}, texto(p)))),
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

  /* Hero azul (como en la app): marca + pestañas arriba, título/​stats debajo */
  const tabs = TABS.map((t) => el('button', {
    class: `texa__tab${t.id === tab ? ' is-active' : ''}`, dataset: { tab: t.id },
    'aria-label': t.label, onclick: () => ir(t.id),
  }, [txIcon(t.ic), el('span', {}, t.label)]));
  const herobody = el('div', { class: 'texa__herobody' });
  const hero = el('div', { class: 'texa__hero' }, [
    el('span', { class: 'texa__motif', 'aria-hidden': 'true' }),
    el('div', { class: 'texa__herotop' }, [
      el('div', { class: 'texa__brand' }, [marca(20), el('span', {}, 'TEXA')]),
      el('nav', { class: 'texa__tabs', 'aria-label': 'Secciones de Texa' }, tabs),
    ]),
    herobody,
  ]);
  const vista = el('div', { class: 'texa__view' });

  function marcarTab() {
    hero.querySelectorAll('.texa__tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === tab));
  }
  function ir(t) {
    tab = t;
    const s = PANTALLAS[t]();
    herobody.replaceChildren(...s.hero.filter(Boolean));
    vista.replaceChildren(el('div', { class: `texa__page${s.chat ? ' texa__page--chat' : ''}` }, s.cuerpo));
    marcarTab();
  }

  ir(tab);
  return [el('div', { class: 'texa' }, [hero, vista])];
}
