import Navbar from "./components/Navbar";
import Card from "./components/Card";
import TaskList from "./components/TaskList";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
        <Card title="Minhas tarefas">
          <TaskList />
        </Card>
      </main>
    </div>
  );
}
