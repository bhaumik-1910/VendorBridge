import { AlertTriangle, Shield, ShieldAlert } from 'lucide-react';

const riskConfig = {
  low: { icon: Shield, color: 'text-emerald-brand', bg: 'bg-emerald-brand/10', label: 'Low Risk' },
  medium: { icon: ShieldAlert, color: 'text-amber-warm', bg: 'bg-amber-warm/10', label: 'Medium Risk' },
  high: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', label: 'High Risk' },
};

export default function RiskIndicator({ risk = 'low', showLabel = true, size = 'md' }) {
  const config = riskConfig[risk] || riskConfig.low;
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className={iconSize} />
      {showLabel && config.label}
    </span>
  );
}
