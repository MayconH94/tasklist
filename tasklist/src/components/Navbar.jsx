import { Leaf } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 border-b border-slate-200 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-2 p-4">
        <Leaf className="text-emerald-600" size={22} />
        <h1 className="text-lg font-semibold">TaskList</h1>
      </div>
    </nav>
  );
}