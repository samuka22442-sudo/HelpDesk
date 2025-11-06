import React from 'react';
import type { NavItem } from '../mobile/MobileNavMenu';

// Barra lateral (desktop) com navegação e informações do usuário
// Comentários PT-BR: Este componente renderiza o menu permanente à esquerda,
// destacando o item ativo e exibindo o bloco do usuário na base.
export function DesktopSidebar({
  items,
  activeKey,
  role = 'ADMIN',
  userName = 'Usuário',
  userEmail = 'user@test.com',
  initials = 'UA',
  onSelect,
}: {
  items: NavItem[];
  activeKey: string;
  role?: 'ADMIN' | 'USER';
  userName?: string;
  userEmail?: string;
  initials?: string;
  onSelect: (key: string) => void;
}) {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col border-r border-gray-800">
      {/* Cabeçalho da barra */}
      <div className="px-4 py-4 flex items-center gap-2 border-b border-gray-800">
        <div className="w-7 h-7 rounded-full bg-indigo-600" />
        <div className="leading-tight">
          <div className="text-base font-semibold">HelpDesk</div>
          <div className="text-[11px] text-gray-400">{role}</div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-3 pt-3 text-[10px] font-semibold text-gray-400">MENU</div>
      <nav className="px-2 py-2 flex-1">
        <ul className="space-y-1">
          {items.map((it) => {
            const active = it.key === activeKey;
            return (
              <li key={it.key}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                    active
                      ? 'bg-indigo-600 text-white focus:ring-indigo-400'
                      : 'hover:bg-gray-800 text-gray-200 focus:ring-indigo-500'
                  }`}
                  onClick={() => onSelect(it.key)}
                >
                  <span className={active ? 'text-white' : 'text-gray-300'}>{it.icon}</span>
                  <span className="text-sm">{it.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bloco do usuário */}
      <div className="mt-auto border-t border-gray-800">
        <div className="px-3 pt-3 text-[10px] font-semibold text-gray-400">USUÁRIO</div>
        <div className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">{initials}</div>
          <div className="leading-tight">
            <div className="text-sm">{userName}</div>
            <div className="text-[11px] text-gray-400">{userEmail}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
