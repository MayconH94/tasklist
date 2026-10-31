import { useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES, DEFAULT_CATEGORY } from "../lib/categories";
import Select from "./Select";

const FIELD =
  "h-9 rounded-lg border border-line bg-surface px-3 text-[13px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

export default function TaskForm({ onAdd, date }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  // Sem escolha própria, a tarefa vai para o dia que está aberto na tela.
  const [pickedDate, setPickedDate] = useState("");
  const dueDate = pickedDate || date;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, category, dueDate });
    setTitle("");
    setPickedDate("");
  }

  return (
    <div className="@container">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-raised p-3 @xl:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="O que você precisa fazer?"
          aria-label="Nova tarefa"
          className={`${FIELD} col-span-full h-10 text-sm`}
        />

        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Prioridade"
        >
          <option value="baixa">Prioridade baixa</option>
          <option value="media">Prioridade média</option>
          <option value="alta">Prioridade alta</option>
        </Select>

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Categoria"
        >
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <option key={key} value={key}>
              {c.label}
            </option>
          ))}
        </Select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setPickedDate(e.target.value)}
          aria-label="Data limite"
          className={`${FIELD} col-span-full @xl:col-auto`}
        />

        <button
          disabled={!title.trim()}
          className="col-span-full inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-[13px] font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 @xl:col-auto"
        >
          <Plus size={15} strokeWidth={2.5} />
          Adicionar
        </button>
      </form>
    </div>
  );
}
