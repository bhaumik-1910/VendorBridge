import { useTheme } from '../../context/ThemeContext';

export default function AuthIllustration() {
  const { isDark } = useTheme();

  const bg = isDark ? '#0B1220' : '#0F172A';
  const gridStroke = isDark ? '#1E293B' : '#1E293B';
  const nodeFill = isDark ? '#151D2E' : '#1E293B';

  return (
    <svg viewBox="0 0 400 320" fill="none" className="w-full max-w-lg mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="auth-grad-1" x1="0" y1="0" x2="400" y2="320">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="auth-line" x1="0" y1="0" x2="400" y2="0">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" rx="16" fill={bg} />
      <rect width="400" height="320" rx="16" fill="url(#auth-grad-1)" />
      {/* Grid */}
      {[...Array(8)].map((_, i) => (
        <line key={`h${i}`} x1="40" y1={40 + i * 35} x2="360" y2={40 + i * 35} stroke={gridStroke} strokeWidth="0.5" opacity="0.5" />
      ))}
      {[...Array(10)].map((_, i) => (
        <line key={`v${i}`} x1={40 + i * 35} y1="40" x2={40 + i * 35} y2="280" stroke={gridStroke} strokeWidth="0.5" opacity="0.5" />
      ))}
      {/* Vendor nodes */}
      {[
        { x: 80, y: 100, label: 'Vendor A' },
        { x: 80, y: 200, label: 'Vendor B' },
        { x: 320, y: 150, label: 'Enterprise' },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x - 30} y={n.y - 20} width="60" height="40" rx="8" fill={nodeFill} stroke="#334155" />
          <circle cx={n.x} cy={n.y} r="6" fill="#10B981" />
          <text x={n.x} y={n.y + 28} textAnchor="middle" fill="#94A3B8" fontSize="9">{n.label}</text>
        </g>
      ))}
      {/* Bridge connections */}
      <path d="M110 100 C180 80 220 120 290 150" stroke="url(#auth-line)" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
      <path d="M110 200 C180 220 220 170 290 150" stroke="url(#auth-line)" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
      {/* Center hub */}
      <rect x="175" y="125" width="50" height="50" rx="12" fill="#10B981" opacity="0.15" stroke="#10B981" strokeWidth="1.5" />
      <rect x="188" y="138" width="24" height="24" rx="6" fill="#10B981" />
      <path d="M194 150 H206 M200 144 V156" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" />
      <text x="200" y="195" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600">VendorBridge Hub</text>
      {/* Floating metrics */}
      <rect x="250" y="50" width="90" height="36" rx="8" fill={nodeFill} stroke="#334155" />
      <text x="295" y="72" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="600">$2.4M</text>
      <text x="295" y="82" textAnchor="middle" fill="#64748B" fontSize="7">Procured</text>
      <rect x="60" y="250" width="90" height="36" rx="8" fill={nodeFill} stroke="#334155" />
      <text x="105" y="272" textAnchor="middle" fill="#22D3EE" fontSize="10" fontWeight="600">98%</text>
      <text x="105" y="282" textAnchor="middle" fill="#64748B" fontSize="7">On-time</text>
    </svg>
  );
}
