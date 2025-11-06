import express from 'express';
import helmet from 'helmet';
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
  app.use(cors({ origin: env.CORS_ORIGIN || '*', credentials: true }));
  app.use(json());

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