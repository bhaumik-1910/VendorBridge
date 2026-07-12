const variants = {
  primary: 'bg-emerald-brand text-white hover:bg-emerald-dark shadow-sm shadow-emerald-brand/25 hover:shadow-emerald-brand/40',
  secondary: 'bg-charcoal text-white hover:bg-charcoal-light dark:bg-charcoal-light dark:hover:bg-charcoal-muted',
  outline: 'border border-border bg-surface-elevated text-foreground hover:bg-surface-muted hover:border-border-strong',
  ghost: 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
  danger: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500',
  amber: 'bg-amber-warm text-foreground hover:bg-amber-400',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed interactive ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
