import React, { useEffect, useState, useCallback } from "react";
import { translations, detectInitialLanguage } from "./i18n/translations.js";

const api = window.kenshiApi;

function useT(lang) {
  return translations[lang] || translations.en;
}

function LanguageSwitcher({ lang, setLang }) {
  return (
    <select
      className="lang-switcher"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      title="Idioma / Language / Язык"
    >
      <option value="pt-BR">🇧🇷 Português</option>
      <option value="en">🇬🇧 English</option>
      <option value="ru">🇷🇺 Русский</option>
    </select>
  );
}

function ConsoleLog({ lines, title }) {
  return (
    <div className="console">
      <div className="console-title">{title}</div>
      <div className="console-body">
        {lines.length === 0 ? (
          <div className="console-empty">—</div>
        ) : (
          lines.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>
    </div>
  );
}

function InstallTab({ t, kenshiDir, setKenshiDir, log }) {
  const [installing, setInstalling] = useState(false);
  const [result, setResult] = useState(null);

  const detect = async () => {
    const dir = await api.detectKenshiDir();
    if (dir) setKenshiDir(dir);
  };

  const browse = async () => {
    const res = await api.browseKenshiDir();
    if (!res) return;
    if (typeof res === "string") setKenshiDir(res);
    else if (res.error) log(res.error);
  };

  const install = async () => {
    setInstalling(true);
    setResult(null);
    const res = await api.installMod();
    setResult(res);
    setInstalling(false);
  };

  return (
    <div className="tab-content">
      <label className="field-label">{t.install.kenshiPathLabel}</label>
      <div className="path-row">
        <input readOnly value={kenshiDir || t.install.notSelected} />
        <button onClick={detect}>{t.install.detect}</button>
        <button onClick={browse}>{t.install.browse}</button>
      </div>

      <button
        className="primary-button"
        disabled={!kenshiDir || installing}
        onClick={install}
      >
        {installing ? t.install.installing : t.install.installButton}
      </button>

      {result && (
        <div className={result.ok ? "result-ok" : "result-error"}>
          {result.ok ? t.install.success : `${t.install.failure} ${result.error || ""}`}
        </div>
      )}
    </div>
  );
}

function HostTab({ t, hostSettings, setHostSettings, log }) {
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.isHosting().then(setRunning);
  }, []);

  const start = async () => {
    setBusy(true);
    const res = await api.startHost(hostSettings);
    if (!res.ok) log(res.error);
    setRunning(res.ok);
    setBusy(false);
  };

  const stop = async () => {
    setBusy(true);
    await api.stopHost();
    setRunning(false);
    setBusy(false);
  };

  const field = (key, label, type = "text") => (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        value={hostSettings[key]}
        disabled={running}
        onChange={(e) =>
          setHostSettings({
            ...hostSettings,
            [key]: type === "number" ? Number(e.target.value) : e.target.value,
          })
        }
      />
    </div>
  );

  return (
    <div className="tab-content">
      {field("serverName", t.host.serverName)}
      {field("port", t.host.port, "number")}
      {field("maxPlayers", t.host.maxPlayers, "number")}
      {field("password", t.host.password)}

      <p className="hint">{t.host.upnpNote}</p>

      <button
        className={running ? "danger-button" : "primary-button"}
        disabled={busy}
        onClick={running ? stop : start}
      >
        {running ? t.host.stopButton : t.host.startButton}
      </button>
      <div className={running ? "result-ok" : "result-muted"}>
        {running ? t.host.running : t.host.stopped}
      </div>
    </div>
  );
}

