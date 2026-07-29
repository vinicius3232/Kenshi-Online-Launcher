const fs = require("fs");
const path = require("path");
const { spawn, execFile } = require("child_process");

let hostProcess = null;

function toolPath(resourcesDir, exeName) {
  return path.join(resourcesDir, "tools", exeName);
}

// Starts the bundled dedicated server (KenshiMP.Server.exe). The server
// itself already handles UPnP port mapping and master-server heartbeat
// registration on startup (see server.cpp) — the launcher does not need to
// reimplement any of that, it just needs to hand it a server.json.
function startHost(resourcesDir, kenshiDir, opts, log) {
  if (hostProcess) {
    throw new Error("Servidor já está em execução.");
  }
  const exe = toolPath(resourcesDir, "KenshiMP.Server.exe");
  if (!fs.existsSync(exe)) {
    throw new Error("KenshiMP.Server.exe não encontrado nos recursos do launcher.");
  }

  const config = {
    serverName: opts.serverName || "Servidor Kenshi Online",
    port: opts.port || 27800,
    maxPlayers: opts.maxPlayers || 16,
    password: opts.password || "",
    pvpEnabled: opts.pvpEnabled ?? true,
    gameSpeed: opts.gameSpeed ?? 1.0,
    tickRate: 20,
    savePath: "world.kmpsave",
    // Empty by default: the user hasn't confirmed a master server is running
    // yet. Direct-connect (IP:port shared manually or via VPN) still works
    // with this blank; filling it in later only adds browser listing.
    masterServer: opts.masterServer || "",
    masterPort: opts.masterPort || 27801,
  };

  const workDir = path.dirname(exe);
  fs.writeFileSync(
    path.join(workDir, "server.json"),
    JSON.stringify(config, null, 2),
    "utf8"
  );

  hostProcess = spawn(exe, [], { cwd: workDir });
  hostProcess.stdout?.on("data", (d) => log?.(d.toString()));
  hostProcess.stderr?.on("data", (d) => log?.(d.toString()));
  hostProcess.on("exit", (code) => {
    log?.(`Servidor encerrado (código ${code}).`);
    hostProcess = null;
  });

  return config;
}

function stopHost() {
  if (hostProcess) {
    hostProcess.kill();
    hostProcess = null;
    return true;
  }
  return false;
}

function isHosting() {
  return hostProcess !== null;
}

// Launches the game via the bundled injector, which registers the plugin
// with Ogre and starts Kenshi. The player connects to a server from inside
// the game's F1 menu (this mirrors the upstream project's flow; the
// launcher's job ends at "the game is running with the mod loaded").
function launchGame(resourcesDir, kenshiDir, log) {
  const exe = toolPath(resourcesDir, "KenshiMP.Injector.exe");
  if (!fs.existsSync(exe)) {
    throw new Error("KenshiMP.Injector.exe não encontrado nos recursos do launcher.");
  }
  const proc = spawn(exe, [kenshiDir], { cwd: path.dirname(exe), detached: true });
  proc.stdout?.on("data", (d) => log?.(d.toString()));
  proc.stderr?.on("data", (d) => log?.(d.toString()));
  proc.unref();
  return true;
}

// Optional server browser: only works if the query CLI tool was built and
// bundled (see docs/QUERY_TOOL.md in the mod fork). Degrades gracefully —
// callers should treat a thrown error as "hide the server browser UI".
function queryServers(resourcesDir, masterServer, masterPort) {
  return new Promise((resolve, reject) => {
    const exe = toolPath(resourcesDir, "kenshimp-query.exe");
    if (!fs.existsSync(exe)) {
      return reject(new Error("QUERY_TOOL_MISSING"));
    }
    execFile(
      exe,
      ["--master", masterServer, "--port", String(masterPort), "--json"],
      { timeout: 5000 },
      (err, stdout) => {
        if (err) return reject(err);
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

module.exports = {
  startHost,
  stopHost,
  isHosting,
  launchGame,
  queryServers,
};
