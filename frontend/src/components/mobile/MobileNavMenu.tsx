import React from 'react';

// Itens do menu principal (Chamados, Técnicos, Serviços)
export type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
};

// Ícones inline simples (placeholder)
function IconTicket() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 00-2 2 2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2 2 2 0 00-2-2V7z"></path></svg>
  );
}
function IconUsers() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zm-8 0c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.21 0-4 1.79-4 4v1h10v-1c0-2.21-1.79-4-4-4zm8 0c-.686 0-1.334.141-1.92.395A5.995 5.995 0 0118 17v1h6v-1c0-2.21-1.79-4-4-4z"></path></svg>
  );
}
function IconServices() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"></path></svg>
  );
}
function IconClients() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6a3 3 0 110 6 3 3 0 010-6zm6 3a2 2 0 110 4 2 2 0 010-4zM6 9a2 2 0 110 4 2 2 0 010-4zm0 7c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm6 0c-1.48 0-2.8.81-3.5 2.02A4.98 4.98 0 0114 20v1h8v-1c0-2.21-1.79-4-4-4h-4zm-6-7c1.657 0 3-1.343 3-3S7.657 3 6 3 3 4.343 3 6s1.343 3 3 3z"></path></svg>
  );
}

export function MobileNavMenu({
  open,
  items,
  onSelect,
}: {
  open: boolean;
  items: NavItem[];
  onSelect: (key: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="mt-2 w-full max-w-sm rounded-2xl border border-gray-500 bg-gray-800 text-gray-200 shadow-lg">
      <div className="px-4 pt-3 pb-2 text-[10px] font-semibold text-gray-400">MENU</div>
      <ul className="px-2 pb-3 space-y-1">
        {items.map((it) => (
          <li key={it.key}>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => onSelect(it.key)}
            >
              <span className="text-gray-300">{it.icon}</span>
              <span className="text-sm text-gray-200">{it.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Lista padrão conforme o layout
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { key: 'chamados', label: 'Chamados', icon: <IconTicket /> },
  { key: 'tecnicos', label: 'Técnicos', icon: <IconUsers /> },
  { key: 'clientes', label: 'Clientes', icon: <IconClients /> },
  { key: 'servicos', label: 'Serviços', icon: <IconServices /> },
];

// Comentário (PT-BR): Filtra itens conforme o papel do usuário
export function getNavItemsByRole(role: 'ADMIN' | 'USER'): NavItem[] {
  if (role === 'ADMIN') return DEFAULT_NAV_ITEMS;
  // Usuário comum: exibe Chamados e Serviços
  return DEFAULT_NAV_ITEMS.filter((i) => i.key === 'chamados' || i.key === 'servicos');
}
