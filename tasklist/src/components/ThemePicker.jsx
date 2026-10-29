import { Check } from "lucide-react";
import { THEMES } from "../lib/themes";

// Miniatura: usa data-theme para "vestir" só este pedaço com o tema.
function Preview({ id }) {
  return (
    <div
      data-theme={id}
      className="themed-bg pointer-events-none flex h-28 flex-col overflow-hidden rounded-lg border border-line"
    >
      <div className="h-3 shrink-0 border-b border-line bg-sidebar" />
      <div className="flex min-h-0 flex-1">
        <div className="flex w-1/4 flex-col gap-1 border-r border-line bg-sidebar p-1.5">
          <i className="block h-2 rounded bg-accent-soft" />
          <i className="block h-2 rounded bg-line" />
          <i className="block h-2 rounded bg-line" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2">
          <i className="block h-2 w-1/3 rounded bg-accent" />
          <i className="block h-4 rounded border border-line bg-surface" />
          <i className="block h-4 rounded border border-line bg-surface" />
        </div>
      </div>
    </div>
  );
}

export default function ThemePicker({ theme, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Tema do app"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3"
    >
      {THEMES.map((t) => {
        const selected = theme === t.id;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(t.id)}
            className={`flex flex-col gap-2 rounded-xl border p-2 text-left transition ${
              selected
                ? "border-accent bg-accent-soft"
                : "border-line hover:bg-ink/5"
            }`}
          >
            <Preview id={t.id} />
            <div className="flex items-center gap-2 px-1 pb-1">
              <div className="flex-1">
                <p className="text-[13px] font-medium">
                  {t.label} {t.emoji}
                </p>
                <p className="text-xs text-muted">{t.info}</p>
              </div>
              {selected && <Check size={16} className="text-accent" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
