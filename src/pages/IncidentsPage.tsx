import React, { useState } from 'react';
import { 
  AlertOctagon, 
  BrainCircuit, 
  BellRing, 
  ShieldAlert, 
  CheckCircle2, 
  Plus,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { DataService } from '../lib/supabase';
import { Incident, IncidentSeverity } from '../lib/types';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Incident Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affectedSystem, setAffectedSystem] = useState('Gateway de Depósito');
  const [severity, setSeverity] = useState<IncidentSeverity>('media');
  const [notification, setNotification] = useState<string | null>(null);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      title,
      description,
      severity,
      status: 'em_analise',
      affectedSystem,
      startedAt: new Date().toISOString()
    };

    setIncidents([newInc, ...incidents]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setNotification(`Incidente "${newInc.title}" registrado e notificado ao escalonamento!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResolveIncident = (incId: string) => {
    setIncidents(incidents.map(inc => {
      if (inc.id === incId) {
        return { ...inc, status: 'resolvido', resolvedAt: new Date().toISOString() };
      }
      return inc;
    }));
  };

  const severityBadges: Record<IncidentSeverity, { label: string; color: string }> = {
    baixa: { label: 'Baixa', color: 'bg-slate-800 text-slate-300 border-slate-700' },
    media: { label: 'Média', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    alta: { label: 'Alta', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
    critica: { label: 'Crítica', color: 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/20' }
  };

  return (
    <div className="space-y-6 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            Módulo de Incidentes & Alertas de Escalonamento
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geração de incidentes críticos, regras de gatilhos automáticos e alertas para liderança.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Abrir Incidente Crítico</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Regra Ativa de Alerta Automático Card */}
      <div className="glass-panel rounded-2xl border border-indigo-500/30 p-6 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
              Gatilho Ativo de Detecção Automática
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              Regra: Categoria / Sintoma Crítico $\ge$ 5 chamados em 15 minutos
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Monitorando
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Se múltiplos atendentes registrarem o mesmo sintoma de instabilidade (ex: PIX fora do ar, Crash Games presas) na janela de monitoramento, a plataforma notifica os supervisores e escala o incidente.
        </p>
      </div>

      {/* Incidents Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Incidentes Ativos e SLA de Resolução</h3>

        {incidents.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">Nenhum incidente ativo no momento.</p>
            <p className="text-[11px] text-slate-500 mt-1">Todos os sistemas e gateways operando normalmente dentro dos SLAs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Código / Sistema</th>
                  <th className="py-3 px-4">Título do Incidente</th>
                  <th className="py-3 px-4">Severidade</th>
                  <th className="py-3 px-4">Horário de Início</th>
                  <th className="py-3 px-4 text-right">Status / Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                      {inc.id.toUpperCase()}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        {inc.affectedSystem}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {inc.title}
                      {inc.description && (
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5">{inc.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${severityBadges[inc.severity]?.color}`}>
                        {severityBadges[inc.severity]?.label.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(inc.startedAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inc.status === 'resolvido' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                          Resolvido
                        </span>
                      ) : (
                        <button
                          onClick={() => handleResolveIncident(inc.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                        >
                          Marcar Resolvido
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating New Incident */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Abrir Novo Incidente Crítico
            </h3>

            <form onSubmit={handleCreateIncident} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Título do Incidente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Instabilidade no Gateway de Depósito PIX..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Sistema Afetado</label>
                <select
                  value={affectedSystem}
                  onChange={(e) => setAffectedSystem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  <option value="Gateway de Depósito">Gateway de Depósito (PIX)</option>
                  <option value="Gateway de Saque">Gateway de Saque</option>
                  <option value="Provedor Cassino Slots">Provedor Cassino Slots</option>
                  <option value="Provedor Crash Games">Provedor Crash Games (Aviator/Spaceman)</option>
                  <option value="Gateway SMS 2FA">Gateway SMS 2FA</option>
                  <option value="ERP / Banco de Dados">ERP / Banco de Dados</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Severidade</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  <option value="baixa">Baixa (Pequena degradação)</option>
                  <option value="media">Média (Atraso parcial)</option>
                  <option value="alta">Alta (Falha de módulo principal)</option>
                  <option value="critica">Crítica (Queda total de sistema)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição e Instrução Operacional</label>
                <textarea
                  rows={3}
                  placeholder="Orientações para os atendentes enquanto a engenharia resolve..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-500/25"
                >
                  Publicar Incidente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
