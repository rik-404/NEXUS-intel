import React, { useState } from 'react';
import { DataService } from '../../lib/supabase';
import { maskSensitiveData, Occurrence } from '../../lib/types';
import { 
  PlusCircle, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface OccurrenceFormProps {
  onSuccess: (newOccurrence: Occurrence) => void;
}

export const OccurrenceForm: React.FC<OccurrenceFormProps> = ({ onSuccess }) => {
  const categories = DataService.getCategories();
  const articles = DataService.getArticles().filter(a => a.status === 'publicado');
  const currentUser = DataService.getCurrentUser();
  const activeShift = DataService.getActiveShift();

  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const subjects = DataService.getSubjects(categoryId);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const symptoms = DataService.getSymptoms(subjectId);
  const [symptomId, setSymptomId] = useState(symptoms[0]?.id || '');

  const [systemName, setSystemName] = useState('Portal Web');
  const [rawClientData, setRawClientData] = useState('');
  const [freeDescription, setFreeDescription] = useState('');
  const [recurrenceCount, setRecurrenceCount] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(3);
  const [resolvedKbId, setResolvedKbId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Update subject when category changes
  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const newSubjects = DataService.getSubjects(newCatId);
    if (newSubjects.length > 0) {
      setSubjectId(newSubjects[0].id);
      const newSymptoms = DataService.getSymptoms(newSubjects[0].id);
      setSymptomId(newSymptoms.length > 0 ? newSymptoms[0].id : '');
    } else {
      setSubjectId('');
      setSymptomId('');
    }
  };

  // Update symptom when subject changes
  const handleSubjectChange = (newSubId: string) => {
    setSubjectId(newSubId);
    const newSymptoms = DataService.getSymptoms(newSubId);
    setSymptomId(newSymptoms.length > 0 ? newSymptoms[0].id : '');
  };

  const maskedClientData = maskSensitiveData(rawClientData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !subjectId || !freeDescription.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    const categoryObj = categories.find(c => c.id === categoryId);
    const subjectObj = DataService.getSubjects().find(s => s.id === subjectId);
    const symptomObj = DataService.getSymptoms().find(s => s.id === symptomId);
    const kbObj = articles.find(a => a.id === resolvedKbId);

    const newOcc = DataService.createOccurrence({
      attendantId: currentUser?.id || 'usr-dev-admin',
      attendantName: currentUser?.fullName || 'Atendente',
      shiftId: activeShift?.id,
      categoryId,
      categoryName: categoryObj?.name || 'Geral',
      subjectId,
      subjectName: subjectObj?.name || 'Assunto',
      symptomId: symptomId || undefined,
      symptomTitle: symptomObj?.title,
      clientIdentifierMasked: maskedClientData || 'Não informado',
      systemName,
      freeDescription: freeDescription.trim(),
      recurrenceCount,
      durationSeconds: durationMinutes * 60,
      resolvedByKbArticleId: resolvedKbId || undefined,
      resolvedByKbArticleTitle: kbObj?.title
    });

    setIsSubmitting(false);
    setFreeDescription('');
    setRawClientData('');
    setRecurrenceCount(1);
    setResolvedKbId('');

    setNotification(`Ocorrência ${newOcc.protocolNumber} registrada com sucesso!`);
    setTimeout(() => setNotification(null), 4000);

    onSuccess(newOcc);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      {/* Accent glow top */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            Registrar Nova Ocorrência / Atendimento
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Preencha os dados do atendimento atual. O mascaramento LGPD é aplicado automaticamente.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-400">Atendente Responsável:</span>
          <p className="text-xs font-semibold text-indigo-300">{currentUser?.fullName || 'Atendente'}</p>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Cascading Selectors (Category, Subject, Symptom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. Categoria <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. Assunto Específico <span className="text-rose-400">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>3. Sintoma Padronizado (Fase 3)</span>
              <span className="text-[10px] text-indigo-400 font-mono">IA Ready</span>
            </label>
            <select
              value={symptomId}
              onChange={(e) => setSymptomId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">-- NENHUM / OUTRO SINTOMA --</option>
              {symptoms.map((sym) => (
                <option key={sym.id} value={sym.id}>
                  [{sym.code}] {sym.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: System, LGPD Masked Identifier, Duration & Recurrence */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sistema Envolvido
            </label>
            <select
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Portal Web">Portal Web</option>
              <option value="App Mobile">App Mobile</option>
              <option value="ERP Nexo">ERP Nexo</option>
              <option value="Gateway Pgto">Gateway Pgto</option>
              <option value="API Externa">API Externa</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ID Cliente (LGPD Auto-Mask)
            </label>
            <input
              type="text"
              placeholder="Digite CPF ou E-mail..."
              value={rawClientData}
              onChange={(e) => setRawClientData(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            {rawClientData && (
              <p className="text-[10px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
                <span>Guardado:</span> <strong>{maskedClientData}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              Reincidência / Qtd.
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={recurrenceCount}
              onChange={(e) => setRecurrenceCount(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Duração Estimada (min)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Row 3: Free Text Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Descrição Livre do Problema / Relato do Cliente <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={3}
            value={freeDescription}
            onChange={(e) => setFreeDescription(e.target.value)}
            placeholder="Descreva detalhadamente o problema relatado pelo cliente, sintomas observados e passos realizados para solução..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed placeholder:text-slate-500"
            required
          ></textarea>
        </div>

        {/* Row 4: Close the loop (Resolved by KB Article?) */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-200">Fechar Loop Artigo $\rightarrow$ Resultado</p>
              <p className="text-[11px] text-indigo-300/70">
                Se este atendimento foi solucionado utilizando um procedimento da Base de Conhecimento, selecione-o abaixo:
              </p>
            </div>
          </div>

          <select
            value={resolvedKbId}
            onChange={(e) => setResolvedKbId(e.target.value)}
            className="w-full sm:w-72 bg-slate-900 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- NÃO UTILIZOU ARTIGO KB --</option>
            {articles.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.slug} ({a.categoryName})
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Salvando...' : 'Salvar e Registrar Ocorrência'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
