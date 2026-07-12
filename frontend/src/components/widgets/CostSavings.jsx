import { PiggyBank } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

export default function CostSavings({ kpis = {} }) {
  return (
    <Card className="border-emerald-brand/20 bg-gradient-to-br from-emerald-brand/5 to-transparent">
      <CardHeader title="Cost Savings" subtitle="Year to date" />
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-brand/10">
          <PiggyBank className="w-6 h-6 text-emerald-brand" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(kpis.costSavings ?? 0)}</p>
          <p className="text-xs text-foreground-subtle mt-1">
            {kpis.costSavingsPercent != null ? `${kpis.costSavingsPercent}% below market average` : 'Savings from competitive bidding'}
          </p>
        </div>
      </div>
    </Card>
  );
}
