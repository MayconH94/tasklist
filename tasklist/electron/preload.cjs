const { contextBridge, ipcRenderer } = require("electron");

// Única ponte entre a página e o Electron: a Mini Ilha pede para expandir/recolher.
contextBridge.exposeInMainWorld("zentask", {
  setMiniExpanded: (expanded) =>
    ipcRenderer.send("mini:expand", Boolean(expanded)),
});
