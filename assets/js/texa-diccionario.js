/**
 * Diccionario inglés → español de Texa.
 *
 * Curado y local (sin API, sin costo). Palabras comunes de uso frecuente,
 * pensado para consulta y para nutrir el vocabulario del usuario. Se puede
 * ampliar agregando entradas al objeto D.
 */

const D = {
  // A
  about: 'acerca de, sobre', above: 'encima de, arriba', across: 'a través de', afraid: 'asustado', after: 'después', afternoon: 'tarde', again: 'otra vez', against: 'contra', age: 'edad', ago: 'hace (tiempo)', agree: 'estar de acuerdo', air: 'aire', airport: 'aeropuerto', all: 'todo', allow: 'permitir', almost: 'casi', alone: 'solo', along: 'a lo largo de', already: 'ya', also: 'también', although: 'aunque', always: 'siempre', amazing: 'increíble', angry: 'enojado', animal: 'animal', another: 'otro', answer: 'respuesta, responder', any: 'cualquier, algún', anyone: 'alguien', anything: 'cualquier cosa', appear: 'aparecer', apple: 'manzana', area: 'área, zona', arm: 'brazo', around: 'alrededor', arrive: 'llegar', art: 'arte', ask: 'preguntar, pedir', attack: 'atacar, ataque', aunt: 'tía', autumn: 'otoño', available: 'disponible', avoid: 'evitar', awake: 'despierto', away: 'lejos, fuera',
  // B
  baby: 'bebé', back: 'espalda, atrás', bad: 'malo', bag: 'bolsa', bake: 'hornear', ball: 'pelota', bank: 'banco', bathroom: 'baño', beach: 'playa', beautiful: 'hermoso', because: 'porque', become: 'convertirse en', bed: 'cama', before: 'antes', begin: 'empezar', behind: 'detrás', believe: 'creer', below: 'debajo', beside: 'al lado de', best: 'el mejor', better: 'mejor', between: 'entre', big: 'grande', bird: 'pájaro', birthday: 'cumpleaños', black: 'negro', blood: 'sangre', blue: 'azul', boat: 'barco', body: 'cuerpo', book: 'libro', bored: 'aburrido', boring: 'aburrido (que aburre)', borrow: 'pedir prestado', both: 'ambos', bottle: 'botella', box: 'caja', boy: 'niño', brave: 'valiente', bread: 'pan', break: 'romper, descanso', breakfast: 'desayuno', bridge: 'puente', bright: 'brillante', bring: 'traer', brother: 'hermano', brown: 'marrón', build: 'construir', busy: 'ocupado', but: 'pero', buy: 'comprar',
  // C
  call: 'llamar', careful: 'cuidadoso', carry: 'llevar, cargar', cat: 'gato', catch: 'atrapar', chair: 'silla', change: 'cambiar, cambio', cheap: 'barato', check: 'revisar', child: 'niño', choose: 'elegir', city: 'ciudad', clean: 'limpio, limpiar', clear: 'claro', clever: 'listo, hábil', climb: 'escalar', clock: 'reloj', close: 'cerrar, cerca', clothes: 'ropa', cloud: 'nube', cold: 'frío', colour: 'color', come: 'venir', cook: 'cocinar', cool: 'fresco, genial', corner: 'esquina', cost: 'costar, costo', country: 'país', course: 'curso', cousin: 'primo/a', cover: 'cubrir', cry: 'llorar', cup: 'taza', cut: 'cortar',
  // D
  dance: 'bailar', danger: 'peligro', dark: 'oscuro', daughter: 'hija', day: 'día', dead: 'muerto', deal: 'trato, acuerdo', dear: 'querido', decide: 'decidir', deep: 'profundo', delay: 'retraso', depend: 'depender', describe: 'describir', desk: 'escritorio', die: 'morir', different: 'diferente', difficult: 'difícil', dinner: 'cena', dirty: 'sucio', discover: 'descubrir', dish: 'plato', doctor: 'médico', dog: 'perro', door: 'puerta', down: 'abajo', draw: 'dibujar', dream: 'sueño, soñar', dress: 'vestido', drink: 'beber', drive: 'conducir', drop: 'dejar caer', dry: 'seco', during: 'durante',
  // E
  each: 'cada', ear: 'oreja', early: 'temprano', earn: 'ganar (dinero)', earth: 'tierra', easy: 'fácil', eat: 'comer', egg: 'huevo', either: 'cualquiera (de dos)', empty: 'vacío', end: 'fin, terminar', enemy: 'enemigo', enjoy: 'disfrutar', enough: 'suficiente', enter: 'entrar', evening: 'noche (tarde)', every: 'cada', everyone: 'todos', everything: 'todo', example: 'ejemplo', expensive: 'caro', explain: 'explicar', eye: 'ojo',
  // F
  face: 'cara', fact: 'hecho', fall: 'caer, otoño', family: 'familia', famous: 'famoso', far: 'lejos', fast: 'rápido', fat: 'gordo', father: 'padre', fear: 'miedo', feel: 'sentir', few: 'pocos', field: 'campo', fight: 'pelear, pelea', fill: 'llenar', film: 'película', find: 'encontrar', fine: 'bien, multa', finger: 'dedo', finish: 'terminar', fire: 'fuego', first: 'primero', fish: 'pez, pescado', fix: 'arreglar', floor: 'piso, suelo', flower: 'flor', fly: 'volar', follow: 'seguir', food: 'comida', foot: 'pie', forget: 'olvidar', forgive: 'perdonar', free: 'libre, gratis', fresh: 'fresco', friend: 'amigo', front: 'frente', fruit: 'fruta', full: 'lleno', fun: 'diversión', funny: 'gracioso', future: 'futuro',
  // G
  game: 'juego, partido', garden: 'jardín', get: 'obtener, conseguir', gift: 'regalo', girl: 'niña', give: 'dar', glass: 'vaso, vidrio', goal: 'meta, gol', gold: 'oro', good: 'bueno', goodbye: 'adiós', grandfather: 'abuelo', grass: 'pasto', great: 'genial, grandioso', green: 'verde', ground: 'suelo', grow: 'crecer', guess: 'adivinar', guest: 'invitado',
  // H
  hair: 'pelo, cabello', half: 'mitad', hand: 'mano', happen: 'suceder', happy: 'feliz', hard: 'difícil, duro', hat: 'sombrero', hate: 'odiar', have: 'tener', head: 'cabeza', health: 'salud', hear: 'oír', heart: 'corazón', heavy: 'pesado', hello: 'hola', help: 'ayudar', here: 'aquí', hide: 'esconder', high: 'alto', hill: 'colina', history: 'historia', hit: 'golpear', hold: 'sostener', hole: 'agujero', holiday: 'vacaciones, feriado', home: 'hogar, casa', hope: 'esperanza, esperar', horse: 'caballo', hospital: 'hospital', hot: 'caliente', hour: 'hora', house: 'casa', how: 'cómo', however: 'sin embargo', hungry: 'hambriento', hurry: 'apurarse', hurt: 'doler, herir',
  // I
  ice: 'hielo', idea: 'idea', ill: 'enfermo', important: 'importante', improve: 'mejorar', inside: 'dentro', instead: 'en cambio', interesting: 'interesante', introduce: 'presentar', invite: 'invitar', island: 'isla',
  // J
  job: 'trabajo, empleo', join: 'unirse', joke: 'broma', journey: 'viaje', joy: 'alegría', jump: 'saltar', just: 'solo, justo',
  // K
  keep: 'mantener, guardar', key: 'llave', kill: 'matar', kind: 'amable, tipo', king: 'rey', kiss: 'beso, besar', kitchen: 'cocina', knee: 'rodilla', knife: 'cuchillo', knock: 'golpear (puerta)', know: 'saber, conocer',
  // L
  lake: 'lago', land: 'tierra, aterrizar', language: 'idioma', large: 'grande', last: 'último', late: 'tarde', laugh: 'reír', lazy: 'perezoso', learn: 'aprender', leave: 'irse, dejar', left: 'izquierda', leg: 'pierna', lend: 'prestar', less: 'menos', lesson: 'lección', letter: 'carta, letra', library: 'biblioteca', lie: 'mentir, mentira', life: 'vida', light: 'luz, ligero', like: 'gustar, como', line: 'línea', list: 'lista', listen: 'escuchar', little: 'pequeño, poco', live: 'vivir', long: 'largo', look: 'mirar', lose: 'perder', loud: 'fuerte (sonido)', love: 'amar, amor', low: 'bajo', luck: 'suerte', lunch: 'almuerzo',
  // M
  machine: 'máquina', main: 'principal', make: 'hacer', man: 'hombre', many: 'muchos', map: 'mapa', market: 'mercado', marry: 'casarse', matter: 'importar, asunto', maybe: 'quizás', meal: 'comida (plato)', mean: 'significar, malo', meat: 'carne', meet: 'conocer, reunirse', member: 'miembro', message: 'mensaje', middle: 'medio', milk: 'leche', mind: 'mente', minute: 'minuto', mistake: 'error', money: 'dinero', month: 'mes', moon: 'luna', more: 'más', morning: 'mañana', mother: 'madre', mountain: 'montaña', mouth: 'boca', move: 'mover', much: 'mucho', music: 'música', must: 'deber (obligación)',
  // N
  name: 'nombre', near: 'cerca', need: 'necesitar', neighbour: 'vecino', never: 'nunca', new: 'nuevo', news: 'noticias', next: 'siguiente, próximo', nice: 'agradable, lindo', night: 'noche', noise: 'ruido', north: 'norte', nose: 'nariz', nothing: 'nada', now: 'ahora', number: 'número',
  // O
  ocean: 'océano', offer: 'ofrecer, oferta', office: 'oficina', often: 'a menudo', oil: 'aceite, petróleo', old: 'viejo', once: 'una vez', only: 'solo, único', open: 'abrir, abierto', orange: 'naranja', order: 'orden, pedir', other: 'otro', outside: 'afuera', over: 'sobre, terminado', own: 'propio',
  // P
  page: 'página', pain: 'dolor', paint: 'pintar', pair: 'par', paper: 'papel', parent: 'padre/madre', park: 'parque', part: 'parte', party: 'fiesta', pass: 'pasar, aprobar', past: 'pasado', pay: 'pagar', peace: 'paz', pen: 'bolígrafo', people: 'gente, personas', perhaps: 'quizás', person: 'persona', phone: 'teléfono', pick: 'recoger, elegir', picture: 'imagen, foto', piece: 'pedazo', place: 'lugar', plan: 'plan, planear', plant: 'planta', play: 'jugar, tocar', please: 'por favor', point: 'punto, señalar', poor: 'pobre', possible: 'posible', power: 'poder, energía', practice: 'practicar, práctica', prepare: 'preparar', present: 'presente, regalo', pretty: 'bonito, bastante', price: 'precio', problem: 'problema', promise: 'prometer', pull: 'tirar, jalar', push: 'empujar', put: 'poner',
  // Q
  queen: 'reina', question: 'pregunta', quick: 'rápido', quiet: 'silencioso', quite: 'bastante',
  // R
  rain: 'lluvia, llover', raise: 'levantar, criar', reach: 'alcanzar, llegar', read: 'leer', ready: 'listo', real: 'real', reason: 'razón', receive: 'recibir', red: 'rojo', remember: 'recordar', repeat: 'repetir', rest: 'descansar, resto', return: 'regresar, devolver', rich: 'rico', right: 'derecha, correcto', ring: 'anillo, sonar', rise: 'subir, aumentar', river: 'río', road: 'camino, carretera', room: 'habitación', run: 'correr',
  // S
  sad: 'triste', safe: 'seguro', same: 'mismo', sand: 'arena', save: 'guardar, salvar', say: 'decir', school: 'escuela', sea: 'mar', season: 'estación, temporada', seat: 'asiento', second: 'segundo', see: 'ver', seem: 'parecer', sell: 'vender', send: 'enviar', sentence: 'oración, frase', serious: 'serio', several: 'varios', share: 'compartir', sharp: 'afilado', ship: 'barco', shirt: 'camisa', shoe: 'zapato', shop: 'tienda', short: 'corto, bajo', should: 'debería', shout: 'gritar', show: 'mostrar', sick: 'enfermo', side: 'lado', sign: 'signo, firmar', silver: 'plata', since: 'desde', sing: 'cantar', sister: 'hermana', sit: 'sentarse', skill: 'habilidad', sky: 'cielo', sleep: 'dormir', slow: 'lento', small: 'pequeño', smart: 'inteligente', smell: 'oler, olor', smile: 'sonreír, sonrisa', smoke: 'humo, fumar', snow: 'nieve', soft: 'suave', some: 'algún, algo de', someone: 'alguien', something: 'algo', sometimes: 'a veces', son: 'hijo', song: 'canción', soon: 'pronto', sorry: 'lo siento', sound: 'sonido', soup: 'sopa', south: 'sur', space: 'espacio', speak: 'hablar', spend: 'gastar, pasar (tiempo)', spoon: 'cuchara', sport: 'deporte', spring: 'primavera', stand: 'pararse, estar de pie', star: 'estrella', start: 'empezar', station: 'estación', stay: 'quedarse', steal: 'robar', still: 'todavía, quieto', stone: 'piedra', stop: 'parar, detener', store: 'tienda, guardar', story: 'historia, cuento', strange: 'extraño', street: 'calle', strong: 'fuerte', student: 'estudiante', study: 'estudiar', stupid: 'estúpido', subject: 'tema, materia', such: 'tal', sugar: 'azúcar', summer: 'verano', sun: 'sol', sure: 'seguro', surprise: 'sorpresa', sweet: 'dulce', swim: 'nadar',
  // T
  table: 'mesa', take: 'tomar, llevar', talk: 'hablar', tall: 'alto', taste: 'sabor, probar', teach: 'enseñar', teacher: 'profesor', team: 'equipo', tell: 'decir, contar', thank: 'agradecer', then: 'entonces, luego', there: 'allí, ahí', thick: 'grueso, espeso', thin: 'delgado', thing: 'cosa', think: 'pensar', thirsty: 'sediento', though: 'aunque', throw: 'lanzar, tirar', ticket: 'boleto, entrada', tidy: 'ordenado', time: 'tiempo, vez', tired: 'cansado', today: 'hoy', together: 'juntos', tomorrow: 'mañana', tonight: 'esta noche', tooth: 'diente', top: 'cima, arriba', touch: 'tocar', town: 'pueblo, ciudad', travel: 'viajar', tree: 'árbol', trip: 'viaje', true: 'verdadero', try: 'intentar, probar', turn: 'girar, turno',
  // U
  ugly: 'feo', umbrella: 'paraguas', uncle: 'tío', under: 'debajo', understand: 'entender', until: 'hasta', use: 'usar', useful: 'útil', usually: 'usualmente',
  // V
  vegetable: 'verdura', very: 'muy', village: 'pueblo (aldea)', visit: 'visitar', voice: 'voz',
  // W
  wait: 'esperar', wake: 'despertar', walk: 'caminar', wall: 'pared, muro', want: 'querer', war: 'guerra', warm: 'cálido', wash: 'lavar', waste: 'desperdiciar', watch: 'mirar, reloj', water: 'agua', way: 'camino, manera', weak: 'débil', wear: 'llevar puesto, usar', weather: 'clima, tiempo', week: 'semana', weight: 'peso', welcome: 'bienvenido', well: 'bien, pozo', west: 'oeste', wet: 'mojado', what: 'qué', when: 'cuándo', where: 'dónde', which: 'cuál', while: 'mientras', white: 'blanco', who: 'quién', whole: 'entero, todo', why: 'por qué', wide: 'ancho', wife: 'esposa', win: 'ganar', wind: 'viento', window: 'ventana', wine: 'vino', winter: 'invierno', wish: 'desear, deseo', with: 'con', without: 'sin', woman: 'mujer', wonderful: 'maravilloso', wood: 'madera', word: 'palabra', work: 'trabajar, trabajo', world: 'mundo', worry: 'preocuparse', write: 'escribir', wrong: 'incorrecto, mal',
  // Y
  year: 'año', yellow: 'amarillo', yesterday: 'ayer', young: 'joven',
};

export const DICCIONARIO = Object.entries(D)
  .map(([en, es]) => ({ en, es }))
  .sort((a, b) => a.en.localeCompare(b.en));

// Busca el significado exacto de una palabra en inglés (o null).
export const buscarSignificado = (palabra) => {
  const q = String(palabra || '').trim().toLowerCase();
  const hit = DICCIONARIO.find((d) => d.en.toLowerCase() === q);
  return hit ? hit.es : null;
};
