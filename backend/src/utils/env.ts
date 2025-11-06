                                       import dotenv from 'dotenv';

export type Env = {
  PORT?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string; // e.g. '15m'
  REFRESH_EXPIRES_IN: string; // e.g. '7d'
  CORS_ORIGIN?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
};

export function loadEnv(): Env {
  dotenv.config({ path: process.cwd() + '/backend/.env' });
  const env = process.env as unknown as Env;
  // Defaults for development
  env.JWT_SECRET = env.JWT_SECRET || 'dev-secret-change-me';
  env.JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '15m';
  env.REFRESH_EXPIRES_IN = env.REFRESH_EXPIRES_IN || '7d';
  return env;
}