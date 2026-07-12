import { X } from 'lucide-react';

export default function Drawer({ open, onClose, title, children, width = 'max-w-md' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-overlay backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${width} bg-surface-elevated shadow-2xl dark:shadow-black/50 animate-fade-in overflow-y-auto border-l border-border`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface-elevated px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors interactive">
            <X className="w-5 h-5 text-foreground-subtle" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
