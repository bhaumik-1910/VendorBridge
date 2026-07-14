import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Clock, FileText, ShoppingCart, Receipt, Plus, GitCompare, Users, CheckSquare,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Logo from '../components/brand/Logo';
import { useAuth } from '../context/AuthContext';
import { useChartTheme } from '../utils/chartTheme';
import { formatCurrency } from '../utils/formatters';
import { dashboardApi } from '../api/dashboard';
import { queryKeys } from '../api/queryKeys';
import { LoadingState, ErrorState } from '../components/ui/DataState';
import AIRecommendation from '../components/widgets/AIRecommendation';
import ProcurementScore from '../components/widgets/ProcurementScore';
import CostSavings from '../components/widgets/CostSavings';
import NotificationCenter from '../components/widgets/NotificationCenter';
import ActivityFeed from '../components/widgets/ActivityFeed';
import VendorLeaderboard from '../components/widgets/VendorLeaderboard';
import ProcurementHeatmap from '../components/widgets/ProcurementHeatmap';
import ProcurementCalendar from '../components/widgets/ProcurementCalendar';
import KPIDashboard from '../components/widgets/KPIDashboard';

function AdminDashboard({ kpis }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active Vendors" value={kpis?.activeVendors ?? 0} icon={Users} color="emerald" />
        <StatCard title="Total RFQs" value={kpis?.totalRFQs ?? 0} icon={FileText} color="cyan" />
        <StatCard title="Total POs" value={kpis?.totalPOs ?? 0} icon={ShoppingCart} color="charcoal" />
      </div>
      <KPIDashboard kpis={kpis} />
    </div>
  );
}

function VendorDashboard({ stats, kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Active RFQs" value={stats?.activeRFQs ?? 0} icon={FileText} color="cyan" />
      <StatCard title="Submitted Quotes" value={kpis?.totalQuotations ?? 0} icon={Receipt} color="emerald" />
      <StatCard title="POs Received" value={stats?.totalPOs ?? 0} icon={ShoppingCart} color="amber" />
    </div>
  );
}

function ManagerDashboard({ stats, kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Pending Approvals" value={stats?.pendingApprovals ?? 0} icon={Clock} color="amber" />
      <StatCard title="Active RFQs" value={stats?.activeRFQs ?? 0} icon={FileText} color="emerald" />
      <StatCard title="Avg. Approval Time" value={kpis?.avgApprovalTime ?? '—'} icon={Clock} color="cyan" />
    </div>
  );
}

export default function Dashboard() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const chart = useChartTheme();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.get,
  });

  if (isLoading) return <LoadingState message="Loading dashboard..." />;
  if (isError) return <ErrorState message={error?.response?.data?.message || error.message} onRetry={refetch} />;

  const stats = data?.stats || {};
  const kpis = data?.kpis || {};
  const monthlySpending = data?.monthlySpending || [];
  const vendorPerformance = data?.vendorPerformance || [];
  const status = data?.status || {};
  const leaderboard = data?.leaderboard || [];
  const heatmapData = data?.heatmapData || [];
  const recentActivity = data?.recentActivity || [];

  const procurementStatusItems = [
    { label: 'Draft RFQs', count: status.draftRFQs ?? 0, color: 'bg-foreground-subtle' },
    { label: 'Open RFQs', count: status.openRFQs ?? 0, color: 'bg-cyan-soft' },
    { label: 'Evaluating', count: status.evaluating ?? 0, color: 'bg-amber-warm' },
    { label: 'Approved POs', count: status.approvedPOs ?? 0, color: 'bg-emerald-brand' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's your procurement overview"
        logo={<Logo variant="icon" className="hidden sm:block" />}
        actions={
          <>
            <Button variant="outline" icon={GitCompare} onClick={() => navigate('/quotations/compare')}>
              Compare Quotes
            </Button>
            <Button icon={Plus} onClick={() => navigate('/rfq/create')}>
              Create RFQ
            </Button>
          </>
        }
      />

      {role === 'admin' && <AdminDashboard kpis={kpis} />}
      {role === 'vendor' && <VendorDashboard stats={stats} kpis={kpis} />}
      {role === 'manager' && <ManagerDashboard stats={stats} kpis={kpis} />}

      {role === 'procurement' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Pending Approvals" value={stats.pendingApprovals ?? 0} icon={Clock} color="amber" />
          <StatCard title="Active RFQs" value={stats.activeRFQs ?? 0} icon={FileText} color="cyan" />
          <StatCard title="Purchase Orders" value={stats.totalPOs ?? 0} icon={ShoppingCart} color="emerald" />
          <StatCard title="Pending Invoices" value={stats.pendingInvoices ?? 0} icon={Receipt} color="charcoal" />
        </div>
      )}

      <KPIDashboard kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Monthly Spending" subtitle="Procurement expenditure trend" />
            {monthlySpending.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlySpending}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chart.colors.emerald} stopOpacity={chart.isDark ? 0.35 : 0.3} />
                      <stop offset="100%" stopColor={chart.colors.emerald} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: chart.axis }} />
                  <YAxis tick={{ fontSize: 12, fill: chart.axis }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={chart.tooltip} />
                  <Area type="monotone" dataKey="spending" stroke={chart.colors.emerald} fill="url(#spendGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-foreground-subtle py-8 text-center">No spending data yet</p>
            )}
          </Card>

          <Card>
            <CardHeader title="Vendor Performance" subtitle="Multi-dimensional vendor scoring" />
            {vendorPerformance.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={vendorPerformance}>
                  <PolarGrid stroke={chart.polarGrid} />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: chart.axis }} />
                  <Radar name="Delivery" dataKey="delivery" stroke={chart.colors.emerald} fill={chart.colors.emerald} fillOpacity={chart.isDark ? 0.2 : 0.15} />
                  <Radar name="Quality" dataKey="quality" stroke={chart.colors.cyan} fill={chart.colors.cyan} fillOpacity={chart.isDark ? 0.15 : 0.1} />
                  <Tooltip contentStyle={chart.tooltip} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-foreground-subtle py-8 text-center">No vendor performance data</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <AIRecommendation leaderboard={leaderboard} kpis={kpis} />
          <ProcurementScore score={kpis.procurementHealth} />
          <CostSavings kpis={kpis} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed items={recentActivity} />
        <NotificationCenter />
        <Card>
          <CardHeader title="Procurement Status" subtitle="Pipeline overview" />
          <div className="space-y-3">
            {procurementStatusItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-foreground-muted flex-1">{item.label}</span>
                <Badge>{item.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VendorLeaderboard leaderboard={leaderboard} />
        <ProcurementHeatmap heatmapData={heatmapData} />
        <ProcurementCalendar />
      </div>

      <Card>
        <CardHeader title="Quick Actions" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Create RFQ', icon: FileText, path: '/rfq/create' },
            { label: 'Add Vendor', icon: Users, path: '/vendors', state: { openAdd: true } },
            { label: 'Compare Quotes', icon: GitCompare, path: '/quotations/compare' },
            { label: 'View Approvals', icon: CheckSquare, path: '/approvals' },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path, action.state ? { state: action.state } : undefined)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-emerald-brand/30 hover:bg-emerald-brand/5 transition-all card-hover interactive"
            >
              <action.icon className="w-5 h-5 text-emerald-brand" />
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
