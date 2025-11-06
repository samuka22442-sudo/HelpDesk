import React from 'react';

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
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
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
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H9a2 2 0 00-2 2v3h2V5h10v14H9v-3H7v3a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z"></path></svg>
            </span>
            <span className="text-sm text-red-400">Sair</span>
          </button>
        </li>
      </ul>
    </div>
  );
}