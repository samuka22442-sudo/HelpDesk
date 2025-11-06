import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, createRegistrationRequest, verifyRegistrationStep1, createSession, findSessionByRefresh, updateSessionToken, deleteSession, getUserById } from './service';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { verifyToken, JwtPayload } from '../../utils/jwt';
import { sendRegistrationRequestEmail } from '../../email/mailer';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });
const verifySchema = z.object({ token: z.string().min(10) });

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Dados inválidos' });
  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  // Log de login (antes de qualquer outra operação de criação de tokens/sessão)
  try {
    const ts = formatTimestamp(new Date());
    const ip = getClientIp(req);
    const name = user?.name || 'desconhecido';
    console.log(`\x1b[32m[${ts}] Usuário ${name} fez login com sucesso (IP: ${ip})\x1b[0m`);
  } catch (e) {
    console.warn('Falha ao registrar log de login:', e);
  }
  const role = user.role === 'ADMIN' ? 'ADMIN' : 'USER';
  const payload = { sub: String(user.id), role } as const;
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const in7d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await createSession(user.id, refreshToken, in7d);
  // Set refresh token in httpOnly cookie for better security (frontend uses accessToken in Authorization header)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Dados inválidos' });
  const reqReg = await createRegistrationRequest(parsed.data.name, parsed.data.email, parsed.data.password);
  await sendRegistrationRequestEmail(reqReg.email, reqReg.verificationToken);
  res.status(201).json({ message: 'Solicitação de cadastro enviada. Verifique seu email (etapa 1).', requestId: reqReg.id });
}

export async function verifyStep1(req: Request, res: Response) {
  const parsed = verifySchema.safeParse({ token: req.query.token });
  if (!parsed.success) return res.status(400).json({ error: 'Token inválido' });
  const updated = await verifyRegistrationStep1(parsed.data.token);
  res.json({ message: 'Email verificado (etapa 1). Aguarde aprovação do administrador.', requestId: updated.id });
}

const refreshSchema = z.object({ refreshToken: z.string().min(10) });

export async function refreshToken(req: Request, res: Response) {
  const tokenFromCookie = (req as any).cookies?.refreshToken as string | undefined;
  const tokenFromBody = refreshSchema.safeParse(req.body).success ? (req.body as any).refreshToken : undefined;
  const givenRefresh = tokenFromCookie || tokenFromBody;
  if (!givenRefresh) return res.status(400).json({ error: 'Dados inválidos' });
  const session = await findSessionByRefresh(givenRefresh);
  if (!session) return res.status(401).json({ error: 'Refresh token inválido' });
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await deleteSession(session.id);
    return res.status(401).json({ error: 'Refresh token expirado' });
  }
  let payload: JwtPayload;
  try {
    payload = verifyToken<JwtPayload>(givenRefresh);
  } catch (e) {
    await deleteSession(session.id);
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
  // Extra segurança: garantir que o token pertence ao usuário da sessão
  if (String(session.userId) !== payload.sub) {
    await deleteSession(session.id);
    return res.status(401).json({ error: 'Token não corresponde ao usuário' });
  }
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);
  const in7d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await updateSessionToken(session.id, newRefreshToken, in7d);
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}

export async function logout(req: Request, res: Response) {
  const tokenFromCookie = (req as any).cookies?.refreshToken as string | undefined;
  const tokenFromBody = refreshSchema.safeParse(req.body).success ? (req.body as any).refreshToken : undefined;
  const givenRefresh = tokenFromCookie || tokenFromBody;
  if (!givenRefresh) return res.status(400).json({ error: 'Dados inválidos' });
  const session = await findSessionByRefresh(givenRefresh);
  if (!session) {
    // Log com tratamento quando não há dados de sessão/usuário
    try {
      const ts = formatTimestamp(new Date());
      const ip = getClientIp(req);
      console.log(`\x1b[31m[${ts}] Usuário desconhecido fez logout (sessão não encontrada) (IP: ${ip})\x1b[0m`);
    } catch (e) {
      console.warn('Falha ao registrar log de logout (sessão ausente):', e);
    }
    return res.status(204).send();
  }
  // Log de logout antes de apagar sessão e limpar cookie
  try {
    const ts = formatTimestamp(new Date());
    const ip = getClientIp(req);
    const user = await getUserById(session.userId);
    const name = user?.name || 'desconhecido';
    console.log(`\x1b[31m[${ts}] Usuário ${name} fez logout (IP: ${ip})\x1b[0m`);
  } catch (e) {
    console.warn('Falha ao registrar log de logout:', e);
  }
  await deleteSession(session.id);
  res.clearCookie('refreshToken');
  return res.status(204).send();
}

export async function authStatus(req: Request, res: Response) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.json({ loggedIn: false });
  try {
    const payload = verifyToken<JwtPayload>(token);
    return res.json({ loggedIn: true, user: { id: Number(payload.sub), role: payload.role } });
  } catch (e) {
    return res.json({ loggedIn: false });
  }
}

// Utilitários de log
function formatTimestamp(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
}

function getClientIp(req: Request) {
  const xfwd = req.headers['x-forwarded-for'];
  const forwarded = Array.isArray(xfwd) ? xfwd[0] : (xfwd || '');
  const ip = forwarded?.toString().split(',')[0].trim();
  return ip || (req.socket?.remoteAddress || req.ip || '');
}