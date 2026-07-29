const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { isValidKenshiDir } = require("./kenshiPaths");

function fileContainsLine(filePath, line) {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  return content.split("\n").includes(line);
}

function checkProcessRunning(processName) {
  return new Promise((resolve) => {
    exec(
      `tasklist /FI "IMAGENAME eq ${processName}" /NH`,
      (err, stdout) => {
        if (err) return resolve(false);
        resolve(stdout.toLowerCase().includes(processName.toLowerCase()));
      }
    );
  });
}

// Turns the launcher's own FAQ table (README "Problemas comuns") into
// automated checks, instead of leaving the user to read prose and guess.
async function runDiagnostics(kenshiDir) {
  const results = [];

  const kenshiOk = isValidKenshiDir(kenshiDir);
  results.push({
    id: "kenshi-path",
    ok: kenshiOk,
    label: "Pasta do Kenshi",
    detail: kenshiOk
      ? kenshiDir
      : "Pasta do Kenshi não encontrada ou inválida. Selecione manualmente.",
  });

  if (kenshiOk) {
    const dllPath = path.join(kenshiDir, "KenshiMP.Core.dll");
    const dllOk = fs.existsSync(dllPath);
    results.push({
      id: "core-dll",
      ok: dllOk,
      label: "KenshiMP.Core.dll instalado",
      detail: dllOk ? dllPath : "Não encontrado. Clique em Instalar Mod novamente.",
    });

    const modPath = path.join(kenshiDir, "data", "kenshi-online.mod");
    const modOk = fs.existsSync(modPath);
    results.push({
      id: "mod-file",
      ok: modOk,
      label: "kenshi-online.mod instalado",
      detail: modOk ? modPath : "Não encontrado. Clique em Instalar Mod novamente.",
    });

    const modsListPath = path.join(kenshiDir, "data", "__mods.list");
    const modsListOk = fileContainsLine(modsListPath, "kenshi-online");
    results.push({
      id: "mods-list",
      ok: modsListOk,
      label: "Mod ativo em __mods.list",
      detail: modsListOk
        ? "Ativado"
        : "Mod não está ativo — este é o erro clássico de 'conecta mas ninguém aparece'.",
    });

    const pluginsCfgPath = path.join(kenshiDir, "Plugins_x64.cfg");
    const pluginOk = fileContainsLine(pluginsCfgPath, "Plugin=KenshiMP.Core");
    results.push({
      id: "plugin-registered",
      ok: pluginOk,
      label: "Plugin registrado em Plugins_x64.cfg",
      detail: pluginOk
        ? "Registrado"
        : "Não registrado — o menu F1/chat não vai abrir.",
    });
  }

  const radminRunning = await checkProcessRunning("RvSrvc.exe");
  results.push({
    id: "radmin-vpn",
    ok: radminRunning,
    label: "Radmin VPN em execução",
    detail: radminRunning
      ? "Rodando"
      : "Não detectado. Necessário apenas se você não usar UPnP/conexão direta.",
    optional: true,
  });

  return results;
}

module.exports = { runDiagnostics };
