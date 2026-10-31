import { ChartColumn, StickyNote } from "lucide-react";
import { formatLong } from "../lib/dates";

const USER_INITIAL = "M";

// Barra do topo. No Electron (Aula 14) ela vira a barra da janela: "app-drag"
// permite arrastar a janela por aqui e "app-no-drag" deixa os botões clicáveis.
export default function Titlebar({ emoji, today, onStats, onScratch }) {
  return (
    <header className="app-drag flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line bg-sidebar px-6">
      <span className="font-display text-xl font-semibold tracking-tight">
        ZenTask {emoji}
      </span>

      <div className="flex items-center gap-3.5">
        <span className="hidden text-[13px] text-muted sm:inline">
          {formatLong(today)}
        </span>
        <button
          onClick={onScratch}
          aria-label="Rascunho rápido (Ctrl+J)"
          title="Rascunho rápido (Ctrl+J)"
          className="app-no-drag grid size-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          <StickyNote size={15} />
        </button>
        <button
          onClick={onStats}
          aria-label="Estatísticas"
          className="app-no-drag inline-flex h-8 items-center gap-2 rounded-full border border-line px-3 text-[13px] text-muted transition-colors hover:border-ink/30 hover:text-ink sm:px-3.5"
        >
          <ChartColumn size={15} />
          <span className="hidden sm:inline">Estatísticas</span>
        </button>
        <div
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-full border border-line bg-raised font-display text-sm font-semibold"
        >
          {USER_INITIAL}
        </div>
      </div>
    </header>
  );
}
