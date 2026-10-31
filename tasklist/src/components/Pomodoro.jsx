import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { usePomodoro } from "../hooks/usePomodoro";
import { DURATIONS, MODE_LABEL, formatClock } from "../lib/pomodoro";
import { beep } from "../lib/sound";
import Select from "./Select";

// Cada fase tem a sua cor: o anel e os pontinhos seguem ela.
const MODE_STYLE = {
  foco: { ring: "stroke-focus", dot: "bg-focus" },
  pausa: { ring: "stroke-emerald-500", dot: "bg-emerald-500" },
  longa: { ring: "stroke-sky-500", dot: "bg-sky-500" },
};

const RADIUS = 88;
const RING_LENGTH = 2 * Math.PI * RADIUS;

export default function Pomodoro({ tasks, onFocusComplete }) {
  const p = usePomodoro();
  const [taskId, setTaskId] = useState("");
  const handled = useRef(0);

  // Se a tarefa escolhida foi concluída ou apagada, volta para "nenhuma".
  const activeId = tasks.some((t) => t.id === taskId) ? taskId : "";

  const clock = formatClock(p.secondsLeft);
  const total = DURATIONS[p.mode];
  const progress = ((total - p.secondsLeft) / total) * 100;
  const style = MODE_STYLE[p.mode];

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
    document.title = p.running ? `${clock} · ${MODE_LABEL[p.mode]}` : "ZenTask";
    return () => {
      document.title = "ZenTask";
    };
  }, [p.running, clock, p.mode]);

  // Publica o estado para a Mini Ilha (outra janela) acompanhar.
  useEffect(() => {
    try {
      localStorage.setItem(
        "pomodoro",
        JSON.stringify({
          mode: p.mode,
          running: p.running,
          endsAt: p.endsAt,
          left: p.left,
          taskId: activeId,
        }),
      );
    } catch {
      /* sem localStorage: a Mini Ilha mostra o relógio parado */
    }
  }, [p.mode, p.running, p.endsAt, p.left, activeId]);

  return (
    <div className="@container">
      <section
        aria-label="Pomodoro"
        className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-raised p-5 @xl:flex-row @xl:gap-8 @xl:p-6"
      >
        <div className="relative size-48 shrink-0">
          <svg
            viewBox="0 0 200 200"
            className="size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              strokeWidth="5"
              className="fill-none stroke-ink/10"
            />
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (progress / 100)}
              className={`fill-none transition-[stroke-dashoffset] duration-300 ease-linear ${style.ring}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              role="timer"
              aria-live="off"
              className="font-display text-5xl font-light tabular-nums tracking-tight"
            >
              {clock}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-ink">
              <i
                className={`size-1.5 rounded-full ${style.dot} ${p.running ? "motion-safe:animate-pulse" : ""}`}
              />
              {MODE_LABEL[p.mode]}
            </p>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <div
            role="group"
            aria-label="Fase do Pomodoro"
            className="flex gap-1 rounded-full bg-ink/5 p-1"
          >
            {Object.keys(DURATIONS).map((m) => (
              <button
                key={m}
                onClick={() => p.setMode(m)}
                aria-pressed={p.mode === m}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[13px] transition-colors ${
                  p.mode === m
                    ? "bg-surface font-medium text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {p.mode === m && (
                  <i className={`size-1.5 rounded-full ${MODE_STYLE[m].dot}`} />
                )}
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted">
            🍅 <b className="font-semibold text-ink">{p.cycles}</b>{" "}
            {p.cycles === 1 ? "foco concluído" : "focos concluídos"}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={p.running ? p.pause : p.start}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {p.running ? (
                <Pause size={15} fill="currentColor" />
              ) : (
                <Play size={15} fill="currentColor" />
              )}
              {p.running ? "Pausar" : "Iniciar"}
            </button>
            <button
              onClick={p.reset}
              aria-label="Reiniciar fase"
              className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              <RotateCcw size={17} />
            </button>
            <button
              onClick={p.skip}
              aria-label="Pular fase"
              className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              <SkipForward size={17} />
            </button>
          </div>

          <label className="flex flex-col gap-1.5 text-[13px]">
            <span className="text-muted">Em qual tarefa você vai focar?</span>
            <Select
              value={activeId}
              onChange={(e) => setTaskId(e.target.value)}
            >
              <option value="">Nenhuma (só o cronômetro)</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </section>
    </div>
  );
}
