import { useData } from "../context/DataContext";
import { CATEGORIES } from "../lib/categories";
import { lastDays, formatShort } from "../lib/dates";
import { averageMood, journalStreak, taskStats } from "../lib/stats";

const MOOD_EMOJI = ["", "😞", "😕", "😐", "🙂", "😄"];

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
      {hint && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function Overview() {
  const { tasks, entries } = useData();

  const stats = taskStats(tasks);
  const streak = journalStreak(entries);
  const mood = averageMood(entries, 7);
  const days = lastDays(7);
  const percent = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Sequência"
          value={`🔥 ${streak}`}
          hint={streak === 1 ? "dia escrevendo" : "dias escrevendo"}
        />
        <Stat
          label="Concluídas"
          value={`${stats.done}/${stats.total}`}
          hint={`${percent}% das tarefas`}
        />
        <Stat
          label="Atrasadas"
          value={stats.overdue}
          hint={stats.overdue === 0 ? "tudo em dia" : "precisam de atenção"}
        />
        <Stat label="Pomodoros" value={`🍅 ${stats.pomodoros}`} hint="focos feitos" />
      </div>

      <section>
        <h3 className="mb-2 font-medium">
          Humor da semana{" "}
          {mood !== null && (
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              · média {MOOD_EMOJI[Math.round(mood)]} {mood.toFixed(1)}
            </span>
          )}
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((d) => (
            <div
              key={d}
              className="rounded-lg border border-slate-200 py-2 dark:border-white/10"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatShort(d).split(",")[0].slice(0, 3)}
              </p>
              <p className="text-xl">
                {entries[d]?.mood ? MOOD_EMOJI[entries[d].mood] : "·"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-medium">Tarefas por categoria</h3>
        {stats.total === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nenhuma tarefa ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {Object.entries(CATEGORIES).map(([key, c]) => {
              const n = stats.byCategory[key] ?? 0;
              return (
                <li key={key} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-slate-600 dark:text-slate-300">
                    {c.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${(n / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-slate-500">{n}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
