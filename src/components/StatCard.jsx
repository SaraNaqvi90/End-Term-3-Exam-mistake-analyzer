function StatCard({ label, value, helpText }) {
  return (
    <article className="stat-card">
      <p className="stat-label">{label}</p>
      <h3>{value}</h3>
      <p className="stat-help">{helpText}</p>
    </article>
  );
}

export default StatCard;
