import React, { useState } from 'react';
import { Clock3, AlertTriangle, Send, CheckCircle2, User } from 'lucide-react';
import { DataService } from '../lib/supabase';
import { ShiftHandover } from '../lib/types';

export const ShiftsPage: React.FC = () => {
  const activeShift = DataService.getActiveShift();
  const currentUser = DataService.getCurrentUser();

  const [handovers, setHandovers] = useState<ShiftHandover[]>([
    {
      id: 'ho-1',
      shiftId: 'shift-1',
      shiftTitle: 'Turno Manhã (07h às 15h)',
      authorId: 'usr-3',
      authorName: 'Roberto Andrade (Supervisor)',
      pendingTasks: 'Acompanhar liberação da API do banco parceiro no período da tarde.',
      shiftAlerts: 'Instabilidade intermitente de timeout no ERP Nexo entre 09h e 10h.',
      observations: 'Equipe do turno respondeu bem, 92% das dúvidas resolvidas via KB.',
      createdAt: '2026-08-15T07:10:00Z'
    }
  ]);

  const [pendingTasks, setPendingTasks] = useState('');
  const [shiftAlerts, setShiftAlerts] = useState('');
  const [observations, setObservations] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingTasks.trim() && !shiftAlerts.trim()) return;

    const newHandover: ShiftHandover = {
      id: `ho-${Date.now()}`,
      shiftId: activeShift?.id || 'shift-1',
      shiftTitle: activeShift?.title || 'Turno Atual',
      authorId: currentUser?.id || 'usr-dev-admin',
      authorName: currentUser ? `${currentUser.fullName} (${currentUser.role.toUpperCase()})` : 'Supervisor',
      pendingTasks,
      shiftAlerts,
      observations,
      createdAt: new Date().toISOString()
    };

    setHandovers([newHandover, ...handovers]);
    setPendingTasks('');
    setShiftAlerts('');
    setObservations('');
    setNotification('Passagem de turno registrada com sucesso para o próximo supervisor!');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Clock3 className="w-5 h-5 text-indigo-400" />
            Passagem de Turno Operacional (Fase 2)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro de pendências, alertas críticos e observações gerais para a equipe do próximo turno.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Turno Ativo: <strong>{activeShift?.title}</strong></span>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Form: Registrar Passagem de Turno */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Registrar Observações do Turno Atual</h3>

        <form onSubmit={handleSubmitHandover} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Pendências para o Próximo Turno
            </label>
            <textarea
              rows={2}
              value={pendingTasks}
              onChange={(e) => setPendingTasks(e.target.value)}
              placeholder="Ex: Cliente XYZ aguarda retorno de e-mail sobre estorno PIX..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Alertas de Sistemas / Incidentes do Turno
            </label>
            <textarea
              rows={2}
              value={shiftAlerts}
              onChange={(e) => setShiftAlerts(e.target.value)}
              placeholder="Ex: Atenção com instabilidade no ERP entre 14h e 16h..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Observações Gerais do Supervisor
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Desempenho excelente da equipe, sem acúmulo de fila."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Publicar Passagem de Turno</span>
            </button>
          </div>
        </form>
      </div>

      {/* History timeline of handovers */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Histórico de Passagens de Turno</h3>

        <div className="space-y-4">
          {handovers.map((ho) => (
            <div key={ho.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-slate-200">{ho.authorName}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(ho.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>

              {ho.shiftAlerts && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                  <strong>⚠️ Alerta de Turno:</strong> {ho.shiftAlerts}
                </div>
              )}

              {ho.pendingTasks && (
                <div>
                  <strong className="text-slate-300">📌 Pendências:</strong> {ho.pendingTasks}
                </div>
              )}

              {ho.observations && (
                <div className="text-slate-400">
                  <strong className="text-slate-300">💬 Observações:</strong> {ho.observations}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
