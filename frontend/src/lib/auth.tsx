import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiAuthStatus, apiLogin, apiLogout, apiRefresh } from './api';

type User = { id: number; name?: string; email?: string; role: 'ADMIN' | 'USER' } | null;

type AuthContextValue = {
  user: User;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'helpdesk.accessToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => sessionStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from token (if any)
  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      try {
        const status = await apiAuthStatus(accessToken || undefined);
        if (!cancelled) {
          if (status.loggedIn) {
            setUser({ id: status.user!.id, role: status.user!.role });
          } else {
            setUser(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const { accessToken: token, user } = await apiLogin(email.trim(), password);
    setAccessToken(token);
    sessionStorage.setItem(STORAGE_KEY, token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await apiLogout();
    setAccessToken(null);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const fetchWithAuth = useCallback(async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> | undefined),
    };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    let res = await fetch(input, { ...init, headers, credentials: 'include' });
    if (res.status === 401) {
      const refreshed = await apiRefresh();
      if (refreshed?.accessToken) {
        setAccessToken(refreshed.accessToken);
        sessionStorage.setItem(STORAGE_KEY, refreshed.accessToken);
        const retryHeaders = { ...headers, Authorization: `Bearer ${refreshed.accessToken}` };
        res = await fetch(input, { ...init, headers: retryHeaders, credentials: 'include' });
      } else {
        // session expired
        await logout();
      }
    }
    return res;
  }, [accessToken, logout]);

  const value = useMemo(() => ({ user, accessToken, loading, error, login, logout, fetchWithAuth }), [user, accessToken, loading, error, login, logout, fetchWithAuth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}