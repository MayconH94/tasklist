import { useEffect, useState } from "react";
import { GripVertical, Timer } from "lucide-react";
import { useData } from "../context/DataContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { todayKey } from "../lib/dates";
import { DURATIONS, MODE_LABEL, formatClock } from "../lib/pomodoro";
import { DEFAULT_THEME, getTheme } from "../lib/themes";

const MODE_DOT = {
  foco: "bg-focus",
  pausa: "bg-emerald-500",
  longa: "bg-sky-500",
};

function useNow(ms = 500) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

// Janela compacta (Electron, sempre no topo). Abre com /#mini.
// Lê o Pomodoro publicado pela janela principal em localStorage("pomodoro").
export default function MiniIsland() {
  const { tasks, setTasks } = useData();
  const [snap] = useLocalStorage("pomodoro", null);
  const [themeId] = useLocalStorage("theme", DEFAULT_THEME);
  const [expanded, setExpanded] = useState(false);
  const now = useNow();

  // Mesmo tema da janela principal + fundo transparente (cantos arredondados).
  useEffect(() => {
    const theme = getTheme(themeId);
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.classList.toggle("dark", theme.dark);
  }, [themeId]);

  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
  }, []);

  function setHover(value) {
    setExpanded(value);
    window.zentask?.setMiniExpanded(value); // só existe dentro do Electron
  }

  const mode = snap?.mode ?? "foco";
  const left = !snap
    ? DURATIONS.foco
    : snap.running
      ? Math.max(0, Math.ceil((snap.endsAt - now) / 1000))
      : snap.left;
  const task = tasks.find((t) => t.id === snap?.taskId);

  function toggleTask() {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, done: !t.done, doneAt: t.done ? undefined : todayKey() }
          : t,
      ),
    );
  }

  return (
    <div className="h-screen w-screen p-1">
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex h-full flex-col justify-center rounded-3xl border border-line bg-surface px-3 text-ink shadow-xl"
      >
        <div className="flex items-center gap-2">
          <span className="app-drag grid size-6 shrink-0 cursor-grab place-items-center text-muted">
            {expanded ? <GripVertical size={14} /> : <Timer size={14} />}
          </span>
          <span
            role="timer"
            className="font-display text-2xl font-light tabular-nums tracking-tight"
          >
            {formatClock(left)}
          </span>
          {expanded && (
            <span className="ml-auto flex items-center gap-1.5 text-xs text-muted">
              <i
                className={`size-1.5 rounded-full ${MODE_DOT[mode]} ${snap?.running ? "motion-safe:animate-pulse" : ""}`}
              />
              {MODE_LABEL[mode]}
            </span>
          )}
        </div>

        {expanded && (
          <label className="mt-1.5 flex min-w-0 items-center gap-2 border-t border-line pt-2 text-[13px]">
            {task ? (
              <>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={toggleTask}
                  className="size-4 shrink-0 accent-[var(--accent)]"
                />
                <span
                  className={`truncate ${task.done ? "text-muted line-through" : "font-medium"}`}
                >
                  {task.title}
                </span>
              </>
            ) : (
              <span className="text-muted">Sem tarefa em foco</span>
            )}
          </label>
        )}
      </div>
    </div>
  );
}