import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, GitCompare, CheckSquare,
  ShoppingCart, Receipt, Activity, BarChart3, Settings, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/brand/Logo';
import ThemeToggle from '../components/ui/ThemeToggle';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'vendor', 'manager', 'procurement'] },
  { path: '/vendors', label: 'Vendors', icon: Users, roles: ['admin', 'procurement', 'manager'] },
  { path: '/rfq', label: 'RFQs', icon: FileText, roles: ['admin', 'procurement', 'vendor', 'manager'] },
  { path: '/quotations/submit', label: 'Submit Quote', icon: FileText, roles: ['vendor'] },
  { path: '/quotations/compare', label: 'Compare Quotes', icon: GitCompare, roles: ['admin', 'procurement', 'manager'] },
  { path: '/approvals', label: 'Approvals', icon: CheckSquare, roles: ['admin', 'manager', 'procurement'] },
  { path: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, roles: ['admin', 'procurement', 'vendor', 'manager'] },
  { path: '/invoices', label: 'Invoices', icon: Receipt, roles: ['admin', 'procurement', 'vendor', 'manager'] },
  { path: '/activity', label: 'Activity Logs', icon: Activity, roles: ['admin', 'procurement', 'manager'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'procurement', 'manager'] },
];

export default function Sidebar({ open, onClose }) {
  const { role } = useAuth();
  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {open && <div className="fixed inset-0 bg-overlay z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-text flex flex-col transition-transform duration-300 lg:translate-x-0 border-r border-sidebar-border ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <Logo variant="compact" forceTheme="dark" />
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors interactive">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filtered.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-sidebar-active text-emerald-brand shadow-sm'
                  : 'text-sidebar-muted hover:text-sidebar-text hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-sidebar-muted">Theme</span>
            <ThemeToggle />
          </div>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-muted hover:text-sidebar-text hover:bg-white/5 transition-all"
          >
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
