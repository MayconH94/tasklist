import { useState } from "react";
import { CATEGORIES, DEFAULT_CATEGORY } from "../lib/categories";

const PRIORITY_STYLES = {
  baixa:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  media: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  alta: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export default function TaskItem({
  task,
  overdue,
  onToggle,
  onRemove,
  onEdit,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

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

  return (
    <li
      className={`flex items-center gap-3 rounded-lg border border-line bg-raised px-3 py-2.5 ${
        overdue ? "border-l-4 border-l-rose-500" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        className="h-4 w-4 accent-[var(--accent)]"
      />

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
          className="flex-1 rounded-md border border-accent bg-transparent px-2 py-1 text-ink outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 ${task.done ? "text-muted line-through" : ""}`}
        >
          {task.title}
        </span>
      )}

      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          PRIORITY_STYLES[task.priority ?? "media"]
        }`}
      >
        {task.priority ?? "media"}
      </span>

      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          CATEGORIES[task.category ?? DEFAULT_CATEGORY].style
        }`}
      >
        {CATEGORIES[task.category ?? DEFAULT_CATEGORY].label}
      </span>

      {task.pomodoros > 0 && (
        <span
          title={`${task.pomodoros} pomodoro(s) nesta tarefa`}
          className="text-xs text-muted"
        >
          🍅 {task.pomodoros}
        </span>
      )}

      {task.dueDate && (
        <span
          className={`text-xs ${
            overdue ? "font-medium text-rose-500" : "text-muted"
          }`}
        >
          {task.dueDate.split("-").reverse().join("/")}
        </span>
      )}

      <button
        onClick={() => setEditing(true)}
        className="text-muted hover:text-accent"
        aria-label="Editar tarefa"
      >
        ✎
      </button>

      <button
        onClick={() => onRemove(task.id)}
        className="text-muted hover:text-rose-500"
        aria-label="Remover tarefa"
      >
        ✕
      </button>
    </li>
  );
}