function JoinTab({ t, favorites, setFavorites, log }) {
  const [address, setAddress] = useState("");
  const [browserState, setBrowserState] = useState("idle");

  useEffect(() => {
    api.queryServers("", 27801).then(
      () => setBrowserState("ok"),
      (err) => setBrowserState(err?.message === "QUERY_TOOL_MISSING" ? "unavailable" : "error")
    );
  }, []);

  const launch = async () => {
    const res = await api.launchGame();
    if (!res.ok) log(res.error);
  };

  const addFavorite = () => {
    if (!address || favorites.includes(address)) return;
    setFavorites([...favorites, address]);
  };

  return (
    <div className="tab-content">
      <label className="field-label">{t.join.directConnect}</label>
      <div className="path-row">
        <input
          placeholder={t.join.addressLabel}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={addFavorite}>{t.join.addFavorite}</button>
      </div>

      <label className="field-label">{t.join.favorites}</label>
      <ul className="favorites-list">
        {favorites.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <label className="field-label">{t.join.serverBrowser}</label>
      {browserState === "unavailable" && (
        <p className="hint">{t.join.browserUnavailable}</p>
      )}

      <button className="primary-button" onClick={launch}>
        {t.join.launchButton}
      </button>
      <p className="hint">{t.join.inGameHelp}</p>
    </div>
  );
}

function DiagnosticsTab({ t }) {
  const [items, setItems] = useState([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const res = await api.runDiagnostics();
    setItems(res);
    setRunning(false);
  };

  return (
    <div className="tab-content">
      <button className="primary-button" disabled={running} onClick={run}>
        {running ? t.diagnostics.running : t.diagnostics.runButton}
      </button>
      <ul className="diagnostics-list">
        {items.map((item) => (
          <li key={item.id} className={item.ok ? "diag-ok" : item.optional ? "diag-optional" : "diag-fail"}>
            <span className="diag-status">
              {item.ok ? "✅" : item.optional ? "⚪" : "❌"}
            </span>
            <span className="diag-label">{item.label}</span>
            <span className="diag-detail">{item.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(detectInitialLanguage());
  const [tab, setTab] = useState("install");
  const [kenshiDir, setKenshiDirState] = useState(null);
  const [hostSettings, setHostSettingsState] = useState({
    serverName: "Servidor Kenshi Online",
    port: 27800,
    maxPlayers: 16,
    password: "",
    masterServer: "",
  });
  const [favorites, setFavoritesState] = useState([]);
  const [logLines, setLogLines] = useState([]);
  const [version, setVersion] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);

  const t = useT(lang);

  const log = useCallback((line) => {
    setLogLines((prev) => [...prev.slice(-199), String(line)]);
  }, []);

  useEffect(() => {
    api.getConfig().then((cfg) => {
      if (cfg.language) setLang(cfg.language);
      if (cfg.kenshiDir) setKenshiDirState(cfg.kenshiDir);
      if (cfg.hostSettings) setHostSettingsState(cfg.hostSettings);
      if (cfg.favoriteServers) setFavoritesState(cfg.favoriteServers);
    });
    api.appVersion().then(setVersion);
    const off = api.onLog(log);
    const offUpdate = api.onUpdateStatus(setUpdateStatus);
    return () => {
      off();
      offUpdate();
    };
  }, [log]);

  const setLangPersist = (value) => {
    setLang(value);
    api.setConfig({ language: value });
  };
  const setKenshiDir = (dir) => {
    setKenshiDirState(dir);
    api.setConfig({ kenshiDir: dir });
  };
  const setHostSettings = (value) => {
    setHostSettingsState(value);
    api.setConfig({ hostSettings: value });
  };
  const setFavorites = (value) => {
    setFavoritesState(value);
    api.setConfig({ favoriteServers: value });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t.appTitle}</h1>
        <div className="header-right">
          <span className="version">v{version}</span>
          <LanguageSwitcher lang={lang} setLang={setLangPersist} />
        </div>
      </header>

      {updateStatus && (
        <div className="update-banner">
          {updateStatus.state === "available" && t.update.available}
          {updateStatus.state === "downloading" &&
            `${t.update.downloading} ${Math.round(updateStatus.progress?.percent || 0)}%`}
          {updateStatus.state === "downloaded" && (
            <>
              {t.update.downloaded}{" "}
              <button onClick={() => api.installUpdate()}>{t.update.restart}</button>
            </>
          )}
        </div>
      )}

      <nav className="tabs">
        {Object.entries(t.tabs).map(([key, label]) => (
          <button
            key={key}
            className={tab === key ? "tab active" : "tab"}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main>
        {tab === "install" && (
          <InstallTab t={t} kenshiDir={kenshiDir} setKenshiDir={setKenshiDir} log={log} />
        )}
        {tab === "host" && (
          <HostTab t={t} hostSettings={hostSettings} setHostSettings={setHostSettings} log={log} />
        )}
        {tab === "join" && (
          <JoinTab t={t} favorites={favorites} setFavorites={setFavorites} log={log} />
        )}
        {tab === "diagnostics" && <DiagnosticsTab t={t} />}
      </main>

      <ConsoleLog lines={logLines} title={t.common.console} />
    </div>
  );
}
