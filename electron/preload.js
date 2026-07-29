const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("kenshiApi", {
  getConfig: () => ipcRenderer.invoke("config:get"),
  setConfig: (patch) => ipcRenderer.invoke("config:set", patch),

  detectKenshiDir: () => ipcRenderer.invoke("kenshi:detect"),
  browseKenshiDir: () => ipcRenderer.invoke("kenshi:browse"),

  installMod: () => ipcRenderer.invoke("mod:install"),
  runDiagnostics: () => ipcRenderer.invoke("diagnostics:run"),

  startHost: (opts) => ipcRenderer.invoke("server:start", opts),
  stopHost: () => ipcRenderer.invoke("server:stop"),
  isHosting: () => ipcRenderer.invoke("server:status"),
  launchGame: () => ipcRenderer.invoke("game:launch"),

  queryServers: (masterServer, masterPort) =>
    ipcRenderer.invoke("servers:query", { masterServer, masterPort }),

  checkForUpdates: () => ipcRenderer.invoke("update:check"),
  downloadUpdate: () => ipcRenderer.invoke("update:download"),
  installUpdate: () => ipcRenderer.invoke("update:install"),

  onLog: (callback) => {
    const handler = (_event, line) => callback(line);
    ipcRenderer.on("log", handler);
    return () => ipcRenderer.removeListener("log", handler);
  },
  onUpdateStatus: (callback) => {
    const handler = (_event, status) => callback(status);
    ipcRenderer.on("update:status", handler);
    return () => ipcRenderer.removeListener("update:status", handler);
  },

  appVersion: () => ipcRenderer.invoke("app:version"),
});
