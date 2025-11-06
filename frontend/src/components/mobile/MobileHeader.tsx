import React, { useState } from 'react';
import { AvatarBadge } from './AvatarBadge';
import { getNavItemsByRole, MobileNavMenu } from './MobileNavMenu';
import { MobileUserMenu } from './MobileUserMenu';
import icMenu from '../../assets/icon/menu.svg';
import icClose from '../../assets/icon/x.svg';

// Barra superior mobile conforme layout
// Exibe botão de menu (hamburger/fechar), marca HelpDesk + role, e avatar à direita.
// Controla abertura dos dois menus: navegação (MENU) e usuário (OPÇÕES).
export function MobileHeader({ role = 'ADMIN', initials = 'UA', onNavigate, onLogout }: {
  role?: 'ADMIN' | 'USER';
  initials?: string;
  onNavigate?: (key: string) => void;
  onLogout?: () => void;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  function toggleNav() {
    setNavOpen((v) => !v);
    if (!navOpen) setUserOpen(false);
  }
  function toggleUser() {
    setUserOpen((v) => !v);
    if (!userOpen) setNavOpen(false);
  }

  function handleSelect(key: string) {
    onNavigate?.(key);
    setNavOpen(false);
  }

  function handleLogout() {
    onLogout?.();
    setUserOpen(false);
  }

  return (
    <div className="w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-gray-100 rounded-md shadow">
        {/* Botão hambúrguer / fechar */}
        <button
          aria-label={navOpen ? 'Fechar menu' : 'Abrir menu'}
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={toggleNav}
        >
          {navOpen ? (
            <img src={icClose} alt="Fechar" className="w-4 h-4" />
          ) : (
            <img src={icMenu} alt="Menu" className="w-4 h-4" />
          )}
        </button>

        {/* Marca HelpDesk + role */}
        <div className="flex items-center gap-2">
          {/* Logo placeholder (círculo) */}
          <div className="w-6 h-6 rounded-full bg-indigo-600" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">HelpDesk</div>
            <div className="text-[10px] text-gray-400">{role}</div>
          </div>
        </div>

        {/* Avatar (abre menu de usuário) */}
        <button
          aria-label={userOpen ? 'Fechar opções do usuário' : 'Abrir opções do usuário'}
          className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          onClick={toggleUser}
        >
          <AvatarBadge initials={initials} />
        </button>
      </div>

      {/* Menus abaixo da barra */}
      <div className="px-2">
        <MobileNavMenu open={navOpen} items={getNavItemsByRole(role)} onSelect={handleSelect} />
        <MobileUserMenu open={userOpen} onProfile={() => { setUserOpen(false); onNavigate?.('perfil'); }} onLogout={handleLogout} />
      </div>
    </div>
  );
}
