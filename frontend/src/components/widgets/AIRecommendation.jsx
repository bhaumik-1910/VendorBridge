import { Sparkles, Star, TrendingUp } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';

export default function AIRecommendation({ leaderboard = [], kpis = {} }) {
  const top = leaderboard[0];
  if (!top) {
    return (
      <Card className="border-emerald-brand/20 bg-gradient-to-br from-emerald-brand/5 to-cyan-soft/5">
        <CardHeader title="AI Vendor Recommendation" subtitle="Based on price, delivery & performance" />
        <p className="text-sm text-foreground-subtle py-4 text-center">No recommendations yet</p>
      </Card>
    );
  }

  const savings = kpis.costSavings ?? 0;

  return (
    <Card className="border-emerald-brand/20 bg-gradient-to-br from-emerald-brand/5 to-cyan-soft/5">
      <CardHeader
        title="AI Vendor Recommendation"
        subtitle="Based on price, delivery & performance"
        action={
          <div className="flex items-center gap-1 text-emerald-brand">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">AI Powered</span>
          </div>
        }
      />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-brand text-white flex items-center justify-center font-bold text-sm">
          {top.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{top.name}</h4>
            <Badge status="low">Top Rated</Badge>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-foreground-subtle">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-warm fill-amber-warm" />
              Score {top.score}
            </span>
          </div>
          {savings > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-brand" />
              <span className="text-emerald-dark font-medium">
                Potential savings {formatCurrency(savings)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
