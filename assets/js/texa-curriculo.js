/**
 * Currículo de Texa — Aprender.
 *
 * Estructura por nivel (A1–C2 + Skills). Cada lección puede traer contenido
 * completo (explicacion + ejemplos + ejercicios) o solo el título (contenido
 * pendiente → se muestra "En preparación"). Los ejercicios se autocorrigen:
 *   { tipo: 'hueco',  pregunta, respuesta }   respuesta: string | string[]
 *   { tipo: 'opcion', pregunta, opciones, correcta }
 * La `pregunta` usa "___" para marcar el hueco.
 */

const soloTitulo = (titulo, resumen) => ({ titulo, resumen });

/* ─── A1 · Desde cero (contenido completo) ──────────────────────────── */

const A1 = [
  {
    titulo: 'Verbo "to be" (am / is / are)',
    resumen: 'Ser o estar: el verbo más básico.',
    explicacion: [
      'El verbo to be significa ser o estar. Cambia según la persona: **I am**, **you / we / they are**, **he / she / it is**.',
      'Negativo con not: *I am not, she isn’t, they aren’t*. Para preguntar, se invierte: *Are you…? Is he…?*',
    ],
    ejemplos: [
      { en: 'I am from Chile.', es: 'Soy de Chile.' },
      { en: 'She is a teacher.', es: 'Ella es profesora.' },
      { en: 'We are in Osorno.', es: 'Estamos en Osorno.' },
      { en: 'They aren’t ready.', es: 'No están listos.' },
    ],
    ejercicios: [
      { tipo: 'hueco', pregunta: 'I ___ a student.', respuesta: ['am'] },
      { tipo: 'opcion', pregunta: 'She ___ happy.', opciones: ['am', 'is', 'are'], correcta: 'is' },
      { tipo: 'hueco', pregunta: 'They ___ from Chile.', respuesta: ['are'] },
    ],
  },
  {
    titulo: 'Posesivos (my, your…) y el ’s',
    resumen: 'De quién es algo.',
    explicacion: [
      'Los adjetivos posesivos indican de quién: **my, your, his, her, its, our, their**. Van antes del sustantivo: *my guitar*.',
      'Para personas y cosas se usa **’s**: *Diego’s dog* = el perro de Diego.',
    ],
    ejemplos: [
      { en: 'This is my car.', es: 'Este es mi auto.' },
      { en: 'Her name is Ana.', es: 'Su nombre (de ella) es Ana.' },
      { en: 'It’s Diego’s guitar.', es: 'Es la guitarra de Diego.' },
      { en: 'Our house is big.', es: 'Nuestra casa es grande.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ name is Ana. (de ella)', opciones: ['His', 'Her', 'Their'], correcta: 'Her' },
      { tipo: 'opcion', pregunta: 'We love ___ dog. (nuestro)', opciones: ['our', 'their', 'your'], correcta: 'our' },
      { tipo: 'hueco', pregunta: 'That is Diego___ car. (de Diego)', respuesta: ["’s", "'s", "s"] },
    ],
  },
  {
    titulo: 'this / that / these / those + plurales',
    resumen: 'Señalar cosas y formar el plural.',
    explicacion: [
      '**this** (esto, cerca) / **that** (eso, lejos). En plural: **these** / **those**.',
      'El plural suele agregar **-s** (book → books) y **-es** tras s, x, ch, sh (box → boxes).',
    ],
    ejemplos: [
      { en: 'This is my phone.', es: 'Este es mi teléfono.' },
      { en: 'That car is fast.', es: 'Ese auto es rápido.' },
      { en: 'These books are new.', es: 'Estos libros son nuevos.' },
      { en: 'Those are my friends.', es: 'Esos son mis amigos.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ books are new. (estos)', opciones: ['This', 'These', 'That'], correcta: 'These' },
      { tipo: 'hueco', pregunta: 'Plural de "box": ___', respuesta: ['boxes'] },
      { tipo: 'opcion', pregunta: '___ is my house. (esta)', opciones: ['This', 'These', 'Those'], correcta: 'This' },
    ],
  },
  {
    titulo: 'there is / there are',
    resumen: 'Decir que algo existe (hay).',
    explicacion: [
      '**There is** + singular; **There are** + plural. Equivalen a "hay".',
      'Negativo: *there isn’t / there aren’t*. Pregunta: *Is there…? Are there…?*',
    ],
    ejemplos: [
      { en: 'There is a book on the table.', es: 'Hay un libro en la mesa.' },
      { en: 'There are two cats.', es: 'Hay dos gatos.' },
      { en: 'Is there a bank near here?', es: '¿Hay un banco cerca?' },
      { en: 'There aren’t any eggs.', es: 'No hay huevos.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ three apples.', opciones: ['There is', 'There are'], correcta: 'There are' },
      { tipo: 'hueco', pregunta: '___ a problem with the car. (Hay un)', respuesta: ['there is', 'there’s', 'there s'] },
      { tipo: 'opcion', pregunta: '___ any milk? (¿hay?)', opciones: ['Is there', 'Are there'], correcta: 'Is there' },
    ],
  },
  {
    titulo: 'Present Simple',
    resumen: 'Hábitos, rutinas y verdades generales.',
    explicacion: [
      'Para hábitos, rutinas y verdades: *I work, she works*. En **he / she / it** se agrega **-s** (y **-es / -ies** en algunos verbos: study → studies).',
      'Negativo con *don’t / doesn’t*; pregunta con *do / does* + verbo base.',
    ],
    ejemplos: [
      { en: 'I work at a bakery.', es: 'Trabajo en una panadería.' },
      { en: 'She plays guitar.', es: 'Ella toca guitarra.' },
      { en: 'They live in Puerto Montt.', es: 'Viven en Puerto Montt.' },
      { en: 'Water boils at 100°C.', es: 'El agua hierve a 100°C.' },
    ],
    ejercicios: [
      { tipo: 'hueco', pregunta: 'She ___ guitar. (play)', respuesta: ['plays'] },
      { tipo: 'opcion', pregunta: 'They ___ in Chile.', opciones: ['live', 'lives'], correcta: 'live' },
      { tipo: 'hueco', pregunta: 'He ___ English. (study)', respuesta: ['studies'] },
    ],
  },
  {
    titulo: 'Preguntas y negativos (do / does, WH-)',
    resumen: 'Negar y preguntar en presente.',
    explicacion: [
      'Negativo en presente simple: **don’t** (I/you/we/they) o **doesn’t** (he/she/it) + verbo base: *She doesn’t work*.',
      'Preguntas sí/no con **Do/Does**; preguntas abiertas con **What, Where, When, Who, Why, How** + do/does.',
    ],
    ejemplos: [
      { en: 'Do you like coffee?', es: '¿Te gusta el café?' },
      { en: 'She doesn’t eat meat.', es: 'Ella no come carne.' },
      { en: 'Where do you live?', es: '¿Dónde vives?' },
      { en: 'What does he do?', es: '¿A qué se dedica?' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ she like tea?', opciones: ['Do', 'Does'], correcta: 'Does' },
      { tipo: 'hueco', pregunta: 'They ___ on Sunday. (not / work)', respuesta: ['don’t work', 'do not work', 'dont work'] },
      { tipo: 'opcion', pregunta: '___ do you live?', opciones: ['What', 'Where', 'Who'], correcta: 'Where' },
    ],
  },
  {
    titulo: 'Artículos a / an / the (intro)',
    resumen: 'Uno cualquiera vs. algo específico.',
    explicacion: [
      '**a / an** = uno cualquiera (a book, an apple). Se usa *an* antes de sonido vocálico.',
      '**the** = algo específico o ya conocido. Sin artículo para cosas en general en plural: *I like dogs*.',
    ],
    ejemplos: [
      { en: 'I have a dog.', es: 'Tengo un perro.' },
      { en: 'She’s an engineer.', es: 'Es ingeniera.' },
      { en: 'The sun is hot.', es: 'El sol está caliente.' },
      { en: 'I like music.', es: 'Me gusta la música.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: 'I ate ___ apple.', opciones: ['a', 'an', 'the'], correcta: 'an' },
      { tipo: 'opcion', pregunta: 'Can you close ___ door, please?', opciones: ['a', 'an', 'the'], correcta: 'the' },
      { tipo: 'hueco', pregunta: 'She is ___ teacher.', respuesta: ['a'] },
    ],
  },
  {
    titulo: 'can (habilidad)',
    resumen: 'Poder / saber hacer algo.',
    explicacion: [
      '**can** = poder o saber hacer. Es igual para todas las personas (*I can, she can*) y va seguido del verbo base.',
      'Negativo: *can’t / cannot*. Pregunta: *Can you…?*',
    ],
    ejemplos: [
      { en: 'I can swim.', es: 'Sé nadar.' },
      { en: 'She can’t drive.', es: 'Ella no sabe manejar.' },
      { en: 'Can you help me?', es: '¿Puedes ayudarme?' },
      { en: 'They can speak English.', es: 'Saben hablar inglés.' },
    ],
    ejercicios: [
      { tipo: 'hueco', pregunta: 'I ___ swim very well.', respuesta: ['can'] },
      { tipo: 'opcion', pregunta: 'She ___ drive; she has no license.', opciones: ['can', 'can’t'], correcta: 'can’t' },
      { tipo: 'hueco', pregunta: '___ you help me? (¿puedes?)', respuesta: ['can'] },
    ],
  },
  {
    titulo: 'Preposiciones in / on / at',
    resumen: 'Tiempo y lugar.',
    explicacion: [
      'Tiempo: **at** para horas (at 5), **on** para días y fechas (on Monday), **in** para meses, años y partes del día (in July, in the morning).',
      'Lugar: **at** un punto (at home), **on** una superficie (on the table), **in** un espacio cerrado (in the room).',
    ],
    ejemplos: [
      { en: 'The meeting is at 3 p.m.', es: 'La reunión es a las 3.' },
      { en: 'I was born in 1990.', es: 'Nací en 1990.' },
      { en: 'See you on Friday.', es: 'Nos vemos el viernes.' },
      { en: 'The keys are on the table.', es: 'Las llaves están sobre la mesa.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: 'The class starts ___ 9 a.m.', opciones: ['in', 'on', 'at'], correcta: 'at' },
      { tipo: 'opcion', pregunta: 'My birthday is ___ July.', opciones: ['in', 'on', 'at'], correcta: 'in' },
      { tipo: 'opcion', pregunta: 'We meet ___ Monday.', opciones: ['in', 'on', 'at'], correcta: 'on' },
    ],
  },
  {
    titulo: 'Adverbios de frecuencia',
    resumen: 'Cada cuánto pasa algo.',
    explicacion: [
      'Dicen la frecuencia: **always, usually, often, sometimes, rarely, never**. Van **antes** del verbo principal…',
      '…pero **después** del verbo *to be*: *I always drink coffee* / *She is never late*.',
    ],
    ejemplos: [
      { en: 'I always drink coffee.', es: 'Siempre tomo café.' },
      { en: 'She usually walks to work.', es: 'Suele ir caminando al trabajo.' },
      { en: 'They never eat meat.', es: 'Nunca comen carne.' },
      { en: 'He is often tired.', es: 'Suele estar cansado.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: 'She ___ late. (nunca llega tarde)', opciones: ['never is', 'is never'], correcta: 'is never' },
      { tipo: 'opcion', pregunta: 'Orden correcto:', opciones: ['I often read', 'Often I read', 'I read often'], correcta: 'I often read' },
      { tipo: 'hueco', pregunta: 'I ___ drink tea in the morning. (always)', respuesta: ['always'] },
    ],
  },
];

/* ─── A2–C2 + Skills (títulos; contenido en preparación) ─────────────── */

const A2 = [
  soloTitulo('Present Continuous (+ vs. Simple)', 'Acciones en progreso ahora.'),
  soloTitulo('Contracciones y apóstrofos', 'I’m, doesn’t, haven’t…'),
  soloTitulo('Contables / incontables + some, any, much, many', 'Cantidades.'),
  soloTitulo('Comparativos y superlativos', 'bigger, the most interesting.'),
  soloTitulo('Adjetivos y adverbios', 'Orden y formación con -ly.'),
  soloTitulo('Past Simple', 'Acciones terminadas en el pasado.'),
  soloTitulo('Past Continuous', 'Acción en progreso interrumpida.'),
  soloTitulo('used to / would', 'Hábitos del pasado.'),
  soloTitulo('be going to', 'Planes e intenciones.'),
];

const B1 = [
  soloTitulo('Present Perfect Simple', 'Experiencia y resultado.'),
  soloTitulo('Present Perfect vs. Past Simple', 'El contraste clave (for/since/yet/already/ever).'),
  soloTitulo('Present Perfect Continuous', 'Duración de una acción no terminada.'),
  soloTitulo('will / shall (+ vs. going to)', 'Decisiones y promesas.'),
  soloTitulo('Present Continuous con valor de futuro', 'Planes confirmados.'),
  soloTitulo('Gerundios vs. infinitivos', 'enjoy doing / want to do.'),
  soloTitulo('Modales básicos', 'can, could, must, should, have to.'),
  soloTitulo('Condicionales 0 y 1', 'If I study, I learn.'),
  soloTitulo('Relative clauses (defining)', 'The man who called…'),
  soloTitulo('Question tags', '…isn’t it?'),
];

const B2 = [
  soloTitulo('Past Perfect Simple', 'Antes de otra acción pasada.'),
  soloTitulo('Condicionales 2 y 3', 'If I were… / If I had known…'),
  soloTitulo('Passive Voice (tiempos principales)', 'The cake was baked.'),
  soloTitulo('Reported Speech (base)', 'He said he was tired.'),
  soloTitulo('Future Perfect / Continuous', 'By 2030 I will have finished.'),
  soloTitulo('Perfect modals', 'should have, could have, might have.'),
  soloTitulo('wish / if only / unless / provided that', 'Deseos y condiciones.'),
  soloTitulo('Relative clauses (non-defining)', 'My brother, who lives in L.A.,…'),
  soloTitulo('Conectores y discourse markers', 'however, despite, whereas…'),
  soloTitulo('Collocations y phrasal verbs', 'make a decision, run out of.'),
];

const C1 = [
  soloTitulo('Past Perfect Continuous', 'Duración previa a otra acción pasada.'),
  soloTitulo('Condicionales mixtos', 'If I had studied, I would be…'),
  soloTitulo('Passive (todos los tiempos + causative)', 'get-passive, have something done.'),
  soloTitulo('Reported Speech (completo)', 'Todas las estructuras.'),
  soloTitulo('Inversion for emphasis', 'Never have I seen…'),
  soloTitulo('Cleft sentences', 'It was Gabriel who…'),
  soloTitulo('Participial / reduced clauses', 'Having finished, he left.'),
  soloTitulo('Formal vs. informal + false cognates', 'assist vs. help; actually, library.'),
];

const C2 = [
  soloTitulo('Registro avanzado', 'Literario, técnico, académico.'),
  soloTitulo('Idioms y matices', 'Expresiones y connotación.'),
  soloTitulo('Estilo y precisión', 'Elegir la palabra exacta.'),
];

const SKILLS = [
  soloTitulo('Writing & report', 'Coherencia, cohesión, linking words.'),
  soloTitulo('Translation (es ↔ en)', 'Precisión semántica.'),
  soloTitulo('Paraphrasing & summarizing', 'Evitar la literalidad.'),
  soloTitulo('Editing & proofreading', 'Errores por interferencia del español.'),
  soloTitulo('Connected speech & linking', 'wanna, gonna, lemme…'),
  soloTitulo('Stress & intonation', 'Inglés natural, no robótico.'),
  soloTitulo('Listening con fuentes nativas', 'Series, podcasts, debates.'),
];

/* ─── Ensamble: id estable por nivel+índice ─────────────────────────── */

function conIds(nivelId, lecciones) {
  return lecciones.map((l, i) => ({ id: `${nivelId.toLowerCase()}-${i + 1}`, nivel: nivelId, ...l }));
}

export const CURRICULO = [
  { id: 'A1', nombre: 'A1', etiqueta: 'A1 · Desde cero', lecciones: conIds('A1', A1) },
  { id: 'A2', nombre: 'A2', etiqueta: 'A2 · Elemental', lecciones: conIds('A2', A2) },
  { id: 'B1', nombre: 'B1', etiqueta: 'B1 · Intermedio', lecciones: conIds('B1', B1) },
  { id: 'B2', nombre: 'B2', etiqueta: 'B2 · Intermedio-alto', lecciones: conIds('B2', B2) },
  { id: 'C1', nombre: 'C1', etiqueta: 'C1 · Avanzado', lecciones: conIds('C1', C1) },
  { id: 'C2', nombre: 'C2', etiqueta: 'C2 · Maestría', lecciones: conIds('C2', C2) },
  { id: 'Skills', nombre: 'Skills', etiqueta: 'Skills · Destrezas', lecciones: conIds('Skills', SKILLS) },
];

export const TODAS_LECCIONES = CURRICULO.flatMap((n) => n.lecciones);
export const tieneContenido = (l) => Array.isArray(l.explicacion) && l.explicacion.length > 0;
