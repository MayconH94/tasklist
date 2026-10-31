export default function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <h2 className="mb-4 font-display text-lg font-medium tracking-tight">
        {title}
      </h2>
      <div className="text-ink">{children}</div>
    </section>
  );
}
