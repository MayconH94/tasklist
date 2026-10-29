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
        className="min-w-40 flex-1 rounded-lg border border-line bg-raised px-3 py-2 text-ink outline-none placeholder:text-muted focus:border-accent"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-lg border border-line bg-raised px-3 py-2 text-ink outline-none placeholder:text-muted focus:border-accent"
      >
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Categoria"
        className="rounded-lg border border-line bg-raised px-3 py-2 text-ink outline-none placeholder:text-muted focus:border-accent"
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
        className="rounded-lg border border-line bg-raised px-3 py-2 text-ink outline-none placeholder:text-muted focus:border-accent"
      />

      <button
        disabled={!title.trim()}
        className="rounded-lg bg-accent px-4 py-2 font-medium text-on-accent hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Adicionar
      </button>
    </form>
  );
}
