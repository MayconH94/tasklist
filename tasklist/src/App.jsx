import Navbar from "./components/Navbar";
import Card from "./components/Card";
import TaskList from "./components/TaskList";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useEffect } from "react";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

export default function App() {
  const [dark, setDark] = useLocalStorage("dark", prefersDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navbar dark={dark} onToggleDark={() => setDark(!dark)} />
      <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
        <Card title="Minhas tarefas">
          <TaskList />
        </Card>
      </main>
    </div>
  );
}
