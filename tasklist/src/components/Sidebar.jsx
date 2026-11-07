import {
  BookOpen,
  CalendarDays,
  ListChecks,
  Palette,
  TrendingUp,
} from "lucide-react";
import { formatShort, lastDays, todayKey } from "../lib/dates";
import LofiPlayer from "./LofiPlayer";

const NAV = [
  { id: "diario", label: "Diário", icon: BookOpen },
  { id: "tarefas", label: "Foco em tarefas", icon: ListChecks },
  { id: "visao", label: "Estatísticas", icon: TrendingUp },
];

const LABEL =
  "px-2 text-[11px] font-semibold uppercase tracking-wider text-muted";

const ITEM =
  "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] transition-colors";
const ITEM_ACTIVE = "bg-accent-soft font-medium text-ink";
const ITEM_IDLE = "text-muted hover:bg-ink/5 hover:text-ink";

export default function Sidebar({
  view,
  onView,
  open,
  onClose,
  selectedDate,
  onSelectDate,
}) {
  const today = todayKey();
  const recent = lastDays(7);

  return (
    <>
      {/* Fundo escuro atrás do menu (só em telas pequenas). */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 z-30 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="menu-lateral"
        className={`absolute inset-y-0 left-0 z-40 flex w-64 max-w-[85vw] flex-col gap-5 overflow-y-auto border-r border-line bg-sidebar p-3 transition-[transform,visibility] duration-200 md:static md:z-auto md:w-60 md:max-w-none md:shrink-0 md:translate-x-0 md:visible ${
          open ? "translate-x-0 shadow-2xl" : "invisible -translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onView(id)}
              className={`${ITEM} ${view === id ? ITEM_ACTIVE : ITEM_IDLE}`}
            >
              <Icon size={16} className={view === id ? "text-accent" : ""} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="data" className={LABEL}>
            Ir para o dia
          </label>
          <input
            id="data"
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && onSelectDate(e.target.value)}
            className="h-8 rounded-md border border-line bg-surface px-2 text-[13px] text-ink outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <p className={LABEL}>Dias recentes</p>
          <ul className="flex flex-col gap-0.5">
            {[...recent].reverse().map((day) => (
              <li key={day}>
                <button
                  onClick={() => onSelectDate(day)}
                  className={`${ITEM} ${
                    selectedDate === day ? ITEM_ACTIVE : ITEM_IDLE
                  }`}
                >
                  <CalendarDays size={15} />
                  {day === today ? "Hoje" : formatShort(day)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <LofiPlayer />
          <button
            onClick={() => onView("temas")}
            className={`${ITEM} ${view === "temas" ? ITEM_ACTIVE : ITEM_IDLE}`}
          >
            <Palette
              size={16}
              className={view === "temas" ? "text-accent" : ""}
            />
            Temas
          </button>
        </div>
      </aside>
    </>
  );
}
