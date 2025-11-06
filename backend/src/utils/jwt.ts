import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { loadEnv } from './env';

const env = loadEnv();
const secret: Secret = env.JWT_SECRET as Secret;

export type JwtPayload = { sub: string; role: 'ADMIN' | 'USER' };

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload as any, secret, { expiresIn: env.JWT_EXPIRES_IN as any });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload as any, secret, { expiresIn: env.REFRESH_EXPIRES_IN as any });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, secret) as unknown as T;
}