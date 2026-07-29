export const translations = {
  "pt-BR": {
    appTitle: "Kenshi Online",
    tabs: { install: "Instalar", host: "Hospedar", join: "Entrar", diagnostics: "Diagnóstico" },
    install: {
      kenshiPathLabel: "Pasta do Kenshi",
      detect: "Detectar automaticamente",
      browse: "Selecionar pasta...",
      notSelected: "Nenhuma pasta selecionada",
      installButton: "Instalar Mod",
      installing: "Instalando...",
      success: "Mod instalado com sucesso.",
      failure: "Falha ao instalar o mod.",
    },
    host: {
      serverName: "Nome do servidor",
      port: "Porta",
      maxPlayers: "Máx. jogadores",
      password: "Senha (opcional)",
      startButton: "Hospedar servidor",
      stopButton: "Parar servidor",
      running: "Servidor rodando",
      stopped: "Servidor parado",
      upnpNote:
        "O servidor tenta abrir a porta automaticamente (UPnP). Se seu roteador não suportar, use Radmin VPN ou libere a porta manualmente.",
    },
    join: {
      directConnect: "Conexão direta",
      addressLabel: "Endereço (IP:porta)",
      launchButton: "Abrir o jogo",
      favorites: "Favoritos",
      addFavorite: "Adicionar aos favoritos",
      serverBrowser: "Lista de servidores",
      browserUnavailable:
        "Lista de servidores indisponível nesta versão — use conexão direta ou adicione um favorito.",
      inGameHelp: "Dentro do jogo: F1 abre o menu multiplayer, Enter abre o chat.",
    },
    diagnostics: {
      runButton: "Rodar diagnóstico",
      running: "Verificando...",
      ok: "OK",
      problem: "Problema",
      optional: "Opcional",
    },
    update: {
      checking: "Procurando atualizações...",
      available: "Atualização disponível",
      downloading: "Baixando atualização...",
      downloaded: "Atualização baixada. Reiniciar para instalar?",
      restart: "Reiniciar agora",
      later: "Depois",
      upToDate: "Você está na versão mais recente.",
    },
    common: { language: "Idioma", console: "Console" },
  },

  en: {
    appTitle: "Kenshi Online",
    tabs: { install: "Install", host: "Host", join: "Join", diagnostics: "Diagnostics" },
    install: {
      kenshiPathLabel: "Kenshi folder",
      detect: "Auto-detect",
      browse: "Browse...",
      notSelected: "No folder selected",
      installButton: "Install Mod",
      installing: "Installing...",
      success: "Mod installed successfully.",
      failure: "Failed to install the mod.",
    },
    host: {
      serverName: "Server name",
      port: "Port",
      maxPlayers: "Max players",
      password: "Password (optional)",
      startButton: "Host server",
      stopButton: "Stop server",
      running: "Server running",
      stopped: "Server stopped",
      upnpNote:
        "The server tries to open the port automatically (UPnP). If your router doesn't support it, use Radmin VPN or forward the port manually.",
    },
    join: {
      directConnect: "Direct connect",
      addressLabel: "Address (IP:port)",
      launchButton: "Launch game",
      favorites: "Favorites",
      addFavorite: "Add to favorites",
      serverBrowser: "Server browser",
      browserUnavailable:
        "Server browser unavailable in this build — use direct connect or add a favorite.",
      inGameHelp: "In-game: F1 opens the multiplayer menu, Enter opens chat.",
    },
    diagnostics: {
      runButton: "Run diagnostics",
      running: "Checking...",
      ok: "OK",
      problem: "Problem",
      optional: "Optional",
    },
    update: {
      checking: "Checking for updates...",
      available: "Update available",
      downloading: "Downloading update...",
      downloaded: "Update downloaded. Restart to install?",
      restart: "Restart now",
      later: "Later",
      upToDate: "You're on the latest version.",
    },
    common: { language: "Language", console: "Console" },
  },

  ru: {
    appTitle: "Kenshi Online",
    tabs: { install: "Установка", host: "Хост", join: "Подключиться", diagnostics: "Диагностика" },
    install: {
      kenshiPathLabel: "Папка Kenshi",
      detect: "Автоопределение",
      browse: "Выбрать папку...",
      notSelected: "Папка не выбрана",
      installButton: "Установить мод",
      installing: "Установка...",
      success: "Мод успешно установлен.",
      failure: "Не удалось установить мод.",
    },
    host: {
      serverName: "Название сервера",
      port: "Порт",
      maxPlayers: "Макс. игроков",
      password: "Пароль (необязательно)",
      startButton: "Запустить сервер",
      stopButton: "Остановить сервер",
      running: "Сервер запущен",
      stopped: "Сервер остановлен",
      upnpNote:
        "Сервер пытается открыть порт автоматически (UPnP). Если роутер не поддерживает это, используйте Radmin VPN или откройте порт вручную.",
    },
    join: {
      directConnect: "Прямое подключение",
      addressLabel: "Адрес (IP:порт)",
      launchButton: "Запустить игру",
      favorites: "Избранное",
      addFavorite: "Добавить в избранное",
      serverBrowser: "Список серверов",
      browserUnavailable:
        "Список серверов недоступен в этой сборке — используйте прямое подключение или избранное.",
      inGameHelp: "В игре: F1 открывает меню мультиплеера, Enter открывает чат.",
    },
    diagnostics: {
      runButton: "Запустить диагностику",
      running: "Проверка...",
      ok: "OK",
      problem: "Проблема",
      optional: "Необязательно",
    },
    update: {
      checking: "Проверка обновлений...",
      available: "Доступно обновление",
      downloading: "Загрузка обновления...",
      downloaded: "Обновление загружено. Перезапустить для установки?",
      restart: "Перезапустить",
      later: "Позже",
      upToDate: "У вас последняя версия.",
    },
    common: { language: "Язык", console: "Консоль" },
  },
};

export function detectInitialLanguage() {
  const nav = navigator.language || "en";
  if (nav.startsWith("pt")) return "pt-BR";
  if (nav.startsWith("ru")) return "ru";
  return "en";
}
