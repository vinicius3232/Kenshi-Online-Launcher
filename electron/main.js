const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const Store = require("electron-store");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

const { autoDetectKenshiDir, isValidKenshiDir } = require("./lib/kenshiPaths");
const { installMod } = require("./lib/installMod");
const { runDiagnostics } = require("./lib/diagnostics");
const serverProcess = require("./lib/serverProcess");

const store = new Store({
  defaults: {
    kenshiDir: null,
    language: "pt-BR",
    hostSettings: {
      serverName: "Servidor Kenshi Online",
      port: 27800,
      maxPlayers: 16,
      password: "",
      masterServer: "",
    },
    favoriteServers: [],
  },
});

autoUpdater.logger = log;
log.transports.file.level = "info";

const resourcesDir = app.isPackaged
  ? path.join(process.resourcesPath)
  : path.join(__dirname, "..", "resources");

let mainWindow = null;

function sendLog(line) {
  log.info(line);
  mainWindow?.webContents.send("log", line);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 680,
    minWidth: 820,
    minHeight: 560,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  if (app.isPackaged) {
    autoUpdater.checkForUpdates().catch((err) => sendLog(`Update check falhou: ${err.message}`));
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  serverProcess.stopHost();
  if (process.platform !== "darwin") app.quit();
});

// ---- IPC: config ----
ipcMain.handle("config:get", () => store.store);
ipcMain.handle("config:set", (_e, patch) => {
  store.set(patch);
  return store.store;
});

// ---- IPC: Kenshi path ----
ipcMain.handle("kenshi:detect", () => {
  const detected = autoDetectKenshiDir();
  if (detected) store.set("kenshiDir", detected);
  return detected;
});

ipcMain.handle("kenshi:browse", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Selecione a pasta de instalação do Kenshi",
    properties: ["openDirectory"],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const dir = result.filePaths[0];
  if (!isValidKenshiDir(dir)) {
    return { error: "Pasta inválida: não parece ser a instalação do Kenshi." };
  }
  store.set("kenshiDir", dir);
  return dir;
});

// ---- IPC: mod install ----
ipcMain.handle("mod:install", () => {
  const kenshiDir = store.get("kenshiDir");
  if (!isValidKenshiDir(kenshiDir)) {
    return { ok: false, error: "Selecione a pasta do Kenshi antes de instalar." };
  }
  try {
    return installMod(kenshiDir, resourcesDir, sendLog);
  } catch (err) {
    sendLog(`Erro ao instalar mod: ${err.message}`);
    return { ok: false, error: err.message };
  }
});

// ---- IPC: diagnostics ----
ipcMain.handle("diagnostics:run", async () => {
  const kenshiDir = store.get("kenshiDir");
  return runDiagnostics(kenshiDir);
});

// ---- IPC: host / server ----
ipcMain.handle("server:start", (_e, opts) => {
  const kenshiDir = store.get("kenshiDir");
  try {
    const config = serverProcess.startHost(resourcesDir, kenshiDir, opts, sendLog);
    store.set("hostSettings", { ...store.get("hostSettings"), ...opts });
    return { ok: true, config };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("server:stop", () => ({ ok: serverProcess.stopHost() }));
ipcMain.handle("server:status", () => serverProcess.isHosting());

// ---- IPC: launch game ----
ipcMain.handle("game:launch", () => {
  const kenshiDir = store.get("kenshiDir");
  if (!isValidKenshiDir(kenshiDir)) {
    return { ok: false, error: "Selecione a pasta do Kenshi antes de jogar." };
  }
  try {
    serverProcess.launchGame(resourcesDir, kenshiDir, sendLog);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ---- IPC: server browser (graceful degrade) ----
ipcMain.handle("servers:query", async (_e, { masterServer, masterPort }) => {
  try {
    const results = await serverProcess.queryServers(resourcesDir, masterServer, masterPort);
    return { ok: true, results };
  } catch (err) {
    return { ok: false, error: err.message === "QUERY_TOOL_MISSING" ? "QUERY_TOOL_MISSING" : err.message };
  }
});

// ---- IPC: updates ----
ipcMain.handle("app:version", () => app.getVersion());

ipcMain.handle("update:check", async () => {
  if (!app.isPackaged) return { ok: false, error: "Auto-update desativado em desenvolvimento." };
  try {
    const result = await autoUpdater.checkForUpdates();
    return { ok: true, updateInfo: result?.updateInfo };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("update:download", async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("update:install", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on("update-available", (info) => {
  mainWindow?.webContents.send("update:status", { state: "available", info });
});
autoUpdater.on("update-not-available", () => {
  mainWindow?.webContents.send("update:status", { state: "not-available" });
});
autoUpdater.on("download-progress", (progress) => {
  mainWindow?.webContents.send("update:status", { state: "downloading", progress });
});
autoUpdater.on("update-downloaded", () => {
  mainWindow?.webContents.send("update:status", { state: "downloaded" });
});
autoUpdater.on("error", (err) => {
  mainWindow?.webContents.send("update:status", { state: "error", error: err.message });
});
