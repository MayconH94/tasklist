import { useState } from "react";
import { useData } from "../context/DataContext";

// Escolhe sempre a mesma afirmação para o mesmo dia
function pickIndex(date, length) {
  let sum = 0;
  for (const ch of date) sum += ch.charCodeAt(0);
  return sum % length;
}

export default function Affirmations({ date }) {
  const { affirmations: items, setAffirmations: setItems } = useData();
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  function add(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), text }]);
    setDraft("");
  }

  function remove(id) {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  function startEdit(a) {
    setEditingId(a.id);
    setEditText(a.text);
  }

  function saveEdit() {
    const text = editText.trim();
    if (text) {
      setItems((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, text } : a)),
      );
    }
    setEditingId(null);
  }

  const today = items.length > 0 ? items[pickIndex(date, items.length)] : null;

  return (
    <div className="flex flex-col gap-4">
      {today && (
        <blockquote className="rounded-lg bg-accent-soft px-4 py-3 text-lg font-medium text-ink">
          “{today.text}”
        </blockquote>
      )}

      <form onSubmit={add} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nova afirmação…"
          className="min-w-40 flex-1 rounded-lg border border-line bg-raised px-3 py-2 text-ink outline-none placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="rounded-lg bg-accent px-4 py-2 font-medium text-on-accent hover:opacity-90 disabled:opacity-40"
        >
          Adicionar
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {items.map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-2 rounded-lg border border-line bg-raised px-3 py-2"
          >
            {editingId === a.id ? (
              <input
                autoFocus
                aria-label="Editar afirmação"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 rounded border border-accent bg-transparent px-2 py-1 text-ink outline-none"
              />
            ) : (
              <span
                onDoubleClick={() => startEdit(a)}
                className="flex-1 text-ink"
              >
                {a.text}
              </span>
            )}
            <button
              onClick={() => startEdit(a)}
              aria-label="Editar"
              className="text-muted hover:text-accent"
            >
              ✎
            </button>
            <button
              onClick={() => remove(a.id)}
              aria-label="Remover"
              className="text-muted hover:text-rose-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-sm text-muted">
          Nenhuma afirmação ainda. Escreva a primeira acima.
        </p>
      )}
    </div>
  );
}
