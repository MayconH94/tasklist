import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, dueDate });
    setTitle("");
    setDueDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nova tarefa..."
        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-emerald-500"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
      >
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
      />

      <button
        disabled={!title.trim()}
        className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Adicionar
      </button>
    </form>
  );
}
