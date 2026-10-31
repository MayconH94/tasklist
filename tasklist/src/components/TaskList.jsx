import { useState } from "react";
import { useData } from "../context/DataContext";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import Pomodoro from "./Pomodoro";
import { CATEGORIES } from "../lib/categories";
import { formatShort } from "../lib/dates";

const STATUS_FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "pendentes", label: "Pendentes" },
  { id: "concluidas", label: "Concluídas" },
];

export default function TaskList({ date, today, onSelectDate }) {
  const { tasks, setTasks } = useData();
  const [filter, setFilter] = useState("todas");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  // Aviso quando a tarefa foi criada para um dia diferente do que está aberto.
  const [notice, setNotice] = useState(null);

  function addTask({ title, priority, category, dueDate }) {
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title,
        done: false,
        priority,
        category,
        dueDate,
      },
    ]);
    if (dueDate !== date) setNotice({ day: dueDate, shownOn: date });
  }

  function toggleTask(id) {
    // "doneAt" guarda o dia em que foi concluída (para atrasadas continuarem
    // visíveis em hoje depois de concluídas).
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, doneAt: t.done ? undefined : today }
          : t,
      ),
    );
  }

  function editTask(id, title) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));
  }

  // Usa a forma com função: quem chama é um efeito, que pode ter uma
  // lista antiga na mão. "prev" é sempre a lista mais recente.
  function addPomodoro(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, pomodoros: (t.pomodoros ?? 0) + 1 } : t,
      ),
    );
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  // Cada tarefa pertence a um dia: o da sua data (sem data, vale para hoje).
  // Em "hoje" também entram as atrasadas: pendentes, ou concluídas hoje.
  const dayTasks = tasks.filter((t) => {
    if ((t.dueDate || today) === date) return true;
    const carriedOver = t.dueDate < today && (!t.done || t.doneAt === today);
    return date === today && carriedOver;
  });
  const total = dayTasks.length;
  const concluidas = dayTasks.filter((t) => t.done).length;
  const visibleTasks = dayTasks.filter((t) => {
    if (filter === "pendentes" && t.done) return false;
    if (filter === "concluidas" && !t.done) return false;
    if (
      categoryFilter !== "todas" &&
      (t.category ?? "pessoal") !== categoryFilter
    )
      return false;
    return true;
  });

  const isOverdue = (t) => Boolean(t.dueDate && !t.done && t.dueDate < today);

  return (
    <div className="flex flex-col gap-4">
      <Pomodoro
        tasks={tasks.filter((t) => !t.done)}
        onFocusComplete={addPomodoro}
      />

      <TaskForm onAdd={addTask} date={date} />

      {notice?.shownOn === date && (
        <p
          role="status"
          className="flex flex-wrap items-center gap-x-2 rounded-lg bg-accent-soft px-3 py-2 text-[13px]"
        >
          Tarefa adicionada para {formatShort(notice.day)}
          <button
            onClick={() => onSelectDate(notice.day)}
            className="font-medium text-accent hover:underline"
          >
            Ver esse dia
          </button>
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div
          role="group"
          aria-label="Filtrar por status"
          className="flex gap-1 rounded-full bg-ink/5 p-1"
        >
          {STATUS_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`rounded-full px-3 py-1 text-[13px] transition-colors ${
                filter === id
                  ? "bg-surface font-medium text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {total > 0 && (
          <p className="text-xs tabular-nums text-muted">
            {concluidas} de {total} concluídas
          </p>
        )}
      </div>

      <div
        role="group"
        aria-label="Filtrar por categoria"
        className="flex flex-wrap gap-2"
      >
        {["todas", ...Object.keys(CATEGORIES)].map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            aria-pressed={categoryFilter === c}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              categoryFilter === c
                ? "bg-accent-soft font-medium text-ink ring-1 ring-accent"
                : "bg-ink/5 text-muted hover:bg-ink/10 hover:text-ink"
            }`}
          >
            {c === "todas" ? "Todas as categorias" : CATEGORIES[c].label}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-1.5">
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

      {visibleTasks.length === 0 && (
        <p className="py-6 text-center text-muted">
          {total === 0
            ? "Nenhuma tarefa para este dia. Escreva a primeira acima."
            : "Nenhuma tarefa neste filtro."}
        </p>
      )}
    </div>
  );
}
