import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { json } from 'express';
import { errorHandler } from './utils/error-handler';
import { loadEnv } from './utils/env';
import { loginRouter } from './modules/login/routes';
import { adminRouter } from './modules/admin/routes';

export function createServer() {
  const env = loadEnv();
  const app = express();

  // Security
  app.use(helmet());
  // CORS: quando credentials=true, não podemos usar '*'.
  // Se CORS_ORIGIN não estiver definido, default para http://localhost:5173
  const allowedOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map(s => s.trim()) : ['http://localhost:5173'];
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(json());
  app.use(cookieParser());

  // Rate limit for auth endpoints
  const authLimiter = rateLimit({ windowMs: 60_000, max: 10 });
  app.use('/api/login', authLimiter);
  app.use('/api/register', authLimiter);

  // Health
  app.get('/health', (req, res) => res.json({ ok: true }));

  // Routes
  app.use('/api', loginRouter);
  app.use('/api/admin', adminRouter);

  // Error handling
  app.use(errorHandler);

  return app;
}