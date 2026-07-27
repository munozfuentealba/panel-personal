/**
 * Currículo de Texa — Aprender.
 *
 * Cada lección con contenido trae:
 *   contenido: [ bloques ]   ejemplos: [{en,es}]   ejercicios: [...]
 *
 * Bloques (diseño variado, no solo texto):
 *   { t:'texto',      md }                        párrafo (**negrita** / *cursiva*)
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
      { t: 'texto', md: 'El verbo *to be* (ser o estar) es el más usado del inglés. Con él dices **quién eres**, **cómo estás**, **dónde estás**, tu edad y tu profesión. Es la base de casi toda la gramática que viene después.' },
      { t: 'texto', md: 'Se usa para: identidad (*I am Diego*), nacionalidad (*She is Chilean*), estados y emociones (*They are tired*), ubicación (*The keys are here*) y descripción (*The house is big*).' },
      { t: 'estructura', partes: ['Sujeto', 'am / is / are', 'resto'] },
      { t: 'tabla', cols: ['Sujeto', 'Forma', 'Contracción'], filas: [['I', 'am', 'I’m'], ['You / We / They', 'are', 'you’re / we’re / they’re'], ['He / She / It', 'is', 'he’s / she’s / it’s']] },
      { t: 'tabla', cols: ['', 'Ejemplo'], filas: [['Negativo', 'She isn’t ready. / They aren’t home.'], ['Pregunta', 'Are you ok? / Is he here?'], ['Respuesta corta', 'Yes, I am. / No, she isn’t.']] },
      { t: 'clave', items: ['Con **I** → *am*; singular **he / she / it** → *is*; plural → *are*.', 'En preguntas, el verbo va **antes** del sujeto: *Are you…?*', 'Las contracciones (*I’m, isn’t*) son muy comunes al hablar.'] },
      { t: 'ojo', md: 'En español dices "tengo 20 años / tengo hambre / tengo razón", pero el inglés usa *to be*: **I’m 20 / I’m hungry / I’m right** — nunca *I have*.' },
      { t: 'ojo', md: 'No omitas el verbo. *She happy* ✗ → *She **is** happy* ✓. En inglés el verbo *to be* es obligatorio.' },
      { t: 'dato', md: '*am, is* y *are* vienen de tres raíces distintas del inglés antiguo; por eso no se parecen. Es el verbo más irregular del idioma.' },
    ],
    ejemplos: [
      { en: 'I’m from Chile.', es: 'Soy de Chile.' },
      { en: 'She is a teacher.', es: 'Ella es profesora.' },
      { en: 'We are at home.', es: 'Estamos en casa.' },
      { en: 'Are you tired?', es: '¿Estás cansado?' },
      { en: 'He isn’t ready.', es: 'No está listo.' },
      { en: 'I’m 34 years old.', es: 'Tengo 34 años.' },
    ],
    ejercicios: [
      { tipo: 'hueco', pregunta: 'I ___ a student.', respuesta: ['am'] },
      { tipo: 'opcion', pregunta: 'She ___ happy.', opciones: ['am', 'is', 'are'], correcta: 'is' },
      { tipo: 'hueco', pregunta: 'They ___ from Chile.', respuesta: ['are'] },
      { tipo: 'opcion', pregunta: '___ you tired?', opciones: ['Is', 'Are', 'Am'], correcta: 'Are' },
      { tipo: 'hueco', pregunta: 'He ___ ready. (not, contracción)', respuesta: ['isn’t', 'is not', 'isnt'] },
      { tipo: 'opcion', pregunta: 'We ___ at home.', opciones: ['is', 'are', 'am'], correcta: 'are' },
      { tipo: 'opcion', pregunta: '"Tengo hambre" en inglés:', opciones: ['I have hunger', 'I am hungry', 'I have hungry'], correcta: 'I am hungry' },
    ],
  },
  {
    titulo: 'Posesivos (my, your…) y el ’s',
    resumen: 'De quién es algo.',
    contenido: [
      { t: 'texto', md: 'Los posesivos indican *de quién* es algo. A diferencia del español, en inglés **no cambian** con el número del objeto: *my* vale para *my car* y *my cars*.' },
      { t: 'texto', md: 'Hay dos formas de expresar posesión: los **adjetivos posesivos** (my, your, his…) antes del sustantivo, y el **’s** para personas y seres vivos (*Ana’s book*). Para objetos se prefiere *of* (*the door **of** the house*).' },
      { t: 'estructura', partes: ['Posesivo / nombre + ’s', 'sustantivo'] },
      { t: 'tabla', cols: ['Persona', 'Adjetivo', 'Pronombre'], filas: [['I', 'my', 'mine'], ['you', 'your', 'yours'], ['he', 'his', 'his'], ['she', 'her', 'hers'], ['it', 'its', '—'], ['we', 'our', 'ours'], ['they', 'their', 'theirs']] },
      { t: 'clave', items: ['El **adjetivo** va antes del sustantivo: *my guitar*.', 'El **pronombre** va solo, sin sustantivo: *That book is **mine***.', 'Nombre + **’s** = "de": *Diego’s dog* = el perro de Diego.', 'Plural terminado en -s → solo apóstrofo: *my parents’ house*.'] },
      { t: 'ojo', md: '**its** (su, posesivo) ≠ **it’s** (= *it is*). *The dog wags **its** tail* / ***It’s** cold*.' },
      { t: 'ojo', md: 'No uses *the* con posesivos: *the my car* ✗ → *my car* ✓.' },
      { t: 'dato', md: 'El **’s** viene del "genitivo sajón" del inglés antiguo; por eso el inglés tiene dos maneras de decir "de" (‑’s y *of*).' },
    ],
    ejemplos: [
      { en: 'This is my car.', es: 'Este es mi auto.' },
      { en: 'Her name is Ana.', es: 'Su nombre es Ana.' },
      { en: 'That book is mine.', es: 'Ese libro es mío.' },
      { en: 'It’s Diego’s guitar.', es: 'Es la guitarra de Diego.' },
      { en: 'Our house is big.', es: 'Nuestra casa es grande.' },
      { en: 'The dog wags its tail.', es: 'El perro mueve su cola.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ name is Ana. (de ella)', opciones: ['His', 'Her', 'Their'], correcta: 'Her' },
      { tipo: 'opcion', pregunta: 'We love ___ dog. (nuestro)', opciones: ['our', 'their', 'your'], correcta: 'our' },
      { tipo: 'hueco', pregunta: 'That is Diego___ car. (de Diego)', respuesta: ['’s', "'s", 's'] },
      { tipo: 'opcion', pregunta: 'That book is ___. (mío)', opciones: ['my', 'mine', 'me'], correcta: 'mine' },
      { tipo: 'opcion', pregunta: '___ cold today.', opciones: ['Its', 'It’s'], correcta: 'It’s' },
      { tipo: 'opcion', pregunta: 'The dog hurt ___ paw.', opciones: ['its', 'it’s'], correcta: 'its' },
      { tipo: 'opcion', pregunta: '"el perro de mi hermano":', opciones: ['my brother dog', 'my brother’s dog', 'my brothers dog'], correcta: 'my brother’s dog' },
    ],
  },
  {
    titulo: 'this / that / these / those + plurales',
    resumen: 'Señalar cosas y formar el plural.',
    contenido: [
      { t: 'texto', md: 'Los demostrativos señalan cosas según la **distancia** (cerca/lejos) y el **número** (uno/varios). De paso repasamos el plural del sustantivo, que en inglés casi siempre es solo **-s**.' },
      { t: 'estructura', partes: ['this / that / these / those', '(+ sustantivo)'] },
      { t: 'tabla', cols: ['', 'Cerca', 'Lejos'], filas: [['Singular', 'this', 'that'], ['Plural', 'these', 'those']] },
      { t: 'tabla', cols: ['Regla del plural', 'Ejemplo'], filas: [['+ -s (lo normal)', 'book → books'], ['+ -es (tras s, x, ch, sh)', 'box → boxes'], ['-y → -ies', 'baby → babies'], ['-f → -ves', 'knife → knives']] },
      { t: 'clave', items: ['*this / these* = cerca de mí; *that / those* = más lejos.', 'Pueden ir solos (*This is nice*) o con sustantivo (*this book*).', 'Al teléfono te presentas con *This is Diego*.'] },
      { t: 'ojo', md: 'Plurales irregulares que NO siguen la regla: *child → children, man → men, woman → women, foot → feet, tooth → teeth, person → people, mouse → mice*.' },
      { t: 'dato', md: 'Algunos sustantivos son iguales en singular y plural: *sheep, fish, deer, aircraft*. Se dice *one sheep, two sheep*.' },
    ],
    ejemplos: [
      { en: 'This is my phone.', es: 'Este es mi teléfono.' },
      { en: 'That car is fast.', es: 'Ese auto es rápido.' },
      { en: 'These books are new.', es: 'Estos libros son nuevos.' },
      { en: 'Those are my friends.', es: 'Esos son mis amigos.' },
      { en: 'I have three children.', es: 'Tengo tres hijos.' },
      { en: 'Look at those mountains.', es: 'Mira esas montañas.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ books are new. (estos)', opciones: ['This', 'These', 'That'], correcta: 'These' },
      { tipo: 'hueco', pregunta: 'Plural de "box": ___', respuesta: ['boxes'] },
      { tipo: 'opcion', pregunta: '___ is my house. (esta)', opciones: ['This', 'These', 'Those'], correcta: 'This' },
      { tipo: 'hueco', pregunta: 'Plural de "baby": ___', respuesta: ['babies'] },
      { tipo: 'hueco', pregunta: 'Plural de "child": ___', respuesta: ['children'] },
      { tipo: 'opcion', pregunta: 'Look at ___ stars. (esas, a lo lejos)', opciones: ['these', 'those', 'this'], correcta: 'those' },
      { tipo: 'hueco', pregunta: 'Plural de "knife": ___', respuesta: ['knives'] },
    ],
  },
  {
    titulo: 'there is / there are',
    resumen: 'Decir que algo existe (hay).',
    contenido: [
      { t: 'texto', md: '*There is / there are* sirven para decir que algo **existe** — equivalen a "hay". El verbo concuerda con lo que viene **después**, no con "there".' },
      { t: 'texto', md: 'Se usan para describir lugares (*There is a park near here*), listas (*There are three options*) y cantidades. Con incontables siempre va *there is* (*There is water*).' },
      { t: 'tabla', cols: ['Forma', 'Ejemplo'], filas: [['Singular (there’s)', 'There is a book.'], ['Plural', 'There are two cats.'], ['Negativo', 'There isn’t / aren’t any milk.'], ['Pregunta', 'Is there…? / Are there…?'], ['Respuesta', 'Yes, there is. / No, there aren’t.']] },
      { t: 'clave', items: ['Singular e incontable → *there is*.', 'Plural → *there are*.', 'En una lista, concuerda con el **primer** elemento: *There is a pen and two books*.', 'Con negativo se usa *any*: *There aren’t **any** eggs*.'] },
      { t: 'ojo', md: 'No lo confundas con *they are*: **there is/are** = "hay" (existencia); **they are** = "ellos son/están".' },
      { t: 'dato', md: 'En conversación informal muchos nativos dicen *there’s* incluso con plural (*there’s two…*), aunque lo correcto es *there are*.' },
    ],
    ejemplos: [
      { en: 'There is a book on the table.', es: 'Hay un libro en la mesa.' },
      { en: 'There are two cats.', es: 'Hay dos gatos.' },
      { en: 'Is there a bank near here?', es: '¿Hay un banco cerca?' },
      { en: 'There aren’t any eggs.', es: 'No hay huevos.' },
      { en: 'There’s a lot of traffic today.', es: 'Hay mucho tráfico hoy.' },
      { en: 'Are there any questions?', es: '¿Hay preguntas?' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ three apples.', opciones: ['There is', 'There are'], correcta: 'There are' },
      { tipo: 'hueco', pregunta: '___ a problem with the car. (Hay un)', respuesta: ['there is', 'there’s', 'theres', "there's"] },
      { tipo: 'opcion', pregunta: '___ any milk? (¿hay?)', opciones: ['Is there', 'Are there'], correcta: 'Is there' },
      { tipo: 'opcion', pregunta: '___ a lot of water.', opciones: ['There is', 'There are'], correcta: 'There is' },
      { tipo: 'opcion', pregunta: '___ five students in class.', opciones: ['There is', 'There are'], correcta: 'There are' },
      { tipo: 'hueco', pregunta: 'No hay huevos → There ___ any eggs.', respuesta: ['aren’t', 'are not', 'arent'] },
      { tipo: 'opcion', pregunta: '"¿Hay preguntas?"', opciones: ['Is there any questions', 'Are there any questions'], correcta: 'Are there any questions' },
    ],
  },
  {
    titulo: 'Present Simple',
    resumen: 'Hábitos, rutinas y verdades generales.',
    contenido: [
      { t: 'texto', md: 'El presente simple describe lo **habitual**: rutinas, costumbres, horarios y verdades generales — no lo que ocurre en este momento. Es el tiempo que más usarás para hablar de tu día a día.' },
      { t: 'texto', md: 'Úsalo para rutinas (*I get up at 7*), gustos (*She likes coffee*), hechos (*Water boils at 100°C*) y horarios (*The train leaves at 6*). Suele acompañarse de *always, usually, every day, on Mondays*.' },
      { t: 'estructura', partes: ['Sujeto', 'verbo (+ -s en he/she/it)'] },
      { t: 'tabla', cols: ['Sujeto', 'trabajar'], filas: [['I / You / We / They', 'work'], ['He / She / It', 'works']] },
      { t: 'tabla', cols: ['Terminación (3ª pers.)', 'Regla', 'Ejemplo'], filas: [['+ -s', 'la mayoría', 'play → plays'], ['+ -es', 'tras o, s, x, ch, sh', 'go → goes'], ['-y → -ies', 'consonante + y', 'study → studies']] },
      { t: 'clave', items: ['Solo **he / she / it** cambia (lleva -s).', 'Negativo: *don’t / doesn’t* + verbo base.', 'Pregunta: *Do / Does* + sujeto + verbo base.'] },
      { t: 'ojo', md: 'El error #1: olvidar la **-s** en tercera persona. *She work* ✗ → *She **works*** ✓.' },
      { t: 'ojo', md: '*have* es irregular en tercera persona: *he **has***, no *he haves*.' },
      { t: 'dato', md: 'Esa **-s** de "he works" es lo poco que queda de un sistema de conjugación mucho más grande que tenía el inglés antiguo.' },
    ],
    ejemplos: [
      { en: 'I work at a bakery.', es: 'Trabajo en una panadería.' },
      { en: 'She plays guitar.', es: 'Ella toca guitarra.' },
      { en: 'They live in Puerto Montt.', es: 'Viven en Puerto Montt.' },
      { en: 'He goes to the gym on Mondays.', es: 'Va al gimnasio los lunes.' },
      { en: 'Water boils at 100°C.', es: 'El agua hierve a 100°C.' },
      { en: 'She has two dogs.', es: 'Tiene dos perros.' },
    ],
    ejercicios: [
      { tipo: 'hueco', pregunta: 'She ___ guitar. (play)', respuesta: ['plays'] },
      { tipo: 'opcion', pregunta: 'They ___ in Chile.', opciones: ['live', 'lives'], correcta: 'live' },
      { tipo: 'hueco', pregunta: 'He ___ English. (study)', respuesta: ['studies'] },
      { tipo: 'hueco', pregunta: 'She ___ two cats. (have)', respuesta: ['has'] },
      { tipo: 'hueco', pregunta: 'He ___ to work by bus. (go)', respuesta: ['goes'] },
      { tipo: 'opcion', pregunta: '"Ella no come carne":', opciones: ['She don’t eat meat', 'She doesn’t eat meat'], correcta: 'She doesn’t eat meat' },
      { tipo: 'hueco', pregunta: 'My brother ___ TV every night. (watch)', respuesta: ['watches'] },
    ],
  },
  {
    titulo: 'Preguntas y negativos (do / does, WH-)',
    resumen: 'Negar y preguntar en presente.',
    contenido: [
      { t: 'texto', md: 'En presente simple, para **negar** y **preguntar** el inglés usa un auxiliar: *do / does*. Al aparecer, el verbo principal vuelve a su forma **base** (sin -s).' },
      { t: 'texto', md: 'Para preguntas abiertas usa las **WH- words**: *what* (qué), *where* (dónde), *when* (cuándo), *who* (quién), *why* (por qué), *how* (cómo) + do/does + sujeto + verbo.' },
      { t: 'estructura', partes: ['(WH-) + Do / Does', 'sujeto', 'verbo base ?'] },
      { t: 'tabla', cols: ['Sujeto', 'Auxiliar', 'Negativo'], filas: [['I / You / We / They', 'do', 'don’t'], ['He / She / It', 'does', 'doesn’t']] },
      { t: 'clave', items: ['La **-s** pasa al auxiliar (*does*) y el verbo queda base: *Does she **work**?*', 'Respuestas cortas: *Yes, I do. / No, she doesn’t.*', 'WH- + do/does + sujeto + verbo: *Where **do** you live?*'] },
      { t: 'ojo', md: 'Con *does/doesn’t* el verbo NO lleva -s: *Does she works?* ✗ → *Does she **work**?* ✓.' },
      { t: 'ojo', md: 'No mezcles con *to be*: para *am/is/are* NO se usa *do*. *Do you are…?* ✗ → *Are you…?* ✓.' },
      { t: 'dato', md: 'Este *do* auxiliar es casi único: muy pocas lenguas lo usan para preguntar. Es un sello propio del inglés.' },
    ],
    ejemplos: [
      { en: 'Do you like coffee?', es: '¿Te gusta el café?' },
      { en: 'She doesn’t eat meat.', es: 'Ella no come carne.' },
      { en: 'Where do you live?', es: '¿Dónde vives?' },
      { en: 'What does he do?', es: '¿A qué se dedica?' },
      { en: 'Why don’t they come?', es: '¿Por qué no vienen?' },
      { en: 'Does she speak English?', es: '¿Habla inglés?' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: '___ she like tea?', opciones: ['Do', 'Does'], correcta: 'Does' },
      { tipo: 'hueco', pregunta: 'They ___ on Sunday. (not / work)', respuesta: ['don’t work', 'do not work', 'dont work', "don't work"] },
      { tipo: 'opcion', pregunta: '___ do you live?', opciones: ['What', 'Where', 'Who'], correcta: 'Where' },
      { tipo: 'opcion', pregunta: '"¿Habla ella francés?"', opciones: ['Does she speaks French', 'Does she speak French'], correcta: 'Does she speak French' },
      { tipo: 'hueco', pregunta: 'He ___ fish. (not / like)', respuesta: ['doesn’t like', 'does not like', 'doesnt like', "doesn't like"] },
      { tipo: 'opcion', pregunta: '___ do you go to school? (cómo)', opciones: ['How', 'Who', 'Why'], correcta: 'How' },
      { tipo: 'opcion', pregunta: '"¿Eres profesor?"', opciones: ['Do you are a teacher', 'Are you a teacher'], correcta: 'Are you a teacher' },
    ],
  },
  {
    titulo: 'Artículos a / an / the (intro)',
    resumen: 'Uno cualquiera vs. algo específico.',
    contenido: [
      { t: 'texto', md: 'Los artículos indican si hablamos de algo **cualquiera** (*a / an*) o de algo **específico y conocido** (*the*). El español los usa distinto al inglés, así que atención.' },
      { t: 'texto', md: 'Se usa *a* antes de sonido consonante y *an* antes de sonido vocálico — se decide por el **sonido**, no la letra: *an hour* (h muda), *a university* (suena "iu-").' },
      { t: 'tabla', cols: ['Artículo', 'Uso', 'Ejemplo'], filas: [['a', 'uno cualquiera (consonante)', 'a dog'], ['an', 'uno cualquiera (vocal)', 'an apple'], ['the', 'específico / único / ya mencionado', 'the sun'], ['— (nada)', 'general (plural / incontable)', 'I like music']] },
      { t: 'clave', items: ['1ª mención → *a/an*; después → *the*: *I saw **a** cat. **The** cat was black.*', '*the* para cosas únicas: *the moon, the sky, the internet*.', 'Sin artículo para ideas en general: *Dogs are loyal*.'] },
      { t: 'ojo', md: 'En español: "me gusta **la** música"; en inglés general va SIN *the*: *I like music*, no *the music*.' },
      { t: 'ojo', md: 'No uses *a/an* con plurales: *a books* ✗ → *books* o *some books* ✓.' },
      { t: 'dato', md: '*the* es la palabra más frecuente del inglés: aparece en cerca del 5% de todo lo escrito.' },
    ],
    ejemplos: [
      { en: 'I have a dog.', es: 'Tengo un perro.' },
      { en: 'She’s an engineer.', es: 'Es ingeniera.' },
      { en: 'The sun is hot.', es: 'El sol está caliente.' },
      { en: 'I like music.', es: 'Me gusta la música.' },
      { en: 'We waited an hour.', es: 'Esperamos una hora.' },
      { en: 'Dogs are loyal.', es: 'Los perros son leales.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: 'I ate ___ apple.', opciones: ['a', 'an', 'the'], correcta: 'an' },
      { tipo: 'opcion', pregunta: 'Can you close ___ door, please?', opciones: ['a', 'an', 'the'], correcta: 'the' },
      { tipo: 'hueco', pregunta: 'She is ___ teacher.', respuesta: ['a'] },
      { tipo: 'opcion', pregunta: 'We waited ___ hour.', opciones: ['a', 'an'], correcta: 'an' },
      { tipo: 'opcion', pregunta: '"Me gusta la música":', opciones: ['I like the music', 'I like music'], correcta: 'I like music' },
      { tipo: 'opcion', pregunta: '___ sun is a star.', opciones: ['A', 'An', 'The'], correcta: 'The' },
      { tipo: 'opcion', pregunta: 'She’s ___ university student.', opciones: ['a', 'an'], correcta: 'a' },
    ],
  },
  {
    titulo: 'can (habilidad)',
    resumen: 'Poder / saber hacer algo.',
    contenido: [
      { t: 'texto', md: '*can* expresa **habilidad** ("saber hacer") y también **posibilidad** y **permiso** ("poder"). Es un verbo *modal*: igual para todas las personas y seguido del verbo en base.' },
      { t: 'texto', md: 'Habilidad: *I can swim*. Permiso: *Can I go?* Posibilidad: *It can rain*. Pedidos: *Can you help me?* Su pasado es *could*.' },
      { t: 'estructura', partes: ['Sujeto', 'can / can’t', 'verbo base'] },
      { t: 'tabla', cols: ['Forma', 'Ejemplo'], filas: [['Afirmativo', 'I can drive.'], ['Negativo', 'I can’t (cannot) drive.'], ['Pregunta', 'Can you drive?'], ['Respuesta', 'Yes, I can. / No, I can’t.']] },
      { t: 'clave', items: ['No cambia: *he **can***, nunca *he cans*.', 'El verbo va en base, **sin** *to*: *can swim*, no *can to swim*.', '*can’t* = *cannot* (se escribe junto).'] },
      { t: 'ojo', md: '*He can to drive* ✗ → *He can **drive*** ✓. Nunca *to* después de un modal.' },
      { t: 'ojo', md: '*He cans* ✗ — los verbos modales no llevan -s en tercera persona.' },
      { t: 'dato', md: '*can* venía de un verbo del inglés antiguo que significaba "saber"; por eso sirve para "saber hacer algo".' },
    ],
    ejemplos: [
      { en: 'I can swim.', es: 'Sé nadar.' },
      { en: 'She can’t drive.', es: 'Ella no sabe manejar.' },
      { en: 'Can you help me?', es: '¿Puedes ayudarme?' },
      { en: 'Can I open the window?', es: '¿Puedo abrir la ventana?' },
      { en: 'They can speak three languages.', es: 'Hablan tres idiomas.' },
      { en: 'It can get cold at night.', es: 'Puede hacer frío de noche.' },
    ],
    ejercicios: [
      { tipo: 'hueco', pregunta: 'I ___ swim very well.', respuesta: ['can'] },
      { tipo: 'opcion', pregunta: 'She ___ drive; she has no license.', opciones: ['can', 'can’t'], correcta: 'can’t' },
      { tipo: 'hueco', pregunta: '___ you help me? (¿puedes?)', respuesta: ['can'] },
      { tipo: 'opcion', pregunta: '"Él sabe cocinar":', opciones: ['He can cooks', 'He can cook', 'He cans cook'], correcta: 'He can cook' },
      { tipo: 'opcion', pregunta: '___ I open the window?', opciones: ['Can', 'Do'], correcta: 'Can' },
      { tipo: 'hueco', pregunta: 'Negativo de "I can go" (junto):', respuesta: ['can’t go', 'cannot go', 'cant go', "can't go"] },
      { tipo: 'opcion', pregunta: '"Ellos pueden hablar inglés":', opciones: ['They can speak English', 'They can to speak English'], correcta: 'They can speak English' },
    ],
  },
  {
    titulo: 'Preposiciones in / on / at',
    resumen: 'Tiempo y lugar.',
    contenido: [
      { t: 'texto', md: '*in, on, at* marcan **tiempo** y **lugar**. Confunden porque en español muchas veces usamos solo "en". El truco: ir de lo **general** (*in*) a lo **puntual** (*at*).' },
      { t: 'tabla', cols: ['Prep.', 'Tiempo', 'Ejemplo'], filas: [['in', 'meses, años, estaciones, partes del día', 'in July, in 2020, in the morning'], ['on', 'días y fechas', 'on Monday, on July 5th'], ['at', 'horas y momentos exactos', 'at 7:00, at noon, at night']] },
      { t: 'tabla', cols: ['Prep.', 'Lugar', 'Ejemplo'], filas: [['in', 'espacio cerrado', 'in the room, in Chile'], ['on', 'sobre una superficie', 'on the table, on the wall'], ['at', 'un punto concreto', 'at home, at the bus stop']] },
      { t: 'clave', items: ['Tiempo: **in** (largo) › **on** (día) › **at** (hora).', 'Lugar: **in** (dentro) › **on** (encima) › **at** (punto).', 'Direcciones: *at* el número, *on* la calle, *in* la ciudad.'] },
      { t: 'ojo', md: 'Es *in the morning / afternoon / evening* pero **at night**. Memorízala.' },
      { t: 'ojo', md: '*at the weekend* (británico) / *on the weekend* (americano) — ambas se usan.' },
      { t: 'dato', md: '*at* marca un "punto" exacto (una hora); *in*, estar "dentro" de un período largo (un mes o un año).' },
    ],
    ejemplos: [
      { en: 'The meeting is at 3 p.m.', es: 'La reunión es a las 3.' },
      { en: 'I was born in 1990.', es: 'Nací en 1990.' },
      { en: 'See you on Friday.', es: 'Nos vemos el viernes.' },
      { en: 'The keys are on the table.', es: 'Las llaves están sobre la mesa.' },
      { en: 'She lives in Osorno.', es: 'Vive en Osorno.' },
      { en: 'I’ll be at home tonight.', es: 'Estaré en casa esta noche.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: 'The class starts ___ 9 a.m.', opciones: ['in', 'on', 'at'], correcta: 'at' },
      { tipo: 'opcion', pregunta: 'My birthday is ___ July.', opciones: ['in', 'on', 'at'], correcta: 'in' },
      { tipo: 'opcion', pregunta: 'We meet ___ Monday.', opciones: ['in', 'on', 'at'], correcta: 'on' },
      { tipo: 'opcion', pregunta: 'The book is ___ the table.', opciones: ['in', 'on', 'at'], correcta: 'on' },
      { tipo: 'opcion', pregunta: 'She lives ___ Chile.', opciones: ['in', 'on', 'at'], correcta: 'in' },
      { tipo: 'opcion', pregunta: 'I’m ___ home.', opciones: ['in', 'on', 'at'], correcta: 'at' },
      { tipo: 'opcion', pregunta: 'We study ___ the morning.', opciones: ['in', 'on', 'at'], correcta: 'in' },
      { tipo: 'opcion', pregunta: 'The party is ___ night.', opciones: ['in', 'on', 'at'], correcta: 'at' },
    ],
  },
  {
    titulo: 'Adverbios de frecuencia',
    resumen: 'Cada cuánto pasa algo.',
    contenido: [
      { t: 'texto', md: 'Los adverbios de frecuencia dicen **cada cuánto** ocurre algo. Lo difícil no es la palabra, sino su **posición**, que cambia según el verbo.' },
      { t: 'tabla', cols: ['Adverbio', 'Frecuencia'], filas: [['always', 'siempre (100%)'], ['usually', 'normalmente (~80%)'], ['often', 'a menudo (~60%)'], ['sometimes', 'a veces (~40%)'], ['rarely / seldom', 'rara vez (~10%)'], ['never', 'nunca (0%)']] },
      { t: 'estructura', partes: ['Sujeto', 'adverbio', 'verbo principal'] },
      { t: 'clave', items: ['**Antes** del verbo principal: *I **always** drink coffee*.', '**Después** del verbo *to be*: *She **is** never late*.', 'Frases como *every day, twice a week* van al **final**.'] },
      { t: 'ojo', md: '*never* ya es negativo: no se combina con *don’t*. *I don’t never…* ✗ → *I **never**…* ✓.' },
      { t: 'ojo', md: '*usually, often, sometimes* pueden ir también al **inicio** de la frase: *Sometimes I walk to work*.' },
      { t: 'dato', md: 'La doble negación (*I don’t know nothing*) se considera incorrecta en inglés estándar, aunque aparezca en canciones.' },
    ],
    ejemplos: [
      { en: 'I always drink coffee.', es: 'Siempre tomo café.' },
      { en: 'She usually walks to work.', es: 'Suele ir caminando al trabajo.' },
      { en: 'They never eat meat.', es: 'Nunca comen carne.' },
      { en: 'He is often tired.', es: 'Suele estar cansado.' },
      { en: 'We sometimes watch films.', es: 'A veces vemos películas.' },
      { en: 'I go to the gym twice a week.', es: 'Voy al gimnasio dos veces por semana.' },
    ],
    ejercicios: [
      { tipo: 'opcion', pregunta: 'She ___ late. (nunca llega tarde)', opciones: ['never is', 'is never'], correcta: 'is never' },
      { tipo: 'opcion', pregunta: 'Orden correcto:', opciones: ['I often read', 'Often I read', 'I read often'], correcta: 'I often read' },
      { tipo: 'hueco', pregunta: 'I ___ drink tea in the morning. (always)', respuesta: ['always'] },
      { tipo: 'opcion', pregunta: '"Ella siempre está cansada":', opciones: ['She always is tired', 'She is always tired'], correcta: 'She is always tired' },
      { tipo: 'opcion', pregunta: '"Nunca como carne" (correcto):', opciones: ['I don’t never eat meat', 'I never eat meat'], correcta: 'I never eat meat' },
      { tipo: 'opcion', pregunta: '"Voy al gimnasio dos veces por semana":', opciones: ['I twice a week go to the gym', 'I go to the gym twice a week'], correcta: 'I go to the gym twice a week' },
      { tipo: 'opcion', pregunta: 'They ___ out. (a veces comen fuera)', opciones: ['sometimes eat', 'eat sometimes'], correcta: 'sometimes eat' },
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
