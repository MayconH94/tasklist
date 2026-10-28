export default function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      <div className="text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  );
}