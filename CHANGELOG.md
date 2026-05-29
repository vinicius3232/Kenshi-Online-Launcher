# 📜 Changelog — Kenshi Online

Todas as mudanças relevantes do projeto são documentadas neste arquivo.

O formato segue, de forma aproximada, o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.0.2c] — 2026-05-28 — launcher multi-idioma (PT / EN / RU)

Melhoria de usabilidade para a comunidade internacional. O instalador do GitHub
Release foi republicado (mesmo link). Não há mudança no DLL/servidor — **só o
launcher mudou**; reinstalar é opcional (só para ganhar a interface traduzida).

### 🌍 Idiomas

- **Seletor de idioma no launcher** — botão 🌐 no canto superior direito alterna
  entre **Português (BR)**, **Inglês** e **Russo**. Toda a interface (abas,
  campos, botões, console) é traduzida em tempo real. *(Launcher — i18n)*
  - A escolha é **lembrada** entre sessões (`localStorage`), e o idioma inicial
    é detectado pelo idioma do sistema (com *fallback* para Inglês).
- **Guias do jogador em 3 idiomas** — `GUIA_JOGADORES.md` (PT-BR),
  `GUIDE_PLAYERS_EN.md` (EN) e `GUIDE_PLAYERS_RU.md` (RU), com o passo a passo
  completo e a regra de ouro do start **"Multiplayer"**.

---

## [1.0.2b] — 2026-05-28 — hotfix de sincronização (jogadores não se viam)

Correção crítica no `KenshiMP.Core.dll`. O instalador do GitHub Release foi
republicado (mesmo link). **Ambos os jogadores precisam reinstalar** — o fix
está no DLL do cliente.

### 🐛 Correções

- **Jogadores conectavam mas não se viam (faction mismatch)** — o servidor (e os
  IDs de facção do `kenshi-online.mod`) usam a forma com extensão e prefixo de
  ordem de carregamento: `10-kenshi-online.mod` = Player 1, `12-kenshi-online.mod`
  = Player 2. O cliente comparava **sem o `.mod`** (`"10-kenshi-online"`), então
  nunca casava — o `shared_save_sync` falhava na inicialização e inundava o log
  com *"Unknown faction"* (~24 mil linhas por sessão), sem nunca sincronizar.
  *(KenshiMP.Core — game/shared_save_sync)*
  - Agora a identificação do jogador usa o **slot atribuído pelo servidor**
    (autoritativo, independente de prefixo), com *fallback* tolerante à `.mod` e
    ao prefixo de ordem de carregamento.

> ⚠️ **Modelo de jogo (importante):** o sync localiza os personagens **"Player 1"**
> e **"Player 2"**, que só existem no start **"Multiplayer"** do mod. Os dois
> jogadores devem iniciar **Novo Jogo → start "Multiplayer"** (ou carregar o
> **mesmo** save criado a partir dele) — carregar saves individuais antigos não
> sincroniza.

---

## [1.0.2a] — 2026-05-28 — hotfix de instalação

Correção crítica no fluxo de **instalação do mod** pelo launcher. O instalador
do GitHub Release foi republicado (mesmo link, mesma versão 1.0.2).

### 🐛 Correções

- **Jogadores conectavam mas não se viam** — o launcher instalava apenas o
  plugin de rede (`KenshiMP.Core.dll` + `Plugins_x64.cfg`), mas **não copiava o
  mod `kenshi-online.mod`** nem o ativava em `data/__mods.list`. Sem esse mod, os
  *templates* de personagem (Player 1–16) não carregavam e o `SpawnManager` não
  conseguia criar os personagens remotos — então a conexão funcionava (mostrava
  "2 jogadores"), mas ninguém aparecia no mundo. *(Launcher — install-mod)*
  - O `kenshi-online.mod` passou a ser incluído no pacote (`resources/mod/`) e
    copiado para `data/kenshi-online.mod` **e** `mods/kenshi-online/`.
  - O launcher agora ativa o mod em `data/__mods.list` (preservando CRLF), além
    de registrar o plugin no `Plugins_x64.cfg`.

> ℹ️ **Como jogar:** ambos os jogadores precisam **carregar um save / estar
> dentro do mundo** antes de conectar — conectar pelo menu (sem mundo carregado)
> impede o spawn dos personagens.

---

## [1.0.2] — 2026-05-28

Versão de **estabilização**: foco em corrigir crashes, blindar a rede contra
abuso e melhorar a sincronização entre jogadores. As melhorias abaixo foram
incorporadas a partir de correções de produção da comunidade e validadas em
build próprio (compilação com MSVC + Ninja).

### 🐛 Correções de crash / estabilidade

