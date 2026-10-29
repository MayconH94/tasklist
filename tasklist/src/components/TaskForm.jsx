import { useState } from "react";
import { CATEGORIES, DEFAULT_CATEGORY } from "../lib/categories";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, category, dueDate });
    setTitle("");
    setDueDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nova tarefa..."
        className="min-w-40 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      >
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Categoria"
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        {Object.entries(CATEGORIES).map(([key, c]) => (
          <option key={key} value={key}>
            {c.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:[color-scheme:dark]"
      />

      <button
        disabled={!title.trim()}
        className="rounded-xl bg-emerald-500 px-2 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Adicionar
      </button>
    </form>
  );
}
