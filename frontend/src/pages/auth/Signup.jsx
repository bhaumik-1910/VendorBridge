import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, ArrowRight, UserCog } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getAuthErrorMessage } from '../../utils/authErrors';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'procurement', label: 'Procurement Officer' },
  { value: 'manager', label: 'Manager / Approver' },
  { value: 'vendor', label: 'Vendor' },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', company: '', role: 'procurement',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toastError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toastError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        company: form.company,
        role: form.role,
      });
      success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toastError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Create account</h2>
        <p className="text-sm text-foreground-subtle mt-1">Start managing procurement in minutes</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="auth-field sm:col-span-2">
            <label htmlFor="name">Full Name</label>
            <div className="auth-input-wrap">
              <User className="auth-input-icon" />
              <input id="name" value={form.name} onChange={update('name')} placeholder="John Doe" required />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <div className="auth-input-wrap">
              <Mail className="auth-input-icon" />
              <input id="signup-email" type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" required />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="company">Company</label>
            <div className="auth-input-wrap">
              <Building2 className="auth-input-icon" />
              <input id="company" value={form.company} onChange={update('company')} placeholder="Acme Corp" required />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <div className="auth-input-wrap">
              <Lock className="auth-input-icon" />
              <input id="signup-password" type="password" value={form.password} onChange={update('password')} placeholder="Min. 8 characters" required minLength={8} />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Confirm Password</label>
            <div className="auth-input-wrap">
              <Lock className="auth-input-icon" />
              <input id="confirm" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Repeat password" required />
            </div>
          </div>

          <div className="auth-field sm:col-span-2">
            <label htmlFor="signup-role">Your Role</label>
            <div className="auth-input-wrap">
              <UserCog className="auth-input-icon" />
              <select id="signup-role" value={form.role} onChange={update('role')}>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-foreground-subtle cursor-pointer pt-1">
          <input type="checkbox" className="rounded border-border-strong text-emerald-brand w-3.5 h-3.5 shrink-0" required />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>

        <Button type="submit" size="lg" className="w-full" icon={ArrowRight} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground-subtle mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-emerald-brand font-semibold hover:text-emerald-dark transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
