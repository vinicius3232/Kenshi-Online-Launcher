const fs = require("fs");
const path = require("path");

// Common Steam install locations for Kenshi (appid 233860) on Windows.
const CANDIDATE_PATHS = [
  "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Kenshi",
  "C:\\Program Files\\Steam\\steamapps\\common\\Kenshi",
  "D:\\Steam\\steamapps\\common\\Kenshi",
  "D:\\SteamLibrary\\steamapps\\common\\Kenshi",
  "E:\\Steam\\steamapps\\common\\Kenshi",
  "E:\\SteamLibrary\\steamapps\\common\\Kenshi",
];

function isValidKenshiDir(dir) {
  if (!dir) return false;
  try {
    return (
      fs.existsSync(path.join(dir, "kenshi_x64.exe")) ||
      fs.existsSync(path.join(dir, "data", "Plugins_x64.cfg"))
    );
  } catch {
    return false;
  }
}

function readSteamLibraryFolders() {
  const results = [];
  const steamRoots = [
    "C:\\Program Files (x86)\\Steam",
    "C:\\Program Files\\Steam",
  ];
  for (const root of steamRoots) {
    const vdf = path.join(root, "steamapps", "libraryfolders.vdf");
    if (!fs.existsSync(vdf)) continue;
    try {
      const content = fs.readFileSync(vdf, "utf8");
      const matches = [...content.matchAll(/"path"\s+"([^"]+)"/g)];
      for (const m of matches) {
        const libPath = m[1].replace(/\\\\/g, "\\");
        results.push(path.join(libPath, "steamapps", "common", "Kenshi"));
      }
    } catch {
      // ignore malformed vdf
    }
  }
  return results;
}

function autoDetectKenshiDir() {
  const candidates = [...CANDIDATE_PATHS, ...readSteamLibraryFolders()];
  for (const dir of candidates) {
    if (isValidKenshiDir(dir)) return dir;
  }
  return null;
}

module.exports = { isValidKenshiDir, autoDetectKenshiDir };
