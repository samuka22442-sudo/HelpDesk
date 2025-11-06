import { Request, Response } from 'express';
import { listPendingRegistrations, approveRegistration, rejectRegistration } from './service';
import { sendApprovalEmail, sendRejectionEmail } from '../../email/mailer';

export async function getPending(req: Request, res: Response) {
  const list = await listPendingRegistrations();
  res.json({ items: list });
}

export async function approve(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });
  const actor = (req as any).user?.sub ? Number((req as any).user.sub) : null;
  const user = await approveRegistration(id, actor);
  await sendApprovalEmail(user.email);
  res.json({ message: 'Cadastro aprovado', user: { id: user.id, email: user.email, name: user.name } });
}

export async function reject(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });
  const actor = (req as any).user?.sub ? Number((req as any).user.sub) : null;
  const rr = await rejectRegistration(id, actor);
  await sendRejectionEmail(rr.email);
  res.json({ message: 'Cadastro rejeitado' });
}