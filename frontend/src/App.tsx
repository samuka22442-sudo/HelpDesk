import { Loguin } from "./Loguin/Loguin";
import { useAuth } from "./lib/auth";
import { DesktopSidebar, MobileHeader } from "./components";
import { getNavItemsByRole } from "./components/mobile/MobileNavMenu";
import React, { useMemo, useState } from "react";
import { ChamadosAdmin } from "./Admin/Chamados";

export function App() {
  const { user, logout } = useAuth();
  const role = user?.role ?? 'USER';
  const navItems = useMemo(() => getNavItemsByRole(role), [role]);
  const [view, setView] = useState<string>('chamados');
  const initials = 'UA';
  const userName = 'Usuário Adm';
  const userEmail = 'user.adm@test.com';

  // Garantir que a view atual exista nos itens disponíveis para o papel atual
  React.useEffect(() => {
    if (!navItems.find((i) => i.key === view)) {
      setView(navItems[0]?.key || 'chamados');
    }
  }, [navItems]);

  if (!user) {
    return <Loguin />;
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        <DesktopSidebar
          items={navItems}
          activeKey={view}
          role={user.role}
          initials={initials}
          userName={userName}
          userEmail={userEmail}
          onSelect={(key) => setView(key)}
        />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1">
        {/* Header mobile no topo quando menor que md */}
        <div className="p-3 md:hidden">
          <MobileHeader
            role={user.role}
            initials={initials}
            onNavigate={(key) => setView(key)}
            onLogout={logout}
          />
        </div>

        <main className="p-4">
          {view === 'chamados' && <ChamadosAdmin />}
          {view === 'tecnicos' && <p>Técnicos (em breve)</p>}
          {view === 'clientes' && <p>Clientes (em breve)</p>}
          {view === 'servicos' && <p>Serviços (em breve)</p>}
        </main>
      </div>
    </div>
  );
}
