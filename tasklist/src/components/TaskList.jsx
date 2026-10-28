import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [filter, setFilter] = useState("todas");

  function addTask({ title, priority, dueDate }) {
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title, done: false, priority, dueDate },
    ]);
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function editTask(id, title) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const total = tasks.length;
  const concluidas = tasks.filter((t) => t.done).length;
  const visibleTasks = tasks.filter((t) => {
    if (filter === "pendentes") return !t.done;
    if (filter === "concluidas") return t.done;
    return true;
  });

  const today = new Date().toLocaleDateString("sv-SE");
  const isOverdue = (t) => Boolean(t.dueDate && !t.done && t.dueDate < today);

  return (
    <div className="flex flex-col gap-4">
      <TaskForm onAdd={addTask} />

      <div className="flex gap-2">
        {["todas", "pendentes", "concluidas"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
              filter === f
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {visibleTasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            overdue={isOverdue(t)}
            onToggle={toggleTask}
            onRemove={removeTask}
            onEdit={editTask}
          />
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
