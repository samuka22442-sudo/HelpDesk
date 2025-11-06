import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth';
import { approve, getPending, reject } from './controller';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);
adminRouter.get('/registrations', getPending);
adminRouter.post('/registrations/:id/approve', approve);
adminRouter.post('/registrations/:id/reject', reject);