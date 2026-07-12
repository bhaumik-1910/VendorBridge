import { useId } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * VendorBridge custom logo — bridge connecting vendor nodes through a procurement hub.
 */
export default function Logo({ variant = 'full', className = '', forceTheme }) {
  const { isDark } = useTheme();
  const dark = forceTheme ? forceTheme === 'dark' : isDark;

  const wordmarkColor = dark ? '#F8FAFC' : '#0F172A';
  const taglineColor = dark ? '#94A3B8' : '#64748B';
  const uid = useId().replace(/:/g, '');

  const Mark = ({ size = 40 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`vb-ga-${uid}`} x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={`vb-gb-${uid}`} x1="48" y1="0" x2="0" y2="48">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id={`vb-br-${uid}`} x1="8" y1="28" x2="40" y2="28">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={dark ? '#1E293B' : '#0F172A'} />
      <circle cx="12" cy="20" r="4" fill={`url(#vb-ga-${uid})`} opacity="0.9" />
      <circle cx="12" cy="20" r="1.5" fill={dark ? '#0F172A' : '#F8FAFC'} />
      <circle cx="36" cy="20" r="4" fill={`url(#vb-gb-${uid})`} opacity="0.9" />
      <circle cx="36" cy="20" r="1.5" fill={dark ? '#0F172A' : '#F8FAFC'} />
      <path d="M12 24 C12 24 20 14 24 18 C28 22 36 24 36 24" stroke={`url(#vb-br-${uid})`} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="20" y="26" width="8" height="8" rx="2" fill={`url(#vb-ga-${uid})`} />
      <path d="M22 30 H26 M24 28 V32" stroke={dark ? '#0F172A' : '#F8FAFC'} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 28 L20 30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M36 28 L28 30" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M24 34 L24 38 M20 38 H28" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={className}><Mark size={40} /></div>;
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Mark size={36} />
        <div className="min-w-0">
          <p className="text-base font-bold tracking-tight leading-none transition-colors" style={{ color: wordmarkColor }}>
            VendorBridge
          </p>
          <p className="text-[10px] uppercase tracking-widest mt-0.5 transition-colors" style={{ color: taglineColor }}>
            Procurement ERP
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Mark size={44} />
      <div>
        <p className="text-xl font-bold tracking-tight leading-none transition-colors" style={{ color: wordmarkColor }}>
          VendorBridge
        </p>
        <p className="text-xs mt-0.5 transition-colors" style={{ color: taglineColor }}>
          Procurement & Vendor Management
        </p>
      </div>
    </div>
  );
}
