import { useEffect, useRef, useState } from "react";
import { MOODS } from "../lib/moods";

// Dia da semana no "Humor da semana": o emoji vira um botão que abre
// um seletor com os 5 humores. Clicar no humor atual limpa o dia.
export default function MoodDay({ label, date, mood, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = MOODS.find((m) => m.value === mood);

  function pick(value) {
    onChange(date, value === mood ? null : value);
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className="relative rounded-lg border border-line bg-raised py-2"
    >
      <p className="text-xs text-muted">{label}</p>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Humor de ${label}: ${current?.label ?? "sem registro"}`}
        className="mx-auto mt-0.5 grid size-9 place-items-center rounded-full text-xl transition-colors hover:bg-ink/10"
      >
        {current?.emoji ?? <span className="text-muted">·</span>}
      </button>

      {open && (
        <div
          role="group"
          aria-label="Escolher humor"
          className="absolute left-1/2 top-full z-20 mt-1 flex -translate-x-1/2 gap-0.5 rounded-full border border-line bg-surface p-1 shadow-lg"
        >
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => pick(m.value)}
              title={m.label}
              aria-label={m.label}
              aria-pressed={m.value === mood}
              className={`grid size-8 place-items-center rounded-full text-base transition-colors hover:bg-ink/10 ${
                m.value === mood ? "bg-accent-soft ring-1 ring-accent" : ""
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}