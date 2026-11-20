# Kweha

Jogo de palavras inspirado no STOP, com modo contra o computador e multiplayer online.
O projeto é uma aplicação web estática servida por um pequeno servidor Node.js, sem
dependências externas de runtime, e funciona com ou sem o servidor.

## Requisitos

- Node.js **24 ou superior** (o servidor usa `node:sqlite`). A versão está definida em `.nvmrc`.
- npm (incluído com o Node.js).
- Um navegador moderno (Chrome, Edge, Firefox ou Safari).

## Arranque rápido

```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm start
```

Abre <http://localhost:8000>.

O ficheiro `.env` é opcional para jogar localmente: sem ele o servidor usa
`127.0.0.1:8000` e cria a base de dados em `data/stop.db`.

Para desenvolvimento com reinício automático:

```bash
npm run dev
```

## Modos de jogo

### Offline / Com PC

Não precisa de servidor nem de Internet. Podes abrir diretamente o `index.html` no
navegador, ou usar o servidor para teres também login e estatísticas.

- Modo `Com PC`: jogas sozinho contra o computador.
- Antes de começar escolhes as categorias e o número de rondas (3, 5, 10 ou 15).
- Contas, login local e estatísticas precisam do servidor Node.js.

### Online / Multiplayer

- Até 4 jogadores por sala.
- O anfitrião escolhe as categorias e o número de rondas para toda a sala.
- O anfitrião cria a sala e partilha o código de 5 caracteres.
- Os restantes jogadores escolhem `Entrar na sala` e introduzem o código.
- A biblioteca PeerJS é carregada localmente de `assets/vendor/peerjs.min.js`; não
  depende de CDN.
- O modo online precisa de Internet para a sinalização PeerJS e de WebRTC entre os
  jogadores. Redes muito restritivas (empresas/escolas) podem bloquear a ligação.

## Configuração

Copia `.env.example` para `.env` e ajusta os valores necessários.

| Variável | Descrição | Omissão |
| --- | --- | --- |
| `HOST` | Interface onde o servidor escuta. Usa `0.0.0.0` em contentores/hosting. | `127.0.0.1` |
| `PORT` | Porta HTTP. | `8000` |
| `COOKIE_SECURE` | `1` para cookies apenas em HTTPS (produção). | `0` |
| `DB_PATH` | Caminho da base de dados SQLite. | `data/stop.db` |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth. | vazio |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google OAuth. | vazio |
| `GOOGLE_REDIRECT_URI` | Redirect URI registado no Google. | calculado em localhost |

### Login com Google (opcional)

1. Cria credenciais OAuth 2.0 em <https://console.cloud.google.com/apis/credentials>.
2. Adiciona o redirect URI autorizado:
   - Local: `http://localhost:8000/api/auth/google/callback`
   - Produção: `https://o-teu-dominio/api/auth/google/callback`
3. Preenche `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REDIRECT_URI` no `.env`.
4. Reinicia o servidor.

Sem credenciais válidas, o botão do Google fica indisponível e o login local continua
a funcionar.

## Publicar num repositório / hosting

### Servidor Node.js (recomendado para tudo)

Funciona em Render, Railway, Fly.io, VPS, Docker, etc.

- Comando de arranque: `npm start`
- Define `HOST=0.0.0.0` e `PORT` fornecida pela plataforma.
- Usa um volume/disco persistente para `data/` (ou aponta `DB_PATH` para um caminho persistente).
- Em produção com HTTPS, define `COOKIE_SECURE=1`.
- Configura o redirect URI do Google com o domínio final.

Para a receita completa com **Oracle Cloud Always Free + DuckDNS + Caddy + HTTPS**,
segue [DEPLOY.md](DEPLOY.md).

Health check: `GET /api/health`.

### Hosting estático (GitHub Pages, Netlify, Vercel static)

O jogo em si (modo Com PC e multiplayer PeerJS) funciona, mas **não** há API de contas:

- Login local, Google, estatísticas e gravação de resultados não funcionam.
- O `index.html` da raiz redireciona para `html/index.html`, por isso funciona em subpastas.

Se precisares de contas e estatísticas, publica com o servidor Node.js.

## Segurança

- Nunca faças commit do `.env`; ele já está no `.gitignore`.
- O `data/stop.db` também é ignorado por conter contas e sessões reais.
- Se alguma credencial Google foi partilhada ou exposta, revoga-a e cria outra.
- As palavras-passe são guardadas com `scrypt` e as sessões usam cookies `HttpOnly`.

## Estrutura

```text
.
├── index.html            # entrada que redireciona para html/
├── html/                 # ecrãs do jogo
├── css/                  # estilos
├── js/                   # lógica do cliente
├── assets/               # imagens, sons, vídeo, ícones e PeerJS local
├── data/                 # base de dados SQLite (gerada em runtime)
├── deploy/               # systemd, Caddyfile e guia de VPS
├── server/server.js      # servidor HTTP, API de autenticação e ficheiros estáticos
├── .env.example          # exemplo de configuração
├── DEPLOY.md             # publicação no GitHub + Oracle Cloud + DuckDNS
└── package.json
```

## Problemas comuns

- **`node:sqlite` em falta**: estás a usar Node antigo. Instala Node 24 (`nvm use`).
- **Porta 8000 em uso**: fecha a aplicação que a está a usar ou muda `PORT` no `.env`.
- **Sala não encontrada**: confirma o código, a ligação à Internet e se o anfitrião
  ainda tem a sala aberta. Firewalls podem bloquear WebRTC.
- **Redirecionamento do Google inválido**: o `GOOGLE_REDIRECT_URI` tem de ser
  exatamente igual ao registado no Google Cloud Console.
