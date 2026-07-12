import { useQuery } from '@tanstack/react-query';
import { Calendar, FileText, Clock } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { LoadingState } from '../ui/DataState';
import { rfqsApi } from '../../api/rfqs';
import { queryKeys } from '../../api/queryKeys';
import { entityId } from '../../utils/formatters';

const typeConfig = {
  deadline: { icon: Clock, color: 'bg-red-50 text-red-500' },
  rfq: { icon: FileText, color: 'bg-cyan-soft/10 text-cyan-600' },
};

export default function ProcurementCalendar() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.rfqs({ status: 'open', limit: 5, sortBy: 'deadline', order: 'asc' }),
    queryFn: () => rfqsApi.list({ status: 'open', limit: 5, sortBy: 'deadline', order: 'asc' }),
  });

  const events = (data?.items || []).map((rfq) => ({
    id: entityId(rfq),
    title: rfq.title,
    date: rfq.deadline,
    type: 'deadline',
  }));

  return (
    <Card>
      <CardHeader title="Procurement Calendar" subtitle="Upcoming RFQ deadlines" />
      {isLoading ? <LoadingState message="Loading calendar..." /> : events.length === 0 ? (
        <p className="text-sm text-foreground-subtle py-4 text-center">No upcoming deadlines</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const { icon: Icon, color } = typeConfig[event.type] || typeConfig.rfq;
            const date = new Date(event.date);
            return (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-muted transition-colors">
                <div className="text-center w-12 shrink-0">
                  <p className="text-xs text-foreground-subtle uppercase">{date.toLocaleDateString('en', { month: 'short' })}</p>
                  <p className="text-lg font-bold text-foreground leading-none">{date.getDate()}</p>
                </div>
                <div className={`p-2 rounded-lg ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-foreground flex-1 line-clamp-2">{event.title}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
