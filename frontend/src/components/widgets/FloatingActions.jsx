import { useState } from 'react';
import { Plus, FileText, Users, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { label: 'Create RFQ', icon: FileText, path: '/rfq/create', color: 'bg-emerald-brand' },
  { label: 'Add Vendor', icon: Users, path: '/vendors', color: 'bg-cyan-600' },
  { label: 'New PO', icon: ShoppingCart, path: '/purchase-orders', color: 'bg-amber-warm' },
];

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && actions.map((action, i) => (
        <button
          key={action.label}
          onClick={() => { navigate(action.path); setOpen(false); }}
          className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-full bg-surface-elevated shadow-lg dark:shadow-black/40 border border-border text-sm font-medium text-foreground hover:shadow-xl transition-all animate-fade-in interactive"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {action.label}
          <span className={`w-8 h-8 rounded-full ${action.color} text-white flex items-center justify-center`}>
            <action.icon className="w-4 h-4" />
          </span>
        </button>
      ))}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 interactive ${open ? 'bg-charcoal dark:bg-charcoal-light rotate-45' : 'bg-emerald-brand hover:bg-emerald-dark'} text-white`}
      >
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}
