import { CheckCircle, Circle, Clock } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';

export default function WorkflowVisualization({ steps }) {
  return (
    <Card>
      <CardHeader title="Workflow Progress" subtitle="Current approval pipeline" />
      <div className="relative">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const statusIcon = step.status === 'approved'
            ? <CheckCircle className="w-5 h-5 text-emerald-brand" />
            : step.status === 'pending'
            ? <Clock className="w-5 h-5 text-amber-warm" />
            : <Circle className="w-5 h-5 text-foreground-muted" />;

          return (
            <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
              {!isLast && (
                <div className={`absolute left-[9px] top-6 w-0.5 h-full ${step.status === 'approved' ? 'bg-emerald-brand' : 'bg-border'}`} />
              )}
              <div className="relative z-10 shrink-0">{statusIcon}</div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium text-foreground">{step.role}</p>
                <p className="text-xs text-foreground-subtle">{step.name}</p>
                {step.comment && (
                  <p className="text-xs text-foreground-subtle mt-1 italic">"{step.comment}"</p>
                )}
                {step.date && (
                  <p className="text-[10px] text-foreground-subtle mt-1">{step.date}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
