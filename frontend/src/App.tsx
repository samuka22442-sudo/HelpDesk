import { Loguin } from "./Loguin/Loguin";
import { useAuth } from "./lib/auth";

export function App() {
  const { user, logout } = useAuth();
  if (!user) {
    return <Loguin />;
  }
  return (
    <div className="min-h-screen bg-gray-600 text-gray-200">
      <header className="flex items-center justify-between p-4 border-b border-gray-500">
        <h1 className="text-lg">HelpDesk</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Logado como: {user.role}</span>
          <button className="px-3 py-1 rounded bg-brand-blue-base hover:bg-brand-blue-dark text-gray-600" onClick={logout}>Sair</button>
        </div>
      </header>
      <main className="p-4">
        <p>Bem-vindo! Esta é uma área protegida. Integraremos as rotas e telas do sistema aqui.</p>
      </main>
    </div>
  );
}


