import React from 'react';
import icProfile from '../../assets/icon/circle-user.svg';
import icLogout from '../../assets/icon/log-out.svg';

export function MobileUserMenu({ open, onProfile, onLogout }: { open: boolean; onProfile: () => void; onLogout: () => void }) {
  if (!open) return null;
  return (
    <div className="mt-2 w-full max-w-sm rounded-2xl border border-gray-500 bg-gray-800 text-gray-200 shadow-lg">
      <div className="px-4 pt-3 pb-2 text-[10px] font-semibold text-gray-400">OPÇÕES</div>
      <ul className="px-2 pb-3 space-y-1">
        <li>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={onProfile}
          >
            <span className="text-gray-300">
              <img src={icProfile} alt="Perfil" className="w-4 h-4" />
            </span>
            <span className="text-sm text-gray-200">Perfil</span>
          </button>
        </li>
        <li>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onLogout}
          >
            <span className="text-red-400">
              <img src={icLogout} alt="Sair" className="w-4 h-4" />
            </span>
            <span className="text-sm text-red-400">Sair</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
