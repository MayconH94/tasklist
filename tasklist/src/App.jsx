import { useEffect, useState } from "react";
import Card from "./components/Card";
import Journal from "./components/Journal";
import Affirmations from "./components/Affirmations";
import Overview from "./components/Overview";
import Sidebar from "./components/Sidebar";
import ThemePicker from "./components/ThemePicker";
import Titlebar from "./components/Titlebar";
import TaskList from "./components/TaskList";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { formatLong, todayKey } from "./lib/dates";
import { DEFAULT_THEME, getTheme } from "./lib/themes";

const TITLES = {
  diario: "Diário",
  tarefas: "Foco em tarefas",
  visao: "Visão geral",
  temas: "Aparência",
};

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = prefersDark ? DEFAULT_THEME : "claro";

export default function App() {
  const [themeId, setThemeId] = useLocalStorage("theme", initialTheme);
  const theme = getTheme(themeId);
  const [view, setView] = useState("tarefas");
  const [selectedDate, setSelectedDate] = useState(todayKey());

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.classList.toggle("dark", theme.dark);
  }, [theme]);

  return (
    <div className="flex h-screen flex-col bg-app text-ink">
      <Titlebar emoji={theme.emoji} />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          view={view}
          onView={setView}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-10 py-8">
            <div>
              <p className="text-xs font-medium text-accent">
                {TITLES[view]}
              </p>
              <h1 className="selectable mt-1 text-2xl font-semibold tracking-tight">
                {view === "temas" ? "Escolha o visual do app" : formatLong(selectedDate)}
              </h1>
            </div>

          {view === "diario" && (
            <Card title="Afirmações">
              <Affirmations date={selectedDate} />
            </Card>
          )}
          {view === "diario" && (
            <div>
              <Card title="Notas e reflexões">
                <Journal date={selectedDate} />
              </Card>
            </div>
          )}
          {view === "tarefas" && (
            <Card title="Minhas tarefas">
              <TaskList />
            </Card>
          )}
          {view === "temas" && (
            <Card title="Temas">
              <ThemePicker theme={theme.id} onChange={setThemeId} />
            </Card>
          )}
          {view === "visao" && (
            <Card title="Visão geral">
              <Overview />
            </Card>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
