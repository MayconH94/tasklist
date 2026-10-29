import { Pencil } from "lucide-react";

// Barra de título própria. No Electron (Aula 14) ela vira a barra da janela:
// a área "app-drag" permite arrastar a janela por aqui.
export default function Titlebar({ emoji }) {
  return (
    <header className="app-drag flex h-9 shrink-0 items-center gap-2 border-b border-line bg-sidebar px-3">
      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent text-app">
        <Pencil size={12} strokeWidth={2.5} />
      </div>
      <span className="text-xs font-medium text-muted">
        ZenTask {emoji}
      </span>
    </header>
  );
}
