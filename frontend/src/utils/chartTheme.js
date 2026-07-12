import { useTheme } from '../context/ThemeContext';

export function useChartTheme() {
  const { isDark } = useTheme();

  return {
    isDark,
    grid: isDark ? '#1E293B' : '#E2E8F0',
    axis: isDark ? '#94A3B8' : '#64748B',
    tooltip: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
      borderRadius: 8,
      color: isDark ? '#F1F5F9' : '#0F172A',
      boxShadow: isDark
        ? '0 8px 24px rgba(0,0,0,0.4)'
        : '0 8px 24px rgba(15,23,42,0.08)',
    },
    colors: {
      emerald: '#10B981',
      cyan: '#22D3EE',
      amber: '#F59E0B',
      emeraldFill: isDark ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.15)',
      cyanFill: isDark ? 'rgba(34,211,238,0.2)' : 'rgba(34,211,238,0.1)',
    },
    polarGrid: isDark ? '#334155' : '#E2E8F0',
    legend: isDark ? '#CBD5E1' : '#64748B',
  };
}
