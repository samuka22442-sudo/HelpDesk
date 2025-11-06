import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { hashPassword, verifyPassword } from '../../utils/password';
import crypto from 'crypto';

// Garanta que variáveis de ambiente (incluindo DATABASE_URL) estejam carregadas
dotenv.config({ path: process.cwd() + '/backend/.env' });
const prisma = new PrismaClient();

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function createRegistrationRequest(name: string, email: string, password: string) {
  const existsUser = await prisma.user.findUnique({ where: { email } });
  if (existsUser) throw Object.assign(new Error('Email já cadastrado'), { status: 409 });
  const existsReq = await prisma.registrationRequest.findUnique({ where: { email } });
  if (existsReq) throw Object.assign(new Error('Já existe uma solicitação para este email'), { status: 409 });
  const passwordHash = await hashPassword(password);
  const verificationToken = crypto.randomBytes(24).toString('hex');
  const req = await prisma.registrationRequest.create({
    data: { name, email, passwordHash, verificationToken },
  });
  return req;
}

export async function verifyRegistrationStep1(token: string) {
  const req = await prisma.registrationRequest.findFirst({ where: { verificationToken: token } });
  if (!req) throw Object.assign(new Error('Token inválido'), { status: 400 });
  if (req.verifiedStep1) return req;
  return prisma.registrationRequest.update({ where: { id: req.id }, data: { verifiedStep1: true } });
}

export async function createSession(userId: number, refreshToken: string, expiresAt: Date) {
  return prisma.session.create({ data: { userId, refreshToken, expiresAt } });
}

export async function findSessionByRefresh(refreshToken: string) {
  return prisma.session.findUnique({ where: { refreshToken } });
}

export async function deleteSession(id: number) {
  return prisma.session.delete({ where: { id } });
}

export async function updateSessionToken(id: number, refreshToken: string, expiresAt: Date) {
  return prisma.session.update({ where: { id }, data: { refreshToken, expiresAt } });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}