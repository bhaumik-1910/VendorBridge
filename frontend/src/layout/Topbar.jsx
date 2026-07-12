import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Menu, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SmartSearch from '../components/widgets/SmartSearch';
import ThemeToggle from '../components/ui/ThemeToggle';
import Logo from '../components/brand/Logo';
import { notificationsApi } from '../api/notifications';
import { queryKeys } from '../api/queryKeys';

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, ROLE_LABELS, role, logout } = useAuth();

  const { data } = useQuery({
    queryKey: queryKeys.notifications({ limit: 1 }),
    queryFn: () => notificationsApi.list({ limit: 1 }),
  });

  const unread = data?.unreadCount ?? 0;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center gap-4 px-4 lg:px-6 py-3">
        <button type="button" onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors interactive">
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        <div className="hidden lg:flex items-center gap-3 mr-2">
          <Logo variant="icon" />
        </div>

        <SmartSearch className="flex-1 max-w-md hidden sm:block" />

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle className="hidden lg:flex" />

          <Link to="/dashboard" className="relative p-2 rounded-lg hover:bg-surface-muted transition-colors interactive" title="Notifications">
            <Bell className="w-5 h-5 text-foreground-subtle" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-brand text-white text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
                {unread}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-lg bg-emerald-brand/15 text-emerald-dark dark:text-emerald-brand flex items-center justify-center text-xs font-bold">
              {user.avatar}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground leading-none">{user.name}</p>
              <p className="text-[10px] text-foreground-subtle mt-0.5">{ROLE_LABELS[role]}</p>
            </div>
            <button type="button" onClick={handleLogout} className="p-2 rounded-lg hover:bg-surface-muted transition-colors" title="Logout">
              <LogOut className="w-4 h-4 text-foreground-subtle" />
            </button>
            <ChevronDown className="w-4 h-4 text-foreground-subtle hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
