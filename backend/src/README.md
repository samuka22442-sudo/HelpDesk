# HelpDesk Backend

API de autenticação e administração de cadastros, usando Node.js, Express, TypeScript e Prisma (SQLite).

## Executando

1. Instale dependências:
   - cd backend
   - npm install
2. Configure variáveis de ambiente em `backend/.env` (opcional para SMTP)
3. Gere o cliente Prisma e execute migrações:
   - npx prisma generate
   - npx prisma migrate dev --name init
4. Rodar em desenvolvimento:
   - npm run dev

Servidor: http://localhost:4000

## Endpoints

- GET /health — status

### Autenticação
- POST /api/login — { email, password } → { accessToken, refreshToken, user }
- POST /api/register — { name, email, password } → cria solicitação de cadastro e envia email com verificação etapa 1
- GET /api/register/verify-step1?token=<token> — marca verificação de email

### Administração (JWT + role ADMIN)
- GET /api/admin/registrations — lista solicitações PENDING
- POST /api/admin/registrations/:id/approve — aprova (cria usuário), envia email
- POST /api/admin/registrations/:id/reject — rejeita solicitação, envia email

## Segurança
- helmet, cors
- rate limiting nas rotas de autenticação
- senhas com bcrypt
- JWT access (expiração) + refresh (sessões persistidas)

## Banco de Dados (Prisma)
- User: usuários ativos com role USER|ADMIN
- RegistrationRequest: solicitações de cadastro com verificação de email e status
- Session: refresh tokens
- AuditLog: registro de ações administrativas

## Próximos passos
- Fluxo de refresh token (/api/token/refresh)
- Logout (invalidar sessão)
- Testes (unit e integração)
- Documentação detalhada (OpenAPI/Swagger)