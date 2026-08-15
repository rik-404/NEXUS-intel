import React from 'react';
import { Occurrence } from '../../lib/types';
import { X, ShieldCheck, Clock, RotateCcw, BookOpen, User, Server } from 'lucide-react';

interface OccurrenceDetailModalProps {
  occurrence: Occurrence | null;
  onClose: () => void;
}

export const OccurrenceDetailModal: React.FC<OccurrenceDetailModalProps> = ({ occurrence, onClose }) => {
  if (!occurrence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <span className="font-mono text-indigo-400 font-bold text-xs">#OC</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Protocolo: {occurrence.protocolNumber}
              </h3>
              <p className="text-xs text-slate-400">
                Registrado em {new Date(occurrence.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-xs text-slate-300">
          {/* Categorização grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Categoria</span>
              <p className="font-medium text-slate-200 mt-0.5">{occurrence.categoryName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Assunto</span>
              <p className="font-medium text-slate-200 mt-0.5">{occurrence.subjectName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Sistema</span>
              <p className="font-medium text-slate-200 mt-0.5 flex items-center gap-1">
                <Server className="w-3 h-3 text-sky-400" />
                {occurrence.systemName}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Atendente</span>
              <p className="font-medium text-slate-200 mt-0.5 flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-400" />
                {occurrence.attendantName}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Reincidência</span>
              <p className="font-medium text-amber-300 mt-0.5 flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-amber-400" />
                {occurrence.recurrenceCount}x relatado
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Duração</span>
              <p className="font-medium text-slate-200 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {Math.round(occurrence.durationSeconds / 60)} min
              </p>
            </div>
          </div>

          {/* Sintoma Padronizado */}
          {occurrence.symptomTitle && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                Sintoma Padronizado (IA Ready)
              </span>
              <p className="font-semibold text-indigo-200 mt-0.5">{occurrence.symptomTitle}</p>
            </div>
          )}

          {/* LGPD Data */}
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-semibold">Identificador de Cliente (Protegido LGPD):</span>
              <p className="font-mono font-bold text-xs">{occurrence.clientIdentifierMasked}</p>
            </div>
          </div>

          {/* Free Description */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1">Descrição Livre do Atendimento:</span>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans text-xs whitespace-pre-wrap">
              {occurrence.freeDescription}
            </div>
          </div>

          {/* KB Resolution link */}
          {occurrence.resolvedByKbArticleTitle && (
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center space-x-3">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-indigo-300 uppercase font-semibold block">Resolvido via Base de Conhecimento</span>
                <p className="font-medium text-indigo-100">{occurrence.resolvedByKbArticleTitle}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
