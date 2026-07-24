/**
 * Currículo de Texa — Aprender.
 *
 * Cada lección con contenido trae:
 *   contenido: [ bloques ]   ejemplos: [{en,es}]   ejercicios: [...]
 *
 * Bloques (diseño variado, no solo texto):
 *   { t:'texto',      md }                        párrafo (admite **negrita** / *cursiva*)
 *   { t:'estructura', partes:[...] }              fórmula en "chips" unidas por +
 *   { t:'tabla',      cols:[...], filas:[[...]] } tabla (1ª columna = encabezado de fila)
 *   { t:'clave',      items:[...] }               ideas clave con viñeta ✓
 *   { t:'ojo',        md }                         aviso del error típico
 *   { t:'dato',       md }                         dato curioso "¿Sabías que…?"
 *
 * Ejercicios (autocorregidos):
 *   { tipo:'hueco',  pregunta, respuesta }   respuesta: string | string[]
 *   { tipo:'opcion', pregunta, opciones, correcta }
 * La `pregunta` usa "___" para el hueco.
 */

const soloTitulo = (titulo, resumen) => ({ titulo, resumen });

/* ─── A1 · Desde cero (contenido completo) ──────────────────────────── */

const A1 = [
  {
    titulo: 'Verbo "to be" (am / is / are)',
    resumen: 'Ser o estar: el verbo más básico.',
    contenido: [
      { t: 'texto', md: 'El verbo *to be* (ser o estar) es el más usado del inglés: aparece en descripciones, ubicaciones, edades y estados de ánimo. Casi todo lo demás se construye sobre él, así que vale la pena dominarlo primero.' },
      { t: 'estructura', partes: ['Sujeto', 'am / is / are', 'resto'] },
      { t: 'tabla', cols: ['Sujeto', 'to be'], filas: [['I', 'am'], ['You / We / They', 'are'], ['He / She / It', 'is']] },
      { t: 'clave', items: ['Con **I** siempre *am*.', 'Con singular **he / she / it** → *is*.', 'Con plural **we / you / they** → *are*.', 'Negativo: agrega *not* → *isn’t, aren’t*.'] },
      { t: 'ojo', md: 'En español decimos "tengo 20 años", pero en inglés se usa *to be*: **I’m 20**, nunca *I have 20*. Lo mismo con calor, frío, hambre: *I’m hot / hungry*.' },
      { t: 'dato', md: '*am, is* y *are* vienen de raíces distintas del inglés antiguo, por eso no se parecen entre sí. Es el único verbo tan "irregular" del idioma.' },
    ],
    ejemplos: [
      { en: 'I’m from Chile.', es: 'Soy de Chile.' },
      { en: 'She is a teacher.', es: 'Ella es profesora.' },
      { en: 'We are in Osorno.', es: 'Estamos en Osorno.' },
      { en: 'They aren’t ready.', es: 'No están listos.' },
    ],
    ejercicios: [
      { tipo: 'hueco', pregunta: 'I ___ a student.', respuesta: ['am', 'am '] },
      { tipo: 'opcion', pregunta: 'She ___ happy.', opciones: ['am', 'is', 'are'], correcta: 'is' },
      { tipo: 'hueco', pregunta: 'They ___ from Chile.', respuesta: ['are'] },
    ],
  },
  {
    titulo: 'Posesivos (my, your…) y el ’s',
    resumen: 'De quién es algo.',
    contenido: [
      { t: 'texto', md: 'Los posesivos dicen *de quién* es algo. A diferencia del español ("mi/mis"), en inglés **no cambian** según el objeto: *my* sirve igual para singular y plural.' },
      { t: 'estructura', partes: ['Posesivo', 'sustantivo'] },
      { t: 'tabla', cols: ['Persona', 'Posesivo'], filas: [['I', 'my'], ['you', 'your'], ['he', 'his'], ['she', 'her'], ['it', 'its'], ['we', 'our'], ['they', 'their']] },
      { t: 'clave', items: ['Van **antes** del sustantivo: *my guitar*.', 'Para el nombre de alguien, usa **’s**: *Ana’s book* (el libro de Ana).', 'Con plurales que ya terminan en -s, solo apóstrofo: *my parents’ car*.'] },
      { t: 'ojo', md: 'No confundas **its** (su, de ello) con **it’s** (= *it is*). *The dog wags **its** tail* / ***It’s** late*.' },
      { t: 'dato', md: 'El **’s** es lo que queda del "genitivo sajón", una terminación del inglés antiguo. Por eso funciona distinto a la preposición *of*.' },
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
    contenido: [
      { t: 'texto', md: 'Los demostrativos señalan cosas según la **distancia** (cerca/lejos) y el **número** (uno/varios). De paso practicamos el plural, que en inglés casi siempre es solo **-s**.' },
      { t: 'tabla', cols: ['', 'Cerca', 'Lejos'], filas: [['Singular', 'this', 'that'], ['Plural', 'these', 'those']] },
      { t: 'clave', items: ['**-s** normal: *cat → cats*.', '**-es** tras s, x, ch, sh: *box → boxes*.', '**-ies** si termina en consonante + y: *baby → babies*.'] },
      { t: 'ojo', md: 'Hay plurales irregulares que hay que memorizar: *child → children, man → men, foot → feet, person → people*.' },
      { t: 'dato', md: 'Algunos sustantivos no cambian en plural: *sheep, fish, deer*. Se dice *one sheep, two sheep*.' },
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
    contenido: [
      { t: 'texto', md: 'Usamos *there is / there are* para decir que algo **existe** (equivale a "hay"). El verbo concuerda con lo que viene **después**, no con "there".' },
      { t: 'tabla', cols: ['Situación', 'Forma'], filas: [['Singular', 'There is (There’s)'], ['Plural', 'There are'], ['Negativo', 'There isn’t / aren’t'], ['Pregunta', 'Is there…? / Are there…?']] },
      { t: 'clave', items: ['Con incontables → *there is*: *there is milk*.', 'En una lista, concuerda con el **primer** elemento: *There is a book and two pens*.'] },
      { t: 'ojo', md: 'No lo confundas con *they are*. **There is/are** = "hay" (existencia); **they are** = "ellos/ellas son/están".' },
      { t: 'dato', md: 'En conversación informal muchos nativos dicen *there’s two…* incluso con plural, aunque lo correcto sigue siendo *there are*.' },
    ],
    ejemplos: [
      { en: 'There is a book on the table.', es: 'Hay un libro en la mesa.' },
      { en: 'There are two cats.', es: 'Hay dos gatos.' },
      { en: 'Is there a bank near here?', es: '¿Hay un banco cerca?' },
      { en: 'There aren’t any eggs.', es: 'No hay huevos.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ three apples.', opciones: ['There is', 'There are'], correcta: 'There are' },
      { tipo: 'hueco', pregunta: '___ a problem with the car. (Hay un)', respuesta: ['there is', 'there’s', 'theres', "there's"] },
      { tipo: 'opcion', pregunta: '___ any milk? (¿hay?)', opciones: ['Is there', 'Are there'], correcta: 'Is there' },
    ],
  },
  {
    titulo: 'Present Simple',
    resumen: 'Hábitos, rutinas y verdades generales.',
    contenido: [
      { t: 'texto', md: 'El presente simple describe lo **habitual**, las rutinas y las verdades generales — no lo que pasa justo ahora. Es el tiempo que más usarás para hablar de tu día a día.' },
      { t: 'estructura', partes: ['Sujeto', 'verbo (+ -s en he/she/it)'] },
      { t: 'tabla', cols: ['Sujeto', 'trabajar'], filas: [['I / You / We / They', 'work'], ['He / She / It', 'works']] },
      { t: 'clave', items: ['Solo **he / she / it** lleva **-s**.', 'Tras o, s, x, ch, sh → **-es**: *go → goes, watch → watches*.', 'Consonante + y → **-ies**: *study → studies*.'] },
      { t: 'ojo', md: 'El error más común es olvidar la **-s** en la tercera persona: *She work* ✗ → *She **works*** ✓.' },
      { t: 'dato', md: 'Esa **-s** de "he works" es casi lo único que sobrevive de un sistema de conjugación mucho más grande que el inglés tuvo hace siglos.' },
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
    contenido: [
      { t: 'texto', md: 'Para preguntar y negar en presente simple, el inglés usa un **auxiliar**: *do / does*. Lo clave: el verbo principal vuelve a su forma **base** (sin -s).' },
      { t: 'estructura', partes: ['Do / Does', 'sujeto', 'verbo base?'] },
      { t: 'tabla', cols: ['Sujeto', 'Auxiliar'], filas: [['I / You / We / They', 'do / don’t'], ['He / She / It', 'does / doesn’t']] },
      { t: 'clave', items: ['La **-s** pasa al auxiliar (*does*) y el verbo queda base: *Does she **work**?*', 'Negativo: *don’t / doesn’t* + verbo base.', 'WH-: *What, Where, When, Why, How* + do/does + sujeto + verbo.'] },
      { t: 'ojo', md: '*Does she works?* ✗ — con *does*, el verbo NO lleva -s: *Does she **work**?* ✓.' },
      { t: 'dato', md: 'Este *do* auxiliar es rarísimo entre idiomas: casi ninguna otra lengua europea lo usa para preguntar. Es un sello propio del inglés.' },
    ],
    ejemplos: [
      { en: 'Do you like coffee?', es: '¿Te gusta el café?' },
      { en: 'She doesn’t eat meat.', es: 'Ella no come carne.' },
      { en: 'Where do you live?', es: '¿Dónde vives?' },
      { en: 'What does he do?', es: '¿A qué se dedica?' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ she like tea?', opciones: ['Do', 'Does'], correcta: 'Does' },
      { tipo: 'hueco', pregunta: 'They ___ on Sunday. (not / work)', respuesta: ['don’t work', 'do not work', 'dont work', "don't work"] },
      { tipo: 'opcion', pregunta: '___ do you live?', opciones: ['What', 'Where', 'Who'], correcta: 'Where' },
    ],
  },
  {
    titulo: 'Artículos a / an / the (intro)',
    resumen: 'Uno cualquiera vs. algo específico.',
    contenido: [
      { t: 'texto', md: 'Los artículos dicen si hablamos de algo **cualquiera** (*a / an*) o de algo **específico y conocido** (*the*). El español los usa distinto, así que hay que prestar atención.' },
      { t: 'tabla', cols: ['Artículo', 'Cuándo', 'Ejemplo'], filas: [['a', 'uno cualquiera, ante consonante', 'a dog'], ['an', 'uno cualquiera, ante sonido vocálico', 'an hour'], ['the', 'algo específico/conocido', 'the moon'], ['—', 'general, en plural o incontable', 'I like music']] },
      { t: 'clave', items: ['*an* se elige por el **sonido**, no la letra: *an hour* (h muda), *a university* (suena "iu").', 'La 1ª vez *a/an*, después *the*: *I saw **a** cat. **The** cat was black.*'] },
      { t: 'ojo', md: 'En español dices "me gusta **la** música"; en inglés general va SIN *the*: *I like music*, no *the music*.' },
      { t: 'dato', md: '*the* es la palabra más frecuente del inglés: aparece en cerca del 5% de todo lo que se escribe.' },
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
    contenido: [
      { t: 'texto', md: '*can* expresa **habilidad** y **posibilidad** ("poder / saber"). Es un verbo *modal*: no cambia con la persona y va seguido del verbo en **base**.' },
      { t: 'estructura', partes: ['Sujeto', 'can', 'verbo base'] },
      { t: 'tabla', cols: ['Forma', 'Ejemplo'], filas: [['Afirmativo', 'I can swim'], ['Negativo', 'I can’t (cannot) swim'], ['Pregunta', 'Can you swim?']] },
      { t: 'clave', items: ['Igual para todos: *he **can***, nunca *he cans*.', 'Después va el verbo base, **sin** *to*: *can swim*, no *can to swim*.'] },
      { t: 'ojo', md: '*He can to drive* ✗ → *He can **drive*** ✓. Nunca pongas *to* después de *can*.' },
      { t: 'dato', md: '*can* y *could* vienen de un antiguo verbo que significaba "saber". Por eso sirve para "saber hacer algo", no solo "poder".' },
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
    contenido: [
      { t: 'texto', md: 'Estas tres preposiciones marcan **tiempo** y **lugar**, y confunden porque en español casi siempre usamos solo "en". El truco: ir de lo **general** (*in*) a lo **puntual** (*at*).' },
      { t: 'tabla', cols: ['Prep.', 'Tiempo', 'Ejemplo'], filas: [['in', 'meses, años, partes del día', 'in July, in the morning'], ['on', 'días y fechas', 'on Monday'], ['at', 'horas', 'at 7:00']] },
      { t: 'clave', items: ['Lugar: **at** un punto (*at home*), **on** una superficie (*on the table*), **in** un espacio (*in the car*).', 'Regla mental: de lo amplio (**in**) a lo exacto (**at**).'] },
      { t: 'ojo', md: 'Es *in the morning / afternoon / evening* pero **at night**. Esa excepción hay que memorizarla.' },
      { t: 'dato', md: '*at* para horas viene de marcar un "punto" exacto en el tiempo; *in* para meses, de estar "dentro" de un período más largo.' },
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
    contenido: [
      { t: 'texto', md: 'Dicen **cada cuánto** ocurre algo. Lo complicado no es la palabra, sino su **posición**, que cambia según el verbo.' },
      { t: 'tabla', cols: ['Adverbio', 'Frecuencia'], filas: [['always', 'siempre (100%)'], ['usually', 'normalmente (~80%)'], ['often', 'a menudo (~60%)'], ['sometimes', 'a veces (~40%)'], ['rarely', 'rara vez (~10%)'], ['never', 'nunca (0%)']] },
      { t: 'clave', items: ['**Antes** del verbo principal: *I **always** drink coffee*.', '**Después** del verbo *to be*: *She **is** never late*.', 'En preguntas van tras el sujeto: *Do you **often** travel?*'] },
      { t: 'ojo', md: '*never* ya es negativo: no se combina con *don’t*. *I don’t never…* ✗ → *I **never**…* ✓.' },
      { t: 'dato', md: 'La doble negación (*I don’t know nothing*) se considera incorrecta en inglés estándar, aunque aparezca en canciones. Con una negación basta.' },
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
export const tieneContenido = (l) => Array.isArray(l.contenido) && l.contenido.length > 0;
