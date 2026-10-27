export default function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-800">{title}</h2>
      <div className="text-slate-600">{children}</div>
    </section>
  );
}