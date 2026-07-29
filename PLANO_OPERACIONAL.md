# Plano — Kenshi Online Launcher v2 até "operacional"

Estado atual: launcher Electron+React reconstruído e testado localmente (build
limpo, app abre), com binários reais embutidos. **Nada foi compilado do lado
C++ nem publicado.** Este plano cobre o caminho até um instalador que um
jogador real baixa e usa.

Convenção: 🔴 bloqueador (nada depois anda sem isso) · 🟡 importante, não trava
· 🟢 opcional/polish.

---

## Fase 0 — Toolchain C++ (🔴 pré-requisito de tudo no mod)

Esta máquina não tem MSVC/CMake. Sem isso, não dá pra compilar o
`KenshiMP.QueryTool` nem revalidar o resto do mod.

- [ ] Instalar **Visual Studio 2022** (Community) com workload "Desktop
      development with C++" + Windows 10/11 SDK
- [ ] Instalar **CMake ≥ 3.20** (se não vier com o VS)
- [ ] Clonar `vinicius3232/Kenshi-Online` (o fork real, não o docs-only) numa
      pasta de trabalho permanente — hoje ele só existe em clone temporário
- [ ] Buildar o projeto como está (`cmake .. && MSBuild KenshiMP.sln
      /p:Configuration=Release /p:Platform=x64`) e confirmar que gera os
      `.exe`/`.dll` sem erro, **antes** de aplicar qualquer patch novo

Critério de pronto: `build/bin/Release/KenshiMP.Core.dll` existe e bate em
tamanho com o que já está em `resources/mod/` do launcher.

---

## Fase 1 — Aplicar e validar o KenshiMP.QueryTool (🔴 bloqueia lista de servidores)

- [ ] Copiar `kenshimp-patches/KenshiMP.QueryTool/` para a raiz do fork
- [ ] Adicionar `add_subdirectory(KenshiMP.QueryTool)` no `CMakeLists.txt`
      raiz (depois da linha do `KenshiMP.TestClient`)
- [ ] Rebuildar e resolver eventuais erros de compilação (não foi validado
      pelo Claude — é código novo, tratar como rascunho)
- [ ] Testar manualmente: `KenshiMP.QueryTool.exe --master 162.248.94.149
      --port 27801 --json` e conferir se sai um JSON válido (mesmo que vazio)
- [ ] Copiar o `.exe` resultante para
      `kenshi-online-launcher/resources/tools/kenshimp-query.exe`
- [ ] Abrir o launcher (`npm run electron:dev`) e confirmar que a aba
      "Entrar" para de mostrar "lista indisponível"

Se travar em compilação e não quiser gastar tempo agora: **pule esta fase**.
O launcher já degrada bem sem o QueryTool (conexão direta + favoritos
continuam funcionando) — não é bloqueador pra "operacional", só pra "servidor
browser bonito".

---

## Fase 2 — Decidir a história do master server (🔴 decisão, não código)

O `server.json` do seu fork já vem com um master server de terceiros
hardcoded (`162.248.94.149:27801`, presumivelmente do The404Studios/da
comunidade). Três caminhos:

- [ ] **Opção A (mais simples):** usar esse master server público como
      padrão, creditando a origem — só funciona se ele realmente estiver no
      ar hoje (testar com o QueryTool da Fase 1 antes de assumir isso)
- [ ] **Opção B:** subir seu próprio `KenshiMP.MasterServer.exe` num VPS
      barato (ele já existe compilado, é só rodar e abrir a porta 27801/UDP)
- [ ] **Opção C:** não usar master server agora — lançar só com conexão
      direta (IP:porta) + Radmin VPN como fallback documentado, e adicionar
      lista de servidores depois

Recomendo **C para o primeiro lançamento** (zero infra nova, zero custo
recorrente) e B como evolução se o projeto pegar tração.

---

## Fase 3 — Validação end-to-end com Kenshi real (🔴 antes de qualquer release)

- [ ] Rodar `npm run electron:dev` numa máquina com Kenshi instalado de
      verdade (Steam)
