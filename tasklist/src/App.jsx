import { useEffect, useState } from "react";
import Card from "./components/Card";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import { useLocalStorage } from "./hooks/useLocalStorage";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function App() {
  const [dark, setDark] = useLocalStorage("dark", prefersDark);
  const [view, setView] = useState("tarefas");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        view={view}
        onView={setView}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
      />

      <main className="flex-1 overflow-y-auto p-8">
        {view === "diario" && <p>Em breve: o diário.</p>}
        {view === "tarefas" && (
          <div className="mx-auto max-w-2xl">
            <Card title="Minhas tarefas">
              <TaskList />
            </Card>
          </div>
        )}
        {view === "visao" && <p>Em breve: visão geral.</p>}
      </main>
    </div>
  );
}
