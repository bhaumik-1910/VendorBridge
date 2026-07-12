export default function PageHeader({ title, subtitle, actions, breadcrumbs, logo }) {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <nav className="text-sm text-foreground-subtle mb-2">{breadcrumbs}</nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {logo}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-foreground-subtle mt-1">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
