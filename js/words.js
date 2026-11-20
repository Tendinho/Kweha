/* ============================================================
   Kweha — Palavras por idioma
   Usadas pelo computador e pela validação do jogo.
   ============================================================ */

(function () {
  'use strict';

  function normalizeText(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  window.KwehaText = {
    normalize: normalizeText,
    same: function (a, b) {
      return normalizeText(a) === normalizeText(b);
    },
    startsWith: function (text, letter) {
      return normalizeText(text).startsWith(normalizeText(letter));
    }
  };

  const DATA = {
    pt: {
      names: [
        'Ana', 'André', 'António', 'Alice', 'Alberto', 'Amanda', 'Arthur', 'Aline', 'Alex', 'Adriana',
        'Beatriz', 'Bruno', 'Bárbara', 'Bernardo', 'Benedita', 'Beto', 'Carlos', 'Carla', 'Cristina', 'Caio',
        'Cláudia', 'Daniel', 'Diana', 'Diogo', 'Duarte', 'Débora', 'Eduardo', 'Elisa', 'Eva', 'Emanuel',
        'Fábio', 'Filipa', 'Fernanda', 'Francisco', 'Filipe', 'Gabriel', 'Gabriela', 'Gonçalo', 'Gustavo',
        'Helena', 'Hugo', 'Henrique', 'Inês', 'Igor', 'Isabel', 'João', 'Joana', 'Jorge', 'Júlia', 'Joaquim',
        'Karina', 'Kevin', 'Laura', 'Lucas', 'Luísa', 'Leonardo', 'Manuel', 'Maria', 'Marta', 'Miguel',
        'Matilde', 'Nuno', 'Natália', 'Nelson', 'Olga', 'Oscar', 'Paulo', 'Patrícia', 'Pedro', 'Quim', 'Rita',
        'Rafael', 'Raquel', 'Ricardo', 'Sofia', 'Sérgio', 'Sara', 'Tiago', 'Teresa', 'Tomás', 'Úrsula',
        'Vasco', 'Vera', 'Vicente', 'Xavier', 'Zeca', 'Zara'
      ],
      categories: {
        country: [
          'Afeganistão', 'África do Sul', 'Albânia', 'Alemanha', 'Andorra', 'Angola', 'Antígua e Barbuda',
          'Arábia Saudita', 'Argélia', 'Argentina', 'Arménia', 'Austrália', 'Áustria', 'Azerbaijão',
          'Bahamas', 'Bangladesh', 'Barbados', 'Barém', 'Bélgica', 'Belize', 'Benim', 'Bielorrússia',
          'Bolívia', 'Bósnia e Herzegovina', 'Botsuana', 'Brasil', 'Brunei', 'Bulgária', 'Burquina Faso',
          'Burundi', 'Butão', 'Cabo Verde', 'Camarões', 'Camboja', 'Canadá', 'Catar', 'Cazaquistão',
          'Chade', 'Chile', 'China', 'Chipre', 'Colômbia', 'Comores', 'Congo-Brazzaville', 'Congo-Kinshasa',
          'Coreia do Norte', 'Coreia do Sul', 'Costa do Marfim', 'Costa Rica', 'Croácia', 'Cuba',
          'Dinamarca', 'Djibuti', 'Dominica', 'Egito', 'El Salvador', 'Emirados Árabes Unidos',
          'Equador', 'Eritreia', 'Eslováquia', 'Eslovénia', 'Espanha', 'Estados Unidos', 'Estónia',
          'Eswatini', 'Etiópia', 'Fiji', 'Filipinas', 'Finlândia', 'França', 'Gabão', 'Gâmbia', 'Gana',
          'Geórgia', 'Granada', 'Grécia', 'Guatemala', 'Guiana', 'Guiné', 'Guiné-Bissau', 'Guiné Equatorial',
          'Haiti', 'Holanda', 'Honduras', 'Hungria', 'Iémen', 'Ilhas Marshall', 'Ilhas Salomão',
          'Índia', 'Indonésia', 'Irão', 'Iraque', 'Irlanda', 'Islândia', 'Israel', 'Itália', 'Jamaica',
          'Japão', 'Jordânia', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letónia', 'Líbano', 'Libéria',
          'Líbia', 'Liechtenstein', 'Lituânia', 'Luxemburgo', 'Macedónia do Norte', 'Madagáscar',
          'Malásia', 'Malaui', 'Maldivas', 'Mali', 'Malta', 'Marrocos', 'Maurícia', 'Mauritânia',
          'México', 'Mianmar', 'Micronésia', 'Moçambique', 'Moldávia', 'Mónaco', 'Mongólia', 'Montenegro',
          'Namíbia', 'Nauru', 'Nepal', 'Nicarágua', 'Níger', 'Nigéria', 'Noruega', 'Nova Zelândia',
          'Omã', 'País de Gales', 'Países Baixos', 'Palau', 'Palestina', 'Panamá', 'Papua-Nova Guiné',
          'Paquistão', 'Paraguai', 'Peru', 'Polónia', 'Portugal', 'Quénia', 'Quirguistão', 'Reino Unido',
          'República Centro-Africana', 'República Checa', 'República Dominicana', 'Roménia', 'Ruanda',
          'Rússia', 'Saara Ocidental', 'Samoa', 'Santa Lúcia', 'São Cristóvão e Neves', 'São Marino',
          'São Tomé e Príncipe', 'São Vicente e Granadinas', 'Seicheles', 'Senegal', 'Serra Leoa',
          'Sérvia', 'Singapura', 'Síria', 'Somália', 'Sri Lanka', 'Sudão', 'Sudão do Sul', 'Suécia',
          'Suíça', 'Suriname', 'Tailândia', 'Taiwan', 'Tajiquistão', 'Tanzânia', 'Timor-Leste', 'Togo',
          'Tonga', 'Trindade e Tobago', 'Tunísia', 'Turcomenistão', 'Turquia', 'Tuvalu', 'Ucrânia',
          'Uganda', 'Uruguai', 'Uzbequistão', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietname', 'Zâmbia', 'Zimbabué'
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
          'Cinza-chumbo', 'Cinza-prata', 'Cinza-azulado', 'Azul-marinho', 'Azul-bebé', 'Verde-musgo',
          'Verde-limão', 'Amarelo-canário', 'Branco-neve', 'Rosa-choque'
        ],
        object: [
          'Abajur', 'Agenda', 'Apontador', 'Balança', 'Batedeira', 'Caderno', 'Calculadora', 'Caneta', 'Celular',
          'Computador', 'Escova', 'Estojo', 'Garfo', 'Lápis', 'Livro', 'Mochila', 'Panela', 'Régua', 'Tesoura',
          'Ventilador', 'Mesa', 'Cadeira', 'Sofá', 'Cama', 'Armário', 'Porta', 'Janela', 'Espelho', 'Relógio',
          'Televisão', 'Tablet', 'Teclado', 'Rato', 'Lâmpada', 'Borracha', 'Garrafa', 'Copo', 'Prato', 'Talher',
          'Fogão', 'Geladeira', 'Micro-ondas', 'Ar-condicionado', 'Chave', 'Fechadura', 'Sabonete', 'Toalha',
          'Roupa', 'Sapato', 'Ténis', 'Óculos', 'Boné', 'Chapéu', 'Bolsa', 'Carteira', 'Colher', 'Colchão',
          'Travesseiro', 'Cobertor'
        ],
        city: [
          'Nova Iorque', 'Ndalatando', 'Londres', 'Paris', 'Tóquio', 'Pequim', 'Xangai', 'Moscovo', 'Dubai',
          'Los Angeles', 'Rio de Janeiro', 'São Paulo', 'Buenos Aires', 'Cidade do México', 'Lisboa', 'Luanda',
          'Maputo', 'Nairobi', 'Cairo', 'Istambul', 'Roma', 'Berlim', 'Madrid', 'Toronto', 'Vancouver', 'Sydney',
          'Melbourne', 'Bangkok', 'Seul', 'Hong Kong', 'Singapura', 'Amsterdão', 'Bruxelas', 'Dublin',
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
          'Os Incríveis', 'Up: Altas Aventuras', 'Divertida Mente', 'Shrek', 'Kung Fu Panda', 'Madagáscar',
          'Megamente', 'Minions', 'Meu Malvado Favorito', 'Coraline', 'Wall-E', 'Ratatouille', 'Soul', 'Luca',
          'Encanto', 'Elementos', 'Barbie (2023)', 'Oppenheimer', 'Tudo em Todo Lugar ao Mesmo Tempo',
          'Parasita', 'Oldboy', 'Memórias de uma Gueixa', 'O Castelo Animado', 'A Viagem de Chihiro'
        ]
      }
    },
    en: {
      names: [
        'Alice', 'Andrew', 'Anna', 'Arthur', 'Ben', 'Bella', 'Bob', 'Charlie', 'Chloe', 'Daniel',
        'David', 'Diana', 'Emma', 'Ethan', 'Eva', 'Felix', 'Fiona', 'Frank', 'Gabriel', 'Grace',
        'Hannah', 'Harry', 'Henry', 'Ian', 'Isabel', 'Jack', 'James', 'Jane', 'Jason', 'Julia',
        'Kate', 'Kevin', 'Laura', 'Leo', 'Liam', 'Lily', 'Lucas', 'Lucy', 'Maria', 'Mark',
        'Mary', 'Mia', 'Michael', 'Nathan', 'Nina', 'Noah', 'Olivia', 'Oscar', 'Paul', 'Peter',
        'Rachel', 'Rita', 'Robert', 'Rose', 'Sam', 'Sarah', 'Sofia', 'Thomas', 'Tina', 'Tom',
        'Victor', 'Victoria', 'William', 'Xavier', 'Zoe'
      ],
      categories: {
        country: [
          'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
          'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
          'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
          'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Chad',
          'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
          'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
          'El Salvador', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
          'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
          'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
          'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
          'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
          'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
          'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
          'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
          'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
          'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
          'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
          'Russia', 'Rwanda', 'Saint Lucia', 'Samoa', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia',
          'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
          'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
          'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
          'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
          'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
          'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
        ],
        animal: [
          'Aardvark', 'Alpaca', 'Ant', 'Antelope', 'Ape', 'Bat', 'Bear', 'Beaver', 'Bee', 'Beetle',
          'Bird', 'Bison', 'Boar', 'Buffalo', 'Butterfly', 'Camel', 'Cat', 'Caterpillar', 'Centipede',
          'Chameleon', 'Cheetah', 'Chicken', 'Chimpanzee', 'Cobra', 'Cockroach', 'Cod', 'Cormorant',
          'Cow', 'Crab', 'Crocodile', 'Crow', 'Deer', 'Dog', 'Dolphin', 'Donkey', 'Dove', 'Dragonfly',
          'Duck', 'Eagle', 'Eel', 'Elephant', 'Elk', 'Emu', 'Falcon', 'Ferret', 'Finch', 'Fish',
          'Flamingo', 'Fly', 'Fox', 'Frog', 'Gazelle', 'Gecko', 'Gerbil', 'Giraffe', 'Goat', 'Goldfish',
          'Goose', 'Gorilla', 'Grasshopper', 'Guinea pig', 'Hamster', 'Hare', 'Hawk', 'Hedgehog', 'Hen',
          'Hippo', 'Horse', 'Hummingbird', 'Hyena', 'Iguana', 'Impala', 'Jackal', 'Jaguar', 'Jellyfish',
          'Kangaroo', 'Kingfisher', 'Koala', 'Ladybug', 'Lamb', 'Leopard', 'Lion', 'Lizard', 'Llama',
          'Lobster', 'Lynx', 'Macaw', 'Magpie', 'Mammoth', 'Manatee', 'Meerkat', 'Mink', 'Mole',
          'Mongoose', 'Monkey', 'Moose', 'Mosquito', 'Moth', 'Mouse', 'Mule', 'Narwhal', 'Newt',
          'Nightingale', 'Ocelot', 'Octopus', 'Opossum', 'Orangutan', 'Orca', 'Ostrich', 'Otter', 'Owl',
          'Ox', 'Panda', 'Panther', 'Parrot', 'Peacock', 'Pelican', 'Penguin', 'Pheasant', 'Pig',
          'Pigeon', 'Piranha', 'Platypus', 'Pony', 'Porcupine', 'Porpoise', 'Puma', 'Quail', 'Rabbit',
          'Raccoon', 'Ram', 'Rat', 'Raven', 'Reindeer', 'Rhinoceros', 'Rooster', 'Salamander', 'Salmon',
          'Scorpion', 'Seal', 'Shark', 'Sheep', 'Shrimp', 'Skunk', 'Sloth', 'Snail', 'Snake', 'Sparrow',
          'Spider', 'Squid', 'Squirrel', 'Starfish', 'Stork', 'Swan', 'Tapir', 'Termite', 'Tiger',
          'Toad', 'Tortoise', 'Toucan', 'Trout', 'Turkey', 'Turtle', 'Viper', 'Vulture', 'Walrus',
          'Wasp', 'Weasel', 'Whale', 'Wolf', 'Wolverine', 'Wombat', 'Woodpecker', 'Worm', 'Yak', 'Zebra'
        ],
        fruit: [
          'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry', 'Cantaloupe', 'Cherry',
          'Coconut', 'Cranberry', 'Date', 'Dragon fruit', 'Elderberry', 'Fig', 'Grape', 'Grapefruit',
          'Guava', 'Honeydew', 'Jackfruit', 'Kiwi', 'Lemon', 'Lime', 'Lychee', 'Mango', 'Melon',
          'Mulberry', 'Nectarine', 'Olive', 'Orange', 'Papaya', 'Peach', 'Pear', 'Persimmon', 'Pineapple',
          'Plum', 'Pomegranate', 'Quince', 'Raspberry', 'Redcurrant', 'Star fruit', 'Strawberry',
          'Tangerine', 'Watermelon'
        ],
        color: [
          'Amber', 'Aqua', 'Azure', 'Beige', 'Black', 'Blue', 'Bronze', 'Brown', 'Burgundy', 'Charcoal',
          'Coral', 'Cream', 'Crimson', 'Cyan', 'Emerald', 'Fuchsia', 'Gold', 'Gray', 'Green', 'Indigo',
          'Ivory', 'Khaki', 'Lavender', 'Lilac', 'Lime', 'Magenta', 'Maroon', 'Mint', 'Navy', 'Olive',
          'Orange', 'Peach', 'Pink', 'Purple', 'Red', 'Rose', 'Ruby', 'Salmon', 'Sapphire', 'Silver',
          'Teal', 'Turquoise', 'Violet', 'White', 'Yellow'
        ],
        object: [
          'Alarm clock', 'Anchor', 'Apron', 'Backpack', 'Ball', 'Balloon', 'Basket', 'Bed', 'Bell',
          'Belt', 'Bench', 'Bicycle', 'Blanket', 'Book', 'Bottle', 'Bowl', 'Box', 'Broom', 'Brush',
          'Bucket', 'Button', 'Cabinet', 'Camera', 'Candle', 'Carpet', 'Chair', 'Chalk', 'Clock', 'Comb',
          'Computer', 'Cup', 'Curtain', 'Desk', 'Diary', 'Door', 'Drawer', 'Dress', 'Drill', 'Drum',
          'Envelope', 'Eraser', 'Fan', 'Fork', 'Fridge', 'Glass', 'Glove', 'Guitar', 'Hammer', 'Hat',
          'Headphones', 'Helmet', 'Jacket', 'Jar', 'Key', 'Kettle', 'Keyboard', 'Knife', 'Lamp', 'Laptop',
          'Lock', 'Magnet', 'Map', 'Marker', 'Mattress', 'Microphone', 'Mirror', 'Mop', 'Mug', 'Napkin',
          'Notebook', 'Oven', 'Pan', 'Paper', 'Pen', 'Pencil', 'Phone', 'Piano', 'Pillow', 'Plate',
          'Pot', 'Purse', 'Radio', 'Ruler', 'Scarf', 'Scissors', 'Screwdriver', 'Shampoo', 'Shirt',
          'Shoe', 'Sofa', 'Spoon', 'Table', 'Television', 'Toaster', 'Towel', 'Umbrella', 'Vacuum',
          'Wallet', 'Watch', 'Window'
        ],
        city: [
          'Amsterdam', 'Athens', 'Atlanta', 'Auckland', 'Bangkok', 'Barcelona', 'Beijing', 'Berlin',
          'Bogota', 'Boston', 'Brasilia', 'Brussels', 'Budapest', 'Buenos Aires', 'Cairo', 'Cape Town',
          'Caracas', 'Chicago', 'Copenhagen', 'Dallas', 'Delhi', 'Denver', 'Dubai', 'Dublin',
          'Edinburgh', 'Frankfurt', 'Geneva', 'Havana', 'Helsinki', 'Hong Kong', 'Houston', 'Istanbul',
          'Jakarta', 'Jerusalem', 'Johannesburg', 'Kiev', 'Kuala Lumpur', 'Lagos', 'Lima', 'Lisbon',
          'London', 'Los Angeles', 'Luanda', 'Madrid', 'Manila', 'Maputo', 'Melbourne', 'Mexico City',
          'Miami', 'Milan', 'Montreal', 'Moscow', 'Mumbai', 'Munich', 'Nairobi', 'Naples', 'New York',
          'Oslo', 'Ottawa', 'Paris', 'Prague', 'Rio de Janeiro', 'Rome', 'San Francisco', 'Santiago',
          'Sao Paulo', 'Seattle', 'Seoul', 'Shanghai', 'Singapore', 'Sofia', 'Stockholm', 'Sydney',
          'Tokyo', 'Toronto', 'Vancouver', 'Venice', 'Vienna', 'Warsaw', 'Washington', 'Zurich'
        ],
        movie: [
          'Alien', 'Amadeus', 'Avatar', 'Batman Begins', 'Beauty and the Beast', 'Black Panther', 'Brave',
          'Casablanca', 'Coco', 'Coraline', 'Dune', 'Elemental', 'Encanto', 'Finding Nemo', 'Frozen',
          'Gladiator', 'Gravity', 'Inception', 'Interstellar', 'Jaws', 'Joker', 'Jurassic Park',
          'Kill Bill', 'King Kong', 'La La Land', 'Luca', 'Madagascar', 'Matrix', 'Megamind', 'Minions',
          'Moana', 'Oppenheimer', 'Parasite', 'Psycho', 'Pulp Fiction', 'Ratatouille', 'Rocky', 'Shrek',
          'Soul', 'Spider-Man', 'Star Wars', 'Titanic', 'Toy Story', 'Up', 'Wall-E', 'Wicked',
          'Wonder Woman'
        ]
      }
    },
    es: {
      names: [
        'Ana', 'Andrés', 'Antonio', 'Alicia', 'Alberto', 'Amanda', 'Arturo', 'Alba', 'Alejandro',
        'Adriana', 'Beatriz', 'Bruno', 'Bárbara', 'Bernardo', 'Benito', 'Carla', 'Carlos', 'Cristina',
        'Claudia', 'Daniel', 'Diana', 'Diego', 'Débora', 'Eduardo', 'Elena', 'Eva', 'Emilio', 'Fátima',
        'Felipe', 'Fernando', 'Francisco', 'Gabriela', 'Gabriel', 'Gonzalo', 'Gustavo', 'Hugo',
        'Helena', 'Inés', 'Igor', 'Isabel', 'Javier', 'Jesús', 'Joaquín', 'Jorge', 'José', 'Juan',
        'Julia', 'Laura', 'Lucía', 'Luis', 'Manuel', 'María', 'Marta', 'Miguel', 'Natalia', 'Nicolás',
        'Nuria', 'Olga', 'Óscar', 'Pablo', 'Patricia', 'Pedro', 'Rafael', 'Raquel', 'Ricardo', 'Rita',
        'Roberto', 'Rosa', 'Rubén', 'Sara', 'Sergio', 'Sofía', 'Teresa', 'Tomás', 'Úrsula',
        'Valentina', 'Vicente', 'Víctor', 'Xavier', 'Zoe'
      ],
      categories: {
        country: [
          'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Arabia Saudita', 'Argelia',
          'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bangladés',
          'Barbados', 'Baréin', 'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Bolivia',
          'Bosnia y Herzegovina', 'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi',
          'Bután', 'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China',
          'Chipre', 'Colombia', 'Comoras', 'Corea del Norte', 'Corea del Sur', 'Costa de Marfil',
          'Costa Rica', 'Croacia', 'Cuba', 'Dinamarca', 'Yibuti', 'Dominica', 'Ecuador', 'Egipto',
          'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España',
          'Estados Unidos', 'Estonia', 'Esuatini', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi',
          'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Grecia', 'Granada', 'Guatemala', 'Guayana',
          'Guinea', 'Guinea-Bisáu', 'Guinea Ecuatorial', 'Haití', 'Honduras', 'Hungría', 'India',
          'Indonesia', 'Irak', 'Irán', 'Irlanda', 'Islandia', 'Islas Marshall', 'Islas Salomón',
          'Israel', 'Italia', 'Jamaica', 'Japón', 'Jordania', 'Kazajistán', 'Kenia', 'Kiribati',
          'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia', 'Liechtenstein',
          'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Madagascar', 'Malasia', 'Malaui',
          'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia',
          'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Birmania', 'Namibia', 'Nauru',
          'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos',
          'Pakistán', 'Palaos', 'Palestina', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú',
          'Polonia', 'Portugal', 'Reino Unido', 'República Centroafricana', 'República Checa',
          'República Dominicana', 'Ruanda', 'Rumanía', 'Rusia', 'Samoa', 'San Marino', 'Santa Lucía',
          'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur',
          'Siria', 'Somalia', 'Sri Lanka', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza',
          'Surinam', 'Tailandia', 'Taiwán', 'Tayikistán', 'Tanzania', 'Timor Oriental', 'Togo', 'Tonga',
          'Trinidad y Tobago', 'Túnez', 'Turquía', 'Turkmenistán', 'Tuvalu', 'Ucrania', 'Uganda',
          'Uruguay', 'Uzbekistán', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia',
          'Zimbabue'
        ],
        animal: [
          'Abeja', 'Águila', 'Alce', 'Alpaca', 'Antílope', 'Araña', 'Ardilla', 'Armadillo', 'Avestruz',
          'Ballena', 'Barracuda', 'Búfalo', 'Búho', 'Burro', 'Caballo', 'Cabra', 'Caimán', 'Camaleón',
          'Camello', 'Cangrejo', 'Canguro', 'Caracol', 'Carnero', 'Castor', 'Cebra', 'Cerdo',
          'Chimpancé', 'Ciempiés', 'Cisne', 'Cocodrilo', 'Coala', 'Cobra', 'Colibrí', 'Conejo',
          'Cóndor', 'Coral', 'Cormorán', 'Cuervo', 'Delfín', 'Dinosaurio', 'Elefante', 'Erizo',
          'Escarabajo', 'Escorpión', 'Estrella de mar', 'Faisán', 'Flamenco', 'Foca', 'Gallina', 'Gallo',
          'Ganso', 'Gato', 'Gaviota', 'Gacela', 'Gecko', 'Gorila', 'Grillo', 'Guepardo', 'Halcón',
          'Hámster', 'Hipopótamo', 'Hormiga', 'Hurón', 'Iguana', 'Impala', 'Jabalí', 'Jaguar', 'Jirafa',
          'Koala', 'Lagartija', 'Lagarto', 'Langosta', 'Lechuza', 'León', 'Leopardo', 'Libélula',
          'Liebre', 'Lince', 'Lobo', 'Loro', 'Luciérnaga', 'Llama', 'Mamut', 'Mapache', 'Mariposa',
          'Mariquita', 'Medusa', 'Mejillón', 'Mirlo', 'Mono', 'Mosca', 'Mosquito', 'Murciélago',
          'Nutria', 'Oso', 'Oveja', 'Pato', 'Pavo', 'Pavo real', 'Pelícano', 'Perro', 'Periquito',
          'Pez', 'Pingüino', 'Pulpo', 'Puma', 'Rana', 'Rata', 'Ratón', 'Reno', 'Rinoceronte',
          'Salamandra', 'Salmón', 'Sapo', 'Serpiente', 'Tiburón', 'Tigre', 'Topo', 'Tortuga', 'Toro',
          'Trucha', 'Tucán', 'Vaca', 'Venado', 'Víbora', 'Zorro', 'Zarigüeya'
        ],
        fruit: [
          'Aguacate', 'Albaricoque', 'Arándano', 'Banana', 'Caqui', 'Cereza', 'Ciruela', 'Coco',
          'Dátil', 'Frambuesa', 'Fresa', 'Granada', 'Grosella', 'Guayaba', 'Higo', 'Kiwi', 'Lima',
          'Limón', 'Litchi', 'Mandarina', 'Mango', 'Manzana', 'Maracuyá', 'Melocotón', 'Melón', 'Mora',
          'Naranja', 'Nectarina', 'Papaya', 'Pera', 'Piña', 'Pitahaya', 'Plátano', 'Pomelo', 'Sandía',
          'Tamarindo', 'Toronja', 'Uva', 'Membrillo', 'Chirimoya', 'Carambola'
        ],
        color: [
          'Amarillo', 'Azul', 'Beige', 'Blanco', 'Bronce', 'Café', 'Caramelo', 'Celeste', 'Cian',
          'Coral', 'Crema', 'Dorado', 'Escarlata', 'Esmeralda', 'Fucsia', 'Gris', 'Granate', 'Índigo',
          'Lavanda', 'Lila', 'Magenta', 'Marrón', 'Mostaza', 'Negro', 'Naranja', 'Oliva', 'Plateado',
          'Púrpura', 'Rojo', 'Rosa', 'Salmón', 'Sepia', 'Turquesa', 'Verde', 'Violeta', 'Vinotinto',
          'Añil', 'Carmesí', 'Aguamarina'
        ],
        object: [
          'Abanico', 'Agenda', 'Aguja', 'Alfombra', 'Almohada', 'Anillo', 'Armario', 'Balde', 'Balón',
          'Banco', 'Barco', 'Bicicleta', 'Bolígrafo', 'Bolsa', 'Botella', 'Botón', 'Caja', 'Calcetín',
          'Cama', 'Camisa', 'Cámara', 'Cepillo', 'Cesta', 'Chaqueta', 'Cinta', 'Coche', 'Cuchara',
          'Cuchillo', 'Cuaderno', 'Cuadro', 'Cubo', 'Cortina', 'Disco', 'Ducha', 'Espejo', 'Escoba',
          'Estuche', 'Florero', 'Fregona', 'Gorra', 'Guante', 'Guitarra', 'Hacha', 'Horno', 'Impresora',
          'Jabón', 'Jarra', 'Jaula', 'Lápiz', 'Lámpara', 'Llave', 'Libro', 'Mochila', 'Mesa', 'Martillo',
          'Móvil', 'Muñeca', 'Nevera', 'Olla', 'Ordenador', 'Pantalla', 'Pañuelo', 'Papel', 'Paraguas',
          'Peine', 'Pelota', 'Percha', 'Piano', 'Plato', 'Puerta', 'Radio', 'Ratón', 'Reloj', 'Regla',
          'Silla', 'Sillón', 'Sombrero', 'Teléfono', 'Televisión', 'Tenedor', 'Tijeras', 'Toalla',
          'Taza', 'Vaso', 'Ventana', 'Zapato'
        ],
        city: [
          'Ámsterdam', 'Atenas', 'Atlanta', 'Auckland', 'Bagdad', 'Bangkok', 'Barcelona', 'Berlín',
          'Bogotá', 'Boston', 'Brasilia', 'Bruselas', 'Budapest', 'Buenos Aires', 'El Cairo', 'Caracas',
          'Chicago', 'Copenhague', 'Dallas', 'Delhi', 'Dubái', 'Dublín', 'Edimburgo', 'Estambul',
          'Estocolmo', 'Frankfurt', 'Ginebra', 'La Habana', 'Helsinki', 'Hong Kong', 'Houston',
          'Yakarta', 'Jerusalén', 'Johannesburgo', 'Kiev', 'Kuala Lumpur', 'Lagos', 'Lima', 'Lisboa',
          'Londres', 'Los Ángeles', 'Luanda', 'Madrid', 'Manila', 'Maputo', 'Melbourne',
          'Ciudad de México', 'Miami', 'Milán', 'Montreal', 'Moscú', 'Bombay', 'Múnich', 'Nairobi',
          'Nápoles', 'Nueva York', 'Oslo', 'Ottawa', 'París', 'Praga', 'Río de Janeiro', 'Roma',
          'San Francisco', 'Santiago', 'São Paulo', 'Seattle', 'Seúl', 'Shanghái', 'Singapur', 'Sofía',
          'Sídney', 'Tokio', 'Toronto', 'Vancouver', 'Venecia', 'Viena', 'Varsovia', 'Washington',
          'Zúrich'
        ],
        movie: [
          'Alien', 'Amadeus', 'Avatar', 'Batman Begins', 'La Bella y la Bestia', 'Black Panther',
          'Brave', 'Casablanca', 'Coco', 'Coraline', 'Dune', 'Elemental', 'Encanto', 'Buscando a Nemo',
          'Frozen', 'Gladiator', 'Gravity', 'Inception', 'Interstellar', 'Jaws', 'Joker',
          'Jurassic Park', 'Kill Bill', 'King Kong', 'La La Land', 'Luca', 'Madagascar', 'Matrix',
          'Megamind', 'Minions', 'Moana', 'Oppenheimer', 'Parasite', 'Psicosis', 'Pulp Fiction',
          'Ratatouille', 'Rocky', 'Shrek', 'Soul', 'Spider-Man', 'Star Wars', 'Titanic', 'Toy Story',
          'Up', 'Wall-E', 'Wicked', 'Wonder Woman'
        ]
      }
    },
    fr: {
      names: [
        'Alice', 'André', 'Antoine', 'Anne', 'Arthur', 'Béatrice', 'Benoît', 'Bernard', 'Brigitte',
        'Camille', 'Carla', 'Céline', 'Charles', 'Chloé', 'Claire', 'Daniel', 'David', 'Denis',
        'Diane', 'Dominique', 'Édouard', 'Élise', 'Emma', 'Éric', 'Eva', 'Fanny', 'Félix', 'Florence',
        'François', 'Gabriel', 'Gaëlle', 'Georges', 'Hélène', 'Henri', 'Hugo', 'Inès', 'Isabelle',
        'Jacques', 'Jean', 'Jeanne', 'Jérôme', 'Joël', 'Julie', 'Juliette', 'Laurent', 'Léa', 'Léo',
        'Louis', 'Louise', 'Luc', 'Lucie', 'Manon', 'Marcel', 'Marie', 'Mathieu', 'Michel',
        'Nathalie', 'Nicolas', 'Noémie', 'Olivier', 'Oscar', 'Pascal', 'Patricia', 'Paul', 'Philippe',
        'Pierre', 'Quentin', 'Rachel', 'Raphaël', 'René', 'Sabine', 'Sarah', 'Sophie', 'Stéphane',
        'Sylvie', 'Théo', 'Thomas', 'Valentin', 'Valérie', 'Victor', 'Vincent', 'Xavier', 'Yves', 'Zoé'
      ],
      categories: {
        country: [
          'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola',
          'Arabie saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan', 'Bahamas',
          'Bahreïn', 'Bangladesh', 'Barbade', 'Belgique', 'Belize', 'Bénin', 'Biélorussie', 'Birmanie',
          'Bolivie', 'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso',
          'Burundi', 'Bhoutan', 'Cambodge', 'Cameroun', 'Canada', 'Cap-Vert', 'Chili', 'Chine',
          'Chypre', 'Colombie', 'Comores', 'Corée du Nord', 'Corée du Sud', 'Costa Rica',
          'Côte d’Ivoire', 'Croatie', 'Cuba', 'Danemark', 'Djibouti', 'Dominique', 'Égypte',
          'El Salvador', 'Émirats arabes unis', 'Équateur', 'Érythrée', 'Espagne', 'Estonie',
          'Eswatini', 'États-Unis', 'Éthiopie', 'Fidji', 'Finlande', 'France', 'Gabon', 'Gambie',
          'Géorgie', 'Ghana', 'Grèce', 'Grenade', 'Guatemala', 'Guinée', 'Guinée-Bissau',
          'Guinée équatoriale', 'Guyana', 'Haïti', 'Honduras', 'Hongrie', 'Inde', 'Indonésie', 'Irak',
          'Iran', 'Irlande', 'Islande', 'Israël', 'Italie', 'Jamaïque', 'Japon', 'Jordanie',
          'Kazakhstan', 'Kenya', 'Kiribati', 'Koweït', 'Laos', 'Lesotho', 'Lettonie', 'Liban',
          'Liberia', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg', 'Macédoine du Nord',
          'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte', 'Maroc', 'Maurice',
          'Mauritanie', 'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro',
          'Mozambique', 'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger', 'Nigeria', 'Norvège',
          'Nouvelle-Zélande', 'Oman', 'Pakistan', 'Palaos', 'Palestine', 'Panama',
          'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines', 'Pologne',
          'Portugal', 'Qatar', 'République centrafricaine', 'République dominicaine',
          'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda', 'Saint-Marin',
          'Sainte-Lucie', 'Sao Tomé-et-Principe', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone',
          'Singapour', 'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka',
          'Suède', 'Suisse', 'Suriname', 'Syrie', 'Tadjikistan', 'Tanzanie', 'Tchad', 'Thaïlande',
          'Timor oriental', 'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie', 'Turkménistan', 'Turquie',
          'Tuvalu', 'Ukraine', 'Uruguay', 'Ouzbékistan', 'Vanuatu', 'Vatican', 'Venezuela',
          'Viêt Nam', 'Yémen', 'Zambie', 'Zimbabwe'
        ],
        animal: [
          'Abeille', 'Agneau', 'Aigle', 'Alpaga', 'Âne', 'Antilope', 'Araignée', 'Baleine',
          'Barracuda', 'Belette', 'Bison', 'Blaireau', 'Bœuf', 'Bouc', 'Buffle', 'Cafard', 'Caméléon',
          'Canard', 'Canari', 'Carpe', 'Castor', 'Chameau', 'Chat', 'Chauve-souris', 'Cheval', 'Chèvre',
          'Chien', 'Chimpanzé', 'Cigale', 'Cigogne', 'Cochon', 'Coq', 'Cormoran', 'Corbeau', 'Crabe',
          'Crevette', 'Crocodile', 'Cygne', 'Dauphin', 'Dindon', 'Dinosaure', 'Écureuil', 'Éléphant',
          'Escargot', 'Fourmi', 'Faucon', 'Flamant', 'Gazelle', 'Gecko', 'Girafe', 'Gorille', 'Grillon',
          'Guêpe', 'Hamster', 'Hérisson', 'Héron', 'Hippopotame', 'Hibou', 'Hyène', 'Iguane', 'Impala',
          'Jaguar', 'Kangourou', 'Koala', 'Lapin', 'Léopard', 'Lézard', 'Libellule', 'Lièvre', 'Lion',
          'Loir', 'Loutre', 'Loup', 'Lynx', 'Macaque', 'Mammouth', 'Mante', 'Mésange', 'Moineau',
          'Morse', 'Mouche', 'Moustique', 'Mouton', 'Narval', 'Ocelot', 'Oie', 'Oiseau', 'Opossum',
          'Orang-outan', 'Orque', 'Ours', 'Panthère', 'Papillon', 'Paresseux', 'Perroquet', 'Perdrix',
          'Phoque', 'Pie', 'Pigeon', 'Pingouin', 'Piranha', 'Poisson', 'Poney', 'Porc', 'Poule',
          'Puma', 'Ragondin', 'Raie', 'Rat', 'Raton laveur', 'Renard', 'Renne', 'Requin',
          'Rhinocéros', 'Rossignol', 'Sangsue', 'Sanglier', 'Sardine', 'Sauterelle', 'Scorpion',
          'Serpent', 'Singe', 'Souris', 'Taupe', 'Taureau', 'Tortue', 'Tigre', 'Toucan', 'Truite',
          'Vache', 'Vautour', 'Veau', 'Vipère', 'Zèbre'
        ],
        fruit: [
          'Abricot', 'Ananas', 'Avocat', 'Banane', 'Cassis', 'Cerise', 'Citron', 'Clémentine', 'Coing',
          'Datte', 'Figue', 'Fraise', 'Framboise', 'Fruit de la passion', 'Grenade', 'Groseille',
          'Kaki', 'Kiwi', 'Litchi', 'Mandarine', 'Mangue', 'Melon', 'Mûre', 'Myrtille', 'Nectarine',
          'Noix de coco', 'Orange', 'Pamplemousse', 'Papaye', 'Pastèque', 'Pêche', 'Poire', 'Pomme',
          'Prune', 'Raisin', 'Rhubarbe', 'Baie de sureau', 'Grenadille'
        ],
        color: [
          'Ambre', 'Argent', 'Azur', 'Beige', 'Blanc', 'Bleu', 'Bordeaux', 'Bronze', 'Brun', 'Camel',
          'Caramel', 'Cerise', 'Charbon', 'Corail', 'Cramoisi', 'Crème', 'Cyan', 'Écarlate',
          'Émeraude', 'Fauve', 'Fuchsia', 'Gris', 'Indigo', 'Ivoire', 'Kaki', 'Lavande', 'Lilas',
          'Lime', 'Magenta', 'Marron', 'Menthe', 'Moutarde', 'Noir', 'Ocre', 'Olive', 'Orange', 'Or',
          'Pêche', 'Pourpre', 'Rose', 'Rouge', 'Rubis', 'Sable', 'Safran', 'Saphir', 'Saumon',
          'Turquoise', 'Vert', 'Violet', 'Jaune'
        ],
        object: [
          'Abat-jour', 'Agrafeuse', 'Aiguille', 'Anneau', 'Armoire', 'Assiette', 'Balai', 'Ballon',
          'Banc', 'Bateau', 'Bibliothèque', 'Bicyclette', 'Boîte', 'Bol', 'Bougie', 'Boulon',
          'Bouteille', 'Bouton', 'Brosse', 'Cadenas', 'Cahier', 'Calculatrice', 'Chaise', 'Chapeau',
          'Chemise', 'Clé', 'Clavier', 'Ciseaux', 'Couverture', 'Couteau', 'Cuillère', 'Coussin',
          'Crayon', 'Draps', 'Écharpe', 'Écran', 'Enveloppe', 'Éponge', 'Étagère', 'Four', 'Fourchette',
          'Frigo', 'Guitare', 'Hachoir', 'Horloge', 'Imprimante', 'Jupe', 'Lampe', 'Laptop', 'Lavabo',
          'Livre', 'Lunettes', 'Machine', 'Manteau', 'Marteau', 'Miroir', 'Montre', 'Mur', 'Ordinateur',
          'Oreiller', 'Panier', 'Pantalon', 'Papier', 'Parapluie', 'Peigne', 'Peinture', 'Pelle',
          'Piano', 'Plat', 'Porte', 'Portable', 'Radio', 'Râteau', 'Règle', 'Rideau', 'Robe', 'Sac',
          'Savon', 'Serrure', 'Serviette', 'Seau', 'Table', 'Tabouret', 'Tasse', 'Téléphone',
          'Télévision', 'Toile', 'Torchon', 'Valise', 'Verre', 'Veste', 'Vitre'
        ],
        city: [
          'Amsterdam', 'Athènes', 'Atlanta', 'Auckland', 'Bagdad', 'Bangkok', 'Barcelone', 'Berlin',
          'Bogota', 'Boston', 'Brasilia', 'Bruxelles', 'Budapest', 'Buenos Aires', 'Le Caire',
          'Caracas', 'Chicago', 'Copenhague', 'Dallas', 'Delhi', 'Dubaï', 'Dublin', 'Édimbourg',
          'Francfort', 'Genève', 'La Havane', 'Helsinki', 'Hong Kong', 'Houston', 'Istanbul',
          'Jakarta', 'Jérusalem', 'Johannesbourg', 'Kiev', 'Kuala Lumpur', 'Lagos', 'Lima',
          'Lisbonne', 'Londres', 'Los Angeles', 'Luanda', 'Madrid', 'Manille', 'Maputo', 'Melbourne',
          'Mexico', 'Miami', 'Milan', 'Montréal', 'Moscou', 'Mumbai', 'Munich', 'Nairobi', 'Naples',
          'New York', 'Oslo', 'Ottawa', 'Paris', 'Prague', 'Rio de Janeiro', 'Rome', 'San Francisco',
          'Santiago', 'São Paulo', 'Seattle', 'Séoul', 'Shanghai', 'Singapour', 'Sofia', 'Stockholm',
          'Sydney', 'Tokyo', 'Toronto', 'Vancouver', 'Venise', 'Vienne', 'Varsovie', 'Washington',
          'Zurich'
        ],
        movie: [
          'Alien', 'Amadeus', 'Avatar', 'Batman Begins', 'La Belle et la Bête', 'Black Panther',
          'Rebelle', 'Casablanca', 'Coco', 'Coraline', 'Dune', 'Elemental', 'Encanto',
          'Le Monde de Nemo', 'La Reine des neiges', 'Gladiator', 'Gravity', 'Inception',
          'Interstellar', 'Les Dents de la mer', 'Joker', 'Jurassic Park', 'Kill Bill', 'King Kong',
          'La La Land', 'Luca', 'Madagascar', 'Matrix', 'Megamind', 'Moi, moche et méchant', 'Vaiana',
          'Oppenheimer', 'Parasite', 'Psychose', 'Pulp Fiction', 'Ratatouille', 'Rocky', 'Shrek',
          'Soul', 'Spider-Man', 'Star Wars', 'Titanic', 'Toy Story', 'Là-haut', 'Wall-E', 'Wicked',
          'Wonder Woman'
        ]
      }
    }
  };

  const SHARED_CATEGORY_WORDS = {
    anime: [
      "Naruto", "One Piece", "Dragon Ball", "Dragon Ball Z", "Bleach", "Death Note",
      "Attack on Titan", "Shingeki no Kyojin", "Demon Slayer", "Kimetsu no Yaiba",
      "My Hero Academia", "Boku no Hero", "Fullmetal Alchemist", "Hunter x Hunter",
      "Jujutsu Kaisen", "Tokyo Ghoul", "Sword Art Online", "Fairy Tail", "Black Clover",
      "Sailor Moon", "Pokémon", "Digimon", "Yu-Gi-Oh!", "Saint Seiya", "Cavaleiros do Zodíaco",
      "Doraemon", "Shin-chan", "Detective Conan", "Inuyasha", "Evangelion", "Cowboy Bebop",
      "Steins;Gate", "Code Geass", "Mob Psycho 100", "One Punch Man", "Spy x Family",
      "Chainsaw Man", "Vinland Saga", "Haikyuu!!", "Slam Dunk", "Captain Tsubasa",
      "Super Campeões", "Gundam", "Astro Boy", "Akira", "Ghost in the Shell",
      "Princess Mononoke", "A Viagem de Chihiro", "Your Name", "Weathering with You",
      "Suzume", "Tokyo Revengers", "Blue Lock", "Berserk", "JoJo's Bizarre Adventure",
      "Nana", "Sakura Card Captor", "Ranma 1/2", "Yu Yu Hakusho", "Samurai X", "Rurouni Kenshin",
      "Gintama", "Fate/stay night", "Re:Zero", "Konosuba", "Overlord", "No Game No Life",
      "Akame ga Kill", "Seven Deadly Sins", "Nanatsu no Taizai", "Fairy Tail", "Toradora",
      "Clannad", "Your Lie in April", "Anohana", "Violet Evergarden", "K-On", "Love Live",
      "Initial D", "Wangan Midnight", "Beyblade", "Medabots", "Zoids", "Sakura Wars"
    ],
    football: [
      "Benfica", "Porto", "Sporting", "Braga", "Vitória de Guimarães", "Boavista",
      "Belenenses", "Rio Ave", "Marítimo", "Nacional", "Real Madrid", "Barcelona",
      "Atlético de Madrid", "Sevilla", "Valencia", "Villarreal", "Athletic Bilbao",
      "Real Sociedad", "Betis", "Manchester United", "Manchester City", "Liverpool",
      "Chelsea", "Arsenal", "Tottenham", "Newcastle", "Aston Villa", "Everton",
      "Juventus", "Milan", "Inter de Milão", "Roma", "Napoli", "Lazio", "Fiorentina",
      "Bayern de Munique", "Borussia Dortmund", "RB Leipzig", "Bayer Leverkusen",
      "Paris Saint-Germain", "PSG", "Marselha", "Lyon", "Monaco", "Ajax", "PSV",
      "Feyenoord", "Flamengo", "Palmeiras", "Corinthians", "São Paulo", "Santos",
      "Vasco", "Botafogo", "Fluminense", "Grêmio", "Internacional", "Cruzeiro",
      "Atlético Mineiro", "Boca Juniors", "River Plate", "Independiente", "Racing",
      "Peñarol", "Nacional", "Al Ahly", "Zamalek", "Raja Casablanca", "Wydad",
      "TP Mazembe", "Espérance", "Étoile du Sahel", "Al Hilal", "Al Nassr",
      "Al Ittihad", "Inter Miami", "LA Galaxy", "Celtic", "Rangers", "Galatasaray",
      "Fenerbahçe", "Besiktas", "Olympiacos", "Panathinaikos", "Anderlecht", "Club Brugge"
    ],
    series: [
      "Breaking Bad", "Game of Thrones", "The Walking Dead", "Stranger Things",
      "The Crown", "The Last of Us", "Chernobyl", "Dark", "Money Heist",
      "La Casa de Papel", "Narcos", "Better Call Saul", "The Sopranos", "The Wire",
      "Friends", "How I Met Your Mother", "The Big Bang Theory", "The Office",
      "Brooklyn Nine-Nine", "Parks and Recreation", "Modern Family", "Grey's Anatomy",
      "House", "Lost", "Prison Break", "Dexter", "Homeland", "The Mandalorian",
      "The Witcher", "Peaky Blinders", "Sherlock", "Doctor Who", "Black Mirror",
      "Westworld", "Succession", "Severance", "Ted Lasso", "The Boys", "Invincible",
      "Arcane", "Cyberpunk: Edgerunners", "Band of Brothers", "The Queen's Gambit",
      "Squid Game", "Round 6", "Alice in Borderland", "Kingdom", "Elite", "Lupin",
      "The Umbrella Academy", "Vikings", "The 100", "Supernatural", "Teen Wolf",
      "Riverdale", "Gossip Girl", "Gilmore Girls", "Sex and the City",
      "Desperate Housewives", "Mad Men", "House of Cards", "The Handmaid's Tale",
      "Fargo", "True Detective", "Mindhunter", "Ozark", "Yellowstone", "Wednesday",
      "The Bear", "Euphoria", "The White Lotus", "Only Murders in the Building"
    ],
    brand: [
      "Nike", "Adidas", "Puma", "Reebok", "Under Armour", "Apple", "Samsung",
      "Sony", "Microsoft", "Google", "Amazon", "Coca-Cola", "Pepsi", "McDonald's",
      "Burger King", "KFC", "Subway", "Starbucks", "Nestlé", "Danone", "Unilever",
      "Toyota", "Honda", "Nissan", "Ford", "Chevrolet", "BMW", "Mercedes-Benz",
      "Audi", "Volkswagen", "Ferrari", "Lamborghini", "Porsche", "Tesla", "Renault",
      "Peugeot", "Citroën", "Fiat", "Hyundai", "Kia", "Volvo", "Jeep", "Chanel",
      "Gucci", "Prada", "Louis Vuitton", "Dior", "Versace", "Armani", "Zara", "H&M",
      "Levi's", "Calvin Klein", "Lacoste", "Tommy Hilfiger", "Ray-Ban", "Rolex",
      "Casio", "Xiaomi", "Huawei", "Dell", "HP", "Lenovo", "Asus", "Acer", "Intel",
      "AMD", "Nvidia", "Canon", "Nikon", "GoPro", "Red Bull", "Monster", "Sprite",
      "Fanta", "Lipton", "Nutella", "Kinder", "Ferrero Rocher", "Gillette", "Dove"
    ],
    videogame: [
      "Minecraft", "Fortnite", "Roblox", "Grand Theft Auto V", "GTA V",
      "The Legend of Zelda", "Super Mario", "Mario Kart", "Sonic the Hedgehog",
      "Tetris", "Pac-Man", "Space Invaders", "Donkey Kong", "Street Fighter",
      "Mortal Kombat", "Tekken", "Call of Duty", "Battlefield", "Halo",
      "Counter-Strike", "Valorant", "League of Legends", "Dota 2", "Overwatch",
      "Apex Legends", "PUBG", "Among Us", "Fall Guys", "Rocket League", "FIFA",
      "EA Sports FC", "PES", "eFootball", "Need for Speed", "Forza Horizon",
      "Gran Turismo", "Assassin's Creed", "God of War", "The Last of Us",
      "Uncharted", "Horizon Zero Dawn", "Red Dead Redemption 2", "Elden Ring",
      "Dark Souls", "Bloodborne", "Sekiro", "Cyberpunk 2077", "The Witcher 3",
      "Skyrim", "Fallout", "Resident Evil", "Silent Hill", "Metal Gear Solid",
      "Final Fantasy", "Kingdom Hearts", "Persona 5", "Pokémon", "Animal Crossing",
      "Stardew Valley", "Terraria", "Candy Crush", "Clash of Clans", "Clash Royale",
      "Free Fire", "Brawl Stars", "Genshin Impact", "Honkai Star Rail", "Valheim",
      "Subnautica", "Hollow Knight", "Celeste", "Cuphead", "It Takes Two"
    ]
  };

  const MODERN_CATEGORY_WORDS = {
    anime: [
      "Frieren", "Frieren: Beyond Journey's End", "Sousou no Frieren", "Dan Da Dan", "Dandadan",
      "Solo Leveling", "Ore dake Level Up na Ken", "Kaiju No. 8", "Kaijuu 8-gou", "Sakamoto Days",
      "Gachiakuta", "The Apothecary Diaries", "Kusuriya no Hitorigoto", "Blue Box", "Ao no Hako",
      "Wind Breaker", "Ranma ½", "Delicious in Dungeon", "Dungeon Meshi", "Chainsaw Man",
      "Chainsaw Man – The Movie: Reze Arc", "Demon Slayer: Infinity Castle", "Kimetsu no Yaiba: Mugen Jou-hen",
      "Jujutsu Kaisen: Culling Game", "One Punch Man Season 3", "Spy x Family Season 3",
      "My Hero Academia: Final Season", "Boku no Hero Academia: Final Season",
      "Bleach: Thousand-Year Blood War", "Frieren Season 2", "Cyberpunk: Edgerunners 2",
      "The Summer Hikaru Died", "Kowloon Generic Romance", "Lazarus", "Zenshu", "Medalist",
      "Orb: On the Movements of the Earth", "Chi. Chikyuu no Undou ni Tsuite", "Witch Watch",
      "The Fragrant Flower Blooms with Dignity", "Kaoru Hana wa Rin to Saku", "City the Animation",
      "Takopi's Original Sin", "Takopii no Genzai", "Apothecary Diaries Season 2"
    ],
    series: [
      "The Penguin", "Shōgun", "Shogun", "Fallout", "The Last of Us Season 2", "House of the Dragon",
      "The Lord of the Rings: The Rings of Power", "Severance Season 2", "Andor Season 2",
      "The Bear Season 3", "The Bear Season 4", "Squid Game Season 3", "Wednesday Season 2",
      "Stranger Things Season 5", "The White Lotus Season 3", "Adolescence", "The Studio", "The Pitt",
      "Daredevil: Born Again", "Peacemaker Season 2", "Alien: Earth", "It: Welcome to Derry",
      "Slow Horses", "Foundation", "The Boys Season 4", "3 Body Problem", "Baby Reindeer",
      "The Day of the Jackal", "Black Doves", "The Night Agent", "The Hunting Wives",
      "The Gilded Age Season 4", "City of God: The Fight Rages On", "Bridgerton Season 4",
      "One Piece Season 2", "The Gentlemen Season 2", "Pride and Prejudice", "Rooster", "Lanterns",
      "The Body", "The Boyfriend", "Run Away", "Agatha Christie's Seven Dials",
      "Stranger Things: Tales From '85", "The Wonderfools", "Little House on the Prairie",
      "Man on Fire", "Nemesis", "Something Very Bad Is Going to Happen", "The Mosquito Bowl"
    ],
    videogame: [
      "Grand Theft Auto VI", "Grand Theft Auto 6", "GTA VI", "GTA 6", "Resident Evil Requiem",
      "007 First Light", "Crimson Desert", "Marvel's Wolverine", "Nioh 3", "The Witcher 4",
      "Intergalactic: The Heretic Prophet", "Onimusha: Way of the Sword", "Pragmata", "Saros",
      "Ghost of Yotei", "Ghost of Yōtei", "Death Stranding 2", "Death Stranding 2: On the Beach",
      "Monster Hunter Wilds", "Assassin's Creed Shadows", "Clair Obscur: Expedition 33",
      "Kingdom Come: Deliverance II", "Split Fiction", "Hollow Knight: Silksong",
      "Elden Ring Nightreign", "Mario Kart World", "Donkey Kong Bananza", "Metroid Prime 4: Beyond",
      "Pokémon Legends: Z-A", "Silent Hill f", "Mafia: The Old Country", "Borderlands 4",
      "Battlefield 6", "Call of Duty: Black Ops 7", "Anno 117: Pax Romana", "The Outer Worlds 2",
      "Avowed", "Two Point Museum", "Sniper Elite: Resistance", "Like a Dragon: Pirate Yakuza in Hawaii",
      "Dynasty Warriors: Origins", "Indiana Jones and the Great Circle", "S.T.A.L.K.E.R. 2",
      "Metaphor: ReFantazio", "Astro Bot", "Black Myth: Wukong", "Balatro", "Animal Well",
      "Helldivers 2", "Palworld", "Marvel Rivals", "Infinity Nikki", "Wuthering Waves",
      "Zenless Zone Zero"
    ],
    brand: [
      "TikTok", "OpenAI", "ChatGPT", "Threads", "Bluesky", "Shein", "Temu", "BYD", "Rivian",
      "Lucid Motors", "Nothing", "Casetify", "Gymshark", "On Running", "Hoka", "Skims", "Glovo",
      "Bolt", "Uber Eats", "DoorDash", "Revolut", "Nubank", "Wise", "Klarna", "Duolingo",
      "Canva", "Figma", "Notion", "Discord", "Twitch", "Epic Games", "Patagonia", "New Balance"
    ]
  };

  const MODERN_LOCAL_CATEGORY_WORDS = {
    pt: {
      movie: [
        "Dune: Parte Dois", "Divertida Mente 2", "Deadpool & Wolverine", "Wicked", "Gladiador II",
        "Vaiana 2", "O Brutalista", "Anora", "A Substância", "Conclave", "Nosferatu", "Robô Selvagem",
        "Flow", "Ainda Estou Aqui", "Godzilla x Kong: O Novo Império", "Planeta dos Macacos: O Reinado",
        "Meu Malvado Favorito 4", "O Auto da Compadecida 2", "Pecadores", "F1: O Filme", "Superman",
        "Jurassic World: Recomeço", "Quarteto Fantástico: Primeiros Passos", "Lilo & Stitch",
        "Como Treinar o Seu Dragão", "Zootopia 2", "Avatar: Fogo e Cinzas", "Wicked: For Good",
        "Predador: Terras Selvagens", "Um Filme Minecraft", "Capitão América: Admirável Mundo Novo",
        "Thunderbolts*", "Missão: Impossível – O Acerto Final", "Ballerina", "28 Anos Depois",
        "Armas", "Uma Batalha Após a Outra", "A Conjuração: Últimos Ritos",
        "Jogos Vorazes: Amanhecer na Colheita", "Hexed", "Focker-in-Law", "Madden", "Paper Tiger",
        "How to Rob a Bank", "Ebenezer", "The Further Mis-Adventures of Cliff Booth",
        "O Gato de Chapéu", "Godzilla Minus Zero", "The Super Mario Galaxy Movie",
        "Avengers: Doomsday", "The Mandalorian & Grogu", "Toy Story 5"
      ],
      novela: [
        "Renascer", "Mania de Você", "Garota do Momento", "Vale Tudo (2025)", "Três Graças",
        "Quem Ama Cuida", "A Herança", "Coração Acelerado", "Beleza Fatal", "Volta por Cima",
        "No Rancho Fundo", "Fuzuê", "Terra e Paixão", "Vai na Fé", "Travessia", "Cara e Coragem",
        "Pantanal (2022)", "Mar do Sertão", "Além da Ilusão", "Amor de Mãe"
      ],
      sport: [
        "Padel", "Pickleball", "eSports", "Breaking", "Escalada", "Parkour", "Crossfit",
        "Corrida de rua", "Trail running", "Stand-up paddle", "Kitesurf", "Windsurf"
      ],
      profession: [
        "Streamer", "Youtuber", "Influencer", "Podcaster", "Criador de conteúdo",
        "Cientista de dados", "Engenheiro de IA", "Gestor de redes sociais",
        "Motorista de aplicativo", "Especialista em cibersegurança", "Desenvolvedor de jogos",
        "Analista de marketing digital", "Gestor de produto", "UX designer"
      ]
    },
    en: {
      movie: [
        "Dune: Part Two", "Inside Out 2", "Deadpool & Wolverine", "Wicked", "Gladiator II",
        "Moana 2", "The Brutalist", "Anora", "The Substance", "Conclave", "Nosferatu",
        "The Wild Robot", "Flow", "I'm Still Here", "Godzilla x Kong: The New Empire",
        "Kingdom of the Planet of the Apes", "Despicable Me 4", "Sinners", "F1: The Movie",
        "Superman", "Jurassic World Rebirth", "The Fantastic Four: First Steps", "Lilo & Stitch",
        "How to Train Your Dragon", "Zootopia 2", "Avatar: Fire and Ash", "Wicked: For Good",
        "Predator: Badlands", "A Minecraft Movie", "Captain America: Brave New World",
        "Thunderbolts*", "Mission: Impossible – The Final Reckoning", "Ballerina", "28 Years Later",
        "Weapons", "One Battle After Another", "The Conjuring: Last Rites",
        "The Hunger Games: Sunrise on the Reaping", "Hexed", "Focker-in-Law", "Madden",
        "Paper Tiger", "How to Rob a Bank", "Ebenezer", "The Further Mis-Adventures of Cliff Booth",
        "The Cat in the Hat", "Godzilla Minus Zero", "The Super Mario Galaxy Movie",
        "Avengers: Doomsday", "The Mandalorian & Grogu", "Toy Story 5"
      ],
      novela: [
        "Beyond the Gates", "The Gates", "The Young and the Restless", "The Bold and the Beautiful",
        "Days of Our Lives", "General Hospital", "Neighbours", "Home and Away", "Hollyoaks",
        "EastEnders", "Coronation Street", "Emmerdale", "The Hunting Wives", "The Gilded Age"
      ],
      sport: [
        "Padel", "Pickleball", "Esports", "Breaking", "Sport climbing", "Parkour", "CrossFit",
        "Trail running", "Stand-up paddleboarding", "Kitesurfing", "Windsurfing", "BMX racing"
      ],
      profession: [
        "Streamer", "YouTuber", "Influencer", "Podcaster", "Content creator", "Data scientist",
        "AI engineer", "Social media manager", "Rideshare driver", "Cybersecurity specialist",
        "Game developer", "Digital marketing analyst", "Product manager", "UX designer"
      ]
    },
    es: {
      movie: [
        "Dune: Parte Dos", "Del Revés 2", "Deadpool & Wolverine", "Wicked", "Gladiator II",
        "Vaiana 2", "El Brutalista", "Anora", "La Sustancia", "Cónclave", "Nosferatu",
        "Robot Salvaje", "Flow", "Aún Estoy Aquí", "Godzilla x Kong: El Nuevo Imperio",
        "El Reino del Planeta de los Simios", "Gru 4", "Pecadores", "F1: La Película", "Superman",
        "Jurassic World: Rebirth", "Los Cuatro Fantásticos: Primeros Pasos", "Lilo & Stitch",
        "Cómo Entrenar a tu Dragón", "Zootopia 2", "Avatar: Fuego y Ceniza", "Wicked: For Good",
        "Predator: Badlands", "Una Película de Minecraft", "Capitán América: Brave New World",
        "Thunderbolts*", "Misión: Imposible – Sentencia Final", "Ballerina", "28 Años Después",
        "Armas", "Una Batalla Tras Otra", "Expediente Warren: Últimos Ritos",
        "Los Juegos del Hambre: Amanecer en la Cosecha", "Hexed", "Focker-in-Law", "Madden",
        "Paper Tiger", "How to Rob a Bank", "Ebenezer", "The Further Mis-Adventures of Cliff Booth",
        "El Gato con Sombrero", "Godzilla Minus Zero", "The Super Mario Galaxy Movie",
        "Avengers: Doomsday", "The Mandalorian & Grogu", "Toy Story 5"
      ],
      novela: [
        "La Casa de los Famosos", "El Señor de los Cielos", "La Reina del Sur", "Betty en NY",
        "Café con Aroma de Mujer", "Pasión de Gavilanes", "La Usurpadora", "Rubí", "Teresa",
        "Amores Verdaderos", "La Doña", "Señora Acero", "La Piloto", "Marimar"
      ],
      sport: [
        "Pádel", "Pickleball", "eSports", "Breaking", "Escalada", "Parkour", "CrossFit",
        "Trail running", "Stand-up paddle", "Kitesurf", "Windsurf", "Ciclismo BMX"
      ],
      profession: [
        "Streamer", "Youtuber", "Influencer", "Podcaster", "Creador de contenido",
        "Científico de datos", "Ingeniero de IA", "Gestor de redes sociales",
        "Conductor de apps", "Especialista en ciberseguridad", "Desarrollador de videojuegos",
        "Analista de marketing digital", "Gestor de producto", "Diseñador UX"
      ]
    },
    fr: {
      movie: [
        "Dune : Deuxième Partie", "Vice-Versa 2", "Deadpool & Wolverine", "Wicked", "Gladiator II",
        "Vaiana 2", "The Brutalist", "Anora", "The Substance", "Conclave", "Nosferatu",
        "Le Robot sauvage", "Flow", "Je suis toujours là", "Godzilla x Kong : Le Nouvel Empire",
        "La Planète des singes : Le Nouveau Royaume", "Moi, moche et méchant 4", "Sinners",
        "F1 Le Film", "Superman", "Jurassic World : Renaissance",
        "Les Quatre Fantastiques : Premiers pas", "Lilo & Stitch", "Dragons", "Zootopie 2",
        "Avatar : De feu et de cendres", "Wicked: For Good", "Predator: Badlands",
        "Un film Minecraft", "Captain America: Brave New World", "Thunderbolts*",
        "Mission : Impossible – The Final Reckoning", "Ballerina", "28 ans plus tard", "Weapons",
        "One Battle After Another", "The Conjuring: Last Rites",
        "Hunger Games : Sunrise on the Reaping", "Hexed", "Focker-in-Law", "Madden",
        "Paper Tiger", "How to Rob a Bank", "Ebenezer", "The Further Mis-Adventures of Cliff Booth",
        "Le Chat chapeauté", "Godzilla Minus Zero", "The Super Mario Galaxy Movie",
        "Avengers: Doomsday", "The Mandalorian & Grogu", "Toy Story 5"
      ],
      novela: [
        "Plus belle la vie, encore plus belle", "Demain nous appartient", "Ici tout commence",
        "Un si grand soleil", "Le Miel et les Abeilles", "Hélène et les Garçons", "Clem",
        "Section de recherches", "Camping paradis", "Joséphine, ange gardien", "Lupin",
        "Dix pour cent", "Le Bureau des Légendes", "Baron noir"
      ],
      sport: [
        "Padel", "Pickleball", "eSport", "Breaking", "Escalade", "Parkour", "CrossFit",
        "Trail", "Stand-up paddle", "Kitesurf", "Windsurf", "BMX racing"
      ],
      profession: [
        "Streamer", "Youtubeur", "Influenceur", "Podcasteur", "Créateur de contenu",
        "Data scientist", "Ingénieur IA", "Community manager", "Chauffeur VTC",
        "Expert en cybersécurité", "Développeur de jeux vidéo", "Analyste marketing digital",
        "Chef de produit", "Designer UX"
      ]
    }
  };

  const EXTRA_CATEGORY_WORDS = {
    pt: Object.assign({}, SHARED_CATEGORY_WORDS, {
      novela: [
        "Avenida Brasil", "Império", "A Força do Querer", "Pantanal", "Amor de Mãe",
        "Verdades Secretas", "Laços de Família", "Da Cor do Pecado", "Senhora do Destino",
        "Mulheres de Areia", "O Clone", "Terra Nostra", "A Indomada", "Por Amor",
        "Torre de Babel", "Roque Santeiro", "Vale Tudo", "O Rei do Gado", "Fina Estampa",
        "Salve Jorge", "Cheias de Charme", "Cordel Encantado", "Gabriela", "Saramandaia",
        "O Outro Lado do Paraíso", "Segundo Sol", "A Dona do Pedaço", "Amor à Vida",
        "Duas Caras", "Páginas da Vida", "América", "Belíssima", "Celebridade",
        "Corpo Dourado", "Anjo Mau", "História de Amor", "Felicidade", "O Dono do Mundo",
        "Tieta", "Mandala", "Cambalacho", "Guerra dos Sexos", "Vereda Tropical",
        "Água Viva", "Pai Herói", "Dancin' Days", "O Astro", "Pecado Capital",
        "Escrava Isaura", "Selva de Pedra", "Irmãos Coragem", "Cabocla", "Sinhá Moça",
        "Alma Gêmea", "Chocolate com Pimenta", "O Cravo e a Rosa", "Explode Coração",
        "Quatro por Quatro", " Torre de Babel", "Os Mutantes", "Uga-Uga", "Kubanacan"
      ],
      sport: [
        "Futebol", "Basquetebol", "Voleibol", "Andebol", "Ténis", "Ténis de mesa",
        "Badminton", "Natação", "Atletismo", "Ciclismo", "Boxe", "MMA", "Judo",
        "Karaté", "Taekwondo", "Rugby", "Críquete", "Golfe", "Hóquei", "Hóquei em patins",
        "Hóquei no gelo", "Fórmula 1", "MotoGP", "Rali", "Surf", "Skate", "Snowboard",
        "Esqui", "Patinagem", "Ginástica", "Halterofilismo", "Luta livre", "Esgrima",
        "Tiro com arco", "Tiro desportivo", "Vela", "Remo", "Canoagem", "Pólo aquático",
        "Saltos ornamentais", "Maratona", "Triatlo", "Pentatlo", "Hipismo", "Xadrez",
        "Dardos", "Bilhar", "Boliche", "Voleibol de praia", "Futsal", "Padbol"
      ],
      profession: [
        "Médico", "Enfermeiro", "Professor", "Engenheiro", "Advogado", "Juiz",
        "Polícia", "Bombeiro", "Motorista", "Piloto", "Cozinheiro", "Padeiro",
        "Empregado de mesa", "Jornalista", "Escritor", "Ator", "Cantor", "Músico",
        "Dançarino", "Pintor", "Escultor", "Arquiteto", "Contabilista", "Economista",
        "Gestor", "Programador", "Designer", "Fotógrafo", "Cientista", "Biólogo",
        "Químico", "Físico", "Matemático", "Astronauta", "Agricultor", "Pescador",
        "Carpinteiro", "Eletricista", "Canalizador", "Mecânico", "Soldado",
        "Marinheiro", "Veterinário", "Dentista", "Farmacêutico", "Psicólogo",
        "Nutricionista", "Cabeleireiro", "Esteticista", "Vendedor", "Recepcionista",
        "Secretário", "Bibliotecário", "Tradutor", "Intérprete", "Investigador"
      ]
    }),
    en: Object.assign({}, SHARED_CATEGORY_WORDS, {
      novela: [
        "Coronation Street", "EastEnders", "Emmerdale", "Hollyoaks", "Neighbours",
        "Home and Away", "Days of Our Lives", "The Young and the Restless",
        "General Hospital", "The Bold and the Beautiful", "Santa Barbara", "Dallas",
        "Dynasty", "Falcon Crest", "Knots Landing", "Melrose Place", "Beverly Hills 90210",
        "Dawson's Creek", "One Tree Hill", "Gossip Girl", "Desperate Housewives",
        "Ugly Betty", "Jane the Virgin", "Riverdale", "Elite", "Dark", "Revenge",
        "Scandal", "How to Get Away with Murder", "Big Little Lies", "This Is Us",
        "Parenthood", "Hart of Dixie", "Gilmore Girls", "Sex and the City",
        "The O.C.", "Friday Night Lights", "Veronica Mars", "Pretty Little Liars",
        "The Vampire Diaries", "True Blood", "Six Feet Under", "Nip/Tuck", "ER"
      ],
      sport: [
        "Football", "Basketball", "Volleyball", "Handball", "Tennis", "Table tennis",
        "Badminton", "Swimming", "Athletics", "Cycling", "Boxing", "MMA", "Judo",
        "Karate", "Taekwondo", "Rugby", "Cricket", "Golf", "Hockey", "Ice hockey",
        "Formula 1", "MotoGP", "Rally", "Surfing", "Skateboarding", "Snowboarding",
        "Skiing", "Skating", "Gymnastics", "Weightlifting", "Wrestling", "Fencing",
        "Archery", "Shooting", "Sailing", "Rowing", "Canoeing", "Water polo",
        "Diving", "Marathon", "Triathlon", "Equestrian", "Chess", "Darts",
        "Billiards", "Bowling", "Beach volleyball", "Futsal", "Netball", "Softball"
      ],
      profession: [
        "Doctor", "Nurse", "Teacher", "Engineer", "Lawyer", "Judge", "Police officer",
        "Firefighter", "Driver", "Pilot", "Cook", "Baker", "Waiter", "Journalist",
        "Writer", "Actor", "Singer", "Musician", "Dancer", "Painter", "Sculptor",
        "Architect", "Accountant", "Economist", "Manager", "Programmer", "Designer",
        "Photographer", "Scientist", "Biologist", "Chemist", "Physicist",
        "Mathematician", "Astronaut", "Farmer", "Fisherman", "Carpenter",
        "Electrician", "Plumber", "Mechanic", "Soldier", "Sailor", "Veterinarian",
        "Dentist", "Pharmacist", "Psychologist", "Nutritionist", "Hairdresser",
        "Beautician", "Salesperson", "Receptionist", "Secretary", "Librarian",
        "Translator", "Interpreter", "Researcher"
      ]
    }),
    es: Object.assign({}, SHARED_CATEGORY_WORDS, {
      novela: [
        "Yo soy Betty, la fea", "La Usurpadora", "María la del Barrio", "Esmeralda",
        "Rubí", "Rebelde", "Teresa", "Amores Verdaderos", "La Reina del Sur",
        "Pasión de Gavilanes", "El Señor de los Cielos", "La Rosa de Guadalupe",
        "Cuna de Lobos", "Los Ricos También Lloran", "Mi Pecado", "Abrazame Muy Fuerte",
        "La Madrastra", "Corazón Salvaje", "Sortilegio", "Soy tu Dueña",
        "La Fuerza del Destino", "Porque el Amor Manda", "Amorcito Corazón",
        "La Tempestad", "Lo Que la Vida Me Robó", "A Que No Me Dejas", "Simplemente María",
        "La Doña", "Betty en NY", "Café con Aroma de Mujer", "Pasión de Amor",
        "El Cuerpo del Deseo", "La Tormenta", "Zorro", "Rosalinda", "Marimar",
        "La Fea Más Bella", "Mujeres Asesinas", "La Piloto", "Señora Acero"
      ],
      sport: [
        "Fútbol", "Baloncesto", "Voleibol", "Balonmano", "Tenis", "Tenis de mesa",
        "Bádminton", "Natación", "Atletismo", "Ciclismo", "Boxeo", "MMA", "Judo",
        "Karate", "Taekwondo", "Rugby", "Críquet", "Golf", "Hockey", "Hockey sobre hielo",
        "Fórmula 1", "MotoGP", "Rally", "Surf", "Skate", "Snowboard", "Esquí",
        "Patinaje", "Gimnasia", "Halterofilia", "Lucha", "Esgrima", "Tiro con arco",
        "Tiro deportivo", "Vela", "Remo", "Piragüismo", "Waterpolo", "Saltos",
        "Maratón", "Triatlón", "Hípica", "Ajedrez", "Dardos", "Billar", "Bolos",
        "Vóley playa", "Fútbol sala", "Baloncesto 3x3", "Pádel"
      ],
      profession: [
        "Médico", "Enfermero", "Profesor", "Ingeniero", "Abogado", "Juez",
        "Policía", "Bombero", "Conductor", "Piloto", "Cocinero", "Panadero",
        "Camarero", "Periodista", "Escritor", "Actor", "Cantante", "Músico",
        "Bailarín", "Pintor", "Escultor", "Arquitecto", "Contable", "Economista",
        "Gerente", "Programador", "Diseñador", "Fotógrafo", "Científico", "Biólogo",
        "Químico", "Físico", "Matemático", "Astronauta", "Agricultor", "Pescador",
        "Carpintero", "Electricista", "Fontanero", "Mecánico", "Soldado", "Marinero",
        "Veterinario", "Dentista", "Farmacéutico", "Psicólogo", "Nutricionista",
        "Peluquero", "Esteticista", "Vendedor", "Recepcionista", "Secretario",
        "Bibliotecario", "Traductor", "Intérprete", "Investigador"
      ]
    }),
    fr: Object.assign({}, SHARED_CATEGORY_WORDS, {
      novela: [
        "Plus belle la vie", "Demain nous appartient", "Ici tout commence",
        "Un si grand soleil", "Les Feux de l'amour", "Amour, Gloire et Beauté",
        "Santa Barbara", "Dallas", "Dynastie", "Hélène et les Garçons",
        "Premiers Baisers", "Le Miel et les Abeilles", "Sous le soleil",
        "Saint-Tropez", "Cœur Océan", "Baie des Flamboyants", "Clem", "Joséphine",
        "Section de recherches", "Camping paradis", "Alice Nevers", "Julie Lescaut",
        "Une femme d'honneur", "P.J.", "Avocats et Associés", "Central Nuit",
        "Engrenages", "Braquo", "Mafiosa", "Maison close", "Baron noir",
        "Le Bureau des Légendes", "Marseille", "Dix pour cent", "Lupin",
        "Family Business", "Plan cœur", "Osmosis", "La Révolution", "Drôle"
      ],
      sport: [
        "Football", "Basket-ball", "Volley-ball", "Handball", "Tennis",
        "Tennis de table", "Badminton", "Natation", "Athlétisme", "Cyclisme",
        "Boxe", "MMA", "Judo", "Karaté", "Taekwondo", "Rugby", "Cricket",
        "Golf", "Hockey", "Hockey sur glace", "Formule 1", "MotoGP", "Rallye",
        "Surf", "Skateboard", "Snowboard", "Ski", "Patinage", "Gymnastique",
        "Haltérophilie", "Lutte", "Escrime", "Tir à l'arc", "Tir sportif",
        "Voile", "Aviron", "Canoë-kayak", "Water-polo", "Plongeon", "Marathon",
        "Triathlon", "Équitation", "Échecs", "Fléchettes", "Billard", "Bowling",
        "Beach-volley", "Futsal", "Padel", "Randonnée", "Escalade", "Parachutisme"
      ],
      profession: [
        "Médecin", "Infirmier", "Professeur", "Ingénieur", "Avocat", "Juge",
        "Policier", "Pompier", "Chauffeur", "Pilote", "Cuisinier", "Boulanger",
        "Serveur", "Journaliste", "Écrivain", "Acteur", "Chanteur", "Musicien",
        "Danseur", "Peintre", "Sculpteur", "Architecte", "Comptable", "Économiste",
        "Gestionnaire", "Programmeur", "Designer", "Photographe", "Scientifique",
        "Biologiste", "Chimiste", "Physicien", "Mathématicien", "Astronaute",
        "Agriculteur", "Pêcheur", "Charpentier", "Électricien", "Plombier",
        "Mécanicien", "Soldat", "Marin", "Vétérinaire", "Dentiste", "Pharmacien",
        "Psychologue", "Nutritionniste", "Coiffeur", "Esthéticien", "Vendeur",
        "Réceptionniste", "Secrétaire", "Bibliothécaire", "Traducteur",
        "Interprète", "Chercheur"
      ]
    })
  };

  Object.keys(DATA).forEach(function (languageKey) {
    const extra = EXTRA_CATEGORY_WORDS[languageKey] || EXTRA_CATEGORY_WORDS.pt;
    DATA[languageKey].categories = Object.assign({}, DATA[languageKey].categories, extra);

    const modern = MODERN_CATEGORY_WORDS;
    Object.keys(modern).forEach(function (category) {
      const current = DATA[languageKey].categories[category] || [];
      DATA[languageKey].categories[category] = Array.from(
        new Set(current.concat(modern[category]))
      );
    });

    const local = MODERN_LOCAL_CATEGORY_WORDS[languageKey] || MODERN_LOCAL_CATEGORY_WORDS.en;
    Object.keys(local).forEach(function (category) {
      const current = DATA[languageKey].categories[category] || [];
      DATA[languageKey].categories[category] = Array.from(
        new Set(current.concat(local[category]))
      );
    });
  });

  const language = window.I18N ? window.I18N.getLanguage() : 'en';

  window.STOP_WORDS_BY_LANG = DATA;
  window.STOP_WORDS = DATA[language] || DATA.en;
})();
