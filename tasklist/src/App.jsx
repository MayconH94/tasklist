import { useEffect, useState } from "react";
import Card from "./components/Card";
import Journal from "./components/Journal";
import Affirmations from "./components/Affirmations";
import Overview from "./components/Overview";
import Sidebar from "./components/Sidebar";
import ThemePicker from "./components/ThemePicker";
import Scratchpad from "./components/Scratchpad";
import Titlebar from "./components/Titlebar";
import TaskList from "./components/TaskList";
import DayNav from "./components/DayNav";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useToday } from "./hooks/useToday";
import { formatLong } from "./lib/dates";
import { DEFAULT_THEME, getTheme } from "./lib/themes";

const TITLES = {
  diario: "Diário",
  tarefas: "Foco em tarefas",
  visao: "Estatísticas",
  temas: "Aparência",
};

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = prefersDark ? DEFAULT_THEME : "claro";

export default function App() {
  const [themeId, setThemeId] = useLocalStorage("theme", initialTheme);
  const theme = getTheme(themeId);
  const [view, setView] = useState("tarefas");
  const [scratchOpen, setScratchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // menu lateral em telas pequenas
  const today = useToday();
  // null = acompanha "hoje": quando a data vira, o app passa para o novo dia.
  const [pickedDate, setPickedDate] = useState(null);
  const selectedDate = pickedDate ?? today;
  const selectDate = (day) => {
    setPickedDate(day === today ? null : day);
    setMenuOpen(false);
  };
  const selectView = (id) => {
    setView(id);
    setMenuOpen(false);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.classList.toggle("dark", theme.dark);
  }, [theme]);

  // Ctrl+J abre/fecha o rascunho rápido; Esc fecha o menu lateral.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setScratchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-app text-ink">
      <Titlebar
        emoji={theme.emoji}
        today={today}
        onStats={() => selectView("visao")}
        onMenu={() => setMenuOpen((open) => !open)}
        menuOpen={menuOpen}
        onScratch={() => setScratchOpen((open) => !open)}
      />

      <div className="relative flex min-h-0 flex-1">
        <Sidebar
          view={view}
          onView={selectView}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          selectedDate={selectedDate}
          onSelectDate={selectDate}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 md:px-10 md:py-8">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
              <div>
                <p className="text-xs font-medium text-accent">
                  {TITLES[view]}
                </p>
                <h1 className="selectable mt-1 font-display text-2xl font-normal tracking-tight sm:text-3xl">
                  {view === "temas"
                    ? "Escolha o visual do app"
                    : formatLong(selectedDate)}
                </h1>
              </div>
              {(view === "diario" || view === "tarefas") && (
                <DayNav
                  date={selectedDate}
                  today={today}
                  onChange={selectDate}
                />
              )}
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
                <TaskList
                  date={selectedDate}
                  today={today}
                  onSelectDate={selectDate}
                />
              </Card>
            )}
            {view === "temas" && (
              <Card title="Temas">
                <ThemePicker theme={theme.id} onChange={setThemeId} />
              </Card>
            )}
            {view === "visao" && (
              <Card title="Estatísticas">
                <Overview />
              </Card>
            )}
          </div>
        </main>
      </div>

      <Scratchpad open={scratchOpen} onClose={() => setScratchOpen(false)} />
    </div>
  );
}
