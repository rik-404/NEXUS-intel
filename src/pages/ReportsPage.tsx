import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, FileText, Download, Calendar, Filter } from 'lucide-react';
import { DataService } from '../lib/supabase';

export const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState('turno');
  const occurrences = DataService.getOccurrences();

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Gerando relatório em formato ${format.toUpperCase()} para o período: ${period.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Relatórios Automáticos de Turno & Período (Fase 2)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Consolidação automática de atendimentos, análise por atendente, horários de pico e exportação executiva.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center space-x-2"
          >
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={() => handleExport('excel')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">Período de Análise:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
          >
            <option value="turno">Turno Atual (07h às 15h)</option>
            <option value="hoje">Dia Completo (Hoje)</option>
            <option value="semana">Últimos 7 Dias</option>
            <option value="mes">Mês Atual</option>
          </select>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Total Consolidado: <strong className="text-indigo-300">{occurrences.length} ocorrências</strong>
        </div>
      </div>

      {/* Report Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Resumo Executivo do Turno</h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span>Volume Total Registrado:</span>
              <strong className="text-slate-100">{occurrences.length} atendimentos</strong>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span>Tempo Médio de Atendimento (TMA):</span>
              <strong className="text-emerald-400">4.2 minutos</strong>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-800">
              <span>Principal Categoria Afetada:</span>
              <strong className="text-indigo-400">Sistemas (45%)</strong>
            </li>
            <li className="flex justify-between py-2">
              <span>Taxa de Reincidência no Turno:</span>
              <strong className="text-amber-400">18.5% (+3% vs. turno anterior)</strong>
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Fechamento do Loop (KB vs. Ocorrências)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mede se a publicação de artigos reduziu a recorrência dos sintomas associados ao longo das semanas.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span>Artigo #art-1 (Desbloqueio 2FA):</span>
              <span className="text-emerald-400 font-bold">-32% de ocorrências</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[68%] h-full bg-emerald-500 rounded-full"></div>
            </div>

            <div className="flex justify-between pt-2">
              <span>Artigo #art-2 (Conciliação PIX):</span>
              <span className="text-emerald-400 font-bold">-15% de ocorrências</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
