import { useEffect, useRef, useState } from "react";
import { Copy, ExternalLink, Trash2, X } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const URL_RE = /https?:\/\/[^\s<>"')]+/g;

// Gaveta lateral para colar texto e links temporários (Ctrl+J abre/fecha).
export default function Scratchpad({ open, onClose }) {
  const [text, setText] = useLocalStorage("scratchpad", "");
  const [copied, setCopied] = useState(false);
  const areaRef = useRef(null);
  const links = [...new Set(text.match(URL_RE) ?? [])];

  useEffect(() => {
    if (!open) return;
    areaRef.current?.focus();
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* sem permissão de área de transferência: nada a fazer */
    }
  }

  return (
    <aside
      role="dialog"
      aria-label="Rascunho rápido"
      inert={!open}
      className={`fixed bottom-0 right-0 top-14 z-40 flex w-80 flex-col gap-3 border-l border-line bg-surface p-4 shadow-2xl transition-transform duration-200 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-medium tracking-tight">
          Rascunho rápido
        </h2>
        <button
          onClick={onClose}
          aria-label="Fechar rascunho"
          className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-ink/10 hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>

      <textarea
        ref={areaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole aqui textos e links temporários…"
        className="selectable min-h-0 flex-1 resize-none rounded-lg border border-line bg-raised px-3 py-2.5 text-[13px] leading-relaxed text-ink outline-none placeholder:text-muted focus:border-accent"
      />

      {links.length > 0 && (
        <ul className="flex max-h-32 flex-col gap-1 overflow-y-auto">
          {links.map((url) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-accent hover:bg-ink/5"
              >
                <ExternalLink size={12} className="shrink-0" />
                <span className="truncate">{url}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between text-xs text-muted">
        <span>Ctrl+J abre e fecha</span>
        <div className="flex gap-1">
          <button
            onClick={copy}
            disabled={!text}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 transition-colors hover:bg-ink/10 hover:text-ink disabled:opacity-40"
          >
            <Copy size={13} />
            {copied ? "Copiado" : "Copiar"}
          </button>
          <button
            onClick={() => setText("")}
            disabled={!text}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 transition-colors hover:bg-ink/10 hover:text-ink disabled:opacity-40"
          >
            <Trash2 size={13} />
            Limpar
          </button>
        </div>
      </div>
    </aside>
  );
}