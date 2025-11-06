import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiAuthStatus, apiLogin, apiLogout, apiRefresh } from './api';

type User = { id: number; name?: string; email?: string; role: 'ADMIN' | 'USER' } | null;

type AuthContextValue = {
  user: User;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, options?: { rememberSession?: boolean; rememberEmail?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_TOKEN_KEY = 'helpdesk.accessToken';
const STORAGE_USER_KEY = 'helpdesk.user';
const STORAGE_PERSIST_KEY = 'helpdesk.persist'; // boolean ('true'|'false') => se true, guarda token em localStorage
const STORAGE_EMAIL_KEY = 'helpdesk.email';
const STORAGE_REMEMBER_EMAIL_KEY = 'helpdesk.rememberEmail';

function getPersist(): boolean {
  return localStorage.getItem(STORAGE_PERSIST_KEY) === 'true';
}
function setPersist(v: boolean) {
  localStorage.setItem(STORAGE_PERSIST_KEY, v ? 'true' : 'false');
}
function readToken(): string | null {
  const persist = getPersist();
  return persist ? localStorage.getItem(STORAGE_TOKEN_KEY) : sessionStorage.getItem(STORAGE_TOKEN_KEY);
}
function writeToken(token: string | null) {
  const persist = getPersist();
  if (persist) {
    if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token);
    else localStorage.removeItem(STORAGE_TOKEN_KEY);
  } else {
    if (token) sessionStorage.setItem(STORAGE_TOKEN_KEY, token);
    else sessionStorage.removeItem(STORAGE_TOKEN_KEY);
  }
}
function readSavedUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
function writeSavedUser(user: User) {
  if (user) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_USER_KEY);
}
function readSavedEmail(): string {
  const remember = localStorage.getItem(STORAGE_REMEMBER_EMAIL_KEY) === 'true';
  return remember ? localStorage.getItem(STORAGE_EMAIL_KEY) || '' : '';
}
function writeSavedEmail(email: string | null, remember: boolean) {
  localStorage.setItem(STORAGE_REMEMBER_EMAIL_KEY, remember ? 'true' : 'false');
  if (remember && email) localStorage.setItem(STORAGE_EMAIL_KEY, email);
  else localStorage.removeItem(STORAGE_EMAIL_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => readToken());
  const [user, setUser] = useState<User>(() => readSavedUser());
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
          // Se a chamada falhar (null), não derruba a sessão. Mantém o estado atual.
          if (status) {
            if (status.loggedIn) {
              setUser({ id: status.user!.id, role: status.user!.role });
            } else {
              setUser(null);
              setAccessToken(null);
              writeToken(null);
              writeSavedUser(null);
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string, options?: { rememberSession?: boolean; rememberEmail?: boolean }) => {
    setError(null);
    const { accessToken: token, user } = await apiLogin(email.trim(), password);
    // Persistência da sessão
    setPersist(!!options?.rememberSession);
    setAccessToken(token);
    writeToken(token);
    setUser(user);
    writeSavedUser(user);
    // Salvar e-mail (lembrar usuário)
    writeSavedEmail(email.trim(), !!options?.rememberEmail);
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await apiLogout();
    setAccessToken(null);
    writeToken(null);
    setUser(null);
    writeSavedUser(null);
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
        writeToken(refreshed.accessToken);
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
