const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen,
  shell,
} = require("electron");
const path = require("node:path");

const DEV_URL = "http://localhost:5180";
const IS_DEV = Boolean(process.env.ELECTRON_DEV);
const MINI = {
  collapsed: { width: 168, height: 52 },
  expanded: { width: 340, height: 120 },
};
// Alt+Espaço é o atalho pedido; o Windows pode reservá-lo para o menu da janela.
// Se o registro falhar, cai para o próximo da lista.
const TOGGLE_SHORTCUTS = ["Alt+Space", "Ctrl+Alt+Space"];

let mainWin = null;
let miniWin = null;

function load(win, hash) {
  if (IS_DEV) return win.loadURL(hash ? `${DEV_URL}/#${hash}` : DEV_URL);
  const file = path.join(__dirname, "../dist/index.html");
  return win.loadFile(file, hash ? { hash } : undefined);
}

function openLinksInBrowser(win) {
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
}

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 720,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      backgroundThrottling: false, // o Pomodoro continua certo com a janela escondida
    },
  });
  openLinksInBrowser(mainWin);
  load(mainWin);
  mainWin.on("closed", () => {
    mainWin = null;
    app.quit(); // a Mini Ilha escondida não deve manter o app aberto
  });
}

function createMiniWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const { width, height } = MINI.collapsed;
  miniWin = new BrowserWindow({
    width,
    height,
    x: Math.round(workArea.x + (workArea.width - width) / 2),
    y: workArea.y + 12,
    show: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      backgroundThrottling: false,
    },
  });
  miniWin.setAlwaysOnTop(true, "screen-saver"); // acima de apps em tela cheia
  load(miniWin, "mini");
}

function toggleMini() {
  if (!miniWin) return;
  if (miniWin.isVisible()) miniWin.hide();
  else miniWin.showInactive(); // aparece sem roubar o foco de quem está digitando
}

// Expande/recolhe mantendo o centro horizontal onde o usuário arrastou a janela.
ipcMain.on("mini:expand", (event, expanded) => {
  if (!miniWin || event.sender !== miniWin.webContents) return;
  const size = expanded ? MINI.expanded : MINI.collapsed;
  const b = miniWin.getBounds();
  miniWin.setBounds({
    x: Math.round(b.x + b.width / 2 - size.width / 2),
    y: b.y,
    ...size,
  });
});

app.whenReady().then(() => {
  createMainWindow();
  createMiniWindow();
  const registered = TOGGLE_SHORTCUTS.some((accelerator) =>
    globalShortcut.register(accelerator, toggleMini),
  );
  if (!registered)
    console.warn("Mini Ilha: nenhum atalho global pôde ser registrado.");
});

app.on("will-quit", () => globalShortcut.unregisterAll());
