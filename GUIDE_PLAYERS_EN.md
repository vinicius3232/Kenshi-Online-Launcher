# 🎮 Kenshi Online — Player Guide (step by step)

Simple guide to play Kenshi co-op with friends. **Every player must follow the same steps.**

---

## ✅ Before you start (everyone)

| You need | Where to get it |
|----------|-----------------|
| 🎮 **Kenshi** installed (Steam) | Steam |
| 🪟 **Windows 10 or 11** (64-bit) | — |
| 🌐 **Radmin VPN** (free) | https://www.radmin-vpn.com/ |
| ⬇️ **Kenshi Online installer** | Discord link / GitHub Release |

> ⚠️ **Important:** everyone must use the **latest** installer. If someone installed an older build, **reinstall** with the current link — old versions won't work.

---

## 1️⃣ Install the launcher

1. Download `Kenshi-Online-Setup-1.0.2.exe`.
2. Your browser may warn the file is "not verified" → **Keep / Keep anyway**.
3. Double-click the `.exe`.
4. If **"Windows protected your PC"** appears → **More info** → **Run anyway**.
5. **Next → Install → Finish**.

---

## 2️⃣ Install the mod

1. Open **Kenshi Online** (Desktop shortcut).
2. Click **Install Mod**.
3. Wait for the success confirmation.

> If Kenshi is running, **close the game** before clicking Install Mod.

---

## 3️⃣ Join the VPN (Radmin) — only if needed

Since v2.0, **hosting** no longer strictly requires the VPN: clicking **Host**
makes the launcher try to open the port automatically (UPnP). If it works,
other players just need the **IP:port** the host shares — skip this whole
step.

Use the VPN if UPnP fails (a warning shows in the launcher console) or if
you'd rather keep the group on a private network:

1. Open **Radmin VPN**.
2. Join the **same network** as the group (ask the host for the **network name** and **password**).
3. Confirm the **Connected** (green) status.

> Everyone must be on the **same Radmin network**, otherwise you won't see each other.

---

## 4️⃣ ⭐ Start the game the RIGHT way (most important step)

For players to see each other, **everyone must be in the same "Multiplayer" world**. There are only two valid ways:

### Option A — Start a new world (recommended the first time)
**EVERYONE** does the same:
1. In Kenshi: **New Game**.
2. Pick the start called **"Multiplayer"**.
3. Enter the world (wait until the game actually loads, with your characters on screen).

### Option B — Continue an already-started world
- **Everyone** loads the **SAME save** that was created from the "Multiplayer" start.

> ❌ **Does NOT work:** each person loading their own old single-player save. You will connect ("2 players") but **won't see each other**. It must be the **"Multiplayer"** start or the host's **same** save.

---

## 5️⃣ Connect

1. With the **world already loaded** (you're inside the game):
2. **Host:** start the server from the launcher.
3. **Other players:** join the host's server from the launcher.

🎉 Done — you should now see and move together in the world!

---

## 🎛️ In-game controls

| Key | Action |
|-----|--------|
| `F1` | Open/close the multiplayer menu |
| `Enter` | Open chat |
| `Tab` | Player list |

---

## ❓ Having trouble?

| Problem | Fix |
|---------|-----|
| Anything looks off before playing | **Diagnostics** tab in the launcher — automatically checks the mod is installed, active, and the plugin is registered. |
| Connected but **I can't see the other player** | Did everyone start via the **"Multiplayer"** start? (Step 4). This is the most common mistake. |
| I don't see anyone on the VPN | Is everyone on the **same** Radmin network? (Step 3) — only applies if you're not using UPnP/direct connect. |
| The **F1 menu** or the **chat** doesn't appear | Reopen the launcher → **Install Mod** again (with Kenshi closed). The launcher places the UI files (`.layout`) in `data/gui/layout/` automatically — you do **not** need to copy anything by hand. |
| The game closes by itself on launch | Reopen the launcher → **Install Mod** again. Close Kenshi first. |
| Antivirus deleted the file | Add the Kenshi Online folder as an exception and download again. |
| "Windows protected your PC" | **More info → Run anyway** (unsigned installer, this is normal). |
| I installed an old version | **Reinstall** with the latest link. |

---

## 🧭 Quick recap (cheat sheet)

1. Install launcher → 2. **Install Mod** (game closed) → 3. Join the **same Radmin network** → 4. **New Game → "Multiplayer" start** (EVERYONE) → 5. Host starts the server, the rest connect.

**Golden rule:** if you connect but can't see each other → it's almost always because someone **didn't** use the **"Multiplayer"** start.
