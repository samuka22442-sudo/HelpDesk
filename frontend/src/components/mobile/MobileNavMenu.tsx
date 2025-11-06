import React from 'react';
import icTicket from '../../assets/icon/clipboard-list.svg';
import icUsers from '../../assets/icon/users.svg';
import icClients from '../../assets/icon/briefcase-business.svg';
import icServices from '../../assets/icon/wrench.svg';

// Itens do menu principal (Chamados, Técnicos, Clientes, Serviços)
export type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
};

function ImgIcon({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="w-4 h-4" />;
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
  { key: 'chamados', label: 'Chamados', icon: <ImgIcon src={icTicket} alt="Chamados" /> },
  { key: 'tecnicos', label: 'Técnicos', icon: <ImgIcon src={icUsers} alt="Técnicos" /> },
  { key: 'clientes', label: 'Clientes', icon: <ImgIcon src={icClients} alt="Clientes" /> },
  { key: 'servicos', label: 'Serviços', icon: <ImgIcon src={icServices} alt="Serviços" /> },
];

// Comentário (PT-BR): Filtra itens conforme o papel do usuário
export function getNavItemsByRole(role: 'ADMIN' | 'USER'): NavItem[] {
  if (role === 'ADMIN') return DEFAULT_NAV_ITEMS;
  // Usuário comum: exibe Chamados e Serviços
  return DEFAULT_NAV_ITEMS.filter((i) => i.key === 'chamados' || i.key === 'servicos');
}
