import { Outlet, useLocation } from 'react-router-dom';
import { Shield, Zap, BarChart3 } from 'lucide-react';
import Logo from '../components/brand/Logo';
import ThemeToggle from '../components/ui/ThemeToggle';

const features = [
  { icon: Zap, text: 'AI vendor recommendations' },
  { icon: Shield, text: 'Secure approval workflows' },
  { icon: BarChart3, text: 'Real-time procurement analytics' },
];

const stats = [
  { value: '500+', label: 'Vendors' },
  { value: '$2.4M', label: 'Procured' },
  { value: '98%', label: 'On-time' },
];

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isSignup = pathname === '/signup';

  return (
    <div className="auth-shell h-screen w-screen overflow-hidden flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] auth-hero relative overflow-hidden flex-col justify-between p-10 xl:p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-brand/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-soft/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <Logo variant="full" forceTheme="dark" className="relative z-10" />

        <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
          <h1 className="text-3xl xl:text-[2.75rem] font-bold text-sidebar-text leading-[1.15] tracking-tight">
            Procurement that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-brand to-cyan-soft">
              connects
            </span>
            <br />
            vendors & enterprise
          </h1>
          <p className="mt-4 text-sidebar-muted text-base max-w-md leading-relaxed">
            Manage RFQs, quotations, approvals, and invoices — all in one premium ERP platform.
          </p>

          <ul className="mt-8 space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sidebar-muted">
                <span className="w-8 h-8 rounded-lg bg-emerald-brand/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-brand" />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex gap-8 pt-6 border-t border-white/10">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-sidebar-text">{s.value}</p>
              <p className="text-xs text-sidebar-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel — fixed height, no page scroll */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden auth-panel">
        <header className="shrink-0 flex items-center justify-between px-5 sm:px-8 py-4">
          <div className="lg:hidden">
            <Logo variant="compact" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-foreground-subtle">
              {isSignup ? 'Already registered?' : 'New here?'}
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-5 sm:px-8 pb-6 min-h-0">
          <div className={`auth-card w-full ${isSignup ? 'max-w-[520px]' : 'max-w-[420px]'}`}>
            <Outlet />
          </div>
        </main>

        <footer className="shrink-0 py-3 text-center text-[11px] text-foreground-subtle">
          © 2024 VendorBridge · Enterprise Procurement Platform
        </footer>
      </div>
    </div>
  );
}
