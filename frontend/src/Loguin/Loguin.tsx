

import { useEffect, useState } from "react";
import bgImage from "../assets/Login_Background.png";
import logo from "../assets/NavHeader.png";
import Button from "../components/Button";
import { useAuth } from "../lib/auth";


export function Loguin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberSession, setRememberSession] = useState<boolean>(true); // manter conectado
  const [rememberEmail, setRememberEmail] = useState<boolean>(true); // salvar usuário

  // Prefill do e-mail salvo
  useEffect(() => {
    try {
      const remember = localStorage.getItem('helpdesk.rememberEmail') === 'true';
      const saved = remember ? localStorage.getItem('helpdesk.email') || '' : '';
      if (saved) setEmail(saved);
      setRememberEmail(remember);
      setRememberSession(localStorage.getItem('helpdesk.persist') === 'true');
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, { rememberSession, rememberEmail });
    } catch (err: any) {
      setError(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-2 bg-gray-600">
      {/* Coluna da esquerda: imagem de fundo (visível apenas em desktop) */}
      <div className="relative hidden md:block">
        <img
          src={bgImage}
          alt="Login Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Coluna da direita: área do card */}
      <div className="flex items-center flex-col justify-center p-6">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-36 h-auto mb-6" />
        
        {/* Placeholder do card para a próxima etapa */}
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-gray-500 min-h-[70vh] p-8">
          <h1 className="text-lg  font-medium  text-gray-200 ">
            Acesse o portal
          </h1>
          <p className="text-xs font-medium text-gray-300">
            Entre usando seu e-mail e senha cadastrados
          </p>

          <div className="mt-6 space-y-6">
            <label className="block text-xs font-medium text-gray-300">
              E-MAIL
              <input
                type="email"
                className="w-full bg-transparent border-b border-gray-500/60 focus:border-gray-400 text-gray-400 placeholder-gray-400 py-2 outline-none"
                placeholder="exemplo@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="block text-xs font-medium text-gray-300">
              SENHA
              <input
                type="password"
                className="w-full bg-transparent border-b border-gray-500/60 focus:border-gray-400 text-gray-400 placeholder-gray-400 py-2 outline-none"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {/* Opções: manter conectado e salvar usuário */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-[11px] text-gray-300">
                <input type="checkbox" className="accent-indigo-600" checked={rememberSession} onChange={(e) => setRememberSession(e.target.checked)} />
                Manter conectado
              </label>
              <label className="flex items-center gap-2 text-[11px] text-gray-300">
                <input type="checkbox" className="accent-indigo-600" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} />
                Salvar usuário
              </label>
            </div>
            
          </div>
          <div className="mt-6">
            <Button variant="primary" size="md" fullWidth type="submit" disabled={loading}>
              Entrar
            </Button>
          </div>

          {error ? (
            <div className="mt-4 text-sm text-feedback-danger">{error}</div>
          ) : null}

          <div className="mt-20 rounded-2xl border border-gray-500 p-6">
            <h2 className="text-sm font-semibold text-gray-200">Ainda não tem uma conta?</h2>
            <p className="text-xs text-gray-300">Cadastre agora mesmo</p>
            <div className="mt-4">
              <Button variant="secondary" size="md" fullWidth>
                Criar conta
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
