import React from 'react';
import icPlus from '../assets/icon/plus.svg';
import icEdit from '../assets/icon/pen-line.svg';
import icView from '../assets/icon/eye.svg';
import icUser from '../assets/icon/circle-user.svg';

type Tecnico = {
  nome: string;
  email: string;
  disponibilidade: string[]; // horários
};

const TECNICOS: Tecnico[] = [
  { nome: 'Carlos Silva', email: 'carlos.silva@test.com', disponibilidade: ['08:00', '09:00', '17:00', '18:00'] },
  { nome: 'Ana Oliveira', email: 'ana.oliveira@test.com', disponibilidade: ['13:00', '14:00', '15:00', '16:00'] },
  { nome: 'Cintia Lucía', email: 'cintia.lucia@test.com', disponibilidade: ['08:00', '09:00', '13:00', '18:00'] },
  { nome: 'Marcos Alves', email: 'marcos.alves@test.com', disponibilidade: ['07:00', '09:00', '11:00', '15:00'] },
];

// Badge de horário
function HoraBadge({ hora }: { hora: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md border border-gray-300 bg-gray-50 text-gray-700 text-xs mr-1 mb-1">
      {hora}
    </span>
  );
}

// Avatar pequeno com ícone
function RowAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
      <img src={icUser} alt="Usuário" className="w-4 h-4"/>
    </div>
  );
}

export function TecnicosAdmin() {
  return (
    <div className="p-6">
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold text-indigo-600">Técnicos</h1>
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm shadow hover:bg-indigo-500">
          <img src={icPlus} alt="Novo" className="w-4 h-4"/>
          <span>+ Novo</span>
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">E-mail</th>
              <th className="px-4 py-2 text-left">Disponibilidade</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {TECNICOS.map((t) => (
              <tr key={t.email} className="border-t border-gray-200">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <RowAvatar />
                    <span className="text-gray-900 font-medium">{t.nome}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${t.email}`} className="text-indigo-600 hover:underline">{t.email}</a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap">
                    {t.disponibilidade.map((h) => (
                      <HoraBadge hora={h} key={`${t.email}-${h}`} />
                    ))}
                  </div>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded hover:bg-gray-100" aria-label="Ver">
                      <img src={icView} alt="Ver" className="w-4 h-4"/>
                    </button>
                    <button className="p-2 rounded hover:bg-gray-100" aria-label="Editar">
                      <img src={icEdit} alt="Editar" className="w-4 h-4"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

