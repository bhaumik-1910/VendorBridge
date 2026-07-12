import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger, loading, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-overlay" onClick={onCancel} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface-elevated p-6 shadow-xl animate-fade-in">
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded-lg ${danger ? 'bg-red-50 text-red-500' : 'bg-amber-warm/10 text-amber-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground-subtle mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
