import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Users, CheckCircle, DollarSign, Settings } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import AdvancedFilters from '../components/widgets/AdvancedFilters';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/DataState';
import { entityId } from '../utils/formatters';
import { activityApi } from '../api/activity';
import { queryKeys } from '../api/queryKeys';

const typeIcons = {
  rfq: FileText,
  quotation: DollarSign,
  approval: CheckCircle,
  vendor: Users,
  invoice: DollarSign,
  system: Settings,
};

const typeColors = {
  rfq: 'bg-cyan-soft/10 text-cyan-600',
  quotation: 'bg-emerald-brand/10 text-emerald-dark',
  approval: 'bg-amber-warm/10 text-amber-600',
  vendor: 'bg-charcoal/5 text-foreground',
  invoice: 'bg-red-50 text-red-500',
  system: 'bg-surface-muted text-foreground-subtle',
};

const filterOptions = [
  { key: 'type', label: 'Event Type', options: [
    { value: '', label: 'All Types' },
    { value: 'rfq', label: 'RFQ' },
    { value: 'quotation', label: 'Quotation' },
    { value: 'approval', label: 'Approval' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'system', label: 'System' },
  ]},
];

export default function ActivityLogs() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const params = { page, limit: 30, type: filters.type || undefined };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.activity(params),
    queryFn: () => activityApi.list(params),
  });

  const logs = data?.items || [];
  const pagination = data?.pagination;

  const grouped = logs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Activity Logs"
        subtitle="Complete audit trail of procurement events"
        actions={<AdvancedFilters filters={filterOptions} onApply={(f) => { setFilters(f); setPage(1); }} />}
      />

      <Card>
        {isLoading && <LoadingState />}
        {isError && <ErrorState message={error?.response?.data?.message || error.message} onRetry={refetch} />}
        {!isLoading && !isError && logs.length === 0 && <EmptyState message="No activity logs" />}

        {!isLoading && !isError && logs.length > 0 && (
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <CardHeader title={date} />
                <div className="space-y-2">
                  {items.map((log) => {
                    const Icon = typeIcons[log.type] || Settings;
                    return (
                      <div key={entityId(log)} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-muted transition-colors">
                        <div className={`p-2 rounded-lg ${typeColors[log.type] || typeColors.system}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{log.userName || 'System'}</span>
                            {' '}{log.action}
                          </p>
                          <p className="text-xs text-foreground-subtle mt-0.5">{log.target}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge>{log.type}</Badge>
                          <p className="text-[10px] text-foreground-subtle mt-1">
                            {new Date(log.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button size="sm" variant="outline" disabled={!pagination.hasPrev} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span className="text-sm text-foreground-subtle self-center">Page {pagination.page} of {pagination.totalPages}</span>
            <Button size="sm" variant="outline" disabled={!pagination.hasNext} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
