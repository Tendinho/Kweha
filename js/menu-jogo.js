/* ============================================================
   Kweha — Lógica do jogo
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const ROUND_OPTIONS = [3, 5, 10, 15];
  const storedRounds = Number(localStorage.getItem('totalRounds'));
  const MAX_ROUNDS = ROUND_OPTIONS.includes(storedRounds) ? storedRounds : 10;
  const ROUND_TIME = 120;
  const ALLOWED_CATEGORIES = [
    'name', 'country', 'animal', 'fruit', 'color', 'object', 'city', 'food',
    'movie', 'anime', 'football', 'novela', 'series', 'sport', 'brand',
    'profession', 'videogame', 'singer', 'musicstyle'
  ];

  const PORTUGUESE_DICTIONARIES = {
    country: [
      'Afeganistão', 'África do Sul', 'Albânia', 'Alemanha', 'Andorra', 'Angola', 'Antígua e Barbuda',
      'Arábia Saudita', 'Argélia', 'Argentina', 'Armênia', 'Austrália', 'Áustria', 'Azerbaijão',
      'Bahamas', 'Bangladesh', 'Barbados', 'Bahrein', 'Bélgica', 'Belize', 'Benin', 'Bielorrússia',
      'Bolívia', 'Bósnia e Herzegovina', 'Botsuana', 'Brasil', 'Brunei', 'Bulgária', 'Burquina Faso',
      'Burundi', 'Butão', 'Cabo Verde', 'Camarões', 'Camboja', 'Canadá', 'Catar', 'Cazaquistão',
      'Chade', 'Chile', 'China', 'Chipre', 'Colômbia', 'Comores', 'Congo-Brazzaville', 'Congo-Kinshasa',
      'Coreia do Norte', 'Coreia do Sul', 'Costa do Marfim', 'Costa Rica', 'Croácia', 'Cuba',
      'Dinamarca', 'Djibuti', 'Dominica', 'Egito', 'El Salvador', 'Emirados Árabes Unidos',
      'Equador', 'Eritreia', 'Eslováquia', 'Eslovênia', 'Espanha', 'Estados Unidos', 'Estônia',
      'Eswatini', 'Etiópia', 'Fiji', 'Filipinas', 'Finlândia', 'França', 'Gabão', 'Gâmbia', 'Gana',
      'Geórgia', 'Granada', 'Grécia', 'Guatemala', 'Guiana', 'Guiné', 'Guiné-Bissau', 'Guiné Equatorial',
      'Haiti', 'Holanda', 'Honduras', 'Hungria', 'Iémen', 'Ilhas Marshall', 'Ilhas Salomão',
      'Índia', 'Indonésia', 'Irã', 'Iraque', 'Irlanda', 'Islândia', 'Israel', 'Itália', 'Jamaica',
      'Japão', 'Jordânia', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letônia', 'Líbano', 'Libéria',
      'Líbia', 'Liechtenstein', 'Lituânia', 'Luxemburgo', 'Macedônia do Norte', 'Madagáscar',
      'Malásia', 'Malawi', 'Maldivas', 'Mali', 'Malta', 'Marrocos', 'Maurícia', 'Mauritânia',
      'México', 'Mianmar', 'Micronésia', 'Moçambique', 'Moldávia', 'Mônaco', 'Mongólia', 'Montenegro',
      'Namíbia', 'Nauru', 'Nepal', 'Nicarágua', 'Níger', 'Nigéria', 'Noruega', 'Nova Zelândia',
      'Omã', 'País de Gales', 'Países Baixos', 'Palau', 'Palestina', 'Panamá', 'Papua-Nova Guiné',
      'Paquistão', 'Paraguai', 'Peru', 'Polônia', 'Portugal', 'Quênia', 'Quirguistão', 'Reino Unido',
      'República Centro-Africana', 'República Checa', 'República Dominicana', 'Romênia', 'Ruanda',
      'Rússia', 'Saara Ocidental', 'Samoa', 'Santa Lúcia', 'São Cristóvão e Neves', 'São Marino',
      'São Tomé e Príncipe', 'São Vicente e Granadinas', 'Seicheles', 'Senegal', 'Serra Leoa',
      'Sérvia', 'Singapura', 'Síria', 'Somália', 'Sri Lanka', 'Sudão', 'Sudão do Sul', 'Suécia',
      'Suíça', 'Suriname', 'Tailândia', 'Taiwan', 'Tajiquistão', 'Tanzânia', 'Timor-Leste', 'Togo',
      'Tonga', 'Trindade e Tobago', 'Tunísia', 'Turcomenistão', 'Turquia', 'Tuvalu', 'Ucrânia',
      'Uganda', 'Uruguai', 'Uzbequistão', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnã', 'Zâmbia', 'Zimbábue'
    ],
    animal: [
      'Aardvark', 'Abelha', 'Águia', 'Alce', 'Andorinha', 'Antílope', 'Arara', 'Aranha', 'Asno',
      'Avestruz', 'Babuíno', 'Baleia', 'Barata', 'Beija-flor', 'Bisão', 'Borboleta', 'Búfalo',
      'Cabra', 'Cachorro', 'Cão', 'Camaleão', 'Camelo', 'Canário', 'Capivara', 'Caranguejo', 'Carneiro',
      'Cascavel', 'Castor', 'Cavalo', 'Cegonha', 'Centopeia', 'Chimpanzé', 'Coala', 'Cobra',
      'Coelho', 'Coruja', 'Crocodilo', 'Doninha', 'Elefante', 'Esquilo', 'Foca', 'Formiga',
      'Furão', 'Gaivota', 'Galinha', 'Ganso', 'Gato', 'Gavião', 'Girafa', 'Golfinho', 'Gorila',
      'Grilo', 'Hipopótamo', 'Hiena', 'Iguana', 'Jacaré', 'Jaguar', 'Joaninha', 'Kanguru',
      'Lagarta', 'Lagarto', 'Lagosta', 'Leão', 'Leopardo', 'Libélula', 'Lince', 'Lobo',
      'Lontra', 'Macaco', 'Mariposa', 'Morcego', 'Mosquito', 'Ovelha', 'Panda', 'Pantera',
      'Papagaio', 'Pato', 'Pavão', 'Peixe', 'Pinguim', 'Pomba', 'Porco', 'Puma',
      'Raposa', 'Rato', 'Rinoceronte', 'Salamandra', 'Sapo', 'Serpente', 'Tartaruga', 'Tatu',
      'Tigre', 'Touro', 'Tubarão', 'Urso', 'Vaca', 'Veado', 'Vespa', 'Zebra'
    ],
    fruit: [
      'Maçã', 'Banana', 'Laranja', 'Uva', 'Manga', 'Abacaxi', 'Melancia', 'Melão', 'Morango', 'Pêssego',
      'Pera', 'Kiwi', 'Limão', 'Coco', 'Cereja', 'Amora', 'Framboesa', 'Ameixa', 'Graviola', 'Maracujá',
      'Carambola', 'Goiaba', 'Acerola', 'Tangerina', 'Figo', 'Romã', 'Abacate', 'Pitaya', 'Jabuticaba', 'Cajá',
      'Caju', 'Mangostão', 'Lichia', 'Nêspera', 'Sapoti', 'Cambuci', 'Cupuaçu', 'Buriti', 'Bacaba', 'Jenipapo',
      'Tamarindo', 'Araçá', 'Mirtilo', 'Physalis', 'Uva-passa', 'Nabiça', 'Pitaia', 'Longan', 'Noni', 'Jaca'
    ],
    color: [
      'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Laranja', 'Roxo', 'Rosa', 'Preto', 'Branco', 'Cinza',
      'Marrom', 'Bege', 'Turquesa', 'Ciano', 'Magenta', 'Vinho', 'Dourado', 'Prateado', 'Anil', 'Ametista',
      'Azeitona', 'Salmão', 'Caramelo', 'Lavanda', 'Coral', 'Púrpura', 'Mostarda', 'Caqui', 'Ferrugem', 'Lilás',
      'Petrolina', 'Creme', 'Fúcsia', 'Marfim', 'Bronze', 'Chocolate', 'Esmeralda', 'Safira', 'Topázio', 'Oliva',
      'Cinza-chumbo', 'Cinza-prata', 'Cinza-azulado', 'Azul-marinho', 'Azul-bebê', 'Verde-musgo',
      'Verde-limão', 'Amarelo-canário', 'Branco-neve', 'Rosa-choque'
    ],
    object: [
      'Abajur', 'Agenda', 'Apontador', 'Balança', 'Batedeira', 'Caderno', 'Calculadora', 'Caneta', 'Celular',
      'Computador', 'Escova', 'Estojo', 'Garfo', 'Lápis', 'Livro', 'Mochila', 'Panela', 'Régua', 'Tesoura',
      'Ventilador', 'Mesa', 'Cadeira', 'Sofá', 'Cama', 'Armário', 'Porta', 'Janela', 'Espelho', 'Relógio',
      'Televisão', 'Tablet', 'Teclado', 'Mouse', 'Lâmpada', 'Borracha', 'Garrafa', 'Copo', 'Prato', 'Talher',
      'Fogão', 'Geladeira', 'Micro-ondas', 'Ar-condicionado', 'Chave', 'Fechadura', 'Sabonete', 'Toalha',
      'Roupa', 'Sapato', 'Tênis', 'Óculos', 'Boné', 'Chapéu', 'Bolsa', 'Carteira', 'Colher', 'Colchão',
      'Travesseiro', 'Cobertor', 'Mala', 'Maleta', 'Valise', 'Sacola', 'Baú', 'Caixa', 'Cesto', 'Balde',
      'Bacia', 'Bandeja', 'Jarra', 'Bule', 'Chaleira', 'Frigideira', 'Caçarola', 'Faca', 'Espátula',
      'Abridor', 'Saca-rolhas', 'Ralador', 'Peneira', 'Funil', 'Torradeira', 'Forno', 'Aspirador', 'Vassoura',
      'Esfregona', 'Rodo', 'Esponja', 'Sabão', 'Detergente', 'Pente', 'Secador de cabelo', 'Tapete', 'Cortina',
      'Lençol', 'Almofada', 'Manta', 'Edredão', 'Guarda-roupa', 'Cómoda', 'Escrivaninha', 'Poltrona', 'Estante',
      'Prateleira', 'Gaveta', 'Maçaneta', 'Campainha', 'Lustre', 'Lanterna', 'Vela', 'Fósforo', 'Isqueiro',
      'Despertador', 'Calendário', 'Dicionário', 'Revista', 'Jornal', 'Papel', 'Envelope', 'Carta', 'Selo',
      'Apontador', 'Cola', 'Fita-cola', 'Grampeador', 'Clipe', 'Portátil', 'Monitor', 'Impressora', 'Telefone',
      'Telemóvel', 'Smartphone', 'Altifalante', 'Auscultadores', 'Microfone', 'Câmara', 'Consola', 'Comando',
      'Carregador', 'Cabo', 'Tomada', 'Extensão', 'Pilha', 'Bateria', 'Martelo', 'Chave de fendas', 'Alicate',
      'Serrote', 'Serra', 'Berbequim', 'Parafuso', 'Prego', 'Escada', 'Pincel', 'Tinta', 'Máscara', 'Luvas',
      'Capacete', 'Óculos de sol', 'Cachecol', 'Cinto', 'Gravata', 'Camisa', 'Casaco', 'Calças', 'Saia',
      'Vestido', 'Meias', 'Sapatos', 'Botas', 'Chinelos', 'Sandálias', 'Pulseira', 'Anel', 'Brinco', 'Colar',
      'Passaporte', 'Bilhete', 'Mapa', 'Bússola', 'Binóculos', 'Telescópio', 'Lupa', 'Guarda-chuva',
      'Guarda-sol', 'Lancheira', 'Bicicleta', 'Trotinete', 'Skate', 'Patins', 'Bola', 'Raquete', 'Rede',
      'Apito', 'Troféu', 'Medalha', 'Guitarra', 'Violão', 'Violino', 'Piano', 'Flauta', 'Tambor', 'Xilofone',
      'Gaita', 'Baralho', 'Dado', 'Puzzle', 'Boneca', 'Brinquedo', 'Berço', 'Chupeta', 'Biberão', 'Fralda',
      'Tenda', 'Marmita', 'Termo', 'Nécessaire', 'Agulha', 'Dedal', 'Botão', 'Zíper', 'Elástico', 'Cordão',
      'Fita', 'Laço', 'Alfinete', 'Cadeado', 'Cafeteira', 'Chuveiro', 'Cofre', 'Extintor', 'Filtro', 'Fivela',
      'Halteres', 'Imã', 'Lixeira', 'Lousa', 'Moeda', 'Mola', 'Mota', 'Notebook', 'Perfume', 'Projetor',
      'Quadro', 'Rádio', 'Remo', 'Robô', 'Roda', 'Saco', 'Sapateira', 'Sirene', 'Tampa', 'Torre', 'Trave',
      'Tubo', 'Urna', 'Veículo', 'Vidro'
    ],
    city: [
      'Nova Iorque', 'Ndalatando', 'Londres', 'Paris', 'Tóquio', 'Pequim', 'Xangai', 'Moscovo', 'Dubai',
      'Los Angeles', 'Rio de Janeiro', 'São Paulo', 'Buenos Aires', 'Cidade do México', 'Lisboa', 'Luanda',
      'Maputo', 'Nairobi', 'Cairo', 'Istambul', 'Roma', 'Berlim', 'Madrid', 'Toronto', 'Vancouver', 'Sydney',
      'Melbourne', 'Bangkok', 'Seul', 'Hong Kong', 'Singapura', 'Amsterdã', 'Bruxelas', 'Dublin',
      'Copenhaga', 'Estocolmo', 'Helsínquia', 'Varsóvia', 'Praga', 'Budapeste', 'Atenas', 'Lima', 'Santiago',
      'Caracas', 'Kuala Lumpur', 'Hanói', 'Nova Deli', 'Mumbai', 'Kampala', 'Dar es Salaam', 'Addis Ababa'
    ],
    movie: [
      'O Poderoso Chefão', 'Titanic', 'Forrest Gump', 'Pulp Fiction', 'A Origem',
      'Gladiador', 'Matrix', 'Clube da Luta', 'Interestelar', 'Senhor dos Anéis: A Sociedade do Anel',
      'Senhor dos Anéis: As Duas Torres', 'Senhor dos Anéis: O Retorno do Rei', 'Harry Potter e a Pedra Filosofal',
      'Harry Potter e o Prisioneiro de Azkaban', 'Harry Potter e as Relíquias da Morte', 'Star Wars: Uma Nova Esperança',
      'Star Wars: O Império Contra-Ataca', 'Star Wars: O Retorno de Jedi', 'O Cavaleiro das Trevas',
      'Batman Begins', 'Vingadores: Guerra Infinita', 'Vingadores: Ultimato', 'Homem de Ferro',
      'Capitão América: O Soldado Invernal', 'Pantera Negra', 'Doutor Estranho', 'Homem-Aranha: Sem Volta para Casa',
      'Homem-Aranha: De Volta ao Lar', 'O Rei Leão', 'Frozen', 'Toy Story', 'Toy Story 3', 'Procurando Nemo',
      'Os Incríveis', 'Up: Altas Aventuras', 'Divertida Mente', 'Shrek', 'Kung Fu Panda', 'Madagascar',
      'Megamente', 'Minions', 'Meu Malvado Favorito', 'Coraline', 'Wall-E', 'Ratatouille', 'Soul', 'Luca',
      'Encanto', 'Elementos', 'Barbie (2023)', 'Oppenheimer', 'Tudo em Todo Lugar ao Mesmo Tempo',
      'Parasita', 'Oldboy', 'Memórias de uma Gueixa', 'O Castelo Animado', 'A Viagem de Chihiro'
    ]
  };

  const PORTUGUESE_NAMES = [
    'Ana', 'André', 'António', 'Alice', 'Alberto', 'Amanda', 'Arthur', 'Aline', 'Alex', 'Adriana',
    'Beatriz', 'Bruno', 'Bárbara', 'Bernardo', 'Benedita', 'Beto', 'Carlos', 'Carla', 'Cristina', 'Caio',
    'Cláudia', 'Daniel', 'Diana', 'Diogo', 'Duarte', 'Débora', 'Eduardo', 'Elisa', 'Eva', 'Emanuel',
    'Fábio', 'Filipa', 'Fernanda', 'Francisco', 'Filipe', 'Gabriel', 'Gabriela', 'Gonçalo', 'Gustavo',
    'Helena', 'Hugo', 'Henrique', 'Inês', 'Igor', 'Isabel', 'João', 'Joana', 'Jorge', 'Júlia', 'Joaquim',
    'Karina', 'Kevin', 'Laura', 'Lucas', 'Luísa', 'Leonardo', 'Manuel', 'Maria', 'Marta', 'Miguel',
    'Matilde', 'Nuno', 'Natália', 'Nelson', 'Olga', 'Oscar', 'Paulo', 'Patrícia', 'Pedro', 'Quim', 'Rita',
    'Rafael', 'Raquel', 'Ricardo', 'Sofia', 'Sérgio', 'Sara', 'Tiago', 'Teresa', 'Tomás', 'Úrsula',
    'Vasco', 'Vera', 'Vicente', 'Xavier', 'Zeca', 'Zara'
  ];

  const localizedWords = window.STOP_WORDS || {
    categories: PORTUGUESE_DICTIONARIES,
    names: PORTUGUESE_NAMES
  };
  const dictionaries = localizedWords.categories || PORTUGUESE_DICTIONARIES;
  const nameDictionary = localizedWords.names || PORTUGUESE_NAMES;

  function tr(key, params) {
    return window.I18N ? window.I18N.t(key, params) : key;
  }

  if ((localStorage.getItem('gameMode') || 'computer') === 'online') {
    window.STOP_WORDS = { categories: dictionaries, names: nameDictionary };
    return;
  }

  const currentLetterDisplay = document.getElementById('current-letter');
  const timerDisplay = document.getElementById('timer');
  const timerBox = document.getElementById('timer-box');
  const timerFill = document.getElementById('timer-fill');
  const roundPill = document.getElementById('round-pill');
  const turnHint = document.getElementById('turn-hint');
  const categoriesHeader = document.getElementById('categories-header');
  const categoryInputs = document.getElementById('category-inputs');
  const scoresContainer = document.getElementById('scores-container');
  const surrenderBtn = document.getElementById('surrender-btn');
  const submitBtn = document.getElementById('submit-answers');
  const liveProgress = document.getElementById('live-progress');
  const liveProgressText = document.getElementById('live-progress-text');
  const surrenderModal = document.getElementById('surrender-modal');
  const surrenderMessage = document.getElementById('surrender-message');
  const surrenderConfirmBtn = document.getElementById('surrender-confirm');
  const surrenderCancelBtn = document.getElementById('surrender-cancel');

  let selectedCategories = ['name', 'country'];
  let currentLetter = '';
  let timer = ROUND_TIME;
  let timerInterval = null;
  const difficulty = ['easy', 'normal', 'hard'].includes(localStorage.getItem('computerDifficulty'))
    ? localStorage.getItem('computerDifficulty')
    : 'normal';
  let players = [];
  let currentPlayerIndex = 0;
  let usedLetters = [];
  let computerAnswers = {};
  let gameActive = false;
  let currentRound = 0;
  let answerLocked = false;
  let stopPenalty = 0;
  let gameRecorded = false;
  let typingTimer = null;

  initGame();

  function initGame() {
    const savedCategories = loadSelectedCategories();
    if (savedCategories.length >= 2) {
      selectedCategories = savedCategories;
    }

    players = [
      { name: tr('common.you'), score: 0, answers: {} },
      { name: tr('game.computer'), score: 0, answers: {}, isComputer: true }
    ];

    setupCategories();
    setupInputs();
    startGame();
  }

  function loadSelectedCategories() {
    try {
      const stored = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
      if (!Array.isArray(stored)) return [];
      const valid = stored.filter((category) => ALLOWED_CATEGORIES.includes(category));
      return Array.from(new Set(['name', 'country', ...valid]));
    } catch (error) {
      return [];
    }
  }

  function setupCategories() {
    categoriesHeader.innerHTML = '';
    selectedCategories.forEach((category) => {
      const label = document.createElement('div');
      label.textContent = getCategoryName(category);
      categoriesHeader.appendChild(label);
    });
  }

  function setupInputs() {
    categoryInputs.innerHTML = '';

    selectedCategories.forEach((category) => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'answer-' + category;
      input.dataset.category = category;
      input.maxLength = 40;
      input.autocomplete = 'off';
      input.autocorrect = 'off';
      input.autocapitalize = 'none';
      input.spellcheck = false;
      input.setAttribute('aria-autocomplete', 'none');
      input.setAttribute('data-lpignore', 'true');
      input.setAttribute('data-1p-ignore', 'true');
      input.setAttribute('aria-label', getCategoryName(category));
      input.setAttribute('inputmode', 'text');
      input.setAttribute('enterkeyhint', 'done');

      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitAnswers(false);
        }
      });

      input.addEventListener('input', function () {
        input.classList.remove('valid', 'invalid');
        updateProgress();

        if (gameActive) {
          pingTypingSound();
        }
      });

      input.addEventListener('blur', stopTypingSound);

      categoryInputs.appendChild(input);
    });
  }

  function getCategoryName(category) {
    if (window.I18N) return window.I18N.categoryName(category);
    const names = {
      name: 'Nome',
      country: 'País',
      animal: 'Animal',
      fruit: 'Fruta',
      color: 'Cor',
      object: 'Objeto',
      city: 'Cidade',
      food: 'Comida',
      movie: 'Filme',
      anime: 'Anime',
      football: 'Equipa de futebol',
      novela: 'Novela',
      series: 'Série',
      sport: 'Desporto',
      brand: 'Marca',
      profession: 'Profissão',
      videogame: 'Videojogo',
      singer: 'Cantor',
      musicstyle: 'Estilo musical'
    };
    return names[category] || category;
  }

  function playSound(name) {
    if (window.SoundManager) {
      window.SoundManager.play(name);
    }
  }

  function pingTypingSound() {
    if (!gameActive) return;
    if (window.SoundManager) window.SoundManager.startLoop('typing');
    clearTimeout(typingTimer);
    typingTimer = window.setTimeout(stopTypingSound, 700);
  }

  function stopTypingSound() {
    clearTimeout(typingTimer);
    typingTimer = null;
    if (window.SoundManager) window.SoundManager.stopLoop('typing');
  }

  function normalize(text) {
    if (window.KwehaText && typeof window.KwehaText.normalize === 'function') {
      return window.KwehaText.normalize(text);
    }

    return String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function startsWithLetter(text) {
    return normalize(text).startsWith(normalize(currentLetter));
  }

  function sameAnswer(category, a, b) {
    const helper = window.KwehaText;
    if (helper && typeof helper.matchesEntry === 'function') {
      return (
        helper.matchesEntry(category, a, b) ||
        helper.matchesEntry(category, b, a)
      );
    }

    return normalize(a) === normalize(b);
  }

  function startGame() {
    gameActive = true;
    currentRound = 0;
    currentPlayerIndex = 0;
    usedLetters = [];

    if (liveProgress) liveProgress.classList.remove('hidden');
    playSound('start');
    updateScoreboard();
    startRound();
  }

  function updateProgress() {
    if (!liveProgressText) return;

    const inputs = categoryInputs.querySelectorAll('input');
    let filled = 0;

    inputs.forEach(function (input) {
      if (input.value.trim().length > 0) filled += 1;
    });

    liveProgressText.textContent = tr('game.progressMine', {
      filled: filled,
      total: selectedCategories.length
    });
  }

  function startRound() {
    if (!gameActive) return;

    answerLocked = false;
    submitBtn.disabled = false;
    currentRound += 1;
    stopPenalty = 0;

    if (currentRound > MAX_ROUNDS) {
      endGame();
      return;
    }

    currentPlayerIndex = 0;
    players.forEach((player) => {
      player.answers = {};
    });

    resetInputs();
    pickLetter();
    generateComputerAnswers();
    updateRoundPill();
    updateScoreboard();
    startTurn();
  }

  function pickLetter() {
    const letters = 'ABCDEFGHIJLMNOPQRSTUVXZ';

    if (usedLetters.length >= letters.length) {
      usedLetters = [];
    }

    let randomLetter;

    do {
      randomLetter = letters[Math.floor(Math.random() * letters.length)];
    } while (usedLetters.includes(randomLetter));

    usedLetters.push(randomLetter);
    currentLetter = randomLetter;
    currentLetterDisplay.textContent = currentLetter;

    currentLetterDisplay.classList.remove('is-dealing');
    void currentLetterDisplay.offsetWidth;
    currentLetterDisplay.classList.add('is-dealing');
  }

  function startTurn() {
    answerLocked = false;
    submitBtn.disabled = false;
    resetInputs();
    updateTurnHint();
    updateScoreboard();
    startTimer();

    const firstInput = categoryInputs.querySelector('input');
    if (firstInput) {
      window.setTimeout(function () {
        firstInput.focus();
      }, 120);
    }
  }

  function resetInputs() {
    stopTypingSound();
    const inputs = categoryInputs.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = '';
      input.disabled = false;
      input.classList.remove('valid', 'invalid');
    });
    updateProgress();
  }

  function updateRoundPill() {
    if (roundPill) {
      roundPill.textContent = tr('game.round', { round: currentRound, max: MAX_ROUNDS });
    }
  }

  function updateTurnHint() {
    if (!turnHint) return;
    turnHint.textContent = tr('game.turnHintComputer', { letter: currentLetter });
  }

  function startTimer() {
    timer = ROUND_TIME;
    clearInterval(timerInterval);
    updateTimerUI();
    resumeTimer();
  }

  function resumeTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      timer -= 1;
      updateTimerUI();

      if (timer <= 0) {
        clearInterval(timerInterval);
        timeUp();
      }
    }, 1000);
  }

  function updateTimerUI() {
    const safeTimer = Math.max(0, timer);
    timerDisplay.textContent = formatTime(safeTimer);

    if (timerFill) {
      timerFill.style.width = Math.max(0, Math.min(100, (safeTimer / ROUND_TIME) * 100)) + '%';
    }

    if (timerBox) {
      timerBox.classList.toggle('low', safeTimer <= 20);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function generateComputerAnswers() {
    computerAnswers = {};

    const profiles = {
      easy: { missChance: 0.24, minLength: 0, preferLong: false },
      normal: { missChance: 0.1, minLength: 0, preferLong: false },
      hard: { missChance: 0.02, minLength: 5, preferLong: true }
    };
    const profile = profiles[difficulty] || profiles.normal;

    selectedCategories.forEach((category) => {
      const words =
        category === 'name'
          ? nameDictionary
          : dictionaries[category] || [];

      let validWords = words.filter((word) => startsWithLetter(word));

      if (profile.preferLong) {
        const longer = validWords.filter((word) => normalize(word).length >= profile.minLength);
        if (longer.length > 0) validWords = longer;
      }

      const missesThisOne = Math.random() < profile.missChance;

      computerAnswers[category] =
        validWords.length > 0 && !missesThisOne
          ? validWords[Math.floor(Math.random() * validWords.length)]
          : 'N/A';
    });
  }

  function pickSuggestion(category) {
    const list = category === 'name' ? nameDictionary : dictionaries[category] || [];

    for (let i = 0; i < list.length; i += 1) {
      if (startsWithLetter(list[i])) return list[i];
    }

    return '';
  }

  function timeUp() {
    if (!gameActive) return;
    submitAnswers(true);
  }

  function submitAnswers(autoSubmit) {
    if (!gameActive || answerLocked) return;

    answerLocked = true;
    submitBtn.disabled = true;
    clearInterval(timerInterval);

    const inputs = categoryInputs.querySelectorAll('input');
    const playerAnswers = {};

    inputs.forEach((input) => {
      playerAnswers[input.dataset.category] = input.value.trim();
    });

    const requiredValid = ['name', 'country'].every(function (category) {
      return isAnswerValid(category, playerAnswers[category]);
    });

    if (!requiredValid && !autoSubmit) {
      const proceed = confirm(tr('game.requiredMissing'));

      if (!proceed) {
        answerLocked = false;
        submitBtn.disabled = false;
        resumeTimer();
        return;
      }

      if (stopPenalty === 0) {
        stopPenalty = 5;
        players[0].score -= 5;
      }
    }

    stopTypingSound();

    if (!autoSubmit) {
      playSound('stop');
    }

    const validAnswers = {};

    selectedCategories.forEach((category) => {
      const answer = playerAnswers[category] || '';
      validAnswers[category] = isAnswerValid(category, answer);
    });

    inputs.forEach((input) => {
      const category = input.dataset.category;
      input.disabled = true;
      input.classList.toggle('valid', Boolean(validAnswers[category]));
      input.classList.toggle('invalid', !validAnswers[category] && input.value.trim().length > 0);
    });

    calculateScoresVsComputer(playerAnswers, validAnswers);
    updateScoreboard();
  }

  function isAnswerValid(category, answer) {
    if (!answer || !startsWithLetter(answer)) return false;
    if (category === 'name') return normalize(answer).length >= 1;
    return normalize(answer).length >= 2;
  }

  function calculateScoresVsComputer(playerAnswers, validAnswers) {
    let playerPoints = 0;
    let computerPoints = 0;

    selectedCategories.forEach((category) => {
      const playerAnswer = playerAnswers[category] || '';
      const computerAnswer = computerAnswers[category];
      const computerHasAnswer = Boolean(computerAnswer && computerAnswer !== 'N/A');

      if (!validAnswers[category]) {
        if (computerHasAnswer) computerPoints += 20;
        return;
      }

      if (!computerHasAnswer) {
        playerPoints += 20;
        return;
      }

      if (sameAnswer(category, playerAnswer, computerAnswer)) {
        playerPoints += 5;
        computerPoints += 5;
      } else {
        playerPoints += 10;
        computerPoints += 10;
      }
    });

    players[0].score += playerPoints;
    players[1].score += computerPoints;

    const rows = selectedCategories.map((category) => ({
      label: getCategoryName(category),
      value: computerAnswers[category] || 'N/A'
    }));

    if (stopPenalty > 0) {
      rows.unshift({
        label: tr('game.penaltyRow'),
        value: '-' + stopPenalty + ' pts'
      });
    }

    const totalPlayer = players[0].score;
    const totalComputer = players[1].score;
    const finalRound = currentRound >= MAX_ROUNDS;

    const details = selectedCategories.map((category) => {
      const playerAnswer = (playerAnswers[category] || '').trim();

      return {
        label: getCategoryName(category),
        playerAnswer: playerAnswer,
        suggestion: pickSuggestion(category),
        valid: Boolean(validAnswers[category]),
        hasAnswer: playerAnswer.length > 0
      };
    });

    showModal({
      title: tr('game.roundEndTitle', { round: currentRound }),
      subtitle: tr('game.roundEndSubtitle', {
        points: playerPoints,
        player: totalPlayer,
        computer: totalComputer
      }),
      rows: rows,
      details: details,
      buttonText: tr(finalRound ? 'game.seeResult' : 'game.nextRound'),
      onClose: finalRound ? endGame : startRound
    });
  }

  function updateScoreboard() {
    scoresContainer.innerHTML = '';

    players.forEach((player, index) => {
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player-score';

      if (index === currentPlayerIndex) {
        playerDiv.classList.add('current');
      }

      const nameSpan = document.createElement('span');
      nameSpan.textContent = player.name;

      const scoreSpan = document.createElement('span');
      scoreSpan.textContent = player.score;

      playerDiv.appendChild(nameSpan);
      playerDiv.appendChild(scoreSpan);
      scoresContainer.appendChild(playerDiv);
    });
  }

  function showModal(options) {
    const overlay = document.createElement('div');
    overlay.className = 'game-modal';

    const card = document.createElement('div');
    card.className = 'game-modal-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');

    const title = document.createElement('h2');
    title.className = 'game-modal-title';
    title.textContent = options.title || '';

    const subtitle = document.createElement('p');
    subtitle.className = 'game-modal-subtitle';
    subtitle.textContent = options.subtitle || '';

    const body = document.createElement('div');
    body.className = 'game-modal-body';

    (options.rows || []).forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'game-modal-row';

      const label = document.createElement('span');
      label.textContent = row.label;

      const value = document.createElement('strong');
      value.textContent = row.value;

      rowEl.appendChild(label);
      rowEl.appendChild(value);
      body.appendChild(rowEl);
    });

    const detailList = Array.isArray(options.details) ? options.details : [];
    let detailsBody = null;

    if (detailList.length > 0) {
      detailsBody = document.createElement('div');
      detailsBody.className = 'game-details hidden';

      const detailsTitle = document.createElement('p');
      detailsTitle.className = 'game-details-title';
      detailsTitle.textContent = tr('game.detailsTitle');
      detailsBody.appendChild(detailsTitle);

      detailList.forEach((detail) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'game-detail-row';

        if (detail.valid) {
          rowEl.classList.add('is-correct');
        } else if (detail.hasAnswer) {
          rowEl.classList.add('is-wrong');
        } else {
          rowEl.classList.add('is-empty');
        }

        const top = document.createElement('div');
        top.className = 'game-detail-top';

        const categoryLabel = document.createElement('span');
        categoryLabel.className = 'game-detail-cat';
        categoryLabel.textContent = detail.label;

        const badge = document.createElement('span');
        badge.className = 'game-detail-badge';
        badge.textContent = detail.valid
          ? tr('game.correct')
          : detail.hasAnswer
            ? tr('game.wrong')
            : tr('game.noAnswer');

        top.appendChild(categoryLabel);
        top.appendChild(badge);
        rowEl.appendChild(top);

        const mineLine = document.createElement('div');
        mineLine.className = 'game-detail-line';

        const mineLabel = document.createElement('span');
        mineLabel.textContent = tr('game.yourAnswer');

        const mineValue = document.createElement('strong');
        mineValue.textContent = detail.hasAnswer ? detail.playerAnswer : '—';

        mineLine.appendChild(mineLabel);
        mineLine.appendChild(mineValue);
        rowEl.appendChild(mineLine);

        const correctLine = document.createElement('div');
        correctLine.className = 'game-detail-line';

        const correctLabel = document.createElement('span');
        correctLabel.textContent = tr('game.correctAnswer');

        const correctValue = document.createElement('strong');
        correctValue.textContent = detail.suggestion || '—';

        correctLine.appendChild(correctLabel);
        correctLine.appendChild(correctValue);
        rowEl.appendChild(correctLine);

        detailsBody.appendChild(rowEl);
      });
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary';
    button.textContent = options.buttonText || tr('common.continue');

    card.appendChild(title);
    card.appendChild(subtitle);

    if ((options.rows || []).length > 0) {
      card.appendChild(body);
    }

    if (detailsBody) {
      card.appendChild(detailsBody);
    }

    const revealButton = detailsBody
      ? document.createElement('button')
      : null;

    if (revealButton) {
      revealButton.type = 'button';
      revealButton.className = 'btn btn-ghost';
      revealButton.textContent = tr('game.revealAnswers');
      revealButton.setAttribute('aria-expanded', 'false');
      revealButton.addEventListener('click', function () {
        const showing = detailsBody.classList.contains('hidden');
        detailsBody.classList.toggle('hidden', !showing);

        if ((options.rows || []).length > 0) {
          body.classList.toggle('hidden', showing);
        }

        revealButton.textContent = showing
          ? tr('game.hideAnswers')
          : tr('game.revealAnswers');
        revealButton.setAttribute('aria-expanded', String(showing));
      });

      const actions = document.createElement('div');
      actions.className = 'game-modal-actions';
      actions.appendChild(revealButton);
      actions.appendChild(button);
      card.appendChild(actions);
    } else {
      card.appendChild(button);
    }

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    let closed = false;

    const close = function () {
      if (closed) return;
      closed = true;

      overlay.remove();
      document.removeEventListener('keydown', onKeydown);

      if (typeof options.onClose === 'function') {
        options.onClose();
      }
    };

    const onKeydown = function (event) {
      if (event.key === 'Escape' || event.key === 'Enter') {
        event.preventDefault();
        close();
      }
    };

    button.addEventListener('click', close);
    document.addEventListener('keydown', onKeydown);

    window.setTimeout(function () {
      button.focus();
    }, 50);
  }

  function askSurrender(messageKey) {
    if (!surrenderModal || !surrenderConfirmBtn || !surrenderCancelBtn) {
      return Promise.resolve(window.confirm(tr(messageKey)));
    }

    surrenderMessage.textContent = tr(messageKey);
    surrenderModal.classList.remove('hidden');

    return new Promise(function (resolve) {
      let settled = false;

      function finish(value) {
        if (settled) return;
        settled = true;
        surrenderModal.classList.add('hidden');
        surrenderConfirmBtn.removeEventListener('click', onConfirm);
        surrenderCancelBtn.removeEventListener('click', onCancel);
        surrenderModal.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKeydown);
        resolve(value);
      }

      function onConfirm() {
        finish(true);
      }

      function onCancel() {
        finish(false);
      }

      function onBackdrop(event) {
        if (event.target === surrenderModal) finish(false);
      }

      function onKeydown(event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          finish(false);
        }
      }

      surrenderConfirmBtn.addEventListener('click', onConfirm);
      surrenderCancelBtn.addEventListener('click', onCancel);
      surrenderModal.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKeydown);
      window.setTimeout(function () {
        surrenderCancelBtn.focus();
      }, 30);
    });
  }

  function endGame() {
    clearInterval(timerInterval);
    stopTypingSound();
    gameActive = false;

    localStorage.setItem('gameResults', JSON.stringify(players));

    const sorted = players.slice().sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    const isComputerWinner = Boolean(winner && winner.isComputer);

    if (!gameRecorded && window.STOP_AUTH) {
      gameRecorded = true;
      if (window.STOP_AUTH.getUser()) {
        window.STOP_AUTH.recordGame({
          score: players[0].score,
          won: !isComputerWinner
        }).catch(function () {
          /* offline ou sessão expirada: o jogo continua normalmente */
        });
      }
    }

    window.location.href = '/winner';
  }

  async function surrenderGame() {
    playSound('button');

    if (!(await askSurrender('game.surrenderConfirm'))) {
      return;
    }

    players[1].score = Math.max(players[0].score, players[1].score) + 1000;
    endGame();
  }

  submitBtn.addEventListener('click', function () {
    submitAnswers(false);
  });

  surrenderBtn.addEventListener('click', surrenderGame);
});