- **Jogo fechava após instalar o mod** — o `Plugins_x64.cfg` passou a ser
  escrito em modo binário com quebras de linha CRLF, evitando que o Ogre
  falhasse ao carregar o plugin. *(KenshiMP.Injector)*
- **Caminho de breadcrumb fixo** — o arquivo de controle deixou de usar um
  caminho fixo do Steam e passou a ser relativo ao executável, funcionando em
  qualquer pasta de instalação. *(KenshiMP.Core)*
- **Proteção contra pacotes malformados** — o tratamento de pacotes de rede
  agora roda dentro de uma guarda estruturada (SEH), evitando que um pacote
  inválido derrube o jogo. *(KenshiMP.Core — net/packet_handler)*
- **Verificação de ponteiros** — adicionada checagem de validade de ponteiro
  (`IsValidPointer`) antes de desreferenciar memória do jogo. *(KenshiMP.Scanner)*
- **Coordenadas fora do mundo** — pacotes com posições absurdas (acima do
  limite do mapa) passam a ser descartados, evitando teleportes/crash. *(net/packet_handler)*

### 🛡️ Segurança e anti-abuso

- **Rate-limit de chat** — algoritmo de *token bucket* limita o volume de
  mensagens por jogador (capacidade 8, recarga 4/s), com tamanho máximo de
  256 caracteres e remoção de caracteres de controle. *(KenshiMP.Server)*
- **Rate-limit de construção** — mesmo mecanismo aplicado a ações de build
  (capacidade 16, recarga 8/s), evitando flood. *(KenshiMP.Server)*

### 🌐 Rede / confiabilidade

- **Sem vazamento de pacotes ENet** — pacotes são destruídos corretamente
  quando o envio falha ou quando o peer se desconecta no meio do broadcast.
  *(KenshiMP.Core — net/client; KenshiMP.Server)*
- **Timeout de conexão assíncrona** — a conexão ao servidor agora tem limite de
  tempo, evitando travamento ao tentar entrar em um host indisponível. *(net/client)*
- **Desconexão limitada (bounded)** — o processo de saída do servidor não trava
  mais indefinidamente. *(net/client)*
- **Checagem de estado do peer** — antes de enviar, o servidor verifica se o
  peer ainda está conectado (`BroadcastPositions` / `BroadcastExcept` /
  `SendTo` / `Broadcast`). *(KenshiMP.Server)*

### 🔄 Sincronização

- **Posições enviadas em lote** — em vez de um pacote por personagem, todas as
  posições "sujas" são agrupadas em um único `C2S_PositionUpdate`
  (limite de 255 por lote), reduzindo drasticamente o tráfego de rede.
  *(KenshiMP.Core — sync/sync_orchestrator)*
- **Limpeza de entidades obsoletas** — entidades sem atualização há mais de
  30 segundos são removidas da interpolação, evitando "fantasmas" parados no
  mapa. *(KenshiMP.Core — sync/interpolation)*

### 🎯 Gameplay

- **Spawn de jogadores 3 a 16** — adicionado *fallback* de template de spawn
  para jogadores além do 1 e 2 (o mod originalmente só trazia Player 1 e 2),
  permitindo sessões com mais participantes. *(KenshiMP.Core — game/spawn_manager)*

### 🖥️ Launcher

- **Layout do menu (F1) e do chat** — corrigida a resolução dos arquivos de
  layout do MyGUI, que agora são carregados de `data/gui/layout/`, fazendo o
  menu (F1) e o chat (Enter) abrirem na posição correta.
- **Inicialização host/cliente** — fluxo de abertura como host revisado
  (`launchHostClient`).

### 📦 Distribuição

- Instalador **NSIS** (MUI2), por usuário (`%LOCALAPPDATA%`), com atalhos no
  Menu Iniciar e na Área de Trabalho, e entrada de desinstalação no registro.
- Idiomas do instalador: **Português (BR)** e **Inglês**.

---

## Componentes

| Componente | Arquivo | Função |
|-----------|---------|--------|
| Core | `KenshiMP.Core.dll` | Plugin Ogre — sincronização, interpolação, pacotes |
| Servidor | `KenshiMP.Server.exe` | Servidor dedicado autoritativo (ENet/UDP) |
| Injector | `KenshiMP.Injector.exe` | Registra o plugin e configura o launcher |
| Launcher | `Kenshi Launcher.exe` | App desktop (Electron + React) |

---

[1.0.2c]: https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/tag/v1.0.2
[1.0.2b]: https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/tag/v1.0.2
[1.0.2a]: https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/tag/v1.0.2
[1.0.2]: https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/tag/v1.0.2
