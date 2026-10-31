import { ClipboardCheck } from "lucide-react";
import { useData } from "../context/DataContext";
import { CATEGORIES, DEFAULT_CATEGORY } from "../lib/categories";
import { formatLong, todayKey } from "../lib/dates";
import { MOODS } from "../lib/moods";

const EMPTY = { notes: "", mood: null };
const CLOSING_TITLE = "Fechamento do dia";

// Rascunho com o que foi feito (e o que ficou pendente) no dia.
function buildClosing(date, tasks, mood) {
  const today = todayKey();
  const ofDay = (t) => (t.dueDate || today) === date;
  const done = tasks.filter(
    (t) => t.done && (t.doneAt ? t.doneAt === date : ofDay(t)),
  );
  const pending = tasks.filter((t) => !t.done && ofDay(t));
  const line = (t) =>
    `- ${t.title} (${CATEGORIES[t.category ?? DEFAULT_CATEGORY].label})` +
    (t.pomodoros > 0 ? ` 🍅 ${t.pomodoros}` : "");

  const lines = [`${CLOSING_TITLE} — ${formatLong(date)}`, ""];
  lines.push(`✔ Concluídas (${done.length})`);
  lines.push(...(done.length ? done.map(line) : ["- nada concluído"]), "");
  if (pending.length) {
    lines.push(`○ Ficaram pendentes (${pending.length})`);
    lines.push(...pending.map(line), "");
  }
  const m = MOODS.find((x) => x.value === mood);
  if (m) lines.push(`Humor: ${m.emoji} ${m.label}`, "");
  lines.push("O que funcionou:", "", "O que ajustar amanhã:", "");
  return lines.join("\n");
}

export default function Journal({ date }) {
  // entries = { "2026-10-28": { notes: "...", mood: 4 }, ... }
  const { entries, setEntries, tasks } = useData();
  const entry = entries[date] ?? EMPTY;

  function update(patch) {
    setEntries((prev) => ({
      ...prev,
      [date]: { ...(prev[date] ?? EMPTY), ...patch },
    }));
  }

  function addClosing() {
    const closing = buildClosing(date, tasks, entry.mood);
    const notes = entry.notes.trimEnd();
    update({ notes: notes ? `${notes}\n\n${closing}` : closing });
  }
  const hasClosing = entry.notes.includes(CLOSING_TITLE);

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

      <button
        onClick={addClosing}
        disabled={hasClosing}
        className="inline-flex h-9 w-fit items-center gap-2 rounded-full border border-line px-4 text-[13px] text-muted transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-40"
      >
        <ClipboardCheck size={15} />
        {hasClosing ? "Fechamento já inserido" : "Gerar fechamento do dia"}
      </button>

      <div className="flex justify-between text-xs text-muted">
        <span>
          {words} {words === 1 ? "palavra" : "palavras"}
        </span>
        <span>● Salvo automaticamente</span>
      </div>
    </div>
  );
}
