export default function Card({ title, children }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </h2>
      <div className="text-ink">{children}</div>
    </section>
  );
}
