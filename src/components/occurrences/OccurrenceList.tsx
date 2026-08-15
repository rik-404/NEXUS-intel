import React, { useState } from 'react';
import { Occurrence } from '../../lib/types';
import { DataService } from '../../lib/supabase';
import { OccurrenceDetailModal } from './OccurrenceDetailModal';
import { 
  Search, 
  Filter, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  BookOpen, 
  Eye,
  Headphones
} from 'lucide-react';

interface OccurrenceListProps {
  occurrences: Occurrence[];
}

export const OccurrenceList: React.FC<OccurrenceListProps> = ({ occurrences }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [activeModalOcc, setActiveModalOcc] = useState<Occurrence | null>(null);

  const categories = DataService.getCategories();

  const filteredOccurrences = occurrences.filter((occ) => {
    const matchesSearch = 
      occ.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.freeDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.attendantName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || occ.categoryId === selectedCategory;
    const matchesSystem = selectedSystem === 'ALL' || occ.systemName === selectedSystem;

    return matchesSearch && matchesCategory && matchesSystem;
  });

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* List Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-indigo-400" />
            Histórico de Ocorrências Registradas
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Exibindo {filteredOccurrences.length} de {occurrences.length} atendimentos
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por protocolo, assunto, texto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 lg:w-64"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* System Filter */}
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos os Sistemas</option>
            <option value="Portal Web">Portal Web</option>
            <option value="App Mobile">App Mobile</option>
            <option value="ERP Nexo">ERP Nexo</option>
            <option value="Gateway Pgto">Gateway Pgto</option>
          </select>
        </div>
      </div>

      {/* Table / Cards List */}
      {filteredOccurrences.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
          <p className="text-sm font-medium text-slate-400">Nenhuma ocorrência encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Protocolo</th>
                <th className="py-3 px-4">Categoria / Assunto</th>
                <th className="py-3 px-4">Sistema</th>
                <th className="py-3 px-4">Reincidência</th>
                <th className="py-3 px-4">Cliente (LGPD)</th>
                <th className="py-3 px-4">Atendente</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOccurrences.map((occ) => (
                <tr 
                  key={occ.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => setActiveModalOcc(occ)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                    {occ.protocolNumber}
                    <span className="block text-[10px] text-slate-500 font-normal">
                      {new Date(occ.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 mb-1">
                      {occ.categoryName}
                    </span>
                    <p className="font-semibold text-slate-200">{occ.subjectName}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">
                    {occ.systemName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      occ.recurrenceCount > 3 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      <RotateCcw className="w-3 h-3" />
                      {occ.recurrenceCount}x
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {occ.clientIdentifierMasked}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {occ.attendantName}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalOcc(occ);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-400 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Details */}
      <OccurrenceDetailModal 
        occurrence={activeModalOcc}
        onClose={() => setActiveModalOcc(null)}
      />
    </div>
  );
};
