export default function Card({ children, className = '', hover = false, glass = false, ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface-elevated p-5 shadow-sm dark:shadow-black/20 ${hover ? 'card-hover cursor-pointer' : ''} ${glass ? 'glass' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
        {subtitle && <p className="text-sm text-foreground-subtle mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
