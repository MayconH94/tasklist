import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const PRIORITY_STYLES = {
  baixa: "bg-emerald-100 text-emerald-700",
  media: "bg-amber-100 text-amber-700",
  alta: "bg-rose-100 text-rose-700",
};

export default function TaskList() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [filter, setFilter] = useState("todas");
  const [dueDate, setDueDate] = useState("");

  function addTask(e) {
    e.preventDefault(); // impede a página de recarregar
    if (!title.trim()) return;
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title, done: false, priority, dueDate },
    ]);
    setTitle("");
    setDueDate("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const total = tasks.length;
  const concluidas = tasks.filter((t) => t.done).length;
  const visibleTasks = tasks.filter((t) => {
    if (filter === "pendentes") return !t.done;
    if (filter === "concluidas") return t.done;
    return true; // "todas"
  });

  const today = new Date().toLocaleDateString("sv-SE"); // formato 2026-10-26

  function isOverdue(t) {
    return t.dueDate && !t.done && t.dueDate < today;
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={addTask} className="flex gap-2">
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

      <div className="flex gap-2">
        {["todas", "pendentes", "concluidas"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
              filter === f
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {visibleTasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(t.id)}
              className="h-4 w-4 accent-emerald-600"
            />

            <span
              className={`flex-1 ${t.done ? "text-slate-400 line-through" : ""}`}
            >
              {t.title}
            </span>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                PRIORITY_STYLES[t.priority ?? "media"]
              }`}
            >
              {t.priority ?? "media"}
            </span>
            
            {t.dueDate && (
              <span
                className={`text-xs ${
                  isOverdue(t) ? "font-medium text-rose-600" : "text-slate-400"
                }`}
              >
                {t.dueDate.split("-").reverse().join("/")}
              </span>
            )}

            <button
              onClick={() => removeTask(t.id)}
              className="text-slate-400 hover:text-rose-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {total > 0 && (
        <p className="text-sm text-slate-500">
          {concluidas} de {total} concluídas
        </p>
      )}

      {total === 0 && (
        <p className="text-center text-slate-400">Nenhuma tarefa ainda.</p>
      )}
    </div>
  );
}
