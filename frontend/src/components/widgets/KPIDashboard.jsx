import { Clock, Users, TrendingUp, Target } from 'lucide-react';

const colors = {
  cyan: 'bg-cyan-soft/10 text-cyan-600',
  emerald: 'bg-emerald-brand/10 text-emerald-brand',
  amber: 'bg-amber-warm/10 text-amber-600',
  charcoal: 'bg-charcoal/5 text-foreground',
};

export default function KPIDashboard({ kpis = {} }) {
  const items = [
    { label: 'Avg. Approval Time', value: kpis.avgApprovalTime ?? '—', icon: Clock, color: 'cyan' },
    { label: 'Active Vendors', value: kpis.activeVendors ?? 0, icon: Users, color: 'emerald' },
    { label: 'Cost Savings', value: kpis.costSavingsPercent != null ? `${kpis.costSavingsPercent}%` : '—', icon: TrendingUp, color: 'amber' },
    { label: 'Compliance Rate', value: kpis.vendorCompliance != null ? `${kpis.vendorCompliance}%` : '—', icon: Target, color: 'charcoal' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((kpi) => (
        <div key={kpi.label} className="rounded-xl border border-border/80 bg-surface-elevated p-4 card-hover">
          <div className={`inline-flex p-2 rounded-lg ${colors[kpi.color]} mb-3`}>
            <kpi.icon className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-foreground">{kpi.value}</p>
          <p className="text-xs text-foreground-subtle mt-1">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
