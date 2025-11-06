import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listPendingRegistrations() {
  return prisma.registrationRequest.findMany({ where: { status: 'PENDING' } });
}

export async function approveRegistration(id: number, actorId: number | null) {
  const req = await prisma.registrationRequest.findUnique({ where: { id } });
  if (!req) throw Object.assign(new Error('Solicitação não encontrada'), { status: 404 });
  if (req.status !== 'PENDING' || !req.verifiedStep1) {
    throw Object.assign(new Error('Solicitação não elegível para aprovação'), { status: 400 });
  }
  const user = await prisma.user.create({ data: { email: req.email, name: req.name, passwordHash: req.passwordHash, role: 'USER' } });
  await prisma.registrationRequest.update({ where: { id }, data: { status: 'APPROVED', approvedById: actorId || undefined, approvedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: 'APPROVE_REGISTRATION', actorId: actorId || undefined, actorRole: 'ADMIN', targetEmail: req.email } });
  return user;
}

export async function rejectRegistration(id: number, actorId: number | null) {
  const req = await prisma.registrationRequest.findUnique({ where: { id } });
  if (!req) throw Object.assign(new Error('Solicitação não encontrada'), { status: 404 });
  if (req.status !== 'PENDING') {
    throw Object.assign(new Error('Solicitação não elegível para rejeição'), { status: 400 });
  }
  await prisma.registrationRequest.update({ where: { id }, data: { status: 'REJECTED', rejectedById: actorId || undefined, rejectedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: 'REJECT_REGISTRATION', actorId: actorId || undefined, actorRole: 'ADMIN', targetEmail: req.email } });
  return req;
}