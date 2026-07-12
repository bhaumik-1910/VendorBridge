import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { authApi } from '../../api/auth';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/authErrors';

export default function ForgotPassword() {
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      success('If that email exists, a reset link was sent.');
    } catch (err) {
      toastError(getApiErrorMessage(err, 'Failed to send reset email'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Reset password</h2>
        <p className="text-sm text-foreground-subtle mt-1">
          {sent ? 'Check your inbox for reset instructions' : 'Enter your email to receive a reset link'}
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className="auth-input-wrap">
              <Mail className="auth-input-icon" />
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-center text-foreground-subtle">Didn&apos;t receive it? Check spam or try again in a few minutes.</p>
      )}

      <p className="text-center text-sm text-foreground-subtle mt-5">
        <Link to="/login" className="inline-flex items-center gap-1 text-emerald-brand font-semibold hover:text-emerald-dark">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </p>
    </div>
  );
}
