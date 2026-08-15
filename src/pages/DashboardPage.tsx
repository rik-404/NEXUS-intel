import React from 'react';
import { DataService } from '../lib/supabase';
import { MetricCard } from '../components/dashboard/MetricCard';
import { DailyVolumeChart } from '../components/dashboard/DailyVolumeChart';
import { TopSubjectsWidget } from '../components/dashboard/TopSubjectsWidget';
import { TopArticlesWidget } from '../components/dashboard/TopArticlesWidget';
import { KBArticle } from '../lib/types';
import { 
  Headphones, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  PlusCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToOccurrences: () => void;
  onNavigateToKB: () => void;
  onReadArticle: (article: KBArticle) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToOccurrences,
  onNavigateToKB,
  onReadArticle
}) => {
  const occurrences = DataService.getOccurrences();
  const articles = DataService.getArticles();

  // Metrics Calculation
  const totalToday = occurrences.length;
  const avgDuration = Math.round(
    occurrences.reduce((acc, curr) => acc + curr.durationSeconds, 0) / (totalToday || 1) / 60
  );
  const totalRecurrence = occurrences.reduce((acc, curr) => acc + curr.recurrenceCount, 0);
  const kbResolvedCount = occurrences.filter(o => o.resolvedByKbArticleId).length;

  // Chart Data Preparation (Hourly)
  const hourlyData = [
    { time: '07h', count: 2 },
    { time: '08h', count: 5 },
    { time: '09h', count: 12 },
    { time: '10h', count: 8 },
    { time: '11h', count: 14 },
    { time: '12h', count: 6 },
    { time: '13h', count: 9 },
    { time: '14h', count: 11 },
  ];

  // Subject Stats Calculation
  const subjectCounts: Record<string, { subjectName: string; categoryName: string; count: number }> = {};
  occurrences.forEach(occ => {
    if (!subjectCounts[occ.subjectId]) {
      subjectCounts[occ.subjectId] = {
        subjectName: occ.subjectName,
        categoryName: occ.categoryName,
        count: 0
      };
    }
    subjectCounts[occ.subjectId].count += occ.recurrenceCount;
  });

  const subjectStats = Object.values(subjectCounts)
    .sort((a, b) => b.count - a.count)
    .map(item => ({
      ...item,
      percentage: Math.round((item.count / (totalRecurrence || 1)) * 100)
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white flex items-center gap-2">
              Painel de Inteligência Operacional
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Monitoramento em tempo real do turno ativo, volume de ocorrências, assuntos recorrentes e taxa de resolução via Base de Conhecimento.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToOccurrences}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Ocorrência</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Atendimentos do Dia"
          value={totalToday}
          subtitle="Ocorrências registradas"
          trend={{ value: '+14%', isPositive: true }}
          icon={Headphones}
          color="indigo"
        />

        <MetricCard
          title="Tempo Médio (TMA)"
          value={`${avgDuration} min`}
          subtitle="Por atendimento"
          trend={{ value: '-8%', isPositive: true }}
          icon={Clock}
          color="emerald"
        />

        <MetricCard
          title="Total de Reincidências"
          value={totalRecurrence}
          subtitle="Volume de repetições"
          trend={{ value: '+22%', isPositive: false }}
          icon={RotateCcw}
          color="amber"
        />

        <MetricCard
          title="Resolvidos via KB"
          value={`${Math.round((kbResolvedCount / (totalToday || 1)) * 100)}%`}
          subtitle={`${kbResolvedCount} ocorrências`}
          trend={{ value: '+5%', isPositive: true }}
          icon={BookOpen}
          color="violet"
        />
      </div>

      {/* Charts & Top Widgets Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyVolumeChart data={hourlyData} />
        </div>
        <div>
          <TopSubjectsWidget subjects={subjectStats} />
        </div>
      </div>

      {/* Top Widgets Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopArticlesWidget 
            articles={articles.filter(a => a.status === 'publicado')} 
            onSelectArticle={(art) => {
              onNavigateToKB();
              onReadArticle(art);
            }} 
          />
        </div>
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Conformidade LGPD Ativa
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Todos os identificadores de clientes registrados no turno passam por algoritmo de hashing/mascaramento nativo antes de serem armazenados no banco de dados.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between font-mono">
              <span>Campos Estruturados:</span>
              <span className="text-emerald-400 font-semibold">100% Protegidos</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Políticas RLS:</span>
              <span className="text-indigo-400 font-semibold">Supabase Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
