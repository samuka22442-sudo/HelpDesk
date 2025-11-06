// Simple API client for HelpDesk frontend
// Uses cookie-based refresh tokens (credentials: 'include') and JSON content

// Em desenvolvimento, use "/api" para aproveitar o proxy do Vite e evitar CORS
const DEFAULT_API_BASE = '/api';
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
  try {
    const res = await request('/auth/logout', { method: 'POST' });
    if (!res.ok && res.status !== 204) {
      const err = await safeJson(res);
      throw new Error(err?.error || `Logout falhou (${res.status})`);
    }
  } catch (e: any) {
    // Em desenvolvimento, navegacoes ou trocas de rota podem abortar requisições.
    // Para logout, tratamos erros de rede como sucesso do lado do cliente.
    if (e?.name === 'AbortError' || String(e)?.includes('ERR_ABORTED')) {
      return;
    }
    console.warn('Falha na requisição de logout, prosseguindo mesmo assim:', e);
  }
}

export async function apiRefresh(): Promise<{ accessToken: string; refreshToken?: string } | null> {
  const res = await request('/token/refresh', { method: 'POST' });
  if (!res.ok) return null; // refresh falhou; sessão expirada
  return (await res.json()) as { accessToken: string; refreshToken?: string };
}

export async function apiAuthStatus(accessToken?: string): Promise<{ loggedIn: boolean; user?: { id: number; role: 'ADMIN' | 'USER' } } | null>
{
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  try {
    const res = await request('/auth/status', { method: 'GET', headers });
    if (!res.ok) return null;
    const data = await safeJson(res);
    if (!data || typeof data.loggedIn !== 'boolean') return null;
    return data as { loggedIn: boolean; user?: { id: number; role: 'ADMIN' | 'USER' } };
  } catch {
    // Falha de rede/proxy/desligado: não decidir aqui; devolve null para o caller manter estado atual
    return null;
  }
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
