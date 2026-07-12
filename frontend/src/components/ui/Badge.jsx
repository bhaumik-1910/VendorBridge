const statusStyles = {
  active: 'bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand border-emerald-brand/25',
  pending: 'bg-amber-warm/15 text-amber-700 dark:text-amber-warm border-amber-warm/25',
  inactive: 'bg-surface-muted text-foreground-subtle border-border',
  open: 'bg-cyan-soft/15 text-cyan-700 dark:text-cyan-soft border-cyan-soft/25',
  closed: 'bg-surface-muted text-foreground-muted border-border',
  draft: 'bg-surface-muted text-foreground-subtle border-border',
  evaluating: 'bg-amber-warm/15 text-amber-700 dark:text-amber-warm border-amber-warm/25',
  approved: 'bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand border-emerald-brand/25',
  rejected: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  submitted: 'bg-cyan-soft/15 text-cyan-700 dark:text-cyan-soft border-cyan-soft/25',
  in_transit: 'bg-cyan-soft/15 text-cyan-700 dark:text-cyan-soft border-cyan-soft/25',
  paid: 'bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand border-emerald-brand/25',
  overdue: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  waiting: 'bg-surface-muted text-foreground-subtle border-border',
  low: 'bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand',
  medium: 'bg-amber-warm/15 text-amber-700 dark:text-amber-warm',
  high: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400',
  rfq: 'bg-cyan-soft/15 text-cyan-700 dark:text-cyan-soft border-cyan-soft/25',
  quotation: 'bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand border-emerald-brand/25',
  approval: 'bg-amber-warm/15 text-amber-700 dark:text-amber-warm border-amber-warm/25',
  vendor: 'bg-surface-muted text-foreground-muted border-border',
  invoice: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  system: 'bg-surface-muted text-foreground-subtle border-border',
};

export default function Badge({ children, status, className = '' }) {
  const style = statusStyles[status] || 'bg-surface-muted text-foreground-muted border-border';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style} ${className}`}>
      {children || status}
    </span>
  );
}
