import { useData } from "../context/DataContext";

const MOODS = [
  { value: 1, emoji: "😞", label: "Péssimo" },
  { value: 2, emoji: "😕", label: "Ruim" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "🙂", label: "Bom" },
  { value: 5, emoji: "😄", label: "Ótimo" },
];

const EMPTY = { notes: "", mood: null };

export default function Journal({ date }) {
  // entries = { "2026-10-28": { notes: "...", mood: 4 }, ... }
  const { entries, setEntries } = useData();
  const entry = entries[date] ?? EMPTY;

  function update(patch) {
    setEntries((prev) => ({
      ...prev,
      [date]: { ...(prev[date] ?? EMPTY), ...patch },
    }));
  }

  const text = entry.notes.trim();
  const words = text ? text.split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-4">
      <div
        role="radiogroup"
        aria-label="Humor do dia"
        className="flex items-center gap-2"
      >
        <span className="mr-1 text-sm text-muted">
          Humor
        </span>
        {MOODS.map((m) => {
          const selected = entry.mood === m.value;
          return (
            <button
              key={m.value}
              role="radio"
              aria-checked={selected}
              aria-label={m.label}
              title={m.label}
              onClick={() => update({ mood: selected ? null : m.value })}
              className={`rounded-lg px-2.5 py-1.5 text-xl transition ${
                selected
                  ? "bg-accent-soft ring-2 ring-accent"
                  : "opacity-60 hover:bg-ink/5 hover:opacity-100"
              }`}
            >
              {m.emoji}
            </button>
          );
        })}
      </div>

      <textarea
        value={entry.notes}
        onChange={(e) => update({ notes: e.target.value })}
        placeholder="Como foi o seu dia? Escreva o que quiser…"
        autoFocus
        className="min-h-64 w-full resize-y rounded-lg border border-line bg-raised px-4 py-3 leading-relaxed text-ink outline-none placeholder:text-muted focus:border-accent"
      />

      <div className="flex justify-between text-xs text-muted">
        <span>
          {words} {words === 1 ? "palavra" : "palavras"}
        </span>
        <span>● Salvo automaticamente</span>
      </div>
    </div>
  );
}
