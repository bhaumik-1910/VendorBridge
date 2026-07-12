export default function StatCard({ title, value, change, icon: Icon, color = 'emerald', trend }) {
  const colors = {
    emerald: 'bg-emerald-brand/15 text-emerald-brand dark:text-emerald-brand',
    cyan: 'bg-cyan-soft/15 text-cyan-600 dark:text-cyan-soft',
    amber: 'bg-amber-warm/15 text-amber-700 dark:text-amber-warm',
    charcoal: 'bg-surface-muted text-foreground-muted',
  };

  const trendColors = {
    up: 'bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand',
    down: 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400',
    stable: 'bg-surface-muted text-foreground-subtle',
  };

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5 shadow-sm dark:shadow-black/20 card-hover">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${colors[color]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendColors[trend] || trendColors.stable}`}>
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-foreground-subtle">{title}</p>
    </div>
  );
}
