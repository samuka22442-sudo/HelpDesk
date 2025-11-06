import { Router } from 'express';
import { login, register, verifyStep1, refreshToken, logout, authStatus } from './controller';

export const loginRouter = Router();

loginRouter.post('/login', login);
loginRouter.post('/register', register);
loginRouter.get('/register/verify-step1', verifyStep1);
loginRouter.post('/token/refresh', refreshToken);
loginRouter.post('/logout', logout);
// Aliases under /auth
loginRouter.post('/auth/login', login);
loginRouter.post('/auth/logout', logout);
loginRouter.get('/auth/status', authStatus);