- [ ] Testar "Detectar automaticamente" e "Selecionar pasta" — os caminhos
      hardcoded em `kenshiPaths.js` cobrem Steam padrão e algumas
      SteamLibrary alternativas, mas isso não foi testado contra uma
      instalação real ainda
- [ ] Clicar "Instalar Mod" e conferir manualmente: `KenshiMP.Core.dll` na
      raiz, `kenshi-online.mod` em `data/` e `mods/kenshi-online/`, `.layout`
      em `data/gui/layout/`, linha nova em `__mods.list` e em
      `Plugins_x64.cfg` (abrir os arquivos e olhar — não só confiar no "OK"
      da UI)
- [ ] Rodar "Diagnóstico" e confirmar que os 5 checks refletem a realidade
- [ ] Testar "Hospedar" numa máquina e "Abrir o jogo" + conectar em outra
      (ou duas VMs/PCs) — **este é o teste que garante que o produto
      funciona**, tudo antes disso é só "compila e abre"
- [ ] Confirmar UPnP mapeando a porta sozinho (log do `KenshiMP.Server.exe`
      deve mostrar "UPnP mapped!") ou, se o roteador não suportar, confirmar
      que o fallback (firewall rule / Radmin VPN) funciona

Critério de pronto: dois jogadores em máquinas diferentes se veem no mundo,
sem passo manual além do que a UI do launcher pede.

---

## Fase 4 — Empacotamento (🟡)

- [ ] Criar `build/icon.ico` (256×256, o `image-gen` skill pode gerar um
      placeholder se você não tiver um logo pronto)
- [ ] Rodar `npm run electron:build` e testar o instalador NSIS gerado:
      instala, cria atalhos, desinstala limpo
- [ ] Confirmar que o instalador não fica marcado como malware óbvio
      (rodar pelo VirusTotal público é aceitável antes de distribuir — não
      preciso fazer eu mesmo, mas documente o resultado)
- [ ] (Opcional, custa dinheiro) Avaliar certificado de assinatura de código
      — resolve o aviso do SmartScreen que hoje está no seu próprio FAQ

---

## Fase 5 — Publicação (🔴 decisão sua antes de eu tocar em nada remoto)

- [ ] Decidir: o código novo substitui o conteúdo do repo
      `Kenshi-Online-Launcher` (hoje só docs) ou vira repo separado
      (`Kenshi-Online-Launcher-App`, por exemplo)?
- [ ] Gerar um `GH_TOKEN` (permissão `repo`) e configurar como variável de
      ambiente pra `electron-builder --publish` conseguir subir pro GitHub
      Releases
- [ ] Taguear `v2.0.0`, rodar `npm run electron:build -- --publish always`
- [ ] Atualizar `README.md`/`CHANGELOG.md` do repo público com o novo fluxo
      (sem Radmin VPN obrigatório, diagnóstico, auto-update)
- [ ] Depois do primeiro release: testar o **fluxo de auto-update de verdade**
      — instalar a v2.0.0, publicar uma v2.0.1 fake, confirmar que o launcher
      detecta, baixa e oferece reiniciar

---

## Fase 6 — Pós-lançamento (🟢 contínuo)

- [ ] Abrir Issues template no GitHub pra facilitar reporte de bug
- [ ] Repetir a Fase 3 (teste com Kenshi real) a cada mudança no mod/launcher
      antes de taguear — é exatamente a ausência disso que causou os 4
      hotfixes (1.0.2 → 1.0.2c) na versão anterior
- [ ] Revisitar Fase 2 (master server próprio) se a base de jogadores crescer

---

## Ordem recomendada pra você começar amanhã

1. Fase 0 (toolchain) — sem isso nada do lado C++ anda
2. Fase 3 primeiro teste manual (instalar mod numa máquina real) — valida se
   o que já existe funciona antes de investir mais tempo
3. Fase 2 opção C (sem master server) pra não bloquear o resto
4. Fase 3 completo (dois jogadores) — é o gate real de "funciona"
5. Fase 4 e 5 (empacotar e publicar)
6. Fase 1 (QueryTool) e Fase 2 opção B como evolução, não pré-requisito
