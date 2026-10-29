import { useState } from "react";
import { useData } from "../context/DataContext";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import Pomodoro from "./Pomodoro";
import { CATEGORIES } from "../lib/categories";

export default function TaskList() {
  const { tasks, setTasks } = useData();
  const [filter, setFilter] = useState("todas");
  const [categoryFilter, setCategoryFilter] = useState("todas");

  function addTask({ title, priority, category, dueDate }) {
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title, done: false, priority, category, dueDate },
    ]);
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function editTask(id, title) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));
  }

  // Usa a forma com função: quem chama é um efeito, que pode ter uma
  // lista antiga na mão. "prev" é sempre a lista mais recente.
  function addPomodoro(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, pomodoros: (t.pomodoros ?? 0) + 1 } : t)),
    );
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const total = tasks.length;
  const concluidas = tasks.filter((t) => t.done).length;
  const visibleTasks = tasks.filter((t) => {
    if (filter === "pendentes" && t.done) return false;
    if (filter === "concluidas" && !t.done) return false;
    if (
      categoryFilter !== "todas" &&
      (t.category ?? "pessoal") !== categoryFilter
    )
      return false;
    return true;
  });

  const today = new Date().toLocaleDateString("sv-SE");
  const isOverdue = (t) => Boolean(t.dueDate && !t.done && t.dueDate < today);

  return (
    <div className="flex flex-col gap-4">
      <Pomodoro
        tasks={tasks.filter((t) => !t.done)}
        onFocusComplete={addPomodoro}
      />

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

      <div className="flex flex-wrap gap-2">
        {["todas", ...Object.keys(CATEGORIES)].map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              categoryFilter === c
                ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {c === "todas" ? "Todas as categorias" : CATEGORIES[c].label}
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
