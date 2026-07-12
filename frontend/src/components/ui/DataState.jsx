import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import Button from './Button';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-foreground-subtle">
      <div className="w-8 h-8 border-2 border-emerald-brand border-t-transparent rounded-full animate-spin" />
      <p className="text-sm mt-3">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
      <p className="text-sm text-foreground-muted max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" icon={RefreshCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-foreground-subtle">
      <Inbox className="w-10 h-10 mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
