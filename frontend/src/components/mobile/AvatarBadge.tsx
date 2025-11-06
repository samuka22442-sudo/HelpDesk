import React from 'react';

// Componente simples de avatar com iniciais (ex.: "UA")
// Uso futuro: podemos trocar por imagem de perfil quando existir.
export function AvatarBadge({ initials = 'UA' }: { initials?: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center shadow">
      {initials}
    </div>
  );
}