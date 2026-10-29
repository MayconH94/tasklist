import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { usePomodoro } from "../hooks/usePomodoro";
import { DURATIONS, MODE_LABEL, formatClock } from "../lib/pomodoro";
import { beep } from "../lib/sound";

const BAR_COLOR = {
  foco: "bg-rose-500",
  pausa: "bg-emerald-500",
  longa: "bg-sky-500",
};

export default function Pomodoro({ tasks, onFocusComplete }) {
  const p = usePomodoro();
  const [taskId, setTaskId] = useState("");
  const handled = useRef(0);

  // Se a tarefa escolhida foi concluída ou apagada, volta para "nenhuma".
  const activeId = tasks.some((t) => t.id === taskId) ? taskId : "";

  const clock = formatClock(p.secondsLeft);
  const total = DURATIONS[p.mode];
  const progress = ((total - p.secondsLeft) / total) * 100;

  // Ao concluir um foco, credita um 🍅 à tarefa escolhida.
  useEffect(() => {
    if (p.cycles > handled.current) {
      handled.current = p.cycles;
      if (activeId) onFocusComplete(activeId);
    }
  }, [p.cycles, activeId, onFocusComplete]);

  // Alarme ao fim de cada fase.
  useEffect(() => {
    if (p.completed > 0) beep();
  }, [p.completed]);

  // Mostra o tempo na aba do navegador / título da janela.
  useEffect(() => {
    document.title = p.running
      ? `${clock} · ${MODE_LABEL[p.mode]}`
      : "ZenTask";
    return () => {
      document.title = "ZenTask";
    };
  }, [p.running, clock, p.mode]);

  return (
    <section
      aria-label="Pomodoro"
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/40"
    >
      <div className="flex gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-slate-900/60">
        {Object.keys(DURATIONS).map((m) => (
          <button
            key={m}
            onClick={() => p.setMode(m)}
            className={`flex-1 rounded-lg px-2 py-1 text-sm transition-colors ${
              p.mode === m
                ? "bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>

      <div className="text-center">
        <p
          role="timer"
          aria-live="off"
          className="font-mono text-6xl font-semibold tabular-nums"
        >
          {clock}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          🍅 {p.cycles} {p.cycles === 1 ? "foco concluído" : "focos concluídos"}
        </p>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${BAR_COLOR[p.mode]}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={p.running ? p.pause : p.start}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          {p.running ? <Pause size={16} /> : <Play size={16} />}
          {p.running ? "Pausar" : "Iniciar"}
        </button>
        <button
          onClick={p.reset}
          aria-label="Reiniciar fase"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={p.skip}
          aria-label="Pular fase"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <SkipForward size={18} />
        </button>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          Em qual tarefa você vai focar?
        </span>
        <select
          value={activeId}
          onChange={(e) => setTaskId(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-500 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100"
        >
          <option value="">Nenhuma (só o cronômetro)</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}