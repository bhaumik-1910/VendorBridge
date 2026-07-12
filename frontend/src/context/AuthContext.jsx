import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { queryKeys } from '../api/queryKeys';

export const ROLES = {
  admin: 'admin',
  vendor: 'vendor',
  manager: 'manager',
  procurement: 'procurement',
};

export const ROLE_LABELS = {
  [ROLES.admin]: 'Admin',
  [ROLES.vendor]: 'Vendor',
  [ROLES.manager]: 'Manager',
  [ROLES.procurement]: 'Procurement Officer',
};

const AuthContext = createContext(null);

function toDisplayUser(user) {
  if (!user) return { name: '', email: '', company: '', avatar: '?' };
  const initials = (user.name || user.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return {
    ...user,
    avatar: user.avatar || initials,
  };
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) setBootstrapped(true);
  }, []);

  const { data: me, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: queryKeys.auth,
    queryFn: () => authApi.me().then((d) => d.user || d),
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!localStorage.getItem('accessToken') || me || error) setBootstrapped(true);
  }, [me, error]);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    queryClient.setQueryData(queryKeys.auth, data.user);
    return data.user;
  }, [queryClient]);

  const signup = useCallback(async (body) => {
    const data = await authApi.signup(body);
    return data.user || data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* clear local session even if API fails */
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    queryClient.clear();
  }, [queryClient]);

  const user = me ? toDisplayUser(me) : null;
  const isAuthenticated = !!user && !!localStorage.getItem('accessToken');

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        ROLES,
        ROLE_LABELS,
        isAuthenticated,
        isLoading: !bootstrapped || (isLoading && !!localStorage.getItem('accessToken')),
        isFetching,
        login,
        signup,
        logout,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
