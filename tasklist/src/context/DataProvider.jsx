import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_AFFIRMATIONS } from "../lib/defaults";
import { DataContext } from "./DataContext";

// Único lugar que sabe ONDE os dados ficam (hoje: localStorage).
// Na Aula 15 trocamos só aqui por um arquivo JSON, sem mexer nas telas.
export default function DataProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [entries, setEntries] = useLocalStorage("entries", {});
  const [affirmations, setAffirmations] = useLocalStorage(
    "affirmations",
    DEFAULT_AFFIRMATIONS,
  );

  const value = {
    tasks,
    setTasks,
    entries,
    setEntries,
    affirmations,
    setAffirmations,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
