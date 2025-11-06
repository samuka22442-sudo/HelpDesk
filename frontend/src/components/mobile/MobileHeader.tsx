import React, { useState } from 'react';
import { AvatarBadge } from './AvatarBadge';
import { DEFAULT_NAV_ITEMS, MobileNavMenu } from './MobileNavMenu';
import { MobileUserMenu } from './MobileUserMenu';

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
            // Ícone de fechar (X)
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L12 13.41l-4.89 4.3-1.41-1.42L10.59 12 4.7 6.12 6.11 4.7 12 10.59l4.89-4.88z"></path></svg>
          ) : (
            // Ícone hambúrguer
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"></path></svg>
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
        <MobileNavMenu open={navOpen} items={DEFAULT_NAV_ITEMS} onSelect={handleSelect} />
        <MobileUserMenu open={userOpen} onProfile={() => { setUserOpen(false); onNavigate?.('perfil'); }} onLogout={handleLogout} />
      </div>
    </div>
  );
}