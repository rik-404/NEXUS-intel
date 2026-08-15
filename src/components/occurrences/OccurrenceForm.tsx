import React, { useState } from 'react';
import { DataService } from '../../lib/supabase';
import { Occurrence } from '../../lib/types';
import { 
  PlusCircle, 
  CheckCircle2, 
  Sparkles,
  Layers,
  FileQuestion,
  Hash
} from 'lucide-react';

interface OccurrenceFormProps {
  onSuccess: (newOccurrence: Occurrence) => void;
}

export const OccurrenceForm: React.FC<OccurrenceFormProps> = ({ onSuccess }) => {
  const categories = DataService.getCategories();
  const currentUser = DataService.getCurrentUser();
  const activeShift = DataService.getActiveShift();

  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const subjects = DataService.getSubjects(categoryId);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [recurrenceCount, setRecurrenceCount] = useState(1);
  const [freeDescription, setFreeDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Handle category change
  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const newSubjects = DataService.getSubjects(newCatId);
    if (newSubjects.length > 0) {
      setSubjectId(newSubjects[0].id);
    } else {
      setSubjectId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert('Por favor, selecione a Categoria.');
      return;
    }

    setIsSubmitting(true);

    const categoryObj = categories.find(c => c.id === categoryId);
    const subjectObj = DataService.getSubjects().find(s => s.id === subjectId);
    const finalSubjectName = customSubjectName.trim() || subjectObj?.name || 'Assunto Geral';

    const newOcc = DataService.createOccurrence({
      attendantId: currentUser?.id || 'usr-dev-admin',
      attendantName: currentUser?.fullName || 'Atendente',
      shiftId: activeShift?.id,
      categoryId,
      categoryName: categoryObj?.name || 'Bônus e Promoções',
      subjectId: subjectId || 'sub-1',
      subjectName: finalSubjectName,
      clientIdentifierMasked: 'Atendimento por Lote',
      systemName: 'Portal Web',
      freeDescription: freeDescription.trim() || `Registro de ${recurrenceCount} atendimento(s) - ${categoryObj?.name}: ${finalSubjectName}`,
      recurrenceCount: Number(recurrenceCount) || 1,
      durationSeconds: 180
    });

    setIsSubmitting(false);
    setCustomSubjectName('');
    setFreeDescription('');
    setRecurrenceCount(1);

    setNotification(`Atendimento registrado com sucesso! (${newOcc.protocolNumber} - ${categoryObj?.name})`);
    setTimeout(() => setNotification(null), 4000);

    onSuccess(newOcc);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden bg-slate-900/90 backdrop-blur-xl">
      {/* Glow effect */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            Registrar Atendimento / Ocorrência
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecione a categoria, assunto específico e quantidade para o relatório por hora.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-400">Atendente Responsável:</span>
          <p className="text-xs font-semibold text-indigo-300">{currentUser?.fullName || 'Atendente'}</p>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Categoria * */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              1. Categoria <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Assunto Específico * */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5 text-indigo-400" />
              2. Assunto Específico <span className="text-rose-400">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              <option value="OUTRO">-- Digitar Outro Assunto --</option>
            </select>

            {subjectId === 'OUTRO' && (
              <input
                type="text"
                placeholder="Escreva o assunto específico..."
                value={customSubjectName}
                onChange={(e) => setCustomSubjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 mt-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            )}
          </div>

          {/* 3. Quantidade * */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              3. Quantidade <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              required
              value={recurrenceCount}
              onChange={(e) => setRecurrenceCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Observações livres opcionais */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Observação / Detalhe Adicional (Opcional)
          </label>
          <textarea
            rows={2}
            value={freeDescription}
            onChange={(e) => setFreeDescription(e.target.value)}
            placeholder="Relato opcional sobre o atendimento..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
          ></textarea>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Registrando...' : 'Salvar Atendimento'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
