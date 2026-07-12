import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { authApi } from '../../api/auth';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/authErrors';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { success, error: toastError } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toastError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toastError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      success('Password reset successfully. Please sign in.');
      navigate('/login');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Reset failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center animate-fade-in">
        <p className="text-foreground-subtle">Invalid reset link.</p>
        <Link to="/forgot-password" className="text-emerald-brand text-sm mt-2 inline-block">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Set new password</h2>
        <p className="text-sm text-foreground-subtle mt-1">Choose a strong password for your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="auth-field">
          <label htmlFor="password">New password</label>
          <div className="auth-input-wrap">
            <Lock className="auth-input-icon" />
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>
        </div>
        <div className="auth-field">
          <label htmlFor="confirm">Confirm password</label>
          <div className="auth-input-wrap">
            <Lock className="auth-input-icon" />
            <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full" icon={ArrowRight} disabled={loading}>
          {loading ? 'Saving...' : 'Reset password'}
        </Button>
      </form>
    </div>
  );
}
