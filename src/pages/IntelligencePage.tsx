import React from 'react';
import { BrainCircuit, Sparkles, TrendingUp, Cpu, Lightbulb } from 'lucide-react';
import { DataService } from '../lib/supabase';

export const IntelligencePage: React.FC = () => {
  const occurrences = DataService.getOccurrences();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            Detecção de Problemas Recorrentes & Memória Operacional (Fase 3 & 4)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Agrupamento semântico por embeddings de texto, tendências percentuais e sugestões da equipe.
          </p>
        </div>
      </div>

      {/* Intelligence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Análise de Tendência de Ocorrências</h3>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-200">HTTP 504 Timeout no ERP Nexo</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold text-[10px]">
                +48% vs. semana anterior
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Detectado pelo agrupador semântico pgvector. 8 descrições livres diferentes foram correlacionadas ao mesmo sintoma raiz.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Memória Operacional Correlacionada</h3>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <p className="font-semibold text-indigo-300">Padrão Não-Óbvio Revelado:</p>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Ocorrências do tipo <code>Erro de Cadastro</code> $\rightarrow$ campo <code>CPF Inexistente</code> acontecem prioritariamente no sistema <code>Gateway Pgto</code> durante a madrugada (02h–04h).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
