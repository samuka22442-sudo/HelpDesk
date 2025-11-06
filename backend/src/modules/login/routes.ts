import { Router } from 'express';
import { login, register, verifyStep1 } from './controller';

export const loginRouter = Router();

loginRouter.post('/login', login);
loginRouter.post('/register', register);
loginRouter.get('/register/verify-step1', verifyStep1);