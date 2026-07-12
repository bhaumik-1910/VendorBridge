import { Gauge } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';

export default function ProcurementScore({ score = 0 }) {
  const pct = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <Card>
      <CardHeader title="Procurement Health" subtitle="Overall score" />
      <div className="flex flex-col items-center py-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-muted" />
            <circle
              cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" className="text-emerald-brand transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Gauge className="w-5 h-5 text-emerald-brand mb-1" />
            <span className="text-2xl font-bold text-foreground">{pct}</span>
          </div>
        </div>
        <p className="text-xs text-foreground-subtle mt-3 text-center">Based on vendor compliance, savings & delivery</p>
      </div>
    </Card>
  );
}
