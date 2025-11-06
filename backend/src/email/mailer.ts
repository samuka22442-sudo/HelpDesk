import nodemailer from 'nodemailer';
import { loadEnv } from '../utils/env';

const env = loadEnv();

function getTransport() {
  if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: false,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  // Fallback: output emails to console
  return {
    sendMail: async (opts: any) => {
      console.log('[MAIL:FALLBACK]', opts);
      return { messageId: 'dev-fallback' } as any;
    },
  } as nodemailer.Transporter;
}

const transporter = getTransport();

export async function sendRegistrationRequestEmail(email: string, token: string) {
  const verifyUrl = `http://localhost:4000/api/register/verify-step1?token=${token}`;
  return transporter.sendMail({
    from: env.SMTP_FROM || 'no-reply@helpdesk.local',
    to: email,
    subject: 'HelpDesk - Verificação de cadastro (etapa 1)',
    text: `Olá! Use este link para verificar seu email: ${verifyUrl}`,
  });
}

export async function sendApprovalEmail(email: string) {
  return transporter.sendMail({
    from: env.SMTP_FROM || 'no-reply@helpdesk.local',
    to: email,
    subject: 'HelpDesk - Cadastro aprovado',
    text: `Seu cadastro foi aprovado. Você já pode fazer login.`,
  });
}

export async function sendRejectionEmail(email: string) {
  return transporter.sendMail({
    from: env.SMTP_FROM || 'no-reply@helpdesk.local',
    to: email,
    subject: 'HelpDesk - Cadastro rejeitado',
    text: `Seu cadastro foi rejeitado. Em caso de dúvidas, contate o administrador.`,
  });
}