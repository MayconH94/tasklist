import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays } from "../lib/dates";

const ARROW =
  "grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-ink/10 hover:text-ink";

// Setas para ir ao dia anterior / seguinte e voltar para hoje.
export default function DayNav({ date, today, onChange }) {
  return (
    <div
      role="group"
      aria-label="Navegar entre os dias"
      className="flex shrink-0 items-center gap-1"
    >
      <button
        onClick={() => onChange(addDays(date, -1))}
        aria-label="Dia anterior"
        className={ARROW}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => onChange(today)}
        disabled={date === today}
        className="rounded-full px-3 py-1 text-[13px] text-muted transition-colors hover:bg-ink/10 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        Hoje
      </button>
      <button
        onClick={() => onChange(addDays(date, 1))}
        aria-label="Próximo dia"
        className={ARROW}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
