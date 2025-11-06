import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = verifyToken<JwtPayload>(token);
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as JwtPayload | undefined;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  next();
}