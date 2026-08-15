import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  UserCheck, 
  Clock, 
  Download,
  CheckCircle2,
  TrendingUp,
  LayoutList,
  AreaChart as AreaChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { DataService } from '../lib/supabase';
import { Occurrence } from '../lib/types';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('hoje');
  const [selectedAttendant, setSelectedAttendant] = useState('ALL');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [viewMode, setViewMode] = useState<'both' | 'chart' | 'table'>('both');

  const occurrences: Occurrence[] = DataService.getOccurrences();
  const profiles = DataService.getAllProfiles();

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Gerando Relatório de Atendimento Por Período X Atendente Por Hora em formato ${format.toUpperCase()}...`);
  };

  // Filter occurrences based on period and attendant
  const filteredOccurrences = occurrences.filter(occ => {
    const matchesAttendant = selectedAttendant === 'ALL' || occ.attendantName === selectedAttendant;
    return matchesAttendant;
  });

  // Calculate total volume (sum of recurrenceCount / quantidade)
  const totalVolume = filteredOccurrences.reduce((acc, curr) => acc + (curr.recurrenceCount || 1), 0);

  // Group by Hourly buckets (00h to 23h)
  const hourlyReport = Array.from({ length: 24 }, (_, i) => {
    const hourLabel = `${String(i).padStart(2, '0')}h`;
    
    // Find matching occurrences created in this hour block
    const matching = filteredOccurrences.filter(occ => {
      const occHour = new Date(occ.createdAt).getHours();
      return occHour === i;
    });

    const hourVolume = matching.reduce((sum, item) => sum + (item.recurrenceCount || 1), 0);

    return {
      hour: hourLabel,
      fullHourLabel: `${String(i).padStart(2, '0')}:00 - ${String(i + 1).padStart(2, '0')}:00`,
      volume: hourVolume,
      occurrencesCount: matching.length,
      categories: Array.from(new Set(matching.map(m => m.categoryName))).join(', ') || 'Nenhum'
    };
  });

  // Custom Glass Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-indigo-500/30 bg-slate-950/90 text-xs shadow-2xl space-y-1">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Faixa Horária: {data.fullHourLabel}</span>
          </p>
          <p className="text-emerald-400 font-semibold">
            Volume de Atendimentos: <strong className="text-white text-sm">{data.volume}</strong>
          </p>
          <p className="text-[11px] text-slate-400">
            Categorias: <span className="text-indigo-300">{data.categories}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Relatório de Atendimento por Período X Atendente por Hora
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gráfico de fluxo contínuo de contatos e análise por faixa horária (00h às 23h).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-2 shadow-sm"
          >
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={() => handleExport('excel')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-2 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Período:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="hoje">Dia Atual (Hoje)</option>
              <option value="turno">Turno Ativo</option>
              <option value="semana">Últimos 7 Dias</option>
              <option value="mes">Mês Atual</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Atendente:</span>
            <select
              value={selectedAttendant}
              onChange={(e) => setSelectedAttendant(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Todos os Atendentes (Geral)</option>
              {profiles.map(p => (
                <option key={p.id} value={p.fullName}>{p.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Mode Toggles */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${viewMode === 'both' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Ambos
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${viewMode === 'chart' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Apenas Gráfico
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Apenas Tabela
            </button>
          </div>

          <div className="text-slate-300 text-xs font-mono bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl hidden sm:block">
            Volume Total: <strong className="text-indigo-400 text-sm ml-1">{totalVolume}</strong>
          </div>
        </div>
      </div>

      {/* 📊 AREA CHART SECTION */}
      {(viewMode === 'both' || viewMode === 'chart') && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4 bg-slate-900/90 backdrop-blur-xl relative overflow-hidden">
          {/* Chart Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Gráfico de Volume Atendido por Hora (00h às 23h)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Visualização contínua do fluxo de chamados por faixa horária
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded font-medium ${chartType === 'area' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Área Oculta
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded font-medium ${chartType === 'bar' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Barras
              </button>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={hourlyReport} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#6366f1" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={hourlyReport} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="volume" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 📋 TABLE SECTION */}
      {(viewMode === 'both' || viewMode === 'table') && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Tabela Detalhada de Atendimentos por Hora
            </h3>
            <span className="text-[11px] text-slate-400">Atendente: <strong>{selectedAttendant === 'ALL' ? 'Geral' : selectedAttendant}</strong></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Faixa Horária</th>
                  <th className="p-4">Categorias Atendidas</th>
                  <th className="p-4 text-center">Registros</th>
                  <th className="p-4 text-right">Quantidade Total (Volume)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
                {hourlyReport.map((row, idx) => (
                  <tr key={idx} className={row.volume > 0 ? 'bg-indigo-500/5 font-semibold text-white' : 'hover:bg-slate-800/30 text-slate-500'}>
                    <td className="p-4 flex items-center space-x-2">
                      <Clock className={`w-3.5 h-3.5 ${row.volume > 0 ? 'text-indigo-400' : 'text-slate-600'}`} />
                      <span>{row.fullHourLabel}</span>
                    </td>

                    <td className="p-4 text-slate-300 truncate max-w-xs">
                      {row.categories}
                    </td>

                    <td className="p-4 text-center">
                      {row.occurrencesCount > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">
                          {row.occurrencesCount}
                        </span>
                      ) : '-'}
                    </td>

                    <td className="p-4 text-right font-mono text-sm">
                      {row.volume > 0 ? (
                        <span className="text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          {row.volume}
                        </span>
                      ) : (
                        '0'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
