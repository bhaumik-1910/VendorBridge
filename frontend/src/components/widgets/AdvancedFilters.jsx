import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import Button from '../ui/Button';
import { Select } from '../ui/Input';

export default function AdvancedFilters({ filters, onApply }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});

  return (
    <div className="relative">
      <Button variant="outline" size="sm" icon={SlidersHorizontal} onClick={() => setOpen(!open)}>
        Filters
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-surface-elevated shadow-xl dark:shadow-black/40 z-50 p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">Advanced Filters</h4>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-surface-muted interactive">
                <X className="w-4 h-4 text-foreground-subtle" />
              </button>
            </div>
            <div className="space-y-3">
              {filters.map((f) => (
                <Select
                  key={f.key}
                  label={f.label}
                  options={f.options}
                  value={values[f.key] || ''}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1" onClick={() => { onApply?.(values); setOpen(false); }}>
                Apply
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setValues({}); onApply?.({}); setOpen(false); }}>
                Clear
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
