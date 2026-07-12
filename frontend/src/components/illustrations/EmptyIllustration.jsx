import { useTheme } from '../../context/ThemeContext';

export default function EmptyIllustration({ type = 'default' }) {
  const { isDark } = useTheme();
  const plate = isDark ? '#1E293B' : '#F1F5F9';
  const stroke = isDark ? '#334155' : '#CBD5E1';
  const accent = '#10B981';

  return (
    <svg viewBox="0 0 120 100" className="w-24 h-20" aria-hidden="true">
      <rect x="20" y="15" width="80" height="60" rx="8" fill={plate} stroke={stroke} strokeWidth="1.5" />
      <rect x="30" y="28" width="40" height="4" rx="2" fill={stroke} opacity="0.6" />
      <rect x="30" y="38" width="55" height="4" rx="2" fill={stroke} opacity="0.4" />
      <rect x="30" y="48" width="35" height="4" rx="2" fill={stroke} opacity="0.4" />
      <circle cx="85" cy="55" r="12" fill={accent} opacity="0.15" />
      <path d="M80 55 L84 59 L90 51" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {type === 'search' && (
        <circle cx="60" cy="78" r="8" stroke={accent} strokeWidth="2" fill="none" opacity="0.5" />
      )}
    </svg>
  );
}
