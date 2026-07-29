# Kenshi Online — Launcher (guia de desenvolvimento)

Reconstrução do launcher Electron+React (o código-fonte original da v1.0.2 foi
perdido — só o `.exe` compilado estava publicado). Este é o v2, com o mesmo
comportamento documentado no [`CHANGELOG.md`](CHANGELOG.md), mais:

- Sem dependência obrigatória de Radmin VPN: o `KenshiMP.Server.exe` empacotado
  já tenta UPnP + registro no master server sozinho (`server.cpp` no fork
  [`vinicius3232/Kenshi-Online`](https://github.com/vinicius3232/Kenshi-Online)).
  VPN vira fallback documentado, não passo obrigatório — **testado nesta rede,
  UPnP falhou e o servidor seguiu funcionando localmente com o aviso
  correto**, ver nota de teste abaixo.
- Diagnóstico automático (transforma a tabela de "Problemas comuns" do
  `README.md` em checagens reais contra a instalação do jogador).
- Auto-update via `electron-updater` + GitHub Releases.
- Lista de servidores / favoritos, com *fallback* gracioso caso a ferramenta
  de consulta (`kenshimp-query.exe`, ver abaixo) não esteja presente — o
  próprio menu F1 do mod já tem um "Server Browser" nativo, então isso é
  redundância opcional, não bloqueador.

## Rodando em desenvolvimento

```bash
npm install
npm run electron:dev
```

## Build do instalador

```bash
npm run electron:build
```

Gera o instalador NSIS em `release/`. Requer um ícone em `build/icon.ico`
(ainda não incluído).

## Pasta `resources/`

- `resources/mod/` — `KenshiMP.Core.dll`, `kenshi-online.mod` e os `.layout`,
  copiados do fork do mod (`vinicius3232/Kenshi-Online`, pasta `dist/`).
- `resources/tools/` — `KenshiMP.Server.exe`, `KenshiMP.Injector.exe` e,
  opcionalmente, `kenshimp-query.exe` (ver abaixo). Ao atualizar o mod, é só
  substituir os arquivos aqui.

## Ferramenta de consulta ao master server (`kenshimp-query.exe`)

O fonte está em `KenshiMP.QueryTool/` no fork do mod, adicionado como
**rascunho não compilado** (não havia toolchain C++ disponível no ambiente
onde foi escrito). Para habilitar a lista de servidores no launcher:

1. No fork do mod, confira `KenshiMP.QueryTool/` (main.cpp + CMakeLists.txt)
   e a linha `add_subdirectory(KenshiMP.QueryTool)` no `CMakeLists.txt` raiz.
2. Buildar normalmente (`cmake .. && MSBuild KenshiMP.sln /p:Configuration=Release`).
3. Copiar `KenshiMP.QueryTool.exe` para `resources/tools/kenshimp-query.exe`
   neste projeto.

Sem esse arquivo, a aba "Entrar" simplesmente esconde a lista de servidores e
usa conexão direta (IP:porta) + favoritos — nada quebra.

## Notas de teste (validado contra Kenshi real via Steam)

- `installMod()` tinha dois bugs de path/conteúdo (linha em `__mods.list` com
  extensão `.mod` a mais; `Plugins_x64.cfg` sendo escrito em `data/` em vez da
  raiz do jogo, com prefixo `../` incorreto na linha do plugin) — **corrigidos
  e validados** contra os arquivos reais que o `KenshiMP.Injector` (C++)
  escreve.
- Rodando `installMod()` numa instalação Steam real: todos os 5 checks do
  Diagnóstico ficaram verdes, e o jogo carregou o plugin (`Loading library
  .\KenshiMP.Core` no log do Ogre) e abriu o menu F1 normalmente.
- Rodando `startHost()` com o `KenshiMP.Server.exe` real: o servidor sobe e
  escuta a porta corretamente. UPnP falhou nesta rede (roteador não suporta) e
  a regra de firewall automática também falhou por falta de privilégio de
  administrador — ambos os casos foram tratados sem crash, com aviso claro no
  log. Conclusão prática: sem UPnP funcional nem execução como admin, quem
  hospedar de fora da rede local precisa de Radmin VPN ou liberar a porta
  manualmente — exatamente o que a UI já avisa.
- Ainda não testado: dois jogadores reais se vendo no mundo (precisa de uma
  segunda máquina).

## O que ainda falta antes de publicar

- Ícone (`build/icon.ico`) e assets visuais.
- Testar com dois jogadores reais (máquinas diferentes).
- Configurar o token/segredo de publicação do `electron-builder` para o
  GitHub Releases (`GH_TOKEN`) antes de rodar `electron:build --publish`.
- Decidir e documentar o endereço do master server público (hoje fica em
  branco por padrão — ver `PLANO_OPERACIONAL.md`, Fase 2).
- Compilar e validar o `KenshiMP.QueryTool` (opcional, não bloqueador).
