import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';
import { LoadingState } from '../ui/DataState';
import { notificationsApi } from '../../api/notifications';
import { queryKeys } from '../../api/queryKeys';
import { entityId, timeAgo } from '../../utils/formatters';

const typeIcons = {
  info: { icon: Info, color: 'text-cyan-600 bg-cyan-soft/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-warm bg-amber-warm/10' },
  alert: { icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
  success: { icon: CheckCircle, color: 'text-emerald-brand bg-emerald-brand/10' },
};

export default function NotificationCenter({ compact = false }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.notifications({ limit: compact ? 4 : 20 }),
    queryFn: () => notificationsApi.list({ limit: compact ? 4 : 20 }),
  });

  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount ?? notifications.filter((n) => !n.read).length;
  const items = compact ? notifications.slice(0, 4) : notifications;

  return (
    <Card>
      <CardHeader
        title="Smart Notifications"
        subtitle={`${unreadCount} unread`}
        action={<Bell className="w-4 h-4 text-foreground-subtle" />}
      />
      {isLoading ? <LoadingState message="Loading notifications..." /> : (
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-foreground-subtle py-4 text-center">No notifications</p>
          ) : items.map((n) => {
            const { icon: Icon, color } = typeIcons[n.type] || typeIcons.info;
            return (
              <button
                key={entityId(n)}
                type="button"
                onClick={() => !n.read && markRead.mutate(entityId(n))}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-surface-muted text-left ${!n.read ? 'bg-emerald-brand/5' : ''}`}
              >
                <div className={`p-1.5 rounded-lg ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-foreground-subtle mt-0.5 truncate">{n.message}</p>
                  <p className="text-xs text-foreground-subtle mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-brand shrink-0 mt-2" />}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
