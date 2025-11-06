import React from 'react';

// Comentário (PT-BR): Tabela mock de Chamados para a tela de Admin
export function ChamadosAdmin() {
  const rows = [
    { id: '00003', atualizadoEm: '13/04/25 20:56', titulo: 'Rede lenta', servico: 'Instalação de Rede', valor: 'R$ 180,00', cliente: 'André Costa', tecnico: 'Carlos Silva', status: 'Aberto' },
    { id: '00004', atualizadoEm: '12/04/25 15:20', titulo: 'Backup não está funcionando', servico: 'Recuperação de Dados', valor: 'R$ 200,00', cliente: 'André Costa', tecnico: 'Carlos Silva', status: 'Aberto' },
    { id: '00001', atualizadoEm: '12/04/25 09:01', titulo: 'Computador não liga', servico: 'Manutenção de Hardware', valor: 'R$ 150,00', cliente: 'Aline Souza', tecnico: 'Carlos Silva', status: 'Em atendimento' },
    { id: '00002', atualizadoEm: '10/04/25 10:15', titulo: 'Instalação de software de gestão', servico: 'Suporte de Software', valor: 'R$ 200,00', cliente: 'Julia Maria', tecnico: 'Ana Oliveira', status: 'Encerrado' },
    { id: '00005', atualizadoEm: '11/04/25 15:16', titulo: 'Meu fone não conecta no computador', servico: 'Suporte de Software', valor: 'R$ 80,00', cliente: 'Suzane Moura', tecnico: 'Ana Oliveira', status: 'Encerrado' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-indigo-600 mb-4">Chamados</h1>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Atualizado em</th>
              <th className="px-4 py-2 text-left">Id</th>
              <th className="px-4 py-2 text-left">Título e Serviço</th>
              <th className="px-4 py-2 text-left">Valor total</th>
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Técnico</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{r.atualizadoEm}</td>
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2">
                  <div className="font-medium text-gray-900">{r.titulo}</div>
                  <div className="text-xs text-gray-500">{r.servico}</div>
                </td>
                <td className="px-4 py-2">{r.valor}</td>
                <td className="px-4 py-2">{r.cliente}</td>
                <td className="px-4 py-2">{r.tecnico}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === 'Aberto' ? 'bg-pink-100 text-pink-700' : r.status === 'Em atendimento' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>{r.status}</span>
                </td>
                <td className="px-4 py-2">
                  <button className="p-2 rounded hover:bg-gray-100" aria-label="Editar">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.42l-2.34-2.34a1 1 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

