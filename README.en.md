<div align="center">

# 🎮 Kenshi Online

**Unofficial co-op multiplayer for [Kenshi](https://store.steampowered.com/app/233860/Kenshi/)**

Play Kenshi with your friends in the same session, over VPN, with a simple "download and play" launcher.

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/latest)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-success.svg)]()
[![Download](https://img.shields.io/badge/⬇️-Download%20installer-brightgreen.svg)](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/download/v1.0.2/Kenshi-Online-Setup-1.0.2.exe)

**🌍 Language:** [Português](README.md) · **English** · [Русский](README.ru.md)

</div>

---

## 📥 Download

➡️ **[Download the latest installer (v1.0.2)](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/latest)**

Or direct link: [`Kenshi-Online-Setup-1.0.2.exe`](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/download/v1.0.2/Kenshi-Online-Setup-1.0.2.exe) (~100 MB)

---

## 🌍 Player guide

The launcher has a **language selector** (🌐 top-right corner): **Português · English · Русский**.

| Language | Step-by-step guide |
|----------|--------------------|
| 🇧🇷 Português | [`GUIA_JOGADORES.md`](GUIA_JOGADORES.md) |
| 🇬🇧 English | [`GUIDE_PLAYERS_EN.md`](GUIDE_PLAYERS_EN.md) |
| 🇷🇺 Русский | [`GUIDE_PLAYERS_RU.md`](GUIDE_PLAYERS_RU.md) |

---

## ✨ What it is

**Kenshi Online** adds cooperative multiplayer to Kenshi (originally a single-player game). It is made of:

- **Launcher** — a desktop app (Electron + React) that installs the mod, manages the server and launches the game.
- **KenshiMP mod** — a set of C++ plugins that inject the network layer into the game engine (Ogre/ENet), syncing characters, positions and chat between players.

Players connect over **VPN (Radmin VPN)**, creating a virtual local network — no need to open router ports.

---

## 🧩 Requirements

| Requirement | Detail |
|-------------|--------|
| 🪟 System | Windows 10 or 11 (64-bit) |
| 🎮 Game | **Kenshi** installed (Steam) |
| 🌐 VPN | [**Radmin VPN**](https://www.radmin-vpn.com/) (free) |
| 👥 Players | Supports up to **16** players in the same session |

---

## 🚀 Installation (step by step)

### 1️⃣ Download the installer
Download [`Kenshi-Online-Setup-1.0.2.exe`](https://github.com/vinicius3232/Kenshi-Online-Launcher/releases/download/v1.0.2/Kenshi-Online-Setup-1.0.2.exe).

> ⚠️ Your browser may warn that the file is "not verified". This is normal (installer without a paid digital signature). Click **Keep / Keep anyway**.

### 2️⃣ Run the installer
- Double-click the `.exe`.
- If Windows shows **"Windows protected your PC"** → **More info** → **Run anyway**.
- Continue: **Next → Install → Finish**.

### 3️⃣ Install the mod
- Open **Kenshi Online** (Desktop shortcut).
- Click **Install Mod** and wait for confirmation.

### 4️⃣ Join the VPN
- Open **Radmin VPN**.
- Join the group's network (ask the host for the **network name** and **password**).
- Confirm the **Connected** status.

### 5️⃣ Play
- In the launcher, join the host's server.
- In-game:
  - **F1** → multiplayer menu
  - **Enter** → chat

🎉 Done!

---

## 🎛️ In-game controls

| Key | Action |
|-----|--------|
| `F1` | Open/close the multiplayer menu |
| `Enter` | Open chat |

---

## 🏗️ Technical architecture

```
┌─────────────────────────────────────────────────────────┐
│                    KENSHI ONLINE                          │
├─────────────────────────────────────────────────────────┤
│  Launcher (Electron + React 19 + Vite)                    │
│   └─ Installs the mod, starts the server, launches game   │
├─────────────────────────────────────────────────────────┤
│  KenshiMP mod (C++)                                       │
│   ├─ KenshiMP.Core.dll    → Ogre plugin (in-game net)    │
│   ├─ KenshiMP.Server.exe  → dedicated server (ENet/UDP)  │
│   └─ KenshiMP.Injector.exe → registers the plugin        │
├─────────────────────────────────────────────────────────┤
│  Transport: ENet (UDP)  •  Network: Radmin VPN           │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- `KenshiMP.Core` — plugin loaded by Ogre (`Plugins_x64.cfg`); handles state sync, interpolation and packet processing.
- `KenshiMP.Server` — authoritative dedicated server; manages connected players, position broadcasts and chat.
- `KenshiMP.Injector` — registers the plugin and configures the launcher path.

---

## 🛠️ Improvements and fixes

See the full change history in **[CHANGELOG.md](CHANGELOG.md)**.

**v1.0.2 highlights:**
- 🐛 Fixed the "game closes after installing the mod" crash.
- 🛡️ Anti-crash protections in network packet handling.
- 🚦 Chat and build rate-limiting (anti-spam/flood).
- 🔄 Batched position sync (less network traffic).
- 🎯 Support for spawning players 3 through 16.
- 🖥️ Fixed the menu (F1) and chat layout.

---

## ❓ Common issues

| Problem | Fix |
|---------|-----|
| I don't see anyone on the VPN | Everyone must be on the **same** Radmin VPN network. |
| The game closes by itself | Reopen the launcher and click **Install Mod** again. |
| Antivirus deleted the file | Add the Kenshi Online folder as an exception and download again. |
| Windows blue screen on launch | **More info → Run anyway**. |

---

## 🙏 Credits / Original project

This project is based on **[The404Studios/Kenshi-Online](https://github.com/The404Studios/Kenshi-Online)** — the main, original Kenshi multiplayer project (the KenshiMP mod).

> **Kenshi Online (this repository) is just a way to simplify the idea:** a "download and play" launcher + installer, so non-technical players can use the original project's work without compiling anything. **All credit for the multiplayer technology goes to [The404Studios/Kenshi-Online](https://github.com/The404Studios/Kenshi-Online)** and the community that contributes to it.

If you want the full project, in active development with the complete history, go straight to the source: **https://github.com/The404Studios/Kenshi-Online**

---

## ⚖️ Legal notice

**Unofficial**, fan-made project. Kenshi is a trademark of **Lo-Fi Games**. This project is not affiliated with, sponsored by, or endorsed by Lo-Fi Games. Use at your own risk.

---

<div align="center">

Made with ❤️ by the community • [Report an issue](https://github.com/vinicius3232/Kenshi-Online-Launcher/issues)

</div>
