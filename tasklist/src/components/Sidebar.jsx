import { BookOpen, ListChecks, TrendingUp, Moon, Sun, Sparkles } from "lucide-react";

const NAV = [
  { id: "diario", label: "Diário", icon: BookOpen },
  { id: "tarefas", label: "Foco em tarefas", icon: ListChecks },
  { id: "visao", label: "Visão geral", icon: TrendingUp },
];

export default function Sidebar({ view, onView, dark, onToggleDark }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 border-r border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/60">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <p className="font-semibold">ZenJournal</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fluxo diário e tarefas</p>
        </div>
        <button
          onClick={onToggleDark}
          aria-label="Alternar modo escuro"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onView(id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              view === id
                ? "bg-violet-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}