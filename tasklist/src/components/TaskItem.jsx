import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { CATEGORIES, DEFAULT_CATEGORY } from "../lib/categories";

const PRIORITY = {
  baixa: {
    label: "baixa",
    bar: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  media: {
    label: "média",
    bar: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
  },
  alta: {
    label: "alta",
    bar: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
  },
};

const ICON_BUTTON =
  "grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-ink/10";

export default function TaskItem({
  task,
  overdue,
  onToggle,
  onRemove,
  onEdit,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const priority = PRIORITY[task.priority ?? "media"];
  const category = CATEGORIES[task.category ?? DEFAULT_CATEGORY];

  function save() {
    const clean = draft.trim();
    if (clean) onEdit(task.id, clean);
    else setDraft(task.title); // texto vazio: volta ao original
    setEditing(false);
  }

  function cancel() {
    setDraft(task.title);
    setEditing(false);
  }

  // A faixa lateral mostra a prioridade; atrasada vira vermelha; concluída apaga.
  const barColor = task.done
    ? "bg-ink/15"
    : overdue
      ? "bg-rose-500"
      : priority.bar;

  return (
    <li className="group relative flex items-center gap-3 rounded-lg border border-line bg-raised py-2.5 pl-4 pr-2 transition-colors hover:bg-ink/[0.03]">
      <span
        className={`absolute inset-y-2.5 left-0 w-[3px] rounded-full ${barColor}`}
      />

      <label className="relative size-5 shrink-0">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
          aria-label={`Concluir: ${task.title}`}
          className="peer absolute inset-0 size-full opacity-0"
        />
        <span className="grid size-full place-items-center rounded-full border-[1.5px] border-ink/30 text-on-accent transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
          {task.done && <Check size={12} strokeWidth={3.5} />}
        </span>
      </label>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
            className="w-full rounded-md border border-accent bg-transparent px-2 py-1 text-ink outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            className={`block break-words ${task.done ? "text-muted line-through" : "font-medium"}`}
          >
            {task.title}
          </span>
        )}

        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className={task.done ? "" : priority.text}>
            Prioridade {priority.label}
          </span>
          <span
            className={`rounded-full px-2 py-px font-medium ${category.style}`}
          >
            {category.label}
          </span>
          {task.pomodoros > 0 && (
            <span title={`${task.pomodoros} pomodoro(s) nesta tarefa`}>
              🍅 {task.pomodoros}
            </span>
          )}
          {task.dueDate && (
            <span
              title={overdue ? "Atrasada" : undefined}
              className={overdue ? "font-medium text-rose-500" : ""}
            >
              {task.dueDate.split("-").reverse().join("/")}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center md:opacity-0 md:transition-opacity md:focus-within:opacity-100 md:group-hover:opacity-100">
        <button
          onClick={() => setEditing(true)}
          aria-label="Editar tarefa"
          className={`${ICON_BUTTON} hover:text-ink`}
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onRemove(task.id)}
          aria-label="Remover tarefa"
          className={`${ICON_BUTTON} hover:text-rose-500`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}
