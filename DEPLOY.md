# Publicar o Kweha

Guia para colocar o projeto no GitHub, alojar numa VPS Oracle Cloud Always Free
e usar um subdomínio gratuito DuckDNS com HTTPS automático.

## 1. Criar o repositório no GitHub

Cria um repositório vazio em <https://github.com/new> (sem README, sem `.gitignore`).

No teu PC, dentro da pasta do projeto:

```bash
git add .
git commit -m "Kweha: jogo offline e online"
git remote add origin https://github.com/UTILIZADOR/REPO.git
git push -u origin main
```

O `.env` e o `data/stop.db` ficam de fora por estarem no `.gitignore`.

## 2. Criar a VPS Oracle Cloud

1. Entra em <https://cloud.oracle.com> e cria uma instância em **Compute > Instances**.
2. Escolhe uma forma **Always Free**:
   - `VM.Standard.E2.1.Micro` (mais simples), ou
   - `VM.Standard.A1.Flex` com até 4 OCPU / 24 GB.
3. Imagem: **Ubuntu 24.04**.
4. Adiciona a tua chave SSH pública.
5. Depois de criar, reserva o IP público:
   **Networking > IP management > Reserved public IP** e associa à instância.
6. Anota o IP público. Vais usá-lo no DuckDNS.

### Abrir portas na Oracle

Na **VCN > Security Lists** (ou no Network Security Group) da instância, cria regras
de entrada:

| Porta | Origem |
| --- | --- |
| TCP 22 | O teu IP (SSH) |
| TCP 80 | `0.0.0.0/0` |
| TCP 443 | `0.0.0.0/0` |

### Abrir portas no Ubuntu

Liga por SSH e executa:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y iptables-persistent
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

## 3. Criar o subdomínio gratuito no DuckDNS

1. Entra em <https://www.duckdns.org> com GitHub, Google ou email.
2. Cria um subdomínio, por exemplo `kweha`.
3. Define o IP atual com o IP público reservado da VPS.
4. Guarda o teu **token** do DuckDNS.
5. Confirma que resolve:

```bash
dig +short kweha.duckdns.org
```

O DuckDNS apaga domínios sem atualizações durante muito tempo. Para manter ativo,
adiciona uma tarefa ao cron (com o teu subdomínio e token):

```bash
crontab -e
```

```cron
*/5 * * * * curl -fsS "https://www.duckdns.org/update?domains=kweha&token=TEU_TOKEN&ip=" >/dev/null
```

Não coloques o token no repositório.

## 4. Instalar o Node.js 24

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs git
node -v
```

Tem de mostrar `v24.x` ou superior.

## 5. Instalar o Caddy (HTTPS automático)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

## 6. Colocar o projeto na VPS

```bash
sudo useradd --system --home-dir /opt/kweha --shell /usr/sbin/nologin kweha
sudo mkdir -p /opt/kweha
sudo chown kweha:kweha /opt/kweha
sudo -u kweha git clone https://github.com/UTILIZADOR/REPO.git /opt/kweha
sudo -u kweha cp /opt/kweha/.env.example /opt/kweha/.env
sudo -u kweha nano /opt/kweha/.env
```

Se o repositório for privado, cria uma deploy key no GitHub e usa o URL SSH do
repositório em vez do URL HTTPS.

Conteúdo do `.env` em produção:

```env
HOST=0.0.0.0
PORT=8000
COOKIE_SECURE=1
DB_PATH=data/stop.db
```

Não coloques credenciais Google por agora. O login local e o modo convidado funcionam
sem isso.

Testa manualmente:

```bash
sudo -u kweha bash -lc 'cd /opt/kweha && node --env-file-if-exists=.env server/server.js'
```

Noutro terminal da VPS:

```bash
curl -fsS http://127.0.0.1:8000/api/health
```

Deve devolver `{"ok":true,...}`. Para o processo manual com `Ctrl+C`.

## 7. Arrancar com systemd

```bash
sudo cp /opt/kweha/deploy/kweha.service /etc/systemd/system/kweha.service
sudo systemctl daemon-reload
sudo systemctl enable --now kweha
sudo systemctl status kweha --no-pager
```

Se o Node não estiver em `/usr/bin/node`, ajusta o `ExecStart` do serviço:

```bash
which node
sudo nano /etc/systemd/system/kweha.service
sudo systemctl daemon-reload
sudo systemctl restart kweha
```

## 8. Ativar o domínio e HTTPS no Caddy

```bash
sudo cp /opt/kweha/deploy/Caddyfile /etc/caddy/Caddyfile
sudo sed -i 's/SEU_SUBDOMINIO.duckdns.org/kweha.duckdns.org/' /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo journalctl -u caddy -n 50 --no-pager
```

O Caddy obtém o certificado Let's Encrypt automaticamente. Testa:

```bash
curl -I https://kweha.duckdns.org
```

Abre o endereço no navegador, entra como convidado ou cria uma conta local.

## 9. Jogar com outras pessoas

1. Partilha o link `https://kweha.duckdns.org`.
2. Um jogador escolhe **Multiplayer** e **Criar sala**.
3. Os outros escolhem **Entrar numa sala** e usam o código de 5 caracteres.
4. O anfitrião escolhe categorias e rondas e inicia a partida.

O modo online usa PeerJS/WebRTC e precisa de Internet em todos os dispositivos.

## 10. Atualizar o jogo

```bash
sudo -u kweha git -C /opt/kweha pull --ff-only
sudo systemctl restart kweha
```

## 11. Backup da base de dados

```bash
sudo apt install -y sqlite3
sudo -u kweha sqlite3 /opt/kweha/data/stop.db ".backup '/opt/kweha/data/stop-$(date +%F).db'"
```

Copia periodicamente os ficheiros `data/stop-*.db` para fora da VPS.

## 12. Segurança e manutenção

- Mantém o Ubuntu atualizado: `sudo apt update && sudo apt upgrade -y`.
- Usa apenas login por chave SSH, sem palavra-passe.
- Mantém o `.env` e o DuckDNS token fora do Git.
- Se mudares de domínio, atualiza o `Caddyfile` e reinicia o Caddy.
- Se o login com Google for ativado mais tarde, atualiza o redirect URI no Google
  Cloud Console para `https://o-teu-dominio/api/auth/google/callback`.
