type MetricCardProps = {
  label: string;
  value: string;
  change?: string;
  tone?: 'green' | 'red' | 'blue' | 'purple';
  changeDirection?: 'up' | 'down';
};

export function MetricCard({ label, value, change, tone = 'green', changeDirection = 'up' }: MetricCardProps) {
  return (
    <article className={`ui-metric-card ui-metric-card--${tone}`}>
      <p className="ui-metric-card__label">{label}</p>
      <div className="ui-metric-card__value">{value}</div>
      {change ? (
        <div className={`ui-metric-card__change ui-metric-card__change--${changeDirection}`}>{change}</div>
      ) : null}
    </article>
  );
}
