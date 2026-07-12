import { Search, Command } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { vendorsApi } from '../../api/vendors';
import { rfqsApi } from '../../api/rfqs';
import { entityId } from '../../utils/formatters';

export default function SmartSearch({ className = '' }) {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);

  const { data: vendorResults } = useQuery({
    queryKey: ['search', 'vendors', debounced],
    queryFn: () => vendorsApi.list({ search: debounced, limit: 3 }),
    enabled: debounced.length >= 2,
  });

  const { data: rfqResults } = useQuery({
    queryKey: ['search', 'rfqs', debounced],
    queryFn: () => rfqsApi.list({ search: debounced, limit: 3 }),
    enabled: debounced.length >= 2,
  });

  const vendors = vendorResults?.items || [];
  const rfqs = rfqResults?.items || [];
  const hasResults = vendors.length > 0 || rfqs.length > 0;

  const go = (path) => {
    setQuery('');
    setFocused(false);
    navigate(path);
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center gap-2 rounded-xl border bg-surface-elevated px-4 py-2.5 transition-all duration-200 ${focused ? 'border-emerald-brand ring-2 ring-emerald-brand/25 shadow-sm' : 'border-border'}`}>
        <Search className="w-4 h-4 text-foreground-subtle shrink-0" />
        <input
          type="text"
          placeholder="Search vendors, RFQs, POs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-subtle outline-none"
        />
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface-muted text-[10px] text-foreground-subtle font-mono border border-border">
          <Command className="w-3 h-3" />K
        </kbd>
      </div>
      {focused && debounced.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-surface-elevated shadow-lg dark:shadow-black/40 z-50 p-2 animate-fade-in max-h-64 overflow-y-auto">
          {!hasResults ? (
            <p className="text-sm text-foreground-subtle px-3 py-2">No results for &quot;{debounced}&quot;</p>
          ) : (
            <>
              {vendors.length > 0 && (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-foreground-subtle px-2 py-1">Vendors</p>
                  {vendors.map((v) => (
                    <button
                      key={entityId(v)}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm text-foreground rounded-lg hover:bg-surface-muted transition-colors"
                      onMouseDown={() => go(`/vendors/${entityId(v)}`)}
                    >
                      {v.name}
                    </button>
                  ))}
                </>
              )}
              {rfqs.length > 0 && (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-foreground-subtle px-2 py-1 mt-1">RFQs</p>
                  {rfqs.map((r) => (
                    <button
                      key={entityId(r)}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm text-foreground rounded-lg hover:bg-surface-muted transition-colors"
                      onMouseDown={() => go('/rfq')}
                    >
                      {r.rfqNumber} — {r.title}
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
