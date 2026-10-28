import { useState } from "react";

const PRIORITY_STYLES = {
  baixa: "bg-emerald-100 text-emerald-700",
  media: "bg-amber-100 text-amber-700",
  alta: "bg-rose-100 text-rose-700",
};

export default function TaskItem({ task, overdue, onToggle, onRemove, onEdit }) {
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
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 ${
        overdue ? "border-l-4 border-l-rose-500" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        className="h-4 w-4 accent-emerald-600"
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
          className="flex-1 rounded-lg border border-emerald-500 px-2 py-1 outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 ${task.done ? "text-slate-400 line-through" : ""}`}
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

      {task.dueDate && (
        <span
          className={`text-xs ${
            overdue ? "font-medium text-rose-600" : "text-slate-400"
          }`}
        >
          {task.dueDate.split("-").reverse().join("/")}
        </span>
      )}

      <button
        onClick={() => setEditing(true)}
        className="text-slate-400 hover:text-emerald-600"
        aria-label="Editar tarefa"
      >
        ✎
      </button>

      <button
        onClick={() => onRemove(task.id)}
        className="text-slate-400 hover:text-rose-500"
        aria-label="Remover tarefa"
      >
        ✕
      </button>
    </li>
  );
}
