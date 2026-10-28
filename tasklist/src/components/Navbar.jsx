import { Leaf, Moon, Sun } from "lucide-react";

export default function Navbar({ dark, onToggleDark }) {
  return (
    <nav className="sticky top-0 border-b border-slate-200 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mx-auto flex max-w-2xl items-center gap-2 p-4">
        <Leaf className="text-emerald-600" size={22} />
        <h1 className="flex-1 text-lg font-semibold">TaskList</h1>
        <button
          onClick={onToggleDark}
          aria-label="Alternar modo escuro"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
