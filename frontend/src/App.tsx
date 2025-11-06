import { Loguin } from "./Loguin/Loguin";
import { useAuth } from "./lib/auth";
import { MobileHeader } from "./components";

export function App() {
  const { user, logout } = useAuth();
  if (!user) {
    return <Loguin />;
  }
  return (
    <div className="min-h-screen bg-gray-600 text-gray-200">
      {/* Header mobile conforme o layout (Default / Menu / User) */}
      <div className="p-4">
        <MobileHeader
          role={user.role}
          initials={"UA"}
          onNavigate={(key) => {
            // Comentário (PT-BR): navegação futura — aqui integraremos o router.
            console.log("Navegar para:", key);
          }}
          onLogout={logout}
        />
      </div>
      <main className="p-4">
        <p>Bem-vindo! Esta é uma área protegida. Integraremos as rotas e telas do sistema aqui.</p>
      </main>
    </div>
  );
}


