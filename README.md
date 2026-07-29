<div align="center">

# 🎮 Kenshi Online

**Multiplayer co-op não-oficial para [Kenshi](https://store.steampowered.com/app/233860/Kenshi/)**

Jogue Kenshi com seus amigos na mesma sessão, via VPN, com um launcher simples de "baixar e jogar".

[![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.2-blue.svg)](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/latest)
[![Plataforma](https://img.shields.io/badge/plataforma-Windows%2010%2F11-success.svg)]()
[![Download](https://img.shields.io/badge/⬇️-Baixar%20instalador-brightgreen.svg)](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/download/v1.0.2/Kenshi-Online-Setup-1.0.2.exe)

**🌍 Idioma:** **Português** · [English](README.en.md) · [Русский](README.ru.md)

</div>

---

## 📥 Download

➡️ **[Baixar o instalador mais recente (v1.0.2)](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/latest)**

Ou link direto: [`Kenshi-Online-Setup-1.0.2.exe`](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/download/v1.0.2/Kenshi-Online-Setup-1.0.2.exe) (~100 MB)

---

## 🌍 Guia do jogador / Player guide / Руководство

O launcher tem **seletor de idioma** (🌐 canto superior direito): **Português · English · Русский**.

| Idioma | Guia passo a passo |
|--------|--------------------|
| 🇧🇷 Português | [`GUIA_JOGADORES.md`](GUIA_JOGADORES.md) |
| 🇬🇧 English | [`GUIDE_PLAYERS_EN.md`](GUIDE_PLAYERS_EN.md) |
| 🇷🇺 Русский | [`GUIDE_PLAYERS_RU.md`](GUIDE_PLAYERS_RU.md) |

---

## ✨ O que é

O **Kenshi Online** adiciona multiplayer cooperativo ao Kenshi (que é um jogo originalmente single-player). Ele é composto por:

- **Launcher** — um aplicativo desktop (Electron + React) que instala o mod, gerencia o servidor e abre o jogo.
- **Mod KenshiMP** — um conjunto de plugins em C++ que injeta a camada de rede no motor do jogo (Ogre/ENet), sincronizando personagens, posições e chat entre os jogadores.

A conexão entre os jogadores é feita por **VPN (Radmin VPN)**, criando uma rede local virtual — sem necessidade de abrir portas no roteador.

> ✅ **Instalação automática:** ao clicar em **Instalar Mod**, o launcher coloca os arquivos de interface (`.layout`) em `data/gui/layout/`, ativa o mod em `data/__mods.list` e registra o plugin no `Plugins_x64.cfg` sozinho. Nada de copiar arquivo na mão — esse é justamente o erro mais comum em instalações manuais (menu **F1**/chat que não abre).

---

## 🧩 Requisitos

| Requisito | Detalhe |
|-----------|---------|
| 🪟 Sistema | Windows 10 ou 11 (64-bit) |
| 🎮 Jogo | **Kenshi** instalado (Steam) |
| 🌐 VPN | [**Radmin VPN**](https://www.radmin-vpn.com/) (gratuito) — fallback caso o UPnP falhe ao hospedar |
| 👥 Jogadores | Suporta até **16** jogadores na mesma sessão |

---

## 🚀 Instalação (passo a passo)

### 1️⃣ Baixar o instalador
Baixe o [`Kenshi-Online-Setup-1.0.2.exe`](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/download/v1.0.2/Kenshi-Online-Setup-1.0.2.exe).

> ⚠️ O navegador pode avisar que o arquivo "não é verificado". Isso é normal (instalador sem assinatura digital paga). Clique em **Manter / Manter mesmo assim**.

### 2️⃣ Rodar o instalador
- Duplo clique no `.exe`.
- Se o Windows mostrar a tela **"Windows protegeu o computador"** → **Mais informações** → **Executar assim mesmo**.
- Avance: **Avançar → Instalar → Concluir**.

### 3️⃣ Instalar o mod
- Abra o **Kenshi Online** (atalho na Área de Trabalho).
- Clique em **Instalar Mod** e aguarde a confirmação.

### 4️⃣ Entrar na VPN (só se hospedar não abrir a porta sozinho)
- Abra o **Radmin VPN**.
- Entre na rede do grupo (peça **nome da rede** e **senha** ao host).
- Confirme o status **Conectado**.

### 5️⃣ Jogar
- No launcher, entre no servidor do host.
- Dentro do jogo:
  - **F1** → menu do multiplayer
  - **Enter** → chat

🎉 Pronto!

---

## 🎛️ Controles in-game

| Tecla | Ação |
|-------|------|
| `F1` | Abre/fecha o menu do multiplayer |
| `Enter` | Abre o chat |

---

## 🏗️ Arquitetura técnica

```
┌─────────────────────────────────────────────────────────┐
│                    KENSHI ONLINE                          │
├─────────────────────────────────────────────────────────┤
│  Launcher (Electron + React 19 + Vite)                    │
│   └─ Instala o mod, sobe o servidor e abre o jogo         │
├─────────────────────────────────────────────────────────┤
│  Mod KenshiMP (C++)                                       │
│   ├─ KenshiMP.Core.dll    → plugin Ogre (rede no jogo)    │
│   ├─ KenshiMP.Server.exe  → servidor dedicado (ENet/UDP)  │
│   └─ KenshiMP.Injector.exe → registra o plugin no jogo    │
├─────────────────────────────────────────────────────────┤
│  Transporte: ENet (UDP)  •  Rede: Radmin VPN              │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
- `KenshiMP.Core` — plugin carregado pelo Ogre (`Plugins_x64.cfg`), faz sincronização de estado, interpolação e tratamento de pacotes.
- `KenshiMP.Server` — servidor dedicado autoritativo, gerencia jogadores conectados, broadcast de posições e chat.
- `KenshiMP.Injector` — registra o plugin e configura o caminho do launcher.

---

## 🛠️ Melhorias e correções

Veja o histórico completo de mudanças no **[CHANGELOG.md](CHANGELOG.md)**.

**Destaques da v1.0.2:**
- 🐛 Correção do crash "jogo fecha após instalar o mod".
- 🛡️ Proteções anti-crash no tratamento de pacotes de rede.
- 🚦 Rate-limiting de chat e construção (anti-spam/flood).
- 🔄 Sincronização de posição em lote (menos tráfego de rede).
- 🎯 Suporte a spawn de jogadores 3 a 16.
- 🖥️ Correção de layout do menu (F1) e do chat.

**Destaques da v2.0.0 (em progresso):**
- 📂 **Código-fonte do launcher publicado** — o app deixou de existir só como
  binário compilado; agora é possível revisar, compilar e contribuir.
- 🩺 Aba de **Diagnóstico**, que transforma a tabela de "Problemas comuns"
  abaixo em checagens automáticas (mod instalado, ativo, plugin registrado).
- 🔌 **Hospedar sem depender obrigatoriamente do Radmin VPN** — o
  `KenshiMP.Server.exe` já tenta abrir a porta sozinho via UPnP (com
  aviso claro quando isso falha e recomendação de VPN/porta manual).
- ⬆️ Auto-update via GitHub Releases.
- 🧭 Ver [`PLANO_OPERACIONAL.md`](PLANO_OPERACIONAL.md) para o roteiro até o
  lançamento e o que ainda falta validar.

---

## 👩‍💻 Compilando o launcher do fonte

```bash
npm install
npm run electron:dev     # desenvolvimento
npm run electron:build   # gera o instalador NSIS em release/
```

Veja mais detalhes (estrutura de pastas, notas de teste, o que falta antes de
publicar) em [`LAUNCHER_DEV.md`](LAUNCHER_DEV.md), e o roteiro completo em
[`PLANO_OPERACIONAL.md`](PLANO_OPERACIONAL.md).

---

## ❓ Problemas comuns

| Problema | Solução |
|----------|---------|
| Não vejo ninguém na VPN | Todos precisam estar na **mesma rede** do Radmin VPN. |
| O jogo fecha sozinho | Reabra o launcher e clique em **Instalar Mod** novamente. |
| Antivírus apagou o arquivo | Adicione a pasta do Kenshi Online como exceção e baixe de novo. |
| Tela azul do Windows ao abrir | **Mais informações → Executar assim mesmo**. |

---

## 🙏 Créditos / Projeto original

Este projeto é baseado no **[The404Studios/Kenshi-Online](https://github.com/The404Studios/Kenshi-Online)** — o projeto principal e original de multiplayer para Kenshi (mod KenshiMP).

> **O Kenshi Online (este repositório) é apenas uma forma de simplificar a ideia:** um launcher "baixar e jogar" + instalador, para que jogadores não-técnicos consigam usar o trabalho do projeto original sem precisar compilar nada. **Todo o crédito da tecnologia de multiplayer vai para o [The404Studios/Kenshi-Online](https://github.com/The404Studios/Kenshi-Online)** e à comunidade que contribui com ele.

Se você quer o projeto completo, em desenvolvimento ativo e com todo o histórico, vá direto à fonte: **https://github.com/The404Studios/Kenshi-Online**

---

## ⚖️ Aviso legal

Projeto **não-oficial**, feito por fãs. Kenshi é uma marca da **Lo-Fi Games**. Este projeto não é afiliado, patrocinado ou endossado pela Lo-Fi Games. Use por sua conta e risco.

---

<div align="center">

Feito com ❤️ pela comunidade • [Reportar um problema](https://github.com/vinicius3232/Kenshi-Online-Launcher/issues)

</div>
