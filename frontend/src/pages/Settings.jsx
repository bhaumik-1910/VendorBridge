import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/authErrors';

export default function Settings() {
  const navigate = useNavigate();
  const { user, refetchUser, logout } = useAuth();
  const { success, error: toastError } = useToast();
  const [profile, setProfile] = useState({ name: user?.name || '', company: user?.company || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const profileMutation = useMutation({
    mutationFn: () => authApi.updateProfile({ name: profile.name, company: profile.company }),
    onSuccess: () => { refetchUser(); success('Profile updated'); },
    onError: (err) => toastError(getApiErrorMessage(err)),
  });

  const passwordMutation = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    onSuccess: () => {
      success('Password changed');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => toastError(getApiErrorMessage(err)),
  });

  const handlePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toastError('New passwords do not match');
      return;
    }
    passwordMutation.mutate();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">Profile</h3>
        <form onSubmit={(e) => { e.preventDefault(); profileMutation.mutate(); }} className="space-y-4">
          <Input label="Full name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <Input label="Company" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
          <Input label="Email" value={profile.email} disabled />
          <Button type="submit" disabled={profileMutation.isPending}>{profileMutation.isPending ? 'Saving...' : 'Save profile'}</Button>
        </form>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">Change password</h3>
        <form onSubmit={handlePassword} className="space-y-4">
          <Input label="Current password" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
          <Input label="New password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} minLength={8} required />
          <Input label="Confirm new password" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
          <Button type="submit" disabled={passwordMutation.isPending}>{passwordMutation.isPending ? 'Updating...' : 'Update password'}</Button>
        </form>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-foreground mb-2">Session</h3>
        <p className="text-sm text-foreground-subtle mb-4">Sign out of VendorBridge on this device.</p>
        <Button variant="danger" onClick={async () => { await logout(); navigate('/login'); }}>Sign out</Button>
      </Card>
    </div>
  );
}
