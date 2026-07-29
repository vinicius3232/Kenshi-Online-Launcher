const fs = require("fs");
const path = require("path");

const CRLF = "\r\n";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// Appends a line to a text file if it isn't already present, preserving CRLF
// line endings. Used for __mods.list and Plugins_x64.cfg, both of which are
// plain line-oriented config files the game engine is picky about (a stray
// LF-only line has caused load failures before — see CHANGELOG 1.0.2).
function ensureLineInFile(filePath, line) {
  let content = "";
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  }
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n").filter((l) => l.length > 0);
  if (lines.includes(line)) return { changed: false };
  lines.push(line);
  const out = lines.join(CRLF) + CRLF;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, out, { encoding: "utf8" });
  return { changed: true };
}

// Copies the KenshiMP mod + layout files into the target Kenshi install and
// registers the plugin + mod activation. Mirrors exactly what shipped in
// launcher v1.0.2/1.0.2a (see CHANGELOG.md): the previous crash-causing bugs
// were (1) forgetting to copy kenshi-online.mod, (2) forgetting to activate
// it in __mods.list, and (3) writing Plugins_x64.cfg without CRLF.
function installMod(kenshiDir, resourcesDir, log) {
  const steps = [];
  const modResDir = path.join(resourcesDir, "mod");

  // 1. KenshiMP.Core.dll goes in the game root (Plugins_x64.cfg references
  //    it as "../KenshiMP.Core" relative to data/).
  const dllSrc = path.join(modResDir, "KenshiMP.Core.dll");
  const dllDest = path.join(kenshiDir, "KenshiMP.Core.dll");
  if (fs.existsSync(dllSrc)) {
    copyFile(dllSrc, dllDest);
    steps.push("KenshiMP.Core.dll copiado para a pasta do jogo");
  } else {
    steps.push("AVISO: KenshiMP.Core.dll não encontrado nos recursos do launcher");
  }

  // 2. kenshi-online.mod goes to data/ AND mods/kenshi-online/ (both paths
  //    were required to fix the "conecta mas ninguém aparece" bug).
  const modSrc = path.join(modResDir, "kenshi-online.mod");
  if (fs.existsSync(modSrc)) {
    copyFile(modSrc, path.join(kenshiDir, "data", "kenshi-online.mod"));
    copyFile(
      modSrc,
      path.join(kenshiDir, "mods", "kenshi-online", "kenshi-online.mod")
    );
    steps.push("kenshi-online.mod copiado para data/ e mods/kenshi-online/");
  } else {
    steps.push("AVISO: kenshi-online.mod não encontrado nos recursos do launcher");
  }

  // 3. .layout files (F1 menu, chat, HUD) go to data/gui/layout/.
  if (fs.existsSync(modResDir)) {
    const layoutFiles = fs
      .readdirSync(modResDir)
      .filter((f) => f.endsWith(".layout"));
    for (const file of layoutFiles) {
      copyFile(
        path.join(modResDir, file),
        path.join(kenshiDir, "data", "gui", "layout", file)
      );
    }
    if (layoutFiles.length > 0) {
      steps.push(`${layoutFiles.length} arquivo(s) .layout copiado(s) para data/gui/layout/`);
    }
  }

  // 4. Activate the mod in data/__mods.list. The list stores mod names
  //    WITHOUT the .mod extension (confirmed against KenshiMP.Injector's
  //    InstallModFile, which writes exactly "kenshi-online" — an earlier
  //    draft of this function wrote "kenshi-online.mod" here, which the
  //    game would never match against the file on disk).
  const modsListPath = path.join(kenshiDir, "data", "__mods.list");
  const modsListResult = ensureLineInFile(modsListPath, "kenshi-online");
  steps.push(
    modsListResult.changed
      ? "kenshi-online ativado em __mods.list"
      : "kenshi-online já estava ativo em __mods.list"
  );

  // 5. Register the plugin in Plugins_x64.cfg, which lives at the game
  //    ROOT (not data/), and references the plugin by bare name — Ogre's
  //    PluginFolder=.\ in that file resolves relative to the root, so a
  //    "../" prefix would point one level too high. Confirmed against
  //    KenshiMP.Injector's InstallOgrePlugin, which writes exactly
  //    "Plugin=KenshiMP.Core".
  const pluginsCfgPath = path.join(kenshiDir, "Plugins_x64.cfg");
  const pluginResult = ensureLineInFile(pluginsCfgPath, "Plugin=KenshiMP.Core");
  steps.push(
    pluginResult.changed
      ? "Plugin registrado em Plugins_x64.cfg"
      : "Plugin já estava registrado em Plugins_x64.cfg"
  );

  for (const step of steps) log?.(step);
  return { ok: true, steps };
}

module.exports = { installMod, ensureLineInFile };
