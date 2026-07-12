import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Download, FileSpreadsheet, TrendingUp } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import KPIDashboard from '../components/widgets/KPIDashboard';
import VendorLeaderboard from '../components/widgets/VendorLeaderboard';
import ProcurementHeatmap from '../components/widgets/ProcurementHeatmap';
import { LoadingState, ErrorState } from '../components/ui/DataState';
import { useChartTheme } from '../utils/chartTheme';
import { formatCurrency } from '../utils/formatters';
import { reportsApi } from '../api/reports';
import { dashboardApi } from '../api/dashboard';
import { queryKeys } from '../api/queryKeys';
import { useToast } from '../context/ToastContext';

export default function Reports() {
  const chart = useChartTheme();
  const { success, error: toastError } = useToast();

  const { data: reportData, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.reports({}),
    queryFn: reportsApi.get,
  });

  const { data: dashboard } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.get,
  });

  const growth = reportData?.growth || [];
  const vendorPerformance = reportData?.vendorPerformance || [];
  const monthly = reportData?.monthly || {};
  const kpis = dashboard?.kpis || {};

  const handleExport = async (type) => {
    try {
      const res = await reportsApi.export(type);
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${type}.json`;
      a.click();
      URL.revokeObjectURL(url);
      success('Report exported');
    } catch (err) {
      toastError(err.response?.data?.message || 'Export failed');
    }
  };

  if (isLoading) return <LoadingState message="Loading reports..." />;
  if (isError) return <ErrorState message={error?.response?.data?.message || error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Real-time procurement intelligence"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} onClick={() => handleExport('procurement-growth')}>Export JSON</Button>
            <Button icon={Download} onClick={() => handleExport('monthly')}>Export Report</Button>
          </>
        }
      />

      <KPIDashboard kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Spending Trends" subtitle="Monthly procurement expenditure" />
          {growth.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growth}>
                <defs>
                  <linearGradient id="spendG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.colors.emerald} stopOpacity={chart.isDark ? 0.35 : 0.3} />
                    <stop offset="100%" stopColor={chart.colors.emerald} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="saveG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.colors.cyan} stopOpacity={chart.isDark ? 0.3 : 0.25} />
                    <stop offset="100%" stopColor={chart.colors.cyan} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: chart.axis }} />
                <YAxis tick={{ fontSize: 12, fill: chart.axis }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={chart.tooltip} />
                <Legend wrapperStyle={{ color: chart.legend }} />
                <Area type="monotone" dataKey="spending" stroke={chart.colors.emerald} fill="url(#spendG)" strokeWidth={2} />
                <Area type="monotone" dataKey="savings" stroke={chart.colors.cyan} fill="url(#saveG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-foreground-subtle py-12 text-center">No spending data</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Vendor Performance" subtitle="Delivery, quality & cost scores" />
          {vendorPerformance.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendorPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: chart.axis }} />
                <YAxis tick={{ fontSize: 12, fill: chart.axis }} />
                <Tooltip contentStyle={chart.tooltip} />
                <Legend wrapperStyle={{ color: chart.legend }} />
                <Bar dataKey="delivery" fill={chart.colors.emerald} radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" fill={chart.colors.cyan} radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill={chart.colors.amber} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-foreground-subtle py-12 text-center">No vendor performance data</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Procurement Growth" subtitle="Orders and vendor network expansion" />
          {growth.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: chart.axis }} />
                <YAxis tick={{ fontSize: 12, fill: chart.axis }} />
                <Tooltip contentStyle={chart.tooltip} />
                <Legend wrapperStyle={{ color: chart.legend }} />
                <Line type="monotone" dataKey="orders" stroke={chart.colors.emerald} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="vendors" stroke={chart.colors.cyan} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-foreground-subtle py-12 text-center">No growth data</p>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Monthly Procurement Report"
            subtitle="Current period summary"
            action={
              <span className="flex items-center gap-1 text-sm text-emerald-dark dark:text-emerald-brand">
                <TrendingUp className="w-4 h-4" />
              </span>
            }
          />
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Spend', value: formatCurrency(monthly.totalSpend) },
              { label: 'Cost Savings', value: formatCurrency(monthly.costSavings) },
              { label: 'RFQs Created', value: String(monthly.rfqsCreated ?? 0) },
              { label: 'POs Issued', value: String(monthly.posIssued ?? 0) },
              { label: 'Vendors Engaged', value: String(monthly.vendorsEngaged ?? 0) },
              { label: 'Avg. Cycle Time', value: monthly.avgCycleTime ?? '—' },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-surface-muted border border-border">
                <p className="text-xs text-foreground-subtle">{item.label}</p>
                <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendorLeaderboard leaderboard={dashboard?.leaderboard} />
        <ProcurementHeatmap heatmapData={dashboard?.heatmapData} />
      </div>
    </div>
  );
}
