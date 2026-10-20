export function DetailPanel({ title, children, className = '' }) {
  return (
    <section className={`detail-panel ${className}`.trim()}>
      <h2>{title}</h2>
      <div className="detail-panel__content">{children}</div>
    </section>
  );
}
