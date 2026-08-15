import React from 'react';
import { AlertOctagon, BrainCircuit, BellRing, ShieldAlert, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { DataService } from '../lib/supabase';

export const IncidentsPage: React.FC = () => {
  const occurrences = DataService.getOccurrences();

  const mockIncidents = [
    {
      id: 'inc-1',
      code: 'INC-2026-004',
      title: 'HTTP 504 Gateway Timeout na Busca de Pedidos ERP',
      severity: 'alta',
      status: 'em_analise',
      occurrenceCount: 8,
      symptomCode: 'ERR_ERP_TIMEOUT_504',
      slaExpiresAt: '2026-08-15T11:00:00Z',
      createdAt: '2026-08-15T09:10:00Z',
      assignedSupervisor: 'Roberto Andrade'
    },
    {
      id: 'inc-2',
      code: 'INC-2026-003',
      title: 'PIX Processado sem Retorno de Webhook Bancário',
      severity: 'media',
      status: 'resolvido',
      occurrenceCount: 4,
      symptomCode: 'ERR_PIX_PENDING',
      slaExpiresAt: '2026-08-15T12:00:00Z',
      createdAt: '2026-08-15T08:40:00Z',
      assignedSupervisor: 'Roberto Andrade'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            Módulo de Incidentes & Alertas de Escalonamento (Fase 3)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geração de incidentes automáticos por gatilhos de sintomas recorrentes e SLAs de resolução.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5" />
            <span>Escalonamento Ativo</span>
          </span>
        </div>
      </div>

      {/* Regra Ativa de Alerta Automático Card */}
      <div className="glass-panel rounded-2xl border border-indigo-500/30 p-6 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
              Gatilho Ativo de Detecção Automática
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              Regra: Sintoma Padronizado $\ge$ 5 ocorrências em 15 minutos
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
            Monitorando
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Se N atendentes reportarem o mesmo sintoma padronizado dentro da janela configurada, o sistema notifica o supervisor e abre um incidente automaticamente com SLA atrelado.
        </p>
      </div>

      {/* Incidents Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Incidentes Gerados e Status de SLA</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Título do Incidente</th>
                <th className="py-3 px-4">Severidade</th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">Responsável</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                    {inc.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {inc.title}
                    <span className="block text-[10px] font-mono text-slate-400">
                      Sintoma: {inc.symptomCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'alta' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {inc.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-300">
                    {inc.occurrenceCount} chamados
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {inc.assignedSupervisor}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      inc.status === 'em_analise'
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {inc.status === 'em_analise' ? 'Em Análise' : 'Resolvido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
