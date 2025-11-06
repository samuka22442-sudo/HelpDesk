// Simple API client for HelpDesk frontend
// Uses cookie-based refresh tokens (credentials: 'include') and JSON content

const DEFAULT_API_BASE = 'http://localhost:4000/api';
export const API_BASE = (import.meta as any).env?.VITE_API_BASE || DEFAULT_API_BASE;

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string; // also set in httpOnly cookie
  user: { id: number; name: string; email: string; role: 'ADMIN' | 'USER' };
};

async function request(path: string, init: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    ...init,
  });
  return res;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Login falhou (${res.status})`);
  }
  return (await res.json()) as LoginResponse;
}

export async function apiLogout(): Promise<void> {
  const res = await request('/auth/logout', { method: 'POST' });
  if (!res.ok && res.status !== 204) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Logout falhou (${res.status})`);
  }
}

export async function apiRefresh(): Promise<{ accessToken: string; refreshToken?: string } | null> {
  const res = await request('/token/refresh', { method: 'POST' });
  if (!res.ok) return null; // refresh falhou; sessão expirada
  return (await res.json()) as { accessToken: string; refreshToken?: string };
}

export async function apiAuthStatus(accessToken?: string): Promise<{ loggedIn: boolean; user?: { id: number; role: 'ADMIN' | 'USER' } }>
{
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await request('/auth/status', { method: 'GET', headers });
  return await res.json();
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}